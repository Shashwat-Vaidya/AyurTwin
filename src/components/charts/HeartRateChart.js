import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../utils/constants/colors';

const { width } = Dimensions.get('window');

const HeartRateChart = ({
  data = [],
  currentBPM = 72,
  minBPM = 58,
  maxBPM = 82,
  avgBPM = 71,
  timeRange = '24h', // '6h', '12h', '24h', 'week'
  onDataPointPress,
}) => {
  // Default mock data if none provided
  const defaultData = [
    { x: '6h', y: 68 },
    { x: '12h', y: 72 },
    { x: '18h', y: 78 },
    { x: '24h', y: 65 },
  ];

  const chartData = data.length ? data : defaultData;

  // Format y-axis ticks
  const yTickValues = [40, 60, 80, 100, 120];

  return (
    <View style={styles.container}>
      {/* Header with current BPM and stats */}
      <View style={styles.header}>
        <View>
          <Text style={styles.currentLabel}>Current</Text>
          <Text style={styles.currentValue}>{currentBPM} <Text style={styles.unit}>bpm</Text></Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="arrow-down" size={14} color={colors.successGreen} />
            <Text style={styles.statValue}>{minBPM}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="remove" size={14} color={colors.textSecondary} />
            <Text style={styles.statValue}>{avgBPM}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="arrow-up" size={14} color={colors.alertRed} />
            <Text style={styles.statValue}>{maxBPM}</Text>
          </View>
        </View>
      </View>

      {/* Chart */}
      <VictoryChart
        width={width - 64}
        height={200}
        padding={{ top: 20, bottom: 30, left: 40, right: 20 }}
        containerComponent={
          <VictoryVoronoiContainer
            voronoiDimension="x"
            onActivated={(points) => {
              if (onDataPointPress) onDataPointPress(points[0]);
            }}
            labels={({ datum }) => `${datum.y} bpm`}
            labelComponent={
              <VictoryTooltip
                style={{ fill: 'white', fontSize: 10 }}
                flyoutStyle={{
                  fill: colors.primarySaffron,
                  stroke: 'white',
                  strokeWidth: 1,
                }}
              />
            }
          />
        }
      >
        {/* Gradient fill under line */}
        <VictoryLine
          data={chartData}
          style={{
            data: {
              stroke: colors.heartRate,
              strokeWidth: 3,
            },
          }}
          interpolation="natural"
        />
        {/* Scatter points */}
        <VictoryScatter
          data={chartData}
          size={5}
          style={{
            data: {
              fill: colors.heartRate,
              stroke: 'white',
              strokeWidth: 2,
            },
          }}
        />
        {/* Axes */}
        <VictoryAxis
          style={{
            axis: { stroke: colors.border },
            ticks: { stroke: colors.border, size: 5 },
            tickLabels: {
              fill: colors.textSecondary,
              fontSize: 10,
              fontFamily: 'Inter-Regular',
            },
          }}
          tickValues={chartData.map(d => d.x)}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: colors.border },
            ticks: { stroke: colors.border, size: 5 },
            tickLabels: {
              fill: colors.textSecondary,
              fontSize: 10,
              fontFamily: 'Inter-Regular',
            },
          }}
          tickValues={yTickValues}
        />
      </VictoryChart>

      {/* Time range indicator */}
      <View style={styles.timeRangeContainer}>
        {['6h', '12h', '18h', '24h'].map((range) => (
          <View
            key={range}
            style={[styles.timeRangeDot, timeRange === range && styles.timeRangeDotActive]}
          >
            <Text style={[styles.timeRangeText, timeRange === range && styles.timeRangeTextActive]}>
              {range}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBeige,
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  currentValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: colors.heartRate,
  },
  unit: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textTertiary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  statValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 2,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  timeRangeDot: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  timeRangeDotActive: {
    backgroundColor: colors.primarySaffron,
  },
  timeRangeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  timeRangeTextActive: {
    color: 'white',
  },
});

export default HeartRateChart;