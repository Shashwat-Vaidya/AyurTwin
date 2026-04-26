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

const RespiratoryRateDetail = () => {
  const navigation = useNavigation();

  const [selectedRange, setSelectedRange] = useState('week');
  const [respiratoryData, setRespiratoryData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [16, 15, 17, 16, 18, 15, 14],
  });

  const stats = {
    current: 16,
    min: 14,
    max: 18,
    avg: 16,
    resting: 14,
  };

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
    if (range === 'day') {
      setRespiratoryData({
        labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
        values: [14, 13, 16, 18, 17, 16, 14],
      });
    } else if (range === 'week') {
      setRespiratoryData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [16, 15, 17, 16, 18, 15, 14],
      });
    } else if (range === 'month') {
      setRespiratoryData({
        labels: ['W1', 'W2', 'W3', 'W4'],
        values: [16, 15, 16, 15],
      });
    } else {
      setRespiratoryData({
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        values: [16, 15, 16, 16, 15, 16],
      });
    }
  };

  const getRespiratoryCategory = (value) => {
    if (value < 12) {
      return {
        category: 'Low (Bradypnea)',
        color: colors.spO2Blue,
        description: 'Your respiratory rate is below normal range',
      };
    } else if (value <= 20) {
      return {
        category: 'Normal',
        color: colors.successGreen,
        description: 'Your respiratory rate is within normal range',
      };
    } else if (value <= 24) {
      return {
        category: 'Elevated',
        color: colors.warningYellow,
        description: 'Your respiratory rate is slightly elevated',
      };
    } else {
      return {
        category: 'High (Tachypnea)',
        color: colors.alertRed,
        description: 'Your respiratory rate is above normal range',
      };
    }
  };

  const respiratoryCategory = getRespiratoryCategory(stats.current);

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
            <Ionicons name="arrow-back"size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Respiratory Rate</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline"size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Current Reading Card */}
        <LinearGradient
          colors={[colors.spO2Blue, '#6AB0FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.currentCard}
        >
          <View style={styles.currentHeader}>
            <Text style={styles.currentLabel}>Current Respiratory Rate</Text>
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Live</Text>
            </View>
          </View>
          
          <View style={styles.currentValueContainer}>
            <Text style={styles.currentValue}>{stats.current}</Text>
            <Text style={styles.currentUnit}>breaths/min</Text>
          </View>

          <View style={styles.currentCategory}>
            <Text style={styles.currentCategoryText}>{respiratoryCategory.category}</Text>
          </View>
          
          <Text style={styles.currentDescription}>{respiratoryCategory.description}</Text>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Average</Text>
            <Text style={[styles.statValue, { color: colors.primarySaffron }]}>{stats.avg}</Text>
            <Text style={styles.statUnit}>breaths/min</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Minimum</Text>
            <Text style={[styles.statValue, { color: colors.successGreen }]}>{stats.min}</Text>
            <Text style={styles.statUnit}>breaths/min</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Maximum</Text>
            <Text style={[styles.statValue, { color: colors.alertRed }]}>{stats.max}</Text>
            <Text style={styles.statUnit}>breaths/min</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Resting</Text>
            <Text style={[styles.statValue, { color: colors.spO2Blue }]}>{stats.resting}</Text>
            <Text style={styles.statUnit}>breaths/min</Text>
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
                <Text style={[
                  styles.rangeText,
                  selectedRange === range.id && styles.rangeTextActive,
                ]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Respiratory Rate Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Respiratory Rate Trend</Text>
          <LineChart
            data={{
              labels: respiratoryData.labels,
              datasets: [{
                data: respiratoryData.values,
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
              style: { borderRadius: 16 },
              propsForDots: { r: '4', strokeWidth: '2', stroke: colors.spO2Blue },
            }}
            bezier
            style={styles.chart}
            formatYLabel={(value) => `${value} bpm`}
          />
        </Card>

        {/* Normal Range Info */}
        <Card style={styles.rangeInfoCard}>
          <View style={styles.rangeInfoHeader}>
            <Ionicons name="information-circle"size={22} color={colors.spO2Blue} />
            <Text style={styles.rangeInfoTitle}>Normal Respiratory Rate</Text>
          </View>
          <Text style={styles.rangeInfoText}>
            Normal respiratory rate for adults at rest is 12-20 breaths per minute. 
            Rates can vary based on age, activity level, and health conditions.
          </Text>
          
          <View style={styles.ageRanges}>
            <View style={styles.ageRangeItem}>
              <Text style={styles.ageRangeLabel}>Infant (0-1 yr)</Text>
              <Text style={styles.ageRangeValue}>30-60</Text>
            </View>
            <View style={styles.ageRangeItem}>
              <Text style={styles.ageRangeLabel}>Toddler (1-3 yrs)</Text>
              <Text style={styles.ageRangeValue}>24-40</Text>
            </View>
            <View style={styles.ageRangeItem}>
              <Text style={styles.ageRangeLabel}>Child (3-6 yrs)</Text>
              <Text style={styles.ageRangeValue}>22-34</Text>
            </View>
            <View style={styles.ageRangeItem}>
              <Text style={styles.ageRangeLabel}>Adolescent (12-18 yrs)</Text>
              <Text style={styles.ageRangeValue}>12-20</Text>
            </View>
            <View style={styles.ageRangeItem}>
              <Text style={styles.ageRangeLabel}>Adult</Text>
              <Text style={styles.ageRangeValue}>12-20</Text>
            </View>
          </View>
        </Card>

        {/* Factors Affecting Respiratory Rate */}
        <Text style={styles.sectionTitle}>Factors Affecting Respiratory Rate</Text>
        
        <View style={styles.factorsGrid}>
          <Card style={styles.factorCard}>
            <Ionicons name="fitness"size={24} color={colors.heartRate} />
            <Text style={styles.factorTitle}>Exercise</Text>
            <Text style={styles.factorText}>Increases during physical activity</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="moon"size={24} color={colors.sleepIndigo} />
            <Text style={styles.factorTitle}>Sleep</Text>
            <Text style={styles.factorText}>Decreases during deep sleep</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="flash"size={24} color={colors.stressPurple} />
            <Text style={styles.factorTitle}>Stress/Anxiety</Text>
            <Text style={styles.factorText}>Increases with stress</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="thermometer"size={24} color={colors.tempOrange} />
            <Text style={styles.factorTitle}>Fever</Text>
            <Text style={styles.factorText}>Increases with body temperature</Text>
          </Card>
        </View>

        {/* Breathing Exercises */}
        <Text style={styles.sectionTitle}>Breathing Exercises</Text>
        
        <Card style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Ionicons name="leaf"size={24} color={colors.primaryGreen} />
            <Text style={styles.exerciseTitle}>Diaphragmatic Breathing</Text>
          </View>
          <Text style={styles.exerciseDescription}>
            Breathe in deeply through your nose for 4 seconds, hold for 2 seconds, 
            and exhale slowly through your mouth for 6 seconds.
          </Text>
          <TouchableOpacity style={styles.exerciseButton}>
            <Text style={styles.exerciseButtonText}>Start Exercise</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Ionicons name="timer"size={24} color={colors.stressPurple} />
            <Text style={styles.exerciseTitle}>Box Breathing</Text>
          </View>
          <Text style={styles.exerciseDescription}>
            Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, 
            hold for 4 seconds. Repeat.
          </Text>
          <TouchableOpacity style={styles.exerciseButton}>
            <Text style={styles.exerciseButtonText}>Start Exercise</Text>
          </TouchableOpacity>
        </Card>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Ionicons name="bulb"size={24} color={colors.warningYellow} />
            <Text style={styles.insightsTitle}>Insights</Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="checkmark-circle"size={18} color={colors.successGreen} />
            <Text style={styles.insightText}>
              Your respiratory rate is within normal range
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-down"size={18} color={colors.spO2Blue} />
            <Text style={styles.insightText}>
              Rate decreases during sleep as expected
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-up"size={18} color={colors.warningYellow} />
            <Text style={styles.insightText}>
              Slight increase during afternoon hours
            </Text>
          </View>
        </Card>

        {/* When to Seek Help */}
        <Card style={styles.warningCard}>
          <Text style={styles.warningTitle}> When to Seek Help</Text>
          <Text style={styles.warningText}>
            Contact a healthcare provider if you experience:
          </Text>
          <View style={styles.warningItem}>
            <Ionicons name="alert-circle"size={16} color={colors.alertRed} />
            <Text style={styles.warningItemText}>Respiratory rate &lt; 8 or &gt; 24 at rest</Text>
          </View>
          <View style={styles.warningItem}>
            <Ionicons name="alert-circle"size={16} color={colors.alertRed} />
            <Text style={styles.warningItemText}>Shortness of breath</Text>
          </View>
          <View style={styles.warningItem}>
            <Ionicons name="alert-circle"size={16} color={colors.alertRed} />
            <Text style={styles.warningItemText}>Chest pain or tightness</Text>
          </View>
          <View style={styles.warningItem}>
            <Ionicons name="alert-circle"size={16} color={colors.alertRed} />
            <Text style={styles.warningItemText}>Blue lips or fingernails</Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Export Data"onPress={() => {}}
            style={styles.exportButton}
            outline
            icon="download-outline"
          />
          <Button
            title="Set Alert"onPress={() => {}}
            style={styles.alertButton}
            gradient
            icon="notifications-outline"
          />
        </View>
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
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
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
    marginBottom: 12,
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
  currentCategory: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  currentCategoryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  currentDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    lineHeight: 20,
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
    fontSize: 11,
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
  },
  rangeInfoCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
  },
  rangeInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeInfoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  rangeInfoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  ageRanges: {
    marginTop: 8,
  },
  ageRangeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ageRangeLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  ageRangeValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: colors.textPrimary,
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
    marginBottom: 16,
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
  exerciseCard: {
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  exerciseDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  exerciseButton: {
    backgroundColor: colors.primarySaffron,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  exerciseButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'white',
  },
  insightsCard: {
    padding: 16,
    marginBottom: 16,
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
  warningCard: {
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.alertRed,
    backgroundColor: 'rgba(255, 90, 95, 0.05)',
  },
  warningTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.alertRed,
    marginBottom: 8,
  },
  warningText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  warningItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  exportButton: {
    flex: 1,
    marginRight: 8,
  },
  alertButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default RespiratoryRateDetail;