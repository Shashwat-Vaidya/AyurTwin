import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Device from 'expo-device';

import analyticsService from '../../services/analytics/analyticsService';

class UserProperties {
  constructor() {
    this.properties = {};
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    await this.loadProperties();
    await this.setDeviceProperties();
    await this.setAppProperties();
    
    this.initialized = true;
  }

  async loadProperties() {
    try {
      const saved = await AsyncStorage.getItem('@analytics:userProperties');
      if (saved) {
        this.properties = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading user properties:', error);
    }
  }

  async saveProperties() {
    try {
      await AsyncStorage.setItem('@analytics:userProperties', JSON.stringify(this.properties));
    } catch (error) {
      console.error('Error saving user properties:', error);
    }
  }

  async setDeviceProperties() {
    this.properties.device = {
      deviceType: Device.deviceType,
      deviceName: Device.deviceName,
      deviceYear: Device.deviceYearClass,
      osVersion: Device.osVersion,
      osBuildId: Device.osBuildId,
      platform: Platform.OS,
      platformVersion: Platform.Version,
      isEmulator: !Device.isDevice,
      brand: Device.brand,
      manufacturer: Device.manufacturer,
      modelName: Device.modelName,
      modelId: Device.modelId,
      designName: Device.designName,
      productName: Device.productName,
      supportedCpuArchitectures: Device.supportedCpuArchitectures,
      totalMemory: Device.totalMemory,
    };
  }

  async setAppProperties() {
    this.properties.app = {
      appVersion: Application.nativeApplicationVersion,
      buildNumber: Application.nativeBuildVersion,
      bundleId: Application.applicationId,
      installationTime: await this.getInstallationTime(),
      updateTime: await this.getUpdateTime(),
    };
  }

  async getInstallationTime() {
    try {
      const installTime = await AsyncStorage.getItem('@app:installTime');
      if (installTime) {
        return parseInt(installTime);
      }
      const now = Date.now();
      await AsyncStorage.setItem('@app:installTime', now.toString());
      return now;
    } catch (error) {
      return Date.now();
    }
  }

  async getUpdateTime() {
    try {
      const updateTime = await AsyncStorage.getItem('@app:updateTime');
      if (updateTime) {
        return parseInt(updateTime);
      }
      return Date.now();
    } catch (error) {
      return Date.now();
    }
  }

  setUserProperties(user) {
    if (user) {
      this.properties.user = {
        userId: user.id,
        email: user.email,
        name: user.fullName,
        age: user.age,
        gender: user.gender,
        createdAt: user.createdAt,
        isPremium: user.isPremium || false,
        subscriptionTier: user.subscriptionTier || 'free',
        doshaType: user.prakriti?.type,
        doshaVata: user.prakriti?.vata,
        doshaPitta: user.prakriti?.pitta,
        doshaKapha: user.prakriti?.kapha,
      };
    } else {
      delete this.properties.user;
    }

    this.saveProperties();
    this.updateAnalytics();
  }

  updateUserProperties(updates) {
    this.properties.user = {
      ...this.properties.user,
      ...updates,
    };
    this.saveProperties();
    this.updateAnalytics();
  }

  setUserPreference(key, value) {
    if (!this.properties.preferences) {
      this.properties.preferences = {};
    }
    this.properties.preferences[key] = value;
    this.saveProperties();
    this.updateAnalytics();
  }

  setUserPreferences(preferences) {
    this.properties.preferences = {
      ...this.properties.preferences,
      ...preferences,
    };
    this.saveProperties();
    this.updateAnalytics();
  }

  setUserLocation(location) {
    this.properties.location = {
      country: location.country,
      region: location.region,
      city: location.city,
      timezone: location.timezone,
      latitude: location.latitude,
      longitude: location.longitude,
    };
    this.saveProperties();
    this.updateAnalytics();
  }

  setUserInterests(interests) {
    this.properties.interests = interests;
    this.saveProperties();
    this.updateAnalytics();
  }

  setUserGoals(goals) {
    this.properties.goals = goals;
    this.saveProperties();
    this.updateAnalytics();
  }

  setUserHealthMetrics(metrics) {
    this.properties.health = {
      ...this.properties.health,
      ...metrics,
    };
    this.saveProperties();
    this.updateAnalytics();
  }

  incrementUserProperty(key, increment = 1) {
    const current = this.properties.user?.[key] || 0;
    this.properties.user[key] = current + increment;
    this.saveProperties();
    this.updateAnalytics();
  }

  trackUserAction(action) {
    const now = Date.now();
    const today = new Date().toDateString();

    if (!this.properties.actions) {
      this.properties.actions = {};
    }

    // Track total actions
    this.properties.actions[`total_${action}`] = (this.properties.actions[`total_${action}`] || 0) + 1;

    // Track daily actions
    if (!this.properties.actions.daily) {
      this.properties.actions.daily = {};
    }
    if (!this.properties.actions.daily[today]) {
      this.properties.actions.daily[today] = {};
    }
    this.properties.actions.daily[today][action] = (this.properties.actions.daily[today][action] || 0) + 1;

    // Track last action time
    this.properties.actions[`last_${action}_time`] = now;

    this.saveProperties();
  }

  getActiveDays() {
    if (!this.properties.actions?.daily) return 0;
    return Object.keys(this.properties.actions.daily).length;
  }

  getCurrentStreak() {
    if (!this.properties.actions?.daily) return 0;

    const days = Object.keys(this.properties.actions.daily).sort().reverse();
    let streak = 0;
    let currentDate = new Date().toDateString();

    for (const day of days) {
      if (day === currentDate) {
        streak++;
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        currentDate = prevDate.toDateString();
      } else {
        break;
      }
    }

    return streak;
  }

  getProperties() {
    return {
      ...this.properties,
      activeDays: this.getActiveDays(),
      currentStreak: this.getCurrentStreak(),
    };
  }

  async reset() {
    this.properties = {};
    await this.initialize();
    this.updateAnalytics();
  }

  updateAnalytics() {
    // Update analytics service with user properties
    analyticsService.setUserProperties(this.getProperties());
  }

  // Pre-defined property sets
  setNewUserProperties() {
    this.properties.userType = 'new';
    this.properties.onboardingStage = 'started';
    this.saveProperties();
  }

  setOnboardingComplete() {
    this.properties.userType = 'onboarded';
    this.properties.onboardingStage = 'completed';
    this.properties.onboardingCompletedAt = Date.now();
    this.saveProperties();
  }

  setActiveUser() {
    this.properties.userType = 'active';
    this.properties.lastActiveAt = Date.now();
    this.saveProperties();
  }

  setChurnedUser() {
    this.properties.userType = 'churned';
    this.properties.churnedAt = Date.now();
    this.saveProperties();
  }

  setPremiumUser(tier) {
    this.properties.userType = 'premium';
    this.properties.subscriptionTier = tier;
    this.properties.upgradedAt = Date.now();
    this.saveProperties();
  }

  setFreeUser() {
    this.properties.userType = 'free';
    this.properties.subscriptionTier = 'free';
    this.saveProperties();
  }
}

export default new UserProperties();