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
import {
  updateFormData,
  setStepValidity,
  nextStep,
  previousStep,
} from '../../store/slices/registrationSlice';

import Button from '../../components/common/Button';
import ProgressIndicator from '../../components/common/ProgressIndicator';

const Step8Credentials = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { formData, isLoading } = useSelector((state) => state.registration);
  const { user: savedUser } = useSelector((state) => state.user);

  const [username, setUsername] = useState(formData?.credentials?.username || '');
  const [email, setEmail] = useState(savedUser?.email || formData?.credentials?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [enableBiometric, setEnableBiometric] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

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

    if (!username) newErrors.username = 'Username is required';
    else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(email)) newErrors.email = 'Please enter a valid email';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (!agreeToTerms) newErrors.terms = 'You must agree to the terms';

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    dispatch(setStepValidity({ step: 8, isValid }));
    return isValid;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix errors first');
      return;
    }

    try {
      const registrationData = {
        ...savedUser,
        ...formData,
        credentials: { username, email, password },
        settings: { biometric: enableBiometric },
      };

      const result = await dispatch(registerUser(registrationData)).unwrap();

      if (result) {
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

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Create Your Account</Text>

        {/* Username */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        {/* Confirm Password */}
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Button
          title={isLoading ? 'Creating...' : 'Create Account'}
          onPress={handleCreateAccount}
          gradient
        />

        <TouchableOpacity onPress={handleBack}>
          <Text style={{ textAlign: 'center', marginTop: 15 }}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundWhite },
  scrollView: { flex: 1 },
  contentContainer: { padding: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
});

export default Step8Credentials;