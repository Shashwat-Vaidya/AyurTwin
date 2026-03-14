import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../utils/constants/colors';

const SensorCard = ({
  type,
  value,
  unit,
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
  };

  return (
    <TouchableOpacity
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
      </LinearGradient>
    </TouchableOpacity>
  );
};

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
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
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
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  },
});

export default SensorCard;