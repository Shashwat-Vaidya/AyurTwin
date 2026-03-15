import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import HeartRateChart from '../../components/charts/HeartRateChart';

const { width } = Dimensions.get('window');

const HeartRateDetail = () => {
  const navigation = useNavigation();

  // State for time range
  const [selectedRange, setSelectedRange] = useState('day'); // 'day', 'week', 'month', 'year'
  const [heartRateData, setHeartRateData] = useState({
    labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
    values: [72, 68, 65, 70, 75, 80, 78],
  });

  // Stats
  const stats = {
    current: 72,
    min: 58,
    max: 82,
    avg: 71,
    hrv: 45,
  };

  // Time range options
  const ranges = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ];

  // Load data based on selected range
  useEffect(() => {
    loadDataForRange(selectedRange);
  }, [selectedRange]);

  const loadDataForRange = (range) => {
    // Mock data - replace with actual API call
    if (range === 'day') {
      setHeartRateData({
        labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
        values: [72, 68, 65, 70, 75, 80, 78],
      });
    } else if (range === 'week') {
      setHeartRateData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [71, 73, 69, 72, 75, 78, 72],
      });
    } else if (range === 'month') {
      setHeartRateData({
        labels: ['W1', 'W2', 'W3', 'W4'],
        values: [72, 74, 71, 73],
      });
    } else {
      setHeartRateData({
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        values: [72, 73, 71, 74, 72, 73],
      });
    }
  };

  // Get status color based on heart rate
  const getStatusColor = (value) => {
    if (value < 60) return colors.alertRed;
    if (value > 100) return colors.alertRed;
    if (value < 50 || value > 110) return colors.warningYellow;
    return colors.successGreen;
  };

  const getStatusText = (value) => {
    if (value < 60) return 'Low';
    if (value > 100) return 'High';
    return 'Normal';
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Heart Rate Details</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Current Reading Card */}
        <Card style={styles.currentCard}>
          <LinearGradient
            colors={[colors.heartRate, '#FF8A5C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.currentGradient}
          >
            <View style={styles.currentHeader}>
              <Text style={styles.currentLabel}>Current Heart Rate</Text>
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Live</Text>
              </View>
            </View>
            
            <View style={styles.currentValueContainer}>
              <Text style={styles.currentValue}>{stats.current}</Text>
              <Text style={styles.currentUnit}>bpm</Text>
            </View>

            <View style={styles.currentStatus}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(stats.current) }]} />
              <Text style={styles.statusText}>
                {getStatusText(stats.current)}
              </Text>
            </View>
          </LinearGradient>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Min</Text>
            <Text style={[styles.statValue, { color: colors.successGreen }]}>{stats.min}</Text>
            <Text style={styles.statUnit}>bpm</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Max</Text>
            <Text style={[styles.statValue, { color: colors.alertRed }]}>{stats.max}</Text>
            <Text style={styles.statUnit}>bpm</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Avg</Text>
            <Text style={[styles.statValue, { color: colors.primarySaffron }]}>{stats.avg}</Text>
            <Text style={styles.statUnit}>bpm</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>HRV</Text>
            <Text style={[styles.statValue, { color: colors.stressPurple }]}>{stats.hrv}</Text>
            <Text style={styles.statUnit}>ms</Text>
          </Card>
        </View>

        {/* Time Range Selector */}
        <View style={styles.rangeContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {ranges.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.rangeTab,
                  selectedRange === range.id && styles.rangeTabActive,
                ]}
                onPress={() => setSelectedRange(range.id)}
              >
                <Text
                  style={[
                    styles.rangeText,
                    selectedRange === range.id && styles.rangeTextActive,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Heart Rate Chart */}
        <HeartRateChart
          data={heartRateData}
          timeRange={selectedRange}
          height={220}
        />

        {/* Additional Metrics */}
        <Text style={styles.sectionTitle}>Additional Metrics</Text>
        
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <Ionicons name="fitness" size={24} color={colors.heartRate} />
            <Text style={styles.metricLabel}>Resting HR</Text>
            <Text style={styles.metricValue}>68 bpm</Text>
          </Card>
          
          <Card style={styles.metricCard}>
            <Ionicons name="flash" size={24} color={colors.stressPurple} />
            <Text style={styles.metricLabel}>HR Variability</Text>
            <Text style={styles.metricValue}>45 ms</Text>
          </Card>
          
          <Card style={styles.metricCard}>
            <Ionicons name="heart-half" size={24} color={colors.tempOrange} />
            <Text style={styles.metricLabel}>Recovery Rate</Text>
            <Text style={styles.metricValue}>12 bpm</Text>
          </Card>
          
          <Card style={styles.metricCard}>
            <Ionicons name="time" size={24} color={colors.sleepIndigo} />
            <Text style={styles.metricLabel}>Zone Minutes</Text>
            <Text style={styles.metricValue}>32 min</Text>
          </Card>
        </View>

        {/* Heart Rate Zones */}
        <Text style={styles.sectionTitle}>Heart Rate Zones</Text>
        
        <Card style={styles.zonesCard}>
          <View style={styles.zoneItem}>
            <View style={[styles.zoneColor, { backgroundColor: '#4A90E2' }]} />
            <View style={styles.zoneContent}>
              <Text style={styles.zoneName}>Resting Zone</Text>
              <Text style={styles.zoneRange}>50-60 bpm</Text>
            </View>
            <Text style={styles.zoneTime}>2h 15m</Text>
          </View>
          
          <View style={styles.zoneItem}>
            <View style={[styles.zoneColor, { backgroundColor: colors.successGreen }]} />
            <View style={styles.zoneContent}>
              <Text style={styles.zoneName}>Fat Burn Zone</Text>
              <Text style={styles.zoneRange}>60-70 bpm</Text>
            </View>
            <Text style={styles.zoneTime}>1h 30m</Text>
          </View>
          
          <View style={styles.zoneItem}>
            <View style={[styles.zoneColor, { backgroundColor: colors.warningYellow }]} />
            <View style={styles.zoneContent}>
              <Text style={styles.zoneName}>Cardio Zone</Text>
              <Text style={styles.zoneRange}>70-80 bpm</Text>
            </View>
            <Text style={styles.zoneTime}>45m</Text>
          </View>
          
          <View style={styles.zoneItem}>
            <View style={[styles.zoneColor, { backgroundColor: colors.tempOrange }]} />
            <View style={styles.zoneContent}>
              <Text style={styles.zoneName}>Peak Zone</Text>
              <Text style={styles.zoneRange}>80-90 bpm</Text>
            </View>
            <Text style={styles.zoneTime}>15m</Text>
          </View>
        </Card>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Ionicons name="bulb" size={24} color={colors.warningYellow} />
            <Text style={styles.insightsTitle}>Insights</Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.insightText}>
              Your resting heart rate is in normal range
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={18} color={colors.warningYellow} />
            <Text style={styles.insightText}>
              Evening heart rate is slightly elevated. Try relaxing before bed.
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="heart" size={18} color={colors.heartRate} />
            <Text style={styles.insightText}>
              Your HRV is optimal for your age group
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Export Data"
            onPress={() => {}}
            style={styles.exportButton}
            outline
            icon="download-outline"
          />
          <Button
            title="Set Alert"
            onPress={() => {}}
            style={styles.alertButton}
            gradient
            icon="notifications-outline"
          />
        </View>

        {/* Historical Note */}
        <Text style={styles.note}>
          Data updated in real-time from your AyurTwin wristband
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  infoButton: {
    padding: 8,
  },
  currentCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  currentGradient: {
    padding: 20,
  },
  currentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  currentBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
  },
  currentValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: 'white',
  },
  currentUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: 'white',
    marginLeft: 8,
    opacity: 0.8,
  },
  currentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 2,
  },
  statUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  rangeContainer: {
    marginBottom: 16,
  },
  rangeTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  rangeTabActive: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  rangeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  rangeTextActive: {
    color: 'white',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 8,
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  zonesCard: {
    padding: 16,
    marginBottom: 20,
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoneColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  zoneContent: {
    flex: 1,
  },
  zoneName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  zoneRange: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  zoneTime: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  insightsCard: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 179, 71, 0.05)',
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  exportButton: {
    flex: 1,
    marginRight: 8,
  },
  alertButton: {
    flex: 1,
    marginLeft: 8,
  },
  note: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default HeartRateDetail;