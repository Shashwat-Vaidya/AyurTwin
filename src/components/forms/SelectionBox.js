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

const SelectionBox = ({
  label,
  selected = false,
  onPress,
  icon,
  iconPosition = 'left', // 'left', 'right', 'top'
  size = 'medium', // 'small', 'medium', 'large'
  variant = 'default', // 'default', 'outline', 'gradient'
  shape = 'rounded', // 'rounded', 'circle', 'square'
  disabled = false,
  multiline = false,
  description,
  badge,
  badgeColor,
  showCheckmark = true,
  checkmarkPosition = 'right', // 'left', 'right'
  customCheckmark,
  style,
  textStyle,
  iconStyle,
  activeColor = colors.primarySaffron,
  inactiveColor = 'rgba(0,0,0,0.05)',
  activeTextColor = colors.primarySaffron,
  inactiveTextColor = colors.textSecondary,
}) => {
  
  const getSizeStyles = () => {
    switch(size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 12,
          fontSize: 12,
          iconSize: 16,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 16,
          iconSize: 24,
          minHeight: 56,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
          fontSize: 14,
          iconSize: 20,
          minHeight: 48,
        };
    }
  };

  const getShapeStyle = () => {
    switch(shape) {
      case 'circle':
        return { borderRadius: 50 };
      case 'square':
        return { borderRadius: 8 };
      default:
        return { borderRadius: 20 };
    }
  };

  const getVariantStyle = () => {
    if (selected) {
      switch(variant) {
        case 'outline':
          return {
            borderWidth: 2,
            borderColor: activeColor,
            backgroundColor: 'transparent',
          };
        case 'gradient':
          return {
            borderWidth: 0,
          };
        default:
          return {
            backgroundColor: activeColor,
            borderWidth: 0,
          };
      }
    } else {
      return {
        backgroundColor: inactiveColor,
        borderWidth: variant === 'outline' ? 1 : 0,
        borderColor: 'rgba(0,0,0,0.1)',
      };
    }
  };

  const sizeStyles = getSizeStyles();
  const shapeStyle = getShapeStyle();
  const variantStyle = getVariantStyle();

  const getTextColor = () => {
    if (selected) {
      return variant === 'gradient' || variant === 'outline' ? activeColor : 'white';
    }
    return inactiveTextColor;
  };

  const renderContent = () => {
    const elements = [];

    // Icon
    if (icon && iconPosition === 'left') {
      elements.push(
        <Ionicons
          key="icon-left"
          name={icon}
          size={sizeStyles.iconSize}
          color={selected && variant !== 'outline' && variant !== 'gradient' ? 'white' : activeColor}
          style={[styles.icon, styles.iconLeft, iconStyle]}
        />
      );
    }

    // Text container
    elements.push(
      <View key="text" style={styles.textContainer}>
        <Text
          style={[
            styles.label,
            {
              fontSize: sizeStyles.fontSize,
              color: getTextColor(),
            },
            textStyle,
          ]}
          numberOfLines={multiline ? undefined : 1}
        >
          {label}
        </Text>
        {description && (
          <Text style={[
            styles.description,
            { color: selected ? getTextColor() : colors.textTertiary }
          ]}>
            {description}
          </Text>
        )}
      </View>
    );

    // Right icon
    if (icon && iconPosition === 'right') {
      elements.push(
        <Ionicons
          key="icon-right"
          name={icon}
          size={sizeStyles.iconSize}
          color={selected && variant !== 'outline' && variant !== 'gradient' ? 'white' : activeColor}
          style={[styles.icon, styles.iconRight, iconStyle]}
        />
      );
    }

    // Checkmark
    if (selected && showCheckmark && checkmarkPosition === 'right') {
      elements.push(
        <Ionicons
          key="checkmark-right"
          name={customCheckmark || 'checkmark-circle'}
          size={sizeStyles.iconSize}
          color={selected && variant !== 'outline' && variant !== 'gradient' ? 'white' : activeColor}
          style={[styles.checkmark, styles.checkmarkRight]}
        />
      );
    }

    // Top icon
    if (icon && iconPosition === 'top') {
      return (
        <View style={styles.topIconContainer}>
          <Ionicons
            name={icon}
            size={sizeStyles.iconSize * 1.5}
            color={selected && variant !== 'outline' && variant !== 'gradient' ? 'white' : activeColor}
            style={[styles.topIcon, iconStyle]}
          />
          <Text
            style={[
              styles.label,
              {
                fontSize: sizeStyles.fontSize,
                color: getTextColor(),
                marginTop: 4,
              },
              textStyle,
            ]}
          >
            {label}
          </Text>
          {description && (
            <Text style={[
              styles.description,
              { color: selected ? getTextColor() : colors.textTertiary }
            ]}>
              {description}
            </Text>
          )}
        </View>
      );
    }

    return elements;
  };

  const SelectionContent = () => (
    <View style={[
      styles.content,
      iconPosition === 'top' && styles.topContent,
      selected && variant === 'gradient' && styles.gradientContent,
    ]}>
      {renderContent()}
    </View>
  );

  if (selected && variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        style={[
          styles.container,
          sizeStyles,
          shapeStyle,
          { overflow: 'hidden' },
          style,
        ]}
      >
        <LinearGradient
          colors={[activeColor, `${activeColor}CC`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <SelectionContent />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        sizeStyles,
        shapeStyle,
        variantStyle,
        disabled && styles.disabled,
        style,
      ]}
    >
      <SelectionContent />
      {badge && selected && (
        <View style={[styles.badge, { backgroundColor: badgeColor || activeColor }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const SelectionGroup = ({
  options,
  value,
  onSelect,
  multiple = false,
  layout = 'row', // 'row', 'column', 'grid'
  columns = 2,
  ...props
}) => {
  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue];
      onSelect(newValue);
    } else {
      onSelect(optionValue);
    }
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
        return styles.groupRow;
    }
  };

  return (
    <View style={[styles.groupContainer, getLayoutStyle()]}>
      {options.map((option, index) => (
        <View
          key={index}
          style={[
            layout === 'grid' && { width: `${100 / columns}%`, padding: 4 },
          ]}
        >
          <SelectionBox
            label={option.label}
            selected={multiple ? value.includes(option.value) : value === option.value}
            onPress={() => handleSelect(option.value)}
            icon={option.icon}
            description={option.description}
            badge={option.badge}
            {...props}
          />
        </View>
      ))}
    </View>
  );
};

export const DoshaSelectionBox = ({ dosha, selected, onPress, ...props }) => {
  const doshaConfig = {
    vata: {
      label: 'Vata',
      icon: 'leaf',
      color: '#7B6E8F',
      description: 'Air & Space - Creative, energetic',
    },
    pitta: {
      label: 'Pitta',
      icon: 'flame',
      color: '#FF6B6B',
      description: 'Fire & Water - Intense, focused',
    },
    kapha: {
      label: 'Kapha',
      icon: 'water',
      color: '#6BA6A6',
      description: 'Water & Earth - Calm, stable',
    },
  };

  const config = doshaConfig[dosha] || doshaConfig.vata;

  return (
    <SelectionBox
      label={config.label}
      icon={config.icon}
      description={config.description}
      selected={selected}
      onPress={onPress}
      activeColor={config.color}
      variant={selected ? 'gradient' : 'default'}
      {...props}
    />
  );
};

export const GenderSelectionBox = ({ gender, selected, onPress, ...props }) => {
  const genderConfig = {
    male: {
      label: 'Male',
      icon: 'male',
      color: colors.spO2Blue,
    },
    female: {
      label: 'Female',
      icon: 'female',
      color: colors.heartRate,
    },
    other: {
      label: 'Other',
      icon: 'people',
      color: colors.stressPurple,
    },
  };

  const config = genderConfig[gender] || genderConfig.other;

  return (
    <SelectionBox
      label={config.label}
      icon={config.icon}
      selected={selected}
      onPress={onPress}
      activeColor={config.color}
      {...props}
    />
  );
};

export const ActivityLevelBox = ({ level, selected, onPress, ...props }) => {
  const levelConfig = {
    low: {
      label: 'Low',
      icon: 'bed',
      description: 'Little or no exercise',
    },
    moderate: {
      label: 'Moderate',
      icon: 'walk',
      description: 'Exercise 3-5 days/week',
    },
    high: {
      label: 'High',
      icon: 'fitness',
      description: 'Intense exercise 6-7 days/week',
    },
  };

  const config = levelConfig[level] || levelConfig.moderate;

  return (
    <SelectionBox
      label={config.label}
      icon={config.icon}
      description={config.description}
      selected={selected}
      onPress={onPress}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  gradientContent: {
    zIndex: 1,
  },
  icon: {
    marginHorizontal: 4,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  topIcon: {
    marginBottom: 4,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontFamily: 'Inter-Medium',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    marginTop: 2,
  },
  checkmark: {
    marginHorizontal: 4,
  },
  checkmarkRight: {
    marginLeft: 8,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: 'white',
  },
  disabled: {
    opacity: 0.5,
  },
  groupContainer: {
    width: '100%',
  },
  groupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  groupColumn: {
    flexDirection: 'column',
    gap: 8,
  },
  groupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
});

export default SelectionBox;