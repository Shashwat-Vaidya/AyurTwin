import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../utils/constants/colors';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  error,
  success,
  warning,
  icon,
  iconPosition = 'left',
  onIconPress,
  required = false,
  disabled = false,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  ...props
}) => {
  
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const [shakeAnimation] = useState(new Animated.Value(0));

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const showError = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 5, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const getBorderColor = () => {
    if (error) {
      showError();
      return colors.alertRed;
    }
    if (success) return colors.successGreen;
    if (warning) return colors.warningYellow;
    if (isFocused) return colors.primarySaffron;
    return 'rgba(0, 0, 0, 0.05)';
  };

  const getBackgroundColor = () => {
    if (disabled) return '#F5F5F5';
    return 'white';
  };

  const getIconColor = () => {
    if (error) return colors.alertRed;
    if (success) return colors.successGreen;
    if (warning) return colors.warningYellow;
    if (isFocused) return colors.primarySaffron;
    return colors.textTertiary;
  };

  const renderIcon = () => {
    if (!icon) return null;

    const IconComponent = (
      <Ionicons 
        name={icon} 
        size={20} 
        color={getIconColor()} 
        style={[
          styles.icon,
          iconPosition === 'left' ? styles.iconLeft : styles.iconRight,
        ]} 
      />
    );

    if (onIconPress) {
      return (
        <TouchableOpacity onPress={onIconPress}>
          {IconComponent}
        </TouchableOpacity>
      );
    }

    return IconComponent;
  };

  const renderSecureToggle = () => {
    if (!secureTextEntry) return null;

    return (
      <TouchableOpacity
        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        style={styles.secureToggle}
      >
        <Ionicons 
          name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
          size={20} 
          color={colors.textTertiary} 
        />
      </TouchableOpacity>
    );
  };

  const renderStatusMessage = () => {
    if (error) {
      return (
        <View style={styles.statusContainer}>
          <Ionicons name="alert-circle" size={14} color={colors.alertRed} />
          <Text style={[styles.statusText, styles.errorText, errorStyle]}>{error}</Text>
        </View>
      );
    }
    if (success) {
      return (
        <View style={styles.statusContainer}>
          <Ionicons name="checkmark-circle" size={14} color={colors.successGreen} />
          <Text style={[styles.statusText, styles.successText]}>{success}</Text>
        </View>
      );
    }
    if (warning) {
      return (
        <View style={styles.statusContainer}>
          <Ionicons name="warning" size={14} color={colors.warningYellow} />
          <Text style={[styles.statusText, styles.warningText]}>{warning}</Text>
        </View>
      );
    }
    return null;
  };

  const renderLabel = () => {
    if (!label) return null;

    return (
      <Text style={[styles.label, labelStyle]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
    );
  };

  const renderCounter = () => {
    if (!maxLength) return null;

    return (
      <Text style={styles.counter}>
        {value?.length || 0}/{maxLength}
      </Text>
    );
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateX: shakeAnimation }] },
        style,
      ]}
    >
      {renderLabel()}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
            borderWidth: error ? 2 : 1,
          },
        ]}
      >
        {iconPosition === 'left' && renderIcon()}
        
        <TextInput
          style={[
            styles.input,
            {
              textAlignVertical: multiline ? 'top' : 'center',
              height: multiline ? 100 : 'auto',
              paddingLeft: icon && iconPosition === 'left' ? 0 : 16,
              paddingRight: (secureTextEntry || (icon && iconPosition === 'right')) ? 40 : 16,
            },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={!disabled && editable}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {renderSecureToggle()}
        {iconPosition === 'right' && renderIcon()}
      </View>

      <View style={styles.footer}>
        {renderStatusMessage()}
        {renderCounter()}
      </View>
    </Animated.View>
  );
};

// Preset input types
export const EmailInput = (props) => (
  <Input
    keyboardType="email-address"
    autoCapitalize="none"
    icon="mail-outline"
    placeholder="Enter your email"
    {...props}
  />
);

export const PasswordInput = (props) => (
  <Input
    secureTextEntry
    icon="lock-closed-outline"
    placeholder="Enter your password"
    {...props}
  />
);

export const PhoneInput = (props) => (
  <Input
    keyboardType="phone-pad"
    icon="call-outline"
    placeholder="Enter phone number"
    maxLength={10}
    {...props}
  />
);

export const NameInput = (props) => (
  <Input
    autoCapitalize="words"
    icon="person-outline"
    placeholder="Enter your name"
    {...props}
  />
);

export const SearchInput = ({ onSearch, ...props }) => (
  <Input
    icon="search-outline"
    iconPosition="left"
    placeholder="Search..."
    returnKeyType="search"
    onSubmitEditing={onSearch}
    {...props}
  />
);

export const TextAreaInput = (props) => (
  <Input
    multiline
    numberOfLines={4}
    textAlignVertical="top"
    {...props}
  />
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  required: {
    color: colors.alertRed,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 56,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 12,
  },
  icon: {
    marginHorizontal: 12,
  },
  iconLeft: {
    marginRight: 0,
  },
  iconRight: {
    marginLeft: 0,
  },
  secureToggle: {
    padding: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  errorText: {
    color: colors.alertRed,
  },
  successText: {
    color: colors.successGreen,
  },
  warningText: {
    color: colors.warningYellow,
  },
  counter: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
});

export default Input;