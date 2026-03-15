import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../utils/constants/colors';

const { width } = Dimensions.get('window');

const ActivityChart = ({
  data,
  timeRange = 'week',
  showStats = true,
  height = 200,
  width: chartWidth = width - 40,
  chartType = 'bar', // 'bar', 'line'
  showGoal = true,
  goalValue = 8000,
}) => {
  
  const defaultData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    steps: [5234, 6123, 4876, 7234, 6543, 8234, 4321],
    calories: [210, 245, 195, 289, 262, 329, 173],
    distance: [4.2, 4.9, 3.9, 5.8, 5.2, 6.6, 3.5],
  };

  const chartData = {
    labels: data?.labels || defaultData.labels,
    datasets: [{
      data: data?.steps || defaultData.steps,
      color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      strokeWidth: 2,
    }],
    legend: ['Steps'],
  };

  const values = chartData.datasets[0].data;
  const total = values.reduce((a, b) => a + b, 0);
  const avg = Math.round(total / values.length);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const chartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primaryGreen,
    },
    barPercentage: 0.7,
  };

  const getGoalProgress = () => {
    const progress = (avg / goalValue) * 100;
    return Math.min(progress, 100);
  };

  const renderBarChart = () => (
    <BarChart
      data={chartData}
      width={chartWidth}
      height={height}
      chartConfig={chartConfig}
      style={styles.chart}
      yAxisLabel=""
      yAxisSuffix=""
      fromZero
      showValuesOnTopOfBars={false}
    />
  );

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

  return (
    <View style={styles.container}>
      {showStats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="walk" size={16} color={colors.primaryGreen} />
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{(total / 1000).toFixed(1)}k</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={16} color={colors.primaryGreen} />
            <Text style={styles.statLabel}>Average</Text>
            <Text style={styles.statValue}>{avg}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flash" size={16} color={colors.primaryGreen} />
            <Text style={styles.statLabel}>Peak</Text>
            <Text style={styles.statValue}>{max}</Text>
          </View>
        </View>
      )}

      {chartType === 'bar' ? renderBarChart() : renderLineChart()}

      {showGoal && (
        <View style={styles.goalContainer}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalLabel}>Daily Goal</Text>
            <Text style={styles.goalValue}>{goalValue.toLocaleString()} steps</Text>
          </View>
          <View style={styles.goalProgress}>
            <View style={[styles.goalBar, { backgroundColor: colors.primaryGreen + '20' }]}>
              <View
                style={[
                  styles.goalFill,
                  {
                    width: `${getGoalProgress()}%`,
                    backgroundColor: getGoalProgress() >= 100 ? colors.successGreen : colors.primaryGreen,
                  },
                ]}
              />
            </View>
            <Text style={styles.goalProgressText}>
              {Math.round(avg)} avg ({Math.round(getGoalProgress())}%)
            </Text>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.timeRange}>
          {timeRange === 'day' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'}
        </Text>
        <View style={styles.legend}>
          <View style={[styles.legendDot, { backgroundColor: colors.primaryGreen }]} />
          <Text style={styles.legendText}>Steps</Text>
        </View>
      </View>
    </View>
  );
};

export const StepsChart = ({ data, ...props }) => (
  <ActivityChart
    data={data}
    chartType="bar"
    {...props}
  />
);

export const CaloriesChart = ({ data, ...props }) => {
  const caloriesData = data ? {
    ...data,
    datasets: [{
      data: data.calories || [],
      color: (opacity = 1) => `rgba(255, 140, 66, ${opacity})`,
    }],
  } : null;

  return (
    <ActivityChart
      data={caloriesData}
      chartType="line"
      showGoal={false}
      {...props}
    />
  );
};

export const DistanceChart = ({ data, ...props }) => {
  const distanceData = data ? {
    ...data,
    datasets: [{
      data: data.distance || [],
      color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    }],
  } : null;

  return (
    <ActivityChart
      data={distanceData}
      chartType="line"
      showGoal={false}
      {...props}
    />
  );
};

export const WeeklyActivityChart = ({ data, onBarPress }) => {
  const [selectedBar, setSelectedBar] = useState(null);

  const handleDataPointClick = ({ index, value }) => {
    setSelectedBar(index);
    onBarPress?.(index, value);
  };

  return (
    <View>
      <ActivityChart
        data={data}
        timeRange="week"
        height={180}
        showStats={false}
        onDataPointClick={handleDataPointClick}
      />
      {selectedBar !== null && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedDay}>{data?.labels[selectedBar]}</Text>
          <Text style={styles.selectedValue}>{data?.steps[selectedBar]} steps</Text>
        </View>
      )}
    </View>
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
  goalContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  goalValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: colors.textPrimary,
  },
  goalProgress: {
    marginBottom: 4,
  },
  goalBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  goalFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalProgressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
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
  selectedInfo: {
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.primaryGreen + '10',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedDay: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.primaryGreen,
  },
  selectedValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: colors.textPrimary,
  },
});

export default ActivityChart;