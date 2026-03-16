import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Circle, G, LinearGradient as SvgGradient, Defs, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../utils/constants/colors';

const ProgressCircle = ({
  progress = 0,
  size = 120,
  strokeWidth = 10,
  color = colors.primarySaffron,
  gradientColors,
  backgroundColor = 'rgba(0,0,0,0.05)',
  showPercentage = true,
  showLabel = false,
  label,
  formatValue = (value) => `${Math.round(value)}%`,
  animated = true,
  animationDuration = 1000,
  fill = 'solid', // 'solid', 'gradient'
  direction = 'clockwise', // 'clockwise', 'counter-clockwise'
  startAngle = 0, // 0 = top, 90 = right, 180 = bottom, 270 = left
  rounded = true,
  children,
  style,
}) => {
  
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: progress / 100,
        duration: animationDuration,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    } else {
        animatedValue.setValue(progress / 100);
      }
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const rotation = startAngle;
  const directionMultiplier = direction === 'clockwise' ? -1 : 1;

  const getGradientId = () => `grad-${Math.random().toString(36).substr(2, 9)}`;

  const renderGradient = () => {
    if (!gradientColors) return null;
    const gradientId = getGradientId();
    return (
      <Defs>
        <SvgGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {gradientColors.map((color, index) => (
            <Stop
              key={index}
              offset={`${(index / (gradientColors.length - 1)) * 100}%`}
              stopColor={color}
              stopOpacity="1"
            />
          ))}
        </SvgGradient>
      </Defs>
    );
  };

  const strokeColor = gradientColors ? `url(#${getGradientId()})` : color;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.circleContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {gradientColors && renderGradient()}
          
          <G rotation={rotation} origin={`${size / 2}, ${size / 2}`}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={backgroundColor}
              strokeWidth={strokeWidth}
              fill="none"
            />
            
            {/* Progress Circle */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap={rounded ? 'round' : 'butt'}
              fill="none"
              transform={`rotate(${directionMultiplier * 90}, ${size / 2}, ${size / 2})`}
            />
          </G>
        </Svg>

        {/* Center Content */}
        <View style={styles.centerContent}>
          {children || (
            <>
              {showPercentage && (
                <Text style={[styles.percentage, { fontSize: size * 0.2 }]}>
                  {formatValue(progress)}
                </Text>
              )}
              {showLabel && (
                <Text style={[styles.label, { fontSize: size * 0.12 }]}>
                  {label || 'Progress'}
                </Text>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export const ActivityProgressCircle = ({ value, goal, unit, ...props }) => {
  const progress = (value / goal) * 100;

  return (
    <ProgressCircle
      progress={progress}
      color={colors.primaryGreen}
      {...props}
    >
      <View style={styles.activityContent}>
        <Text style={styles.activityValue}>{value}</Text>
        <Text style={styles.activityUnit}>{unit}</Text>
        <Text style={styles.activityGoal}>of {goal}</Text>
      </View>
    </ProgressCircle>
  );
};

export const SleepProgressCircle = ({ hours, goal = 8, ...props }) => {
  const progress = (hours / goal) * 100;

  return (
    <ProgressCircle
      progress={progress}
      color={colors.sleepIndigo}
      gradientColors={[colors.sleepIndigo, colors.stressPurple]}
      {...props}
    >
      <View style={styles.sleepContent}>
        <Text style={styles.sleepHours}>{hours}</Text>
        <Text style={styles.sleepUnit}>h</Text>
        <Text style={styles.sleepGoal}>of {goal}h</Text>
      </View>
    </ProgressCircle>
  );
};

export const WaterProgressCircle = ({ consumed, goal = 8, ...props }) => {
  const progress = (consumed / goal) * 100;

  return (
    <ProgressCircle
      progress={progress}
      color={colors.spO2Blue}
      gradientColors={[colors.spO2Blue, colors.primaryGreen]}
      {...props}
    >
      <View style={styles.waterContent}>
        <Ionicons name="water" size={24} color={colors.spO2Blue} />
        <Text style={styles.waterValue}>{consumed}L</Text>
        <Text style={styles.waterGoal}>of {goal}L</Text>
      </View>
    </ProgressCircle>
  );
};

export const CalorieProgressCircle = ({ consumed, goal, ...props }) => {
  const progress = (consumed / goal) * 100;
  const remaining = goal - consumed;

  return (
    <ProgressCircle
      progress={progress}
      color={progress > 100 ? colors.alertRed : colors.tempOrange}
      {...props}
    >
      <View style={styles.calorieContent}>
        <Text style={styles.calorieValue}>{consumed}</Text>
        <Text style={styles.calorieUnit}>kcal</Text>
        <Text style={styles.calorieRemaining}>{remaining} remaining</Text>
      </View>
    </ProgressCircle>
  );
};

export const DoshaProgressCircle = ({ vata, pitta, kapha, ...props }) => {
  const total = vata + pitta + kapha;

  return (
    <View style={styles.doshaContainer}>
      <ProgressCircle
        progress={vata}
        size={80}
        strokeWidth={8}
        color={colors.vata}
        showPercentage={false}
        {...props}
      >
        <Text style={styles.doshaValue}>{Math.round(vata)}%</Text>
      </ProgressCircle>
      <ProgressCircle
        progress={pitta}
        size={80}
        strokeWidth={8}
        color={colors.pitta}
        showPercentage={false}
        {...props}
      >
        <Text style={styles.doshaValue}>{Math.round(pitta)}%</Text>
      </ProgressCircle>
      <ProgressCircle
        progress={kapha}
        size={80}
        strokeWidth={8}
        color={colors.kapha}
        showPercentage={false}
        {...props}
      >
        <Text style={styles.doshaValue}>{Math.round(kapha)}%</Text>
      </ProgressCircle>
    </View>
  );
};

export const MultipleProgressCircles = ({ items, ...props }) => {
  return (
    <View style={styles.multipleContainer}>
      {items.map((item, index) => (
        <View key={index} style={styles.multipleItem}>
          <ProgressCircle
            progress={item.progress}
            size={60}
            strokeWidth={6}
            color={item.color}
            showPercentage={false}
            {...props}
          >
            <Text style={styles.multipleValue}>{Math.round(item.progress)}%</Text>
          </ProgressCircle>
          <Text style={styles.multipleLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
  },
  label: {
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    marginTop: 2,
  },
  activityContent: {
    alignItems: 'center',
  },
  activityValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  activityUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  activityGoal: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 2,
  },
  sleepContent: {
    alignItems: 'center',
  },
  sleepHours: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.sleepIndigo,
  },
  sleepUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  sleepGoal: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  waterContent: {
    alignItems: 'center',
  },
  waterValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 4,
  },
  waterGoal: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  calorieContent: {
    alignItems: 'center',
  },
  calorieValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  calorieUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  calorieRemaining: {
    fontFamily: 'Inter-Regular',
    fontSize: 9,
    color: colors.textTertiary,
  },
  doshaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  doshaValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  multipleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  multipleItem: {
    alignItems: 'center',
    margin: 8,
  },
  multipleValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: colors.textPrimary,
  },
  multipleLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 4,
  },
});

export default ProgressCircle;