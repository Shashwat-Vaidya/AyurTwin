import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // User data
  async setUser(user) {
    try {
      await AsyncStorage.setItem('@user:data', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  async getUser() {
    try {
      const user = await AsyncStorage.getItem('@user:data');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async clearUser() {
    try {
      await AsyncStorage.removeItem('@user:data');
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  }

  // Health data
  async setHealthData(data) {
    try {
      await AsyncStorage.setItem('@health:data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  }

  async getHealthData() {
    try {
      const data = await AsyncStorage.getItem('@health:data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting health data:', error);
      return null;
    }
  }

  async appendHealthReading(reading) {
    try {
      const existing = await this.getHealthData() || { readings: [] };
      existing.readings = [...(existing.readings || []), {
        ...reading,
        timestamp: new Date().toISOString(),
      }];
      
      // Keep only last 1000 readings
      if (existing.readings.length > 1000) {
        existing.readings = existing.readings.slice(-1000);
      }
      
      await this.setHealthData(existing);
    } catch (error) {
      console.error('Error appending health reading:', error);
    }
  }

  // Settings
  async setSettings(settings) {
    try {
      await AsyncStorage.setItem('@settings:data', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  async getSettings() {
    try {
      const settings = await AsyncStorage.getItem('@settings:data');
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  async updateSettings(updates) {
    try {
      const current = await this.getSettings() || {};
      const updated = { ...current, ...updates };
      await this.setSettings(updated);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  }

  // Onboarding
  async setOnboardingComplete(value = true) {
    try {
      await AsyncStorage.setItem('@onboarding:complete', JSON.stringify(value));
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  }

  async isOnboardingComplete() {
    try {
      const value = await AsyncStorage.getItem('@onboarding:complete');
      return value ? JSON.parse(value) : false;
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return false;
    }
  }

  // Device data
  async setDevice(device) {
    try {
      await AsyncStorage.setItem('@device:data', JSON.stringify(device));
    } catch (error) {
      console.error('Error saving device:', error);
    }
  }

  async getDevice() {
    try {
      const device = await AsyncStorage.getItem('@device:data');
      return device ? JSON.parse(device) : null;
    } catch (error) {
      console.error('Error getting device:', error);
      return null;
    }
  }

  async clearDevice() {
    try {
      await AsyncStorage.removeItem('@device:data');
    } catch (error) {
      console.error('Error clearing device:', error);
    }
  }

  // Cache
  async setCache(key, data, ttl = 3600000) { // Default 1 hour
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      await AsyncStorage.setItem(`@cache:${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  async getCache(key) {
    try {
      const cached = await AsyncStorage.getItem(`@cache:${key}`);
      if (!cached) return null;

      const { data, timestamp, ttl } = JSON.parse(cached);
      if (Date.now() - timestamp > ttl) {
        await AsyncStorage.removeItem(`@cache:${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('@cache:'));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Generic methods
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving item ${key}:`, error);
    }
  }

  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  async clearAll() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  async getMultiple(keys) {
    try {
      const values = await AsyncStorage.multiGet(keys);
      return values.map(([key, value]) => ({
        key,
        value: value ? JSON.parse(value) : null,
      }));
    } catch (error) {
      console.error('Error getting multiple items:', error);
      return [];
    }
  }

  async setMultiple(items) {
    try {
      const keyValuePairs = items.map(({ key, value }) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      console.error('Error setting multiple items:', error);
    }
  }
}

export default new StorageService();