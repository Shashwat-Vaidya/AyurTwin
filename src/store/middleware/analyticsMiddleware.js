import { ALL_EVENTS, EVENT_PRIORITIES } from '../../services/analytics/events';
import analyticsService from '../../services/analytics/analyticsService';
import eventTracker from '../../utils/analytics/eventTracker';

// Action types to track
const TRACKED_ACTIONS = [
  // Auth actions
  'auth/login/fulfilled',
  'auth/login/rejected',
  'auth/logout',
  'auth/register/fulfilled',
  'auth/register/rejected',
  
  // User actions
  'user/updateProfile/fulfilled',
  'user/updateSettings/fulfilled',
  
  // Health data actions
  'healthData/updateCurrentReadings',
  'healthData/updateDiseaseRisks',
  'healthData/updateDoshaBalance',
  
  // Alert actions
  'alerts/addAlert',
  'alerts/resolveAlert',
  'alerts/markAsRead',
  
  // Goal actions
  'goals/completeGoal',
  'goals/updateProgress',
];

// Screen view tracking
const SCREEN_ACTIONS = [
  'navigation/NAVIGATE',
  'navigation/GO_BACK',
];

const analyticsMiddleware = store => next => action => {
  const result = next(action);
  
  // Track screen views
  if (SCREEN_ACTIONS.includes(action.type)) {
    trackScreenView(action);
  }
  
  // Track specific actions
  if (TRACKED_ACTIONS.includes(action.type)) {
    trackAction(action, store);
  }
  
  // Track errors
  if (action.type.endsWith('rejected')) {
    trackError(action);
  }
  
  // Track performance
  if (action.meta?.startTime) {
    trackPerformance(action);
  }
  
  return result;
};

const trackScreenView = (action) => {
  const screenName = action.payload?.name || action.payload?.params?.screen;
  const screenClass = action.payload?.params?.screenClass;
  
  if (screenName) {
    eventTracker.trackScreenView(screenName, screenClass);
  }
};

const trackAction = (action, store) => {
  const state = store.getState();
  const { type, payload, meta } = action;
  
  // Map Redux actions to analytics events
  switch (type) {
    case 'auth/login/fulfilled':
      analyticsService.trackLogin('email');
      eventTracker.setUser(payload.user);
      break;
      
    case 'auth/login/rejected':
      analyticsService.trackEvent('login_failed', {
        error: payload?.message,
      });
      break;
      
    case 'auth/logout':
      analyticsService.trackLogout();
      eventTracker.clearUserProperties();
      break;
      
    case 'auth/register/fulfilled':
      analyticsService.trackSignup('email');
      break;
      
    case 'healthData/updateCurrentReadings':
      trackHealthData(payload, state);
      break;
      
    case 'healthData/updateDiseaseRisks':
      trackDiseaseRisks(payload);
      break;
      
    case 'healthData/updateDoshaBalance':
      trackDoshaBalance(payload, state);
      break;
      
    case 'alerts/addAlert':
      trackAlert(payload);
      break;
      
    case 'alerts/resolveAlert':
      analyticsService.trackAlert('alert_resolved', payload.severity);
      break;
      
    case 'goals/completeGoal':
      analyticsService.trackGoalCompleted(payload.type, payload.target, payload.achievement);
      break;
      
    default:
      // Track custom events for other actions
      if (meta?.analytics) {
        analyticsService.trackCustomEvent(
          meta.analytics.category,
          meta.analytics.action,
          meta.analytics.label,
          meta.analytics.value
        );
      }
  }
};

const trackHealthData = (payload, state) => {
  const { heartRate, spo2, temperature, stress } = payload;
  const previous = state.healthData.currentReadings;
  
  // Track significant changes
  if (heartRate && previous.heartRate) {
    const change = Math.abs(heartRate - previous.heartRate);
    if (change > 10) {
      analyticsService.trackHealthReading('heart_rate_significant_change', change, 'bpm');
    }
  }
  
  if (stress && previous.stress) {
    const change = Math.abs(stress - previous.stress);
    if (change > 20) {
      analyticsService.trackHealthReading('stress_significant_change', change, '');
    }
  }
  
  // Track out-of-range readings
  if (heartRate && (heartRate < 50 || heartRate > 120)) {
    analyticsService.trackAlert('heart_rate', 'abnormal', `HR: ${heartRate}`);
  }
  
  if (spo2 && spo2 < 95) {
    analyticsService.trackAlert('spo2', 'low', `SpO2: ${spo2}`);
  }
  
  if (temperature && (temperature < 36 || temperature > 37.5)) {
    analyticsService.trackAlert('temperature', 'abnormal', `Temp: ${temperature}`);
  }
  
  if (stress && stress > 70) {
    analyticsService.trackAlert('stress', 'high', `Stress: ${stress}`);
  }
};

const trackDiseaseRisks = (risks) => {
  risks.forEach(risk => {
    if (risk.risk > 70) {
      analyticsService.trackRiskPrediction(risk.name, risk.risk, risk.factors);
    }
  });
};

const trackDoshaBalance = (payload, state) => {
  const previous = state.healthData.doshaBalance;
  
  if (previous) {
    ['vata', 'pitta', 'kapha'].forEach(dosha => {
      const change = Math.abs(payload[dosha] - previous[dosha]);
      if (change > 15) {
        analyticsService.trackDoshaChange(dosha, previous[dosha], payload[dosha]);
      }
    });
  }
};

const trackAlert = (alert) => {
  analyticsService.trackAlert(alert.type, alert.severity, alert.message);
  
  if (alert.severity === 'critical') {
    analyticsService.trackEvent('critical_alert', {
      type: alert.type,
      message: alert.message,
    });
  }
};

const trackError = (action) => {
  analyticsService.trackError(new Error(action.error?.message || 'Unknown error'), {
    action: action.type,
    payload: action.payload,
  });
};

const trackPerformance = (action) => {
  const duration = Date.now() - action.meta.startTime;
  analyticsService.trackPerformance(action.type, duration, 'ms');
};

// Middleware factory for creating analytics middleware with custom options
export const createAnalyticsMiddleware = (options = {}) => {
  const {
    trackAllActions = false,
    excludedActions = [],
    onTrack = null,
  } = options;

  return store => next => action => {
    const result = next(action);
    
    // Skip excluded actions
    if (excludedActions.includes(action.type)) {
      return result;
    }
    
    // Track all actions if configured
    if (trackAllActions) {
      eventTracker.trackAction(action.type, {
        payload: action.payload,
        timestamp: Date.now(),
      });
    }
    
    // Custom tracking callback
    if (onTrack) {
      onTrack(action, store);
    }
    
    return result;
  };
};

// Middleware for tracking user engagement
export const engagementMiddleware = store => next => action => {
  const result = next(action);
  
  // Track user engagement time
  if (action.type === 'navigation/NAVIGATE') {
    const state = store.getState();
    const lastActive = state.analytics?.lastActive;
    const now = Date.now();
    
    if (lastActive) {
      const sessionDuration = now - lastActive;
      if (sessionDuration > 30000) { // More than 30 seconds
        analyticsService.trackEvent('user_engaged', {
          duration: sessionDuration,
          screen: action.payload?.name,
        });
      }
    }
  }
  
  return result;
};

// Middleware for tracking feature usage
export const featureUsageMiddleware = (featureName) => store => next => action => {
  const result = next(action);
  
  if (action.type === `${featureName}/use`) {
    analyticsService.trackFeatureUsed(featureName, action.payload?.action);
  }
  
  return result;
};

export default analyticsMiddleware;