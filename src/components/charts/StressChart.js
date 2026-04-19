import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../utils/constants/colors';

const { width } = Dimensions.get('window');

const StressChart = ({
  data,
  timeRange = 'week',
  showStats = true,
  height = 200,
  width: chartWidth = width - 40,
}) => {
  // Default data if none provided
  const chartData = {
    labels: data?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: data?.values || [45, 52, 48, 55, 49, 47, 44],
      color: (opacity = 1) => `rgba(155, 107, 158, ${opacity})`,
      strokeWidth: 2,
    }],
    legend: ['Stress Level'],
  };

  // Calculate stats
  const values = chartData.datasets[0].data;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  // Determine stress level
  const getStressLevel = (level) => {
    if (avg <= 30) return { text: 'Low', color: colors.successGreen };
    if (avg <= 50) return { text: 'Moderate', color: colors.warningYellow };
    if (avg <= 70) return { text: 'High', color: colors.tempOrange };
    return { text: 'Severe', color: colors.alertRed };
  };

  const stressLevel = getStressLevel(avg);

  const chartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(155, 107, 158, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.stressPurple,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(0,0,0,0.03)',
    },
    formatYLabel: (yValue) => `${yValue}`,
  };

  return (
    <View style={styles.container}>
      {showStats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Average</Text>
            <Text style={[styles.statValue, { color: stressLevel.color }]}>{avg}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Level</Text>
            <View style={[styles.levelBadge, { backgroundColor: `${stressLevel.color}20` }]}>
              <Text style={[styles.levelText, { color: stressLevel.color }]}>
                {stressLevel.text}
              </Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Range</Text>
            <Text style={styles.statValue}>{min}-{max}</Text>
          </View>
        </View>
      )}

      <LineChart
        data={chartData}
        width={chartWidth}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
      />

      <View style={styles.footer}>
        <Text style={styles.timeRange}>
          {timeRange === 'day' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'}
        </Text>
        <View style={styles.zones}>
          <View style={styles.zoneItem}>
            <View style={[styles.zoneDot, { backgroundColor: colors.successGreen }]} />
            <Text style={styles.zoneText}>Low</Text>
          </View>
          <View style={styles.zoneItem}>
            <View style={[styles.zoneDot, { backgroundColor: colors.warningYellow }]} />
            <Text style={styles.zoneText}>Mod</Text>
          </View>
          <View style={styles.zoneItem}>
            <View style={[styles.zoneDot, { backgroundColor: colors.tempOrange }]} />
            <Text style={styles.zoneText}>High</Text>
          </View>
          <View style={styles.zoneItem}>
            <View style={[styles.zoneDot, { backgroundColor: colors.alertRed }]} />
            <Text style={styles.zoneText}>Sev</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Preset variants
export const SmallStressChart = (props) => (
  <StressChart
    height={120}
    showStats={false}
    {...props}
  />
);

export const StressDetailChart = (props) => (
  <StressChart
    height={250}
    showStats={true}
    {...props}
  />
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  levelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  timeRange: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  zones: {
    flexDirection: 'row',
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  zoneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  zoneText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
});

export default StressChart;