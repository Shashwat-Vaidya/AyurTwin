import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import storageService from '../services/storage/asyncStorage';
import apiClient from '../services/api/apiClient';

export const useOffline = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingActions, setPendingActions] = useState([]);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
      
      // Auto-sync when connection is restored
      if (state.isConnected && pendingActions.length > 0) {
        syncPendingActions();
      }
    });

    loadPendingActions();
    loadLastSyncTime();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setQueueSize(pendingActions.length);
  }, [pendingActions]);

  const loadPendingActions = async () => {
    const actions = await storageService.getPendingActions();
    setPendingActions(actions || []);
  };

  const loadLastSyncTime = async () => {
    const time = await AsyncStorage.getItem('@offline:lastSync');
    if (time) {
      setLastSyncTime(JSON.parse(time));
    }
  };

  const savePendingActions = async (actions) => {
    await storageService.savePendingActions(actions);
    setPendingActions(actions);
  };

  const addPendingAction = useCallback(async (action) => {
    const newAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...action,
    };

    const updatedActions = [...pendingActions, newAction];
    await savePendingActions(updatedActions);

    // Try to sync immediately if connected
    if (isConnected) {
      syncPendingActions();
    } else {
      Alert.alert(
        'Offline Mode',
        'Action saved locally. Will sync when connection is restored.'
      );
    }
  }, [pendingActions, isConnected]);

  const removePendingAction = useCallback(async (actionId) => {
    const updatedActions = pendingActions.filter(a => a.id !== actionId);
    await savePendingActions(updatedActions);
  }, [pendingActions]);

  const syncPendingActions = useCallback(async () => {
    if (!isConnected) {
      Alert.alert('No Connection', 'Please check your internet connection');
      return;
    }

    if (pendingActions.length === 0) return;

    setIsSyncing(true);

    const successfulIds = [];
    const failedActions = [];

    for (const action of pendingActions) {
      try {
        await processAction(action);
        successfulIds.push(action.id);
      } catch (error) {
        console.error('Failed to sync action:', action, error);
        failedActions.push({
          ...action,
          error: error.message,
          retryCount: (action.retryCount || 0) + 1,
        });
      }
    }

    // Remove successful actions
    const remainingActions = pendingActions.filter(
      a => !successfulIds.includes(a.id)
    );

    // Keep failed actions for retry (with retry limit)
    const retryActions = failedActions.filter(a => (a.retryCount || 0) < 3);
    const finalActions = [...remainingActions, ...retryActions];

    await savePendingActions(finalActions);

    const syncTime = new Date().toISOString();
    setLastSyncTime(syncTime);
    await AsyncStorage.setItem('@offline:lastSync', JSON.stringify(syncTime));

    setIsSyncing(false);

    if (failedActions.length > 0) {
      Alert.alert(
        'Sync Partial',
        `${successfulIds.length} actions synced, ${failedActions.length} failed.`
      );
    } else {
      Alert.alert('Sync Complete', 'All pending actions synced successfully');
    }
  }, [pendingActions, isConnected]);

  const processAction = async (action) => {
    switch (action.type) {
      case 'health_reading':
        await apiClient.post('/health/readings', action.data);
        break;
      case 'alert_acknowledge':
        await apiClient.post(`/alerts/${action.data.alertId}/acknowledge`);
        break;
      case 'goal_update':
        await apiClient.put(`/goals/${action.data.goalId}`, action.data);
        break;
      case 'profile_update':
        await apiClient.put('/user/profile', action.data);
        break;
      case 'settings_update':
        await apiClient.put('/user/settings', action.data);
        break;
      default:
        console.warn('Unknown action type:', action.type);
    }
  };

  const clearPendingActions = useCallback(async () => {
    Alert.alert(
      'Clear Queue',
      'Are you sure you want to clear all pending actions?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await savePendingActions([]);
          },
        },
      ]
    );
  }, []);

  const retryFailedActions = useCallback(() => {
    const failedActions = pendingActions.filter(a => a.error);
    if (failedActions.length > 0) {
      syncPendingActions();
    } else {
      Alert.alert('No Failed Actions', 'All actions are pending or successful');
    }
  }, [pendingActions, syncPendingActions]);

  const queueHealthReading = useCallback((reading) => {
    return addPendingAction({
      type: 'health_reading',
      data: reading,
    });
  }, [addPendingAction]);

  const queueAlertAcknowledge = useCallback((alertId) => {
    return addPendingAction({
      type: 'alert_acknowledge',
      data: { alertId },
    });
  }, [addPendingAction]);

  const queueGoalUpdate = useCallback((goalId, updates) => {
    return addPendingAction({
      type: 'goal_update',
      data: { goalId, ...updates },
    });
  }, [addPendingAction]);

  const queueProfileUpdate = useCallback((profileData) => {
    return addPendingAction({
      type: 'profile_update',
      data: profileData,
    });
  }, [addPendingAction]);

  const queueSettingsUpdate = useCallback((settings) => {
    return addPendingAction({
      type: 'settings_update',
      data: settings,
    });
  }, [addPendingAction]);

  const getQueueSummary = useCallback(() => {
    const summary = {
      total: pendingActions.length,
      byType: {},
      oldest: null,
      newest: null,
    };

    if (pendingActions.length > 0) {
      summary.oldest = pendingActions[0].timestamp;
      summary.newest = pendingActions[pendingActions.length - 1].timestamp;
    }

    pendingActions.forEach(action => {
      summary.byType[action.type] = (summary.byType[action.type] || 0) + 1;
    });

    return summary;
  }, [pendingActions]);

  return {
    // State
    isConnected,
    connectionType,
    isSyncing,
    pendingActions,
    lastSyncTime,
    queueSize,

    // Core methods
    addPendingAction,
    removePendingAction,
    syncPendingActions,
    clearPendingActions,
    retryFailedActions,

    // Queue methods
    queueHealthReading,
    queueAlertAcknowledge,
    queueGoalUpdate,
    queueProfileUpdate,
    queueSettingsUpdate,

    // Utility
    getQueueSummary,
  };
};

export default useOffline;