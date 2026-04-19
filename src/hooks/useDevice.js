import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as Network from 'expo-network';
import * as Battery from 'expo-battery';

// import bluetoothService from '../services/sensors/bluetoothService';
import storageService from '../services/storage/asyncStorage';

export const useDevice = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    brand: null,
    modelName: null,
    osVersion: null,
    platform: Platform.OS,
    appVersion: null,
    buildNumber: null,
  });

  const [networkInfo, setNetworkInfo] = useState({
    isConnected: false,
    type: null,
    ipAddress: null,
  });

  const [batteryInfo, setBatteryInfo] = useState({
    level: null,
    isCharging: false,
    lowPowerMode: false,
  });

  const [bluetoothInfo, setBluetoothInfo] = useState({
    isAvailable: false,
    isEnabled: false,
    connectedDevice: null,
  });

  // Load device info on mount
  useEffect(() => {
    loadDeviceInfo();
    loadNetworkInfo();
    loadBatteryInfo();
    loadBluetoothInfo();

    // Battery listeners
    const batteryListener = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryInfo(prev => ({ ...prev, level: batteryLevel }));
    });

    const chargingListener = Battery.addBatteryStateListener(({ batteryState }) => {
      setBatteryInfo(prev => ({ 
        ...prev, 
        isCharging: batteryState === Battery.BatteryState.CHARGING 
      }));
    });

    return () => {
      batteryListener?.remove();
      chargingListener?.remove();
    };
  }, []);

  // Load device information
  const loadDeviceInfo = useCallback(async () => {
    try {
      const appVersion = Application.nativeApplicationVersion;
      const buildNumber = Application.nativeBuildVersion;

      setDeviceInfo({
        brand: Device.brand,
        modelName: Device.modelName,
        osVersion: Device.osVersion,
        platform: Platform.OS,
        appVersion,
        buildNumber,
      });
    } catch (error) {
      console.error('Error loading device info:', error);
    }
  }, []);

  // Load network information
  const loadNetworkInfo = useCallback(async () => {
    try {
      const [networkState, ipAddress] = await Promise.all([
        Network.getNetworkStateAsync(),
        Network.getIpAddressAsync(),
      ]);

      setNetworkInfo({
        isConnected: networkState.isConnected,
        type: networkState.type,
        ipAddress,
      });
    } catch (error) {
      console.error('Error loading network info:', error);
    }
  }, []);

  // Load battery information
  const loadBatteryInfo = useCallback(async () => {
    try {
      const [batteryLevel, batteryState] = await Promise.all([
        Battery.getBatteryLevelAsync(),
        Battery.getBatteryStateAsync(),
      ]);

      setBatteryInfo({
        level: batteryLevel,
        isCharging: batteryState === Battery.BatteryState.CHARGING,
        lowPowerMode: batteryLevel < 0.2 && batteryState !== Battery.BatteryState.CHARGING,
      });
    } catch (error) {
      console.error('Error loading battery info:', error);
    }
  }, []);

  // Load bluetooth information
  const loadBluetoothInfo = useCallback(async () => {
    try {
      // Bluetooth not supported in Expo Go
      setBluetoothInfo({
        isAvailable: false,
        isEnabled: false,
        connectedDevice: null,
      });
    } catch (error) {
      console.error('Error loading bluetooth info:', error);
    }
  }, []);

  // Save device info to storage
  const saveDeviceInfo = useCallback(async () => {
    try {
      await storageService.setDevice(deviceInfo);
    } catch (error) {
      console.error('Error saving device info:', error);
    }
  }, [deviceInfo]);

  // Check if device has required features
  const hasFeature = useCallback((feature) => {
    switch(feature) {
      case 'bluetooth':
        return bluetoothInfo.isAvailable;
      case 'network':
        return networkInfo.isConnected;
      case 'battery':
        return true;
      default:
        return false;
    }
  }, [bluetoothInfo.isAvailable, networkInfo.isConnected]);

  // Get device metrics
  const getDeviceMetrics = useCallback(() => {
    return {
      ...deviceInfo,
      ...networkInfo,
      ...batteryInfo,
      ...bluetoothInfo,
    };
  }, [deviceInfo, networkInfo, batteryInfo, bluetoothInfo]);

  return {
    // State
    deviceInfo,
    networkInfo,
    batteryInfo,
    bluetoothInfo,

    // Methods
    loadDeviceInfo,
    loadNetworkInfo,
    loadBatteryInfo,
    loadBluetoothInfo,
    saveDeviceInfo,
    hasFeature,
    getDeviceMetrics,
  };
};

export default useDevice;