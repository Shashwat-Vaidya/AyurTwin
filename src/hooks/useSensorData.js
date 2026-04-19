import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';

import bluetoothService from '../services/sensors/bluetoothService';
import websocketService from '../services/sensors/websocketService';
import sensorDataParser from '../services/sensors/sensorDataParser';
import storageService from '../services/storage/asyncStorage';

export const useSensorData = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [sensorData, setSensorData] = useState({
    heartRate: null,
    spo2: null,
    temperature: null,
    stress: null,
    activity: null,
    sleep: null,
    battery: null,
  });
  const [historicalData, setHistoricalData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dataBuffer = useRef([]);
  const appState = useRef(AppState.currentState);

  // Setup app state listener
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  // Handle app state changes
  const handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to foreground
      if (isConnected) {
        reconnectDevice();
      }
    }
    appState.current = nextAppState;
  };

  // Start scanning for devices
  const startScan = useCallback(async () => {
    setIsScanning(true);
    setError(null);

    try {
      await bluetoothService.startScan(
        (device) => {
          setDevices(prev => {
            const exists = prev.some(d => d.id === device.id);
            if (!exists) {
              return [...prev, device];
            }
            return prev;
          });
        },
        (error) => {
          setError(error);
          setIsScanning(false);
        }
      );
    } catch (error) {
      setError(error.message);
      setIsScanning(false);
    }
  }, []);

  // Stop scanning
  const stopScan = useCallback(() => {
    bluetoothService.stopScan();
    setIsScanning(false);
  }, []);

  // Connect to device
  const connectToDevice = useCallback(async (deviceId) => {
    setIsLoading(true);
    setError(null);

    try {
      const device = await bluetoothService.connectToDevice(
        deviceId,
        () => {
          setIsConnected(true);
          startHealthMonitoring();
        },
        () => {
          setIsConnected(false);
          setCurrentDevice(null);
        },
        (error) => {
          setError(error);
        }
      );

      setCurrentDevice({
        id: device.id,
        name: device.name,
      });

      // Get device info
      const deviceInfo = await bluetoothService.getDeviceInfo();
      setSensorData(prev => ({
        ...prev,
        battery: deviceInfo.battery,
      }));

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, []);

  // Disconnect device
  const disconnectDevice = useCallback(async () => {
    try {
      await bluetoothService.disconnectDevice();
      setIsConnected(false);
      setCurrentDevice(null);
      setSensorData({
        heartRate: null,
        spo2: null,
        temperature: null,
        stress: null,
        activity: null,
        sleep: null,
        battery: null,
      });
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Reconnect device
  const reconnectDevice = useCallback(async () => {
    if (currentDevice) {
      await connectToDevice(currentDevice.id);
    }
  }, [currentDevice, connectToDevice]);

  // Start health monitoring
  const startHealthMonitoring = useCallback(() => {
    bluetoothService.startHealthMonitoring(
      (type, data) => {
        const parsedData = sensorDataParser.parseRawSensorData(data, type);
        setSensorData(prev => ({
          ...prev,
          [type]: parsedData,
        }));

        // Buffer data for storage
        dataBuffer.current.push({
          type,
          data: parsedData,
          timestamp: Date.now(),
        });

        // Store in historical data
        setHistoricalData(prev => {
          const typeData = prev[type] || [];
          return {
            ...prev,
            [type]: [...typeData, parsedData].slice(-100), // Keep last 100 readings
          };
        });
      },
      (error) => {
        setError(error);
      }
    );
  }, []);

  // Save buffered data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (dataBuffer.current.length > 0) {
        saveBufferedData();
      }
    }, 60000); // Save every minute

    return () => clearInterval(interval);
  }, []);

  // Save buffered data to storage
  const saveBufferedData = useCallback(async () => {
    if (dataBuffer.current.length === 0) return;

    const buffered = [...dataBuffer.current];
    dataBuffer.current = [];

    for (const item of buffered) {
      await storageService.appendHealthReading(item);
    }
  }, []);

  // Get historical data for a specific type
  const getHistoricalData = useCallback((type, limit = 100) => {
    return (historicalData[type] || []).slice(-limit);
  }, [historicalData]);

  // Get average for a metric
  const getAverage = useCallback((type, period = 'day') => {
    const data = historicalData[type] || [];
    if (data.length === 0) return null;

    const sum = data.reduce((acc, item) => acc + item.value, 0);
    return sum / data.length;
  }, [historicalData]);

  // Get min/max for a metric
  const getMinMax = useCallback((type) => {
    const data = historicalData[type] || [];
    if (data.length === 0) return { min: null, max: null };

    const values = data.map(item => item.value);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [historicalData]);

  // Get latest reading
  const getLatestReading = useCallback((type) => {
    return sensorData[type];
  }, [sensorData]);

  // Check if specific sensor is available
  const isSensorAvailable = useCallback((type) => {
    return sensorData[type] !== null;
  }, [sensorData]);

  // Get device battery level
  const getBatteryLevel = useCallback(() => {
    return sensorData.battery?.level || 0;
  }, [sensorData.battery]);

  // Get connection status
  const getConnectionStatus = useCallback(() => {
    return {
      isConnected,
      device: currentDevice,
      lastSeen: currentDevice ? Date.now() : null,
    };
  }, [isConnected, currentDevice]);

  return {
    // State
    isConnected,
    isScanning,
    devices,
    currentDevice,
    sensorData,
    historicalData,
    isLoading,
    error,

    // Methods
    startScan,
    stopScan,
    connectToDevice,
    disconnectDevice,
    reconnectDevice,
    getHistoricalData,
    getAverage,
    getMinMax,
    getLatestReading,
    isSensorAvailable,
    getBatteryLevel,
    getConnectionStatus,
  };
};

export default useSensorData;