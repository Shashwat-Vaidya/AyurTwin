import analyticsService from '../../services/analytics/analyticsService';
import { EVENT_CATEGORIES, EVENT_PRIORITIES } from '../../services/analytics/events';

class EventTracker {
  constructor() {
    this.enabled = true;
    this.sessionStartTime = null;
    this.screenStartTime = null;
    this.currentScreen = null;
    this.userProperties = {};
    this.eventQueue = [];
  }

  initialize() {
    this.sessionStartTime = Date.now();
    this.trackSessionStart();
  }

  trackSessionStart() {
    this.track('session_start', {
      timestamp: this.sessionStartTime,
      category: EVENT_CATEGORIES.SESSION,
    });
  }

  trackSessionEnd() {
    const sessionDuration = Date.now() - this.sessionStartTime;
    this.track('session_end', {
      duration: sessionDuration,
      category: EVENT_CATEGORIES.SESSION,
    });
  }

  trackScreenView(screenName, screenClass = null) {
    const previousScreen = this.currentScreen;
    const timeOnScreen = this.screenStartTime ? Date.now() - this.screenStartTime : 0;

    if (previousScreen) {
      this.track('screen_exit', {
        screen: previousScreen,
        duration: timeOnScreen,
        category: EVENT_CATEGORIES.SESSION,
      });
    }

    this.currentScreen = screenName;
    this.screenStartTime = Date.now();

    this.track('screen_view', {
      screen_name: screenName,
      screen_class: screenClass,
      previous_screen: previousScreen,
      category: EVENT_CATEGORIES.SESSION,
    });
  }

  trackUserAction(action, params = {}) {
    this.track('user_action', {
      action,
      screen: this.currentScreen,
      ...params,
      category: EVENT_CATEGORIES.USER,
    });
  }

  trackFeatureUsed(feature, action, value = null) {
    this.track('feature_used', {
      feature,
      action,
      value,
      screen: this.currentScreen,
      category: EVENT_CATEGORIES.APP,
    });
  }

  trackApiCall(endpoint, method, status, duration, responseSize = null) {
    this.track('api_call', {
      endpoint,
      method,
      status,
      duration_ms: duration,
      response_size: responseSize,
      category: EVENT_CATEGORIES.PERFORMANCE,
      priority: status >= 400 ? EVENT_PRIORITIES.HIGH : EVENT_PRIORITIES.LOW,
    });
  }

  trackError(error, context = {}) {
    this.track('error', {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack,
      screen: this.currentScreen,
      ...context,
      category: EVENT_CATEGORIES.ERROR,
      priority: EVENT_PRIORITIES.HIGH,
    });
  }

  trackHealthMetric(metricType, value, unit, metadata = {}) {
    this.track('health_metric', {
      metric_type: metricType,
      value,
      unit,
      ...metadata,
      category: EVENT_CATEGORIES.HEALTH,
    });
  }

  trackAlert(alertType, severity, message, metadata = {}) {
    this.track('alert', {
      alert_type: alertType,
      severity,
      message,
      ...metadata,
      category: EVENT_CATEGORIES.ALERT,
      priority: severity === 'critical' ? EVENT_PRIORITIES.CRITICAL : EVENT_PRIORITIES.HIGH,
    });
  }

  trackGoalProgress(goalType, target, current, unit = null) {
    const progress = (current / target) * 100;
    
    this.track('goal_progress', {
      goal_type: goalType,
      target,
      current,
      progress,
      unit,
      category: EVENT_CATEGORIES.GOAL,
    });

    if (progress >= 100) {
      this.track('goal_completed', {
        goal_type: goalType,
        target,
        achievement: current,
        unit,
        category: EVENT_CATEGORIES.GOAL,
        priority: EVENT_PRIORITIES.MEDIUM,
      });
    }
  }

  trackSubscription(plan, action, price = null) {
    this.track('subscription', {
      plan,
      action,
      price,
      category: EVENT_CATEGORIES.SUBSCRIPTION,
      priority: EVENT_PRIORITIES.HIGH,
    });
  }

  trackPurchase(productId, price, currency = 'USD', metadata = {}) {
    this.track('purchase', {
      product_id: productId,
      price,
      currency,
      ...metadata,
      category: EVENT_CATEGORIES.SUBSCRIPTION,
      priority: EVENT_PRIORITIES.CRITICAL,
    });
  }

  trackDoshaChange(dosha, previousValue, newValue) {
    const change = newValue - previousValue;
    
    this.track('dosha_change', {
      dosha,
      previous: previousValue,
      current: newValue,
      change,
      category: EVENT_CATEGORIES.DOSHA,
    });

    if (Math.abs(change) > 15) {
      this.track('dosha_imbalance', {
        dosha,
        change,
        category: EVENT_CATEGORIES.DOSHA,
        priority: EVENT_PRIORITIES.MEDIUM,
      });
    }
  }

  trackSearch(query, resultsCount, filters = {}) {
    this.track('search', {
      query,
      results_count: resultsCount,
      filters,
      category: EVENT_CATEGORIES.SEARCH,
    });
  }

  trackShare(contentType, method, contentId = null) {
    this.track('share', {
      content_type: contentType,
      method,
      content_id: contentId,
      category: EVENT_CATEGORIES.SOCIAL,
    });
  }

  trackNotification(notificationType, action, notificationId = null) {
    this.track('notification', {
      notification_type: notificationType,
      action,
      notification_id: notificationId,
      category: EVENT_CATEGORIES.APP,
    });
  }

  trackFeedback(feedbackType, rating = null, hasComment = false) {
    this.track('feedback', {
      feedback_type: feedbackType,
      rating,
      has_comment: hasComment,
      category: EVENT_CATEGORIES.FEEDBACK,
      priority: EVENT_PRIORITIES.HIGH,
    });
  }

  trackPerformance(metric, value, unit = 'ms', tags = {}) {
    this.track('performance', {
      metric,
      value,
      unit,
      ...tags,
      category: EVENT_CATEGORIES.PERFORMANCE,
    });
  }

  trackCustomEvent(eventName, properties = {}) {
    this.track(eventName, properties);
  }

  track(eventName, properties = {}) {
    if (!this.enabled) return;

    const event = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: Date.now(),
        session_time: Date.now() - this.sessionStartTime,
        screen: this.currentScreen,
        ...this.userProperties,
      },
    };

    // Add to queue
    this.eventQueue.push(event);

    // Send immediately for high priority events
    if (properties.priority === EVENT_PRIORITIES.CRITICAL || 
        properties.priority === EVENT_PRIORITIES.HIGH) {
      this.flush();
    }

    // Log in development
    if (__DEV__) {
      console.log('Event tracked:', eventName, properties);
    }
  }

  async flush() {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await analyticsService.trackEvents(events);
    } catch (error) {
      console.error('Failed to send events:', error);
      // Re-queue failed events
      this.eventQueue = [...events, ...this.eventQueue];
      
      // Limit queue size
      if (this.eventQueue.length > 1000) {
        this.eventQueue = this.eventQueue.slice(-1000);
      }
    }
  }

  setUserProperties(properties) {
    this.userProperties = {
      ...this.userProperties,
      ...properties,
    };
  }

  clearUserProperties() {
    this.userProperties = {};
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
    this.eventQueue = [];
  }

  getQueueSize() {
    return this.eventQueue.length;
  }

  getSessionDuration() {
    return Date.now() - this.sessionStartTime;
  }
}

export default new EventTracker();