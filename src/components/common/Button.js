import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../utils/constants/colors';

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  outline = false,
  gradient = false,
  icon,
  iconPosition = 'left',
  size = 'medium',
  fullWidth = false,
  rounded = true,
  backgroundColor,
  textColor,
  borderColor,
  ...props
}) => {
  
  const getSizeStyles = () => {
    switch(size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
          iconSize: 16,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          fontSize: 18,
          iconSize: 24,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: 16,
          iconSize: 20,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getBackgroundColor = () => {
    if (disabled) return colors.disabled;
    if (outline) return 'transparent';
    if (gradient) return 'transparent';
    return backgroundColor || colors.primarySaffron;
  };

  const getTextColor = () => {
    if (disabled) return colors.textTertiary;
    if (outline) return textColor || colors.primarySaffron;
    if (gradient) return 'white';
    return textColor || 'white';
  };

  const getBorderColor = () => {
    if (disabled) return colors.disabled;
    if (outline) return borderColor || colors.primarySaffron;
    return 'transparent';
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={outline ? colors.primarySaffron : 'white'} 
        />
      );
    }

    const iconElement = icon && (
      <Ionicons 
        name={icon} 
        size={sizeStyles.iconSize} 
        color={getTextColor()} 
        style={[
          iconPosition === 'left' ? styles.iconLeft : styles.iconRight,
          { marginRight: iconPosition === 'left' && title ? 8 : 0,
            marginLeft: iconPosition === 'right' && title ? 8 : 0 }
        ]} 
      />
    );

    return (
      <View style={styles.contentContainer}>
        {iconPosition === 'left' && iconElement}
        {title && (
          <Text style={[
            styles.text,
            { fontSize: sizeStyles.fontSize, color: getTextColor() }
          ]}>
            {title}
          </Text>
        )}
        {iconPosition === 'right' && iconElement}
      </View>
    );
  };

  const buttonStyles = [
    styles.button,
    {
      paddingVertical: sizeStyles.paddingVertical,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      backgroundColor: getBackgroundColor(),
      borderColor: getBorderColor(),
      borderWidth: outline ? 1 : 0,
      borderRadius: rounded ? 30 : 8,
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.6 : 1,
    },
    style,
  ];

  if (gradient && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[buttonStyles, { overflow: 'hidden' }]}
        {...props}
      >
        <LinearGradient
          colors={[colors.primarySaffron, '#FFB347']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={buttonStyles}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export const PrimaryButton = (props) => <Button gradient {...props} />;
export const SecondaryButton = (props) => <Button outline {...props} />;
export const DangerButton = (props) => <Button backgroundColor={colors.alertRed} textColor="white" {...props} />;
export const SuccessButton = (props) => <Button backgroundColor={colors.successGreen} textColor="white" {...props} />;
export const WarningButton = (props) => <Button backgroundColor={colors.warningYellow} textColor="white" {...props} />;
export const TextButton = (props) => <Button outline borderColor="transparent" textColor={colors.textSecondary} {...props} />;

export const IconButton = ({ icon, onPress, size = 'medium', color, style }) => {
  const iconSizes = {
    small: 20,
    medium: 24,
    large: 32,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.iconButton, style]}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={icon} 
        size={iconSizes[size]} 
        color={color || colors.textPrimary} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
});

export default Button;