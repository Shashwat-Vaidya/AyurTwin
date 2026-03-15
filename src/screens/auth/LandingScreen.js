import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';

const { width, height } = Dimensions.get('window');

const LandingScreen = () => {
  const navigation = useNavigation();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const leaf1Anim = useRef(new Animated.Value(0)).current;
  const leaf2Anim = useRef(new Animated.Value(0)).current;
  const leaf3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Leaf animations
    Animated.stagger(200, [
      Animated.spring(leaf1Anim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(leaf2Anim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(leaf3Anim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleGetStarted = () => {
    // Navigate to Sign In screen
    navigation.navigate(ROUTES.SIGN_IN);
  };

  const handleSignIn = () => {
    navigation.navigate(ROUTES.SIGN_IN);
  };

  // Leaf transformations
  const leaf1Transform = {
    transform: [
      { translateX: leaf1Anim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) },
      { translateY: leaf1Anim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
      { rotate: leaf1Anim.interpolate({ inputRange: [0, 1], outputRange: ['-30deg', '0deg'] }) },
    ],
    opacity: leaf1Anim,
  };

  const leaf2Transform = {
    transform: [
      { translateX: leaf2Anim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
      { translateY: leaf2Anim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) },
      { rotate: leaf2Anim.interpolate({ inputRange: [0, 1], outputRange: ['30deg', '0deg'] }) },
    ],
    opacity: leaf2Anim,
  };

  const leaf3Transform = {
    transform: [
      { scale: leaf3Anim },
    ],
    opacity: leaf3Anim,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundWhite} />
      
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.patternCircle, styles.circle1]} />
        <View style={[styles.patternCircle, styles.circle2]} />
        <View style={[styles.patternCircle, styles.circle3]} />
      </View>

      {/* Decorative Leaves */}
      <Animated.View style={[styles.decorativeLeaf, styles.leaf1, leaf1Transform]}>
        <Ionicons name="leaf" size={60} color={colors.primaryGreen} />
      </Animated.View>
      <Animated.View style={[styles.decorativeLeaf, styles.leaf2, leaf2Transform]}>
        <Ionicons name="leaf" size={50} color={colors.primarySaffron} />
      </Animated.View>
      <Animated.View style={[styles.decorativeLeaf, styles.leaf3, leaf3Transform]}>
        <Ionicons name="heart" size={40} color={colors.heartRate} />
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[colors.primarySaffron, colors.primaryGreen]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              <View style={styles.logoInner}>
                <Ionicons name="leaf" size={40} color="white" />
                <View style={styles.logoHeart}>
                  <Ionicons name="heart" size={20} color="white" />
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Title Section */}
        <Animated.View
          style={[
            styles.titleSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>AyurTwin</Text>
          <Text style={styles.subtitle}>Digital Health Twin</Text>
          
          <View style={styles.taglineContainer}>
            <Text style={styles.tagline}>
              Your personal AI powered{'\n'}
              Ayurvedic health companion
            </Text>
          </View>
        </Animated.View>

        {/* Features Section */}
        <Animated.View
          style={[
            styles.featuresSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.saffronLight }]}>
                <Ionicons name="fitness" size={24} color={colors.primarySaffron} />
              </View>
              <Text style={styles.featureText}>Real-time Monitoring</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.greenLight }]}>
                <Ionicons name="analytics" size={24} color={colors.primaryGreen} />
              </View>
              <Text style={styles.featureText}>AI Predictions</Text>
            </View>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.purpleLight }]}>
                <Ionicons name="leaf" size={24} color={colors.stressPurple} />
              </View>
              <Text style={styles.featureText}>Ayurvedic Wisdom</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.blueLight }]}>
                <Ionicons name="shield" size={24} color={colors.spO2Blue} />
              </View>
              <Text style={styles.featureText}>Health Twin</Text>
            </View>
          </View>
        </Animated.View>

        {/* Get Started Button */}
        <Animated.View
          style={[
            styles.buttonSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: buttonScale }],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleGetStarted}
          >
            <LinearGradient
              colors={[colors.primarySaffron, '#FFB347']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.getStartedButton}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Sign In Link */}
        <Animated.View
          style={[
            styles.signInSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.View
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.footerLink}>Terms</Text> and{' '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  backgroundPattern: {
    position: 'absolute',
    width: width,
    height: height,
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 500,
    backgroundColor: 'rgba(255, 153, 51, 0.03)',
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
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
  decorativeLeaf: {
    position: 'absolute',
  },
  leaf1: {
    top: 60,
    right: 20,
    opacity: 0.2,
  },
  leaf2: {
    bottom: 100,
    left: 20,
    opacity: 0.15,
  },
  leaf3: {
    top: height * 0.3,
    left: width * 0.2,
    opacity: 0.1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: colors.primarySaffron,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoHeart: {
    marginLeft: -5,
    marginTop: -10,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: 'sans-serif', fontWeight: 'bold',
    fontSize: 42,
    color: colors.textPrimary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'sans-serif', fontWeight: '500',
    fontSize: 18,
    color: colors.primaryGreen,
    marginBottom: 16,
  },
  taglineContainer: {
    paddingHorizontal: 20,
  },
  tagline: {
    fontFamily: 'sans-serif', fontWeight: 'normal',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontFamily: 'sans-serif', fontWeight: 'normal',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonSection: {
    marginBottom: 24,
  },
  getStartedButton: {
    flexDirection: 'row',
    backgroundColor: colors.primarySaffron,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primarySaffron,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  getStartedText: {
    fontFamily: 'sans-serif', fontWeight: '600',
    fontSize: 18,
    color: 'white',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  signInSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    fontFamily: 'sans-serif', fontWeight: 'normal',
    fontSize: 14,
    color: colors.textSecondary,
  },
  signInLink: {
    fontFamily: 'sans-serif', fontWeight: '600',
    fontSize: 14,
    color: colors.primarySaffron,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  footerText: {
    fontFamily: 'sans-serif', fontWeight: 'normal',
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  footerLink: {
    color: colors.primarySaffron,
    textDecorationLine: 'underline',
  },
});

// Additional color constants for feature icons
const saffronLight = 'rgba(255, 153, 51, 0.1)';
const greenLight = 'rgba(76, 175, 80, 0.1)';
const purpleLight = 'rgba(155, 107, 158, 0.1)';
const blueLight = 'rgba(74, 144, 226, 0.1)';

// Add these to your colors constant file
colors.saffronLight = saffronLight;
colors.greenLight = greenLight;
colors.purpleLight = purpleLight;
colors.blueLight = blueLight;

export default LandingScreen;