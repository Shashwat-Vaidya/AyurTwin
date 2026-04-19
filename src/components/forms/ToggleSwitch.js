import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const ToggleSwitch = ({
  value = false,
  onValueChange,
  disabled = false,
  size = 'medium', // 'small', 'medium', 'large'
  activeColor = colors.primarySaffron,
  inactiveColor = '#E0E0E0',
  activeIcon,
  inactiveIcon,
  label,
  labelPosition = 'left', // 'left', 'right', 'top', 'bottom'
  showLabel = true,
  style,
  thumbStyle,
  trackStyle,
  labelStyle,
  onColor,
  offColor,
  ...props
}) => {
  
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();

    Animated.timing(widthAnim, {
      toValue: value ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const getSizeStyles = () => {
    switch(size) {
      case 'small':
        return {
          width: 40,
          height: 20,
          thumbSize: 16,
          thumbOffset: 2,
          iconSize: 10,
          fontSize: 12,
        };
      case 'large':
        return {
          width: 60,
          height: 30,
          thumbSize: 26,
          thumbOffset: 2,
          iconSize: 16,
          fontSize: 16,
        };
      default:
        return {
          width: 50,
          height: 24,
          thumbSize: 20,
          thumbOffset: 2,
          iconSize: 12,
          fontSize: 14,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [sizeStyles.thumbOffset, sizeStyles.width - sizeStyles.thumbSize - sizeStyles.thumbOffset],
  });

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  const handlePress = () => {
    if (!disabled && onValueChange) {
      onValueChange(!value);
    }
  };

  const renderLabel = () => {
    if (!showLabel || !label) return null;

    const labelElement = (
      <Text style={[
        styles.label,
        { fontSize: sizeStyles.fontSize, color: colors.textPrimary },
        labelStyle,
      ]}>
        {label}
      </Text>
    );

    switch(labelPosition) {
      case 'left':
        return (
          <View style={styles.labelLeft}>
            {labelElement}
          </View>
        );
      case 'right':
        return (
          <View style={styles.labelRight}>
            {labelElement}
          </View>
        );
      case 'top':
        return (
          <View style={styles.labelTop}>
            {labelElement}
          </View>
        );
      case 'bottom':
        return (
          <View style={styles.labelBottom}>
            {labelElement}
          </View>
        );
      default:
        return null;
    }
  };

  const renderIcon = () => {
    if (value && activeIcon) {
      return (
        <Ionicons
          name={activeIcon}
          size={sizeStyles.iconSize}
          color="white"
        />
      );
    }
    if (!value && inactiveIcon) {
      return (
        <Ionicons
          name={inactiveIcon}
          size={sizeStyles.iconSize}
          color={colors.textSecondary}
        />
      );
    }
    return null;
  };

  return (
    <View style={[
      styles.container,
      labelPosition === 'left' && styles.containerRow,
      labelPosition === 'right' && styles.containerRow,
      labelPosition === 'top' && styles.containerColumn,
      labelPosition === 'bottom' && styles.containerColumnReverse,
      style,
    ]}>
      {renderLabel()}
      
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
        style={[
          styles.touchable,
          disabled && styles.disabled,
        ]}
      >
        <Animated.View
          style={[
            styles.track,
            {
              width: sizeStyles.width,
              height: sizeStyles.height,
              borderRadius: sizeStyles.height / 2,
              backgroundColor: trackColor,
            },
            trackStyle,
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                width: sizeStyles.thumbSize,
                height: sizeStyles.thumbSize,
                borderRadius: sizeStyles.thumbSize / 2,
                left: thumbPosition,
                backgroundColor: 'white',
              },
              thumbStyle,
            ]}
          >
            {renderIcon()}
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export const SwitchGroup = ({
  options = [],
  value,
  onValueChange,
  multiple = false,
  ...props
}) => {
  const handleChange = (optionValue) => {
    if (multiple) {
      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue];
      onValueChange(newValue);
    } else {
      onValueChange(optionValue);
    }
  };

  return (
    <View style={styles.groupContainer}>
      {options.map((option, index) => (
        <View key={index} style={styles.groupItem}>
          <ToggleSwitch
            value={multiple ? value.includes(option.value) : value === option.value}
            onValueChange={() => handleChange(option.value)}
            label={option.label}
            labelPosition="right"
            {...props}
          />
        </View>
      ))}
    </View>
  );
};

export const YesNoSwitch = ({ value, onValueChange, ...props }) => (
  <ToggleSwitch
    value={value}
    onValueChange={onValueChange}
    activeIcon="checkmark"
    inactiveIcon="close"
    activeColor={colors.successGreen}
    inactiveColor={colors.alertRed}
    {...props}
  />
);

export const OnOffSwitch = ({ value, onValueChange, ...props }) => (
  <ToggleSwitch
    value={value}
    onValueChange={onValueChange}
    activeIcon="power"
    inactiveIcon="power"
    activeColor={colors.successGreen}
    inactiveColor={colors.alertRed}
    {...props}
  />
);

export const LabelledSwitch = ({ label, description, ...props }) => (
  <View style={styles.labelledContainer}>
    <View style={styles.labelledTextContainer}>
      <Text style={styles.labelledLabel}>{label}</Text>
      {description && <Text style={styles.labelledDescription}>{description}</Text>}
    </View>
    <ToggleSwitch {...props} />
  </View>
);

export const GradientSwitch = ({ value, onValueChange, ...props }) => {
  const gradientColors = value 
    ? [colors.primarySaffron, colors.primaryGreen]
    : ['#E0E0E0', '#E0E0E0'];

  return (
    <ToggleSwitch
      value={value}
      onValueChange={onValueChange}
      activeColor="transparent"
      inactiveColor="transparent"
      trackStyle={{ overflow: 'hidden' }}
      {...props}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </ToggleSwitch>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  containerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  containerColumnReverse: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
  },
  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  track: {
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  thumb: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontFamily: 'Inter-Medium',
  },
  labelLeft: {
    marginRight: 8,
  },
  labelRight: {
    marginLeft: 8,
  },
  labelTop: {
    marginBottom: 4,
  },
  labelBottom: {
    marginTop: 4,
  },
  groupContainer: {
    width: '100%',
  },
  groupItem: {
    marginBottom: 12,
  },
  labelledContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  labelledTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  labelledLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  labelledDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
});

export default ToggleSwitch;