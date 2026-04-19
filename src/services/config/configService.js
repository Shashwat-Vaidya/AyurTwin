import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import Constants from 'expo-constants';

class ConfigService {
  constructor() {
    this.config = null;
    this.environment = null;
    this.features = {};
    this.apiEndpoints = {};
    this.appConfig = {};
    this.userConfig = {};
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    // Load environment
    this.environment = this.getEnvironment();

    // Load app config
    this.appConfig = this.getAppConfig();

    // Load API endpoints
    this.apiEndpoints = this.getApiEndpoints();

    // Load feature flags
    this.features = this.getFeatureFlags();

    // Load user config
    await this.loadUserConfig();

    this.initialized = true;
  }

  getEnvironment() {
    if (__DEV__) {
      return 'development';
    }

    const releaseChannel = Constants.manifest?.releaseChannel;
    
    if (releaseChannel === 'production') {
      return 'production';
    } else if (releaseChannel === 'staging') {
      return 'staging';
    } else if (releaseChannel?.includes('beta')) {
      return 'beta';
    }

    return 'development';
  }

  getAppConfig() {
    return {
      appName: 'AyurTwin',
      appVersion: Application.nativeApplicationVersion,
      buildNumber: Application.nativeBuildVersion,
      platform: Platform.OS,
      platformVersion: Platform.Version,
      bundleId: Application.applicationId,
      environment: this.environment,
    };
  }

  getApiEndpoints() {
    const endpoints = {
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
      beta: {
        baseUrl: 'https://beta-api.ayurtwin.com',
        apiUrl: 'https://beta-api.ayurtwin.com/v1',
        wsUrl: 'wss://beta-api.ayurtwin.com',
        authUrl: 'https://beta-api.ayurtwin.com/auth',
        healthUrl: 'https://beta-api.ayurtwin.com/health',
      },
    };

    return endpoints[this.environment] || endpoints.development;
  }

  getFeatureFlags() {
    // Feature flags based on environment
    const flags = {
      development: {
        enableChatbot: true,
        enableAIPredictions: true,
        enableDeviceSync: true,
        enableReports: true,
        enableSocial: true,
        enableBetaFeatures: true,
        enableDebugTools: true,
        enableAnalytics: false,
        enableCrashReporting: false,
      },
      staging: {
        enableChatbot: true,
        enableAIPredictions: true,
        enableDeviceSync: true,
        enableReports: true,
        enableSocial: true,
        enableBetaFeatures: true,
        enableDebugTools: false,
        enableAnalytics: true,
        enableCrashReporting: true,
      },
      production: {
        enableChatbot: true,
        enableAIPredictions: true,
        enableDeviceSync: true,
        enableReports: true,
        enableSocial: false,
        enableBetaFeatures: false,
        enableDebugTools: false,
        enableAnalytics: true,
        enableCrashReporting: true,
      },
      beta: {
        enableChatbot: true,
        enableAIPredictions: true,
        enableDeviceSync: true,
        enableReports: true,
        enableSocial: true,
        enableBetaFeatures: true,
        enableDebugTools: false,
        enableAnalytics: true,
        enableCrashReporting: true,
      },
    };

    return flags[this.environment] || flags.development;
  }

  async loadUserConfig() {
    try {
      const config = await AsyncStorage.getItem('@config:user');
      if (config) {
        this.userConfig = JSON.parse(config);
      }
    } catch (error) {
      console.error('Error loading user config:', error);
      this.userConfig = {};
    }
  }

  async saveUserConfig() {
    try {
      await AsyncStorage.setItem('@config:user', JSON.stringify(this.userConfig));
    } catch (error) {
      console.error('Error saving user config:', error);
    }
  }

  // Getters
  getEnvironment() {
    return this.environment;
  }

  getAppConfig() {
    return this.appConfig;
  }

  getApiEndpoints() {
    return this.apiEndpoints;
  }

  getFeatureFlags() {
    return this.features;
  }

  getUserConfig() {
    return this.userConfig;
  }

  // Specific getters
  getApiUrl() {
    return this.apiEndpoints.apiUrl;
  }

  getBaseUrl() {
    return this.apiEndpoints.baseUrl;
  }

  getWsUrl() {
    return this.apiEndpoints.wsUrl;
  }

  getAuthUrl() {
    return this.apiEndpoints.authUrl;
  }

  getHealthUrl() {
    return this.apiEndpoints.healthUrl;
  }

  // Feature flag checks
  isFeatureEnabled(featureName) {
    return this.features[featureName] === true;
  }

  isChatbotEnabled() {
    return this.features.enableChatbot;
  }

  isAIPredictionsEnabled() {
    return this.features.enableAIPredictions;
  }

  isDeviceSyncEnabled() {
    return this.features.enableDeviceSync;
  }

  isReportsEnabled() {
    return this.features.enableReports;
  }

  isSocialEnabled() {
    return this.features.enableSocial;
  }

  isBetaFeaturesEnabled() {
    return this.features.enableBetaFeatures;
  }

  isDebugMode() {
    return this.features.enableDebugTools || __DEV__;
  }

  isAnalyticsEnabled() {
    return this.features.enableAnalytics;
  }

  isCrashReportingEnabled() {
    return this.features.enableCrashReporting;
  }

  // User config management
  async updateUserConfig(updates) {
    this.userConfig = { ...this.userConfig, ...updates };
    await this.saveUserConfig();
  }

  getUserPreference(key, defaultValue = null) {
    return this.userConfig[key] !== undefined ? this.userConfig[key] : defaultValue;
  }

  async setUserPreference(key, value) {
    this.userConfig[key] = value;
    await this.saveUserConfig();
  }

  // Timeouts and intervals
  getApiTimeout() {
    return this.userConfig.apiTimeout || 30000; // 30 seconds default
  }

  getSyncInterval() {
    return this.userConfig.syncInterval || 900000; // 15 minutes default
  }

  getRefreshInterval() {
    return this.userConfig.refreshInterval || 60000; // 1 minute default
  }

  // Cache settings
  getCacheTTL() {
    return this.userConfig.cacheTTL || 3600000; // 1 hour default
  }

  shouldCacheData() {
    return this.userConfig.cacheData !== false;
  }

  // Logging
  getLogLevel() {
    if (__DEV__) return 'debug';
    return this.userConfig.logLevel || 'error';
  }

  // Reset
  async resetToDefaults() {
    this.userConfig = {};
    await AsyncStorage.removeItem('@config:user');
  }

  // Refresh config
  async refresh() {
    await this.loadUserConfig();
    this.features = this.getFeatureFlags();
    this.apiEndpoints = this.getApiEndpoints();
  }
}

export default new ConfigService();