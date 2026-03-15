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

const HeartRateChart = ({
  data,
  timeRange = '24h',
  showStats = true,
  height = 200,
  width: chartWidth = width - 40,
  onDataPointClick,
}) => {
  // Default data if none provided
  const chartData = {
    labels: data?.labels || ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
    datasets: [{
      data: data?.values || [72, 68, 65, 70, 75, 80, 78],
      color: (opacity = 1) => `rgba(255, 77, 109, ${opacity})`,
      strokeWidth: 2,
    }],
    legend: ['Heart Rate'],
  };

  // Calculate stats
  const values = chartData.datasets[0].data;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  const chartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 77, 109, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.heartRate,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(0,0,0,0.03)',
    },
    formatYLabel: (yValue) => `${yValue} bpm`,
  };

  return (
    <View style={styles.container}>
      {showStats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="arrow-down" size={14} color={colors.successGreen} />
            <Text style={styles.statLabel}>Min</Text>
            <Text style={styles.statValue}>{min} bpm</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="remove" size={14} color={colors.warningYellow} />
            <Text style={styles.statLabel}>Avg</Text>
            <Text style={styles.statValue}>{avg} bpm</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="arrow-up" size={14} color={colors.alertRed} />
            <Text style={styles.statLabel}>Max</Text>
            <Text style={styles.statValue}>{max} bpm</Text>
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
        withVerticalLabels={true}
        withHorizontalLabels={true}
        onDataPointClick={onDataPointClick}
        formatXLabel={(xLabel) => xLabel}
      />

      <View style={styles.footer}>
        <Text style={styles.timeRange}>Last {timeRange}</Text>
        <View style={styles.legend}>
          <View style={[styles.legendDot, { backgroundColor: colors.heartRate }]} />
          <Text style={styles.legendText}>Heart Rate</Text>
        </View>
      </View>
    </View>
  );
};

// Preset variants
export const SmallHeartChart = (props) => (
  <HeartRateChart
    height={120}
    showStats={false}
    {...props}
  />
);

export const HeartRateDetailChart = (props) => (
  <HeartRateChart
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
    marginTop: 2,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 2,
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
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default HeartRateChart;