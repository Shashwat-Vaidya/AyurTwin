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

const AlertHistoryScreen = () => {
  const navigation = useNavigation();

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'day', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'custom', label: 'Custom' },
  ];

  const alertHistory = [
    {
      id: '1',
      type: 'heart',
      title: 'Irregular Heart Rate Detected',
      message: 'Heart rate pattern showed irregularities for 5 minutes',
      time: '2024-03-15T10:30:00',
      severity: 'high',
      status: 'resolved',
      resolvedAt: '2024-03-15T11:45:00',
    },
    {
      id: '2',
      type: 'stress',
      title: 'High Stress Level',
      message: 'Stress levels remained elevated for 2 hours',
      time: '2024-03-15T09:15:00',
      severity: 'medium',
      status: 'resolved',
      resolvedAt: '2024-03-15T11:30:00',
    },
    {
      id: '3',
      type: 'device',
      title: 'Low Battery',
      message: 'Device battery below 15%',
      time: '2024-03-14T22:00:00',
      severity: 'info',
      status: 'resolved',
      resolvedAt: '2024-03-14T23:15:00',
    },
    {
      id: '4',
      type: 'sleep',
      title: 'Poor Sleep Quality',
      message: 'Sleep efficiency was below 70%',
      time: '2024-03-14T08:00:00',
      severity: 'low',
      status: 'resolved',
      resolvedAt: '2024-03-14T08:30:00',
    },
    {
      id: '5',
      type: 'heart',
      title: 'Heart Rate Spike',
      message: 'Heart rate increased rapidly during rest',
      time: '2024-03-13T15:45:00',
      severity: 'medium',
      status: 'resolved',
      resolvedAt: '2024-03-13T16:30:00',
    },
    {
      id: '6',
      type: 'dosha',
      title: 'Pitta Imbalance Detected',
      message: 'Pitta dosha elevated based on sensor readings',
      time: '2024-03-13T12:00:00',
      severity: 'low',
      status: 'resolved',
      resolvedAt: '2024-03-13T14:00:00',
    },
    {
      id: '7',
      type: 'activity',
      title: 'Inactivity Alert',
      message: 'No significant movement for 3 hours',
      time: '2024-03-12T14:30:00',
      severity: 'info',
      status: 'resolved',
      resolvedAt: '2024-03-12T15:00:00',
    },
    {
      id: '8',
      type: 'spo2',
      title: 'Low SpO₂ Reading',
      message: 'Blood oxygen level dropped to 92%',
      time: '2024-03-12T04:00:00',
      severity: 'high',
      status: 'resolved',
      resolvedAt: '2024-03-12T04:30:00',
    },
  ];

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical':
      case 'high': return colors.alertRed;
      case 'medium': return colors.warningYellow;
      case 'low': return colors.successGreen;
      case 'info': return colors.spO2Blue;
      default: return colors.textTertiary;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'heart': return 'heart';
      case 'stress': return 'flash';
      case 'dosha': return 'leaf';
      case 'device': return 'hardware-chip';
      case 'sleep': return 'moon';
      case 'activity': return 'walk';
      case 'spo2': return 'fitness';
      default: return 'notifications';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const groupAlertsByDate = () => {
    const grouped = {};
    alertHistory.forEach(alert => {
      const date = new Date(alert.time).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(alert);
    });
    return grouped;
  };

  const groupedAlerts = groupAlertsByDate();

  const renderAlertItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.alertItem}
      onPress={() => navigation.navigate(ROUTES.ALERT_DETAIL, { alert: item })}
    >
      <View style={[styles.alertIcon, { backgroundColor: `${getSeverityColor(item.severity)}20` }]}>
        <Ionicons name={getTypeIcon(item.type)} size={24} color={getSeverityColor(item.severity)} />
      </View>
      
      <View style={styles.alertContent}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertTitle} numberOfLines={1}>{item.title}</Text>
          <View style={[styles.severityBadge, { backgroundColor: `${getSeverityColor(item.severity)}20` }]}>
            <Text style={[styles.severityText, { color: getSeverityColor(item.severity) }]}>
              {item.severity.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.alertMessage} numberOfLines={1}>{item.message}</Text>
        
        <View style={styles.alertFooter}>
          <View style={styles.alertTime}>
            <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
            <Text style={styles.alertTimeText}>{formatTime(item.time)}</Text>
          </View>
          
          <View style={styles.alertStatus}>
            <Ionicons name="checkmark-circle" size={12} color={colors.successGreen} />
            <Text style={styles.alertStatusText}>Resolved</Text>
          </View>
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  const renderDateGroup = ({ item }) => {
    const date = new Date(item);
    const formattedDate = formatDate(item);
    
    return (
      <View style={styles.dateGroup}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.dateCount}>{groupedAlerts[item].length} alerts</Text>
        </View>
        
        <FlatList
          data={groupedAlerts[item]}
          renderItem={renderAlertItem}
          keyExtractor={(alert) => alert.id}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alert History</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={22} color={colors.primarySaffron} />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter.id && styles.filterTextActive,
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Total Alerts</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </Card>
      </View>

      {/* Alert List */}
      <FlatList
        data={Object.keys(groupedAlerts)}
        renderItem={renderDateGroup}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.alertList}
        showsVerticalScrollIndicator={false}
      />

      {/* Export Button */}
      <Button
        title="Export History"
        onPress={() => {}}
        style={styles.exportButton}
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
  filterButton: {
    padding: 8,
  },
  filterScroll: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterChip: {
    paddingHorizontal: 16,
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
  },
  filterTextActive: {
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  alertList: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  dateCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    flex: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginRight: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  severityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 9,
  },
  alertMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  alertFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  alertTimeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  alertStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertStatusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.successGreen,
    marginLeft: 4,
  },
  exportButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default AlertHistoryScreen;