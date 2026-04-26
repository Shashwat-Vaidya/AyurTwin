import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import GradientButton from '../../components/common/GradientButton';
import { useApp } from '../../context/AppContext';

const LandingScreen = ({ navigation }) => {
  const { dispatch } = useApp();
  const [selectedType, setSelectedType] = useState('patient');

  const handleGetStarted = () => {
    dispatch({ type: 'SET_USER_TYPE', payload: selectedType });
    navigation.navigate('Register');
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <LinearGradient
          colors={COLORS.gradient.saffron}
          style={styles.logoCircle}
        >
          <Ionicons name="leaf" size={40} color="#FFFFFF" />
        </LinearGradient>
        <Text style={styles.appName}>AyurTwin</Text>
        <Text style={styles.tagline}>Your personal AI-powered Ayurvedic health companion</Text>
      </View>

      <View style={styles.typeToggle}>
        <Text style={styles.typeLabel}>Continue as:</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, selectedType === 'patient' && styles.toggleActive]}
            onPress={() => setSelectedType('patient')}
          >
            <Ionicons name="person-circle-outline" size={32} color={selectedType === 'patient' ? COLORS.primary : COLORS.textSecondary} style={styles.toggleIcon} />
            <Text style={[styles.toggleText, selectedType === 'patient' && styles.toggleTextActive]}>Patient</Text>
            <Text style={styles.toggleDesc}>Full Health Tracking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, selectedType === 'family_member' && styles.toggleActive]}
            onPress={() => setSelectedType('family_member')}
          >
            <Ionicons name="people-outline" size={32} color={selectedType === 'family_member' ? COLORS.primary : COLORS.textSecondary} style={styles.toggleIcon} />
            <Text style={[styles.toggleText, selectedType === 'family_member' && styles.toggleTextActive]}>Family Member</Text>
            <Text style={styles.toggleDesc}>Monitor Others</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonSection}>
        <GradientButton title="Get Started" onPress={handleGetStarted} style={styles.btn} />
        <TouchableOpacity onPress={handleSignIn} style={styles.signInBtn}>
          <Text style={styles.signInText}>Already have an account? <Text style={styles.signInLink}>Sign In</Text></Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimer}>
        This app provides preventive health insights and does not replace professional medical advice.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SIZES.screenPadding,
    justifyContent: 'center',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  typeToggle: {
    marginBottom: 32,
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.borderRadiusLg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  toggleActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F0',
    ...SHADOWS.small,
  },
  toggleIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  toggleTextActive: {
    color: COLORS.primary,
  },
  toggleDesc: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  buttonSection: {
    gap: 16,
  },
  btn: {
    width: '100%',
  },
  signInBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  signInText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  signInLink: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 14,
    paddingHorizontal: 20,
  },
});

export default LandingScreen;
