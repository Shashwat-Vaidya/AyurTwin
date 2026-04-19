import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';

class SecureStorageService {
  constructor() {
    this.initialized = false;
    this.encryptionKey = null;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Generate or retrieve encryption key
      const existingKey = await this.getEncryptionKey();
      if (existingKey) {
        this.encryptionKey = existingKey;
      } else {
        this.encryptionKey = await this.generateEncryptionKey();
        await this.saveEncryptionKey(this.encryptionKey);
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing secure storage:', error);
      throw error;
    }
  }

  async generateEncryptionKey() {
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    return Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async getEncryptionKey() {
    if (Platform.OS === 'web') {
      return localStorage.getItem('@secure:encryption_key');
    }
    return SecureStore.getItemAsync('@secure:encryption_key');
  }

  async saveEncryptionKey(key) {
    if (Platform.OS === 'web') {
      localStorage.setItem('@secure:encryption_key', key);
    } else {
      await SecureStore.setItemAsync('@secure:encryption_key', key);
    }
  }

  async encrypt(data) {
    if (!this.initialized) await this.initialize();
    
    // Simple XOR encryption (in production, use proper encryption library)
    const dataStr = JSON.stringify(data);
    let result = '';
    for (let i = 0; i < dataStr.length; i++) {
      result += String.fromCharCode(
        dataStr.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
      );
    }
    return Buffer.from(result).toString('base64');
  }

  async decrypt(encryptedData) {
    if (!this.initialized) await this.initialize();

    try {
      const dataStr = Buffer.from(encryptedData, 'base64').toString();
      let result = '';
      for (let i = 0; i < dataStr.length; i++) {
        result += String.fromCharCode(
          dataStr.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
        );
      }
      return JSON.parse(result);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }

  // Auth tokens
  async setAuthToken(token) {
    try {
      const encrypted = await this.encrypt(token);
      if (Platform.OS === 'web') {
        localStorage.setItem('@secure:auth_token', encrypted);
      } else {
        await SecureStore.setItemAsync('@secure:auth_token', encrypted);
      }
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  }

  async getAuthToken() {
    try {
      let encrypted;
      if (Platform.OS === 'web') {
        encrypted = localStorage.getItem('@secure:auth_token');
      } else {
        encrypted = await SecureStore.getItemAsync('@secure:auth_token');
      }
      
      if (!encrypted) return null;
      return await this.decrypt(encrypted);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async removeAuthToken() {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('@secure:auth_token');
      } else {
        await SecureStore.deleteItemAsync('@secure:auth_token');
      }
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  // Refresh token
  async setRefreshToken(token) {
    try {
      const encrypted = await this.encrypt(token);
      if (Platform.OS === 'web') {
        localStorage.setItem('@secure:refresh_token', encrypted);
      } else {
        await SecureStore.setItemAsync('@secure:refresh_token', encrypted);
      }
    } catch (error) {
      console.error('Error saving refresh token:', error);
    }
  }

  async getRefreshToken() {
    try {
      let encrypted;
      if (Platform.OS === 'web') {
        encrypted = localStorage.getItem('@secure:refresh_token');
      } else {
        encrypted = await SecureStore.getItemAsync('@secure:refresh_token');
      }
      
      if (!encrypted) return null;
      return await this.decrypt(encrypted);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  async removeRefreshToken() {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('@secure:refresh_token');
      } else {
        await SecureStore.deleteItemAsync('@secure:refresh_token');
      }
    } catch (error) {
      console.error('Error removing refresh token:', error);
    }
  }

  // User credentials (for biometric login)
  async setUserCredentials(email, password) {
    try {
      const credentials = { email, password };
      const encrypted = await this.encrypt(credentials);
      if (Platform.OS === 'web') {
        localStorage.setItem('@secure:credentials', encrypted);
      } else {
        await SecureStore.setItemAsync('@secure:credentials', encrypted);
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  }

  async getUserCredentials() {
    try {
      let encrypted;
      if (Platform.OS === 'web') {
        encrypted = localStorage.getItem('@secure:credentials');
      } else {
        encrypted = await SecureStore.getItemAsync('@secure:credentials');
      }
      
      if (!encrypted) return null;
      return await this.decrypt(encrypted);
    } catch (error) {
      console.error('Error getting credentials:', error);
      return null;
    }
  }

  async removeUserCredentials() {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('@secure:credentials');
      } else {
        await SecureStore.deleteItemAsync('@secure:credentials');
      }
    } catch (error) {
      console.error('Error removing credentials:', error);
    }
  }

  // Biometric key
  async setBiometricKey(key) {
    try {
      const encrypted = await this.encrypt(key);
      if (Platform.OS === 'web') {
        localStorage.setItem('@secure:biometric_key', encrypted);
      } else {
        await SecureStore.setItemAsync('@secure:biometric_key', encrypted);
      }
    } catch (error) {
      console.error('Error saving biometric key:', error);
    }
  }

  async getBiometricKey() {
    try {
      let encrypted;
      if (Platform.OS === 'web') {
        encrypted = localStorage.getItem('@secure:biometric_key');
      } else {
        encrypted = await SecureStore.getItemAsync('@secure:biometric_key');
      }
      
      if (!encrypted) return null;
      return await this.decrypt(encrypted);
    } catch (error) {
      console.error('Error getting biometric key:', error);
      return null;
    }
  }

  async removeBiometricKey() {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('@secure:biometric_key');
      } else {
        await SecureStore.deleteItemAsync('@secure:biometric_key');
      }
    } catch (error) {
      console.error('Error removing biometric key:', error);
    }
  }

  // PIN code
  async setPIN(pin) {
    try {
      const encrypted = await this.encrypt(pin);
      if (Platform.OS === 'web') {
        localStorage.setItem('@secure:pin', encrypted);
      } else {
        await SecureStore.setItemAsync('@secure:pin', encrypted);
      }
    } catch (error) {
      console.error('Error saving PIN:', error);
    }
  }

  async getPIN() {
    try {
      let encrypted;
      if (Platform.OS === 'web') {
        encrypted = localStorage.getItem('@secure:pin');
      } else {
        encrypted = await SecureStore.getItemAsync('@secure:pin');
      }
      
      if (!encrypted) return null;
      return await this.decrypt(encrypted);
    } catch (error) {
      console.error('Error getting PIN:', error);
      return null;
    }
  }

  async removePIN() {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('@secure:pin');
      } else {
        await SecureStore.deleteItemAsync('@secure:pin');
      }
    } catch (error) {
      console.error('Error removing PIN:', error);
    }
  }

  // Generic secure storage
  async setSecureItem(key, value) {
    try {
      const encrypted = await this.encrypt(value);
      if (Platform.OS === 'web') {
        localStorage.setItem(`@secure:${key}`, encrypted);
      } else {
        await SecureStore.setItemAsync(`@secure:${key}`, encrypted);
      }
    } catch (error) {
      console.error(`Error saving secure item ${key}:`, error);
    }
  }

  async getSecureItem(key) {
    try {
      let encrypted;
      if (Platform.OS === 'web') {
        encrypted = localStorage.getItem(`@secure:${key}`);
      } else {
        encrypted = await SecureStore.getItemAsync(`@secure:${key}`);
      }
      
      if (!encrypted) return null;
      return await this.decrypt(encrypted);
    } catch (error) {
      console.error(`Error getting secure item ${key}:`, error);
      return null;
    }
  }

  async removeSecureItem(key) {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(`@secure:${key}`);
      } else {
        await SecureStore.deleteItemAsync(`@secure:${key}`);
      }
    } catch (error) {
      console.error(`Error removing secure item ${key}:`, error);
    }
  }

  // Clear all secure data
  async clearAll() {
    try {
      if (Platform.OS === 'web') {
        const keys = Object.keys(localStorage);
        const secureKeys = keys.filter(key => key.startsWith('@secure:'));
        secureKeys.forEach(key => localStorage.removeItem(key));
      } else {
        // Note: SecureStore doesn't have a way to get all keys
        // You'll need to track keys separately or use AsyncStorage for non-sensitive data
        await this.removeAuthToken();
        await this.removeRefreshToken();
        await this.removeUserCredentials();
        await this.removeBiometricKey();
        await this.removePIN();
      }
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }

  // Check if secure storage is available
  async isAvailable() {
    if (Platform.OS === 'web') {
      return typeof localStorage !== 'undefined';
    }
    
    try {
      await SecureStore.setItemAsync('@secure:test', 'test');
      await SecureStore.deleteItemAsync('@secure:test');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new SecureStorageService();