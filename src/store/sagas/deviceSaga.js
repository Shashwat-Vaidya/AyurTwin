import { put, takeLatest, call, delay, select } from 'redux-saga/effects';
import bluetoothService from '../../services/sensors/bluetoothService';
import sensorService from '../../services/sensors/sensorService';
import { 
  connectDevice,
  disconnectDevice,
  scanForDevices,
  syncDeviceData,
  updateFirmware,
  calibrateDevice,
  addDevice,
  updateBatteryLevel,
  setScanning,
  setConnecting,
  setSyncing,
  setUpdating,
  setCalibrating,
  setDeviceError,
} from '../slices/deviceSlice';

function* handleConnectDevice(action) {
  try {
    const deviceId = action.payload;
    yield put(setConnecting(true));
    
    const device = yield call(bluetoothService.connectToDevice, deviceId);
    yield put(addDevice(device));
    
    // Start monitoring battery
    yield call(monitorBattery);
    
    return device;
  } catch (error) {
    yield put(setDeviceError(error.message));
  } finally {
    yield put(setConnecting(false));
  }
}

function* handleDisconnectDevice() {
  try {
    yield call(bluetoothService.disconnectDevice);
  } catch (error) {
    yield put(setDeviceError(error.message));
  }
}

function* handleScanForDevices() {
  try {
    yield put(setScanning(true));
    yield call(bluetoothService.startScan);
    yield delay(10000); // Scan for 10 seconds
    yield call(bluetoothService.stopScan);
  } catch (error) {
    yield put(setDeviceError(error.message));
  } finally {
    yield put(setScanning(false));
  }
}

function* handleSyncDeviceData() {
  try {
    yield put(setSyncing(true));
    const deviceInfo = yield call(bluetoothService.getDeviceInfo);
    const sensorData = yield call(sensorService.getSensorData);
    return { deviceInfo, sensorData };
  } catch (error) {
    yield put(setDeviceError(error.message));
  } finally {
    yield put(setSyncing(false));
  }
}

function* handleUpdateFirmware() {
  try {
    yield put(setUpdating(true));
    // Simulate firmware update
    yield delay(3000);
    return { success: true, version: '2.1.4' };
  } catch (error) {
    yield put(setDeviceError(error.message));
  } finally {
    yield put(setUpdating(false));
  }
}

function* handleCalibrateDevice() {
  try {
    yield put(setCalibrating(true));
    // Simulate calibration
    yield delay(2000);
    return { success: true, calibrated: true };
  } catch (error) {
    yield put(setDeviceError(error.message));
  } finally {
    yield put(setCalibrating(false));
  }
}

function* monitorBattery() {
  while (true) {
    try {
      const battery = yield call(bluetoothService.getBatteryLevel);
      yield put(updateBatteryLevel(battery));
      yield delay(60000); // Check every minute
    } catch (error) {
      console.error('Battery monitoring error:', error);
      break;
    }
  }
}

function* watchDevice() {
  yield takeLatest(connectDevice.type, handleConnectDevice);
  yield takeLatest(disconnectDevice.type, handleDisconnectDevice);
  yield takeLatest(scanForDevices.type, handleScanForDevices);
  yield takeLatest(syncDeviceData.type, handleSyncDeviceData);
  yield takeLatest(updateFirmware.type, handleUpdateFirmware);
  yield takeLatest(calibrateDevice.type, handleCalibrateDevice);
}

export default function* deviceSaga() {
  yield watchDevice();
}