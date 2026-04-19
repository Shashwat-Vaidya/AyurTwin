import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import encryptionHelper from './encryptionHelper';

class KeyManager {
  constructor() {
    this.masterKey = null;
    this.userKey = null;
    this.deviceKey = null;
    this.initialized = false;
    this.keyCache = new Map();
  }

  async initialize() {
    if (this.initialized) return;

    await this.loadDeviceKey();
    await this.loadMasterKey();
    
    this.initialized = true;
  }

  async loadDeviceKey() {
    try {
      const stored = await SecureStore.getItemAsync('@key:device');
      if (stored) {
        this.deviceKey = stored;
      } else {
        this.deviceKey = await this.generateDeviceKey();
        await SecureStore.setItemAsync('@key:device', this.deviceKey);
      }
    } catch (error) {
      console.error('Error loading device key:', error);
      this.deviceKey = await this.generateDeviceKey();
    }
  }

  async loadMasterKey() {
    try {
      this.masterKey = await SecureStore.getItemAsync('@key:master');
    } catch (error) {
      console.error('Error loading master key:', error);
    }
  }

  async generateDeviceKey() {
    const deviceId = await this.getDeviceId();
    const random = await encryptionHelper.generateSecureToken(16);
    return await encryptionHelper.hash(deviceId + random);
  }

  async getDeviceId() {
    // Generate a device-specific ID
    const identifier = await SecureStore.getItemAsync('@device:id');
    if (identifier) return identifier;

    const newId = await encryptionHelper.generateSecureToken(16);
    await SecureStore.setItemAsync('@device:id', newId);
    return newId;
  }

  async createMasterKey(password) {
    const salt = await encryptionHelper.generateSalt();
    const masterKey = await encryptionHelper.deriveKeyFromPassword(password, salt);
    
    this.masterKey = masterKey;
    await SecureStore.setItemAsync('@key:master', masterKey);
    await SecureStore.setItemAsync('@key:master_salt', salt);
    
    return masterKey;
  }

  async unlockMasterKey(password) {
    const salt = await SecureStore.getItemAsync('@key:master_salt');
    if (!salt) throw new Error('No master key found');

    const derivedKey = await encryptionHelper.deriveKeyFromPassword(password, salt);
    const storedKey = await SecureStore.getItemAsync('@key:master');

    if (derivedKey !== storedKey) {
      throw new Error('Invalid password');
    }

    this.masterKey = derivedKey;
    return derivedKey;
  }

  async changeMasterKey(oldPassword, newPassword) {
    // Decrypt all user data with old key
    // Re-encrypt with new key
    // This is a simplified version
    await this.unlockMasterKey(oldPassword);
    const newSalt = await encryptionHelper.generateSalt();
    const newKey = await encryptionHelper.deriveKeyFromPassword(newPassword, newSalt);
    
    this.masterKey = newKey;
    await SecureStore.setItemAsync('@key:master', newKey);
    await SecureStore.setItemAsync('@key:master_salt', newSalt);
  }

  async getUserKey(userId) {
    if (this.keyCache.has(userId)) {
      return this.keyCache.get(userId);
    }

    const stored = await SecureStore.getItemAsync(`@key:user:${userId}`);
    if (stored) {
      this.keyCache.set(userId, stored);
      return stored;
    }

    const userKey = await this.generateUserKey(userId);
    await SecureStore.setItemAsync(`@key:user:${userId}`, userKey);
    this.keyCache.set(userId, userKey);
    
    return userKey;
  }

  async generateUserKey(userId) {
    const data = userId + this.deviceKey + Date.now().toString();
    return await encryptionHelper.hash(data);
  }

  async getDataKey(dataType, userId) {
    const cacheKey = `${userId}:${dataType}`;
    
    if (this.keyCache.has(cacheKey)) {
      return this.keyCache.get(cacheKey);
    }

    const stored = await SecureStore.getItemAsync(`@key:data:${cacheKey}`);
    if (stored) {
      this.keyCache.set(cacheKey, stored);
      return stored;
    }

    const userKey = await this.getUserKey(userId);
    const dataKey = await encryptionHelper.deriveKeyFromPassword(
      dataType + Date.now().toString(),
      userKey
    );
    
    await SecureStore.setItemAsync(`@key:data:${cacheKey}`, dataKey);
    this.keyCache.set(cacheKey, dataKey);
    
    return dataKey;
  }

  async rotateKey(keyId) {
    const newKey = await encryptionHelper.generateSecureToken(32);
    
    // Re-encrypt data with new key
    // This would need to be implemented based on your data structure
    
    await SecureStore.setItemAsync(`@key:${keyId}`, newKey);
    this.keyCache.delete(keyId);
    
    return newKey;
  }

  async deleteKey(keyId) {
    await SecureStore.deleteItemAsync(`@key:${keyId}`);
    this.keyCache.delete(keyId);
  }

  async backupKeys(password) {
    const keys = {};
    
    // Collect all keys
    // This is a simplified version
    const masterSalt = await SecureStore.getItemAsync('@key:master_salt');
    if (masterSalt) keys.masterSalt = masterSalt;
    
    const backupPassword = await encryptionHelper.hash(password);
    const encrypted = await encryptionHelper.encrypt(keys, backupPassword);
    
    return encrypted;
  }

  async restoreKeys(backup, password) {
    const backupPassword = await encryptionHelper.hash(password);
    const keys = await encryptionHelper.decrypt(
      backup.encrypted,
      backupPassword,
      backup.iv,
      backup.tag
    );

    // Restore keys
    if (keys.masterSalt) {
      await SecureStore.setItemAsync('@key:master_salt', keys.masterSalt);
    }
  }

  async setupBiometricKey() {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return false;

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) return false;

    const biometricKey = await encryptionHelper.generateSecureToken(32);
    await SecureStore.setItemAsync('@key:biometric', biometricKey);
    
    return true;
  }

  async getBiometricKey() {
    return await SecureStore.getItemAsync('@key:biometric');
  }

  async clearAllKeys() {
    this.masterKey = null;
    this.userKey = null;
    this.keyCache.clear();
    
    // Clear secure storage keys
    const keys = [
      '@key:device',
      '@key:master',
      '@key:master_salt',
      '@key:biometric',
      '@device:id',
    ];
    
    for (const key of keys) {
      await SecureStore.deleteItemAsync(key);
    }
  }

  getKeyInfo(keyId) {
    return {
      id: keyId,
      algorithm: 'AES-256-GCM',
      keySize: 256,
      createdAt: Date.now(), // Would need to store this
      expiresAt: null,
    };
  }

  async keyExists(keyId) {
    return await SecureStore.getItemAsync(`@key:${keyId}`) !== null;
  }
}

export default new KeyManager();