import React, { useState, useEffect } from 'react';
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
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StressChart from '../../components/charts/StressChart';

const { width } = Dimensions.get('window');

const StressDetail = () => {
  const navigation = useNavigation();

  // State for time range
  const [selectedRange, setSelectedRange] = useState('week'); // 'day', 'week', 'month', 'year'
  const [stressData, setStressData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [45, 52, 48, 55, 49, 47, 44],
  });

  // Stats
  const stats = {
    current: 45,
    min: 32,
    max: 68,
    avg: 47,
    baseline: 40,
  };

  // Time range options
  const ranges = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ];

  useEffect(() => {
    loadDataForRange(selectedRange);
  }, [selectedRange]);

  const loadDataForRange = (range) => {
    // Mock data - replace with actual API call
    if (range === 'day') {
      setStressData({
        labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '11pm'],
        values: [32, 28, 35, 45, 52, 48, 38],
      });
    } else if (range === 'week') {
      setStressData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [45, 52, 48, 55, 49, 47, 44],
      });
    } else if (range === 'month') {
      setStressData({
        labels: ['W1', 'W2', 'W3', 'W4'],
        values: [47, 49, 45, 48],
      });
    } else {
      setStressData({
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        values: [47, 48, 46, 49, 47, 46],
      });
    }
  };

  // Get status color based on stress level
  const getStatusColor = (value) => {
    if (value <= 30) return colors.successGreen;
    if (value <= 50) return colors.warningYellow;
    if (value <= 70) return colors.tempOrange;
    return colors.alertRed;
  };

  const getStatusText = (value) => {
    if (value <= 30) return 'Low';
    if (value <= 50) return 'Moderate';
    if (value <= 70) return 'High';
    return 'Severe';
  };

  const getStatusMessage = (value) => {
    if (value <= 30) return 'You are feeling relaxed';
    if (value <= 50) return 'Manageable stress levels';
    if (value <= 70) return 'Consider stress reduction techniques';
    return 'High stress - take action immediately';
  };

  const getStressReductionTip = (value) => {
    if (value <= 30) return 'Maintain your current routine';
    if (value <= 50) return 'Try deep breathing exercises';
    if (value <= 70) return 'Take a break and meditate';
    return 'Seek support and practice relaxation';
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
          <Text style={styles.headerTitle}>Stress Details</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Current Reading Card */}
        <Card style={styles.currentCard}>
          <LinearGradient
            colors={[colors.stressPurple, '#B78CB9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.currentGradient}
          >
            <View style={styles.currentHeader}>
              <Text style={styles.currentLabel}>Current Stress Level</Text>
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Live</Text>
              </View>
            </View>
            
            <View style={styles.currentValueContainer}>
              <Text style={styles.currentValue}>{stats.current}</Text>
              <Text style={styles.currentUnit}>/100</Text>
            </View>

            <View style={styles.currentStatus}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(stats.current) }]} />
              <Text style={styles.statusText}>{getStatusText(stats.current)}</Text>
            </View>

            <Text style={styles.statusMessage}>{getStatusMessage(stats.current)}</Text>
          </LinearGradient>
        </Card>

        {/* Quick Tip */}
        <Card style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color={colors.warningYellow} />
          <Text style={styles.tipText}>{getStressReductionTip(stats.current)}</Text>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Minimum</Text>
            <Text style={[styles.statValue, { color: colors.successGreen }]}>{stats.min}</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Maximum</Text>
            <Text style={[styles.statValue, { color: colors.alertRed }]}>{stats.max}</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Average</Text>
            <Text style={[styles.statValue, { color: colors.primarySaffron }]}>{stats.avg}</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Baseline</Text>
            <Text style={[styles.statValue, { color: colors.stressPurple }]}>{stats.baseline}</Text>
          </Card>
        </View>

        {/* Time Range Selector */}
        <View style={styles.rangeContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {ranges.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.rangeTab,
                  selectedRange === range.id && styles.rangeTabActive,
                ]}
                onPress={() => setSelectedRange(range.id)}
              >
                <Text
                  style={[
                    styles.rangeText,
                    selectedRange === range.id && styles.rangeTextActive,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stress Chart */}
        <StressChart
          data={stressData}
          timeRange={selectedRange}
          height={220}
        />

        {/* Stress Level Guide */}
        <Text style={styles.sectionTitle}>Stress Level Guide</Text>
        
        <Card style={styles.guideCard}>
          <View style={styles.guideItem}>
            <View style={[styles.guideLevel, { backgroundColor: colors.successGreen }]}>
              <Text style={styles.guideLevelText}>0-30</Text>
            </View>
            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>Low Stress</Text>
              <Text style={styles.guideDesc}>Relaxed, calm, balanced</Text>
            </View>
          </View>
          
          <View style={styles.guideItem}>
            <View style={[styles.guideLevel, { backgroundColor: colors.warningYellow }]}>
              <Text style={styles.guideLevelText}>31-50</Text>
            </View>
            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>Moderate Stress</Text>
              <Text style={styles.guideDesc}>Manageable, normal daily stress</Text>
            </View>
          </View>
          
          <View style={styles.guideItem}>
            <View style={[styles.guideLevel, { backgroundColor: colors.tempOrange }]}>
              <Text style={styles.guideLevelText}>51-70</Text>
            </View>
            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>High Stress</Text>
              <Text style={styles.guideDesc}>May affect health, needs attention</Text>
            </View>
          </View>
          
          <View style={styles.guideItem}>
            <View style={[styles.guideLevel, { backgroundColor: colors.alertRed }]}>
              <Text style={styles.guideLevelText}>71-100</Text>
            </View>
            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>Severe Stress</Text>
              <Text style={styles.guideDesc}>Take immediate action to reduce</Text>
            </View>
          </View>
        </Card>

        {/* Stress Reduction Techniques */}
        <Text style={styles.sectionTitle}>Stress Reduction Techniques</Text>
        
        <View style={styles.techniquesGrid}>
          <Card style={styles.techniqueCard}>
            <Ionicons name="leaf" size={32} color={colors.primaryGreen} />
            <Text style={styles.techniqueTitle}>Meditation</Text>
            <Text style={styles.techniqueDesc}>10 min guided meditation</Text>
            <TouchableOpacity style={styles.techniqueButton}>
              <Text style={styles.techniqueButtonText}>Start</Text>
            </TouchableOpacity>
          </Card>
          
          <Card style={styles.techniqueCard}>
            <Ionicons name="water" size={32} color={colors.spO2Blue} />
            <Text style={styles.techniqueTitle}>Breathing</Text>
            <Text style={styles.techniqueDesc}>Deep breathing exercises</Text>
            <TouchableOpacity style={styles.techniqueButton}>
              <Text style={styles.techniqueButtonText}>Start</Text>
            </TouchableOpacity>
          </Card>
          
          <Card style={styles.techniqueCard}>
            <Ionicons name="fitness" size={32} color={colors.heartRate} />
            <Text style={styles.techniqueTitle}>Yoga</Text>
            <Text style={styles.techniqueDesc}>Gentle stretching</Text>
            <TouchableOpacity style={styles.techniqueButton}>
              <Text style={styles.techniqueButtonText}>Start</Text>
            </TouchableOpacity>
          </Card>
          
          <Card style={styles.techniqueCard}>
            <Ionicons name="headset" size={32} color={colors.stressPurple} />
            <Text style={styles.techniqueTitle}>Music</Text>
            <Text style={styles.techniqueDesc}>Calming playlist</Text>
            <TouchableOpacity style={styles.techniqueButton}>
              <Text style={styles.techniqueButtonText}>Listen</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Factors Affecting Stress */}
        <Card style={styles.factorsCard}>
          <Text style={styles.factorsTitle}>Common Stress Triggers</Text>
          
          <View style={styles.factorItem}>
            <Ionicons name="briefcase" size={20} color={colors.textSecondary} />
            <Text style={styles.factorText}>Work pressure</Text>
            <Text style={styles.factorValue}>High</Text>
          </View>
          
          <View style={styles.factorItem}>
            <Ionicons name="moon" size={20} color={colors.textSecondary} />
            <Text style={styles.factorText}>Sleep quality</Text>
            <Text style={styles.factorValue}>Moderate</Text>
          </View>
          
          <View style={styles.factorItem}>
            <Ionicons name="people" size={20} color={colors.textSecondary} />
            <Text style={styles.factorText}>Social interactions</Text>
            <Text style={styles.factorValue}>Low</Text>
          </View>
          
          <View style={styles.factorItem}>
            <Ionicons name="fitness" size={20} color={colors.textSecondary} />
            <Text style={styles.factorText}>Exercise</Text>
            <Text style={styles.factorValue}>Moderate</Text>
          </View>
        </Card>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Ionicons name="analytics" size={22} color={colors.primarySaffron} />
            <Text style={styles.insightsTitle}>Stress Patterns</Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={18} color={colors.alertRed} />
            <Text style={styles.insightText}>
              Stress peaks in the afternoon (2-4 PM)
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-down" size={18} color={colors.successGreen} />
            <Text style={styles.insightText}>
              Lower stress on weekends
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="repeat" size={18} color={colors.primaryGreen} />
            <Text style={styles.insightText}>
              Your stress follows a weekly pattern
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Export Data"
            onPress={() => {}}
            style={styles.exportButton}
            outline
            icon="download-outline"
          />
          <Button
            title="Set Alert"
            onPress={() => {}}
            style={styles.alertButton}
            gradient
            icon="notifications-outline"
          />
        </View>

        {/* Recommendation */}
        <Card style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <Ionicons name="heart" size={24} color={colors.heartRate} />
            <Text style={styles.recommendationTitle}>Personalized Recommendation</Text>
          </View>
          <Text style={styles.recommendationText}>
            Based on your stress patterns, try taking short breaks during 
            afternoon hours. A 5-minute breathing exercise at 2 PM could 
            help reduce your peak stress levels.
          </Text>
        </Card>
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
  infoButton: {
    padding: 8,
  },
  currentCard: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  currentGradient: {
    padding: 20,
  },
  currentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  currentBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
  },
  currentValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: 'white',
  },
  currentUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: 'white',
    marginLeft: 8,
    opacity: 0.8,
  },
  currentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  statusMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'white',
    opacity: 0.8,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.warningYellow,
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 2,
  },
  rangeContainer: {
    marginBottom: 16,
  },
  rangeTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  rangeTabActive: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  rangeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  rangeTextActive: {
    color: 'white',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  guideCard: {
    padding: 16,
    marginBottom: 20,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  guideLevel: {
    width: 60,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  guideLevelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  guideDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  techniquesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  techniqueCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  techniqueTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  techniqueDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: 12,
  },
  techniqueButton: {
    backgroundColor: colors.primarySaffron,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 15,
  },
  techniqueButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
  },
  factorsCard: {
    padding: 16,
    marginBottom: 16,
  },
  factorsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  factorText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  factorValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  insightsCard: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(155, 107, 158, 0.05)',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  exportButton: {
    flex: 1,
    marginRight: 8,
  },
  alertButton: {
    flex: 1,
    marginLeft: 8,
  },
  recommendationCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 77, 109, 0.05)',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  recommendationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default StressDetail;