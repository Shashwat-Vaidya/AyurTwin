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
import { LineChart, BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

const ActivityDetail = () => {
  const navigation = useNavigation();

  const [selectedRange, setSelectedRange] = useState('week');
  const [activityData, setActivityData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    steps: [5234, 6123, 4876, 7234, 6543, 8234, 4321],
    calories: [210, 245, 195, 289, 262, 329, 173],
    distance: [4.2, 4.9, 3.9, 5.8, 5.2, 6.6, 3.5],
  });

  const stats = {
    totalSteps: 42565,
    avgSteps: 6081,
    totalCalories: 1703,
    avgCalories: 243,
    totalDistance: 34.1,
    avgDistance: 4.9,
    activeMinutes: 245,
    goal: 8000,
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
      setActivityData({
        labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
        steps: [0, 0, 1200, 2500, 1800, 800, 0],
        calories: [0, 0, 48, 100, 72, 32, 0],
        distance: [0, 0, 1.0, 2.0, 1.4, 0.6, 0],
      });
    } else if (range === 'week') {
      setActivityData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        steps: [5234, 6123, 4876, 7234, 6543, 8234, 4321],
        calories: [210, 245, 195, 289, 262, 329, 173],
        distance: [4.2, 4.9, 3.9, 5.8, 5.2, 6.6, 3.5],
      });
    } else if (range === 'month') {
      setActivityData({
        labels: ['W1', 'W2', 'W3', 'W4'],
        steps: [42565, 38976, 45234, 41234],
        calories: [1703, 1559, 1809, 1649],
        distance: [34.1, 31.2, 36.2, 33.0],
      });
    } else {
      setActivityData({
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        steps: [165000, 172000, 168000, 175000, 170000, 168000],
        calories: [6600, 6880, 6720, 7000, 6800, 6720],
        distance: [132, 138, 134, 140, 136, 134],
      });
    }
  };

  const getGoalProgress = () => {
    return (stats.avgSteps / stats.goal) * 100;
  };

  const getProgressColor = () => {
    const progress = getGoalProgress();
    if (progress >= 100) return colors.successGreen;
    if (progress >= 70) return colors.primaryGreen;
    if (progress >= 50) return colors.warningYellow;
    return colors.alertRed;
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
          <Text style={styles.headerTitle}>Activity Details</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Current Activity Card */}
        <LinearGradient
          colors={[colors.primaryGreen, '#6AB04A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.currentCard}
        >
          <View style={styles.currentHeader}>
            <Text style={styles.currentLabel}>Today's Activity</Text>
            <View style={styles.currentBadge}>
              <Ionicons name="walk" size={16} color="white" />
              <Text style={styles.currentBadgeText}>In Progress</Text>
            </View>
          </View>
          
          <View style={styles.currentSteps}>
            <Text style={styles.currentValue}>{activityData.steps[activityData.steps.length - 1]}</Text>
            <Text style={styles.currentUnit}>steps</Text>
          </View>

          <View style={styles.goalProgress}>
            <View style={styles.goalBar}>
              <View 
                style={[
                  styles.goalFill,
                  { width: `${Math.min((activityData.steps[activityData.steps.length - 1] / stats.goal) * 100, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.goalText}>Goal: {stats.goal.toLocaleString()} steps</Text>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Ionicons name="flame" size={24} color={colors.tempOrange} />
            <Text style={styles.statValue}>{stats.totalCalories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Ionicons name="map" size={24} color={colors.spO2Blue} />
            <Text style={styles.statValue}>{stats.totalDistance}km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Ionicons name="time" size={24} color={colors.stressPurple} />
            <Text style={styles.statValue}>{stats.activeMinutes}</Text>
            <Text style={styles.statLabel}>Active Mins</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Ionicons name="speedometer" size={24} color={colors.heartRate} />
            <Text style={styles.statValue}>{stats.avgSteps}</Text>
            <Text style={styles.statLabel}>Daily Avg</Text>
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

        {/* Steps Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Daily Steps</Text>
          <BarChart
            data={{
              labels: activityData.labels,
              datasets: [{
                data: activityData.steps,
              }]
            }}
            width={width - 70}
            height={200}
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
              style: { borderRadius: 16 },
              barPercentage: 0.7,
            }}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            showValuesOnTopOfBars
          />
        </Card>

        {/* Calories & Distance */}
        <View style={styles.rowCharts}>
          <Card style={styles.smallChartCard}>
            <Text style={styles.smallChartTitle}>Calories</Text>
            <BarChart
              data={{
                labels: activityData.labels.slice(0, 4),
                datasets: [{
                  data: activityData.calories.slice(0, 4),
                }]
              }}
              width={width / 2 - 35}
              height={120}
              chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 140, 66, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
                style: { borderRadius: 16 },
                barPercentage: 0.7,
              }}
              style={styles.smallChart}
              withHorizontalLabels={false}
            />
          </Card>

          <Card style={styles.smallChartCard}>
            <Text style={styles.smallChartTitle}>Distance (km)</Text>
            <BarChart
              data={{
                labels: activityData.labels.slice(0, 4),
                datasets: [{
                  data: activityData.distance.slice(0, 4),
                }]
              }}
              width={width / 2 - 35}
              height={120}
              chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
                style: { borderRadius: 16 },
                barPercentage: 0.7,
              }}
              style={styles.smallChart}
              withHorizontalLabels={false}
            />
          </Card>
        </View>

        {/* Activity Breakdown */}
        <Card style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Activity Breakdown</Text>
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Ionicons name="walk" size={20} color={colors.primaryGreen} />
              <Text style={styles.breakdownLabel}>Walking</Text>
            </View>
            <Text style={styles.breakdownValue}>3.2 km</Text>
          </View>
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Ionicons name="fitness" size={20} color={colors.heartRate} />
              <Text style={styles.breakdownLabel}>Running</Text>
            </View>
            <Text style={styles.breakdownValue}>1.5 km</Text>
          </View>
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Ionicons name="bicycle" size={20} color={colors.spO2Blue} />
              <Text style={styles.breakdownLabel}>Cycling</Text>
            </View>
            <Text style={styles.breakdownValue}>0 km</Text>
          </View>
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Ionicons name="fitness" size={20} color={colors.stressPurple} />
              <Text style={styles.breakdownLabel}>Other</Text>
            </View>
            <Text style={styles.breakdownValue}>0.5 km</Text>
          </View>
        </Card>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Ionicons name="bulb" size={24} color={colors.warningYellow} />
            <Text style={styles.insightsTitle}>Activity Insights</Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={18} color={colors.successGreen} />
            <Text style={styles.insightText}>
              You're most active on Saturdays
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="time" size={18} color={colors.warningYellow} />
            <Text style={styles.insightText}>
              Peak activity between 4-6 PM
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="flash" size={18} color={colors.primaryGreen} />
            <Text style={styles.insightText}>
              Activity increased by 15% this week
            </Text>
          </View>
        </Card>

        {/* Recommendations */}
        <Card style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
          
          <View style={styles.recommendationItem}>
            <Ionicons name="add-circle" size={18} color={colors.primaryGreen} />
            <Text style={styles.recommendationText}>
              Try to reach 8,000 steps daily
            </Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <Ionicons name="timer" size={18} color={colors.primarySaffron} />
            <Text style={styles.recommendationText}>
              Add 30 mins of moderate activity
            </Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <Ionicons name="walk" size={18} color={colors.spO2Blue} />
            <Text style={styles.recommendationText}>
              Take short walking breaks every hour
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Set Activity Goal"
            onPress={() => {}}
            style={styles.goalButton}
            gradient
          />
          <Button
            title="View History"
            onPress={() => {}}
            style={styles.historyButton}
            outline
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  },
  currentSteps: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
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
  goalProgress: {
    marginTop: 8,
  },
  goalBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  goalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
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
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
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
  rowCharts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  smallChartCard: {
    width: '48%',
    padding: 12,
  },
  smallChartTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  smallChart: {
    borderRadius: 12,
  },
  breakdownCard: {
    padding: 16,
    marginBottom: 16,
  },
  breakdownTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 10,
  },
  breakdownValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
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
    marginBottom: 10,
  },
  recommendationText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  goalButton: {
    flex: 1,
    marginRight: 8,
  },
  historyButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default ActivityDetail;