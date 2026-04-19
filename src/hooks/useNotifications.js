import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

import localNotifications from '../services/notifications/localNotifications';
import pushNotifications from '../services/notifications/pushNotifications';
import storageService from '../services/storage/asyncStorage';

export const useNotifications = () => {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [pushToken, setPushToken] = useState(null);
  const [scheduledNotifications, setScheduledNotifications] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize notifications on mount
  useEffect(() => {
    initializeNotifications();
    loadScheduledNotifications();

    return () => {
      localNotifications.cleanup();
      pushNotifications.cleanup();
    };
  }, []);

  // Initialize notification services
  const initializeNotifications = useCallback(async () => {
    try {
      await localNotifications.initialize();
      await pushNotifications.initialize();
      
      const token = pushNotifications.getPushToken();
      setPushToken(token);
      setPermissionStatus('granted');
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing notifications:', error);
      setPermissionStatus('denied');
    }
  }, []);

  // Request permissions
  const requestPermissions = useCallback(async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === 'granted') {
        await initializeNotifications();
      }
      
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }, [initializeNotifications]);

  // Load scheduled notifications
  const loadScheduledNotifications = useCallback(async () => {
    const scheduled = localNotifications.getScheduledNotifications();
    setScheduledNotifications(scheduled);
  }, []);

  // Schedule health reminder
  const scheduleHealthReminder = useCallback(async (title, body, trigger, data = {}) => {
    try {
      const id = await localNotifications.scheduleHealthReminder(title, body, trigger, data);
      await loadScheduledNotifications();
      return id;
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      return null;
    }
  }, [loadScheduledNotifications]);

  // Schedule medication reminder
  const scheduleMedicationReminder = useCallback(async (medicationName, hour, minute, data = {}) => {
    try {
      const id = await localNotifications.scheduleMedicationReminder(
        medicationName, hour, minute, data
      );
      await loadScheduledNotifications();
      return id;
    } catch (error) {
      console.error('Error scheduling medication reminder:', error);
      return null;
    }
  }, [loadScheduledNotifications]);

  // Schedule hydration reminder
  const scheduleHydrationReminder = useCallback(async (interval = 60, data = {}) => {
    try {
      const id = await localNotifications.scheduleHydrationReminder(interval, data);
      await loadScheduledNotifications();
      return id;
    } catch (error) {
      console.error('Error scheduling hydration reminder:', error);
      return null;
    }
  }, [loadScheduledNotifications]);

  // Schedule activity reminder
  const scheduleActivityReminder = useCallback(async (interval = 120, data = {}) => {
    try {
      const id = await localNotifications.scheduleActivityReminder(interval, data);
      await loadScheduledNotifications();
      return id;
    } catch (error) {
      console.error('Error scheduling activity reminder:', error);
      return null;
    }
  }, [loadScheduledNotifications]);

  // Schedule sleep reminder
  const scheduleSleepReminder = useCallback(async (hour, minute, data = {}) => {
    try {
      const id = await localNotifications.scheduleSleepReminder(hour, minute, data);
      await loadScheduledNotifications();
      return id;
    } catch (error) {
      console.error('Error scheduling sleep reminder:', error);
      return null;
    }
  }, [loadScheduledNotifications]);

  // Schedule wake up reminder
  const scheduleWakeUpReminder = useCallback(async (hour, minute, data = {}) => {
    try {
      const id = await localNotifications.scheduleWakeUpReminder(hour, minute, data);
      await loadScheduledNotifications();
      return id;
    } catch (error) {
      console.error('Error scheduling wake up reminder:', error);
      return null;
    }
  }, [loadScheduledNotifications]);

  // Schedule weekly report
  const scheduleWeeklyReport = useCallback(async (dayOfWeek = 1, hour = 9, minute = 0, data = {}) => {
    try {
      const id = await localNotifications.scheduleWeeklyReport(dayOfWeek, hour, minute, data);
      await loadScheduledNotifications();
      return id;
    } catch (error) {
      console.error('Error scheduling weekly report:', error);
      return null;
    }
  }, [loadScheduledNotifications]);

  // Cancel notification
  const cancelNotification = useCallback(async (id) => {
    try {
      await localNotifications.cancelNotification(id);
      await loadScheduledNotifications();
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }, [loadScheduledNotifications]);

  // Cancel all notifications
  const cancelAllNotifications = useCallback(async () => {
    try {
      await localNotifications.cancelAllNotifications();
      setScheduledNotifications([]);
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }, []);

  // Cancel notifications by type
  const cancelNotificationsByType = useCallback(async (type) => {
    try {
      await localNotifications.cancelNotificationsByType(type);
      await loadScheduledNotifications();
    } catch (error) {
      console.error('Error canceling notifications by type:', error);
    }
  }, [loadScheduledNotifications]);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    await pushNotifications.sendTestNotification();
  }, []);

  // Add notification listener
  const addNotificationListener = useCallback((type, callback) => {
    pushNotifications.addMessageListener(type, callback);
  }, []);

  // Remove notification listener
  const removeNotificationListener = useCallback((type, callback) => {
    pushNotifications.removeMessageListener(type, callback);
  }, []);

  // Check if permission granted
  const hasPermission = permissionStatus === 'granted';

  return {
    // State
    permissionStatus,
    pushToken,
    scheduledNotifications,
    isInitialized,
    hasPermission,

    // Methods
    requestPermissions,
    scheduleHealthReminder,
    scheduleMedicationReminder,
    scheduleHydrationReminder,
    scheduleActivityReminder,
    scheduleSleepReminder,
    scheduleWakeUpReminder,
    scheduleWeeklyReport,
    cancelNotification,
    cancelAllNotifications,
    cancelNotificationsByType,
    sendTestNotification,
    addNotificationListener,
    removeNotificationListener,
    loadScheduledNotifications,
  };
};

export default useNotifications;