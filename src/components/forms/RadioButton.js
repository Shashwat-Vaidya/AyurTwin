import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const RadioButton = ({
  selected = false,
  onPress,
  label,
  value,
  size = 'medium', // 'small', 'medium', 'large'
  color = colors.primarySaffron,
  disabled = false,
  labelPosition = 'right', // 'left', 'right', 'top', 'bottom'
  labelStyle,
  style,
  icon,
  iconPosition = 'left',
  description,
}) => {
  
  const getSizeValue = () => {
    switch(size) {
      case 'small':
        return {
          radioSize: 16,
          innerSize: 8,
          iconSize: 12,
          fontSize: 12,
          spacing: 6,
        };
      case 'large':
        return {
          radioSize: 24,
          innerSize: 12,
          iconSize: 16,
          fontSize: 16,
          spacing: 12,
        };
      default:
        return {
          radioSize: 20,
          innerSize: 10,
          iconSize: 14,
          fontSize: 14,
          spacing: 8,
        };
    }
  };

  const sizeStyles = getSizeValue();

  const renderRadio = () => {
    if (selected) {
      return (
        <View style={[styles.radio, {
          width: sizeStyles.radioSize,
          height: sizeStyles.radioSize,
          borderRadius: sizeStyles.radioSize / 2,
          borderColor: color,
          borderWidth: 2,
        }]}>
          <View style={[styles.radioInner, {
            width: sizeStyles.innerSize,
            height: sizeStyles.innerSize,
            borderRadius: sizeStyles.innerSize / 2,
            backgroundColor: color,
          }]} />
        </View>
      );
    }

    return (
      <View style={[styles.radio, {
        width: sizeStyles.radioSize,
        height: sizeStyles.radioSize,
        borderRadius: sizeStyles.radioSize / 2,
        borderColor: colors.textTertiary,
        borderWidth: 2,
        backgroundColor: 'transparent',
      }]} />
    );
  };

  const renderContent = () => {
    const elements = [];

    if (icon && iconPosition === 'left') {
      elements.push(
        <Ionicons
          key="icon-left"
          name={icon}
          size={sizeStyles.iconSize}
          color={selected ? color : colors.textSecondary}
          style={[styles.icon, styles.iconLeft, { marginRight: sizeStyles.spacing }]}
        />
      );
    }

    elements.push(
      <View key="radio" style={styles.radioContainer}>
        {renderRadio()}
      </View>
    );

    if (icon && iconPosition === 'right') {
      elements.push(
        <Ionicons
          key="icon-right"
          name={icon}
          size={sizeStyles.iconSize}
          color={selected ? color : colors.textSecondary}
          style={[styles.icon, styles.iconRight, { marginLeft: sizeStyles.spacing }]}
        />
      );
    }

    return elements;
  };

  const renderLabel = () => {
    if (!label) return null;

    return (
      <View style={styles.labelContainer}>
        <Text style={[
          styles.label,
          {
            fontSize: sizeStyles.fontSize,
            color: selected ? color : colors.textPrimary,
          },
          labelStyle,
        ]}>
          {label}
        </Text>
        {description && (
          <Text style={[
            styles.description,
            { fontSize: sizeStyles.fontSize - 2 }
          ]}>
            {description}
          </Text>
        )}
      </View>
    );
  };

  const getContainerStyle = () => {
    switch(labelPosition) {
      case 'left':
        return styles.containerLeft;
      case 'right':
        return styles.containerRight;
      case 'top':
        return styles.containerTop;
      case 'bottom':
        return styles.containerBottom;
      default:
        return styles.containerRight;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getContainerStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {labelPosition === 'left' && renderLabel()}
      {labelPosition === 'top' && renderLabel()}
      
      <View style={[
        styles.content,
        iconPosition === 'left' && styles.contentLeft,
        iconPosition === 'right' && styles.contentRight,
      ]}>
        {renderContent()}
      </View>

      {labelPosition === 'right' && renderLabel()}
      {labelPosition === 'bottom' && renderLabel()}
    </TouchableOpacity>
  );
};

export const RadioGroup = ({
  options = [],
  value,
  onSelect,
  layout = 'column', // 'column', 'row', 'grid'
  columns = 2,
  radioProps = {},
  style,
}) => {
  const handleSelect = (optionValue) => {
    onSelect(optionValue);
  };

  const getLayoutStyle = () => {
    switch(layout) {
      case 'row':
        return styles.groupRow;
      case 'column':
        return styles.groupColumn;
      case 'grid':
        return [styles.groupGrid, { flexDirection: 'row', flexWrap: 'wrap' }];
      default:
        return styles.groupColumn;
    }
  };

  return (
    <View style={[styles.groupContainer, getLayoutStyle(), style]}>
      {options.map((option, index) => (
        <View
          key={index}
          style={[
            layout === 'grid' && { width: `${100 / columns}%`, padding: 4 },
          ]}
        >
          <RadioButton
            selected={value === option.value}
            onPress={() => handleSelect(option.value)}
            label={option.label}
            value={option.value}
            description={option.description}
            icon={option.icon}
            {...radioProps}
          />
        </View>
      ))}
    </View>
  );
};

export const GenderRadioGroup = ({ value, onSelect, ...props }) => {
  const genderOptions = [
    { value: 'male', label: 'Male', icon: 'male' },
    { value: 'female', label: 'Female', icon: 'female' },
    { value: 'other', label: 'Other', icon: 'people' },
  ];

  return (
    <RadioGroup
      options={genderOptions}
      value={value}
      onSelect={onSelect}
      layout="row"
      {...props}
    />
  );
};

export const YesNoRadioGroup = ({ value, onSelect, ...props }) => {
  const options = [
    { value: true, label: 'Yes', icon: 'checkmark-circle' },
    { value: false, label: 'No', icon: 'close-circle' },
  ];

  return (
    <RadioGroup
      options={options}
      value={value}
      onSelect={onSelect}
      layout="row"
      {...props}
    />
  );
};

export const DoshaRadioGroup = ({ value, onSelect, ...props }) => {
  const doshaOptions = [
    { value: 'vata', label: 'Vata', description: 'Air & Space', icon: 'leaf' },
    { value: 'pitta', label: 'Pitta', description: 'Fire & Water', icon: 'flame' },
    { value: 'kapha', label: 'Kapha', description: 'Water & Earth', icon: 'water' },
  ];

  return (
    <RadioGroup
      options={doshaOptions}
      value={value}
      onSelect={onSelect}
      layout="row"
      {...props}
    />
  );
};

export const ActivityLevelRadioGroup = ({ value, onSelect, ...props }) => {
  const options = [
    { value: 'low', label: 'Low', description: 'Little or no exercise' },
    { value: 'moderate', label: 'Moderate', description: 'Exercise 3-5 days/week' },
    { value: 'high', label: 'High', description: 'Intense exercise 6-7 days/week' },
  ];

  return (
    <RadioGroup
      options={options}
      value={value}
      onSelect={onSelect}
      layout="column"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  containerLeft: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
  },
  containerRight: {
    flexDirection: 'row',
  },
  containerTop: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  containerBottom: {
    flexDirection: 'column-reverse',
    alignItems: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentLeft: {
    justifyContent: 'flex-start',
  },
  contentRight: {
    justifyContent: 'flex-end',
  },
  radioContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    position: 'absolute',
  },
  icon: {
    marginHorizontal: 4,
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },
  labelContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
  },
  description: {
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
    marginTop: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  groupContainer: {
    width: '100%',
  },
  groupRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  groupColumn: {
    flexDirection: 'column',
  },
  groupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
});

export default RadioButton;