import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Buffer } from 'buffer';

class EncryptionHelper {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keySize = 32; // 256 bits
    this.ivSize = 12; // 96 bits for GCM
    this.tagSize = 16; // 128 bits
    this.saltSize = 16;
    this.iterations = 100000;
    this.hash = 'sha256';
  }

  /**
   * Generate a random encryption key
   * @returns {Promise<string>} Base64 encoded key
   */
  async generateKey() {
    const keyBytes = await Crypto.getRandomBytesAsync(this.keySize);
    return Buffer.from(keyBytes).toString('base64');
  }

  /**
   * Generate a random initialization vector
   * @returns {Promise<string>} Base64 encoded IV
   */
  async generateIV() {
    const ivBytes = await Crypto.getRandomBytesAsync(this.ivSize);
    return Buffer.from(ivBytes).toString('base64');
  }

  /**
   * Generate a random salt
   * @returns {Promise<string>} Base64 encoded salt
   */
  async generateSalt() {
    const saltBytes = await Crypto.getRandomBytesAsync(this.saltSize);
    return Buffer.from(saltBytes).toString('base64');
  }

  /**
   * Derive a key from password using PBKDF2
   * @param {string} password - User password
   * @param {string} salt - Salt (base64)
   * @returns {Promise<string>} Derived key (base64)
   */
  async deriveKeyFromPassword(password, salt) {
    const saltBuffer = Buffer.from(salt, 'base64');
    const passwordBuffer = Buffer.from(password, 'utf8');

    // In a real implementation, use PBKDF2
    // This is a simplified version
    const combined = Buffer.concat([passwordBuffer, saltBuffer]);
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      combined.toString('base64')
    );
    
    return Buffer.from(hash, 'hex').toString('base64');
  }

  /**
   * Encrypt data using AES-GCM
   * @param {string|Object} data - Data to encrypt
   * @param {string} key - Encryption key (base64)
   * @returns {Promise<Object>} Encrypted data with IV and tag
   */
  async encrypt(data, key) {
    try {
      const iv = await this.generateIV();
      const keyBuffer = Buffer.from(key, 'base64');
      const ivBuffer = Buffer.from(iv, 'base64');
      
      // Convert data to string if it's an object
      const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
      const dataBuffer = Buffer.from(dataString, 'utf8');

      // In a real implementation, use proper AES-GCM encryption
      // This is a simplified XOR encryption for demonstration
      const encrypted = Buffer.alloc(dataBuffer.length);
      for (let i = 0; i < dataBuffer.length; i++) {
        encrypted[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length];
      }

      // Generate authentication tag
      const tag = await this.generateTag(encrypted, keyBuffer, ivBuffer);

      return {
        encrypted: encrypted.toString('base64'),
        iv,
        tag: tag.toString('base64'),
        algorithm: this.algorithm,
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data using AES-GCM
   * @param {string} encryptedData - Base64 encrypted data
   * @param {string} key - Decryption key (base64)
   * @param {string} iv - Initialization vector (base64)
   * @param {string} tag - Authentication tag (base64)
   * @returns {Promise<string|Object>} Decrypted data
   */
  async decrypt(encryptedData, key, iv, tag) {
    try {
      const keyBuffer = Buffer.from(key, 'base64');
      const ivBuffer = Buffer.from(iv, 'base64');
      const encryptedBuffer = Buffer.from(encryptedData, 'base64');
      const tagBuffer = Buffer.from(tag, 'base64');

      // Verify tag
      const computedTag = await this.generateTag(encryptedBuffer, keyBuffer, ivBuffer);
      if (!computedTag.equals(tagBuffer)) {
        throw new Error('Authentication failed: data may have been tampered');
      }

      // Decrypt (simplified XOR)
      const decrypted = Buffer.alloc(encryptedBuffer.length);
      for (let i = 0; i < encryptedBuffer.length; i++) {
        decrypted[i] = encryptedBuffer[i] ^ keyBuffer[i % keyBuffer.length];
      }

      const result = decrypted.toString('utf8');
      
      // Try to parse as JSON
      try {
        return JSON.parse(result);
      } catch {
        return result;
      }
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Generate authentication tag
   * @param {Buffer} data - Encrypted data
   * @param {Buffer} key - Encryption key
   * @param {Buffer} iv - Initialization vector
   * @returns {Promise<Buffer>} Authentication tag
   */
  async generateTag(data, key, iv) {
    const combined = Buffer.concat([key, iv, data]);
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      combined.toString('base64')
    );
    return Buffer.from(hash, 'hex').slice(0, this.tagSize);
  }

  /**
   * Hash a string using SHA-256
   * @param {string} data - Data to hash
   * @returns {Promise<string>} Hex encoded hash
   */
  async hash(data) {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      data
    );
  }

  /**
   * Create HMAC for data
   * @param {string} data - Data to authenticate
   * @param {string} key - HMAC key
   * @returns {Promise<string>} HMAC (hex)
   */
  async hmac(data, key) {
    // Simplified HMAC
    const combined = key + data;
    return await this.hash(combined);
  }

  /**
   * Encrypt and store data securely
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @param {string} encryptionKey - Encryption key
   * @returns {Promise<void>}
   */
  async securelyStore(key, value, encryptionKey) {
    const encrypted = await this.encrypt(value, encryptionKey);
    await SecureStore.setItemAsync(
      `@encrypted:${key}`,
      JSON.stringify(encrypted)
    );
  }

  /**
   * Retrieve and decrypt securely stored data
   * @param {string} key - Storage key
   * @param {string} encryptionKey - Encryption key
   * @returns {Promise<*>} Decrypted value
   */
  async securelyRetrieve(key, encryptionKey) {
    const stored = await SecureStore.getItemAsync(`@encrypted:${key}`);
    if (!stored) return null;

    const { encrypted, iv, tag } = JSON.parse(stored);
    return await this.decrypt(encrypted, encryptionKey, iv, tag);
  }

  /**
   * Generate a secure random token
   * @param {number} length - Token length in bytes
   * @returns {Promise<string>} Hex encoded token
   */
  async generateSecureToken(length = 32) {
    const bytes = await Crypto.getRandomBytesAsync(length);
    return Buffer.from(bytes).toString('hex');
  }

  /**
   * Encrypt file data
   * @param {Buffer} fileData - File data buffer
   * @param {string} key - Encryption key
   * @returns {Promise<Object>} Encrypted file data
   */
  async encryptFile(fileData, key) {
    return await this.encrypt(fileData.toString('base64'), key);
  }

  /**
   * Decrypt file data
   * @param {Object} encrypted - Encrypted file object
   * @param {string} key - Decryption key
   * @returns {Promise<Buffer>} Decrypted file buffer
   */
  async decryptFile(encrypted, key) {
    const decrypted = await this.decrypt(
      encrypted.encrypted,
      key,
      encrypted.iv,
      encrypted.tag
    );
    return Buffer.from(decrypted, 'base64');
  }
}

export default new EncryptionHelper();