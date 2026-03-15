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

const SensorCard = ({
  type,
  value,
  unit,
  icon,
  color,
  onPress,
  trend = 'stable',
  trendValue = null,
  alert = false,
  size = 'medium',
  status = 'normal',
  showHistory = false,
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
      default:
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
      case 'heart':
      case 'heartRate':
        return 'Heart Rate';
      case 'temperature':
        return 'Temperature';
      case 'spo2':
        return 'SpO₂';
      case 'stress':
        return 'Stress';
      case 'sleep':
        return 'Sleep';
      case 'activity':
        return 'Activity';
      default:
        return type || 'Sensor';
    }
  };

  const getStatusColor = () => {
    if (alert) return colors.alertRed;
    
    if (status === 'warning') return colors.warningYellow;
    if (status === 'alert') return colors.alertRed;
    
    if (type === 'heart' || type === 'heartRate') {
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
    if (type === 'temperature') {
      if (value < 35 || value > 38) return colors.alertRed;
      if (value < 36 || value > 37.5) return colors.warningYellow;
      return colors.successGreen;
    }
    
    return color || colors.primarySaffron;
  };

  const statusColor = getStatusColor();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, sizeStyles.card]}
      disabled={!onPress}
    >
      <LinearGradient
        colors={alert ? ['#FF5A5F20', '#FF5A5F10'] : [colors.cardBeige, '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, alert && styles.alertCard]}
      >
        {alert && (
          <View style={styles.alertDot}>
            <Ionicons name="alert-circle" size={16} color={colors.alertRed} />
          </View>
        )}

        {!alert && (
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        )}

        <View style={[styles.iconContainer, { backgroundColor: `${color || statusColor}20` }]}>
          <Ionicons 
            name={icon || 'heart'} 
            size={sizeStyles.icon} 
            color={color || statusColor} 
          />
        </View>

        <View style={styles.valueContainer}>
          <Text style={[styles.value, { fontSize: sizeStyles.value, color: statusColor }]}>
            {value}
          </Text>
          {unit && (
            <Text style={[styles.unit, { fontSize: sizeStyles.unit }]}>
              {getUnitDisplay()}
            </Text>
          )}
        </View>

        <Text style={[styles.label, { fontSize: sizeStyles.label }]} numberOfLines={1}>
          {getLabel()}
        </Text>

        {trendValue && (
          <View style={styles.trendContainer}>
            <Ionicons name={getTrendIcon()} size={12} color={getTrendColor()} />
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {trendValue}
            </Text>
          </View>
        )}

        {showHistory && size === 'large' && (
          <TouchableOpacity style={styles.historyButton} onPress={onPress}>
            <Text style={styles.historyText}>History</Text>
            <Ionicons name="chevron-forward" size={12} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {type === 'heart' && size === 'large' && (
          <View style={styles.miniGraph}>
            <View style={[styles.graphDot, { backgroundColor: color || statusColor }]} />
            <View style={[styles.graphLine, { backgroundColor: `${color || statusColor}40` }]} />
            <View style={[styles.graphDot, { backgroundColor: color || statusColor }]} />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

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
    borderColor: 'rgba(255,255,255,0.5)',
    position: 'relative',
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
  },
  statusDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
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
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    marginLeft: 2,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  historyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textSecondary,
    marginRight: 2,
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
  },
});

export default SensorCard;