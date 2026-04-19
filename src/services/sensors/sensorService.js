import { Platform } from 'react-native';
import * as Sensors from 'expo-sensors';
import { Subscription } from 'expo-sensors';

import bluetoothService from './bluetoothService';
import sensorDataParser from './sensorDataParser';
import storageService from '../storage/asyncStorage';
import websocketService from './websocketService';

class SensorService {
  constructor() {
    this.accelerometerSubscription = null;
    this.gyroscopeSubscription = null;
    this.magnetometerSubscription = null;
    this.barometerSubscription = null;
    this.pedometerSubscription = null;
    this.deviceMotionSubscription = null;
    
    this.isMonitoring = false;
    this.sensorData = {
      accelerometer: { x: 0, y: 0, z: 0 },
      gyroscope: { x: 0, y: 0, z: 0 },
      magnetometer: { x: 0, y: 0, z: 0 },
      barometer: { pressure: 0, relativeAltitude: 0 },
      pedometer: { steps: 0, distance: 0 },
      deviceMotion: { rotation: {}, acceleration: {} },
    };
    
    this.listeners = new Map();
    this.dataBuffer = [];
    this.bufferSize = 100;
    this.syncInterval = null;
    
    // Configure sensor update intervals (in ms)
    this.updateIntervals = {
      accelerometer: 100, // 10 Hz
      gyroscope: 100,
      magnetometer: 100,
      barometer: 1000, // 1 Hz
      pedometer: 1000,
      deviceMotion: 100,
    };
  }

  async initialize() {
    // Set update intervals
    Sensors.Accelerometer.setUpdateInterval(this.updateIntervals.accelerometer);
    Sensors.Gyroscope.setUpdateInterval(this.updateIntervals.gyroscope);
    Sensors.Magnetometer.setUpdateInterval(this.updateIntervals.magnetometer);
    Sensors.Barometer.setUpdateInterval(this.updateIntervals.barometer);
    Sensors.DeviceMotion.setUpdateInterval(this.updateIntervals.deviceMotion);
    
    // Start periodic sync
    this.startPeriodicSync();
  }

  // Accelerometer methods
  startAccelerometer(callback) {
    this.accelerometerSubscription = Sensors.Accelerometer.addListener(data => {
      this.sensorData.accelerometer = data;
      this.addToBuffer('accelerometer', data);
      this.emit('accelerometer', data);
      callback?.(data);
    });
  }

  stopAccelerometer() {
    if (this.accelerometerSubscription) {
      this.accelerometerSubscription.remove();
      this.accelerometerSubscription = null;
    }
  }

  // Gyroscope methods
  startGyroscope(callback) {
    this.gyroscopeSubscription = Sensors.Gyroscope.addListener(data => {
      this.sensorData.gyroscope = data;
      this.addToBuffer('gyroscope', data);
      this.emit('gyroscope', data);
      callback?.(data);
    });
  }

  stopGyroscope() {
    if (this.gyroscopeSubscription) {
      this.gyroscopeSubscription.remove();
      this.gyroscopeSubscription = null;
    }
  }

  // Magnetometer methods
  startMagnetometer(callback) {
    this.magnetometerSubscription = Sensors.Magnetometer.addListener(data => {
      this.sensorData.magnetometer = data;
      this.addToBuffer('magnetometer', data);
      this.emit('magnetometer', data);
      callback?.(data);
    });
  }

  stopMagnetometer() {
    if (this.magnetometerSubscription) {
      this.magnetometerSubscription.remove();
      this.magnetometerSubscription = null;
    }
  }

  // Barometer methods
  startBarometer(callback) {
    this.barometerSubscription = Sensors.Barometer.addListener(data => {
      this.sensorData.barometer = data;
      this.addToBuffer('barometer', data);
      this.emit('barometer', data);
      callback?.(data);
    });
  }

  stopBarometer() {
    if (this.barometerSubscription) {
      this.barometerSubscription.remove();
      this.barometerSubscription = null;
    }
  }

  // Pedometer methods
  async startPedometer(callback) {
    const isAvailable = await Sensors.Pedometer.isAvailableAsync();
    if (!isAvailable) {
      console.log('Pedometer not available');
      return;
    }

    this.pedometerSubscription = Sensors.Pedometer.watchStepCount(data => {
      this.sensorData.pedometer.steps += data.steps;
      this.sensorData.pedometer.distance = this.calculateDistance(this.sensorData.pedometer.steps);
      this.addToBuffer('pedometer', data);
      this.emit('pedometer', data);
      callback?.(data);
    });
  }

  stopPedometer() {
    if (this.pedometerSubscription) {
      this.pedometerSubscription.remove();
      this.pedometerSubscription = null;
    }
  }

  // Device Motion methods
  startDeviceMotion(callback) {
    this.deviceMotionSubscription = Sensors.DeviceMotion.addListener(data => {
      this.sensorData.deviceMotion = data;
      this.addToBuffer('deviceMotion', data);
      this.emit('deviceMotion', data);
      callback?.(data);
    });
  }

  stopDeviceMotion() {
    if (this.deviceMotionSubscription) {
      this.deviceMotionSubscription.remove();
      this.deviceMotionSubscription = null;
    }
  }

