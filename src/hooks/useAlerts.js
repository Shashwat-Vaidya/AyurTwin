import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';

import healthService from '../services/api/healthService';
import websocketService from '../services/sensors/websocketService';
import {
  addAlert,
  updateAlert,
  removeAlert,
  setAlerts,
  setAlertLoading,
  setAlertError,
  markAsRead,
  markAllAsRead,
} from '../store/slices/alertsSlice';

export const useAlerts = () => {
  const dispatch = useDispatch();
  const { alerts, unreadCount, isLoading, error } = useSelector(state => state.alerts);
  const [isLive, setIsLive] = useState(false);

  // Fetch all alerts
  const fetchAlerts = useCallback(async () => {
    dispatch(setAlertLoading(true));
    try {
      const data = await healthService.getAlerts();
      dispatch(setAlerts(data));
      return data;
    } catch (error) {
      dispatch(setAlertError(error.message));
      return null;
    } finally {
      dispatch(setAlertLoading(false));
    }
  }, [dispatch]);

  // Fetch alert history
  const fetchAlertHistory = useCallback(async () => {
    dispatch(setAlertLoading(true));
    try {
      const data = await healthService.getAlertHistory();
      return data;
    } catch (error) {
      dispatch(setAlertError(error.message));
      return null;
    } finally {
      dispatch(setAlertLoading(false));
    }
  }, [dispatch]);

  // Resolve alert
  const resolveAlert = useCallback(async (alertId) => {
    try {
      await healthService.resolveAlert(alertId);
      dispatch(removeAlert(alertId));
      return true;
    } catch (error) {
      console.error('Error resolving alert:', error);
      Alert.alert('Error', 'Failed to resolve alert');
      return false;
    }
  }, [dispatch]);

  // Snooze alert
  const snoozeAlert = useCallback(async (alertId, duration) => {
    try {
      await healthService.snoozeAlert(alertId, duration);
      const updatedAlert = { id: alertId, snoozed: true, snoozeUntil: Date.now() + duration };
      dispatch(updateAlert(updatedAlert));
      return true;
    } catch (error) {
      console.error('Error snoozing alert:', error);
      Alert.alert('Error', 'Failed to snooze alert');
      return false;
    }
  }, [dispatch]);

  // Mark alert as read
  const markAlertAsRead = useCallback((alertId) => {
    dispatch(markAsRead(alertId));
  }, [dispatch]);

  // Mark all alerts as read
  const markAllAlertsAsRead = useCallback(() => {
    dispatch(markAllAsRead());
  }, [dispatch]);

  // Delete alert
  const deleteAlert = useCallback((alertId) => {
    Alert.alert(
      'Delete Alert',
      'Are you sure you want to delete this alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(removeAlert(alertId)),
        },
      ]
    );
  }, [dispatch]);

  // Get alerts by severity
  const getAlertsBySeverity = useCallback((severity) => {
    return alerts.filter(alert => alert.severity === severity);
  }, [alerts]);

  // Get alerts by type
  const getAlertsByType = useCallback((type) => {
    return alerts.filter(alert => alert.type === type);
  }, [alerts]);

  // Get critical alerts
  const getCriticalAlerts = useCallback(() => {
    return alerts.filter(alert => 
      alert.severity === 'critical' || alert.severity === 'high'
    );
  }, [alerts]);

  // Get unread alerts
  const getUnreadAlerts = useCallback(() => {
    return alerts.filter(alert => !alert.read);
  }, [alerts]);

  // Start live alert monitoring
  const startLiveMonitoring = useCallback(() => {
    if (isLive) return;

    websocketService.on('alert', (alert) => {
      dispatch(addAlert(alert));
    });

    setIsLive(true);
  }, [dispatch, isLive]);

  // Stop live monitoring
  const stopLiveMonitoring = useCallback(() => {
    websocketService.off('alert');
    setIsLive(false);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (isLive) {
        stopLiveMonitoring();
      }
    };
  }, [isLive, stopLiveMonitoring]);

  return {
    // State
    alerts,
    unreadCount,
    isLoading,
    error,
    isLive,

    // Methods
    fetchAlerts,
    fetchAlertHistory,
    resolveAlert,
    snoozeAlert,
    markAlertAsRead,
    markAllAlertsAsRead,
    deleteAlert,
    getAlertsBySeverity,
    getAlertsByType,
    getCriticalAlerts,
    getUnreadAlerts,
    startLiveMonitoring,
    stopLiveMonitoring,
  };
};

export default useAlerts;