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

const MetricCard = ({ metric, onPress, selected = false }) => {
  const { id, label, value, unit, icon, color } = metric;

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={selected ? [color, `${color}CC`] : ['white', '#FAFAFA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, selected && styles.selectedGradient]}
      >
        <View style={[styles.iconContainer, { backgroundColor: selected ? 'white' : `${color}20` }]}>
          <Ionicons 
            name={icon} 
            size={24} 
            color={selected ? color : color} 
          />
        </View>
        <Text style={[styles.value, { color: selected ? 'white' : color }]}>
          {value}
        </Text>
        <Text style={[styles.unit, { color: selected ? 'rgba(255,255,255,0.8)' : colors.textTertiary }]}>
          {unit}
        </Text>
        <Text style={[styles.label, { color: selected ? 'white' : colors.textSecondary }]}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Preset metric cards
export const HeartMetric = (props) => (
  <MetricCard
    metric={{
      id: 'heart',
      label: 'Heart Rate',
      icon: 'heart',
      color: colors.heartRate,
      ...props.metric,
    }}
    {...props}
  />
);

export const SpO2Metric = (props) => (
  <MetricCard
    metric={{
      id: 'spo2',
      label: 'SpO₂',
      icon: 'fitness',
      color: colors.spO2Blue,
      ...props.metric,
    }}
    {...props}
  />
);

export const TemperatureMetric = (props) => (
  <MetricCard
    metric={{
      id: 'temp',
      label: 'Temperature',
      icon: 'thermometer',
      color: colors.tempOrange,
      ...props.metric,
    }}
    {...props}
  />
);

export const StressMetric = (props) => (
  <MetricCard
    metric={{
      id: 'stress',
      label: 'Stress',
      icon: 'flash',
      color: colors.stressPurple,
      ...props.metric,
    }}
    {...props}
  />
);

export const SleepMetric = (props) => (
  <MetricCard
    metric={{
      id: 'sleep',
      label: 'Sleep',
      icon: 'moon',
      color: colors.sleepIndigo,
      ...props.metric,
    }}
    {...props}
  />
);

export const ActivityMetric = (props) => (
  <MetricCard
    metric={{
      id: 'activity',
      label: 'Activity',
      icon: 'walk',
      color: colors.primaryGreen,
      ...props.metric,
    }}
    {...props}
  />
);

const styles = StyleSheet.create({
  container: {
    width: '31%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedContainer: {
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    padding: 12,
    alignItems: 'center',
  },
  selectedGradient: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 2,
  },
  unit: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    marginBottom: 4,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default MetricCard;