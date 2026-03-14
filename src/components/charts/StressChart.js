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

const StressChart = ({
  data = [],
  currentStress = 45,
  minStress = 20,
  maxStress = 78,
  avgStress = 48,
  timeRange = '24h', // '6h', '12h', '24h', 'week'
  onDataPointPress,
}) => {
  // Default mock data if none provided
  const defaultData = [
    { x: '6h', y: 35 },
    { x: '12h', y: 48 },
    { x: '18h', y: 62 },
    { x: '24h', y: 41 },
  ];

  const chartData = data.length ? data : defaultData;

  // Format y-axis ticks (stress 0-100)
  const yTickValues = [0, 25, 50, 75, 100];

  // Get stress level description
  const getStressLevel = (value) => {
    if (value < 30) return 'Low';
    if (value < 60) return 'Moderate';
    if (value < 80) return 'High';
    return 'Severe';
  };

  const stressLevel = getStressLevel(currentStress);
  const stressColor = 
    stressLevel === 'Low' ? colors.successGreen :
    stressLevel === 'Moderate' ? colors.warningYellow :
    stressLevel === 'High' ? colors.tempOrange : colors.alertRed;

  return (
    <View style={styles.container}>
      {/* Header with current stress and level */}
      <View style={styles.header}>
        <View>
          <Text style={styles.currentLabel}>Current Stress</Text>
          <View style={styles.currentRow}>
            <Text style={[styles.currentValue, { color: stressColor }]}>
              {currentStress}
            </Text>
            <View style={[styles.levelBadge, { backgroundColor: `${stressColor}20` }]}>
              <Text style={[styles.levelText, { color: stressColor }]}>
                {stressLevel}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="arrow-down" size={14} color={colors.successGreen} />
            <Text style={styles.statValue}>{minStress}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="remove" size={14} color={colors.textSecondary} />
            <Text style={styles.statValue}>{avgStress}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="arrow-up" size={14} color={colors.alertRed} />
            <Text style={styles.statValue}>{maxStress}</Text>
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
            labels={({ datum }) => `Stress: ${datum.y}`}
            labelComponent={
              <VictoryTooltip
                style={{ fill: 'white', fontSize: 10 }}
                flyoutStyle={{
                  fill: colors.stressPurple,
                  stroke: 'white',
                  strokeWidth: 1,
                }}
              />
            }
          />
        }
      >
        {/* Area fill for better visualization */}
        <VictoryArea
          data={chartData}
          style={{
            data: {
              fill: `${colors.stressPurple}30`,
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
              stroke: colors.stressPurple,
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
              fill: colors.stressPurple,
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

      {/* Stress zones legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.successGreen }]} />
          <Text style={styles.legendText}>Low (0-30)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warningYellow }]} />
          <Text style={styles.legendText}>Moderate (31-60)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.tempOrange }]} />
          <Text style={styles.legendText}>High (61-80)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.alertRed }]} />
          <Text style={styles.legendText}>Severe (81+)</Text>
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
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
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
    backgroundColor: colors.stressPurple,
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

export default StressChart;