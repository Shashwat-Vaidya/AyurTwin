import { all, fork } from 'redux-saga/effects';

// Import all sagas
import authSaga from './sagas/authSaga';
import healthDataSaga from './sagas/healthDataSaga';
import alertsSaga from './sagas/alertsSaga';
import deviceSaga from './sagas/deviceSaga';
import syncSaga from './sagas/syncSaga';
import notificationSaga from './sagas/notificationSaga';

// Root saga that combines all sagas
export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(healthDataSaga),
    fork(alertsSaga),
    // fork(deviceSaga), // Disabled for Expo Go compatibility
    // fork(syncSaga), // Disabled for Expo Go compatibility
    fork(notificationSaga),
  ]);
}