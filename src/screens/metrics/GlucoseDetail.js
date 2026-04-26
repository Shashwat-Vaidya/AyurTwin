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

const GlucoseDetail = () => {
  const navigation = useNavigation();

  const [selectedRange, setSelectedRange] = useState('week');
  const [glucoseData, setGlucoseData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fasting: [95, 92, 98, 94, 96, 91, 93],
    postPrandial: [125, 130, 128, 132, 126, 124, 127],
  });

  const stats = {
    currentFasting: 93,
    currentPostPrandial: 127,
    avgFasting: 94,
    avgPostPrandial: 127,
    minFasting: 91,
    maxFasting: 98,
    minPostPrandial: 124,
    maxPostPrandial: 132,
    hba1c: 5.4,
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
      setGlucoseData({
        labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
        fasting: [92, 90, 95, 98, 96, 94, 93],
        postPrandial: [125, 120, 130, 135, 132, 128, 127],
      });
    } else if (range === 'week') {
      setGlucoseData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        fasting: [95, 92, 98, 94, 96, 91, 93],
        postPrandial: [125, 130, 128, 132, 126, 124, 127],
      });
    } else if (range === 'month') {
      setGlucoseData({
        labels: ['W1', 'W2', 'W3', 'W4'],
        fasting: [94, 95, 93, 94],
        postPrandial: [126, 128, 127, 126],
      });
    } else {
      setGlucoseData({
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        fasting: [94, 95, 94, 95, 94, 94],
        postPrandial: [126, 127, 126, 128, 127, 126],
      });
    }
  };

  const getGlucoseCategory = (fasting, postPrandial) => {
    if (fasting < 70) {
      return {
        category: 'Low (Hypoglycemia)',
        color: colors.spO2Blue,
        description: 'Your blood glucose is below normal range',
        recommendations: ['Consume fast-acting carbohydrates', 'Monitor closely', 'Consult doctor if persistent'],
      };
    } else if (fasting <= 100 && postPrandial <= 140) {
      return {
        category: 'Normal',
        color: colors.successGreen,
        description: 'Your blood glucose is within normal range',
        recommendations: ['Maintain healthy diet', 'Regular exercise', 'Continue monitoring'],
      };
    } else if (fasting <= 125 || postPrandial <= 199) {
      return {
        category: 'Prediabetes',
        color: colors.warningYellow,
        description: 'Your blood glucose is higher than normal',
        recommendations: ['Reduce sugar intake', 'Increase physical activity', 'Monitor regularly', 'Consult doctor'],
      };
    } else {
      return {
        category: 'Diabetes Range',
        color: colors.alertRed,
        description: 'Your blood glucose is in diabetes range',
        recommendations: ['Consult healthcare provider', 'Monitor blood sugar regularly', 'Follow prescribed treatment', 'Maintain healthy lifestyle'],
      };
    }
  };

  const glucoseCategory = getGlucoseCategory(stats.currentFasting, stats.currentPostPrandial);

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
          <Text style={styles.headerTitle}>Blood Glucose</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline"size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Current Reading Card */}
        <LinearGradient
          colors={[glucoseCategory.color, `${glucoseCategory.color}CC`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.currentCard}
        >
          <View style={styles.currentHeader}>
            <Text style={styles.currentLabel}>Current Glucose</Text>
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Latest</Text>
            </View>
          </View>
          
          <View style={styles.currentValueContainer}>
            <View style={styles.currentValueRow}>
              <Text style={styles.currentValueType}>Fasting</Text>
              <Text style={styles.currentValue}>{stats.currentFasting}</Text>
              <Text style={styles.currentUnit}>mg/dL</Text>
            </View>
            <View style={styles.currentValueRow}>
              <Text style={styles.currentValueType}>Post-meal</Text>
              <Text style={styles.currentValue}>{stats.currentPostPrandial}</Text>
              <Text style={styles.currentUnit}>mg/dL</Text>
            </View>
          </View>

          <View style={styles.currentCategory}>
            <Text style={styles.currentCategoryText}>{glucoseCategory.category}</Text>
          </View>
          
          <Text style={styles.currentDescription}>{glucoseCategory.description}</Text>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Avg Fasting</Text>
            <Text style={[styles.statValue, { color: colors.primarySaffron }]}>{stats.avgFasting}</Text>
            <Text style={styles.statUnit}>mg/dL</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Avg Post-meal</Text>
            <Text style={[styles.statValue, { color: colors.tempOrange }]}>{stats.avgPostPrandial}</Text>
            <Text style={styles.statUnit}>mg/dL</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>HbA1c</Text>
            <Text style={[styles.statValue, { color: colors.heartRate }]}>{stats.hba1c}</Text>
            <Text style={styles.statUnit}>%</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Range</Text>
            <Text style={[styles.statValue, { color: colors.successGreen }]}>
              {stats.minFasting}-{stats.maxFasting}
            </Text>
            <Text style={styles.statUnit}>mg/dL</Text>
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

        {/* Glucose Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Glucose Trends</Text>
          <LineChart
            data={{
              labels: glucoseData.labels,
              datasets: [
                {
                  data: glucoseData.fasting,
                  color: (opacity = 1) => `rgba(255, 153, 51, ${opacity})`,
                  strokeWidth: 2,
                },
                {
                  data: glucoseData.postPrandial,
                  color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
              legend: ['Fasting', 'Post-meal'],
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

        {/* Glucose Categories */}
        <Text style={styles.sectionTitle}>Glucose Categories</Text>
        
        <Card style={styles.categoriesCard}>
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.spO2Blue }]} />
            <Text style={styles.categoryName}>Low</Text>
            <Text style={styles.categoryRange}>&lt; 70 mg/dL</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.successGreen }]} />
            <Text style={styles.categoryName}>Normal Fasting</Text>
            <Text style={styles.categoryRange}>70-100 mg/dL</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.successGreen }]} />
            <Text style={styles.categoryName}>Normal Post-meal</Text>
            <Text style={styles.categoryRange}>&lt; 140 mg/dL</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.warningYellow }]} />
            <Text style={styles.categoryName}>Prediabetes Fasting</Text>
            <Text style={styles.categoryRange}>100-125 mg/dL</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.warningYellow }]} />
            <Text style={styles.categoryName}>Prediabetes Post-meal</Text>
            <Text style={styles.categoryRange}>140-199 mg/dL</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.alertRed }]} />
            <Text style={styles.categoryName}>Diabetes Fasting</Text>
            <Text style={styles.categoryRange}>≥ 126 mg/dL</Text>
          </View>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: colors.alertRed }]} />
            <Text style={styles.categoryName}>Diabetes Post-meal</Text>
            <Text style={styles.categoryRange}>≥ 200 mg/dL</Text>
          </View>
        </Card>

        {/* HbA1c Information */}
        <Card style={styles.hba1cCard}>
          <Text style={styles.hba1cTitle}>HbA1c Interpretation</Text>
          
          <View style={styles.hba1cRow}>
            <Text style={styles.hba1cLabel}>Your HbA1c</Text>
            <Text style={[styles.hba1cValue, { color: stats.hba1c < 5.7 ? colors.successGreen : stats.hba1c < 6.5 ? colors.warningYellow : colors.alertRed }]}>
              {stats.hba1c}%
            </Text>
          </View>
          
          <View style={styles.hba1cRow}>
            <Text style={styles.hba1cLabel}>Normal</Text>
            <Text style={styles.hba1cRange}>&lt; 5.7%</Text>
          </View>
          
          <View style={styles.hba1cRow}>
            <Text style={styles.hba1cLabel}>Prediabetes</Text>
            <Text style={styles.hba1cRange}>5.7% - 6.4%</Text>
          </View>
          
          <View style={styles.hba1cRow}>
            <Text style={styles.hba1cLabel}>Diabetes</Text>
            <Text style={styles.hba1cRange}>≥ 6.5%</Text>
          </View>
          
          <Text style={styles.hba1cNote}>
            HbA1c reflects average blood glucose over the past 2-3 months
          </Text>
        </Card>

        {/* Factors Affecting Glucose */}
        <Text style={styles.sectionTitle}>Factors Affecting Glucose</Text>
        
        <View style={styles.factorsGrid}>
          <Card style={styles.factorCard}>
            <Ionicons name="restaurant"size={24} color={colors.tempOrange} />
            <Text style={styles.factorTitle}>Diet</Text>
            <Text style={styles.factorText}>Carbohydrates increase glucose</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="fitness"size={24} color={colors.primaryGreen} />
            <Text style={styles.factorTitle}>Exercise</Text>
            <Text style={styles.factorText}>Lowers glucose levels</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="flash"size={24} color={colors.stressPurple} />
            <Text style={styles.factorTitle}>Stress</Text>
            <Text style={styles.factorText}>Can increase glucose</Text>
          </Card>
          
          <Card style={styles.factorCard}>
            <Ionicons name="medkit"size={24} color={colors.alertRed} />
            <Text style={styles.factorTitle}>Medications</Text>
            <Text style={styles.factorText}>Can affect glucose levels</Text>
          </Card>
        </View>

        {/* Meal Timing Tips */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}> Meal Timing Tips</Text>
          
          <View style={styles.tipItem}>
            <Ionicons name="time"size={18} color={colors.primarySaffron} />
            <Text style={styles.tipText}>Test fasting glucose first thing in morning</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="time"size={18} color={colors.primarySaffron} />
            <Text style={styles.tipText}>Post-meal test 2 hours after eating</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="restaurant"size={18} color={colors.primarySaffron} />
            <Text style={styles.tipText}>Eat meals at consistent times daily</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="water"size={18} color={colors.primarySaffron} />
            <Text style={styles.tipText}>Stay hydrated throughout the day</Text>
          </View>
        </Card>

        {/* Recommendations */}
        <Card style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
          
          {glucoseCategory.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons name="checkmark-circle"size={18} color={colors.successGreen} />
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
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
    marginBottom: 12,
  },
  currentValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentValueType: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    width: 80,
  },
  currentValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: 'white',
    marginHorizontal: 8,
  },
  currentUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
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
    marginBottom: 8,
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
  hba1cCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
  },
  hba1cTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  hba1cRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hba1cLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  hba1cValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  hba1cRange: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  hba1cNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 8,
    fontStyle: 'italic',
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
  tipsCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  tipsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
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

export default GlucoseDetail;