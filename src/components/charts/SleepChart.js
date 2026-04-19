import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LineChart, ProgressChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../utils/constants/colors';

const { width } = Dimensions.get('window');

const SleepChart = ({
  data,
  timeRange = 'week',
  showStats = true,
  height = 200,
  width: chartWidth = width - 40,
  chartType = 'line', // 'line', 'bar', 'progress'
  showStages = true,
}) => {
  
  const defaultData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    duration: [7.2, 6.8, 7.5, 7.0, 7.8, 8.2, 7.5],
    deep: [2.5, 2.3, 2.6, 2.4, 2.7, 2.9, 2.5],
    rem: [1.8, 1.6, 1.9, 1.7, 1.9, 2.1, 1.8],
    quality: [85, 78, 88, 82, 90, 92, 86],
  };

  const chartData = {
    labels: data?.labels || defaultData.labels,
    datasets: [{
      data: data?.duration || defaultData.duration,
      color: (opacity = 1) => `rgba(94, 75, 140, ${opacity})`,
      strokeWidth: 2,
    }],
    legend: ['Sleep Duration'],
  };

  const values = chartData.datasets[0].data;
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const stageData = {
    deep: data?.deep || defaultData.deep,
    rem: data?.rem || defaultData.rem,
    light: (data?.duration || defaultData.duration).map((d, i) => 
      d - (data?.deep?.[i] || defaultData.deep[i]) - (data?.rem?.[i] || defaultData.rem[i])
    ),
  };

  const chartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(94, 75, 140, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.sleepIndigo,
    },
    barPercentage: 0.7,
  };

  const getQualityColor = (quality) => {
    if (quality >= 85) return colors.successGreen;
    if (quality >= 70) return colors.primaryGreen;
    if (quality >= 50) return colors.warningYellow;
    return colors.alertRed;
  };

  const renderLineChart = () => (
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
  );

  const renderBarChart = () => (
    <BarChart
      data={{
        labels: chartData.labels,
        datasets: [{
          data: values,
        }]
      }}
      width={chartWidth}
      height={height}
      chartConfig={chartConfig}
      style={styles.chart}
      yAxisLabel=""
      yAxisSuffix="h"
      fromZero
      showValuesOnTopOfBars={true}
    />
  );

  const renderProgressChart = () => {
    const avgSleep = parseFloat(avg);
    const targetSleep = 8;
    const progressData = [avgSleep / targetSleep];

    return (
      <View style={styles.progressContainer}>
        <ProgressChart
          data={progressData}
          width={150}
          height={150}
          strokeWidth={16}
          radius={60}
          chartConfig={{
            backgroundColor: 'white',
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            color: (opacity = 1) => `rgba(94, 75, 140, ${opacity})`,
          }}
          hideLegend={true}
        />
        <View style={styles.progressInfo}>
          <Text style={styles.progressValue}>{avg}h</Text>
          <Text style={styles.progressLabel}>Average Sleep</Text>
          <Text style={styles.progressTarget}>Target: {targetSleep}h</Text>
        </View>
      </View>
    );
  };

  const renderSleepStages = () => {
    const avgDeep = (stageData.deep.reduce((a, b) => a + b, 0) / stageData.deep.length).toFixed(1);
    const avgRem = (stageData.rem.reduce((a, b) => a + b, 0) / stageData.rem.length).toFixed(1);
    const avgLight = (stageData.light.reduce((a, b) => a + b, 0) / stageData.light.length).toFixed(1);

    return (
      <View style={styles.stagesContainer}>
        <Text style={styles.stagesTitle}>Sleep Stages</Text>
        
        <View style={styles.stageItem}>
          <View style={styles.stageHeader}>
            <View style={[styles.stageDot, { backgroundColor: colors.sleepIndigo }]} />
            <Text style={styles.stageLabel}>Deep Sleep</Text>
          </View>
          <Text style={styles.stageValue}>{avgDeep}h</Text>
          <Text style={styles.stagePercentage}>
            {Math.round((parseFloat(avgDeep) / parseFloat(avg)) * 100)}%
          </Text>
        </View>

        <View style={styles.stageItem}>
          <View style={styles.stageHeader}>
            <View style={[styles.stageDot, { backgroundColor: colors.stressPurple }]} />
            <Text style={styles.stageLabel}>REM Sleep</Text>
          </View>
          <Text style={styles.stageValue}>{avgRem}h</Text>
          <Text style={styles.stagePercentage}>
            {Math.round((parseFloat(avgRem) / parseFloat(avg)) * 100)}%
          </Text>
        </View>

        <View style={styles.stageItem}>
          <View style={styles.stageHeader}>
            <View style={[styles.stageDot, { backgroundColor: colors.primaryGreen }]} />
            <Text style={styles.stageLabel}>Light Sleep</Text>
          </View>
          <Text style={styles.stageValue}>{avgLight}h</Text>
          <Text style={styles.stagePercentage}>
            {Math.round((parseFloat(avgLight) / parseFloat(avg)) * 100)}%
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {showStats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="arrow-down" size={14} color={colors.successGreen} />
            <Text style={styles.statLabel}>Min</Text>
            <Text style={styles.statValue}>{min}h</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="remove" size={14} color={colors.warningYellow} />
            <Text style={styles.statLabel}>Avg</Text>
            <Text style={styles.statValue}>{avg}h</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="arrow-up" size={14} color={colors.alertRed} />
            <Text style={styles.statLabel}>Max</Text>
            <Text style={styles.statValue}>{max}h</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="moon" size={14} color={colors.sleepIndigo} />
            <Text style={styles.statLabel}>Quality</Text>
            <Text style={[styles.statValue, { color: getQualityColor(data?.quality?.[0] || 85) }]}>
              {data?.quality?.[0] || 85}%
            </Text>
          </View>
        </View>
      )}

      {chartType === 'progress' ? renderProgressChart() : (
        <>
          {chartType === 'bar' ? renderBarChart() : renderLineChart()}
          
          {showStages && (
            <View style={styles.stagesWrapper}>
              {renderSleepStages()}
            </View>
          )}
        </>
      )}

      <View style={styles.footer}>
        <Text style={styles.timeRange}>
          {timeRange === 'day' ? 'Last 24h' : timeRange === 'week' ? 'This Week' : 'This Month'}
        </Text>
        <View style={styles.legend}>
          <View style={[styles.legendDot, { backgroundColor: colors.sleepIndigo }]} />
          <Text style={styles.legendText}>Sleep Duration</Text>
        </View>
      </View>
    </View>
  );
};

