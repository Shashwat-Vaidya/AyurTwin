import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Application from 'expo-application';

/**
 * Environment configuration for different stages
 */
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
  BETA: 'beta',
  TEST: 'test',
};

/**
 * Get current environment
 * @returns {string} Current environment
 */
export const getEnvironment = () => {
  if (__DEV__) {
    return ENVIRONMENTS.DEVELOPMENT;
  }

  const releaseChannel = Constants.manifest?.releaseChannel;
  
  if (releaseChannel === ENVIRONMENTS.PRODUCTION) {
    return ENVIRONMENTS.PRODUCTION;
  } else if (releaseChannel === ENVIRONMENTS.STAGING) {
    return ENVIRONMENTS.STAGING;
  } else if (releaseChannel?.includes(ENVIRONMENTS.BETA)) {
    return ENVIRONMENTS.BETA;
  } else if (releaseChannel === ENVIRONMENTS.TEST) {
    return ENVIRONMENTS.TEST;
  }

  return ENVIRONMENTS.DEVELOPMENT;
};

/**
 * Check if current environment is development
 * @returns {boolean} True if development
 */
export const isDevelopment = () => {
  return getEnvironment() === ENVIRONMENTS.DEVELOPMENT;
};

/**
 * Check if current environment is staging
 * @returns {boolean} True if staging
 */
export const isStaging = () => {
  return getEnvironment() === ENVIRONMENTS.STAGING;
};

/**
 * Check if current environment is production
 * @returns {boolean} True if production
 */
export const isProduction = () => {
  return getEnvironment() === ENVIRONMENTS.PRODUCTION;
};

/**
 * Check if current environment is beta
 * @returns {boolean} True if beta
 */
export const isBeta = () => {
  return getEnvironment() === ENVIRONMENTS.BETA;
};

/**
 * Check if current environment is test
 * @returns {boolean} True if test
 */
export const isTest = () => {
  return getEnvironment() === ENVIRONMENTS.TEST;
};

/**
 * Get environment specific configuration
 */
export const ENV_CONFIG = {
  [ENVIRONMENTS.DEVELOPMENT]: {
    apiUrl: 'http://localhost:3000/api',
    baseUrl: 'http://localhost:3000',
    wsUrl: 'ws://localhost:3000',
    authUrl: 'http://localhost:3000/auth',
    healthUrl: 'http://localhost:3000/health',
    analyticsEnabled: false,
    crashReportingEnabled: false,
    debugMode: true,
    logLevel: 'debug',
    apiTimeout: 30000,
    cacheEnabled: true,
    cacheTTL: 300000, // 5 minutes
  },
  [ENVIRONMENTS.STAGING]: {
    apiUrl: 'https://staging-api.ayurtwin.com/v1',
    baseUrl: 'https://staging-api.ayurtwin.com',
    wsUrl: 'wss://staging-api.ayurtwin.com',
    authUrl: 'https://staging-api.ayurtwin.com/auth',
    healthUrl: 'https://staging-api.ayurtwin.com/health',
    analyticsEnabled: true,
    crashReportingEnabled: true,
    debugMode: false,
    logLevel: 'info',
    apiTimeout: 30000,
    cacheEnabled: true,
    cacheTTL: 900000, // 15 minutes
  },
  [ENVIRONMENTS.PRODUCTION]: {
    apiUrl: 'https://api.ayurtwin.com/v1',
    baseUrl: 'https://api.ayurtwin.com',
    wsUrl: 'wss://api.ayurtwin.com',
    authUrl: 'https://api.ayurtwin.com/auth',
    healthUrl: 'https://api.ayurtwin.com/health',
    analyticsEnabled: true,
    crashReportingEnabled: true,
    debugMode: false,
    logLevel: 'error',
    apiTimeout: 30000,
    cacheEnabled: true,
    cacheTTL: 3600000, // 1 hour
  },
  [ENVIRONMENTS.BETA]: {
    apiUrl: 'https://beta-api.ayurtwin.com/v1',
    baseUrl: 'https://beta-api.ayurtwin.com',
    wsUrl: 'wss://beta-api.ayurtwin.com',
    authUrl: 'https://beta-api.ayurtwin.com/auth',
    healthUrl: 'https://beta-api.ayurtwin.com/health',
    analyticsEnabled: true,
    crashReportingEnabled: true,
    debugMode: true,
    logLevel: 'debug',
    apiTimeout: 30000,
    cacheEnabled: true,
    cacheTTL: 900000, // 15 minutes
  },
  [ENVIRONMENTS.TEST]: {
    apiUrl: 'https://test-api.ayurtwin.com/v1',
    baseUrl: 'https://test-api.ayurtwin.com',
    wsUrl: 'wss://test-api.ayurtwin.com',
    authUrl: 'https://test-api.ayurtwin.com/auth',
    healthUrl: 'https://test-api.ayurtwin.com/health',
    analyticsEnabled: false,
    crashReportingEnabled: false,
    debugMode: true,
    logLevel: 'debug',
    apiTimeout: 30000,
    cacheEnabled: false,
    cacheTTL: 0,
  },
};

