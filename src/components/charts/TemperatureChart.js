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
  VictoryArea,
} from 'victory-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../utils/constants/colors';

const { width } = Dimensions.get('window');

const TemperatureChart = ({
  data = [],
  currentTemp = 36.6,
  minTemp = 36.2,
  maxTemp = 37.1,
  avgTemp = 36.7,
  timeRange = '24h', // '6h', '12h', '24h', 'week'
  onDataPointPress,
}) => {
  // Default mock data if none provided
  const defaultData = [
    { x: '6h', y: 36.4 },
    { x: '12h', y: 36.8 },
    { x: '18h', y: 37.0 },
    { x: '24h', y: 36.5 },
  ];

  const chartData = data.length ? data : defaultData;

  // Format y-axis ticks (temperature range 35-39)
  const yTickValues = [35, 36, 37, 38, 39];

  // Get temperature status
  const getTempStatus = (value) => {
    if (value < 36.1) return { label: 'Low', color: colors.spO2Blue };
    if (value <= 37.2) return { label: 'Normal', color: colors.successGreen };
    if (value <= 38.0) return { label: 'Elevated', color: colors.warningYellow };
    return { label: 'High', color: colors.alertRed };
  };

  const status = getTempStatus(currentTemp);

  return (
    <View style={styles.container}>
      {/* Header with current temperature and status */}
      <View style={styles.header}>
        <View>
          <Text style={styles.currentLabel}>Temperature</Text>
          <View style={styles.currentRow}>
            <Text style={[styles.currentValue, { color: status.color }]}>
              {currentTemp.toFixed(1)}
            </Text>
            <Text style={styles.unit}>°C</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
              <Text style={[styles.statusText, { color: status.color }]}>
                {status.label}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="arrow-down" size={14} color={colors.spO2Blue} />
            <Text style={styles.statValue}>{minTemp.toFixed(1)}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="remove" size={14} color={colors.textSecondary} />
            <Text style={styles.statValue}>{avgTemp.toFixed(1)}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="arrow-up" size={14} color={colors.tempOrange} />
            <Text style={styles.statValue}>{maxTemp.toFixed(1)}</Text>
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
            labels={({ datum }) => `${datum.y}°C`}
            labelComponent={
              <VictoryTooltip
                style={{ fill: 'white', fontSize: 10 }}
                flyoutStyle={{
                  fill: colors.tempOrange,
                  stroke: 'white',
                  strokeWidth: 1,
                }}
              />
            }
          />
        }
      >
        {/* Area fill for temperature range */}
        <VictoryArea
          data={chartData}
          style={{
            data: {
              fill: `${colors.tempOrange}20`,
              stroke: 'transparent',
            },
          }}
          interpolation="natural"
        />
        {/* Main line */}
        <VictoryLine
          data={chartData}
          style={{
            data: {
              stroke: colors.tempOrange,
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
              fill: colors.tempOrange,
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

      {/* Temperature zones legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.spO2Blue }]} />
          <Text style={styles.legendText}>Low (&lt;36.1°C)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.successGreen }]} />
          <Text style={styles.legendText}>Normal (36.1-37.2°C)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warningYellow }]} />
          <Text style={styles.legendText}>Elevated (37.3-38.0°C)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.alertRed }]} />
          <Text style={styles.legendText}>High (&gt;38.0°C)</Text>
        </View>
      </View>

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
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
  },
  unit: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textTertiary,
    marginLeft: 2,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
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
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    width: '48%',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textSecondary,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  timeRangeDot: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  timeRangeDotActive: {
    backgroundColor: colors.tempOrange,
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

export default TemperatureChart;