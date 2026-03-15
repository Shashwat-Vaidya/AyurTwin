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

const TemperatureChart = ({
  data,
  timeRange = '24h',
  showStats = true,
  height = 200,
  width: chartWidth = width - 40,
}) => {
  const chartData = {
    labels: data?.labels || ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
    datasets: [{
      data: data?.values || [36.4, 36.2, 36.1, 36.5, 36.8, 36.6, 36.3],
      color: (opacity = 1) => `rgba(255, 140, 66, ${opacity})`,
      strokeWidth: 2,
    }],
    legend: ['Temperature'],
  };

  const values = chartData.datasets[0].data;
  const min = Math.min(...values).toFixed(1);
  const max = Math.max(...values).toFixed(1);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);

  const chartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 140, 66, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.tempOrange,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(0,0,0,0.03)',
    },
    formatYLabel: (yValue) => `${yValue}°C`,
  };

  const getStatusColor = (value) => {
    if (value < 36.0) return colors.alertRed;
    if (value > 37.5) return colors.alertRed;
    return colors.successGreen;
  };

  return (
    <View style={styles.container}>
      {showStats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="arrow-down" size={14} color={colors.successGreen} />
            <Text style={styles.statLabel}>Min</Text>
            <Text style={styles.statValue}>{min}°C</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="remove" size={14} color={colors.warningYellow} />
            <Text style={styles.statLabel}>Avg</Text>
            <Text style={styles.statValue}>{avg}°C</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="arrow-up" size={14} color={colors.alertRed} />
            <Text style={styles.statLabel}>Max</Text>
            <Text style={styles.statValue}>{max}°C</Text>
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
        <Text style={styles.timeRange}>Last {timeRange}</Text>
        <View style={styles.normalRange}>
          <View style={[styles.rangeDot, { backgroundColor: colors.successGreen }]} />
          <Text style={styles.rangeText}>Normal 36.1-37.2°C</Text>
        </View>
      </View>
    </View>
  );
};

export const SmallTempChart = (props) => (
  <TemperatureChart height={120} showStats={false} {...props} />
);

export const TempDetailChart = (props) => (
  <TemperatureChart height={250} showStats={true} {...props} />
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
  normalRange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  rangeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
});

export default TemperatureChart;