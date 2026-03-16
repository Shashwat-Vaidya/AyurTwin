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

  // FIXED progress animation (numeric width instead of %)
  const progressWidth = logoOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 100],
  });

  useEffect(() => {
    Animated.sequence([
      Animated.timing(gradientOpacity, {
        toValue: 0.1,
        duration: 500,
        useNativeDriver: false,
        easing: Easing.ease,
      }),

      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: false,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),

      Animated.timing(leafRotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
        easing: Easing.elastic(1),
      }),

      Animated.sequence([
        Animated.spring(heartScale, {
          toValue: 1.2,
          friction: 3,
          useNativeDriver: false,
        }),
        Animated.spring(heartScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: false,
        }),
      ]),

      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace(ROUTES.LANDING);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const spin = leafRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const heartBeat = heartScale.interpolate({
    inputRange: [0.5, 1, 1.2],
    outputRange: [0.5, 1, 1.2],
  });

  return (
    <View style={styles.container}>

      {/* Gradient */}
      <Animated.View style={[styles.gradientContainer, { opacity: gradientOpacity }]}>
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* Content */}
      <View style={styles.content}>

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >

          <Animated.View
            style={[
              styles.leafIcon,
              { transform: [{ rotate: spin }] },
            ]}
          >
            <View style={styles.leaf}>
              <View style={[styles.leafPart, styles.leafLeft]} />
              <View style={[styles.leafPart, styles.leafRight]} />
              <View style={styles.leafStem} />
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.heartIcon,
              { transform: [{ scale: heartBeat }] },
            ]}
          >
            <View style={styles.heart}>
              <View style={[styles.heartPart, styles.heartLeft]} />
              <View style={[styles.heartPart, styles.heartRight]} />
              <View style={styles.heartBottom} />
            </View>
          </Animated.View>

          <View style={styles.connectingLine} />

        </Animated.View>

        {/* Text */}
        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <Text style={styles.appName}>AyurTwin</Text>
          <Text style={styles.tagline}>Digital Health Twin</Text>
        </Animated.View>

        <Animated.View style={[styles.versionContainer, { opacity: textOpacity }]}>
          <Text style={styles.version}>v1.0.0</Text>
        </Animated.View>

      </View>

      {/* FIXED Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            { width: progressWidth },
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
    width,
    height,
  },

  gradient: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
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
  },

  leafPart: {
    position: 'absolute',
    width: 30,
    height: 40,
    borderRadius: 20,
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
  },

  textContainer: {
    alignItems: 'center',
  },

  appName: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
  },

  tagline: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: colors.textSecondary,
  },

  versionContainer: {
    position: 'absolute',
    bottom: 40,
  },

  version: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
  },

  progressContainer: {
    position: 'absolute',
    bottom: 20,
    left: 50,
    right: 50,
    height: 3,
    backgroundColor: 'rgba(255,153,51,0.2)',
    borderRadius: 2,
  },

  progressBar: {
    height: '100%',
    backgroundColor: colors.primarySaffron,
  },
});

export default SplashScreen;