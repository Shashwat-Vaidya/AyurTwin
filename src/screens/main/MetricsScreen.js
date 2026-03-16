import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import MetricCard from '../../components/health/MetricCard';
import { mockHistoricalData } from '../../services/sensors/mockDataGenerator';

const { width } = Dimensions.get('window');

const MetricsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { historicalData, diseaseRisks } = useSelector((state) => state.healthData);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Local state
  const [selectedFilter, setSelectedFilter] = useState('day'); // day, week, month, year
  const [selectedMetric, setSelectedMetric] = useState('heart');
  const [showSensorLog, setShowSensorLog] = useState(false);

  // Filter options
  const filters = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ];

  // Metrics data
  const metrics = [
    { id: 'heart', label: 'Heart Rate', value: '72', unit: 'bpm', icon: 'heart', color: colors.heartRate },
    { id: 'spo2', label: 'SpO₂', value: '98', unit: '%', icon: 'fitness', color: colors.spO2Blue },
    { id: 'temp', label: 'Temp', value: '36.6', unit: '°C', icon: 'thermometer', color: colors.tempOrange },
    { id: 'stress', label: 'Stress', value: '45', unit: '', icon: 'flash', color: colors.stressPurple },
    { id: 'sleep', label: 'Sleep', value: '7.2', unit: 'h', icon: 'moon', color: colors.sleepIndigo },
    { id: 'activity', label: 'Activity', value: '8.2k', unit: 'steps', icon: 'walk', color: colors.primaryGreen },
  ];

  // Chart data based on selected metric and filter
  const getChartData = () => {
    const data = {
      heart: {
        labels: filterLabels(),
        datasets: [{
          data: filterData([72, 75, 78, 74, 76, 73, 71, 74, 77, 75, 73, 72]),
        }]
      },
      stress: {
        labels: filterLabels(),
        datasets: [{
          data: filterData([45, 52, 48, 55, 49, 47, 44, 46, 51, 53, 47, 45]),
        }]
      },
      sleep: {
        labels: filterLabels(),
        datasets: [{
          data: filterData([7.2, 6.8, 7.5, 7.0, 7.8, 7.2, 6.5, 7.1, 7.4, 7.6, 7.0, 6.9]),
        }]
      },
    };
    return data[selectedMetric] || data.heart;
  };

  const filterLabels = () => {
    switch(selectedFilter) {
      case 'day': return ['12am', '4am', '8am', '12pm', '4pm', '8pm'];
      case 'week': return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case 'month': return ['W1', 'W2', 'W3', 'W4'];
      case 'year': return ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];
      default: return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
  };

  const filterData = (data) => {
    switch(selectedFilter) {
      case 'day': return data.slice(0, 6);
      case 'week': return data.slice(0, 7);
      case 'month': return [data[0], data[3], data[6], data[9]];
      case 'year': return data.slice(0, 6);
      default: return data.slice(0, 7);
    }
  };

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  // Sensor log data
  const sensorLog = [
    { time: 'Now', heart: '72', hrv: '45', spo2: '98', temp: '36.6', stress: '45', activity: '8.2k' },
    { time: '1h ago', heart: '74', hrv: '47', spo2: '97', temp: '36.5', stress: '42', activity: '7.1k' },
    { time: '2h ago', heart: '71', hrv: '44', spo2: '98', temp: '36.6', stress: '48', activity: '6.3k' },
    { time: '3h ago', heart: '73', hrv: '46', spo2: '99', temp: '36.7', stress: '51', activity: '5.2k' },
    { time: '4h ago', heart: '75', hrv: '48', spo2: '97', temp: '36.4', stress: '53', activity: '4.1k' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.headerTitle}>Health Metrics</Text>
          <TouchableOpacity 
            style={styles.logButton}
            onPress={() => setShowSensorLog(!showSensorLog)}
          >
            <Ionicons name="list" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View 
          style={[
            styles.filterContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterTab,
                  selectedFilter === filter.id && styles.filterTabActive,
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter.id && styles.filterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Metrics Grid */}
        <Animated.View 
          style={[
            styles.metricsGrid,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.gridRow}>
            {metrics.slice(0, 3).map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                onPress={() => setSelectedMetric(metric.id)}
                selected={selectedMetric === metric.id}
              />
            ))}
          </View>
          <View style={styles.gridRow}>
            {metrics.slice(3, 6).map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                onPress={() => setSelectedMetric(metric.id)}
                selected={selectedMetric === metric.id}
              />
            ))}
          </View>
        </Animated.View>

        {/* Selected Metric Chart */}
        <Animated.View 
          style={[
            styles.chartContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>
              {metrics.find(m => m.id === selectedMetric)?.label} Trend
            </Text>
            <View style={styles.chartStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Min</Text>
                <Text style={styles.statValue}>58</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg</Text>
                <Text style={styles.statValue}>72</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Max</Text>
                <Text style={styles.statValue}>82</Text>
              </View>
            </View>
          </View>

          <LineChart
            data={getChartData()}
            width={width - 40}
            height={200}
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 0,
              color: (opacity = 1) => 
                selectedMetric === 'heart' ? `rgba(255, 77, 109, ${opacity})` :
                selectedMetric === 'stress' ? `rgba(155, 107, 158, ${opacity})` :
                selectedMetric === 'sleep' ? `rgba(94, 75, 140, ${opacity})` :
                `rgba(76, 175, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: colors.primarySaffron,
              },
            }}
            bezier
            style={styles.chart}
          />
        </Animated.View>

        {/* Additional Charts Row */}
        <Animated.View 
          style={[
            styles.additionalCharts,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.smallChart}>
            <Text style={styles.smallChartTitle}>Sleep Quality</Text>
            <ProgressChart
              data={{
                labels: ["Deep", "Light", "REM"],
                data: [0.6, 0.3, 0.1]
              }}
              width={width / 2 - 30}
              height={120}
              chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                color: (opacity = 1) => `rgba(94, 75, 140, ${opacity})`,
              }}
              style={styles.smallChartStyle}
              hideLegend={false}
            />
          </View>

          <View style={styles.smallChart}>
            <Text style={styles.smallChartTitle}>Activity</Text>
            <BarChart
              data={{
                labels: ["M", "T", "W", "T", "F", "S", "S"],
                datasets: [{
                  data: [5.2, 7.1, 6.3, 8.2, 7.4, 6.8, 5.9]
                }]
              }}
              width={width / 2 - 30}
              height={120}
              chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              }}
              style={styles.smallChartStyle}
              showValuesOnTopOfBars={false}
            />
          </View>
        </Animated.View>

        {/* Sensor Log Table */}
        {showSensorLog && (
          <Animated.View 
            style={[
              styles.sensorLog,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.logTitle}>IoT Sensor Log</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View style={styles.logHeader}>
                  <Text style={[styles.logCell, styles.logHeaderCell]}>Time</Text>
                  <Text style={[styles.logCell, styles.logHeaderCell]}>HR</Text>
                  <Text style={[styles.logCell, styles.logHeaderCell]}>HRV</Text>
                  <Text style={[styles.logCell, styles.logHeaderCell]}>SpO₂</Text>
                  <Text style={[styles.logCell, styles.logHeaderCell]}>Temp</Text>
                  <Text style={[styles.logCell, styles.logHeaderCell]}>Stress</Text>
                  <Text style={[styles.logCell, styles.logHeaderCell]}>Steps</Text>
                </View>

                {sensorLog.map((log, index) => (
                  <View key={index} style={styles.logRow}>
                    <Text style={[styles.logCell, styles.logTimeCell]}>{log.time}</Text>
                    <Text style={styles.logCell}>{log.heart}</Text>
                    <Text style={styles.logCell}>{log.hrv}</Text>
                    <Text style={styles.logCell}>{log.spo2}</Text>
                    <Text style={styles.logCell}>{log.temp}</Text>
                    <Text style={styles.logCell}>{log.stress}</Text>
                    <Text style={styles.logCell}>{log.activity}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View Full History</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primarySaffron} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* All Disease Predictions */}
        <Animated.View 
          style={[
            styles.diseaseSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Disease Risk Predictions</Text>
          
          {diseaseRisks?.map((risk, index) => (
            <View key={index} style={styles.riskItem}>
              <View style={styles.riskHeader}>
                <Text style={styles.riskName}>{risk.name}</Text>
                <Text style={[
                  styles.riskPercentage,
                  { color: risk.risk > 70 ? colors.alertRed : risk.risk > 40 ? colors.warningYellow : colors.successGreen }
                ]}>
                  {risk.risk}%
                </Text>
              </View>
              <View style={styles.riskBarContainer}>
                <View 
                  style={[
                    styles.riskBar,
                    { 
                      width: `${risk.risk}%`,
                      backgroundColor: risk.risk > 70 ? colors.alertRed : risk.risk > 40 ? colors.warningYellow : colors.successGreen
                    }
                  ]} 
                />
              </View>
              <Text style={styles.riskLevel}>{risk.level}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Dosha Trend */}
        <Animated.View 
          style={[
            styles.doshaSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Dosha Balance Trend</Text>
          
          <View style={styles.doshaChart}>
            <LineChart
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    data: [45, 47, 43, 46, 44, 45, 43],
                    color: (opacity = 1) => `rgba(123, 110, 143, ${opacity})`,
                    strokeWidth: 2
                  },
                  {
                    data: [35, 34, 38, 36, 37, 35, 34],
                    color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                    strokeWidth: 2
                  },
                  {
                    data: [20, 19, 19, 18, 19, 20, 23],
                    color: (opacity = 1) => `rgba(107, 166, 166, ${opacity})`,
                    strokeWidth: 2
                  }
                ]
              }}
              width={width - 40}
              height={180}
              chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                legend: ["Vata", "Pitta", "Kapha"]
              }}
              style={styles.doshaLineChart}
              bezier
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.textPrimary,
  },
  logButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    borderRadius: 12,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  filterTabActive: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: 'white',
  },
  metricsGrid: {
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  chartStats: {
    flexDirection: 'row',
  },
  statItem: {
    alignItems: 'center',
    marginLeft: 16,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  additionalCharts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  smallChart: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  smallChartTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  smallChartStyle: {
    borderRadius: 12,
  },
  sensorLog: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  logTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  logHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.02)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  logRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  logCell: {
    width: 50,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  logHeaderCell: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
  },
  logTimeCell: {
    width: 60,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
    marginRight: 4,
  },
  diseaseSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  riskItem: {
    marginBottom: 16,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  riskName: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
  },
  riskPercentage: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  riskBarContainer: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    marginBottom: 4,
  },
  riskBar: {
    height: '100%',
    borderRadius: 4,
  },
  riskLevel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textTransform: 'capitalize',
  },
  doshaSection: {
    marginBottom: 20,
  },
  doshaChart: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  doshaLineChart: {
    borderRadius: 16,
  },
});

export default MetricsScreen;