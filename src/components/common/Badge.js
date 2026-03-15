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

const Badge = ({
  label,
  count,
  icon,
  type = 'default', // 'default', 'primary', 'success', 'warning', 'danger', 'info', 'gradient'
  variant = 'solid', // 'solid', 'outline', 'subtle'
  size = 'medium', // 'small', 'medium', 'large'
  shape = 'rounded', // 'rounded', 'circle', 'square'
  position = 'relative', // 'relative', 'absolute'
  onPress,
  style,
  textStyle,
  iconStyle,
}) => {
  
  const getTypeColors = () => {
    switch(type) {
      case 'primary':
        return {
          solid: colors.primarySaffron,
          outline: colors.primarySaffron,
          subtle: `${colors.primarySaffron}20`,
          text: colors.primarySaffron,
        };
      case 'success':
        return {
          solid: colors.successGreen,
          outline: colors.successGreen,
          subtle: `${colors.successGreen}20`,
          text: colors.successGreen,
        };
      case 'warning':
        return {
          solid: colors.warningYellow,
          outline: colors.warningYellow,
          subtle: `${colors.warningYellow}20`,
          text: colors.warningYellow,
        };
      case 'danger':
        return {
          solid: colors.alertRed,
          outline: colors.alertRed,
          subtle: `${colors.alertRed}20`,
          text: colors.alertRed,
        };
      case 'info':
        return {
          solid: colors.spO2Blue,
          outline: colors.spO2Blue,
          subtle: `${colors.spO2Blue}20`,
          text: colors.spO2Blue,
        };
      default:
        return {
          solid: colors.textSecondary,
          outline: colors.textSecondary,
          subtle: `${colors.textSecondary}20`,
          text: colors.textSecondary,
        };
    }
  };

  const getSizeStyles = () => {
    switch(size) {
      case 'small':
        return {
          paddingHorizontal: 6,
          paddingVertical: 2,
          fontSize: 10,
          iconSize: 12,
          minWidth: 16,
          minHeight: 16,
        };
      case 'large':
        return {
          paddingHorizontal: 12,
          paddingVertical: 6,
          fontSize: 14,
          iconSize: 18,
          minWidth: 28,
          minHeight: 28,
        };
      default:
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          fontSize: 12,
          iconSize: 14,
          minWidth: 20,
          minHeight: 20,
        };
    }
  };

  const getShapeStyle = () => {
    switch(shape) {
      case 'circle':
        return { borderRadius: 50 };
      case 'square':
        return { borderRadius: 4 };
      default:
        return { borderRadius: 12 };
    }
  };

  const typeColors = getTypeColors();
  const sizeStyles = getSizeStyles();
  const shapeStyle = getShapeStyle();

  const getVariantStyle = () => {
    switch(variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: typeColors.outline,
        };
      case 'subtle':
        return {
          backgroundColor: typeColors.subtle,
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: typeColors.solid,
          borderWidth: 0,
        };
    }
  };

  const getTextColor = () => {
    if (variant === 'solid') return 'white';
    if (variant === 'outline') return typeColors.text;
    return typeColors.text;
  };

  const badgeContent = (
    <View
      style={[
        styles.container,
        getVariantStyle(),
        shapeStyle,
        {
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          minWidth: sizeStyles.minWidth,
          minHeight: sizeStyles.minHeight,
        },
        position === 'absolute' && styles.absolute,
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={sizeStyles.iconSize}
          color={getTextColor()}
          style={[styles.icon, iconStyle]}
        />
      )}
      {label && (
        <Text
          style={[
            styles.label,
            {
              fontSize: sizeStyles.fontSize,
              color: getTextColor(),
            },
            icon && styles.labelWithIcon,
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
      {count !== undefined && (
        <Text
          style={[
            styles.count,
            {
              fontSize: sizeStyles.fontSize,
              color: getTextColor(),
            },
            textStyle,
          ]}
        >
          {count > 99 ? '99+' : count}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {badgeContent}
      </TouchableOpacity>
    );
  }

  return badgeContent;
};

export const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    active: { type: 'success', label: 'Active' },
    inactive: { type: 'default', label: 'Inactive' },
    pending: { type: 'warning', label: 'Pending' },
    completed: { type: 'success', label: 'Completed' },
    failed: { type: 'danger', label: 'Failed' },
    cancelled: { type: 'danger', label: 'Cancelled' },
    verified: { type: 'success', label: 'Verified' },
    unverified: { type: 'warning', label: 'Unverified' },
    online: { type: 'success', label: 'Online' },
    offline: { type: 'default', label: 'Offline' },
    busy: { type: 'warning', label: 'Busy' },
    away: { type: 'info', label: 'Away' },
  };

  const config = statusConfig[status] || { type: 'default', label: status };

  return <Badge {...props} type={config.type} label={config.label} />;
};

export const DoshaBadge = ({ dosha, ...props }) => {
  const doshaConfig = {
    vata: { type: 'default', color: '#7B6E8F', label: 'Vata' },
    pitta: { type: 'default', color: '#FF6B6B', label: 'Pitta' },
    kapha: { type: 'default', color: '#6BA6A6', label: 'Kapha' },
  };

  const config = doshaConfig[dosha] || { type: 'default', label: dosha };

  return (
    <Badge
      {...props}
      type="default"
      label={config.label}
      style={[{ backgroundColor: config.color }, props.style]}
    />
  );
};

export const NotificationBadge = ({ count, ...props }) => (
  <Badge
    type="danger"
    size="small"
    shape="circle"
    position="absolute"
    count={count}
    {...props}
  />
);

export const OnlineBadge = ({ size = 'small', ...props }) => (
  <Badge
    type="success"
    size={size}
    shape="circle"
    position="absolute"
    style={styles.onlineBadge}
    {...props}
  />
);

export const PremiumBadge = ({ ...props }) => (
  <Badge
    type="primary"
    icon="star"
    label="PREMIUM"
    size="small"
    {...props}
  />
);

export const VerifiedBadge = ({ ...props }) => (
  <Badge
    type="success"
    icon="checkmark"
    shape="circle"
    size="small"
    {...props}
  />
);

export const NewBadge = ({ ...props }) => (
  <Badge
    type="primary"
    label="NEW"
    size="small"
    {...props}
  />
);

export const BetaBadge = ({ ...props }) => (
  <Badge
    type="warning"
    label="BETA"
    size="small"
    {...props}
  />
);

export const GradientBadge = ({ label, colors: gradientColors = [colors.primarySaffron, colors.primaryGreen], ...props }) => (
  <LinearGradient
    colors={gradientColors}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[styles.gradientContainer, props.style]}
  >
    <Badge
      {...props}
      label={label}
      variant="solid"
      style={styles.gradientBadge}
    />
  </LinearGradient>
);

export const SeverityBadge = ({ severity, ...props }) => {
  const severityConfig = {
    low: { type: 'success', label: 'Low' },
    medium: { type: 'warning', label: 'Medium' },
    high: { type: 'danger', label: 'High' },
    critical: { type: 'danger', label: 'Critical', icon: 'alert' },
    info: { type: 'info', label: 'Info' },
  };

  const config = severityConfig[severity] || { type: 'default', label: severity };

  return <Badge {...props} type={config.type} label={config.label} icon={config.icon} />;
};

export const MetricBadge = ({ value, unit, type = 'default', ...props }) => (
  <Badge
    {...props}
    type={type}
    label={`${value}${unit ? ` ${unit}` : ''}`}
  />
);

export const AchievementBadge = ({ title, icon, tier = 'bronze', ...props }) => {
  const tierColors = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
  };

  return (
    <Badge
      {...props}
      icon={icon}
      label={title}
      variant="subtle"
      style={[styles.achievementBadge, { borderColor: tierColors[tier] }]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  absolute: {
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 10,
  },
  icon: {
    marginRight: 2,
  },
  label: {
    fontFamily: 'Inter-Medium',
    includeFontPadding: false,
  },
  labelWithIcon: {
    marginLeft: 2,
  },
  count: {
    fontFamily: 'Inter-Bold',
    includeFontPadding: false,
  },
  onlineBadge: {
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  gradientContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientBadge: {
    backgroundColor: 'transparent',
  },
  achievementBadge: {
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

export default Badge;