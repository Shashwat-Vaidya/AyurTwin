import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

const ReportDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { report } = route.params || {};

  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const viewShotRef = React.useRef();

  // Mock report data based on report type
  const getReportData = () => {
    const type = report?.type || 'health';
    
    switch(type) {
      case 'health':
        return {
          title: 'Weekly Health Summary',
          date: 'Mar 10 - Mar 16, 2024',
          summary: 'Your health metrics have been stable this week with improvements in sleep quality.',
          metrics: [
            { name: 'Heart Rate', value: '72 bpm', change: '+2', status: 'normal' },
            { name: 'Blood Pressure', value: '120/80', change: '-2', status: 'normal' },
            { name: 'SpO₂', value: '98%', change: '0', status: 'normal' },
            { name: 'Temperature', value: '36.6°C', change: '+0.1', status: 'normal' },
          ],
          chartData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              data: [72, 75, 73, 74, 76, 72, 71],
            }]
          },
          insights: [
            'Heart rate variability improved by 12%',
            'Resting heart rate decreased by 3 bpm',
            'Most active on Saturday',
          ],
          recommendations: [
            'Maintain current exercise routine',
            'Continue monitoring stress levels',
            'Stay hydrated',
          ],
        };
      
      case 'stress':
        return {
          title: 'Monthly Stress Report',
          date: 'February 2024',
          summary: 'Stress levels have decreased this month with better management techniques.',
          metrics: [
            { name: 'Average Stress', value: '48', change: '-5', status: 'good' },
            { name: 'Peak Stress', value: '72', change: '-8', status: 'good' },
            { name: 'Low Stress Days', value: '12', change: '+3', status: 'good' },
            { name: 'Recovery Time', value: '25 min', change: '-10', status: 'good' },
          ],
          chartData: {
            labels: ['W1', 'W2', 'W3', 'W4'],
            datasets: [{
              data: [52, 48, 45, 42],
            }]
          },
          insights: [
            'Stress peaks on Wednesdays',
            'Weekend stress is consistently lower',
            'Breathing exercises helped reduce recovery time',
          ],
          recommendations: [
            'Practice morning meditation',
            'Take short breaks during work',
            'Evening walks help reduce stress',
          ],
        };
      
      case 'sleep':
        return {
          title: 'Sleep Quality Analysis',
          date: 'March 2024',
          summary: 'Sleep quality has improved with consistent bedtime routine.',
          metrics: [
            { name: 'Average Sleep', value: '7.2h', change: '+0.5', status: 'good' },
            { name: 'Deep Sleep', value: '2.5h', change: '+0.3', status: 'good' },
            { name: 'REM Sleep', value: '1.8h', change: '+0.2', status: 'good' },
            { name: 'Wake-ups', value: '2', change: '-1', status: 'good' },
          ],
          chartData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              data: [7.2, 6.8, 7.5, 7.0, 7.8, 8.2, 7.5],
            }]
          },
          insights: [
            'Earlier bedtime leads to better sleep',
            'Screen time before bed reduces sleep quality',
            'Weekend sleep is longer but less consistent',
          ],
          recommendations: [
            'Maintain consistent sleep schedule',
            'Avoid caffeine after 4 PM',
            'Create relaxing bedtime routine',
          ],
        };
      
      default:
        return {
          title: report?.title || 'Health Report',
          date: report?.date || 'March 2024',
          summary: 'Your health metrics summary for this period.',
          metrics: [],
          chartData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              data: [70, 72, 71, 73, 72, 74, 71],
            }]
          },
          insights: [],
          recommendations: [],
        };
    }
  };

  const reportData = getReportData();

  const periods = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ];

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out my ${reportData.title} from AyurTwin app!`,
        title: 'Health Report',
      });
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  const handleExportPDF = () => {
    setIsGeneratingPDF(true);
    // Simulate PDF generation
    setTimeout(() => {
      setIsGeneratingPDF(false);
      alert('PDF generated successfully!');
    }, 2000);
  };

  const handleEmailReport = () => {
    alert('Report will be sent to your email');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return colors.successGreen;
      case 'normal': return colors.primaryGreen;
      case 'warning': return colors.warningYellow;
      case 'bad': return colors.alertRed;
      default: return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Details</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-social" size={22} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Report Title Card */}
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.titleCard}
        >
          <Text style={styles.reportTitle}>{reportData.title}</Text>
          <Text style={styles.reportDate}>{reportData.date}</Text>
          <View style={styles.reportBadge}>
            <Ionicons name="document-text" size={16} color="white" />
            <Text style={styles.reportBadgeText}>Health Report</Text>
          </View>
        </LinearGradient>

        {/* Period Selector */}
        <View style={styles.periodContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.periodTab,
                  selectedPeriod === period.id && styles.periodTabActive,
                ]}
                onPress={() => setSelectedPeriod(period.id)}
              >
                <Text style={[
                  styles.periodText,
                  selectedPeriod === period.id && styles.periodTextActive,
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text style={styles.summaryText}>{reportData.summary}</Text>
        </Card>

        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          {reportData.metrics.map((metric, index) => (
            <Card key={index} style={styles.metricCard}>
              <Text style={styles.metricName}>{metric.name}</Text>
              <Text style={[styles.metricValue, { color: getStatusColor(metric.status) }]}>
                {metric.value}
              </Text>
              <View style={styles.metricFooter}>
                <Text style={[styles.metricChange, { color: metric.change.startsWith('+') ? colors.successGreen : colors.alertRed }]}>
                  {metric.change}
                </Text>
                <Text style={styles.metricStatus}>
                  vs last period
                </Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Trend Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Trend Analysis</Text>
          <LineChart
            data={reportData.chartData}
            width={width - 70}
            height={200}
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 153, 51, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '4', strokeWidth: '2', stroke: colors.primarySaffron },
            }}
            bezier
            style={styles.chart}
          />
        </Card>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Ionicons name="bulb" size={24} color={colors.warningYellow} />
            <Text style={styles.insightsTitle}>Key Insights</Text>
          </View>
          
          {reportData.insights.map((insight, index) => (
            <View key={index} style={styles.insightItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </Card>

        {/* Recommendations */}
        <Card style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
          
          {reportData.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons name="leaf" size={16} color={colors.primaryGreen} />
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </Card>

        {/* Comparison */}
        <Card style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>vs Previous Period</Text>
          
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Average</Text>
              <Text style={styles.comparisonValue}>74</Text>
              <Text style={styles.comparisonChange}>↑ 3%</Text>
            </View>
            
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Minimum</Text>
              <Text style={styles.comparisonValue}>68</Text>
              <Text style={styles.comparisonChange}>↓ 2%</Text>
            </View>
            
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Maximum</Text>
              <Text style={styles.comparisonValue}>82</Text>
              <Text style={styles.comparisonChange}>↑ 5%</Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Export PDF"
            onPress={handleExportPDF}
            style={styles.pdfButton}
            outline
            icon="document-text"
            loading={isGeneratingPDF}
          />
          <Button
            title="Email Report"
            onPress={handleEmailReport}
            style={styles.emailButton}
            outline
            icon="mail"
          />
        </View>

        {/* Download Note */}
        <Text style={styles.note}>
          This report is for informational purposes only. Consult your healthcare provider for medical advice.
        </Text>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  shareButton: {
    padding: 8,
  },
  titleCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  reportTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'white',
    marginBottom: 4,
  },
  reportDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 12,
  },
  reportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  reportBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
    marginLeft: 6,
  },
  periodContainer: {
    marginBottom: 16,
  },
  periodTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  periodTabActive: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  periodText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: 'white',
  },
  summaryCard: {
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  summaryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
  },
  metricName: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 8,
  },
  metricValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  metricFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricChange: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    marginRight: 4,
  },
  metricStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  chartCard: {
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
  },
  insightsCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 179, 71, 0.05)',
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  recommendationsCard: {
    padding: 16,
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  comparisonCard: {
    padding: 16,
    marginBottom: 20,
  },
  comparisonTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  comparisonValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  comparisonChange: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: colors.successGreen,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pdfButton: {
    flex: 1,
    marginRight: 8,
  },
  emailButton: {
    flex: 1,
    marginLeft: 8,
  },
  note: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default ReportDetailScreen;