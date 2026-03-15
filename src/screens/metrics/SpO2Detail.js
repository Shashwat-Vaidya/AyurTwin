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

const { width } = Dimensions.get('window');

const SpO2Detail = () => {
  const navigation = useNavigation();

  // State for time range
  const [selectedRange, setSelectedRange] = useState('day'); // 'day', 'week', 'month', 'year'
  const [spo2Data, setSpO2Data] = useState({
    labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
    values: [98, 97, 96, 98, 99, 97, 98],
  });

  // Stats
  const stats = {
    current: 98,
    min: 95,
    max: 99,
    avg: 97,
    baseline: 98,
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
      setSpO2Data({
        labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
        values: [98, 97, 96, 98, 99, 97, 98],
      });
    } else if (range === 'week') {
      setSpO2Data({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [98, 97, 98, 96, 97, 98, 97],
      });
    } else if (range === 'month') {
      setSpO2Data({
        labels: ['W1', 'W2', 'W3', 'W4'],
        values: [97, 98, 97, 98],
      });
    } else {
      setSpO2Data({
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        values: [97, 98, 97, 98, 97, 98],
      });
    }
  };

  // Get status color based on SpO2
  const getStatusColor = (value) => {
    if (value < 90) return colors.alertRed;
    if (value < 95) return colors.warningYellow;
    return colors.successGreen;
  };

  const getStatusText = (value) => {
    if (value < 90) return 'Critical';
    if (value < 95) return 'Low';
    return 'Normal';
  };

  const getStatusMessage = (value) => {
    if (value < 90) return 'Seek medical attention immediately';
    if (value < 95) return 'Below normal range';
    return 'Within healthy range';
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
          <Text style={styles.headerTitle}>SpO₂ Details</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Current Reading Card */}
        <Card style={styles.currentCard}>
          <LinearGradient
            colors={[colors.spO2Blue, '#6AB0FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.currentGradient}
          >
            <View style={styles.currentHeader}>
              <Text style={styles.currentLabel}>Current SpO₂</Text>
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Live</Text>
              </View>
            </View>
            
            <View style={styles.currentValueContainer}>
              <Text style={styles.currentValue}>{stats.current}</Text>
              <Text style={styles.currentUnit}>%</Text>
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
            <Text style={styles.statLabel}>Minimum</Text>
            <Text style={[styles.statValue, { color: colors.alertRed }]}>{stats.min}%</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Maximum</Text>
            <Text style={[styles.statValue, { color: colors.successGreen }]}>{stats.max}%</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Average</Text>
            <Text style={[styles.statValue, { color: colors.primarySaffron }]}>{stats.avg}%</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Baseline</Text>
            <Text style={[styles.statValue, { color: colors.spO2Blue }]}>{stats.baseline}%</Text>
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

        {/* SpO2 Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>SpO₂ Trend</Text>
          <LineChart
            data={{
              labels: spo2Data.labels,
              datasets: [{
                data: spo2Data.values,
              }]
            }}
            width={width - 70}
            height={200}
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: colors.spO2Blue,
              },
            }}
            bezier
            style={styles.chart}
            formatYLabel={(value) => `${value}%`}
          />
          
          {/* Reference lines */}
          <View style={styles.referenceLines}>
            <View style={styles.referenceLine}>
              <View style={[styles.referenceDot, { backgroundColor: colors.successGreen }]} />
              <Text style={styles.referenceText}>Normal (95-100%)</Text>
            </View>
            <View style={styles.referenceLine}>
              <View style={[styles.referenceDot, { backgroundColor: colors.warningYellow }]} />
              <Text style={styles.referenceText}>Low (90-94%)</Text>
            </View>
            <View style={styles.referenceLine}>
              <View style={[styles.referenceDot, { backgroundColor: colors.alertRed }]} />
              <Text style={styles.referenceText}>Critical (&lt;90%)</Text>
            </View>
          </View>
        </Card>

        {/* What is SpO2 */}
        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={22} color={colors.spO2Blue} />
            <Text style={styles.infoTitle}>What is SpO₂?</Text>
          </View>
          <Text style={styles.infoText}>
            SpO₂ (Peripheral Capillary Oxygen Saturation) measures the percentage of oxygen 
            carried by hemoglobin in your blood. Normal levels are typically 95-100%.
          </Text>
        </Card>

        {/* Levels Guide */}
        <Text style={styles.sectionTitle}>Oxygen Level Guide</Text>
        
        <Card style={styles.guideCard}>
          <View style={styles.guideItem}>
            <View style={[styles.guideLevel, { backgroundColor: colors.successGreen }]}>
              <Text style={styles.guideLevelText}>95-100%</Text>
            </View>
            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>Normal</Text>
              <Text style={styles.guideDesc}>Healthy oxygen saturation</Text>
            </View>
          </View>
          
          <View style={styles.guideItem}>
            <View style={[styles.guideLevel, { backgroundColor: colors.warningYellow }]}>
              <Text style={styles.guideLevelText}>90-94%</Text>
            </View>
            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>Low</Text>
              <Text style={styles.guideDesc}>May indicate respiratory issues</Text>
            </View>
          </View>
          
          <View style={styles.guideItem}>
            <View style={[styles.guideLevel, { backgroundColor: colors.alertRed }]}>
              <Text style={styles.guideLevelText}>&lt;90%</Text>
            </View>
            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>Critical</Text>
              <Text style={styles.guideDesc}>Requires immediate medical attention</Text>
            </View>
          </View>
        </Card>

        {/* Factors Affecting SpO2 */}
        <Text style={styles.sectionTitle}>Factors Affecting SpO₂</Text>
        
        <View style={styles.factorsGrid}>
          <Card style={styles.factorCard}>
            <Ionicons name="respiration" size={24} color={colors.spO2Blue} />
            <Text style={styles.factorTitle}>Breathing Rate</Text>
            <Text style={styles.factorText}>Slow breathing can lower levels</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="trending-up" size={24} color={colors.heartRate} />
            <Text style={styles.factorTitle}>Altitude</Text>
            <Text style={styles.factorText}>Lower at high altitudes</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="fitness" size={24} color={colors.primaryGreen} />
            <Text style={styles.factorTitle}>Exercise</Text>
            <Text style={styles.factorText}>May temporarily decrease</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="moon" size={24} color={colors.sleepIndigo} />
            <Text style={styles.factorTitle}>Sleep</Text>
            <Text style={styles.factorText}>Can drop slightly during sleep</Text>
          </Card>
        </View>

        {/* Tips to Improve */}
        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={24} color={colors.warningYellow} />
            <Text style={styles.tipsTitle}>Tips to Maintain Healthy SpO₂</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.tipText}>Practice deep breathing exercises</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.tipText}>Stay physically active</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.tipText}>Avoid smoking and air pollution</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.tipText}>Maintain good posture for better breathing</Text>
          </View>
        </Card>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Ionicons name="analytics" size={22} color={colors.primarySaffron} />
            <Text style={styles.insightsTitle}>Your Insights</Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.insightText}>
              Your SpO₂ levels are consistently in the normal range
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-down" size={18} color={colors.spO2Blue} />
            <Text style={styles.insightText}>
              Slight dip detected during early morning hours
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="repeat" size={18} color={colors.primaryGreen} />
            <Text style={styles.insightText}>
              Your oxygen levels are stable throughout the day
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

        {/* Medical Disclaimer */}
        <Text style={styles.disclaimer}>
          This information is for reference only. Always consult a healthcare provider 
          for medical advice, especially if your SpO₂ drops below 95%.
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
  chartCard: {
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  referenceLines: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  referenceLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  referenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  referenceText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  guideCard: {
    padding: 16,
    marginBottom: 16,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  guideLevel: {
    width: 70,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  guideLevelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  guideDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
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
  tipsCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 179, 71, 0.05)',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  insightsCard: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
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
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
});

export default SpO2Detail;