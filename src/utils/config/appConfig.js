import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Application from 'expo-application';

/**
 * Application configuration constants
 */
export const APP_CONFIG = {
  // App Information
  name: 'AyurTwin',
  version: Application.nativeApplicationVersion || '1.0.0',
  buildNumber: Application.nativeBuildVersion || '1',
  bundleId: Application.applicationId || 'com.ayurtwin.app',
  
  // Environment
  environment: __DEV__ ? 'development' : 'production',
  isDev: __DEV__,
  isProd: !__DEV__,
  
  // Platform
  platform: Platform.OS,
  platformVersion: Platform.Version,
  
  // Release Channel
  releaseChannel: Constants.manifest?.releaseChannel || 'default',
};

/**
 * Feature flags configuration
 */
export const FEATURE_FLAGS = {
  // Core features
  enableChatbot: true,
  enableAIPredictions: true,
  enableDeviceSync: true,
  enableReports: true,
  enableSocial: false,
  
  // Beta features
  enableBetaFeatures: __DEV__,
  enableDebugTools: __DEV__,
  
  // Analytics
  enableAnalytics: !__DEV__,
  enableCrashReporting: !__DEV__,
  
  // Performance
  enableOfflineMode: true,
  enablePushNotifications: true,
  enableBiometric: true,
  enableMultiDevice: true,
  
  // Data management
  enableDataExport: true,
  enableDataImport: true,
  enableDataBackup: true,
  
  // Health features
  enableHeartRate: true,
  enableSpO2: true,
  enableTemperature: true,
  enableStress: true,
  enableSleep: true,
  enableActivity: true,
  enableBloodPressure: true,
  enableHRV: true,
  enableGlucose: true,
  enableRespiratoryRate: true,
  
  // Ayurvedic features
  enableDoshaAnalysis: true,
  enablePrakritiQuiz: true,
  enableAyurvedicTips: true,
  enableSeasonalAdvice: true,
  enableHerbRecommendations: true,
  
  // Lifestyle features
  enableDietTracking: true,
  enableWaterTracking: true,
  enableExerciseTracking: true,
  enableMeditation: true,
  enableMoodTracking: true,
  enableJournal: true,
  enableRecipes: true,
};

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  development: {
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3000/api',
    wsUrl: 'ws://localhost:3000',
    authUrl: 'http://localhost:3000/auth',
    healthUrl: 'http://localhost:3000/health',
  },
  staging: {
    baseUrl: 'https://staging-api.ayurtwin.com',
    apiUrl: 'https://staging-api.ayurtwin.com/v1',
    wsUrl: 'wss://staging-api.ayurtwin.com',
    authUrl: 'https://staging-api.ayurtwin.com/auth',
    healthUrl: 'https://staging-api.ayurtwin.com/health',
  },
  production: {
    baseUrl: 'https://api.ayurtwin.com',
    apiUrl: 'https://api.ayurtwin.com/v1',
    wsUrl: 'wss://api.ayurtwin.com',
    authUrl: 'https://api.ayurtwin.com/auth',
    healthUrl: 'https://api.ayurtwin.com/health',
  },
};

/**
 * Timeout configurations (in milliseconds)
 */
export const TIMEOUTS = {
  api: 30000,           // 30 seconds
  websocket: 10000,      // 10 seconds
  sync: 60000,           // 1 minute
  scan: 5000,            // 5 seconds
  animation: 300,        // 300ms
  debounce: 500,         // 500ms
  throttle: 1000,        // 1 second
};

/**
 * Cache configurations (in milliseconds)
 */
export const CACHE_CONFIG = {
  healthData: 5 * 60 * 1000,        // 5 minutes
  userProfile: 30 * 60 * 1000,      // 30 minutes
  settings: 60 * 60 * 1000,         // 1 hour
  diseaseRisks: 60 * 60 * 1000,     // 1 hour
  articles: 24 * 60 * 60 * 1000,    // 24 hours
  staticContent: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Sync intervals (in milliseconds)
 */
export const SYNC_INTERVALS = {
  healthData: 15 * 60 * 1000,       // 15 minutes
  deviceData: 5 * 60 * 1000,        // 5 minutes
  alerts: 1 * 60 * 1000,            // 1 minute
  reports: 60 * 60 * 1000,          // 1 hour
};

/**
 * Pagination defaults
 */
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
  infiniteScrollThreshold: 100,
};

