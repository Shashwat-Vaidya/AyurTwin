import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const LoadingSpinner = ({
  visible = false,
  size = 'large',
  color = colors.primarySaffron,
  text,
  overlay = false,
  transparent = true,
  fullScreen = false,
  animation = 'fade',
  delay = 0,
  indicator = 'default', // 'default', 'custom', 'dots', 'pulse', 'circle'
  customIndicator,
  style,
}) => {
  
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      startAnimations();
    } else {
      resetAnimations();
    }
  }, [visible]);

  const startAnimations = () => {
    // Spin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade animation
    if (animation === 'fade') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeValue, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Dot animations
    if (indicator === 'dots') {
      const createDotAnimation = (dotAnim, delay) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dotAnim, {
              toValue: 1,
              duration: 600,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(dotAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      createDotAnimation(dot1Anim, 0);
      createDotAnimation(dot2Anim, 200);
      createDotAnimation(dot3Anim, 400);
    }
  };

  const resetAnimations = () => {
    spinValue.setValue(0);
    pulseValue.setValue(1);
    fadeValue.setValue(0);
    dot1Anim.setValue(0);
    dot2Anim.setValue(0);
    dot3Anim.setValue(0);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderDefaultIndicator = () => (
    <ActivityIndicator size={size} color={color} />
  );

  const renderCustomIndicator = () => {
    if (customIndicator) return customIndicator;

    return (
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Ionicons name="sync" size={size === 'large' ? 50 : 30} color={color} />
      </Animated.View>
    );
  };

  const renderDotsIndicator = () => (
    <View style={styles.dotsContainer}>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: color,
            opacity: dot1Anim,
            transform: [{
              scale: dot1Anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              })
            }]
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: color,
            opacity: dot2Anim,
            transform: [{
              scale: dot2Anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              })
            }]
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: color,
            opacity: dot3Anim,
            transform: [{
              scale: dot3Anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              })
            }]
          },
        ]}
      />
    </View>
  );

  const renderPulseIndicator = () => (
    <Animated.View
      style={[
        styles.pulseContainer,
        {
          transform: [{ scale: pulseValue }],
        },
      ]}
    >
      <LinearGradient
        colors={[color, `${color}CC`]}
        style={[
          styles.pulseCircle,
          { width: size === 'large' ? 60 : 40, height: size === 'large' ? 60 : 40 }
        ]}
      />
    </Animated.View>
  );

  const renderCircleIndicator = () => (
    <View style={styles.circleContainer}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: size === 'large' ? 50 : 30,
            height: size === 'large' ? 50 : 30,
            borderRadius: (size === 'large' ? 50 : 30) / 2,
            borderColor: color,
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </View>
  );

  const renderIndicator = () => {
    switch(indicator) {
      case 'custom':
        return renderCustomIndicator();
      case 'dots':
        return renderDotsIndicator();
      case 'pulse':
        return renderPulseIndicator();
      case 'circle':
        return renderCircleIndicator();
      default:
        return renderDefaultIndicator();
    }
  };

  const spinnerContent = (
    <Animated.View
      style={[
        styles.spinnerContainer,
        fullScreen && styles.fullScreen,
        !fullScreen && {
          opacity: animation === 'fade' ? fadeValue : 1,
          transform: animation === 'scale' ? [{ scale: pulseValue }] : [],
        },
        style,
      ]}
    >
      {renderIndicator()}
      {text && <Text style={styles.text}>{text}</Text>}
    </Animated.View>
  );

  if (overlay || fullScreen) {
    return (
      <Modal
        visible={visible}
        transparent={transparent}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          {spinnerContent}
        </View>
      </Modal>
    );
  }

  return visible ? spinnerContent : null;
};

export const FullScreenLoader = (props) => (
  <LoadingSpinner
    visible={true}
    fullScreen={true}
    overlay={true}
    transparent={true}
    {...props}
  />
);

export const PageLoader = ({ text = 'Loading...', ...props }) => (
  <View style={styles.pageLoader}>
    <LoadingSpinner visible={true} text={text} {...props} />
  </View>
);

export const ContentLoader = ({ text = 'Loading content...', ...props }) => (
  <View style={styles.contentLoader}>
    <LoadingSpinner visible={true} text={text} size="small" {...props} />
  </View>
);

export const SkeletonLoader = ({ width = '100%', height = 40, style }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.skeleton, { width, height }, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

export const CardSkeleton = () => (
  <View style={styles.cardSkeleton}>
    <SkeletonLoader height={20} width="60%" />
    <SkeletonLoader height={40} width="100%" style={styles.skeletonMargin} />
    <SkeletonLoader height={20} width="80%" style={styles.skeletonMargin} />
    <View style={styles.skeletonRow}>
      <SkeletonLoader height={30} width={30} style={styles.skeletonCircle} />
      <SkeletonLoader height={20} width="70%" style={styles.skeletonMargin} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  pulseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCircle: {
    borderRadius: 30,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  pageLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentLoader: {
    padding: 20,
    alignItems: 'center',
  },
  skeleton: {
    backgroundColor: '#E8ECF0',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardSkeleton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  skeletonMargin: {
    marginTop: 8,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  skeletonCircle: {
    borderRadius: 15,
    marginRight: 12,
  },
});

export default LoadingSpinner;