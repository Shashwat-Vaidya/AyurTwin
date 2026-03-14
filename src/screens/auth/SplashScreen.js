import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const leafRotate = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0.5)).current;
  const gradientOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Fade in gradient background
      Animated.timing(gradientOpacity, {
        toValue: 0.1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      
      // Logo scale and fade in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // Leaf rotation animation
      Animated.timing(leafRotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.elastic(1),
      }),
      
      // Heart pulse animation
      Animated.sequence([
        Animated.spring(heartScale, {
          toValue: 1.2,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(heartScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
      
      // Text fade in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to landing after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace(ROUTES.LANDING);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Rotation interpolation
  const spin = leafRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Heart beat interpolation
  const heartBeat = heartScale.interpolate({
    inputRange: [0.5, 1, 1.2],
    outputRange: [0.5, 1, 1.2],
  });

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <Animated.View style={[styles.gradientContainer, { opacity: gradientOpacity }]}>
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* Background Pattern */}
      <View style={styles.patternContainer}>
        <View style={[styles.patternCircle, styles.circle1]} />
        <View style={[styles.patternCircle, styles.circle2]} />
        <View style={[styles.patternCircle, styles.circle3]} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo Container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          {/* Leaf Icon (Ayurveda) */}
          <Animated.View
            style={[
              styles.leafIcon,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <View style={styles.leaf}>
              <View style={[styles.leafPart, styles.leafLeft]} />
              <View style={[styles.leafPart, styles.leafRight]} />
              <View style={styles.leafStem} />
            </View>
          </Animated.View>

          {/* Heart Icon (Health) */}
          <Animated.View
            style={[
              styles.heartIcon,
              {
                transform: [{ scale: heartBeat }],
              },
            ]}
          >
            <View style={styles.heart}>
              <View style={[styles.heartPart, styles.heartLeft]} />
              <View style={[styles.heartPart, styles.heartRight]} />
              <View style={styles.heartBottom} />
            </View>
          </Animated.View>

          {/* Connecting Line */}
          <View style={styles.connectingLine} />
        </Animated.View>

        {/* App Name and Tagline */}
        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <Text style={styles.appName}>AyurTwin</Text>
          <Text style={styles.tagline}>Digital Health Twin</Text>
          
          {/* Animated Dots */}
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </Animated.View>

        {/* Version Number */}
        <Animated.View style={[styles.versionContainer, { opacity: textOpacity }]}>
          <Text style={styles.version}>v1.0.0</Text>
        </Animated.View>
      </View>

      {/* Loading Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: logoOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientContainer: {
    position: 'absolute',
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
  },
  patternContainer: {
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  leafIcon: {
    position: 'absolute',
    width: 60,
    height: 60,
    left: -10,
    top: 10,
  },
  leaf: {
    width: 60,
    height: 60,
    position: 'relative',
  },
  leafPart: {
    position: 'absolute',
    width: 30,
    height: 40,
    backgroundColor: colors.primaryGreen,
    borderRadius: 20,
    opacity: 0.9,
  },
  leafLeft: {
    left: 5,
    top: 10,
    transform: [{ rotate: '-30deg' }],
    backgroundColor: colors.primaryGreen,
  },
  leafRight: {
    right: 5,
    top: 10,
    transform: [{ rotate: '30deg' }],
    backgroundColor: colors.primarySaffron,
  },
  leafStem: {
    position: 'absolute',
    width: 4,
    height: 30,
    backgroundColor: '#8B4513',
    bottom: 5,
    left: 28,
    borderRadius: 2,
  },
  heartIcon: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: -10,
    bottom: 10,
  },
  heart: {
    width: 60,
    height: 60,
    position: 'relative',
  },
  heartPart: {
    position: 'absolute',
    width: 30,
    height: 45,
    backgroundColor: colors.heartRate,
    borderRadius: 30,
  },
  heartLeft: {
    left: 5,
    top: 5,
    transform: [{ rotate: '-45deg' }],
  },
  heartRight: {
    right: 5,
    top: 5,
    transform: [{ rotate: '45deg' }],
  },
  heartBottom: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: colors.heartRate,
    bottom: 10,
    left: 15,
    transform: [{ rotate: '45deg' }],
  },
  connectingLine: {
    position: 'absolute',
    width: 40,
    height: 2,
    backgroundColor: colors.primarySaffron,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -1 }],
    opacity: 0.3,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 42,
    color: colors.textPrimary,
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: 'rgba(255, 153, 51, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: colors.primarySaffron,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
    transform: [{ scale: 1.2 }],
  },
  dot3: {
    opacity: 0.4,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  version: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 20,
    left: 50,
    right: 50,
    height: 3,
    backgroundColor: 'rgba(255, 153, 51, 0.2)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primarySaffron,
    borderRadius: 1.5,
  },
});

// Additional animation for the dots
const DotAnimation = () => {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDots = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot1Anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Anim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Anim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Anim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDots();
  }, []);

  return (
    <View style={styles.dotsContainer}>
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: dot1Anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1],
            }),
            transform: [
              {
                scale: dot1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: dot2Anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1],
            }),
            transform: [
              {
                scale: dot2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: dot3Anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1],
            }),
            transform: [
              {
                scale: dot3Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

// Replace the dots in the main component with DotAnimation
// In the main component, replace:
// <View style={styles.dotsContainer}>
//   <View style={[styles.dot, styles.dot1]} />
//   <View style={[styles.dot, styles.dot2]} />
//   <View style={[styles.dot, styles.dot3]} />
// </View>
// with:
// <DotAnimation />

export default SplashScreen;