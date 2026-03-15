import { useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

export const useBiometric = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check biometric availability on mount
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  // Check biometric hardware and enrollment
  const checkBiometricAvailability = useCallback(async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsBiometricEnrolled(enrolled);

        if (enrolled) {
          const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
          if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
            setBiometricType('Fingerprint');
          } else if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
            setBiometricType('Face ID');
          } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
            setBiometricType('Iris');
          }
        }
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  }, []);

  // Authenticate with biometric
  const authenticate = useCallback(async (options = {}) => {
    const {
      promptMessage = 'Authenticate',
      cancelLabel = 'Cancel',
      disableDeviceFallback = false,
      fallbackLabel = 'Use Passcode',
    } = options;

    if (!isBiometricSupported) {
      Alert.alert('Not Available', 'Biometric authentication is not available on this device.');
      return { success: false, error: 'BIOMETRIC_NOT_AVAILABLE' };
    }

    if (!isBiometricEnrolled) {
      Alert.alert(
        'Not Set Up',
        'Please set up biometric authentication in your device settings first.'
      );
      return { success: false, error: 'BIOMETRIC_NOT_ENROLLED' };
    }

    setIsAuthenticating(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel,
        disableDeviceFallback,
        fallbackLabel,
      });

      return {
        success: result.success,
        error: result.error,
        warnings: result.warnings,
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsAuthenticating(false);
    }
  }, [isBiometricSupported, isBiometricEnrolled]);

  // Simple authentication without extra options
  const simpleAuthenticate = useCallback(async (message = 'Authenticate to continue') => {
    return authenticate({ promptMessage: message });
  }, [authenticate]);

  // Get security level
  const getSecurityLevel = useCallback(() => {
    if (!isBiometricSupported) return 'none';
    if (!isBiometricEnrolled) return 'available';
    return 'enabled';
  }, [isBiometricSupported, isBiometricEnrolled]);

  // Get biometric icon name
  const getBiometricIcon = useCallback(() => {
    if (biometricType.includes('Face')) return 'face-id';
    if (biometricType.includes('Finger')) return 'finger-print';
    return 'scan';
  }, [biometricType]);

  return {
    // State
    isBiometricSupported,
    isBiometricEnrolled,
    biometricType,
    isAuthenticating,
    securityLevel: getSecurityLevel(),
    biometricIcon: getBiometricIcon(),

    // Methods
    authenticate,
    simpleAuthenticate,
    checkBiometricAvailability,
  };
};

export default useBiometric;