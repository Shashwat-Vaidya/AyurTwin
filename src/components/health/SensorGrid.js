import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const SensorGrid = ({
  sensors = [],
  onSensorPress,
  columns = 2,
  variant = 'card', // 'card', 'compact', 'detailed'
  showIcons = true,
  showValues = true,
  showLabels = true,
  showStatus = true,
  style,
}) => {
  
  const getVariantStyles = () => {
    switch(variant) {
      case 'compact':
        return {
          padding: 12,
          iconSize: 20,
          fontSize: 12,
          valueSize: 16,
        };
      case 'detailed':
        return {
          padding: 20,
          iconSize: 28,
          fontSize: 14,
          valueSize: 22,
        };
      default:
        return {
          padding: 16,
          iconSize: 24,
          fontSize: 13,
          valueSize: 18,
        };
    }
  };

  const variantStyles = getVariantStyles();

  const getStatusColor = (sensor) => {
    if (sensor.status === 'warning') return colors.warningYellow;
    if (sensor.status === 'alert') return colors.alertRed;
    if (sensor.status === 'success') return colors.successGreen;
    return sensor.color || colors.primarySaffron;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'warning': return 'warning';
      case 'alert': return 'alert-circle';
      case 'success': return 'checkmark-circle';
      default: return 'information-circle';
    }
  };

  const renderSensor = ({ item }) => {
    const statusColor = getStatusColor(item);
    const statusIcon = getStatusIcon(item.status);

    return (
      <TouchableOpacity
        style={[
          styles.sensorItem,
          {
            width: `${100 / columns}%`,
            padding: 4,
          },
        ]}
        onPress={() => onSensorPress?.(item)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[colors.cardBeige, '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.sensorCard,
            { padding: variantStyles.padding },
          ]}
        >
          {showStatus && item.status && item.status !== 'normal' && (
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Ionicons name={statusIcon} size={12} color="white" />
            </View>
          )}

          <View style={styles.sensorHeader}>
            {showIcons && (
              <View style={[styles.iconContainer, { backgroundColor: `${statusColor}20` }]}>
                <Ionicons
                  name={item.icon || 'pulse'}
                  size={variantStyles.iconSize}
                  color={statusColor}
                />
              </View>
            )}
            
            {showLabels && (
              <Text style={[styles.sensorLabel, { fontSize: variantStyles.fontSize }]}>
                {item.label || item.type}
              </Text>
            )}
          </View>

          {showValues && (
            <View style={styles.valueContainer}>
              <Text style={[styles.sensorValue, { fontSize: variantStyles.valueSize, color: statusColor }]}>
                {item.value}
              </Text>
              {item.unit && (
                <Text style={[styles.sensorUnit, { fontSize: variantStyles.fontSize - 2 }]}>
                  {item.unit}
                </Text>
              )}
            </View>
          )}

          {item.trend !== undefined && (
            <View style={styles.trendContainer}>
              <Ionicons
                name={item.trend > 0 ? 'arrow-up' : item.trend < 0 ? 'arrow-down' : 'remove'}
                size={variantStyles.iconSize - 4}
                color={item.trend > 0 ? colors.alertRed : item.trend < 0 ? colors.successGreen : colors.textTertiary}
              />
              <Text style={[styles.trendText, { fontSize: variantStyles.fontSize - 2 }]}>
                {Math.abs(item.trend)}%
              </Text>
            </View>
          )}

          {item.description && variant === 'detailed' && (
            <Text style={[styles.description, { fontSize: variantStyles.fontSize - 1 }]}>
              {item.description}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={sensors}
      renderItem={renderSensor}
      keyExtractor={(item, index) => item.id || index.toString()}
      numColumns={columns}
      contentContainerStyle={[styles.container, style]}
      showsVerticalScrollIndicator={false}
    />
  );
};

export const HealthMetricsGrid = ({ onSensorPress }) => {
  const metrics = [
    { id: 'heart', type: 'heart', label: 'Heart Rate', value: 72, unit: 'bpm', icon: 'heart', color: colors.heartRate, status: 'normal' },
    { id: 'spo2', type: 'spo2', label: 'SpO₂', value: 98, unit: '%', icon: 'fitness', color: colors.spO2Blue, status: 'normal' },
    { id: 'temp', type: 'temperature', label: 'Temperature', value: 36.6, unit: '°C', icon: 'thermometer', color: colors.tempOrange, status: 'normal' },
    { id: 'stress', type: 'stress', label: 'Stress', value: 45, icon: 'flash', color: colors.stressPurple, status: 'normal' },
    { id: 'sleep', type: 'sleep', label: 'Sleep', value: 7.2, unit: 'h', icon: 'moon', color: colors.sleepIndigo, status: 'normal' },
    { id: 'activity', type: 'activity', label: 'Activity', value: 5234, unit: 'steps', icon: 'walk', color: colors.primaryGreen, status: 'normal' },
  ];

  return (
    <SensorGrid
      sensors={metrics}
      onSensorPress={onSensorPress}
      columns={2}
      variant="card"
    />
  );
};

export const AlertSensorsGrid = ({ sensors, onSensorPress }) => (
  <SensorGrid
    sensors={sensors}
    onSensorPress={onSensorPress}
    columns={1}
    variant="detailed"
  />
);

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  sensorItem: {
    padding: 4,
  },
  sensorCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sensorLabel: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    color: colors.textSecondary,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  sensorValue: {
    fontFamily: 'Inter-Bold',
    marginRight: 2,
  },
  sensorUnit: {
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
    marginLeft: 2,
  },
  description: {
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
    marginTop: 4,
  },
});

export default SensorGrid;