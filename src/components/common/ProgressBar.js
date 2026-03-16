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

const ProgressBar = ({
  progress = 0,
  height = 8,
  width = '100%',
  color = colors.primarySaffron,
  gradient = false,
  gradientColors = [colors.primarySaffron, colors.primaryGreen],
  showPercentage = false,
  showLabel = false,
  label,
  labelPosition = 'top',
  animated = true,
  duration = 500,
  borderRadius = 4,
  style,
  backgroundColor = 'rgba(0,0,0,0.05)',
}) => {
  
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedProgress, {
        toValue: progress / 100,
        duration,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    } else {
      animatedProgress.setValue(progress / 100);
    }
  }, [progress]);

  const widthInterpolated = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderBar = () => {
    if (gradient) {
      return (
        <Animated.View style={[styles.fillContainer, { width: widthInterpolated }]}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradientFill, { borderRadius }]}
          />
        </Animated.View>
      );
    }

    return (
      <Animated.View 
        style={[
          styles.fill,
          { 
            width: widthInterpolated,
            backgroundColor: color,
            borderRadius,
          }
        ]} 
      />
    );
  };

  const renderLabel = () => {
    if (!showLabel && !label) return null;

    const labelContent = label || `Progress ${progress}%`;
    
    if (labelPosition === 'top') {
      return (
        <View style={styles.labelTop}>
          <Text style={styles.labelText}>{labelContent}</Text>
          {showPercentage && <Text style={styles.percentageText}>{progress}%</Text>}
        </View>
      );
    }

    return (
      <View style={styles.labelBottom}>
        <Text style={styles.labelText}>{labelContent}</Text>
        {showPercentage && <Text style={styles.percentageText}>{progress}%</Text>}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {labelPosition === 'top' && renderLabel()}
      
      <View style={[styles.barContainer, { height, width, backgroundColor, borderRadius }]}>
        {renderBar()}
      </View>
      
      {labelPosition === 'bottom' && renderLabel()}
    </View>
  );
};

export const StepProgressBar = ({
  currentStep,
  totalSteps,
  height = 4,
  color = colors.primarySaffron,
  showStepNumbers = false,
  style,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={[styles.stepContainer, style]}>
      <ProgressBar
        progress={progress}
        height={height}
        color={color}
        backgroundColor="rgba(0,0,0,0.05)"
      />
      {showStepNumbers && (
        <View style={styles.stepNumbers}>
          <Text style={styles.stepText}>Step {currentStep} of {totalSteps}</Text>
        </View>
      )}
    </View>
  );
};

export const CircularProgress = ({
  size = 100,
  progress = 0,
  strokeWidth = 8,
  color = colors.primarySaffron,
  backgroundColor = 'rgba(0,0,0,0.05)',
  showPercentage = true,
  children,
  style,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const circumference = 2 * Math.PI * (size / 2 - strokeWidth / 2);

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress / 100,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const rotation = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.circularContainer, { width: size, height: size }, style]}>
      <View style={styles.circularBackground}>
        <View style={[styles.circularSVG, { width: size, height: size }]}>
          <View
            style={[
              styles.circleBackground,
              {
                width: size - strokeWidth,
                height: size - strokeWidth,
                borderRadius: (size - strokeWidth) / 2,
                borderWidth: strokeWidth,
                borderColor: backgroundColor,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.circleProgress,
              {
                width: size - strokeWidth,
                height: size - strokeWidth,
                borderRadius: (size - strokeWidth) / 2,
                borderWidth: strokeWidth,
                borderColor: color,
                borderLeftColor: 'transparent',
                borderBottomColor: 'transparent',
                transform: [{ rotate: rotation }],
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.circularContent}>
        {children || (
          showPercentage && (
            <Text style={styles.circularPercentage}>{progress}%</Text>
          )
        )}
      </View>
    </View>
  );
};

export const MultiStepProgress = ({
  steps,
  currentStep,
  height = 4,
  activeColor = colors.primarySaffron,
  completedColor = colors.successGreen,
  inactiveColor = 'rgba(0,0,0,0.05)',
  showLabels = true,
  style,
}) => {
  return (
    <View style={[styles.multiStepContainer, style]}>
      <View style={styles.stepsRow}>
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isActive = index + 1 === currentStep;
          
          return (
            <View key={index} style={styles.stepWrapper}>
              <View style={styles.stepIndicator}>
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor: isCompleted 
                        ? completedColor 
                        : isActive 
                          ? activeColor 
                          : inactiveColor,
                    },
                  ]}
                />
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      {
                        height,
                        backgroundColor: isCompleted 
                          ? completedColor 
                          : inactiveColor,
                      },
                    ]}
                  />
                )}
              </View>
              {showLabels && (
                <Text style={styles.stepLabel}>{step}</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
  fillContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
  },
  gradientFill: {
    flex: 1,
  },
  labelTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  labelText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  percentageText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  stepContainer: {
    width: '100%',
  },
  stepNumbers: {
    marginTop: 8,
    alignItems: 'center',
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
  },
  circularContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularSVG: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBackground: {
    borderWidth: 8,
    position: 'absolute',
  },
  circleProgress: {
    position: 'absolute',
    borderWidth: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  circularContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularPercentage: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  multiStepContainer: {
    width: '100%',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepLine: {
    flex: 1,
    marginHorizontal: 4,
  },
  stepLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 8,
  },
});

export default ProgressBar;