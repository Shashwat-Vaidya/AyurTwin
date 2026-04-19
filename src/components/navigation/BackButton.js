import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const BackButton = ({
  onPress,
  color = colors.textPrimary,
  size = 24,
  variant = 'default', // 'default', 'circle', 'gradient', 'outline'
  showLabel = false,
  label = 'Back',
  labelPosition = 'right', // 'left', 'right'
  customIcon,
  style,
  iconStyle,
  labelStyle,
}) => {
  
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  const getVariantStyle = () => {
    switch(variant) {
      case 'circle':
        return {
          container: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
          iconColor: color,
        };
      case 'gradient':
        return {
          container: {
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          },
          iconColor: 'white',
        };
      case 'outline':
        return {
          container: {
            width: 44,
            height: 44,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: color,
            justifyContent: 'center',
            alignItems: 'center',
          },
          iconColor: color,
        };
      default:
        return {
          container: {
            padding: 8,
          },
          iconColor: color,
        };
    }
  };

  const variantStyle = getVariantStyle();

  const renderContent = () => {
    const icon = customIcon || (
      <Ionicons 
        name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'} 
        size={size} 
        color={variantStyle.iconColor} 
      />
    );

    if (showLabel) {
      return (
        <View style={[
          styles.labelContainer,
          labelPosition === 'left' ? styles.labelLeft : styles.labelRight,
        ]}>
          {labelPosition === 'left' && (
            <Text style={[styles.label, { color }, labelStyle]}>{label}</Text>
          )}
          {icon}
          {labelPosition === 'right' && (
            <Text style={[styles.label, { color }, labelStyle]}>{label}</Text>
          )}
        </View>
      );
    }

    return icon;
  };

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={[variantStyle.container, style]}
      >
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
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
      onPress={handlePress}
      activeOpacity={0.7}
      style={[variantStyle.container, style]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export const BackButtonWithLabel = ({ label = 'Back', ...props }) => (
  <BackButton showLabel label={label} {...props} />
);

export const BackButtonCircle = (props) => (
  <BackButton variant="circle" {...props} />
);

export const BackButtonGradient = (props) => (
  <BackButton variant="gradient" {...props} />
);

export const BackButtonOutline = (props) => (
  <BackButton variant="outline" {...props} />
);

export const BackButtonWithTitle = ({ title, style }) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.titleContainer, style]}>
      <BackButton variant="circle" />
      <Text style={styles.title}>{title}</Text>
      <View style={{ width: 44 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelLeft: {
    marginRight: 8,
  },
  labelRight: {
    marginLeft: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
  },
});

export default BackButton;