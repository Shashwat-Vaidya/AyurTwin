import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../utils/constants/colors';

const MetricCard = ({
  title,
  value,
  unit,
  icon,
  color = colors.primarySaffron,
  trend,
  trendValue,
  subtitle,
  onPress,
  size = 'medium', // 'small', 'medium', 'large'
}) => {
  // Determine size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { width: 100, height: 100 },
          valueFont: 24,
          titleFont: 12,
        };
      case 'large':
        return {
          container: { width: '100%', height: 140 },
          valueFont: 42,
          titleFont: 16,
        };
      default: // medium
        return {
          container: { width: 160, height: 130 },
          valueFont: 32,
          titleFont: 14,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // Get trend icon
  const getTrendIcon = () => {
    if (trend === 'up') return 'arrow-up';
    if (trend === 'down') return 'arrow-down';
    return 'remove';
  };

  // Get trend color
  const getTrendColor = () => {
    if (trend === 'up') return colors.alertRed;
    if (trend === 'down') return colors.successGreen;
    return colors.textSecondary;
  };

  return (
    <TouchableOpacity
      style={[styles.container, sizeStyles.container]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <LinearGradient
        colors={[colors.cardBeige, '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Icon and title row */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
            <Ionicons name={icon} size={size === 'small' ? 16 : 20} color={color} />
          </View>
          <Text style={[styles.title, { fontSize: sizeStyles.titleFont }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Value and unit */}
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { fontSize: sizeStyles.valueFont, color }]}>
            {value}
          </Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>

        {/* Subtitle or trend */}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons name={getTrendIcon()} size={14} color={getTrendColor()} />
            <Text style={[styles.trendValue, { color: getTrendColor() }]}>{trendValue}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    margin: 6,
  },
  gradient: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontFamily: 'Inter-Medium',
    color: colors.textSecondary,
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  value: {
    fontFamily: 'Inter-Bold',
    lineHeight: undefined,
  },
  unit: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 2,
  },
});

export default MetricCard;