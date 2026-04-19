import { put, takeLatest, call, delay, select, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import NetInfo from '@react-native-community/netinfo';
import syncService from '../../services/sync/syncService';
import offlineQueue from '../../services/sync/offlineQueue';

function* handleSyncRequest() {
  try {
    const netInfo = yield call(NetInfo.fetch);
    if (!netInfo.isConnected) {
      return;
    }
    
    yield call(syncService.performSync);
  } catch (error) {
    console.error('Sync error:', error);
  }
}

function* handleOfflineAction(action) {
  try {
    yield call(offlineQueue.enqueue, action.payload);
  } catch (error) {
    console.error('Offline queue error:', error);
  }
}

function* watchNetworkStatus() {
  const channel = eventChannel(emitter => {
    const unsubscribe = NetInfo.addEventListener(state => {
      emitter(state);
    });
    return unsubscribe;
  });

  try {
    while (true) {
      const state = yield take(channel);
      if (state.isConnected) {
        // Trigger sync when connection is restored
        yield call(handleSyncRequest);
      }
    }
  } finally {
    channel.close();
  }
}

function* watchPeriodicSync() {
  while (true) {
    yield delay(300000); // 5 minutes
    yield call(handleSyncRequest);
  }
}

function* handleSyncConflict(action) {
  try {
    const { local, remote } = action.payload;
    // Implement conflict resolution strategy
    const resolved = yield call(resolveConflict, local, remote);
    yield put({ type: 'SYNC_RESOLVED', payload: resolved });
  } catch (error) {
    console.error('Conflict resolution error:', error);
  }
}

function* resolveConflict(local, remote) {
  // Simple resolution: take latest
  if (local.timestamp > remote.timestamp) {
    return local;
  }
  return remote;
}

function* watchSync() {
  yield takeLatest('SYNC_REQUEST', handleSyncRequest);
  yield takeLatest('OFFLINE_ACTION', handleOfflineAction);
  yield takeLatest('SYNC_CONFLICT', handleSyncConflict);
  yield fork(watchNetworkStatus);
  yield fork(watchPeriodicSync);
}

export default function* syncSaga() {
  yield watchSync();
}