export const SleepDurationChart = (props) => (
  <SleepChart
    chartType="line"
    showStages={false}
    {...props}
  />
);

export const SleepStagesChart = ({ data, ...props }) => {
  const stageChartData = {
    labels: ['Deep', 'REM', 'Light'],
    data: [
      data?.deep || [2.5],
      data?.rem || [1.8],
      data?.light || [3.0],
    ],
  };

  return (
    <View style={styles.stageChartContainer}>
      <Text style={styles.stageChartTitle}>Sleep Stages Breakdown</Text>
      <BarChart
        data={{
          labels: stageChartData.labels,
          datasets: [{
            data: stageChartData.data.map(d => d[0] || d),
          }]
        }}
        width={width - 40}
        height={180}
        chartConfig={{
          backgroundColor: 'white',
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          decimalPlaces: 1,
          color: (opacity = 1, index) => {
            const colors = [colors.sleepIndigo, colors.stressPurple, colors.primaryGreen];
            return `rgba(${parseInt(colors[index % colors.length].slice(1,3), 16)}, ${parseInt(colors[index % colors.length].slice(3,5), 16)}, ${parseInt(colors[index % colors.length].slice(5,7), 16)}, ${opacity})`;
          },
        }}
        style={styles.stageChart}
        yAxisLabel=""
        yAxisSuffix="h"
        fromZero
        showValuesOnTopOfBars={true}
      />
    </View>
  );
};

export const SleepQualityChart = ({ data, ...props }) => (
  <SleepChart
    chartType="progress"
    showStats={false}
    showStages={false}
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
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    minWidth: 70,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: colors.sleepIndigo,
  },
  progressLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  progressTarget: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  stagesWrapper: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  stagesContainer: {
    marginTop: 8,
  },
  stagesTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  stageLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  stageValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    marginRight: 12,
  },
  stagePercentage: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    minWidth: 40,
    textAlign: 'right',
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
  stageChartContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
  },
  stageChartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  stageChart: {
    borderRadius: 16,
  },
});

export default SleepChart;