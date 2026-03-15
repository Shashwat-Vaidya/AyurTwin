import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

import apiClient from '../api/apiClient';

class AnalyticsService {
  constructor() {
    this.sessionId = null;
    this.userId = null;
    this.deviceInfo = null;
    this.isEnabled = true;
    this.eventQueue = [];
    this.flushInterval = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    this.sessionId = this.generateSessionId();
    this.deviceInfo = await this.getDeviceInfo();
    
    // Load user ID if available
    const user = await AsyncStorage.getItem('@auth:user');
    if (user) {
      this.userId = JSON.parse(user).id;
    }

    // Load analytics preference
    const settings = await AsyncStorage.getItem('@settings:data');
    if (settings) {
      this.isEnabled = JSON.parse(settings).analyticsEnabled !== false;
    }

    // Start flush interval
    this.startFlushInterval();

    // Track session start
    this.trackEvent('session_start', {
      sessionId: this.sessionId,
      ...this.deviceInfo,
    });

    this.initialized = true;
  }

  generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getDeviceInfo() {
    return {
      deviceType: Device.deviceType,
      deviceName: Device.deviceName,
      deviceYear: Device.deviceYearClass,
      osVersion: Device.osVersion,
      platform: Platform.OS,
      platformVersion: Platform.Version,
      appVersion: Application.nativeApplicationVersion,
      buildNumber: Application.nativeBuildVersion,
      isEmulator: Device.isDevice,
    };
  }

  startFlushInterval() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 30000); // Flush every 30 seconds
  }

  stopFlushInterval() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  setUser(userId, userProperties = {}) {
    this.userId = userId;
    this.trackEvent('identify', { userId, ...userProperties });
  }

  clearUser() {
    this.userId = null;
    this.trackEvent('session_end', { sessionId: this.sessionId });
    this.sessionId = this.generateSessionId();
  }

  enable() {
    this.isEnabled = true;
    this.trackEvent('analytics_enabled');
  }

  disable() {
    this.isEnabled = false;
    this.eventQueue = [];
    this.stopFlushInterval();
  }

  trackEvent(eventName, properties = {}) {
    if (!this.isEnabled) return;

    const event = {
      event: eventName,
      properties,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      deviceInfo: this.deviceInfo,
    };

    this.eventQueue.push(event);

    // Log in development
    if (__DEV__) {
      console.log('Analytics Event:', event);
    }

    // Flush immediately for critical events
    if (this.isCriticalEvent(eventName)) {
      this.flushEvents();
    }
  }

  isCriticalEvent(eventName) {
    const criticalEvents = [
      'error',
      'purchase',
      'subscription',
      'critical_alert',
      'login',
      'signup',
    ];
    return criticalEvents.includes(eventName);
  }

  async flushEvents() {
    if (this.eventQueue.length === 0 || !this.isEnabled) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await apiClient.post('/analytics/events', { events: eventsToSend });
    } catch (error) {
      // Re-queue events if send fails
      this.eventQueue = [...eventsToSend, ...this.eventQueue];
      
      // Keep queue size manageable
      if (this.eventQueue.length > 1000) {
        this.eventQueue = this.eventQueue.slice(-1000);
      }

      console.error('Failed to send analytics events:', error);
    }
  }

  // User actions
  trackLogin(method = 'email') {
    this.trackEvent('login', { method });
  }

  trackSignup(method = 'email') {
    this.trackEvent('signup', { method });
  }

  trackLogout() {
    this.trackEvent('logout');
  }

  // Screen views
  trackScreenView(screenName, screenClass) {
    this.trackEvent('screen_view', {
      screen_name: screenName,
      screen_class: screenClass,
    });
  }

  // User engagement
  trackAction(actionName, params = {}) {
    this.trackEvent('user_action', {
      action: actionName,
      ...params,
    });
  }

  // Health tracking
  trackHealthReading(readingType, value, unit) {
    this.trackEvent('health_reading', {
      type: readingType,
      value,
      unit,
    });
  }

  trackAlert(alertType, severity, message) {
    this.trackEvent('alert', {
      type: alertType,
      severity,
      message,
    });
  }

  trackGoalCompleted(goalType, target, achievement) {
    this.trackEvent('goal_completed', {
      goal_type: goalType,
      target,
      achievement,
    });
  }

  trackDoshaChange(dosha, previousValue, newValue) {
    this.trackEvent('dosha_change', {
      dosha,
      previous: previousValue,
      current: newValue,
      change: newValue - previousValue,
    });
  }

  trackRiskPrediction(disease, risk, factors) {
    this.trackEvent('risk_prediction', {
      disease,
      risk,
      factors: factors?.join(', '),
    });
  }

  // Feature usage
  trackFeatureUsed(featureName, action, duration = null) {
    this.trackEvent('feature_used', {
      feature: featureName,
      action,
      duration,
    });
  }

  trackApiCall(endpoint, method, statusCode, duration) {
    this.trackEvent('api_call', {
      endpoint,
      method,
      status_code: statusCode,
      duration_ms: duration,
    });
  }

  // Monetization
  trackSubscription(plan, action, price = null) {
    this.trackEvent('subscription', {
      plan,
      action,
      price,
    });
  }

  trackPurchase(productId, price, currency = 'USD') {
    this.trackEvent('purchase', {
      product_id: productId,
      price,
      currency,
    });
  }

  // Errors
  trackError(error, context = {}) {
    this.trackEvent('error', {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    });
  }

  // Performance
  trackPerformance(metricName, value, unit = 'ms') {
    this.trackEvent('performance', {
      metric: metricName,
      value,
      unit,
    });
  }

  // Custom events
  trackCustomEvent(category, action, label = null, value = null) {
    this.trackEvent('custom', {
      category,
      action,
      label,
      value,
    });
  }

  // Search
  trackSearch(query, resultsCount) {
    this.trackEvent('search', {
      query,
      results_count: resultsCount,
    });
  }

  // Sharing
  trackShare(contentType, method) {
    this.trackEvent('share', {
      content_type: contentType,
      method,
    });
  }

  // Notifications
  trackNotification(notificationType, action) {
    this.trackEvent('notification', {
      type: notificationType,
      action,
    });
  }

  // Cleanup
  async cleanup() {
    await this.flushEvents();
    this.stopFlushInterval();
    this.initialized = false;
  }

  // Get queue size
  getQueueSize() {
    return this.eventQueue.length;
  }

  // Get session ID
  getSessionId() {
    return this.sessionId;
  }
}

export default new AnalyticsService();