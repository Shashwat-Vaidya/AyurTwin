import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

import colors from '../../utils/constants/colors';
import { ROUTES } from '../../navigation/types';
import Card from '../../components/common/Card';

const { width } = Dimensions.get('window');

const ReportsScreen = () => {
  const navigation = useNavigation();
  const healthData = useSelector((state) => state.healthData);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'week', 'month', 'year'

  // Mock report data - in real app, this would be computed from healthData
  const reports = {
    weekly: {
      avgHeartRate: 72,
      avgStress: 45,
      avgSleep: 7.2,
      stepsTotal: 52340,
      caloriesTotal: 12950,
      dominantDosha: 'Vata-Pitta',
    },
    monthly: {
      avgHeartRate: 71,
      avgStress: 48,
      avgSleep: 7.0,
      stepsTotal: 210000,
      caloriesTotal: 54000,
      dominantDosha: 'Pitta',
    },
    stress: {
      trend: 'down',
      change: 8,
      highDays: 12,
      moderateDays: 10,
      lowDays: 8,
    },
    dosha: {
      vata: 42,
      pitta: 38,
      kapha: 20,
      recommendations: 5,
    },
    activity: {
      avgSteps: 6800,
      goal: 8000,
      activeDays: 22,
      sedentaryDays: 8,
    },
  };

  const handleViewReport = (reportType) => {
    navigation.navigate(ROUTES.REPORT_DETAIL, { reportType, period: selectedPeriod });
  };

  const PeriodSelector = () => (
    <View style={styles.periodSelector}>
      <TouchableOpacity
        style={[styles.periodOption, selectedPeriod === 'week' && styles.periodActive]}
        onPress={() => setSelectedPeriod('week')}
      >
        <Text style={[styles.periodText, selectedPeriod === 'week' && styles.periodTextActive]}>Week</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.periodOption, selectedPeriod === 'month' && styles.periodActive]}
        onPress={() => setSelectedPeriod('month')}
      >
        <Text style={[styles.periodText, selectedPeriod === 'month' && styles.periodTextActive]}>Month</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.periodOption, selectedPeriod === 'year' && styles.periodActive]}
        onPress={() => setSelectedPeriod('year')}
      >
        <Text style={[styles.periodText, selectedPeriod === 'year' && styles.periodTextActive]}>Year</Text>
      </TouchableOpacity>
    </View>
  );

  const ReportCard = ({ title, icon, color, children, onPress }) => (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Card style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <Text style={styles.reportTitle}>{title}</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </View>
        {children}
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Reports</Text>
        <Text style={styles.headerSubtitle}>Track your health trends over time</Text>
      </View>

      {/* Period Selector */}
      <PeriodSelector />

      {/* Weekly Summary Card */}
      <ReportCard
        title="Weekly Health Summary"
        icon="calendar"
        color={colors.primarySaffron}
        onPress={() => handleViewReport('weekly')}
      >
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Avg HR</Text>
            <Text style={styles.summaryValue}>{reports.weekly.avgHeartRate} bpm</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Avg Stress</Text>
            <Text style={styles.summaryValue}>{reports.weekly.avgStress}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Avg Sleep</Text>
            <Text style={styles.summaryValue}>{reports.weekly.avgSleep}h</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Steps</Text>
            <Text style={styles.summaryValue}>{reports.weekly.stepsTotal}</Text>
          </View>
        </View>
      </ReportCard>

      {/* Monthly Summary Card */}
      <ReportCard
        title="Monthly Health Summary"
        icon="calendar"
        color={colors.primaryGreen}
        onPress={() => handleViewReport('monthly')}
      >
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Avg HR</Text>
            <Text style={styles.summaryValue}>{reports.monthly.avgHeartRate} bpm</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Avg Stress</Text>
            <Text style={styles.summaryValue}>{reports.monthly.avgStress}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Avg Sleep</Text>
            <Text style={styles.summaryValue}>{reports.monthly.avgSleep}h</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Dosha</Text>
            <Text style={styles.summaryValue}>{reports.monthly.dominantDosha}</Text>
          </View>
        </View>
      </ReportCard>

      {/* Stress Report Card */}
      <ReportCard
        title="Stress Report"
        icon="flash"
        color={colors.stressPurple}
        onPress={() => handleViewReport('stress')}
      >
        <View style={styles.stressStats}>
          <View style={styles.stressTrend}>
            <Ionicons
              name={reports.stress.trend === 'down' ? 'arrow-down' : 'arrow-up'}
              size={20}
              color={reports.stress.trend === 'down' ? colors.successGreen : colors.alertRed}
            />
            <Text style={styles.stressChange}>{reports.stress.change}% vs previous</Text>
          </View>
          <View style={styles.stressDays}>
            <View style={styles.dayBadge}>
              <Text style={[styles.dayCount, { color: colors.alertRed }]}>{reports.stress.highDays}</Text>
              <Text style={styles.dayLabel}>High</Text>
            </View>
            <View style={styles.dayBadge}>
              <Text style={[styles.dayCount, { color: colors.warningYellow }]}>{reports.stress.moderateDays}</Text>
              <Text style={styles.dayLabel}>Moderate</Text>
            </View>
            <View style={styles.dayBadge}>
              <Text style={[styles.dayCount, { color: colors.successGreen }]}>{reports.stress.lowDays}</Text>
              <Text style={styles.dayLabel}>Low</Text>
            </View>
          </View>
        </View>
      </ReportCard>

      {/* Dosha Report Card */}
      <ReportCard
        title="Dosha Balance Report"
        icon="leaf"
        color={colors.primaryGreen}
        onPress={() => handleViewReport('dosha')}
      >
        <View style={styles.doshaPreview}>
          <View style={styles.doshaBar}>
            <View style={[styles.doshaSegment, { backgroundColor: colors.vata, width: `${reports.dosha.vata}%` }]} />
            <View style={[styles.doshaSegment, { backgroundColor: colors.pitta, width: `${reports.dosha.pitta}%` }]} />
            <View style={[styles.doshaSegment, { backgroundColor: colors.kapha, width: `${reports.dosha.kapha}%` }]} />
          </View>
          <View style={styles.doshaLabels}>
            <Text style={[styles.doshaLabel, { color: colors.vata }]}>Vata {reports.dosha.vata}%</Text>
            <Text style={[styles.doshaLabel, { color: colors.pitta }]}>Pitta {reports.dosha.pitta}%</Text>
            <Text style={[styles.doshaLabel, { color: colors.kapha }]}>Kapha {reports.dosha.kapha}%</Text>
          </View>
          <Text style={styles.recommendationsCount}>{reports.dosha.recommendations} new recommendations</Text>
        </View>
      </ReportCard>

      {/* Activity Report Card */}
      <ReportCard
        title="Activity Report"
        icon="walk"
        color={colors.heartRate}
        onPress={() => handleViewReport('activity')}
      >
        <View style={styles.activityStats}>
          <View style={styles.activityItem}>
            <Text style={styles.activityLabel}>Avg Daily Steps</Text>
            <Text style={styles.activityValue}>{reports.activity.avgSteps}</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityLabel}>Goal Achievement</Text>
            <Text style={styles.activityValue}>
              {Math.round((reports.activity.avgSteps / reports.activity.goal) * 100)}%
            </Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityLabel}>Active Days</Text>
            <Text style={styles.activityValue}>{reports.activity.activeDays}</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityLabel}>Sedentary Days</Text>
            <Text style={styles.activityValue}>{reports.activity.sedentaryDays}</Text>
          </View>
        </View>
      </ReportCard>

      {/* Export Options */}
      <Card style={styles.exportCard}>
        <Text style={styles.exportTitle}>Export Reports</Text>
        <View style={styles.exportOptions}>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="document-text" size={20} color={colors.primarySaffron} />
            <Text style={styles.exportButtonText}>PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="share" size={20} color={colors.primarySaffron} />
            <Text style={styles.exportButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="print" size={20} color={colors.primarySaffron} />
            <Text style={styles.exportButtonText}>Print</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.cardBeige,
    marginHorizontal: 20,
    borderRadius: 30,
    padding: 4,
    marginBottom: 16,
  },
  periodOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 26,
  },
  periodActive: {
    backgroundColor: colors.primarySaffron,
  },
  periodText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: 'white',
  },
  reportCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportTitle: {
    flex: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  summaryValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 4,
  },
  stressStats: {
    marginTop: 4,
  },
  stressTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stressChange: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  stressDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayBadge: {
    alignItems: 'center',
  },
  dayCount: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  dayLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  doshaPreview: {
    marginTop: 4,
  },
  doshaBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  doshaSegment: {
    height: '100%',
  },
  doshaLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  doshaLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  recommendationsCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  activityStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityItem: {
    width: '48%',
    marginBottom: 8,
  },
  activityLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  activityValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  exportCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
  },
  exportTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  exportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  exportButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: `${colors.primarySaffron}10`,
    borderRadius: 20,
  },
  exportButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.primarySaffron,
    marginTop: 4,
  },
  bottomPadding: {
    height: 30,
  },
});

export default ReportsScreen;