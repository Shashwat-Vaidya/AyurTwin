import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { BarChart as RNCBarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../utils/constants/colors';

const { width } = Dimensions.get('window');

const BarChart = ({
  data,
  width: chartWidth = width - 40,
  height = 220,
  title,
  subtitle,
  showLegend = true,
  showGrid = true,
  showValues = true,
  showStats = false,
  formatYLabel = (value) => value,
  formatXLabel = (value) => value,
  colors: barColors,
  style,
  chartConfig,
  yAxisLabel = '',
  yAxisSuffix = '',
  fromZero = true,
  withHorizontalLabels = true,
  barPercentage = 0.7,
  showBarTops = true,
}) => {
  
  const defaultChartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    decimalPlaces: 0,
    color: (opacity = 1, index) => {
      if (barColors && barColors[index]) {
        return barColors[index];
      }
      return `rgba(76, 175, 80, ${opacity})`;
    },
    labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage,
  };

  const mergedChartConfig = { ...defaultChartConfig, ...chartConfig };

  const calculateStats = () => {
    if (!data || !data.datasets) return null;

    const allValues = data.datasets.flatMap(dataset => dataset.data);
    const total = allValues.reduce((a, b) => a + b, 0);
    const average = Math.round(total / allValues.length);
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);

    return { total, average, max, min };
  };

  const stats = showStats ? calculateStats() : null;

  const renderStats = () => {
    if (!stats) return null;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="calculator" size={14} color={colors.primarySaffron} />
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{stats.total}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="arrow-up" size={14} color={colors.alertRed} />
          <Text style={styles.statLabel}>Max</Text>
          <Text style={styles.statValue}>{stats.max}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="arrow-down" size={14} color={colors.successGreen} />
          <Text style={styles.statLabel}>Min</Text>
          <Text style={styles.statValue}>{stats.min}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="trending-up" size={14} color={colors.warningYellow} />
          <Text style={styles.statLabel}>Avg</Text>
          <Text style={styles.statValue}>{stats.average}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}

      {renderStats()}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <RNCBarChart
            data={data}
            width={Math.max(chartWidth, data?.labels?.length * 60 || chartWidth)}
            height={height}
            chartConfig={mergedChartConfig}
            style={styles.chart}
            withVerticalLabels={true}
            withHorizontalLabels={withHorizontalLabels}
            showValuesOnTopOfBars={showValues}
            fromZero={fromZero}
            yAxisLabel={yAxisLabel}
            yAxisSuffix={yAxisSuffix}
            formatYLabel={formatYLabel}
            formatXLabel={formatXLabel}
          />
        </View>
      </ScrollView>

      {showLegend && data?.legend && (
        <View style={styles.legendContainer}>
          {data.legend.map((label, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  {
                    backgroundColor: barColors?.[index] || colors.primaryGreen,
                  },
                ]}
              />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export const StepsBarChart = ({ data, ...props }) => (
  <BarChart
    data={data}
    title="Daily Steps"
    colors={[colors.primaryGreen]}
    showStats={true}
    {...props}
  />
);

export const ActivityBarChart = ({ data, ...props }) => (
  <BarChart
    data={data}
    title="Activity Breakdown"
    colors={[colors.heartRate, colors.primaryGreen, colors.spO2Blue]}
    {...props}
  />
);

export const SleepBarChart = ({ data, ...props }) => (
  <BarChart
    data={data}
    title="Sleep Duration"
    colors={[colors.sleepIndigo]}
    formatYLabel={(value) => `${value}h`}
    {...props}
  />
);

export const CaloriesBarChart = ({ data, ...props }) => (
  <BarChart
    data={data}
    title="Calories Burned"
    colors={[colors.tempOrange]}
    formatYLabel={(value) => `${value}kcal`}
    {...props}
  />
);

export const ComparisonBarChart = ({ current, previous, labels, ...props }) => {
  const data = {
    labels,
    datasets: [
      {
        data: current,
        color: (opacity = 1) => `rgba(255, 153, 51, ${opacity})`,
      },
      {
        data: previous,
        color: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
      },
    ],
    legend: ['Current', 'Previous'],
  };

  return (
    <BarChart
      data={data}
      colors={[colors.primarySaffron, colors.textSecondary]}
      showLegend={true}
      {...props}
    />
  );
};

export const GroupedBarChart = ({ groups, ...props }) => {
  const labels = groups[0]?.data.map((_, i) => `Day ${i + 1}`) || [];
  const datasets = groups.map(group => ({
    data: group.data,
    color: (opacity = 1) => group.color,
  }));

  const data = {
    labels,
    datasets,
    legend: groups.map(g => g.label),
  };

  return (
    <BarChart
      data={data}
      colors={groups.map(g => g.color)}
      barPercentage={0.7}
      {...props}
    />
  );
};

export const StackedBarChart = ({ stacks, labels, ...props }) => {
  // Note: React Native Chart Kit doesn't support stacked bars directly
  // This is a simplified version showing grouped bars
  const datasets = stacks.map((stack, index) => ({
    data: stack.data,
    color: (opacity = 1) => stack.color,
  }));

  const data = {
    labels,
    datasets,
    legend: stacks.map(s => s.label),
  };

  return (
    <BarChart
      data={data}
      colors={stacks.map(s => s.color)}
      showLegend={true}
      {...props}
    />
  );
};

export const HorizontalBarChart = (props) => (
  <BarChart
    {...props}
    chartConfig={{
      ...props.chartConfig,
      barPercentage: 0.9,
    }}
    withHorizontalLabels={true}
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
  header: {
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  statItem: {
    alignItems: 'center',
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
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default BarChart;