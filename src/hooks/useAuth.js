import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';

import authService from '../services/api/authService';
import { login, logout, updateUser, setBiometricEnabled } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, biometricEnabled } = 
    useSelector(state => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Login handler
  const handleLogin = useCallback(async (email, password) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await authService.login(email, password);
      dispatch(login(response.user));
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      setAuthError(errorMessage);
      Alert.alert('Login Failed', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Register handler
  const handleRegister = useCallback(async (userData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await authService.register(userData);
      dispatch(login(response.user));
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setAuthError(errorMessage);
      Alert.alert('Registration Failed', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      dispatch(logout());
    }
  }, [dispatch]);

  // Biometric login
  const handleBiometricLogin = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await authService.loginWithBiometric();
      if (response) {
        dispatch(login(response.user));
        return { success: true, user: response.user };
      }
      return { success: false, error: 'Biometric authentication failed' };
    } catch (error) {
      const errorMessage = error.message || 'Biometric login failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Enable biometric
  const handleEnableBiometric = useCallback(async () => {
    try {
      const success = await authService.setupBiometric();
      if (success) {
        dispatch(setBiometricEnabled(true));
        Alert.alert('Success', 'Biometric login enabled');
      }
      return success;
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to enable biometric');
      return false;
    }
  }, [dispatch]);

  // Disable biometric
  const handleDisableBiometric = useCallback(async () => {
    try {
      await authService.disableBiometric();
      dispatch(setBiometricEnabled(false));
      Alert.alert('Success', 'Biometric login disabled');
      return true;
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to disable biometric');
      return false;
    }
  }, [dispatch]);

  // Forgot password
  const handleForgotPassword = useCallback(async (email) => {
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      Alert.alert(
        'Email Sent',
        'Password reset instructions have been sent to your email.'
      );
      return { success: true };
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset password
  const handleResetPassword = useCallback(async (token, password) => {
    setIsLoading(true);

    try {
      await authService.resetPassword(token, password);
      Alert.alert('Success', 'Your password has been reset successfully');
      return { success: true };
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to reset password');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Change password
  const handleChangePassword = useCallback(async (currentPassword, newPassword) => {
    setIsLoading(true);

    try {
      await authService.changePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password changed successfully');
      return { success: true };
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to change password');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    const token = await authService.getToken();
    return !!token;
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      dispatch(updateUser(userData));
      return userData;
    } catch (error) {
      console.error('Error refreshing user:', error);
      return null;
    }
  }, [dispatch]);

  // Clear error
  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || loading,
    error: authError || error,
    biometricEnabled,

    // Auth methods
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    biometricLogin: handleBiometricLogin,
    enableBiometric: handleEnableBiometric,
    disableBiometric: handleDisableBiometric,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    changePassword: handleChangePassword,

    // Utility methods
    checkAuthStatus,
    refreshUser,
    clearError,
  };
};

export default useAuth;