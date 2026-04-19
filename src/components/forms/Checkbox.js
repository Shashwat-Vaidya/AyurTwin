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

const Checkbox = ({
  checked = false,
  onPress,
  label,
  value,
  size = 'medium', // 'small', 'medium', 'large'
  color = colors.primarySaffron,
  disabled = false,
  labelPosition = 'right', // 'left', 'right', 'top', 'bottom'
  shape = 'square', // 'square', 'circle', 'rounded'
  icon = 'checkmark',
  labelStyle,
  style,
  description,
  indeterminate = false,
  error = false,
}) => {
  
  const getSizeValue = () => {
    switch(size) {
      case 'small':
        return {
          boxSize: 18,
          iconSize: 12,
          fontSize: 12,
          spacing: 6,
        };
      case 'large':
        return {
          boxSize: 26,
          iconSize: 18,
          fontSize: 16,
          spacing: 12,
        };
      default:
        return {
          boxSize: 22,
          iconSize: 16,
          fontSize: 14,
          spacing: 8,
        };
    }
  };

  const sizeStyles = getSizeValue();

  const getShapeStyle = () => {
    switch(shape) {
      case 'circle':
        return { borderRadius: sizeStyles.boxSize / 2 };
      case 'rounded':
        return { borderRadius: 4 };
      case 'square':
        return { borderRadius: 2 };
      default:
        return { borderRadius: 2 };
    }
  };

  const renderCheckbox = () => {
    const shapeStyle = getShapeStyle();

    if (indeterminate) {
      return (
        <View style={[
          styles.checkbox,
          shapeStyle,
          {
            width: sizeStyles.boxSize,
            height: sizeStyles.boxSize,
            backgroundColor: color,
          },
        ]}>
          <View style={[
            styles.indeterminate,
            {
              width: sizeStyles.boxSize * 0.6,
              height: 2,
              backgroundColor: 'white',
            },
          ]} />
        </View>
      );
    }

    if (checked) {
      return (
        <View style={[
          styles.checkbox,
          shapeStyle,
          {
            width: sizeStyles.boxSize,
            height: sizeStyles.boxSize,
            backgroundColor: color,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
          <Ionicons
            name={icon}
            size={sizeStyles.iconSize}
            color="white"
          />
        </View>
      );
    }

    return (
      <View style={[
        styles.checkbox,
        shapeStyle,
        {
          width: sizeStyles.boxSize,
          height: sizeStyles.boxSize,
          borderWidth: 2,
          borderColor: error ? colors.alertRed : colors.textTertiary,
          backgroundColor: 'transparent',
        },
      ]} />
    );
  };

  const renderLabel = () => {
    if (!label) return null;

    return (
      <View style={styles.labelContainer}>
        <Text style={[
          styles.label,
          {
            fontSize: sizeStyles.fontSize,
            color: error ? colors.alertRed : colors.textPrimary,
          },
          labelStyle,
          disabled && styles.labelDisabled,
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
      
      <View style={styles.checkboxContainer}>
        {renderCheckbox()}
      </View>

      {labelPosition === 'right' && renderLabel()}
      {labelPosition === 'bottom' && renderLabel()}
    </TouchableOpacity>
  );
};

export const CheckboxGroup = ({
  options = [],
  value = [],
  onSelect,
  layout = 'column', // 'column', 'row', 'grid'
  columns = 2,
  checkboxProps = {},
  style,
}) => {
  const handleSelect = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onSelect(newValue);
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
          <Checkbox
            checked={value.includes(option.value)}
            onPress={() => handleSelect(option.value)}
            label={option.label}
            value={option.value}
            description={option.description}
            {...checkboxProps}
          />
        </View>
      ))}
    </View>
  );
};

export const TermsCheckbox = ({ checked, onPress, error, ...props }) => (
  <Checkbox
    checked={checked}
    onPress={onPress}
    label="I agree to the Terms and Conditions"
    size="small"
    error={error}
    {...props}
  />
);

export const RememberMeCheckbox = ({ checked, onPress, ...props }) => (
  <Checkbox
    checked={checked}
    onPress={onPress}
    label="Remember me"
    size="small"
    {...props}
  />
);

export const NotificationCheckbox = ({ checked, onPress, label, ...props }) => (
  <Checkbox
    checked={checked}
    onPress={onPress}
    label={label}
    size="small"
    description="Receive notifications about your health"
    {...props}
  />
);

export const DietPreferenceCheckbox = ({ checked, onPress, label, ...props }) => (
  <Checkbox
    checked={checked}
    onPress={onPress}
    label={label}
    size="medium"
    {...props}
  />
);

export const SymptomCheckbox = ({ checked, onPress, label, severity, ...props }) => (
  <View style={styles.symptomContainer}>
    <Checkbox
      checked={checked}
      onPress={onPress}
      label={label}
      size="medium"
      {...props}
    />
    {severity && (
      <View style={[styles.severityBadge, { backgroundColor: severity.color + '20' }]}>
        <Text style={[styles.severityText, { color: severity.color }]}>
          {severity.label}
        </Text>
      </View>
    )}
  </View>
);

export const AllergiesCheckboxGroup = ({ value, onSelect, ...props }) => {
  const allergies = [
    { value: 'pollen', label: 'Pollen' },
    { value: 'dust', label: 'Dust Mites' },
    { value: 'peanuts', label: 'Peanuts' },
    { value: 'shellfish', label: 'Shellfish' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'gluten', label: 'Gluten' },
    { value: 'eggs', label: 'Eggs' },
    { value: 'soy', label: 'Soy' },
  ];

  return (
    <CheckboxGroup
      options={allergies}
      value={value}
      onSelect={onSelect}
      layout="grid"
      columns={2}
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
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    overflow: 'hidden',
  },
  indeterminate: {
    alignSelf: 'center',
  },
  labelContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
  },
  labelDisabled: {
    opacity: 0.5,
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
  symptomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  severityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
});

export default Checkbox;