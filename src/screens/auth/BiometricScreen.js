import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const BiometricScreen = () => {
  const navigation = useNavigation();

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    checkBiometricSupport();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    
    setIsBiometricSupported(compatible);
    setIsEnrolled(enrolled);

    if (compatible && enrolled) {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Fingerprint');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        setBiometricType('Iris');
      }
    }
  };

  const handleBiometricAuth = async () => {
    if (!isBiometricSupported) {
      Alert.alert(
        'Not Available',
        'Biometric authentication is not available on this device.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!isEnrolled) {
      Alert.alert(
        'Not Set Up',
        'Please set up biometric authentication in your device settings first.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsAuthenticating(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Authenticate with ${biometricType}`,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        fallbackLabel: 'Use Passcode',
      });

      setIsAuthenticating(false);

      if (result.success) {
        setAuthSuccess(true);
        setTimeout(() => {
          navigation.replace(ROUTES.MAIN_TABS);
        }, 1500);
      } else {
        Alert.alert(
          'Authentication Failed',
          'Please try again or use another method.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      setIsAuthenticating(false);
      Alert.alert('Error', 'An error occurred during authentication.');
    }
  };

  const getBiometricIcon = () => {
    if (biometricType.includes('Face')) return 'face-id';
    if (biometricType.includes('Finger')) return 'finger-print';
    return 'scan';
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Biometric Authentication</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Main Content */}
        <Card style={styles.mainCard}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <LinearGradient
              colors={[colors.primarySaffron, colors.primaryGreen]}
              style={styles.iconContainer}
            >
              <Ionicons 
                name={authSuccess ? 'checkmark-circle' : getBiometricIcon()} 
                size={80} 
                color="white" 
              />
            </LinearGradient>
          </Animated.View>

          <Text style={styles.title}>
            {authSuccess ? 'Success!' : `Authenticate with ${biometricType || 'Biometrics'}`}
          </Text>
          
          <Text style={styles.subtitle}>
            {authSuccess 
              ? 'You have been successfully authenticated.'
              : `Use your ${biometricType || 'biometric credential'} to securely access your account.`
            }
          </Text>

          {!authSuccess && (
            <>
              {/* Biometric Status */}
              <View style={styles.statusContainer}>
                <View style={styles.statusItem}>
                  <Ionicons 
                    name={isBiometricSupported ? 'checkmark-circle' : 'close-circle'} 
                    size={24} 
                    color={isBiometricSupported ? colors.successGreen : colors.alertRed} 
                  />
                  <Text style={styles.statusText}>
                    {isBiometricSupported ? 'Hardware Supported' : 'Hardware Not Supported'}
                  </Text>
                </View>

                <View style={styles.statusItem}>
                  <Ionicons 
                    name={isEnrolled ? 'checkmark-circle' : 'close-circle'} 
                    size={24} 
                    color={isEnrolled ? colors.successGreen : colors.alertRed} 
                  />
                  <Text style={styles.statusText}>
                    {isEnrolled ? `${biometricType} Enrolled` : 'No Biometrics Enrolled'}
                  </Text>
                </View>
              </View>

              {/* Authenticate Button */}
              <Button
                title={`Authenticate with ${biometricType || 'Biometrics'}`}
                onPress={handleBiometricAuth}
                style={styles.authButton}
                gradient
                icon={getBiometricIcon()}
                loading={isAuthenticating}
                disabled={!isBiometricSupported || !isEnrolled || isAuthenticating}
              />

              {/* Alternative Options */}
              <View style={styles.alternativeContainer}>
                <TouchableOpacity 
                  style={styles.alternativeButton}
                  onPress={() => navigation.navigate(ROUTES.SIGN_IN)}
                >
                  <Text style={styles.alternativeText}>Use Password Instead</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.alternativeButton}
                  onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
                >
                  <Text style={styles.alternativeText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Card>

        {/* Security Note */}
        <Card style={styles.noteCard}>
          <Ionicons name="shield-checkmark" size={24} color={colors.primaryGreen} />
          <Text style={styles.noteText}>
            Your biometric data never leaves your device and is stored securely.
          </Text>
        </Card>

        {/* Tips */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips for better authentication:</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.successGreen} />
            <Text style={styles.tipText}>Ensure your finger/sensor is clean</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.successGreen} />
            <Text style={styles.tipText}>Position your face properly in good light</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.successGreen} />
            <Text style={styles.tipText}>Multiple failed attempts will fallback to password</Text>
          </View>
        </Card>

        {/* Skip for now */}
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => navigation.navigate(ROUTES.MAIN_TABS)}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  mainCard: {
    padding: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.primarySaffron,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  statusContainer: {
    width: '100%',
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  authButton: {
    width: '100%',
    marginBottom: 16,
  },
  alternativeContainer: {
    width: '100%',
  },
  alternativeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  alternativeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.primarySaffron,
  },
  noteCard: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  noteText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
  tipsCard: {
    padding: 16,
    marginBottom: 20,
  },
  tipsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textTertiary,
  },
});

export default BiometricScreen;