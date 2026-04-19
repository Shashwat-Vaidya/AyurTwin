import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bluetoothService from '../../services/sensors/bluetoothService';
import sensorService from '../../services/sensors/sensorService';
import storageService from '../../services/storage/asyncStorage';

// Async thunks
export const connectDevice = createAsyncThunk(
  'device/connectDevice',
  async (deviceId, { rejectWithValue, dispatch }) => {
    try {
      const device = await bluetoothService.connectToDevice(deviceId);
      dispatch(setConnectedDevice(device));
      return device;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const disconnectDevice = createAsyncThunk(
  'device/disconnectDevice',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await bluetoothService.disconnectDevice();
      dispatch(clearConnectedDevice());
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const scanForDevices = createAsyncThunk(
  'device/scanForDevices',
  async (_, { rejectWithValue }) => {
    try {
      const devices = [];
      await bluetoothService.startScan(
        (device) => {
          devices.push(device);
        },
        (error) => {
          console.error('Scan error:', error);
        }
      );
      
      // Stop scanning after 10 seconds
      setTimeout(() => {
        bluetoothService.stopScan();
      }, 10000);
      
      return devices;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncDeviceData = createAsyncThunk(
  'device/syncDeviceData',
  async (_, { rejectWithValue }) => {
    try {
      const deviceInfo = await bluetoothService.getDeviceInfo();
      const sensorData = sensorService.getSensorData();
      return { deviceInfo, sensorData, timestamp: Date.now() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFirmware = createAsyncThunk(
  'device/updateFirmware',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate firmware update
      await new Promise(resolve => setTimeout(resolve, 3000));
      return { success: true, version: '2.1.4' };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const calibrateDevice = createAsyncThunk(
  'device/calibrateDevice',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate calibration
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, calibrated: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  devices: [],
  connectedDevice: null,
  isScanning: false,
  isConnecting: false,
  isSyncing: false,
  isUpdating: false,
  isCalibrating: false,
  deviceInfo: {
    name: null,
    model: null,
    serialNumber: null,
    firmware: null,
    battery: null,
    storage: null,
    lastSync: null,
    connectionType: null,
  },
  batteryHistory: [],
  connectionHistory: [],
  settings: {
    continuousMonitoring: true,
    heartRateAlerts: true,
    stressAlerts: true,
    autoSync: true,
    ledBrightness: 70,
    vibrationStrength: 60,
    powerSaving: false,
  },
  error: null,
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setDevices: (state, action) => {
      state.devices = action.payload;
    },
    
    addDevice: (state, action) => {
      const exists = state.devices.some(d => d.id === action.payload.id);
      if (!exists) {
        state.devices.push(action.payload);
      }
    },
    
    removeDevice: (state, action) => {
      state.devices = state.devices.filter(d => d.id !== action.payload);
    },
    
    setConnectedDevice: (state, action) => {
      state.connectedDevice = action.payload;
      state.connectionHistory.push({
        deviceId: action.payload.id,
        deviceName: action.payload.name,
        connectedAt: Date.now(),
        action: 'connected',
      });
      
      // Limit history
      if (state.connectionHistory.length > 50) {
        state.connectionHistory = state.connectionHistory.slice(-50);
      }
    },
    
    clearConnectedDevice: (state) => {
      if (state.connectedDevice) {
        state.connectionHistory.push({
          deviceId: state.connectedDevice.id,
          deviceName: state.connectedDevice.name,
          disconnectedAt: Date.now(),
          action: 'disconnected',
        });
        
        // Limit history
        if (state.connectionHistory.length > 50) {
          state.connectionHistory = state.connectionHistory.slice(-50);
        }
      }
      state.connectedDevice = null;
    },
    
    updateDeviceInfo: (state, action) => {
      state.deviceInfo = { ...state.deviceInfo, ...action.payload };
    },
    
    updateBatteryLevel: (state, action) => {
      state.deviceInfo.battery = action.payload;
      state.batteryHistory.push({
        level: action.payload,
        timestamp: Date.now(),
      });
      
      // Limit history
      if (state.batteryHistory.length > 100) {
        state.batteryHistory = state.batteryHistory.slice(-100);
      }
    },
    
    updateDeviceSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    setScanning: (state, action) => {
      state.isScanning = action.payload;
    },
    
    setConnecting: (state, action) => {
      state.isConnecting = action.payload;
    },
    
    setSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
    
    setUpdating: (state, action) => {
      state.isUpdating = action.payload;
    },
    
    setCalibrating: (state, action) => {
      state.isCalibrating = action.payload;
    },
    
    clearDevices: (state) => {
      state.devices = [];
    },
    
    clearBatteryHistory: (state) => {
      state.batteryHistory = [];
    },
    
    clearConnectionHistory: (state) => {
      state.connectionHistory = [];
    },
    
    resetDeviceState: () => initialState,
    
    setDeviceError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Connect device
      .addCase(connectDevice.pending, (state) => {
        state.isConnecting = true;
        state.error = null;
      })
      .addCase(connectDevice.fulfilled, (state, action) => {
        state.isConnecting = false;
        state.connectedDevice = action.payload;
      })
      .addCase(connectDevice.rejected, (state, action) => {
        state.isConnecting = false;
        state.error = action.payload;
      })
      
      // Disconnect device
      .addCase(disconnectDevice.pending, (state) => {
        state.isConnecting = true;
      })
      .addCase(disconnectDevice.fulfilled, (state) => {
        state.isConnecting = false;
        state.connectedDevice = null;
      })
      .addCase(disconnectDevice.rejected, (state, action) => {
        state.isConnecting = false;
        state.error = action.payload;
      })
      
      // Scan for devices
      .addCase(scanForDevices.pending, (state) => {
        state.isScanning = true;
        state.error = null;
        state.devices = [];
      })
      .addCase(scanForDevices.fulfilled, (state, action) => {
        state.isScanning = false;
        // Devices are added via addDevice reducer during scan
      })
      .addCase(scanForDevices.rejected, (state, action) => {
        state.isScanning = false;
        state.error = action.payload;
      })
      
      // Sync device data
      .addCase(syncDeviceData.pending, (state) => {
        state.isSyncing = true;
        state.error = null;
      })
      .addCase(syncDeviceData.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.deviceInfo = { ...state.deviceInfo, ...action.payload.deviceInfo };
        state.deviceInfo.lastSync = action.payload.timestamp;
      })
      .addCase(syncDeviceData.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload;
      })
      
      // Update firmware
      .addCase(updateFirmware.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateFirmware.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.deviceInfo.firmware = action.payload.version;
      })
      .addCase(updateFirmware.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // Calibrate device
      .addCase(calibrateDevice.pending, (state) => {
        state.isCalibrating = true;
        state.error = null;
      })
      .addCase(calibrateDevice.fulfilled, (state) => {
        state.isCalibrating = false;
        state.deviceInfo.calibrated = true;
        state.deviceInfo.lastCalibrated = Date.now();
      })
      .addCase(calibrateDevice.rejected, (state, action) => {
        state.isCalibrating = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllDevices = (state) => state.device.devices;
export const selectConnectedDevice = (state) => state.device.connectedDevice;
export const selectDeviceInfo = (state) => state.device.deviceInfo;
export const selectBatteryLevel = (state) => state.device.deviceInfo.battery;
export const selectIsScanning = (state) => state.device.isScanning;
export const selectIsConnecting = (state) => state.device.isConnecting;
export const selectIsSyncing = (state) => state.device.isSyncing;
export const selectDeviceSettings = (state) => state.device.settings;
export const selectBatteryHistory = (state) => state.device.batteryHistory;
export const selectConnectionHistory = (state) => state.device.connectionHistory;
export const selectDeviceError = (state) => state.device.error;

export const {
  setDevices,
  addDevice,
  removeDevice,
  setConnectedDevice,
  clearConnectedDevice,
  updateDeviceInfo,
  updateBatteryLevel,
  updateDeviceSettings,
  setScanning,
  setConnecting,
  setSyncing,
  setUpdating,
  setCalibrating,
  clearDevices,
  clearBatteryHistory,
  clearConnectionHistory,
  resetDeviceState,
  setDeviceError,
  clearError,
} = deviceSlice.actions;

export default deviceSlice.reducer;