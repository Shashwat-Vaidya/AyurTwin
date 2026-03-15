import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  // Form state
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSendResetLink = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
    }, 1500);
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Reset email sent again!');
    }, 1000);
  };

  const handleGoToSignIn = () => {
    navigation.navigate(ROUTES.SIGN_IN);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Header Section */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={[colors.primarySaffron, colors.primaryGreen]}
              style={styles.iconGradient}
            >
              <Ionicons name="lock-open" size={40} color="white" />
            </LinearGradient>
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Don't worry! Enter your email and we'll send you a link to reset your password.
          </Text>
        </Animated.View>

        {/* Form Section */}
        {!resetSent ? (
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputContainer, emailError ? styles.inputError : null]}>
                <Ionicons name="mail-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textTertiary}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* Send Reset Link Button */}
            <Button
              title={isLoading ? "Sending..." : "Send Reset Link"}
              onPress={handleSendResetLink}
              style={styles.resetButton}
              gradient
              disabled={isLoading}
              loading={isLoading}
            />

            {/* Back to Sign In */}
            <TouchableOpacity style={styles.signInLink} onPress={handleGoToSignIn}>
              <Ionicons name="arrow-back" size={16} color={colors.primarySaffron} />
              <Text style={styles.signInLinkText}>Back to Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          /* Success State */
          <Animated.View
            style={[
              styles.successContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.successIconContainer}>
              <LinearGradient
                colors={[colors.successGreen, colors.primaryGreen]}
                style={styles.successIconGradient}
              >
                <Ionicons name="checkmark" size={50} color="white" />
              </LinearGradient>
            </View>

            <Text style={styles.successTitle}>Check Your Email</Text>
            
            <Text style={styles.successMessage}>
              We've sent a password reset link to:
            </Text>
            <Text style={styles.successEmail}>{email}</Text>

            <View style={styles.successDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={20} color={colors.primarySaffron} />
                <Text style={styles.detailText}>Link expires in 30 minutes</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="mail-outline" size={20} color={colors.primarySaffron} />
                <Text style={styles.detailText}>Check your spam folder if not received</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <Button
              title="Resend Email"
              onPress={handleResendEmail}
              style={styles.resendButton}
              outline
            />

            <Button
              title="Back to Sign In"
              onPress={handleGoToSignIn}
              style={styles.backToSignInButton}
              gradient
            />

            <TouchableOpacity 
              style={styles.needHelpLink}
              onPress={() => Alert.alert('Contact Support', 'Please email support@ayurtwin.com')}
            >
              <Text style={styles.needHelpText}>Need help? Contact Support</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Footer Note */}
        <Animated.View
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <Text style={styles.footerText}>
            We take your privacy seriously. Your information is secure.
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primarySaffron,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.alertRed,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.alertRed,
    marginTop: 4,
    marginLeft: 4,
  },
  resetButton: {
    marginBottom: 20,
  },
  signInLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  signInLinkText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.primarySaffron,
    marginLeft: 6,
  },
  // Success state styles
  successContainer: {
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.successGreen,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  successTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  successMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  successEmail: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.primarySaffron,
    marginBottom: 24,
  },
  successDetails: {
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  resendButton: {
    marginBottom: 12,
    width: '100%',
  },
  backToSignInButton: {
    marginBottom: 20,
    width: '100%',
  },
  needHelpLink: {
    paddingVertical: 12,
  },
  needHelpText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textTertiary,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ForgotPasswordScreen;