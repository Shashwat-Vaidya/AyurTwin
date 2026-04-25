import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../../config/theme';
import InputField from '../../components/common/InputField';
import GradientButton from '../../components/common/GradientButton';
import { useApp } from '../../context/AppContext';
import { loginUser } from '../../services/api';

const SignInScreen = ({ navigation }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email or username is required';
    if (!password.trim()) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await loginUser(email.trim(), password);
      if (result.success) {
        await login(result.data.user, result.data.token);
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient colors={COLORS.gradient.saffron} style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🌿</Text>
          </LinearGradient>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your AyurTwin account</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Email or Username"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email or username"
            keyboardType="email-address"
            icon="📧"
            error={errors.email}
          />
          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            icon="🔒"
            error={errors.password}
          />

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <GradientButton title="Sign In" onPress={handleSignIn} loading={loading} style={styles.signInBtn} />

          <TouchableOpacity style={styles.biometricBtn}>
            <Text style={styles.biometricIcon}>🔑</Text>
            <Text style={styles.biometricText}>Sign in with Biometrics</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.registerBtn}>
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.registerLink}>Get Started</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SIZES.screenPadding,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  form: {
    marginBottom: 24,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  signInBtn: {
    width: '100%',
    marginBottom: 16,
  },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: SIZES.borderRadius,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 8,
  },
  biometricIcon: {
    fontSize: 20,
  },
  biometricText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  registerBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  registerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default SignInScreen;
