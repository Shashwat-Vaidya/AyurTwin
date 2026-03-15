import NetInfo from '@react-native-community/netinfo';
import { offlineQueue } from '../../services/sync/offlineQueue';
import syncService from '../../services/sync/syncService';
import storageService from '../../services/storage/asyncStorage';

// Action types that require syncing
const SYNC_ACTIONS = [
  // Health data actions
  'healthData/updateCurrentReadings',
  'healthData/addHistoricalData',
  'healthData/updateDiseaseRisks',
  'healthData/updateDoshaBalance',
  
  // User actions
  'user/updateProfile',
  'user/updateSettings',
  'user/updatePreferences',
  
  // Alert actions
  'alerts/addAlert',
  'alerts/resolveAlert',
  'alerts/markAsRead',
  'alerts/snoozeAlert',
  
  // Goal actions
  'goals/addGoal',
  'goals/updateGoal',
  'goals/deleteGoal',
  'goals/updateProgress',
  
  // Device actions
  'device/updateDeviceInfo',
  'device/updateConnectionStatus',
  'device/updateBatteryLevel',
];

// Priority mapping for sync actions
const SYNC_PRIORITY = {
  'alerts/addAlert': 'high',
  'alerts/resolveAlert': 'high',
  'user/updateProfile': 'medium',
  'user/updateSettings': 'medium',
  'healthData/updateCurrentReadings': 'low',
  'healthData/addHistoricalData': 'low',
};

const dataSyncMiddleware = store => next => action => {
  // Process the action first
  const result = next(action);
  
  // Check if action needs syncing
  if (SYNC_ACTIONS.includes(action.type)) {
    handleSyncAction(action, store);
  }
  
  return result;
};

const handleSyncAction = async (action, store) => {
  const state = store.getState();
  const netInfo = await NetInfo.fetch();
  
  // Prepare sync data
  const syncData = {
    type: action.type,
    payload: action.payload,
    timestamp: Date.now(),
    userId: state.auth.user?.id,
    deviceId: state.device.deviceInfo?.id,
  };
  
  // Add to sync queue
  await syncService.queueForSync(
    getSyncType(action.type),
    syncData,
    {
      priority: getSyncPriority(action.type),
      maxRetries: 3,
    }
  );
  
  // If online, try to sync immediately
  if (netInfo.isConnected) {
    syncService.performSync();
  } else {
    // Store offline for later
    await storageService.addOfflineAction(syncData);
  }
};

const getSyncType = (actionType) => {
  const typeMap = {
    'healthData': 'health_data',
    'user': 'user_profile',
    'alerts': 'alerts',
    'goals': 'goals',
    'device': 'device_data',
  };
  
  const prefix = actionType.split('/')[0];
  return typeMap[prefix] || 'unknown';
};

const getSyncPriority = (actionType) => {
  return SYNC_PRIORITY[actionType] || 'normal';
};

// Middleware for handling offline actions
export const offlineMiddleware = store => next => action => {
  if (action.meta?.offline) {
    return handleOfflineAction(action, store, next);
  }
  return next(action);
};

const handleOfflineAction = async (action, store, next) => {
  const netInfo = await NetInfo.fetch();
  
  if (netInfo.isConnected) {
    // Online - process normally
    return next(action);
  } else {
    // Offline - queue for later
    await offlineQueue.enqueue({
      type: action.type,
      payload: action.payload,
      meta: action.meta,
    });
    
    // Dispatch a queued action to update UI
    store.dispatch({
      type: 'OFFLINE_ACTION_QUEUED',
      payload: {
        originalAction: action.type,
        timestamp: Date.now(),
      },
    });
    
    return action;
  }
};

// Middleware for handling sync conflicts
export const conflictMiddleware = store => next => action => {
  if (action.type === 'SYNC_CONFLICT') {
    return handleSyncConflict(action, store, next);
  }
  return next(action);
};

const handleSyncConflict = (action, store, next) => {
  const { local, remote, resolution } = action.payload;
  
  switch (resolution) {
    case 'local':
      // Keep local changes
      store.dispatch({
        type: 'SYNC_RESOLVED',
        payload: { ...local, resolved: 'local' },
      });
      break;
      
    case 'remote':
      // Accept remote changes
      store.dispatch({
        type: 'SYNC_RESOLVED',
        payload: { ...remote, resolved: 'remote' },
      });
      break;
      
    case 'merge':
      // Merge changes
      const merged = mergeData(local, remote);
      store.dispatch({
        type: 'SYNC_RESOLVED',
        payload: { ...merged, resolved: 'merged' },
      });
      break;
      
    default:
      // Notify user of conflict
      store.dispatch({
        type: 'SYNC_CONFLICT_PENDING',
        payload: action.payload,
      });
  }
  
  return next(action);
};

const mergeData = (local, remote) => {
  // Simple merge strategy - take latest timestamp
  if (local.timestamp > remote.timestamp) {
    return local;
  }
  return remote;
};

// Middleware for tracking sync status
export const syncStatusMiddleware = store => next => action => {
  const result = next(action);
  
  if (action.type === 'SYNC_START') {
    store.dispatch({
      type: 'UPDATE_SYNC_STATUS',
      payload: {
        isSyncing: true,
        lastSyncStart: Date.now(),
      },
    });
  }
  
  if (action.type === 'SYNC_COMPLETE') {
    store.dispatch({
      type: 'UPDATE_SYNC_STATUS',
      payload: {
        isSyncing: false,
        lastSyncComplete: Date.now(),
        syncedItems: action.payload.count,
      },
    });
  }
  
  if (action.type === 'SYNC_ERROR') {
    store.dispatch({
      type: 'UPDATE_SYNC_STATUS',
      payload: {
        isSyncing: false,
        lastSyncError: action.payload.error,
        syncErrorCount: action.payload.retryCount,
      },
    });
  }
  
  return result;
};

// Middleware for periodic sync
export const periodicSyncMiddleware = (interval = 300000) => { // Default 5 minutes
  let syncTimer = null;
  
  return store => next => action => {
    const result = next(action);
    
    // Start timer after app initialization
    if (action.type === 'APP_INITIALIZED') {
      syncTimer = setInterval(() => {
        store.dispatch({ type: 'PERIODIC_SYNC_REQUEST' });
      }, interval);
    }
    
    // Handle periodic sync requests
    if (action.type === 'PERIODIC_SYNC_REQUEST') {
      syncService.performSync();
    }
    
    // Cleanup on app close
    if (action.type === 'APP_CLOSE') {
      if (syncTimer) {
        clearInterval(syncTimer);
      }
    }
    
    return result;
  };
};

// Middleware for real-time sync via WebSocket
export const realtimeSyncMiddleware = store => next => action => {
  const result = next(action);
  
  if (action.type === 'WEBSOCKET_CONNECTED') {
    // Subscribe to real-time updates
    syncService.setupRealtimeSync();
  }
  
  if (action.type === 'WEBSOCKET_MESSAGE') {
    const { event, data } = action.payload;
    
    if (event === 'sync_update') {
      store.dispatch({
        type: 'REALTIME_UPDATE',
        payload: data,
      });
    }
  }
  
  return result;
};

export default dataSyncMiddleware;