import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import { registerUser } from '../../store/slices/authSlice';
import { updateFormData, setStepValidity, nextStep, previousStep } from '../../store/slices/registrationSlice';
import Button from '../../components/common/Button';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import { validatePassword, validateEmail, validateUsername } from '../../utils/validators/registrationValidator';

const Step8Credentials = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { formData, isLoading } = useSelector((state) => state.registration);
  const { user: savedUser } = useSelector((state) => state.user);

  // Form state
  const [username, setUsername] = useState(formData?.credentials?.username || '');
  const [email, setEmail] = useState(savedUser?.email || formData?.credentials?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [enableBiometric, setEnableBiometric] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password requirements
  const passwordRequirements = [
    { id: 'minLength', label: 'At least 8 characters', validator: (pwd) => pwd.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter', validator: (pwd) => /[A-Z]/.test(pwd) },
    { id: 'lowercase', label: 'One lowercase letter', validator: (pwd) => /[a-z]/.test(pwd) },
    { id: 'number', label: 'One number', validator: (pwd) => /[0-9]/.test(pwd) },
    { id: 'special', label: 'One special character', validator: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ];

  useEffect(() => {
    checkBiometricAvailability();
    validateForm();
  }, [username, email, password, confirmPassword, agreeToTerms]);

  useEffect(() => {
    calculatePasswordStrength();
  }, [password]);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricAvailable(compatible && enrolled);
  };

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

    // Username validation
    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

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

    // Terms agreement
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    dispatch(setStepValidity({ step: 8, isValid }));
    
    return isValid;
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

  const handleCreateAccount = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix all errors before proceeding');
      return;
    }

    try {
      // Combine all registration data
      const registrationData = {
        ...savedUser,
        ...formData,
        credentials: {
          username,
          email,
          password,
        },
        settings: {
          biometric: enableBiometric,
        },
      };

      // Register user
      const result = await dispatch(registerUser(registrationData)).unwrap();
      
      if (result) {
        // Navigate to registration complete
        dispatch(nextStep());
        navigation.navigate(ROUTES.REGISTRATION_COMPLETE);
      }
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Something went wrong');
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ProgressIndicator currentStep={8} totalSteps={8} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Create Your Account</Text>
        <Text style={styles.sectionSubtitle}>
          Almost done! Set up your login credentials
        </Text>

        {/* Username Field */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>
            Username <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.inputContainer, errors.username && touched.username && styles.inputError]}>
            <Ionicons name="person-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              placeholderTextColor={colors.textTertiary}
              value={username}
              onChangeText={setUsername}
              onBlur={() => setTouched({ ...touched, username: true })}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.username && touched.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}
        </View>

        {/* Email Field */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.inputContainer, errors.email && touched.email && styles.inputError]}>
            <Ionicons name="mail-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              onBlur={() => setTouched({ ...touched, email: true })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.email && touched.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
        </View>

        {/* Password Field */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>
            Password <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.inputContainer, errors.password && touched.password && styles.inputError]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              onBlur={() => setTouched({ ...touched, password: true })}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
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
          {errors.password && touched.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Confirm Password Field */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>
            Confirm Password <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.inputContainer, errors.confirmPassword && touched.confirmPassword && styles.inputError]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor={colors.textTertiary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={() => setTouched({ ...touched, confirmPassword: true })}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons 
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                size={20} 
                color={colors.textTertiary} 
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && touched.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* Biometric Option */}
        {biometricAvailable && (
          <TouchableOpacity 
            style={styles.biometricOption}
            onPress={() => setEnableBiometric(!enableBiometric)}
          >
            <View style={styles.biometricLeft}>
              <Ionicons name="finger-print" size={24} color={colors.primarySaffron} />
              <Text style={styles.biometricText}>Enable biometric login</Text>
            </View>
            <View style={[styles.checkbox, enableBiometric && styles.checkboxChecked]}>
              {enableBiometric && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
          </TouchableOpacity>
        )}

        {/* Terms Agreement */}
        <TouchableOpacity 
          style={styles.termsOption}
          onPress={() => setAgreeToTerms(!agreeToTerms)}
        >
          <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
            {agreeToTerms && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
        {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Registration Summary</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Personal Info</Text>
            <Ionicons name="checkmark-circle" size={20} color={colors.successGreen} />
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Lifestyle & Health</Text>
            <Ionicons name="checkmark-circle" size={20} color={colors.successGreen} />
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Ayurvedic Profile</Text>
            <Ionicons name="checkmark-circle" size={20} color={colors.successGreen} />
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Prakriti Analysis</Text>
            <Ionicons name="checkmark-circle" size={20} color={colors.successGreen} />
          </View>
        </View>

        {/* Create Account Button */}
        <Button
          title={isLoading ? "Creating Account..." : "Create Account"}
          onPress={handleCreateAccount}
          style={styles.createButton}
          gradient
          disabled={isLoading || Object.keys(errors).length > 0}
        />

        {/* Back Button */}
        <TouchableOpacity style={styles.backLink} onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
          <Text style={styles.backLinkText}>Back to previous step</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
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
  required: {
    color: colors.alertRed,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: colors.alertRed,
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
  biometricOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  biometricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  biometricText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  termsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primarySaffron,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primarySaffron,
  },
  termsText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primarySaffron,
    textDecorationLine: 'underline',
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 20,
  },
  summaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  createButton: {
    marginTop: 10,
    marginBottom: 16,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  backLinkText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textSecondary,
    marginLeft: 6,
  },
});

export default Step8Credentials;