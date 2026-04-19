import { put, takeLatest, call, delay, select } from 'redux-saga/effects';
import healthService from '../../services/api/healthService';
import notificationHelper from '../../utils/helpers/notificationHelper';
import { 
  addAlert,
  fetchAlerts,
  fetchAlertHistory,
  resolveAlert,
  snoozeAlert,
  setAlerts,
  setAlertLoading,
  setAlertError,
} from '../slices/alertsSlice';

function* handleFetchAlerts() {
  try {
    yield put(setAlertLoading(true));
    const alerts = yield call(healthService.getAlerts);
    yield put(setAlerts(alerts));
  } catch (error) {
    yield put(setAlertError(error.message));
  } finally {
    yield put(setAlertLoading(false));
  }
}

function* handleFetchAlertHistory() {
  try {
    yield put(setAlertLoading(true));
    const history = yield call(healthService.getAlertHistory);
    return history;
  } catch (error) {
    yield put(setAlertError(error.message));
  } finally {
    yield put(setAlertLoading(false));
  }
}

function* handleResolveAlert(action) {
  try {
    const alertId = action.payload;
    yield call(healthService.resolveAlert, alertId);
  } catch (error) {
    console.error('Error resolving alert:', error);
  }
}

function* handleSnoozeAlert(action) {
  try {
    const { alertId, duration } = action.payload;
    yield call(healthService.snoozeAlert, alertId, duration);
  } catch (error) {
    console.error('Error snoozing alert:', error);
  }
}

function* handleNewAlert(action) {
  try {
    const alert = action.payload;
    
    // Show notification for critical alerts
    if (alert.severity === 'critical' || alert.severity === 'high') {
      yield call(notificationHelper.showInAppAlert, alert.title, alert.message);
      yield call(notificationHelper.vibrate);
      yield call(notificationHelper.playSound);
    }
    
    // Auto-resolve low severity alerts after delay
    if (alert.severity === 'low' || alert.severity === 'info') {
      yield delay(300000); // 5 minutes
      yield put(resolveAlert(alert.id));
    }
  } catch (error) {
    console.error('Error handling new alert:', error);
  }
}

function* watchAlerts() {
  yield takeLatest(fetchAlerts.type, handleFetchAlerts);
  yield takeLatest(fetchAlertHistory.type, handleFetchAlertHistory);
  yield takeLatest(resolveAlert.type, handleResolveAlert);
  yield takeLatest(snoozeAlert.type, handleSnoozeAlert);
  yield takeLatest(addAlert.type, handleNewAlert);
}

export default function* alertsSaga() {
  yield watchAlerts();
}