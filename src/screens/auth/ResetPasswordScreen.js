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

const ResetPasswordScreen = () => {
  const navigation = useNavigation();

  // Form state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Password requirements
  const passwordRequirements = [
    { id: 'minLength', label: 'At least 8 characters', validator: (pwd) => pwd.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter', validator: (pwd) => /[A-Z]/.test(pwd) },
    { id: 'lowercase', label: 'One lowercase letter', validator: (pwd) => /[a-z]/.test(pwd) },
    { id: 'number', label: 'One number', validator: (pwd) => /[0-9]/.test(pwd) },
    { id: 'special', label: 'One special character', validator: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ];

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

  React.useEffect(() => {
    calculatePasswordStrength();
    validateForm();
  }, [password, confirmPassword]);

  const calculatePasswordStrength = () => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;

    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return colors.alertRed;
    if (passwordStrength < 70) return colors.warningYellow;
    if (passwordStrength < 90) return colors.spO2Blue;
    return colors.successGreen;
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    if (passwordStrength < 90) return 'Strong';
    return 'Very Strong';
  };

  const handleResetPassword = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix all errors before proceeding');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setResetSuccess(true);
    }, 1500);
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
              <Ionicons name="key" size={40} color="white" />
            </LinearGradient>
          </View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Create a new password for your account
          </Text>
        </Animated.View>

        {/* Form Section */}
        {!resetSuccess ? (
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* New Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>New Password</Text>
              <View style={[styles.inputContainer, errors.password ? styles.inputError : null]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={colors.textTertiary} 
                  />
                </TouchableOpacity>
              </View>

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBarContainer}>
                    <View 
                      style={[
                        styles.strengthBar, 
                        { width: `${passwordStrength}%`, backgroundColor: getPasswordStrengthColor() }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.strengthText, { color: getPasswordStrengthColor() }]}>
                    {getPasswordStrengthLabel()}
                  </Text>
                </View>
              )}

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                {passwordRequirements.map((req) => (
                  <View key={req.id} style={styles.requirementItem}>
                    <Ionicons 
                      name={req.validator(password) ? 'checkmark-circle' : 'ellipse-outline'} 
                      size={16} 
                      color={req.validator(password) ? colors.successGreen : colors.textTertiary} 
                    />
                    <Text style={[
                      styles.requirementText,
                      req.validator(password) && styles.requirementMet
                    ]}>
                      {req.label}
                    </Text>
                  </View>
                ))}
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[styles.inputContainer, errors.confirmPassword ? styles.inputError : null]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={colors.textTertiary} 
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* Reset Password Button */}
            <Button
              title={isLoading ? "Resetting..." : "Reset Password"}
              onPress={handleResetPassword}
              style={styles.resetButton}
              gradient
              disabled={isLoading || Object.keys(errors).length > 0}
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

            <Text style={styles.successTitle}>Password Reset!</Text>
            
            <Text style={styles.successMessage}>
              Your password has been successfully reset.
            </Text>

            <View style={styles.successDetails}>
              <Ionicons name="shield-checkmark" size={24} color={colors.successGreen} />
              <Text style={styles.successDetailText}>
                You can now sign in with your new password
              </Text>
            </View>

            {/* Go to Sign In Button */}
            <Button
              title="Sign In"
              onPress={handleGoToSignIn}
              style={styles.signInButton}
              gradient
            />
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
            For security reasons, please don't share your password with anyone.
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
    marginBottom: 30,
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
    marginBottom: 8,
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
    marginBottom: 20,
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
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  strengthBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    marginRight: 8,
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    width: 70,
  },
  requirementsContainer: {
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    padding: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginLeft: 8,
  },
  requirementMet: {
    color: colors.successGreen,
    textDecorationLine: 'line-through',
  },
  resetButton: {
    marginTop: 10,
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
    textAlign: 'center',
    marginBottom: 20,
  },
  successDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  successDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.successGreen,
    marginLeft: 12,
    flex: 1,
  },
  signInButton: {
    width: '100%',
    marginBottom: 20,
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

export default ResetPasswordScreen;