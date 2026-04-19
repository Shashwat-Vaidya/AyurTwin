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
import TemperatureChart from '../../components/charts/TemperatureChart';

const { width } = Dimensions.get('window');

const TemperatureDetail = () => {
  const navigation = useNavigation();

  // State for time range
  const [selectedRange, setSelectedRange] = useState('day'); // 'day', 'week', 'month', 'year'
  const [temperatureData, setTemperatureData] = useState({
    labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
    values: [36.4, 36.2, 36.1, 36.5, 36.8, 36.6, 36.3],
  });

  // Stats
  const stats = {
    current: 36.6,
    min: 36.1,
    max: 36.8,
    avg: 36.4,
    baseline: 36.5,
  };

  // Time range options
  const ranges = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ];

  useEffect(() => {
    loadDataForRange(selectedRange);
  }, [selectedRange]);

  const loadDataForRange = (range) => {
    // Mock data - replace with actual API call
    if (range === 'day') {
      setTemperatureData({
        labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
        values: [36.4, 36.2, 36.1, 36.5, 36.8, 36.6, 36.3],
      });
    } else if (range === 'week') {
      setTemperatureData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [36.5, 36.4, 36.6, 36.3, 36.5, 36.4, 36.6],
      });
    } else if (range === 'month') {
      setTemperatureData({
        labels: ['W1', 'W2', 'W3', 'W4'],
        values: [36.4, 36.5, 36.4, 36.5],
      });
    } else {
      setTemperatureData({
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        values: [36.4, 36.5, 36.6, 36.5, 36.4, 36.5],
      });
    }
  };

  // Get status color based on temperature
  const getStatusColor = (value) => {
    if (value < 35.0) return colors.alertRed; // Hypothermia
    if (value > 38.0) return colors.alertRed; // Fever
    if (value < 36.0) return colors.warningYellow; // Below normal
    if (value > 37.5) return colors.warningYellow; // Slightly elevated
    return colors.successGreen; // Normal
  };

  const getStatusText = (value) => {
    if (value < 35.0) return 'Very Low';
    if (value > 38.0) return 'Very High';
    if (value < 36.0) return 'Low';
    if (value > 37.5) return 'Elevated';
    return 'Normal';
  };

  const getStatusMessage = (value) => {
    if (value < 35.0) return 'Seek medical attention';
    if (value > 38.0) return 'You may have a fever';
    if (value < 36.0) return 'Slightly below normal';
    if (value > 37.5) return 'Slightly elevated';
    return 'Within normal range';
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
          <Text style={styles.headerTitle}>Temperature Details</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Current Reading Card */}
        <Card style={styles.currentCard}>
          <LinearGradient
            colors={[colors.tempOrange, '#FFB347']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.currentGradient}
          >
            <View style={styles.currentHeader}>
              <Text style={styles.currentLabel}>Current Temperature</Text>
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Live</Text>
              </View>
            </View>
            
            <View style={styles.currentValueContainer}>
              <Text style={styles.currentValue}>{stats.current.toFixed(1)}</Text>
              <Text style={styles.currentUnit}>°C</Text>
            </View>

            <View style={styles.currentStatus}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(stats.current) }]} />
              <Text style={styles.statusText}>{getStatusText(stats.current)}</Text>
            </View>

            <Text style={styles.statusMessage}>{getStatusMessage(stats.current)}</Text>
          </LinearGradient>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Min</Text>
            <Text style={[styles.statValue, { color: colors.successGreen }]}>{stats.min.toFixed(1)}°</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Max</Text>
            <Text style={[styles.statValue, { color: colors.alertRed }]}>{stats.max.toFixed(1)}°</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Average</Text>
            <Text style={[styles.statValue, { color: colors.primarySaffron }]}>{stats.avg.toFixed(1)}°</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Baseline</Text>
            <Text style={[styles.statValue, { color: colors.tempOrange }]}>{stats.baseline.toFixed(1)}°</Text>
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

        {/* Temperature Chart */}
        <TemperatureChart
          data={temperatureData}
          timeRange={selectedRange}
          height={220}
        />

        {/* Normal Range Info */}
        <Card style={styles.rangeInfoCard}>
          <View style={styles.rangeInfoHeader}>
            <Ionicons name="information-circle" size={22} color={colors.spO2Blue} />
            <Text style={styles.rangeInfoTitle}>Normal Temperature Range</Text>
          </View>
          <Text style={styles.rangeInfoText}>
            Normal body temperature typically ranges from 36.1°C to 37.2°C (97°F to 99°F). 
            Your personal baseline may vary slightly.
          </Text>
          <View style={styles.rangeScale}>
            <View style={[styles.rangeScaleSegment, { backgroundColor: colors.alertRed }]} />
            <View style={[styles.rangeScaleSegment, { backgroundColor: colors.warningYellow }]} />
            <View style={[styles.rangeScaleSegment, { backgroundColor: colors.successGreen }]} />
            <View style={[styles.rangeScaleSegment, { backgroundColor: colors.warningYellow }]} />
            <View style={[styles.rangeScaleSegment, { backgroundColor: colors.alertRed }]} />
          </View>
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>35.0</Text>
            <Text style={styles.rangeLabel}>36.1</Text>
            <Text style={styles.rangeLabel}>37.2</Text>
            <Text style={styles.rangeLabel}>38.0</Text>
          </View>
        </Card>

        {/* Factors Affecting Temperature */}
        <Text style={styles.sectionTitle}>Factors Affecting Temperature</Text>
        
        <View style={styles.factorsGrid}>
          <Card style={styles.factorCard}>
            <Ionicons name="moon" size={24} color={colors.sleepIndigo} />
            <Text style={styles.factorTitle}>Time of Day</Text>
            <Text style={styles.factorText}>Lower in morning, higher in evening</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="fitness" size={24} color={colors.heartRate} />
            <Text style={styles.factorTitle}>Activity</Text>
            <Text style={styles.factorText}>Increases during/after exercise</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="woman" size={24} color={colors.stressPurple} />
            <Text style={styles.factorTitle}>Menstrual Cycle</Text>
            <Text style={styles.factorText}>Rises after ovulation</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="thermometer" size={24} color={colors.tempOrange} />
            <Text style={styles.factorTitle}>Environment</Text>
            <Text style={styles.factorText}>Affected by room temperature</Text>
          </Card>
        </View>

        {/* Fever Guide */}
        <Card style={styles.guideCard}>
          <Text style={styles.guideTitle}>Fever Guide</Text>
          
          <View style={styles.guideItem}>
            <View style={[styles.guideDot, { backgroundColor: colors.successGreen }]} />
            <View style={styles.guideContent}>
              <Text style={styles.guideTemp}>Below 37.5°C</Text>
              <Text style={styles.guideDesc}>Normal - No fever</Text>
            </View>
          </View>
          
          <View style={styles.guideItem}>
            <View style={[styles.guideDot, { backgroundColor: colors.warningYellow }]} />
            <View style={styles.guideContent}>
              <Text style={styles.guideTemp}>37.5°C - 38.0°C</Text>
              <Text style={styles.guideDesc}>Mild fever - Rest and hydrate</Text>
            </View>
          </View>
          
          <View style={styles.guideItem}>
            <View style={[styles.guideDot, { backgroundColor: colors.tempOrange }]} />
            <View style={styles.guideContent}>
              <Text style={styles.guideTemp}>38.1°C - 39.0°C</Text>
              <Text style={styles.guideDesc}>Moderate fever - Monitor closely</Text>
            </View>
          </View>
          
          <View style={styles.guideItem}>
            <View style={[styles.guideDot, { backgroundColor: colors.alertRed }]} />
            <View style={styles.guideContent}>
              <Text style={styles.guideTemp}>Above 39.0°C</Text>
              <Text style={styles.guideDesc}>High fever - Seek medical attention</Text>
            </View>
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
              Your temperature is within normal range
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-down" size={18} color={colors.spO2Blue} />
            <Text style={styles.insightText}>
              Your morning temperature is typically lower
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="repeat" size={18} color={colors.primaryGreen} />
            <Text style={styles.insightText}>
              Your temperature pattern is consistent
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

        {/* Note */}
        <Text style={styles.note}>
          Temperature readings from your AyurTwin wristband are for reference only. 
          Consult a healthcare provider for medical concerns.
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
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  statusMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'white',
    opacity: 0.8,
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
  rangeInfoCard: {
    padding: 16,
    marginVertical: 16,
  },
  rangeInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeInfoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  rangeInfoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  rangeScale: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  rangeScaleSegment: {
    flex: 1,
    height: '100%',
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  rangeLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  factorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  factorCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  factorTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  factorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  guideCard: {
    padding: 16,
    marginVertical: 16,
  },
  guideTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  guideDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  guideContent: {
    flex: 1,
  },
  guideTemp: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  guideDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
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
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
});

export default TemperatureDetail;