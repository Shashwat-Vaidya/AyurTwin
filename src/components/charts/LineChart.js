import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LineChart as RNCLLineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../utils/constants/colors';

const { width } = Dimensions.get('window');

const LineChart = ({
  data,
  width: chartWidth = width - 40,
  height = 220,
  title,
  subtitle,
  showLegend = true,
  showGrid = true,
  showDots = true,
  showStats = false,
  bezier = true,
  formatYLabel = (value) => value,
  formatXLabel = (value) => value,
  colors: lineColors,
  onDataPointClick,
  style,
  chartConfig,
  yAxisLabel = '',
  yAxisSuffix = '',
  fromZero = false,
  withHorizontalLines = true,
  withVerticalLines = false,
}) => {
  
  const defaultChartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    decimalPlaces: 0,
    color: (opacity = 1, index) => {
      if (lineColors && lineColors[index]) {
        return lineColors[index];
      }
      return `rgba(255, 153, 51, ${opacity})`;
    },
    labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primarySaffron,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(0,0,0,0.03)',
    },
  };

  const mergedChartConfig = { ...defaultChartConfig, ...chartConfig };

  const calculateStats = () => {
    if (!data || !data.datasets) return null;

    const allValues = data.datasets.flatMap(dataset => dataset.data);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const avg = Math.round(allValues.reduce((a, b) => a + b, 0) / allValues.length);
    const latest = allValues[allValues.length - 1];

    return { min, max, avg, latest };
  };

  const stats = showStats ? calculateStats() : null;

  const renderStats = () => {
    if (!stats) return null;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Latest</Text>
          <Text style={[styles.statValue, { color: colors.primarySaffron }]}>
            {stats.latest}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="arrow-down" size={14} color={colors.successGreen} />
          <Text style={styles.statLabel}>Min</Text>
          <Text style={styles.statValue}>{stats.min}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="remove" size={14} color={colors.warningYellow} />
          <Text style={styles.statLabel}>Avg</Text>
          <Text style={styles.statValue}>{stats.avg}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="arrow-up" size={14} color={colors.alertRed} />
          <Text style={styles.statLabel}>Max</Text>
          <Text style={styles.statValue}>{stats.max}</Text>
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
          <RNCLLineChart
            data={data}
            width={Math.max(chartWidth, data?.labels?.length * 50 || chartWidth)}
            height={height}
            chartConfig={mergedChartConfig}
            bezier={bezier}
            style={styles.chart}
            withDots={showDots}
            withShadow={false}
            withInnerLines={showGrid}
            withOuterLines={showGrid}
            withVerticalLines={withVerticalLines}
            withHorizontalLines={withHorizontalLines}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            formatYLabel={formatYLabel}
            formatXLabel={formatXLabel}
            onDataPointClick={onDataPointClick}
            yAxisLabel={yAxisLabel}
            yAxisSuffix={yAxisSuffix}
            fromZero={fromZero}
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
                    backgroundColor: lineColors?.[index] || colors.primarySaffron,
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

export const HeartRateLineChart = ({ data, ...props }) => (
  <LineChart
    data={data}
    title="Heart Rate Trend"
    colors={[colors.heartRate]}
    formatYLabel={(value) => `${value} bpm`}
    {...props}
  />
);

export const StressLineChart = ({ data, ...props }) => (
  <LineChart
    data={data}
    title="Stress Level Trend"
    colors={[colors.stressPurple]}
    formatYLabel={(value) => `${value}`}
    {...props}
  />
);

export const TemperatureLineChart = ({ data, ...props }) => (
  <LineChart
    data={data}
    title="Temperature Trend"
    colors={[colors.tempOrange]}
    formatYLabel={(value) => `${value}°C`}
    {...props}
  />
);

export const MultiLineChart = ({ datasets, labels, ...props }) => {
  const data = {
    labels,
    datasets,
    legend: datasets.map(d => d.label),
  };

  return <LineChart data={data} {...props} />;
};

export const ComparisonLineChart = ({ current, previous, labels, ...props }) => {
  const data = {
    labels,
    datasets: [
      {
        data: current,
        color: (opacity = 1) => `rgba(255, 153, 51, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: previous,
        color: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
        strokeWidth: 2,
        strokeDash: [5, 5],
      },
    ],
    legend: ['Current', 'Previous'],
  };

  return <LineChart data={data} colors={[colors.primarySaffron, colors.textSecondary]} {...props} />;
};

export const AnnotatedLineChart = ({ data, annotations, ...props }) => {
  const handleDataPointClick = ({ index, value }) => {
    const annotation = annotations?.find(a => a.index === index);
    if (annotation) {
      // Show annotation tooltip
      console.log('Annotation:', annotation.text);
    }
  };

  return (
    <LineChart
      data={data}
      onDataPointClick={handleDataPointClick}
      {...props}
    />
  );
};

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

export default LineChart;