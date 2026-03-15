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
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

const SleepDetail = () => {
  const navigation = useNavigation();

  const [selectedRange, setSelectedRange] = useState('week');
  const [sleepData, setSleepData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [7.2, 6.8, 7.5, 7.0, 7.8, 8.2, 7.5],
  });

  const stats = {
    average: 7.4,
    total: 52.0,
    best: 8.2,
    worst: 6.8,
    deepSleep: 2.5,
    lightSleep: 3.8,
    remSleep: 1.5,
    awake: 0.4,
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
      setSleepData({
        labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
        values: [7.2, 6.8, 7.5, 7.0, 7.8, 8.2, 7.5],
      });
    } else if (range === 'week') {
      setSleepData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [7.2, 6.8, 7.5, 7.0, 7.8, 8.2, 7.5],
      });
    } else if (range === 'month') {
      setSleepData({
        labels: ['W1', 'W2', 'W3', 'W4'],
        values: [7.2, 7.4, 7.1, 7.5],
      });
    } else {
      setSleepData({
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        values: [7.1, 7.3, 7.2, 7.4, 7.3, 7.2],
      });
    }
  };

  const getSleepQuality = (hours) => {
    if (hours >= 8) return { text: 'Excellent', color: colors.successGreen };
    if (hours >= 7) return { text: 'Good', color: colors.primaryGreen };
    if (hours >= 6) return { text: 'Fair', color: colors.warningYellow };
    return { text: 'Poor', color: colors.alertRed };
  };

  const sleepQuality = getSleepQuality(stats.average);

  const progressData = {
    labels: ["Deep", "Light", "REM", "Awake"],
    data: [stats.deepSleep/8, stats.lightSleep/8, stats.remSleep/8, stats.awake/8]
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
          <Text style={styles.headerTitle}>Sleep Details</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Current Sleep Card */}
        <LinearGradient
          colors={[colors.sleepIndigo, '#7B68EE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.currentCard}
        >
          <View style={styles.currentHeader}>
            <Text style={styles.currentLabel}>Average Sleep</Text>
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>{sleepQuality.text}</Text>
            </View>
          </View>
          
          <View style={styles.currentValueContainer}>
            <Text style={styles.currentValue}>{stats.average}</Text>
            <Text style={styles.currentUnit}>hours</Text>
          </View>

          <View style={styles.currentMeta}>
            <View style={styles.currentMetaItem}>
              <Text style={styles.currentMetaLabel}>Total this week</Text>
              <Text style={styles.currentMetaValue}>{stats.total} hrs</Text>
            </View>
            <View style={styles.currentMetaItem}>
              <Text style={styles.currentMetaLabel}>Best night</Text>
              <Text style={styles.currentMetaValue}>{stats.best} hrs</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Deep Sleep</Text>
            <Text style={[styles.statValue, { color: colors.sleepIndigo }]}>{stats.deepSleep}h</Text>
            <Text style={styles.statPercentage}>33%</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Light Sleep</Text>
            <Text style={[styles.statValue, { color: colors.stressPurple }]}>{stats.lightSleep}h</Text>
            <Text style={styles.statPercentage}>45%</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>REM Sleep</Text>
            <Text style={[styles.statValue, { color: colors.primarySaffron }]}>{stats.remSleep}h</Text>
            <Text style={styles.statPercentage}>20%</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Awake</Text>
            <Text style={[styles.statValue, { color: colors.alertRed }]}>{stats.awake}h</Text>
            <Text style={styles.statPercentage}>2%</Text>
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

        {/* Sleep Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Sleep Duration</Text>
          <LineChart
            data={{
              labels: sleepData.labels,
              datasets: [{
                data: sleepData.values,
              }]
            }}
            width={width - 70}
            height={200}
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(94, 75, 140, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '4', strokeWidth: '2', stroke: colors.sleepIndigo },
            }}
            bezier
            style={styles.chart}
            formatYLabel={(value) => `${value}h`}
          />
        </Card>

        {/* Sleep Stages */}
        <Card style={styles.stagesCard}>
          <Text style={styles.stagesTitle}>Sleep Stages</Text>
          
          <ProgressChart
            data={progressData}
            width={width - 70}
            height={180}
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              color: (opacity = 1, index) => {
                const colors = [colors.sleepIndigo, colors.stressPurple, colors.primarySaffron, colors.alertRed];
                return `rgba(${parseInt(colors[index % colors.length].slice(1,3), 16)}, ${parseInt(colors[index % colors.length].slice(3,5), 16)}, ${parseInt(colors[index % colors.length].slice(5,7), 16)}, ${opacity})`;
              },
            }}
            style={styles.stagesChart}
            hideLegend={false}
          />

          <View style={styles.stagesLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.sleepIndigo }]} />
              <Text style={styles.legendText}>Deep Sleep</Text>
              <Text style={styles.legendValue}>{stats.deepSleep}h</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.stressPurple }]} />
              <Text style={styles.legendText}>Light Sleep</Text>
              <Text style={styles.legendValue}>{stats.lightSleep}h</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primarySaffron }]} />
              <Text style={styles.legendText}>REM Sleep</Text>
              <Text style={styles.legendValue}>{stats.remSleep}h</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.alertRed }]} />
              <Text style={styles.legendText}>Awake</Text>
              <Text style={styles.legendValue}>{stats.awake}h</Text>
            </View>
          </View>
        </Card>

        {/* Sleep Schedule */}
        <Card style={styles.scheduleCard}>
          <Text style={styles.scheduleTitle}>Sleep Schedule</Text>
          
          <View style={styles.scheduleRow}>
            <View style={styles.scheduleItem}>
              <Ionicons name="moon" size={20} color={colors.sleepIndigo} />
              <Text style={styles.scheduleLabel}>Bedtime</Text>
              <Text style={styles.scheduleValue}>10:45 PM</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Ionicons name="sunny" size={20} color={colors.warningYellow} />
              <Text style={styles.scheduleLabel}>Wake up</Text>
              <Text style={styles.scheduleValue}>6:30 AM</Text>
            </View>
          </View>

          <View style={styles.scheduleRow}>
            <View style={styles.scheduleItem}>
              <Ionicons name="time" size={20} color={colors.primaryGreen} />
              <Text style={styles.scheduleLabel}>Time in bed</Text>
              <Text style={styles.scheduleValue}>7h 45m</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Ionicons name="alarm" size={20} color={colors.alertRed} />
              <Text style={styles.scheduleLabel}>Fell asleep</Text>
              <Text style={styles.scheduleValue}>20 min</Text>
            </View>
          </View>
        </Card>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Ionicons name="bulb" size={24} color={colors.warningYellow} />
            <Text style={styles.insightsTitle}>Sleep Insights</Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.insightText}>
              Your sleep duration is within the recommended range
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={18} color={colors.successGreen} />
            <Text style={styles.insightText}>
              Deep sleep has increased by 15% this week
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="time" size={18} color={colors.warningYellow} />
            <Text style={styles.insightText}>
              You fall asleep faster on weekends
            </Text>
          </View>
        </Card>

        {/* Recommendations */}
        <Card style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
          
          <View style={styles.recommendationItem}>
            <Ionicons name="moon" size={18} color={colors.sleepIndigo} />
            <Text style={styles.recommendationText}>
              Maintain consistent sleep schedule
            </Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <Ionicons name="phone-portrait" size={18} color={colors.alertRed} />
            <Text style={styles.recommendationText}>
              Avoid screens 1 hour before bed
            </Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <Ionicons name="cafe" size={18} color={colors.warningYellow} />
            <Text style={styles.recommendationText}>
              Limit caffeine after 4 PM
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Set Sleep Goal"
            onPress={() => {}}
            style={styles.goalButton}
            gradient
          />
          <Button
            title="Sleep Sounds"
            onPress={() => {}}
            style={styles.soundsButton}
            outline
            icon="musical-notes"
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
  currentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentMetaItem: {
    flex: 1,
  },
  currentMetaLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.7,
    marginBottom: 2,
  },
  currentMetaValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
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
    fontSize: 20,
    marginBottom: 2,
  },
  statPercentage: {
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
  stagesCard: {
    padding: 16,
    marginBottom: 16,
  },
  stagesTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  stagesChart: {
    borderRadius: 16,
  },
  stagesLegend: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  legendValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  scheduleCard: {
    padding: 16,
    marginBottom: 16,
  },
  scheduleTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  scheduleItem: {
    flex: 1,
    alignItems: 'center',
  },
  scheduleLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
    marginBottom: 2,
  },
  scheduleValue: {
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
  soundsButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default SleepDetail;