/**
 * Chart defaults
 */
export const CHART_CONFIG = {
  defaultHeight: 200,
  defaultWidth: 300,
  animationDuration: 750,
  bezier: true,
  showDots: true,
  showLegend: true,
};

/**
 * Sensor ranges and thresholds
 */
export const SENSOR_CONFIG = {
  heartRate: {
    min: 40,
    max: 220,
    normalMin: 60,
    normalMax: 100,
    warningMin: 50,
    warningMax: 120,
  },
  spo2: {
    min: 50,
    max: 100,
    normalMin: 95,
    warningMin: 90,
    criticalMin: 85,
  },
  temperature: {
    min: 32,
    max: 42,
    normalMin: 36.1,
    normalMax: 37.2,
    warningMin: 35.5,
    warningMax: 37.8,
  },
  stress: {
    min: 0,
    max: 100,
    lowMax: 30,
    moderateMax: 50,
    highMax: 70,
  },
};

/**
 * Notification channels (Android)
 */
export const NOTIFICATION_CHANNELS = {
  healthAlerts: {
    id: 'health_alerts',
    name: 'Health Alerts',
    importance: 'high',
    description: 'Critical health notifications',
  },
  reminders: {
    id: 'reminders',
    name: 'Reminders',
    importance: 'default',
    description: 'Daily health reminders',
  },
  doshaUpdates: {
    id: 'dosha_updates',
    name: 'Dosha Updates',
    importance: 'default',
    description: 'Dosha balance notifications',
  },
  reports: {
    id: 'reports',
    name: 'Health Reports',
    importance: 'low',
    description: 'Weekly and monthly reports',
  },
  deviceAlerts: {
    id: 'device_alerts',
    name: 'Device Alerts',
    importance: 'default',
    description: 'Device connection and battery alerts',
  },
};

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  auth: {
    token: '@auth:token',
    refreshToken: '@auth:refreshToken',
    user: '@auth:user',
    biometric: '@auth:biometric',
  },
  user: {
    profile: '@user:profile',
    settings: '@user:settings',
    preferences: '@user:preferences',
  },
  health: {
    data: '@health:data',
    readings: '@health:readings',
    risks: '@health:risks',
    dosha: '@health:dosha',
  },
  app: {
    onboarding: '@app:onboarding',
    theme: '@app:theme',
    language: '@app:language',
    installTime: '@app:installTime',
  },
  cache: {
    prefix: '@cache:',
    articles: '@cache:articles',
    images: '@cache:images',
  },
  offline: {
    queue: '@offline:queue',
    actions: '@offline:actions',
  },
  analytics: {
    events: '@analytics:events',
    userProps: '@analytics:userProps',
  },
};

/**
 * Regular expressions for validation
 */
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  name: /^[a-zA-Z\s\-']+$/,
  bloodGroup: /^(A|B|AB|O)[+-]$/,
  pincode: /^\d{6}$/,
};

/**
 * Supported languages
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
];

/**
 * Theme options
 */
export const THEME_OPTIONS = {
  light: {
    id: 'light',
    name: 'Light',
    colors: {
      background: '#FFFFFF',
      surface: '#F8FAF5',
      text: '#1A2E3F',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    colors: {
      background: '#1A1A1A',
      surface: '#2A2A2A',
      text: '#FFFFFF',
    },
  },
  system: {
    id: 'system',
    name: 'System Default',
  },
};

/**
 * Date formats
 */
export const DATE_FORMATS = {
  full: 'MMMM DD, YYYY',
  long: 'MMM DD, YYYY',
  medium: 'MM/DD/YYYY',
  short: 'MM/DD/YY',
  time: 'HH:mm A',
  datetime: 'MM/DD/YYYY HH:mm A',
  iso: 'YYYY-MM-DD',
  isoDateTime: 'YYYY-MM-DDTHH:mm:ss.sssZ',
};

export default {
  APP_CONFIG,
  FEATURE_FLAGS,
  API_ENDPOINTS,
  TIMEOUTS,
  CACHE_CONFIG,
  SYNC_INTERVALS,
  PAGINATION,
  CHART_CONFIG,
  SENSOR_CONFIG,
  NOTIFICATION_CHANNELS,
  STORAGE_KEYS,
  VALIDATION_PATTERNS,
  SUPPORTED_LANGUAGES,
  THEME_OPTIONS,
  DATE_FORMATS,
};