import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const LiveSensorStrip = ({
  sensors = [],
  onSensorPress,
  horizontal = true,
  showLabels = true,
  showIcons = true,
  showValues = true,
  size = 'medium', // 'small', 'medium', 'large'
  animate = true,
  refreshInterval = 5000,
  style,
}) => {
  
  const [sensorData, setSensorData] = useState(sensors);
  const pulseAnims = useState(sensors.map(() => new Animated.Value(1)))[0];

  useEffect(() => {
    if (animate) {
      startAnimations();
      const interval = setInterval(() => {
        refreshData();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, []);

  const startAnimations = () => {
    sensorData.forEach((_, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnims[index], {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnims[index], {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  const refreshData = () => {
    // Simulate real-time data updates
    const updatedData = sensorData.map(sensor => ({
      ...sensor,
      value: sensor.value + (Math.random() - 0.5) * 2,
    }));
    setSensorData(updatedData);
  };

  const getSizeStyles = () => {
    switch(size) {
      case 'small':
        return {
          padding: 8,
          iconSize: 16,
          fontSize: 12,
          valueSize: 14,
          spacing: 8,
        };
      case 'large':
        return {
          padding: 16,
          iconSize: 24,
          fontSize: 14,
          valueSize: 18,
          spacing: 16,
        };
      default:
        return {
          padding: 12,
          iconSize: 20,
          fontSize: 13,
          valueSize: 16,
          spacing: 12,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getStatusColor = (sensor) => {
    if (sensor.status === 'warning') return colors.warningYellow;
    if (sensor.status === 'alert') return colors.alertRed;
    if (sensor.status === 'success') return colors.successGreen;
    return sensor.color || colors.primarySaffron;
  };

  const renderSensor = (sensor, index) => {
    const statusColor = getStatusColor(sensor);
    const pulseStyle = animate ? { transform: [{ scale: pulseAnims[index] }] } : {};

    return (
      <TouchableOpacity
        key={sensor.id || index}
        style={[
          styles.sensorItem,
          {
            padding: sizeStyles.spacing,
            marginRight: horizontal ? sizeStyles.spacing : 0,
            marginBottom: horizontal ? 0 : sizeStyles.spacing,
          },
        ]}
        onPress={() => onSensorPress?.(sensor)}
        activeOpacity={0.7}
      >
        <Animated.View style={[styles.sensorContent, pulseStyle]}>
          {showIcons && (
            <View style={[styles.iconContainer, { backgroundColor: `${statusColor}20` }]}>
              <Ionicons
                name={sensor.icon || 'pulse'}
                size={sizeStyles.iconSize}
                color={statusColor}
              />
            </View>
          )}

          <View style={styles.sensorInfo}>
            {showLabels && (
              <Text style={[styles.sensorLabel, { fontSize: sizeStyles.fontSize }]}>
                {sensor.label || sensor.type}
              </Text>
            )}
            
            {showValues && (
              <Text style={[styles.sensorValue, { fontSize: sizeStyles.valueSize, color: statusColor }]}>
                {sensor.value}
                {sensor.unit && <Text style={styles.sensorUnit}> {sensor.unit}</Text>}
              </Text>
            )}
          </View>

          {sensor.trend && (
            <View style={styles.trendContainer}>
              <Ionicons
                name={sensor.trend === 'up' ? 'arrow-up' : sensor.trend === 'down' ? 'arrow-down' : 'remove'}
                size={sizeStyles.iconSize - 4}
                color={sensor.trend === 'up' ? colors.alertRed : sensor.trend === 'down' ? colors.successGreen : colors.textTertiary}
              />
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.container, style]}
        contentContainerStyle={styles.scrollContent}
      >
        {sensorData.map((sensor, index) => renderSensor(sensor, index))}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, styles.verticalContainer, style]}>
      {sensorData.map((sensor, index) => renderSensor(sensor, index))}
    </View>
  );
};

export const VitalSignsStrip = ({ onPress }) => {
  const [vitals, setVitals] = useState([
    { id: 'heart', type: 'heart', label: 'Heart Rate', value: 72, unit: 'bpm', icon: 'heart', color: colors.heartRate, status: 'normal' },
    { id: 'spo2', type: 'spo2', label: 'SpO₂', value: 98, unit: '%', icon: 'fitness', color: colors.spO2Blue, status: 'normal' },
    { id: 'temp', type: 'temperature', label: 'Temp', value: 36.6, unit: '°C', icon: 'thermometer', color: colors.tempOrange, status: 'normal' },
    { id: 'stress', type: 'stress', label: 'Stress', value: 45, icon: 'flash', color: colors.stressPurple, status: 'normal' },
  ]);

  return (
    <LiveSensorStrip
      sensors={vitals}
      onSensorPress={onPress}
      size="medium"
    />
  );
};

export const ActivityStrip = ({ onPress }) => {
  const [activity, setActivity] = useState([
    { id: 'steps', label: 'Steps', value: 5234, unit: 'steps', icon: 'walk', color: colors.primaryGreen },
    { id: 'calories', label: 'Calories', value: 1850, unit: 'kcal', icon: 'flame', color: colors.tempOrange },
    { id: 'distance', label: 'Distance', value: 4.2, unit: 'km', icon: 'map', color: colors.spO2Blue },
    { id: 'active', label: 'Active', value: 45, unit: 'min', icon: 'time', color: colors.heartRate },
  ]);

  return (
    <LiveSensorStrip
      sensors={activity}
      onSensorPress={onPress}
      size="small"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  verticalContainer: {
    paddingHorizontal: 16,
  },
  sensorItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sensorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorLabel: {
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  sensorValue: {
    fontFamily: 'Inter-Bold',
  },
  sensorUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  trendContainer: {
    marginLeft: 8,
  },
});

export default LiveSensorStrip;