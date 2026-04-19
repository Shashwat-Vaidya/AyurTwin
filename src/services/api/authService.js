import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

class AuthService {
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      if (response.token) {
        await this.setTokens(response.token, response.refreshToken);
        await this.setUser(response.user);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);

      if (response.token) {
        await this.setTokens(response.token, response.refreshToken);
        await this.setUser(response.user);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await apiClient.post('/auth/logout');
      await this.clearTokens();
      await this.clearUser();
    } catch (error) {
      // Still clear local data even if API call fails
      await this.clearTokens();
      await this.clearUser();
    }
  }

  async refreshToken() {
    try {
      const refreshToken = await AsyncStorage.getItem('@auth:refreshToken');
      const response = await apiClient.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      if (response.token) {
        await this.setTokens(response.token, response.refreshToken);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email) {
    return apiClient.post('/auth/forgot-password', { email });
  }

  async resetPassword(token, password) {
    return apiClient.post('/auth/reset-password', {
      token,
      password,
    });
  }

  async changePassword(currentPassword, newPassword) {
    return apiClient.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  async verifyEmail(token) {
    return apiClient.post('/auth/verify-email', { token });
  }

  async resendVerification(email) {
    return apiClient.post('/auth/resend-verification', { email });
  }

  async setupBiometric() {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        throw new Error('Biometric authentication not available');
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        throw new Error('No biometric credentials enrolled');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric login',
        disableDeviceFallback: false,
      });

      if (result.success) {
        const token = await AsyncStorage.getItem('@auth:token');
        await apiClient.post('/auth/biometric/enable', {
          token,
        });
        await AsyncStorage.setItem('@auth:biometric', 'enabled');
        return true;
      }

      return false;
    } catch (error) {
      throw error;
    }
  }

  async loginWithBiometric() {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with biometric',
        disableDeviceFallback: false,
      });

      if (result.success) {
        const response = await apiClient.post('/auth/biometric/login');
        
        if (response.token) {
          await this.setTokens(response.token, response.refreshToken);
          await this.setUser(response.user);
        }

        return response;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async isBiometricEnabled() {
    const biometric = await AsyncStorage.getItem('@auth:biometric');
    return biometric === 'enabled';
  }

  async disableBiometric() {
    await apiClient.post('/auth/biometric/disable');
    await AsyncStorage.removeItem('@auth:biometric');
  }

  async setTokens(token, refreshToken) {
    await AsyncStorage.setItem('@auth:token', token);
    if (refreshToken) {
      await AsyncStorage.setItem('@auth:refreshToken', refreshToken);
    }
  }

  async getToken() {
    return AsyncStorage.getItem('@auth:token');
  }

  async clearTokens() {
    await AsyncStorage.multiRemove(['@auth:token', '@auth:refreshToken']);
  }

  async setUser(user) {
    await AsyncStorage.setItem('@auth:user', JSON.stringify(user));
  }

  async getUser() {
    const userStr = await AsyncStorage.getItem('@auth:user');
    return userStr ? JSON.parse(userStr) : null;
  }

  async clearUser() {
    await AsyncStorage.removeItem('@auth:user');
  }

  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      await this.setUser(response);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();