  // Start all sensors
  startAllSensors(callbacks = {}) {
    this.startAccelerometer(callbacks.accelerometer);
    this.startGyroscope(callbacks.gyroscope);
    this.startMagnetometer(callbacks.magnetometer);
    this.startBarometer(callbacks.barometer);
    this.startPedometer(callbacks.pedometer);
    this.startDeviceMotion(callbacks.deviceMotion);
    this.isMonitoring = true;
  }

  // Stop all sensors
  stopAllSensors() {
    this.stopAccelerometer();
    this.stopGyroscope();
    this.stopMagnetometer();
    this.stopBarometer();
    this.stopPedometer();
    this.stopDeviceMotion();
    this.isMonitoring = false;
  }

  // Get current sensor data
  getSensorData() {
    return { ...this.sensorData };
  }

  // Get specific sensor data
  getAccelerometerData() {
    return this.sensorData.accelerometer;
  }

  getGyroscopeData() {
    return this.sensorData.gyroscope;
  }

  getMagnetometerData() {
    return this.sensorData.magnetometer;
  }

  getBarometerData() {
    return this.sensorData.barometer;
  }

  getPedometerData() {
    return this.sensorData.pedometer;
  }

  getDeviceMotionData() {
    return this.sensorData.deviceMotion;
  }

  // Data buffer management
  addToBuffer(type, data) {
    this.dataBuffer.push({
      type,
      data,
      timestamp: Date.now(),
    });

    if (this.dataBuffer.length > this.bufferSize) {
      this.dataBuffer.shift();
    }
  }

  getBuffer() {
    return [...this.dataBuffer];
  }

  clearBuffer() {
    this.dataBuffer = [];
  }

  // Data analysis methods
  calculateSteps(accelerometerData) {
    // Simple step detection algorithm
    // In production, use more sophisticated algorithm
    const magnitude = Math.sqrt(
      accelerometerData.x ** 2 +
      accelerometerData.y ** 2 +
      accelerometerData.z ** 2
    );
    
    // Detect peaks in acceleration magnitude
    // This is a simplified version
    return magnitude > 1.2 ? 1 : 0;
  }

  calculateDistance(steps, strideLength = 0.75) {
    // Average stride length in meters
    return steps * strideLength;
  }

  calculateCalories(steps, weight = 70) {
    // Rough estimate: 0.04 calories per step per kg
    return steps * 0.04 * weight;
  }

  calculateActivityLevel(accelerometerData) {
    const magnitude = Math.sqrt(
      accelerometerData.x ** 2 +
      accelerometerData.y ** 2 +
      accelerometerData.z ** 2
    );

    if (magnitude < 1.1) return 'resting';
    if (magnitude < 1.5) return 'light';
    if (magnitude < 2.0) return 'moderate';
    return 'active';
  }

  calculateSleepQuality(accelerometerData, gyroscopeData) {
    // Analyze movement patterns during sleep
    // This is a simplified version
    const movement = Math.sqrt(
      accelerometerData.x ** 2 +
      accelerometerData.y ** 2 +
      accelerometerData.z ** 2 +
      gyroscopeData.x ** 2 +
      gyroscopeData.y ** 2 +
      gyroscopeData.z ** 2
    );

    if (movement < 0.5) return 'deep';
    if (movement < 1.0) return 'light';
    return 'awake';
  }

  // Bluetooth device integration
  async connectToDevice(deviceId) {
    return await bluetoothService.connectToDevice(deviceId);
  }

  async disconnectDevice() {
    return await bluetoothService.disconnectDevice();
  }

  async getDeviceData() {
    return await bluetoothService.getDeviceInfo();
  }

  // Data sync
  startPeriodicSync(interval = 60000) { // Default 1 minute
    this.syncInterval = setInterval(() => {
      this.syncData();
    }, interval);
  }

  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async syncData() {
    if (this.dataBuffer.length === 0) return;

    const data = {
      sensorData: this.getSensorData(),
      buffer: this.getBuffer(),
      timestamp: Date.now(),
    };

    // Store locally
    await storageService.appendHealthReading(data);

    // Send to server if connected
    if (bluetoothService.isConnected()) {
      websocketService.send('sensor_data', data);
    }

    this.clearBuffer();
  }

  // Event handling
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
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

  // Cleanup
  cleanup() {
    this.stopAllSensors();
    this.stopPeriodicSync();
    this.listeners.clear();
    this.clearBuffer();
  }

  // Check sensor availability
  async isSensorAvailable(sensorType) {
    switch(sensorType) {
      case 'accelerometer':
        return await Sensors.Accelerometer.isAvailableAsync();
      case 'gyroscope':
        return await Sensors.Gyroscope.isAvailableAsync();
      case 'magnetometer':
        return await Sensors.Magnetometer.isAvailableAsync();
      case 'barometer':
        return await Sensors.Barometer.isAvailableAsync();
      case 'pedometer':
        return await Sensors.Pedometer.isAvailableAsync();
      case 'deviceMotion':
        return await Sensors.DeviceMotion.isAvailableAsync();
      default:
        return false;
    }
  }

  // Get sensor permissions
  async requestPermissions() {
    // Most sensors don't require permissions
    // Pedometer might require motion permissions on iOS
    if (Platform.OS === 'ios') {
      const status = await Sensors.Pedometer.requestPermissionsAsync();
      return status === 'granted';
    }
    return true;
  }
}

export default new SensorService();