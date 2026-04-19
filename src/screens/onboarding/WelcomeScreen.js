import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Button from '../../components/common/Button';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
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
  }, []);

  const handleGetStarted = () => {
    navigation.navigate(ROUTES.ONBOARDING);
  };

  const handleSignIn = () => {
    navigation.navigate(ROUTES.SIGN_IN);
  };

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.background}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          style={styles.logoContainer}
        >
          <Ionicons name="leaf" size={60} color="white" />
          <View style={styles.logoHeart}>
            <Ionicons name="heart" size={30} color="white" />
          </View>
        </LinearGradient>

        <Text style={styles.appName}>AyurTwin</Text>
        <Text style={styles.tagline}>Your Digital Health Twin</Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.welcomeText}>Welcome to the future of personalized healthcare</Text>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color={colors.successGreen} />
            <Text style={styles.featureText}>Real-time health monitoring</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color={colors.successGreen} />
            <Text style={styles.featureText}>AI-powered disease predictions</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color={colors.successGreen} />
            <Text style={styles.featureText}>Personalized Ayurvedic guidance</Text>
          </View>
        </View>

        <Button
          title="Get Started"
          onPress={handleGetStarted}
          gradient
          style={styles.getStartedButton}
        />

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  background: {
    position: 'absolute',
    width,
    height,
  },
  circle: {
    position: 'absolute',
    borderRadius: 500,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
    backgroundColor: 'rgba(255, 153, 51, 0.03)',
  },
  circle2: {
    width: 400,
    height: 400,
    bottom: -150,
    left: -150,
    backgroundColor: 'rgba(76, 175, 80, 0.03)',
  },
  circle3: {
    width: 200,
    height: 200,
    top: '30%',
    left: '10%',
    backgroundColor: 'rgba(255, 153, 51, 0.02)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.primarySaffron,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoHeart: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 42,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  features: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  getStartedButton: {
    marginBottom: 20,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  signInLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.primarySaffron,
  },
});

export default WelcomeScreen;