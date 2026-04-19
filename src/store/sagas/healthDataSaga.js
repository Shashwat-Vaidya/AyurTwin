import { put, takeLatest, call, select } from 'redux-saga/effects';
import healthService from '../../services/api/healthService';
import { 
  fetchCurrentReadings,
  fetchHistoricalData,
  updateCurrentReadings,
  addHistoricalData,
  setHealthDataLoading,
  setHealthDataError,
} from '../slices/healthDataSlice';

const getUserId = (state) => state.auth.user?.id;

function* handleFetchCurrentReadings() {
  try {
    yield put(setHealthDataLoading(true));
    const data = yield call(healthService.getCurrentReadings);
    yield put(updateCurrentReadings(data));
  } catch (error) {
    yield put(setHealthDataError(error.message));
  } finally {
    yield put(setHealthDataLoading(false));
  }
}

function* handleFetchHistoricalData(action) {
  try {
    const { type, period } = action.payload;
    yield put(setHealthDataLoading(true));
    const data = yield call(healthService.getHistoricalData, type, period);
    yield put(addHistoricalData({ type, data }));
  } catch (error) {
    yield put(setHealthDataError(error.message));
  } finally {
    yield put(setHealthDataLoading(false));
  }
}

function* handleRealTimeUpdate(action) {
  try {
    const { type, value } = action.payload;
    yield put(updateCurrentReadings({ [type]: value }));
    
    // Store in history
    const userId = yield select(getUserId);
    if (userId) {
      yield call(healthService.sendHealthReading, { userId, type, value });
    }
  } catch (error) {
    console.error('Real-time update error:', error);
  }
}

function* watchHealthData() {
  yield takeLatest(fetchCurrentReadings.type, handleFetchCurrentReadings);
  yield takeLatest(fetchHistoricalData.type, handleFetchHistoricalData);
  yield takeLatest('SENSOR_DATA_UPDATE', handleRealTimeUpdate);
}

export default function* healthDataSaga() {
  yield watchHealthData();
}