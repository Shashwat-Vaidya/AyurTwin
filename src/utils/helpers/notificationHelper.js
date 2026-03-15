import { Platform, Alert, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
  HEALTH_ALERT: 'health_alert',
  REMINDER: 'reminder',
  DOSHA_UPDATE: 'dosha_update',
  WEEKLY_REPORT: 'weekly_report',
  ACHIEVEMENT: 'achievement',
  DEVICE: 'device',
  SYSTEM: 'system',
};

/**
 * Notification priorities
 */
export const NOTIFICATION_PRIORITIES = {
  HIGH: 'high',
  DEFAULT: 'default',
  LOW: 'low',
};

/**
 * Schedule a local notification
 * @param {Object} options - Notification options
 * @returns {Promise<string>} Notification ID
 */
export const scheduleNotification = async (options) => {
  const {
    title,
    body,
    data = {},
    trigger = null,
    sound = 'default',
    priority = NOTIFICATION_PRIORITIES.DEFAULT,
    channelId = 'default',
  } = options;

  const content = {
    title,
    body,
    data,
    sound,
    priority,
    categoryIdentifier: channelId,
  };

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

/**
 * Send immediate notification
 * @param {Object} options - Notification options
 * @returns {Promise<string>} Notification ID
 */
export const sendImmediateNotification = async (options) => {
  return scheduleNotification({ ...options, trigger: null });
};

/**
 * Cancel notification
 * @param {string} notificationId - Notification ID to cancel
 */
export const cancelNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

/**
 * Cancel all notifications
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

/**
 * Get all scheduled notifications
 * @returns {Promise<Array>} Scheduled notifications
 */
export const getScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

/**
 * Vibrate device
 * @param {Array|number} pattern - Vibration pattern
 */
export const vibrate = (pattern = 400) => {
  if (Platform.OS === 'ios') {
    // iOS has limited vibration support
    Vibration.vibrate();
  } else {
    Vibration.vibrate(pattern);
  }
};

/**
 * Play notification sound
 * @param {string} soundFile - Sound file name
 */
export const playSound = async (soundFile = 'notification.wav') => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require(`../../assets/sounds/${soundFile}`)
    );
    await sound.playAsync();
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

/**
 * Create health alert notification
 * @param {Object} alert - Alert data
 * @returns {Object} Notification options
 */
export const createHealthAlertNotification = (alert) => {
  const severityColors = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢',
    info: '🔵',
  };

  const emoji = severityColors[alert.severity] || '⚪';

  return {
    title: `${emoji} ${alert.title}`,
    body: alert.message,
    data: {
      type: NOTIFICATION_TYPES.HEALTH_ALERT,
      alertId: alert.id,
      severity: alert.severity,
      screen: 'AlertDetail',
      params: { alertId: alert.id },
    },
    priority: alert.severity === 'critical' ? NOTIFICATION_PRIORITIES.HIGH : NOTIFICATION_PRIORITIES.DEFAULT,
    channelId: 'health_alerts',
  };
};

/**
 * Create reminder notification
 * @param {Object} reminder - Reminder data
 * @returns {Object} Notification options
 */
export const createReminderNotification = (reminder) => {
  const icons = {
    medication: '💊',
    water: '💧',
    exercise: '🏃',
    sleep: '😴',
    meal: '🍽️',
  };

  const icon = icons[reminder.type] || '⏰';

  return {
    title: `${icon} ${reminder.title}`,
    body: reminder.message,
    data: {
      type: NOTIFICATION_TYPES.REMINDER,
      reminderId: reminder.id,
      reminderType: reminder.type,
      screen: reminder.screen || 'Dashboard',
    },
    priority: NOTIFICATION_PRIORITIES.DEFAULT,
    channelId: 'reminders',
  };
};

/**
 * Create dosha update notification
 * @param {Object} doshaData - Dosha data
 * @returns {Object} Notification options
 */
export const createDoshaUpdateNotification = (doshaData) => {
  const doshaEmojis = {
    vata: '🌬️',
    pitta: '🔥',
    kapha: '🌊',
  };

  const emoji = doshaEmojis[doshaData.dominant] || '🌿';

  return {
    title: `${emoji} Dosha Balance Update`,
    body: `Your ${doshaData.dominant} dosha has changed. Check your balance.`,
    data: {
      type: NOTIFICATION_TYPES.DOSHA_UPDATE,
      dosha: doshaData,
      screen: 'DoshaDetail',
    },
    priority: NOTIFICATION_PRIORITIES.DEFAULT,
    channelId: 'dosha_updates',
  };
};

/**
 * Create weekly report notification
 * @param {Object} report - Report data
 * @returns {Object} Notification options
 */
