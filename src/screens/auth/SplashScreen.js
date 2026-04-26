import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../config/theme';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Landing');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={COLORS.gradient.saffron}
            style={styles.logoCircle}
          >
            <Ionicons name="leaf" size={48} color="#FFFFFF" />
          </LinearGradient>
        </View>
        <Text style={styles.appName}>AyurTwin</Text>
        <Text style={styles.subtitle}>Digital Health Twin</Text>
        <View style={styles.taglineContainer}>
          <View style={styles.taglineLine} />
          <Text style={styles.tagline}>AI + Ayurveda</Text>
          <View style={styles.taglineLine} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 1,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  taglineLine: {
    width: 30,
    height: 1,
    backgroundColor: COLORS.primary,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    letterSpacing: 2,
  },
});

export default SplashScreen;