/**
 * Get current environment configuration
 * @returns {Object} Environment config
 */
export const getCurrentConfig = () => {
  const env = getEnvironment();
  return ENV_CONFIG[env] || ENV_CONFIG[ENVIRONMENTS.DEVELOPMENT];
};

/**
 * Get API URL for current environment
 * @returns {string} API URL
 */
export const getApiUrl = () => {
  return getCurrentConfig().apiUrl;
};

/**
 * Get WebSocket URL for current environment
 * @returns {string} WebSocket URL
 */
export const getWsUrl = () => {
  return getCurrentConfig().wsUrl;
};

/**
 * Get app information
 */
export const APP_INFO = {
  name: 'AyurTwin',
  version: Application.nativeApplicationVersion,
  buildNumber: Application.nativeBuildVersion,
  bundleId: Application.applicationId,
  platform: Platform.OS,
  platformVersion: Platform.Version,
};

/**
 * Feature flags based on environment
 */
export const FEATURE_FLAGS = {
  [ENVIRONMENTS.DEVELOPMENT]: {
    enableChatbot: true,
    enableAIPredictions: true,
    enableDeviceSync: true,
    enableReports: true,
    enableSocial: true,
    enableBetaFeatures: true,
    enableDebugTools: true,
    enableAnalytics: false,
    enableCrashReporting: false,
    enableOfflineMode: true,
    enablePushNotifications: true,
    enableBiometric: true,
    enableMultiDevice: true,
    enableDataExport: true,
    enableFamilySharing: true,
  },
  [ENVIRONMENTS.STAGING]: {
    enableChatbot: true,
    enableAIPredictions: true,
    enableDeviceSync: true,
    enableReports: true,
    enableSocial: true,
    enableBetaFeatures: true,
    enableDebugTools: false,
    enableAnalytics: true,
    enableCrashReporting: true,
    enableOfflineMode: true,
    enablePushNotifications: true,
    enableBiometric: true,
    enableMultiDevice: true,
    enableDataExport: true,
    enableFamilySharing: false,
  },
  [ENVIRONMENTS.PRODUCTION]: {
    enableChatbot: true,
    enableAIPredictions: true,
    enableDeviceSync: true,
    enableReports: true,
    enableSocial: false,
    enableBetaFeatures: false,
    enableDebugTools: false,
    enableAnalytics: true,
    enableCrashReporting: true,
    enableOfflineMode: true,
    enablePushNotifications: true,
    enableBiometric: true,
    enableMultiDevice: true,
    enableDataExport: true,
    enableFamilySharing: false,
  },
  [ENVIRONMENTS.BETA]: {
    enableChatbot: true,
    enableAIPredictions: true,
    enableDeviceSync: true,
    enableReports: true,
    enableSocial: true,
    enableBetaFeatures: true,
    enableDebugTools: true,
    enableAnalytics: true,
    enableCrashReporting: true,
    enableOfflineMode: true,
    enablePushNotifications: true,
    enableBiometric: true,
    enableMultiDevice: true,
    enableDataExport: true,
    enableFamilySharing: true,
  },
  [ENVIRONMENTS.TEST]: {
    enableChatbot: true,
    enableAIPredictions: true,
    enableDeviceSync: true,
    enableReports: true,
    enableSocial: true,
    enableBetaFeatures: true,
    enableDebugTools: true,
    enableAnalytics: false,
    enableCrashReporting: false,
    enableOfflineMode: true,
    enablePushNotifications: false,
    enableBiometric: true,
    enableMultiDevice: false,
    enableDataExport: true,
    enableFamilySharing: false,
  },
};

/**
 * Get feature flags for current environment
 * @returns {Object} Feature flags
 */
export const getFeatureFlags = () => {
  const env = getEnvironment();
  return FEATURE_FLAGS[env] || FEATURE_FLAGS[ENVIRONMENTS.DEVELOPMENT];
};

/**
 * Check if a feature is enabled
 * @param {string} feature - Feature name
 * @returns {boolean} True if enabled
 */
export const isFeatureEnabled = (feature) => {
  const flags = getFeatureFlags();
  return flags[feature] === true;
};

/**
 * Version comparison utilities
 */
export const compareVersions = (v1, v2) => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
};

/**
 * Check if app version is minimum required
 * @param {string} requiredVersion - Required version
 * @returns {boolean} True if current version meets requirement
 */
export const isMinimumVersion = (requiredVersion) => {
  return compareVersions(APP_INFO.version, requiredVersion) >= 0;
};

export default {
  ENVIRONMENTS,
  getEnvironment,
  isDevelopment,
  isStaging,
  isProduction,
  isBeta,
  isTest,
  getCurrentConfig,
  getApiUrl,
  getWsUrl,
  APP_INFO,
  FEATURE_FLAGS,
  getFeatureFlags,
  isFeatureEnabled,
  compareVersions,
  isMinimumVersion,
};