export const createWeeklyReportNotification = (report) => {
  return {
    title: '📊 Weekly Health Report Ready',
    body: `Your health score: ${report.score}/100. Tap to view details.`,
    data: {
      type: NOTIFICATION_TYPES.WEEKLY_REPORT,
      reportId: report.id,
      screen: 'ReportDetail',
      params: { reportId: report.id },
    },
    priority: NOTIFICATION_PRIORITIES.LOW,
    channelId: 'reports',
  };
};

/**
 * Create achievement notification
 * @param {Object} achievement - Achievement data
 * @returns {Object} Notification options
 */
export const createAchievementNotification = (achievement) => {
  return {
    title: `🏆 Achievement Unlocked: ${achievement.name}`,
    body: achievement.description,
    data: {
      type: NOTIFICATION_TYPES.ACHIEVEMENT,
      achievementId: achievement.id,
      screen: 'Achievements',
    },
    priority: NOTIFICATION_PRIORITIES.DEFAULT,
    channelId: 'default',
  };
};

/**
 * Create device notification
 * @param {Object} deviceData - Device data
 * @returns {Object} Notification options
 */
export const createDeviceNotification = (deviceData) => {
  const icons = {
    connected: '🔗',
    disconnected: '⚠️',
    lowBattery: '🔋',
    synced: '🔄',
    error: '❌',
  };

  const icon = icons[deviceData.status] || '📱';

  return {
    title: `${icon} Device ${deviceData.status}`,
    body: deviceData.message,
    data: {
      type: NOTIFICATION_TYPES.DEVICE,
      deviceStatus: deviceData.status,
      screen: 'Device',
    },
    priority: deviceData.status === 'error' ? NOTIFICATION_PRIORITIES.HIGH : NOTIFICATION_PRIORITIES.DEFAULT,
    channelId: 'device_alerts',
  };
};

/**
 * Schedule daily reminder
 * @param {Object} reminder - Reminder details
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @returns {Promise<string>} Notification ID
 */
export const scheduleDailyReminder = async (reminder, hour, minute) => {
  const trigger = {
    hour,
    minute,
    repeats: true,
  };

  const notification = createReminderNotification(reminder);
  return scheduleNotification({
    ...notification,
    trigger,
  });
};

/**
 * Schedule weekly reminder
 * @param {Object} reminder - Reminder details
 * @param {number} weekday - Weekday (1 = Monday, 7 = Sunday)
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @returns {Promise<string>} Notification ID
 */
export const scheduleWeeklyReminder = async (reminder, weekday, hour, minute) => {
  const trigger = {
    weekday,
    hour,
    minute,
    repeats: true,
  };

  const notification = createReminderNotification(reminder);
  return scheduleNotification({
    ...notification,
    trigger,
  });
};

/**
 * Schedule monthly reminder
 * @param {Object} reminder - Reminder details
 * @param {number} day - Day of month (1-31)
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @returns {Promise<string>} Notification ID
 */
export const scheduleMonthlyReminder = async (reminder, day, hour, minute) => {
  const trigger = {
    day,
    hour,
    minute,
    repeats: true,
  };

  const notification = createReminderNotification(reminder);
  return scheduleNotification({
    ...notification,
    trigger,
  });
};

/**
 * Schedule interval reminder
 * @param {Object} reminder - Reminder details
 * @param {number} intervalMinutes - Interval in minutes
 * @returns {Promise<string>} Notification ID
 */
export const scheduleIntervalReminder = async (reminder, intervalMinutes) => {
  const trigger = {
    seconds: intervalMinutes * 60,
    repeats: true,
  };

  const notification = createReminderNotification(reminder);
  return scheduleNotification({
    ...notification,
    trigger,
  });
};

/**
 * Show in-app alert
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {Array} buttons - Alert buttons
 */
export const showInAppAlert = (title, message, buttons = []) => {
  Alert.alert(
    title,
    message,
    buttons.length ? buttons : [{ text: 'OK' }]
  );
};

/**
 * Check if notifications are enabled
 * @returns {Promise<boolean>} Whether notifications are enabled
 */
export const areNotificationsEnabled = async () => {
  try {
    const settings = await Notifications.getPermissionsAsync();
    return settings.granted;
  } catch (error) {
    console.error('Error checking notifications:', error);
    return false;
  }
};

/**
 * Get notification settings
 * @returns {Promise<Object>} Notification settings
 */
export const getNotificationSettings = async () => {
  try {
    return await Notifications.getPermissionsAsync();
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return null;
  }
};

export default {
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITIES,
  scheduleNotification,
  sendImmediateNotification,
  cancelNotification,
  cancelAllNotifications,
  getScheduledNotifications,
  vibrate,
  playSound,
  createHealthAlertNotification,
  createReminderNotification,
  createDoshaUpdateNotification,
  createWeeklyReportNotification,
  createAchievementNotification,
  createDeviceNotification,
  scheduleDailyReminder,
  scheduleWeeklyReminder,
  scheduleMonthlyReminder,
  scheduleIntervalReminder,
  showInAppAlert,
  areNotificationsEnabled,
  getNotificationSettings,
};