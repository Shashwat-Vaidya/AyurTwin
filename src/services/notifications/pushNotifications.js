import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import apiClient from '../api/apiClient';

class PushNotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
    this.messageListeners = new Map();
  }

  async initialize() {
    await this.registerForPushNotifications();
    this.setupListeners();
  }

  async registerForPushNotifications() {
    if (!Device.isDevice) {
      console.log('Push notifications not available on emulator');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      
      this.expoPushToken = token.data;
      await this.sendTokenToServer(token.data);
      await AsyncStorage.setItem('@push_token', token.data);
      
      console.log('Push token:', this.expoPushToken);
    } catch (error) {
      console.error('Error getting push token:', error);
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF9933',
        sound: 'default',
        bypassDnd: true,
      });

      // Health alerts channel
      await Notifications.setNotificationChannelAsync('health_alerts', {
        name: 'Health Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF5A5F',
        sound: 'default',
        bypassDnd: true,
      });

      // Reminders channel
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4CAF50',
        sound: 'default',
        bypassDnd: false,
      });

      // Dosha updates channel
      await Notifications.setNotificationChannelAsync('dosha_updates', {
        name: 'Dosha Updates',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#9B6B9E',
        sound: 'default',
        bypassDnd: false,
      });

      // Weekly reports channel
      await Notifications.setNotificationChannelAsync('reports', {
        name: 'Health Reports',
        importance: Notifications.AndroidImportance.LOW,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4A90E2',
        sound: 'default',
        bypassDnd: false,
      });
    }
  }

  setupListeners() {
    this.notificationListener = Notifications.addNotificationReceivedListener(
      this.handleNotificationReceived.bind(this)
    );

    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      this.handleNotificationResponse.bind(this)
    );
  }

  async handleNotificationReceived(notification) {
    const { data } = notification.request.content;
    
    // Emit to specific listeners
    if (data?.type) {
      const listeners = this.messageListeners.get(data.type) || [];
      listeners.forEach(listener => listener(data));
    }

    // Also emit to general listeners
    const generalListeners = this.messageListeners.get('*') || [];
    generalListeners.forEach(listener => listener(notification));
  }

  async handleNotificationResponse(response) {
    const { notification } = response;
    const { data } = notification.request.content;

    // Handle deep linking
    if (data?.screen) {
      // Navigate to specific screen
      console.log('Navigate to:', data.screen, data.params);
    }

    // Handle specific actions
    if (data?.action) {
      switch (data.action) {
        case 'view_alert':
          // Navigate to alert details
          break;
        case 'view_report':
          // Navigate to report
          break;
        case 'take_medication':
          // Mark medication as taken
          break;
        default:
          break;
      }
    }
  }

  async sendTokenToServer(token) {
    try {
      await apiClient.post('/notifications/register', {
        token,
        platform: Platform.OS,
        device: Device.modelName,
      });
    } catch (error) {
      console.error('Error sending push token to server:', error);
    }
  }

  async sendNotification(userId, notification) {
    try {
      await apiClient.post(`/notifications/send/${userId}`, notification);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async broadcastNotification(notification, filters = {}) {
    try {
      await apiClient.post('/notifications/broadcast', {
        notification,
        filters,
      });
    } catch (error) {
      console.error('Error broadcasting notification:', error);
    }
  }

  // Health alerts
  async sendHealthAlert(userId, alert) {
    return this.sendNotification(userId, {
      title: alert.title,
      body: alert.message,
      data: {
        type: 'health_alert',
        alertId: alert.id,
        severity: alert.severity,
        screen: 'AlertDetail',
        params: { alertId: alert.id },
      },
      channelId: 'health_alerts',
      sound: 'default',
      priority: alert.severity === 'critical' ? 'high' : 'normal',
    });
  }

  // Dosha updates
  async sendDoshaUpdate(userId, doshaData) {
    return this.sendNotification(userId, {
      title: 'Dosha Balance Update',
      body: `Your ${doshaData.dominant} dosha has changed. Tap to see details.`,
      data: {
        type: 'dosha_update',
        dosha: doshaData,
        screen: 'DoshaDetail',
      },
      channelId: 'dosha_updates',
    });
  }

  // Weekly report ready
  async sendWeeklyReportReady(userId, reportData) {
    return this.sendNotification(userId, {
      title: 'Weekly Health Report Ready',
      body: 'Your weekly health summary is now available.',
      data: {
        type: 'weekly_report',
        reportId: reportData.id,
        screen: 'ReportDetail',
        params: { reportId: reportData.id },
      },
      channelId: 'reports',
    });
  }

  // Reminders
  async sendReminder(userId, reminder) {
    return this.sendNotification(userId, {
      title: reminder.title,
      body: reminder.message,
      data: {
        type: 'reminder',
        reminderId: reminder.id,
        action: reminder.action,
      },
      channelId: 'reminders',
    });
  }

  // Subscription alerts
  async sendSubscriptionAlert(userId, subscriptionData) {
    return this.sendNotification(userId, {
      title: 'Subscription Update',
      body: subscriptionData.message,
      data: {
        type: 'subscription',
        action: subscriptionData.action,
        screen: 'Subscription',
      },
      channelId: 'default',
    });
  }

  // Achievement unlocked
  async sendAchievementUnlocked(userId, achievement) {
    return this.sendNotification(userId, {
      title: 'Achievement Unlocked! ',
      body: `You've earned: ${achievement.name}`,
      data: {
        type: 'achievement',
        achievement,
        screen: 'Achievements',
      },
      channelId: 'default',
    });
  }

  // Add message listener
  addMessageListener(type, callback) {
    if (!this.messageListeners.has(type)) {
      this.messageListeners.set(type, []);
    }
    this.messageListeners.get(type).push(callback);
  }

  // Remove message listener
  removeMessageListener(type, callback) {
    if (this.messageListeners.has(type)) {
      const listeners = this.messageListeners.get(type).filter(cb => cb !== callback);
      this.messageListeners.set(type, listeners);
    }
  }

  // Get push token
  getPushToken() {
    return this.expoPushToken;
  }

  // Cleanup
  cleanup() {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
    this.messageListeners.clear();
  }

  // Test push notification
  async sendTestNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification ',
        body: 'This is a test notification from AyurTwin',
        data: { type: 'test' },
      },
      trigger: null,
    });
  }

  // Schedule local notification as fallback
  async scheduleLocalNotification(content, trigger) {
    return Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export default new PushNotificationService();