import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

import storageService from '../services/storage/asyncStorage';

class AnalyticsEvent {
  constructor(name, properties = {}) {
    this.name = name;
    this.properties = properties;
    this.timestamp = new Date().toISOString();
    this.sessionId = null;
    this.userId = null;
  }
}

export const useAnalytics = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [events, setEvents] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    initializeAnalytics();
    loadSettings();
  }, []);

  const initializeAnalytics = async () => {
    // Generate session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);

    // Collect device info
    const info = {
      deviceType: Device.deviceType,
      deviceName: Device.deviceName,
      deviceYear: Device.deviceYearClass,
      osVersion: Device.osVersion,
      platform: Platform.OS,
      platformVersion: Platform.Version,
      appVersion: Application.nativeApplicationVersion,
      buildNumber: Application.nativeBuildVersion,
    };
    setDeviceInfo(info);

    // Track session start
    trackEvent('session_start', { sessionId: newSessionId });
  };

  const loadSettings = async () => {
    const settings = await storageService.getSettings();
    setIsEnabled(settings?.analyticsEnabled !== false);
  };

  const setUser = useCallback((id, properties = {}) => {
    setUserId(id);
    trackEvent('identify', { userId: id, ...properties });
  }, []);

  const trackEvent = useCallback((eventName, properties = {}) => {
    if (!isEnabled) return;

    const event = new AnalyticsEvent(eventName, properties);
    event.sessionId = sessionId;
    event.userId = userId;

    // Add to local queue
    setEvents(prev => [...prev, event]);

    // In production, send to analytics service
    if (__DEV__) {
      console.log('Analytics Event:', event);
    }

    // Store in AsyncStorage for later sync
    storeEvent(event);
  }, [isEnabled, sessionId, userId]);

  const trackScreen = useCallback((screenName, properties = {}) => {
    trackEvent('screen_view', { screen: screenName, ...properties });
  }, [trackEvent]);

  const trackAction = useCallback((actionName, properties = {}) => {
    trackEvent('user_action', { action: actionName, ...properties });
  }, [trackEvent]);

  const trackError = useCallback((error, properties = {}) => {
    trackEvent('error', {
      error: error.message,
      stack: error.stack,
      ...properties,
    });
  }, [trackEvent]);

  const trackApiCall = useCallback((endpoint, method, status, duration) => {
    trackEvent('api_call', {
      endpoint,
      method,
      status,
      duration,
    });
  }, [trackEvent]);

  const trackFeature = useCallback((featureName, action, properties = {}) => {
    trackEvent('feature_used', {
      feature: featureName,
      action,
      ...properties,
    });
  }, [trackEvent]);

  const storeEvent = async (event) => {
    try {
      const storedEvents = await AsyncStorage.getItem('@analytics:events');
      const events = storedEvents ? JSON.parse(storedEvents) : [];
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.shift();
      }
      
      await AsyncStorage.setItem('@analytics:events', JSON.stringify(events));
    } catch (error) {
      console.error('Error storing analytics event:', error);
    }
  };

  const syncEvents = useCallback(async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('@analytics:events');
      if (!storedEvents) return;

      const events = JSON.parse(storedEvents);
      
      // In production, send to your analytics server
      // await apiClient.post('/analytics/events', { events });
      
      // Clear after successful sync
      await AsyncStorage.removeItem('@analytics:events');
      
      setEvents([]);
    } catch (error) {
      console.error('Error syncing analytics events:', error);
    }
  }, []);

  const enableAnalytics = useCallback(() => {
    setIsEnabled(true);
    storageService.updateSettings({ analyticsEnabled: true });
    trackEvent('analytics_enabled');
  }, [trackEvent]);

  const disableAnalytics = useCallback(() => {
    setIsEnabled(false);
    storageService.updateSettings({ analyticsEnabled: false });
  }, []);

  const clearEvents = useCallback(async () => {
    await AsyncStorage.removeItem('@analytics:events');
    setEvents([]);
  }, []);

  const getEvents = useCallback(() => {
    return events;
  }, [events]);

  const getEventCount = useCallback(() => {
    return events.length;
  }, [events]);

  // Predefined events
  const trackLogin = useCallback((method) => {
    trackEvent('login', { method });
  }, [trackEvent]);

  const trackSignUp = useCallback((method) => {
    trackEvent('sign_up', { method });
  }, [trackEvent]);

  const trackLogout = useCallback(() => {
    trackEvent('logout');
  }, [trackEvent]);

  const trackHealthReading = useCallback((type, value) => {
    trackEvent('health_reading', { type, value });
  }, [trackEvent]);

  const trackAlert = useCallback((alertType, severity) => {
    trackEvent('alert_received', { type: alertType, severity });
  }, [trackEvent]);

  const trackGoalCompleted = useCallback((goalType, target) => {
    trackEvent('goal_completed', { type: goalType, target });
  }, [trackEvent]);

  const trackSubscription = useCallback((plan, action) => {
    trackEvent('subscription', { plan, action });
  }, [trackEvent]);

  const trackShare = useCallback((contentType) => {
    trackEvent('share', { content_type: contentType });
  }, [trackEvent]);

  const trackSearch = useCallback((query, resultsCount) => {
    trackEvent('search', { query, results_count: resultsCount });
  }, [trackEvent]);

  const trackNotification = useCallback((type, action) => {
    trackEvent('notification', { type, action });
  }, [trackEvent]);

  const trackDoshaChange = useCallback((dosha, change) => {
    trackEvent('dosha_change', { dosha, change });
  }, [trackEvent]);

  const trackRiskPrediction = useCallback((disease, risk) => {
    trackEvent('risk_prediction', { disease, risk });
  }, [trackEvent]);

  return {
    // State
    isEnabled,
    sessionId,
    userId,
    events,
    deviceInfo,

    // Core methods
    setUser,
    trackEvent,
    trackScreen,
    trackAction,
    trackError,
    trackApiCall,
    trackFeature,
    syncEvents,
    enableAnalytics,
    disableAnalytics,
    clearEvents,
    getEvents,
    getEventCount,

    // Predefined events
    trackLogin,
    trackSignUp,
    trackLogout,
    trackHealthReading,
    trackAlert,
    trackGoalCompleted,
    trackSubscription,
    trackShare,
    trackSearch,
    trackNotification,
    trackDoshaChange,
    trackRiskPrediction,
  };
};

export default useAnalytics;