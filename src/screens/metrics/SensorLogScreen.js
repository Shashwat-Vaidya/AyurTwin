import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const SensorLogScreen = () => {
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSensor, setSelectedSensor] = useState('all');
  const [logView, setLogView] = useState('list'); // 'list' or 'grid'

  const sensors = [
    { id: 'all', name: 'All Sensors', icon: 'apps' },
    { id: 'heart', name: 'Heart Rate', icon: 'heart', color: colors.heartRate },
    { id: 'hrv', name: 'HRV', icon: 'pulse', color: colors.heartRate },
    { id: 'spo2', name: 'SpO₂', icon: 'fitness', color: colors.spO2Blue },
    { id: 'temp', name: 'Temperature', icon: 'thermometer', color: colors.tempOrange },
    { id: 'stress', name: 'Stress', icon: 'flash', color: colors.stressPurple },
    { id: 'activity', name: 'Activity', icon: 'walk', color: colors.primaryGreen },
    { id: 'sleep', name: 'Sleep', icon: 'moon', color: colors.sleepIndigo },
  ];

  const sensorLogs = [
    {
      id: '1',
      timestamp: '2024-03-15 14:30:00',
      sensors: {
        heart: 72,
        hrv: 45,
        spo2: 98,
        temp: 36.6,
        stress: 45,
        activity: 5234,
        sleep: 7.2,
      },
    },
    {
      id: '2',
      timestamp: '2024-03-15 14:15:00',
      sensors: {
        heart: 74,
        hrv: 46,
        spo2: 97,
        temp: 36.5,
        stress: 48,
        activity: 5123,
        sleep: 7.2,
      },
    },
    {
      id: '3',
      timestamp: '2024-03-15 14:00:00',
      sensors: {
        heart: 71,
        hrv: 44,
        spo2: 98,
        temp: 36.6,
        stress: 42,
        activity: 4987,
        sleep: 7.2,
      },
    },
    {
      id: '4',
      timestamp: '2024-03-15 13:45:00',
      sensors: {
        heart: 73,
        hrv: 47,
        spo2: 99,
        temp: 36.7,
        stress: 51,
        activity: 4765,
        sleep: 7.2,
      },
    },
    {
      id: '5',
      timestamp: '2024-03-15 13:30:00',
      sensors: {
        heart: 75,
        hrv: 48,
        spo2: 97,
        temp: 36.4,
        stress: 53,
        activity: 4523,
        sleep: 7.2,
      },
    },
  ];

  const getStatusColor = (type, value) => {
    if (type === 'heart') {
      if (value < 60 || value > 100) return colors.alertRed;
      return colors.successGreen;
    }
    if (type === 'spo2') {
      if (value < 95) return colors.alertRed;
      return colors.successGreen;
    }
    if (type === 'stress') {
      if (value > 70) return colors.alertRed;
      if (value > 50) return colors.warningYellow;
      return colors.successGreen;
    }
    if (type === 'temp') {
      if (value < 36 || value > 37.5) return colors.alertRed;
      return colors.successGreen;
    }
    return colors.successGreen;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredLogs = selectedSensor === 'all' 
    ? sensorLogs 
    : sensorLogs.map(log => ({
        ...log,
        sensors: { [selectedSensor]: log.sensors[selectedSensor] }
      }));

  const renderListItem = ({ item }) => (
    <TouchableOpacity style={styles.logListItem}>
      <View style={styles.logTimeContainer}>
        <Text style={styles.logTime}>{formatTime(item.timestamp)}</Text>
        <Text style={styles.logDate}>Today</Text>
      </View>
      
      <View style={styles.logValues}>
        {selectedSensor === 'all' ? (
          <>
            <View style={styles.logValueItem}>
              <Text style={styles.logValueLabel}>HR</Text>
              <Text style={[styles.logValue, { color: getStatusColor('heart', item.sensors.heart) }]}>
                {item.sensors.heart}
              </Text>
            </View>
            <View style={styles.logValueItem}>
              <Text style={styles.logValueLabel}>SpO₂</Text>
              <Text style={[styles.logValue, { color: getStatusColor('spo2', item.sensors.spo2) }]}>
                {item.sensors.spo2}%
              </Text>
            </View>
            <View style={styles.logValueItem}>
              <Text style={styles.logValueLabel}>Temp</Text>
              <Text style={[styles.logValue, { color: getStatusColor('temp', item.sensors.temp) }]}>
                {item.sensors.temp}°
              </Text>
            </View>
            <View style={styles.logValueItem}>
              <Text style={styles.logValueLabel}>Stress</Text>
              <Text style={[styles.logValue, { color: getStatusColor('stress', item.sensors.stress) }]}>
                {item.sensors.stress}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.logValueItem}>
            <Text style={styles.logValueLabel}>{selectedSensor}</Text>
            <Text style={[styles.logValueLarge, { color: getStatusColor(selectedSensor, item.sensors[selectedSensor]) }]}>
              {item.sensors[selectedSensor]}
              {selectedSensor === 'heart' ? ' bpm' : 
               selectedSensor === 'temp' ? '°C' : 
               selectedSensor === 'spo2' ? '%' : ''}
            </Text>
          </View>
        )}
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  const renderGridItem = ({ item }) => (
    <Card style={styles.logGridCard}>
      <Text style={styles.gridTime}>{formatTime(item.timestamp)}</Text>
      <View style={styles.gridValues}>
        {Object.entries(item.sensors).map(([key, value]) => (
          <View key={key} style={styles.gridValueRow}>
            <Text style={styles.gridValueLabel}>{key}:</Text>
            <Text style={[styles.gridValue, { color: getStatusColor(key, value) }]}>
              {value}
              {key === 'heart' ? ' bpm' : 
               key === 'temp' ? '°C' : 
               key === 'spo2' ? '%' : ''}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sensor Log</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.viewToggle}
            onPress={() => setLogView(logView === 'list' ? 'grid' : 'list')}
          >
            <Ionicons 
              name={logView === 'list' ? 'grid' : 'list'} 
              size={22} 
              color={colors.primarySaffron} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download" size={22} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sensor Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        {sensors.map((sensor) => (
          <TouchableOpacity
            key={sensor.id}
            style={[
              styles.filterChip,
              selectedSensor === sensor.id && styles.filterChipActive,
              selectedSensor === sensor.id && sensor.color && { backgroundColor: sensor.color }
            ]}
            onPress={() => setSelectedSensor(sensor.id)}
          >
            <Ionicons 
              name={sensor.icon} 
              size={16} 
              color={selectedSensor === sensor.id ? 'white' : sensor.color || colors.textSecondary} 
            />
            <Text style={[
              styles.filterText,
              selectedSensor === sensor.id && styles.filterTextActive
            ]}>
              {sensor.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Date Selector */}
      <View style={styles.dateContainer}>
        <TouchableOpacity style={styles.dateArrow}>
          <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <View style={styles.datePicker}>
          <Ionicons name="calendar" size={18} color={colors.primarySaffron} />
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.dateArrow}>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Log Count */}
      <View style={styles.logCount}>
        <Text style={styles.logCountText}>
          Showing {filteredLogs.length} readings
        </Text>
      </View>

      {/* Log List/Grid */}
      <FlatList
        data={filteredLogs}
        renderItem={logView === 'list' ? renderListItem : renderGridItem}
        keyExtractor={(item) => item.id}
        key={logView}
        numColumns={logView === 'grid' ? 2 : 1}
        contentContainerStyle={styles.logList}
        showsVerticalScrollIndicator={false}
      />

      {/* Export All Button */}
      <Button
        title="Export All Data"
        onPress={() => {}}
        style={styles.exportAllButton}
        outline
        icon="download"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  viewToggle: {
    padding: 8,
    marginRight: 8,
  },
  exportButton: {
    padding: 8,
  },
  filterScroll: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  filterChipActive: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  filterTextActive: {
    color: 'white',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  dateArrow: {
    padding: 8,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  logCount: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  logCountText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
  },
  logList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  logTimeContainer: {
    width: 70,
    marginRight: 12,
  },
  logTime: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  logDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  logValues: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  logValueItem: {
    alignItems: 'center',
  },
  logValueLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  logValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  logValueLarge: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  logGridCard: {
    flex: 1,
    margin: 4,
    padding: 12,
  },
  gridTime: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  gridValues: {
    marginTop: 4,
  },
  gridValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gridValueLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: 'capitalize',
  },
  gridValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.textPrimary,
  },
  exportAllButton: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default SensorLogScreen;