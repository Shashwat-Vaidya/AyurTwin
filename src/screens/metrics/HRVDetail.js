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

const HRVDetail = () => {
  const navigation = useNavigation();

  const [selectedRange, setSelectedRange] = useState('week');
  const [hrvData, setHrvData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    rmssd: [45, 42, 48, 44, 46, 43, 47],
    sdnn: [52, 48, 55, 50, 53, 49, 54],
  });

  const stats = {
    currentRMSSD: 47,
    currentSDNN: 54,
    avgRMSSD: 45,
    avgSDNN: 52,
    maxRMSSD: 48,
    minRMSSD: 42,
    maxSDNN: 55,
    minSDNN: 48,
    hrvScore: 72,
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
      setHrvData({
        labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
        rmssd: [42, 45, 48, 44, 43, 41, 40],
        sdnn: [48, 52, 55, 50, 49, 47, 46],
      });
    } else if (range === 'week') {
      setHrvData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        rmssd: [45, 42, 48, 44, 46, 43, 47],
        sdnn: [52, 48, 55, 50, 53, 49, 54],
      });
    } else if (range === 'month') {
      setHrvData({
        labels: ['W1', 'W2', 'W3', 'W4'],
        rmssd: [44, 45, 46, 45],
        sdnn: [50, 52, 53, 51],
      });
    } else {
      setHrvData({
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        rmssd: [44, 45, 46, 45, 44, 45],
        sdnn: [50, 52, 53, 52, 51, 52],
      });
    }
  };

  const getHRVCategory = (value) => {
    if (value < 30) {
      return {
        category: 'Poor',
        color: colors.alertRed,
        description: 'Your HRV is low, indicating high stress or fatigue',
      };
    } else if (value < 45) {
      return {
        category: 'Fair',
        color: colors.warningYellow,
        description: 'Your HRV is below average. Consider stress management',
      };
    } else if (value < 60) {
      return {
        category: 'Good',
        color: colors.successGreen,
        description: 'Your HRV is in a healthy range',
      };
    } else {
      return {
        category: 'Excellent',
        color: colors.primaryGreen,
        description: 'Your HRV is excellent, indicating good recovery',
      };
    }
  };

  const hrvCategory = getHRVCategory(stats.currentRMSSD);

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
          <Text style={styles.headerTitle}>Heart Rate Variability</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Current Reading Card */}
        <LinearGradient
          colors={[colors.stressPurple, '#B78CB9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.currentCard}
        >
          <View style={styles.currentHeader}>
            <Text style={styles.currentLabel}>Current HRV (RMSSD)</Text>
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Live</Text>
            </View>
          </View>
          
          <View style={styles.currentValueContainer}>
            <Text style={styles.currentValue}>{stats.currentRMSSD}</Text>
            <Text style={styles.currentUnit}>ms</Text>
          </View>

          <View style={styles.currentCategory}>
            <Text style={styles.currentCategoryText}>{hrvCategory.category}</Text>
          </View>
          
          <Text style={styles.currentDescription}>{hrvCategory.description}</Text>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>RMSSD</Text>
            <Text style={[styles.statValue, { color: colors.stressPurple }]}>
              {stats.currentRMSSD}
            </Text>
            <Text style={styles.statUnit}>ms</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>SDNN</Text>
            <Text style={[styles.statValue, { color: colors.spO2Blue }]}>
              {stats.currentSDNN}
            </Text>
            <Text style={styles.statUnit}>ms</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>HRV Score</Text>
            <Text style={[styles.statValue, { color: colors.primaryGreen }]}>
              {stats.hrvScore}
            </Text>
            <Text style={styles.statUnit}>/100</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Recovery</Text>
            <Text style={[styles.statValue, { color: colors.successGreen }]}>
              Good
            </Text>
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

        {/* HRV Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>HRV Trend</Text>
          <LineChart
            data={{
              labels: hrvData.labels,
              datasets: [
                {
                  data: hrvData.rmssd,
                  color: (opacity = 1) => `rgba(155, 107, 158, ${opacity})`,
                  strokeWidth: 2,
                },
                {
                  data: hrvData.sdnn,
                  color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
              legend: ['RMSSD', 'SDNN'],
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

        {/* HRV Categories */}
        <Text style={styles.sectionTitle}>HRV Categories</Text>
        
        <Card style={styles.categoriesCard}>
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.alertRed }]} />
            <Text style={styles.categoryName}>Poor</Text>
            <Text style={styles.categoryRange}>&lt; 30 ms</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.warningYellow }]} />
            <Text style={styles.categoryName}>Fair</Text>
            <Text style={styles.categoryRange}>30 - 44 ms</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.successGreen }]} />
            <Text style={styles.categoryName}>Good</Text>
            <Text style={styles.categoryRange}>45 - 59 ms</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.primaryGreen }]} />
            <Text style={styles.categoryName}>Excellent</Text>
            <Text style={styles.categoryRange}>≥ 60 ms</Text>
          </View>
        </Card>

        {/* Factors Affecting HRV */}
        <Text style={styles.sectionTitle}>Factors Affecting HRV</Text>
        
        <View style={styles.factorsGrid}>
          <Card style={styles.factorCard}>
            <Ionicons name="moon" size={24} color={colors.sleepIndigo} />
            <Text style={styles.factorTitle}>Sleep Quality</Text>
            <Text style={styles.factorText}>Better sleep = higher HRV</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="flash" size={24} color={colors.stressPurple} />
            <Text style={styles.factorTitle}>Stress</Text>
            <Text style={styles.factorText}>Stress lowers HRV</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="fitness" size={24} color={colors.primaryGreen} />
            <Text style={styles.factorTitle}>Exercise</Text>
            <Text style={styles.factorText}>Regular exercise improves HRV</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="wine" size={24} color={colors.alertRed} />
            <Text style={styles.factorTitle}>Alcohol</Text>
            <Text style={styles.factorText}>Alcohol decreases HRV</Text>
          </Card>
        </View>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Ionicons name="bulb" size={24} color={colors.warningYellow} />
            <Text style={styles.insightsTitle}>HRV Insights</Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={18} color={colors.successGreen} />
            <Text style={styles.insightText}>
              Your HRV is improving with regular exercise
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-down" size={18} color={colors.alertRed} />
            <Text style={styles.insightText}>
              HRV drops on high-stress days
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="moon" size={18} color={colors.sleepIndigo} />
            <Text style={styles.insightText}>
              Better sleep quality correlates with higher HRV
            </Text>
          </View>
        </Card>

        {/* Recommendations */}
        <Card style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>To Improve HRV</Text>
          
          <View style={styles.recommendationItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.recommendationText}>
              Maintain consistent sleep schedule
            </Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.recommendationText}>
              Practice deep breathing exercises
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
              Regular moderate exercise
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

export default HRVDetail;