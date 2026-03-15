import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class LocalNotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
    this.scheduledNotifications = new Map();
  }

  async initialize() {
    await this.requestPermissions();
    this.setupListeners();
    await this.loadScheduledNotifications();
  }

  async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  setupListeners() {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        this.handleNotificationReceived(notification);
      }
    );

    // Listener for notifications tapped by user
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
        this.handleNotificationResponse(response);
      }
    );
  }

  async loadScheduledNotifications() {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    scheduled.forEach(notification => {
      this.scheduledNotifications.set(notification.identifier, notification);
    });
  }

  handleNotificationReceived(notification) {
    // You can add custom logic here
    console.log('Notification received:', notification);
  }

  handleNotificationResponse(response) {
    const { notification } = response;
    const data = notification.request.content.data;
    
    // Handle navigation based on notification data
    if (data?.screen) {
      // Navigate to specific screen
      console.log('Navigate to:', data.screen, data.params);
    }
  }

  // Health alerts
  async sendHealthAlert(title, body, data = {}) {
    const content = {
      title,
      body,
      data: { ...data, type: 'health_alert' },
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.HIGH,
      categoryIdentifier: 'health_alert',
    };

    return this.scheduleNotification(content, null);
  }

  async scheduleHealthReminder(title, body, trigger, data = {}) {
    const content = {
      title,
      body,
      data: { ...data, type: 'health_reminder' },
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
      categoryIdentifier: 'health_reminder',
    };

    return this.scheduleNotification(content, trigger);
  }

  // Dosha alerts
  async sendDoshaAlert(dosha, imbalance, data = {}) {
    const title = `${dosha} Dosha Imbalance Detected`;
    const body = `Your ${dosha} dosha is showing signs of imbalance. Check recommendations.`;

    return this.sendHealthAlert(title, body, { ...data, type: 'dosha_alert' });
  }

  // Stress alerts
  async sendStressAlert(level, data = {}) {
    const title = 'High Stress Level Detected';
    const body = `Your stress level is ${level}. Try some breathing exercises.`;

    return this.sendHealthAlert(title, body, { ...data, type: 'stress_alert' });
  }

  // Sleep reminders
  async scheduleSleepReminder(hour, minute, data = {}) {
    const trigger = {
      hour,
      minute,
      repeats: true,
    };

    return this.scheduleHealthReminder(
      'Bedtime Reminder',
      'Time to prepare for sleep. Start your bedtime routine.',
      trigger,
      { ...data, type: 'sleep_reminder' }
    );
  }

  // Wake up reminders
  async scheduleWakeUpReminder(hour, minute, data = {}) {
    const trigger = {
      hour,
      minute,
      repeats: true,
    };

    return this.scheduleHealthReminder(
      'Good Morning!',
      'Start your day with some gentle stretches and meditation.',
      trigger,
      { ...data, type: 'wake_up_reminder' }
    );
  }

  // Hydration reminders
  async scheduleHydrationReminder(interval = 60, data = {}) {
    const trigger = {
      seconds: interval * 60,
      repeats: true,
    };

    return this.scheduleHealthReminder(
      'Time to Hydrate',
      'Remember to drink water. Stay hydrated!',
      trigger,
      { ...data, type: 'hydration_reminder' }
    );
  }

  // Activity reminders
  async scheduleActivityReminder(interval = 120, data = {}) {
    const trigger = {
      seconds: interval * 60,
      repeats: true,
    };

    return this.scheduleHealthReminder(
      'Time to Move',
      'You\'ve been inactive for a while. Take a short walk.',
      trigger,
      { ...data, type: 'activity_reminder' }
    );
  }

  // Medication reminders
  async scheduleMedicationReminder(medicationName, hour, minute, data = {}) {
    const trigger = {
      hour,
      minute,
      repeats: true,
    };

    return this.scheduleHealthReminder(
      `Medication Reminder: ${medicationName}`,
      `Time to take your ${medicationName}.`,
      trigger,
      { ...data, type: 'medication_reminder', medication: medicationName }
    );
  }

  // Meal reminders
  async scheduleMealReminder(mealType, hour, minute, data = {}) {
    const trigger = {
      hour,
      minute,
      repeats: true,
    };

    return this.scheduleHealthReminder(
      `${mealType} Time`,
      `It's time for ${mealType}. Eat mindfully!`,
      trigger,
      { ...data, type: 'meal_reminder', meal: mealType }
    );
  }

  // Weekly report
  async scheduleWeeklyReport(dayOfWeek = 1, hour = 9, minute = 0, data = {}) {
    const trigger = {
      weekday: dayOfWeek,
      hour,
      minute,
      repeats: true,
    };

    return this.scheduleHealthReminder(
      'Weekly Health Report Ready',
      'Your weekly health summary is now available. Check your progress!',
      trigger,
      { ...data, type: 'weekly_report' }
    );
  }

  // Custom notification
  async scheduleNotification(content, trigger, identifier = null) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content,
        trigger,
        identifier,
      });

      this.scheduledNotifications.set(notificationId, { content, trigger });
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  // Cancel notifications
  async cancelNotification(identifier) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    this.scheduledNotifications.delete(identifier);
  }

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    this.scheduledNotifications.clear();
  }

  async cancelNotificationsByType(type) {
    const toCancel = [];
    this.scheduledNotifications.forEach((notification, id) => {
      if (notification.content.data?.type === type) {
        toCancel.push(id);
      }
    });

    await Promise.all(toCancel.map(id => this.cancelNotification(id)));
  }

  // Get scheduled notifications
  getScheduledNotifications() {
    return Array.from(this.scheduledNotifications.values());
  }

  // Check if notification exists
  hasNotification(identifier) {
    return this.scheduledNotifications.has(identifier);
  }

  // Get notification by identifier
  getNotification(identifier) {
    return this.scheduledNotifications.get(identifier);
  }

  // Cleanup
  cleanup() {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }

  // Create notification categories for actions
  async setupNotificationCategories() {
    if (Platform.OS === 'ios') {
      await Notifications.setNotificationCategoryAsync('health_alert', [
        {
          identifier: 'view',
          buttonTitle: 'View Details',
          options: {
            opensAppToForeground: true,
          },
        },
        {
          identifier: 'dismiss',
          buttonTitle: 'Dismiss',
          options: {
            isDestructive: true,
          },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('health_reminder', [
        {
          identifier: 'snooze',
          buttonTitle: 'Snooze',
          options: {
            isAuthenticationRequired: true,
          },
        },
        {
          identifier: 'done',
          buttonTitle: 'Mark Done',
          options: {
            opensAppToForeground: false,
          },
        },
      ]);
    }
  }
}

export default new LocalNotificationService();