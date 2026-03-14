import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
<<<<<<< HEAD
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
=======
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

>>>>>>> 273e7c0 (update AyurTwin project)
import colors from '../../utils/constants/colors';

const SensorCard = ({
  type,
  value,
  unit,
<<<<<<< HEAD
  status = 'normal',
  icon,
  color,
  onPress,
  showHistory = false,
  trend = null, // 'up', 'down', 'stable'
  trendValue = null,
}) => {
  // Define sensor configurations
  const sensorConfig = {
    heartRate: {
      icon: 'heart',
      color: colors.heartRate,
      unit: 'bpm',
      title: 'Heart Rate',
      normalRange: [60, 100],
    },
    temperature: {
      icon: 'thermometer',
      color: colors.tempOrange,
      unit: '°C',
      title: 'Temperature',
      normalRange: [36.1, 37.2],
    },
    spo2: {
      icon: 'water',
      color: colors.spO2Blue,
      unit: '%',
      title: 'SpO₂',
      normalRange: [95, 100],
    },
    stress: {
      icon: 'flash',
      color: colors.stressPurple,
      unit: '',
      title: 'Stress',
      normalRange: [0, 50],
    },
    sleep: {
      icon: 'moon',
      color: colors.sleepIndigo,
      unit: 'h',
      title: 'Sleep',
      normalRange: [7, 9],
    },
    activity: {
      icon: 'walk',
      color: colors.primaryGreen,
      unit: 'steps',
      title: 'Activity',
      normalRange: [5000, 10000],
    },
  };

  const config = sensorConfig[type] || {
    icon: icon || 'heart',
    color: color || colors.primarySaffron,
    unit: unit || '',
    title: type,
  };

  // Determine status color
  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return colors.warningYellow;
      case 'alert':
        return colors.alertRed;
      case 'normal':
      default:
        return config.color;
    }
  };

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
=======
  icon,
  color,
  onPress,
  trend = 'stable', // up, down, stable
  trendValue,
  alert = false,
  size = 'medium', // small, medium, large
}) => {

  const getTrendIcon = () => {
    switch(trend) {
      case 'up': return 'arrow-up';
      case 'down': return 'arrow-down';
      default: return 'remove';
    }
  };

  const getTrendColor = () => {
    if (type === 'stress' || type === 'heart') {
      return trend === 'up' ? colors.alertRed : trend === 'down' ? colors.successGreen : colors.textTertiary;
    }
    return trend === 'up' ? colors.successGreen : trend === 'down' ? colors.alertRed : colors.textTertiary;
  };

  const getSizeStyles = () => {
    switch(size) {
      case 'small':
        return {
          card: { width: 100, height: 100 },
          icon: 20,
          value: 18,
          unit: 10,
          label: 12,
        };
      case 'large':
        return {
          card: { width: 160, height: 160 },
          icon: 32,
          value: 28,
          unit: 14,
          label: 14,
        };
      default: // medium
        return {
          card: { width: 130, height: 130 },
          icon: 24,
          value: 22,
          unit: 12,
          label: 13,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getUnitDisplay = () => {
    if (type === 'stress') return '';
    return unit;
  };

  const getLabel = () => {
    switch(type) {
      case 'heart': return 'Heart Rate';
      case 'temperature': return 'Temperature';
      case 'spo2': return 'SpO₂';
      case 'stress': return 'Stress';
      case 'sleep': return 'Sleep';
      case 'activity': return 'Activity';
      default: return type;
    }
  };

  const getStatusColor = () => {
    if (type === 'heart') {
      if (value < 60 || value > 100) return colors.alertRed;
      if (value < 50 || value > 110) return colors.warningYellow;
      return colors.successGreen;
    }
    if (type === 'spo2') {
      if (value < 90) return colors.alertRed;
      if (value < 95) return colors.warningYellow;
      return colors.successGreen;
    }
    if (type === 'stress') {
      if (value > 70) return colors.alertRed;
      if (value > 50) return colors.warningYellow;
      return colors.successGreen;
    }
    return color;
>>>>>>> 273e7c0 (update AyurTwin project)
  };

  return (
    <TouchableOpacity
<<<<<<< HEAD
      style={styles.container}
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
        {/* Header with icon and title */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${config.color}20` }]}>
            <Ionicons name={config.icon} size={24} color={config.color} />
          </View>
          <Text style={styles.title}>{config.title}</Text>
        </View>

        {/* Main value */}
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: getStatusColor() }]}>
            {value}
          </Text>
          <Text style={styles.unit}>{config.unit}</Text>
        </View>

        {/* Footer with trend and history */}
        <View style={styles.footer}>
          {trend && (
            <View style={styles.trendContainer}>
              <Ionicons
                name={getTrendIcon()}
                size={16}
                color={getTrendColor()}
              />
              {trendValue && (
                <Text style={[styles.trendValue, { color: getTrendColor() }]}>
                  {trendValue}
                </Text>
              )}
            </View>
          )}

          {showHistory && (
            <TouchableOpacity style={styles.historyButton} onPress={onPress}>
              <Text style={styles.historyText}>View History</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Status indicator dot */}
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
=======
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, sizeStyles.card]}
    >
      <LinearGradient
        colors={alert ? ['#FF5A5F20', '#FF5A5F10'] : ['white', 'white']}
        style={[styles.card, alert && styles.alertCard]}
      >
        {/* Alert Indicator */}
        {alert && (
          <View style={styles.alertDot}>
            <Ionicons name="alert-circle" size={16} color={colors.alertRed} />
          </View>
        )}

        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={sizeStyles.icon} color={color} />
        </View>

        {/* Value */}
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { fontSize: sizeStyles.value, color: getStatusColor() }]}>
            {value}
          </Text>
          {unit && (
            <Text style={[styles.unit, { fontSize: sizeStyles.unit }]}>
              {getUnitDisplay()}
            </Text>
          )}
        </View>

        {/* Label */}
        <Text style={[styles.label, { fontSize: sizeStyles.label }]}>
          {getLabel()}
        </Text>

        {/* Trend */}
        {trendValue && (
          <View style={styles.trendContainer}>
            <Ionicons name={getTrendIcon()} size={12} color={getTrendColor()} />
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {trendValue}
            </Text>
          </View>
        )}

        {/* Mini Graph Indicator (for some cards) */}
        {type === 'heart' && (
          <View style={styles.miniGraph}>
            <View style={[styles.graphDot, { backgroundColor: color }]} />
            <View style={[styles.graphLine, { backgroundColor: `${color}40` }]} />
            <View style={[styles.graphDot, { backgroundColor: color }]} />
          </View>
        )}
>>>>>>> 273e7c0 (update AyurTwin project)
      </LinearGradient>
    </TouchableOpacity>
  );
};

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 180,
    marginRight: 12,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    padding: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
=======
// Preset sensor cards
export const HeartRateCard = (props) => (
  <SensorCard
    type="heart"
    icon="heart"
    color={colors.heartRate}
    unit="bpm"
    {...props}
  />
);

export const TemperatureCard = (props) => (
  <SensorCard
    type="temperature"
    icon="thermometer"
    color={colors.tempOrange}
    unit="°C"
    {...props}
  />
);

export const SpO2Card = (props) => (
  <SensorCard
    type="spo2"
    icon="fitness"
    color={colors.spO2Blue}
    unit="%"
    {...props}
  />
);

export const StressCard = (props) => (
  <SensorCard
    type="stress"
    icon="flash"
    color={colors.stressPurple}
    unit=""
    {...props}
  />
);

export const SleepCard = (props) => (
  <SensorCard
    type="sleep"
    icon="moon"
    color={colors.sleepIndigo}
    unit="h"
    {...props}
  />
);

export const ActivityCard = (props) => (
  <SensorCard
    type="activity"
    icon="walk"
    color={colors.primaryGreen}
    unit="steps"
    {...props}
  />
);

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    borderRadius: 20,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  alertCard: {
    borderColor: colors.alertRed,
    borderWidth: 1,
  },
  alertDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
>>>>>>> 273e7c0 (update AyurTwin project)
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< HEAD
    marginRight: 8,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
=======
    marginBottom: 8,
>>>>>>> 273e7c0 (update AyurTwin project)
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
<<<<<<< HEAD
    marginBottom: 12,
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    lineHeight: 38,
  },
  unit: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
=======
    marginBottom: 4,
  },
  value: {
    fontFamily: 'Inter-Bold',
    marginRight: 2,
  },
  unit: {
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
  },
  label: {
    fontFamily: 'Inter-Medium',
    color: colors.textSecondary,
    marginBottom: 4,
>>>>>>> 273e7c0 (update AyurTwin project)
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
<<<<<<< HEAD
  trendValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 2,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 2,
  },
  statusDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
=======
  trendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    marginLeft: 2,
  },
  miniGraph: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  graphDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  graphLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 2,
>>>>>>> 273e7c0 (update AyurTwin project)
  },
});

export default SensorCard;