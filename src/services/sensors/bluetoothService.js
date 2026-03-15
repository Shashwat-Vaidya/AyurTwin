import { Platform, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import * as Location from 'expo-location';

class BluetoothService {
  constructor() {
    this.manager = new BleManager();
    this.device = null;
    this.connected = false;
    this.scanning = false;
    this.devices = new Map();
    this.listeners = new Map();
    this.characteristics = new Map();
    
    // Service and characteristic UUIDs for AyurTwin devices
    this.SERVICE_UUIDS = {
      deviceInfo: '180A',
      battery: '180F',
      healthData: '12345678-1234-5678-1234-56789ABCDEF0',
    };
    
    this.CHARACTERISTIC_UUIDS = {
      manufacturer: '2A29',
      model: '2A24',
      serial: '2A25',
      firmware: '2A26',
      battery: '2A19',
      heartRate: '12345678-1234-5678-1234-56789ABCDEF1',
      spo2: '12345678-1234-5678-1234-56789ABCDEF2',
      temperature: '12345678-1234-5678-1234-56789ABCDEF3',
      stress: '12345678-1234-5678-1234-56789ABCDEF4',
      activity: '12345678-1234-5678-1234-56789ABCDEF5',
    };
  }

  async requestPermissions() {
    if (Platform.OS === 'ios') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      return (
        granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  async requestLocationPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async startScan(onDeviceFound, onError) {
    if (this.scanning) return;

    const permissionsGranted = await this.requestPermissions();
    if (!permissionsGranted) {
      onError?.('Bluetooth permissions not granted');
      return;
    }

    const locationGranted = await this.requestLocationPermission();
    if (!locationGranted) {
      onError?.('Location permission required for Bluetooth scanning');
      return;
    }

    this.scanning = true;
    this.devices.clear();

    this.manager.startDeviceScan(
      null,
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          this.scanning = false;
          onError?.(error.message);
          return;
        }

        if (device && device.name && device.name.includes('AyurTwin')) {
          if (!this.devices.has(device.id)) {
            this.devices.set(device.id, {
              id: device.id,
              name: device.name,
              rssi: device.rssi,
              manufacturerData: device.manufacturerData,
              serviceData: device.serviceData,
              serviceUUIDs: device.serviceUUIDs,
            });
            onDeviceFound?.(this.devices.get(device.id));
          }
        }
      }
    );
  }

  stopScan() {
    if (this.scanning) {
      this.manager.stopDeviceScan();
      this.scanning = false;
    }
  }

  async connectToDevice(deviceId, onConnected, onDisconnected, onError) {
    try {
      const device = this.manager.getDevice(deviceId);
      if (!device) {
        throw new Error('Device not found');
      }

      this.stopScan();

      const connectedDevice = await device.connect();
      this.device = connectedDevice;

      await this.device.discoverAllServicesAndCharacteristics();
      this.connected = true;

      // Set up disconnection listener
      this.device.onDisconnected((error, disconnectedDevice) => {
        this.connected = false;
        this.device = null;
        onDisconnected?.(error);
      });

      // Discover characteristics
      await this.discoverCharacteristics();

      onConnected?.(this.device);
      return this.device;
    } catch (error) {
      onError?.(error.message);
      throw error;
    }
  }

  async discoverCharacteristics() {
    const services = await this.device.services();
    
    for (const service of services) {
      const characteristics = await service.characteristics();
      for (const characteristic of characteristics) {
        const key = this.getCharacteristicKey(characteristic.uuid);
        if (key) {
          this.characteristics.set(key, characteristic);
        }
      }
    }
  }

  getCharacteristicKey(uuid) {
    const normalizedUuid = uuid.toLowerCase();
    for (const [key, value] of Object.entries(this.CHARACTERISTIC_UUIDS)) {
      if (normalizedUuid.includes(value.toLowerCase())) {
        return key;
      }
    }
    return null;
  }

  async disconnectDevice() {
    if (this.device && this.connected) {
      await this.device.cancelConnection();
      this.device = null;
      this.connected = false;
      this.characteristics.clear();
    }
  }

  async readCharacteristic(characteristicKey) {
    const characteristic = this.characteristics.get(characteristicKey);
    if (!characteristic) {
      throw new Error(`Characteristic ${characteristicKey} not found`);
    }

    const result = await characteristic.read();
    return this.parseCharacteristicValue(characteristicKey, result.value);
  }

  async writeCharacteristic(characteristicKey, value) {
    const characteristic = this.characteristics.get(characteristicKey);
    if (!characteristic) {
      throw new Error(`Characteristic ${characteristicKey} not found`);
    }

    const encodedValue = this.encodeCharacteristicValue(characteristicKey, value);
    await characteristic.writeWithResponse(encodedValue);
  }

  async subscribeToCharacteristic(characteristicKey, onData, onError) {
    const characteristic = this.characteristics.get(characteristicKey);
    if (!characteristic) {
      onError?.(`Characteristic ${characteristicKey} not found`);
      return;
    }

    characteristic.monitor((error, result) => {
      if (error) {
        onError?.(error.message);
        return;
      }

      const value = this.parseCharacteristicValue(characteristicKey, result.value);
      onData?.(value);
    });
  }

  parseCharacteristicValue(key, value) {
    if (!value) return null;

    const buffer = Buffer.from(value, 'base64');
    
    switch (key) {
      case 'heartRate':
        return {
          value: buffer.readUInt16LE(0),
          unit: 'bpm',
          timestamp: Date.now(),
        };
      
      case 'spo2':
        return {
          value: buffer.readUInt8(0),
          unit: '%',
          timestamp: Date.now(),
        };
      
      case 'temperature':
        return {
          value: buffer.readFloatLE(0),
          unit: '°C',
          timestamp: Date.now(),
        };
      
      case 'stress':
        return {
          value: buffer.readUInt8(0),
          unit: '',
          timestamp: Date.now(),
        };
      
      case 'activity':
        return {
          steps: buffer.readUInt32LE(0),
          calories: buffer.readUInt16LE(4),
          distance: buffer.readFloatLE(6),
          timestamp: Date.now(),
        };
      
      case 'battery':
        return {
          level: buffer.readUInt8(0),
          timestamp: Date.now(),
        };
      
      default:
        return buffer.toString('utf8');
    }
  }

  encodeCharacteristicValue(key, value) {
    switch (key) {
      case 'heartRate':
        const buffer = Buffer.alloc(2);
        buffer.writeUInt16LE(value);
        return buffer.toString('base64');
      
      default:
        return Buffer.from(JSON.stringify(value)).toString('base64');
    }
  }

  async getDeviceInfo() {
    try {
      const manufacturer = await this.readCharacteristic('manufacturer');
      const model = await this.readCharacteristic('model');
      const serial = await this.readCharacteristic('serial');
      const firmware = await this.readCharacteristic('firmware');
      const battery = await this.readCharacteristic('battery');

      return {
        manufacturer,
        model,
        serial,
        firmware,
        battery,
      };
    } catch (error) {
      console.error('Error getting device info:', error);
      return null;
    }
  }

  async startHealthMonitoring(onHealthData, onError) {
    try {
      // Subscribe to all health characteristics
      await this.subscribeToCharacteristic('heartRate', (data) => {
        onHealthData?.('heartRate', data);
      }, onError);

      await this.subscribeToCharacteristic('spo2', (data) => {
        onHealthData?.('spo2', data);
      }, onError);

      await this.subscribeToCharacteristic('temperature', (data) => {
        onHealthData?.('temperature', data);
      }, onError);

      await this.subscribeToCharacteristic('stress', (data) => {
        onHealthData?.('stress', data);
      }, onError);

      await this.subscribeToCharacteristic('activity', (data) => {
        onHealthData?.('activity', data);
      }, onError);

      return true;
    } catch (error) {
      onError?.(error.message);
      return false;
    }
  }

  async stopHealthMonitoring() {
    // Unsubscribe logic here
    this.characteristics.clear();
  }

  isConnected() {
    return this.connected;
  }

  getConnectedDevice() {
    return this.device ? {
      id: this.device.id,
      name: this.device.name,
    } : null;
  }

  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event).filter(cb => cb !== callback);
      this.listeners.set(event, listeners);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  destroy() {
    this.stopScan();
    this.disconnectDevice();
    this.manager.destroy();
    this.listeners.clear();
  }
}

export default new BluetoothService();