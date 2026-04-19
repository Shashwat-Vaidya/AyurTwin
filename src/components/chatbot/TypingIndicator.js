import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const TypingIndicator = ({
  dotColor = colors.primarySaffron,
  dotSize = 8,
  dotCount = 3,
  animationDuration = 600,
  showLabel = true,
  label = 'AyurBot is typing...',
  labelStyle,
  style,
}) => {
  
  const animations = useRef(
    Array(dotCount).fill(0).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    const createAnimation = (index) => {
      return Animated.sequence([
        Animated.delay(index * (animationDuration / dotCount / 2)),
        Animated.loop(
          Animated.sequence([
            Animated.timing(animations[index], {
              toValue: 1,
              duration: animationDuration,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(animations[index], {
              toValue: 0,
              duration: animationDuration,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
    };

    Animated.parallel(
      animations.map((_, index) => createAnimation(index))
    ).start();
  };

  const getDotStyle = (index) => ({
    transform: [
      {
        translateY: animations[index].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -dotSize, 0],
        }),
      },
      {
        scale: animations[index].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.2, 1],
        }),
      },
    ],
    opacity: animations[index].interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 1, 0.3],
    }),
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.bubble}>
        <LinearGradient
          colors={['#F5F5F5', '#FAFAFA']}
          style={styles.gradient}
        >
          <View style={styles.dotsContainer}>
            {animations.map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize / 2,
                    backgroundColor: dotColor,
                    marginHorizontal: dotSize / 2,
                  },
                  getDotStyle(index),
                ]}
              />
            ))}
          </View>
        </LinearGradient>
      </View>
      {showLabel && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
    </View>
  );
};

export const SimpleTypingIndicator = ({ color = colors.primarySaffron, style }) => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.simpleContainer, style]}>
      <Text style={[styles.simpleText, { color, opacity: fadeAnim }]}>
        Typing...
      </Text>
    </View>
  );
};

export const PulseTypingIndicator = ({ dotColor = colors.primarySaffron, style }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.pulseContainer, style]}>
      <Animated.View
        style={[
          styles.pulseDot,
          {
            backgroundColor: dotColor,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.pulseDot,
          {
            backgroundColor: dotColor,
            transform: [{ scale: scaleAnim }],
            opacity: 0.5,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.pulseDot,
          {
            backgroundColor: dotColor,
            transform: [{ scale: scaleAnim }],
            opacity: 0.2,
          },
        ]}
      />
    </View>
  );
};

export const WaveTypingIndicator = ({ dotColor = colors.primarySaffron, style }) => {
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getWaveStyle = (index) => ({
    transform: [
      {
        translateY: waveAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -10 * (index + 1), 0],
        }),
      },
    ],
  });

  return (
    <View style={[styles.waveContainer, style]}>
      {[1, 2, 3].map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.waveDot,
            {
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: dotColor,
              marginHorizontal: 3,
            },
            getWaveStyle(index),
          ]}
        />
      ))}
    </View>
  );
};

export const BouncingTypingIndicator = ({ dotColor = colors.primarySaffron, style }) => {
  const bounceAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    const createBounceAnimation = (index, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.sequence([
            Animated.timing(bounceAnims[index], {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnims[index], {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    Animated.parallel([
      createBounceAnimation(0, 0),
      createBounceAnimation(1, 200),
      createBounceAnimation(2, 400),
    ]).start();
  }, []);

  const getBounceStyle = (index) => ({
    transform: [
      {
        translateY: bounceAnims[index].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -10, 0],
        }),
      },
    ],
  });

  return (
    <View style={[styles.bounceContainer, style]}>
      {bounceAnims.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bounceDot,
            {
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: dotColor,
              marginHorizontal: 3,
            },
            getBounceStyle(index),
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  bubble: {
    borderRadius: 20,
    overflow: 'hidden',
    maxWidth: 100,
  },
  gradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    marginHorizontal: 2,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    marginLeft: 8,
  },
  simpleContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  simpleText: {
    fontFamily: 'Inter-Italic',
    fontSize: 13,
  },
  pulseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    position: 'absolute',
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  waveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  bounceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  bounceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});

export default TypingIndicator;