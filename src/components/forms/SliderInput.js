import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const SliderInput = ({
  value = 0,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  label,
  unit,
  showValue = true,
  valuePrefix = '',
  valueSuffix = '',
  minimumTrackTintColor = colors.primarySaffron,
  maximumTrackTintColor = 'rgba(0,0,0,0.1)',
  thumbTintColor = colors.primarySaffron,
  thumbImage,
  disabled = false,
  animateTransitions = true,
  animationType = 'timing', // 'timing', 'spring'
  animationDuration = 300,
  showButtons = false,
  buttonStep = step,
  showInput = false,
  inputType = 'numeric', // 'numeric', 'decimal'
  formatValue,
  validateValue,
  onSlidingStart,
  onSlidingComplete,
  trackHeight = 4,
  thumbSize = 20,
  style,
  labelStyle,
  valueStyle,
  sliderStyle,
  ...props
}) => {
  
  const [inputValue, setInputValue] = useState(value.toString());
  const [isEditing, setIsEditing] = useState(false);
  const animatedValue = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value]);

  useEffect(() => {
    if (animateTransitions) {
      if (animationType === 'spring') {
        Animated.spring(animatedValue, {
          toValue: value,
          friction: 7,
          tension: 40,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(animatedValue, {
          toValue: value,
          duration: animationDuration,
          useNativeDriver: false,
        }).start();
      }
    } else {
      animatedValue.setValue(value);
    }
  }, [value]);

  const handleIncrement = () => {
    const newValue = Math.min(value + buttonStep, maximumValue);
    onValueChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - buttonStep, minimumValue);
    onValueChange(newValue);
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleInputSubmit = () => {
    let newValue = parseFloat(inputValue);
    
    if (isNaN(newValue)) {
      setInputValue(value.toString());
    } else {
      if (validateValue) {
        newValue = validateValue(newValue);
      }
      newValue = Math.min(Math.max(newValue, minimumValue), maximumValue);
      onValueChange(newValue);
    }
    setIsEditing(false);
  };

  const handleInputBlur = () => {
    handleInputSubmit();
  };

  const getFormattedValue = () => {
    if (formatValue) {
      return formatValue(value);
    }
    return `${valuePrefix}${value}${valueSuffix}`;
  };

  const interpolatedTrackWidth = animatedValue.interpolate({
    inputRange: [minimumValue, maximumValue],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Label and Value Row */}
      {(label || showValue) && (
        <View style={styles.header}>
          {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
          {showValue && !showInput && (
            <Text style={[styles.value, valueStyle]}>
              {getFormattedValue()} {unit}
            </Text>
          )}
          {showInput && (
            <View style={styles.inputContainer}>
              {isEditing ? (
                <TextInput
                  style={[styles.input, valueStyle]}
                  value={inputValue}
                  onChangeText={handleInputChange}
                  onSubmitEditing={handleInputSubmit}
                  onBlur={handleInputBlur}
                  keyboardType={inputType === 'decimal' ? 'decimal-pad' : 'numeric'}
                  autoFocus
                />
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={[styles.value, valueStyle]}>
                    {getFormattedValue()} {unit}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}

      <View style={styles.sliderRow}>
        {/* Decrement Button */}
        {showButtons && (
          <TouchableOpacity
            style={[
              styles.button,
              disabled && styles.buttonDisabled,
            ]}
            onPress={handleDecrement}
            disabled={disabled || value <= minimumValue}
          >
            <Ionicons name="remove" size={20} color={value <= minimumValue ? colors.textTertiary : colors.primarySaffron} />
          </TouchableOpacity>
        )}

        {/* Slider */}
        <View style={[styles.sliderContainer, showButtons && styles.sliderWithButtons]}>
          <Slider
            value={value}
            onValueChange={onValueChange}
            onSlidingStart={onSlidingStart}
            onSlidingComplete={onSlidingComplete}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            step={step}
            minimumTrackTintColor={minimumTrackTintColor}
            maximumTrackTintColor={maximumTrackTintColor}
            thumbTintColor={thumbTintColor}
            thumbImage={thumbImage}
            disabled={disabled}
            style={[styles.slider, sliderStyle]}
            {...props}
          />
        </View>

        {/* Increment Button */}
        {showButtons && (
          <TouchableOpacity
            style={[
              styles.button,
              disabled && styles.buttonDisabled,
            ]}
            onPress={handleIncrement}
            disabled={disabled || value >= maximumValue}
          >
            <Ionicons name="add" size={20} color={value >= maximumValue ? colors.textTertiary : colors.primarySaffron} />
          </TouchableOpacity>
        )}
      </View>

      {/* Min/Max Labels */}
      <View style={styles.footer}>
        <Text style={styles.minMaxLabel}>{valuePrefix}{minimumValue}{valueSuffix}</Text>
        <Text style={styles.minMaxLabel}>{valuePrefix}{maximumValue}{valueSuffix}</Text>
      </View>
    </View>
  );
};

export const RangeSlider = ({
  minValue = 0,
  maxValue = 100,
  onMinChange,
  onMaxChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  label,
  unit,
  ...props
}) => {
  const [min, setMin] = useState(minValue);
  const [max, setMax] = useState(maxValue);

  useEffect(() => {
    setMin(minValue);
    setMax(maxValue);
  }, [minValue, maxValue]);

  const handleMinChange = (value) => {
    if (value <= max - step) {
      setMin(value);
      onMinChange?.(value);
    }
  };

  const handleMaxChange = (value) => {
    if (value >= min + step) {
      setMax(value);
      onMaxChange?.(value);
    }
  };

  return (
    <View style={styles.rangeContainer}>
      <View style={styles.rangeHeader}>
        <Text style={styles.rangeLabel}>{label}</Text>
        <Text style={styles.rangeValue}>
          {min} - {max} {unit}
        </Text>
      </View>

      <View style={styles.rangeSliders}>
        <Slider
          value={min}
          onValueChange={handleMinChange}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          {...props}
        />
        <Slider
          value={max}
          onValueChange={handleMaxChange}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          {...props}
        />
      </View>

      <View style={styles.rangeFooter}>
        <Text>{minimumValue}</Text>
        <Text>{maximumValue}</Text>
      </View>
    </View>
  );
};

export const GradientSlider = ({ value, onValueChange, gradientColors = [colors.primarySaffron, colors.primaryGreen], ...props }) => {
  return (
    <View>
      <Slider
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="transparent"
        {...props}
      />
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradientTrack, { height: 4 }]}
      />
    </View>
  );
};

export const StepSlider = ({ value, onValueChange, steps = [], ...props }) => {
  const stepValues = steps.map(step => step.value);
  const stepLabels = steps.map(step => step.label);

  const handleValueChange = (val) => {
    const closest = stepValues.reduce((prev, curr) => 
      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
    );
    onValueChange(closest);
  };

  return (
    <View style={styles.stepContainer}>
      <Slider
        value={value}
        onValueChange={handleValueChange}
        minimumValue={Math.min(...stepValues)}
        maximumValue={Math.max(...stepValues)}
        step={1}
        {...props}
      />
      <View style={styles.stepLabels}>
        {stepLabels.map((label, index) => (
          <Text key={index} style={styles.stepLabel}>{label}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderContainer: {
    flex: 1,
  },
  sliderWithButtons: {
    marginHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  minMaxLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  inputContainer: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  input: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.primarySaffron,
    paddingVertical: 2,
    textAlign: 'right',
  },
  rangeContainer: {
    width: '100%',
  },
  rangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  rangeValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  rangeSliders: {
    marginVertical: 8,
  },
  rangeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  gradientTrack: {
    position: 'absolute',
    bottom: 18,
    left: 0,
    right: 0,
    borderRadius: 2,
  },
  stepContainer: {
    width: '100%',
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  stepLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
});

export default SliderInput;