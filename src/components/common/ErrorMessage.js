import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const ErrorMessage = ({
  message,
  type = 'error', // 'error', 'warning', 'info', 'success'
  showIcon = true,
  onDismiss,
  autoDismiss = false,
  dismissTime = 5000,
  showRetry = false,
  onRetry,
  retryText = 'Try Again',
  style,
  textStyle,
  iconStyle,
}) => {
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Shake animation for errors
    if (type === 'error') {
      startShakeAnimation();
    }

    // Auto dismiss
    if (autoDismiss) {
      startProgressAnimation();
      const timer = setTimeout(() => {
        if (onDismiss) onDismiss();
      }, dismissTime);
      return () => clearTimeout(timer);
    }
  }, []);

  const startShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const startProgressAnimation = () => {
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: dismissTime,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const getIcon = () => {
    switch(type) {
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      case 'success':
        return 'checkmark-circle';
      default:
        return 'alert-circle';
    }
  };

  const getColors = () => {
    switch(type) {
      case 'error':
        return {
          background: colors.alertRed,
          light: `${colors.alertRed}10`,
          text: colors.alertRed,
          icon: colors.alertRed,
        };
      case 'warning':
        return {
          background: colors.warningYellow,
          light: `${colors.warningYellow}10`,
          text: colors.warningYellow,
          icon: colors.warningYellow,
        };
      case 'info':
        return {
          background: colors.spO2Blue,
          light: `${colors.spO2Blue}10`,
          text: colors.spO2Blue,
          icon: colors.spO2Blue,
        };
      case 'success':
        return {
          background: colors.successGreen,
          light: `${colors.successGreen}10`,
          text: colors.successGreen,
          icon: colors.successGreen,
        };
      default:
        return {
          background: colors.alertRed,
          light: `${colors.alertRed}10`,
          text: colors.alertRed,
          icon: colors.alertRed,
        };
    }
  };

  const colors_ = getColors();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { translateX: shakeAnim },
          ],
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[colors_.light, colors_.light]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {showIcon && (
            <View style={[styles.iconContainer, iconStyle]}>
              <Ionicons name={getIcon()} size={24} color={colors_.icon} />
            </View>
          )}

          <View style={styles.messageContainer}>
            <Text style={[styles.message, { color: colors_.text }, textStyle]}>
              {message}
            </Text>
          </View>

          <View style={styles.actions}>
            {showRetry && (
              <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
                <Text style={[styles.retryText, { color: colors_.text }]}>
                  {retryText}
                </Text>
              </TouchableOpacity>
            )}

            {onDismiss && (
              <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
                <Ionicons name="close" size={20} color={colors_.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {autoDismiss && (
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: colors_.background,
              },
            ]}
          />
        )}
      </LinearGradient>
    </Animated.View>
  );
};

export const ErrorBanner = ({ errors = [], onDismiss }) => {
  if (errors.length === 0) return null;

  return (
    <View style={styles.bannerContainer}>
      <LinearGradient
        colors={[colors.alertRed, colors.alertRed]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.bannerGradient}
      >
        <View style={styles.bannerContent}>
          <Ionicons name="alert-circle" size={20} color="white" />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>
              {errors.length} {errors.length === 1 ? 'Error' : 'Errors'} Found
            </Text>
            {errors.map((error, index) => (
              <Text key={index} style={styles.bannerText}>• {error}</Text>
            ))}
          </View>
          {onDismiss && (
            <TouchableOpacity onPress={onDismiss}>
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export const ErrorToast = ({
  message,
  type = 'error',
  onDismiss,
  position = 'top', // 'top' or 'bottom'
}) => {
  return (
    <View style={[
      styles.toastContainer,
      position === 'top' ? styles.toastTop : styles.toastBottom,
    ]}>
      <ErrorMessage
        message={message}
        type={type}
        onDismiss={onDismiss}
        autoDismiss={true}
        dismissTime={3000}
      />
    </View>
  );
};

export const FormError = ({ error, touched, style }) => {
  if (!error || !touched) return null;

  return (
    <Animated.View style={[styles.formErrorContainer, style]}>
      <Ionicons name="alert-circle" size={12} color={colors.alertRed} />
      <Text style={styles.formErrorText}>{error}</Text>
    </Animated.View>
  );
};

export const ErrorList = ({ errors, style }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <View style={[styles.listContainer, style]}>
      <LinearGradient
        colors={[`${colors.alertRed}10`, `${colors.alertRed}10`]}
        style={styles.listGradient}
      >
        <View style={styles.listHeader}>
          <Ionicons name="alert-circle" size={20} color={colors.alertRed} />
          <Text style={styles.listTitle}>Please fix the following errors:</Text>
        </View>
        {errors.map((error, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listText}>{error}</Text>
          </View>
        ))}
      </LinearGradient>
    </View>
  );
};

export const ConnectionError = ({ onRetry }) => (
  <View style={styles.connectionContainer}>
    <Ionicons name="cloud-offline" size={50} color={colors.textTertiary} />
    <Text style={styles.connectionTitle}>Connection Error</Text>
    <Text style={styles.connectionText}>
      Unable to connect to the server. Please check your internet connection.
    </Text>
    {onRetry && (
      <TouchableOpacity style={styles.connectionButton} onPress={onRetry}>
        <Text style={styles.connectionButtonText}>Try Again</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  retryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
  },
  dismissButton: {
    padding: 4,
  },
  progressBar: {
    height: 3,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  bannerContainer: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerGradient: {
    padding: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  bannerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  bannerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'white',
    opacity: 0.9,
    marginBottom: 2,
    lineHeight: 18,
  },
  toastContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toastTop: {
    top: 50,
  },
  toastBottom: {
    bottom: 50,
  },
  formErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 4,
  },
  formErrorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.alertRed,
    marginLeft: 4,
  },
  listContainer: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  listGradient: {
    padding: 16,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 8,
  },
  listBullet: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.alertRed,
    marginRight: 6,
  },
  listText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  connectionContainer: {
    alignItems: 'center',
    padding: 30,
  },
  connectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  connectionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  connectionButton: {
    backgroundColor: colors.primarySaffron,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  connectionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: 'white',
  },
});

export default ErrorMessage;