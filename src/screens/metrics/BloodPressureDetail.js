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

const BloodPressureDetail = () => {
  const navigation = useNavigation();

  const [selectedRange, setSelectedRange] = useState('week');
  const [bpData, setBpData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    systolic: [120, 118, 122, 125, 121, 119, 118],
    diastolic: [80, 78, 82, 83, 81, 79, 78],
  });

  const stats = {
    currentSystolic: 118,
    currentDiastolic: 78,
    avgSystolic: 120,
    avgDiastolic: 80,
    maxSystolic: 125,
    minSystolic: 118,
    maxDiastolic: 83,
    minDiastolic: 78,
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
      setBpData({
        labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
        systolic: [118, 115, 120, 122, 121, 119, 118],
        diastolic: [78, 75, 80, 82, 81, 79, 78],
      });
    } else if (range === 'week') {
      setBpData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        systolic: [120, 118, 122, 125, 121, 119, 118],
        diastolic: [80, 78, 82, 83, 81, 79, 78],
      });
    } else if (range === 'month') {
      setBpData({
        labels: ['W1', 'W2', 'W3', 'W4'],
        systolic: [121, 120, 122, 119],
        diastolic: [81, 80, 82, 79],
      });
    } else {
      setBpData({
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        systolic: [121, 120, 122, 121, 120, 119],
        diastolic: [81, 80, 82, 81, 80, 79],
      });
    }
  };

  const getBPCategory = (systolic, diastolic) => {
    if (systolic < 90 || diastolic < 60) {
      return {
        category: 'Low',
        color: colors.spO2Blue,
        description: 'Your blood pressure is below normal range',
      };
    } else if (systolic < 120 && diastolic < 80) {
      return {
        category: 'Normal',
        color: colors.successGreen,
        description: 'Your blood pressure is within optimal range',
      };
    } else if (systolic < 130 && diastolic < 80) {
      return {
        category: 'Elevated',
        color: colors.warningYellow,
        description: 'Your blood pressure is slightly elevated',
      };
    } else if (systolic < 140 || diastolic < 90) {
      return {
        category: 'High - Stage 1',
        color: colors.tempOrange,
        description: 'You may have stage 1 hypertension',
      };
    } else if (systolic < 180 || diastolic < 120) {
      return {
        category: 'High - Stage 2',
        color: colors.alertRed,
        description: 'You may have stage 2 hypertension',
      };
    } else {
      return {
        category: 'Crisis',
        color: '#FF0000',
        description: 'Hypertensive crisis - seek immediate medical attention',
      };
    }
  };

  const currentCategory = getBPCategory(stats.currentSystolic, stats.currentDiastolic);

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
          <Text style={styles.headerTitle}>Blood Pressure</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Current Reading Card */}
        <LinearGradient
          colors={[currentCategory.color, `${currentCategory.color}CC`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.currentCard}
        >
          <View style={styles.currentHeader}>
            <Text style={styles.currentLabel}>Current Blood Pressure</Text>
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Live</Text>
            </View>
          </View>
          
          <View style={styles.currentValueContainer}>
            <Text style={styles.currentValue}>{stats.currentSystolic}</Text>
            <Text style={styles.currentSeparator}>/</Text>
            <Text style={styles.currentValue}>{stats.currentDiastolic}</Text>
            <Text style={styles.currentUnit}>mmHg</Text>
          </View>

          <View style={styles.currentCategory}>
            <Text style={styles.currentCategoryText}>{currentCategory.category}</Text>
          </View>
          
          <Text style={styles.currentDescription}>{currentCategory.description}</Text>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Systolic</Text>
            <Text style={[styles.statValue, { color: colors.heartRate }]}>
              {stats.currentSystolic}
            </Text>
            <Text style={styles.statUnit}>mmHg</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Diastolic</Text>
            <Text style={[styles.statValue, { color: colors.spO2Blue }]}>
              {stats.currentDiastolic}
            </Text>
            <Text style={styles.statUnit}>mmHg</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Pulse Pressure</Text>
            <Text style={[styles.statValue, { color: colors.stressPurple }]}>
              {stats.currentSystolic - stats.currentDiastolic}
            </Text>
            <Text style={styles.statUnit}>mmHg</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>MAP</Text>
            <Text style={[styles.statValue, { color: colors.primaryGreen }]}>
              {Math.round((stats.currentSystolic + 2 * stats.currentDiastolic) / 3)}
            </Text>
            <Text style={styles.statUnit}>mmHg</Text>
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

        {/* BP Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Blood Pressure Trend</Text>
          <LineChart
            data={{
              labels: bpData.labels,
              datasets: [
                {
                  data: bpData.systolic,
                  color: (opacity = 1) => `rgba(255, 77, 109, ${opacity})`,
                  strokeWidth: 2,
                },
                {
                  data: bpData.diastolic,
                  color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
              legend: ['Systolic', 'Diastolic'],
            }}
            width={width - 70}
            height={220}
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '4', strokeWidth: '2' },
            }}
            bezier
            style={styles.chart}
          />
        </Card>

        {/* BP Categories */}
        <Text style={styles.sectionTitle}>Blood Pressure Categories</Text>
        
        <Card style={styles.categoriesCard}>
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.successGreen }]} />
            <Text style={styles.categoryName}>Normal</Text>
            <Text style={styles.categoryRange}>&lt; 120/80</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.warningYellow }]} />
            <Text style={styles.categoryName}>Elevated</Text>
            <Text style={styles.categoryRange}>120-129/&lt;80</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.tempOrange }]} />
            <Text style={styles.categoryName}>Stage 1 HTN</Text>
            <Text style={styles.categoryRange}>130-139/80-89</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.alertRed }]} />
            <Text style={styles.categoryName}>Stage 2 HTN</Text>
            <Text style={styles.categoryRange}>140-179/90-119</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: '#FF0000' }]} />
            <Text style={styles.categoryName}>Crisis</Text>
            <Text style={styles.categoryRange}>≥180/≥120</Text>
          </View>
        </Card>

        {/* Factors Affecting BP */}
        <Text style={styles.sectionTitle}>Factors Affecting BP</Text>
        
        <View style={styles.factorsGrid}>
          <Card style={styles.factorCard}>
            <Ionicons name="cafe" size={24} color={colors.tempOrange} />
            <Text style={styles.factorTitle}>Caffeine</Text>
            <Text style={styles.factorText}>Can temporarily raise BP</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="fitness" size={24} color={colors.primaryGreen} />
            <Text style={styles.factorTitle}>Exercise</Text>
            <Text style={styles.factorText}>Lowers BP long-term</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="water" size={24} color={colors.spO2Blue} />
            <Text style={styles.factorTitle}>Salt Intake</Text>
            <Text style={styles.factorText}>High salt increases BP</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="flash" size={24} color={colors.stressPurple} />
            <Text style={styles.factorTitle}>Stress</Text>
            <Text style={styles.factorText}>Elevates BP temporarily</Text>
          </Card>
        </View>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Ionicons name="bulb" size={24} color={colors.warningYellow} />
            <Text style={styles.insightsTitle}>Insights</Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={18} color={colors.alertRed} />
            <Text style={styles.insightText}>
              BP tends to be higher in the afternoon
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.insightText}>
              Morning readings are consistently normal
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="time" size={18} color={colors.warningYellow} />
            <Text style={styles.insightText}>
              BP spikes after coffee consumption
            </Text>
          </View>
        </Card>

        {/* Recommendations */}
        <Card style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
          
          <View style={styles.recommendationItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.recommendationText}>
              Reduce sodium intake to less than 2,300mg per day
            </Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.recommendationText}>
              Exercise for at least 30 minutes daily
            </Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.recommendationText}>
              Limit alcohol and caffeine intake
            </Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.recommendationText}>
              Practice stress management techniques
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
  currentSeparator: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: 'white',
    marginHorizontal: 4,
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
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  categoriesCard: {
    padding: 16,
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  categoryRange: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
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
  recommendationsCard: {
    padding: 16,
    marginBottom: 20,
  },
  recommendationsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
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

export default BloodPressureDetail;