import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';
import { useApp } from '../../context/AppContext';
import { calculateHealthScore, calculateBMI } from '../../utils/healthCalculations';

const { width } = Dimensions.get('window');

const HealthJourneyScreen = ({ navigation }) => {
  const { state } = useApp();
  const user = state.user || {};
  const regData = state.registrationData || {};
  const profile = { ...user, ...regData };

  const currentScore = calculateHealthScore(profile);
  const bmi = calculateBMI(profile.weight_kg, profile.height_cm);

  // Simulated weekly journey data (12 weeks)
  const [journeyData, setJourneyData] = useState([]);

  useEffect(() => {
    const data = [];
    let score = Math.max(30, currentScore - 25);
    for (let i = 1; i <= 12; i++) {
      const improvement = Math.floor(Math.random() * 5) + 1;
      score = Math.min(100, score + improvement);
      data.push({
        week: i,
        healthScore: score,
        weight: (profile.weight_kg || 70) - (i * 0.2) + (Math.random() * 0.5 - 0.25),
        stressLevel: Math.max(2, (profile.stress_level || 6) - (i * 0.3) + (Math.random() * 1)),
        sleepQuality: Math.min(10, 5 + (i * 0.3) + (Math.random() * 0.5)),
        bmi: bmi.value - (i * 0.1) + (Math.random() * 0.2 - 0.1),
      });
    }
    setJourneyData(data);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 75) return COLORS.success;
    if (score >= 50) return COLORS.warning;
    return COLORS.error;
  };

  const milestones = [
    { week: 1, label: 'Profile Created', icon: '', done: true },
    { week: 2, label: 'First Full Week', icon: '', done: true },
    { week: 4, label: '1 Month Streak', icon: '', done: journeyData.length >= 4 },
    { week: 8, label: '2 Month Journey', icon: '⭐', done: journeyData.length >= 8 },
    { week: 12, label: '3 Month Champion', icon: '', done: journeyData.length >= 12 },
  ];

  const latestWeek = journeyData[journeyData.length - 1] || {};
  const firstWeek = journeyData[0] || {};
  const scoreImprovement = latestWeek.healthScore - (firstWeek.healthScore || 0);
  const weightChange = ((firstWeek.weight || 70) - (latestWeek.weight || 70)).toFixed(1);
  const stressChange = ((firstWeek.stressLevel || 6) - (latestWeek.stressLevel || 4)).toFixed(1);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={COLORS.gradient.health} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Journey</Text>
        <Text style={styles.headerSubtitle}>Track your improvement over time</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Current Score Card */}
        <Card variant="elevated"style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <View style={[styles.scoreCircle, { borderColor: getScoreColor(currentScore) }]}>
              <Text style={[styles.scoreValue, { color: getScoreColor(currentScore) }]}>{currentScore}</Text>
              <Text style={styles.scoreLabel}>Current</Text>
            </View>
            <View style={styles.scoreStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: scoreImprovement >= 0 ? COLORS.success : COLORS.error }]}>
                  {scoreImprovement >= 0 ? '+' : ''}{scoreImprovement}
                </Text>
                <Text style={styles.statLabel}>Score Change</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: COLORS.info }]}>
                  {parseFloat(weightChange) > 0 ? '-' : '+'}{Math.abs(weightChange)} kg
                </Text>
                <Text style={styles.statLabel}>Weight Change</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: parseFloat(stressChange) > 0 ? COLORS.success : COLORS.error }]}>
                  {parseFloat(stressChange) > 0 ? '-' : '+'}{Math.abs(stressChange)}
                </Text>
                <Text style={styles.statLabel}>Stress Change</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Progress Graph (Bar Chart) */}
        <Text style={styles.sectionTitle}>Health Score Progress</Text>
        <Card variant="elevated">
          <View style={styles.chartContainer}>
            {journeyData.map((d, i) => (
              <View key={i} style={styles.chartCol}>
                <Text style={styles.chartValue}>{d.healthScore}</Text>
                <View style={styles.chartBarWrapper}>
                  <View style={[styles.chartBar, {
                    height: `${d.healthScore}%`,
                    backgroundColor: getScoreColor(d.healthScore),
                  }]} />
                </View>
                <Text style={styles.chartLabel}>W{d.week}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Weight Trend */}
        <Text style={styles.sectionTitle}>Weight Trend</Text>
        <Card variant="elevated">
          <View style={styles.trendRow}>
            {journeyData.map((d, i) => (
              <View key={i} style={styles.trendCol}>
                <View style={[styles.trendDot, {
                  bottom: `${((d.weight - 55) / 40) * 100}%`,
                  backgroundColor: COLORS.info,
                }]} />
              </View>
            ))}
          </View>
          <View style={styles.trendLabels}>
            <Text style={styles.trendLabelText}>{firstWeek.weight?.toFixed(1) || '--'} kg</Text>
            <Text style={styles.trendArrow}>→</Text>
            <Text style={[styles.trendLabelText, { color: COLORS.success }]}>{latestWeek.weight?.toFixed(1) || '--'} kg</Text>
          </View>
        </Card>

        {/* Stress Level Trend */}
        <Text style={styles.sectionTitle}>Stress Level Trend</Text>
        <Card variant="elevated">
          <View style={styles.stressGrid}>
            {journeyData.map((d, i) => (
              <View key={i} style={styles.stressCol}>
                <View style={[styles.stressBar, {
                  height: `${d.stressLevel * 10}%`,
                  backgroundColor: d.stressLevel > 7 ? COLORS.error : d.stressLevel > 4 ? COLORS.warning : COLORS.success,
                }]} />
                <Text style={styles.stressLabel}>W{d.week}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Sleep Quality Trend */}
        <Text style={styles.sectionTitle}>Sleep Quality Trend</Text>
        <Card variant="elevated">
          <View style={styles.sleepGrid}>
            {journeyData.map((d, i) => (
              <View key={i} style={styles.sleepItem}>
                <View style={[styles.sleepCircle, {
                  backgroundColor: d.sleepQuality >= 7 ? COLORS.success + '30' : d.sleepQuality >= 5 ? COLORS.warning + '30' : COLORS.error + '30',
                  borderColor: d.sleepQuality >= 7 ? COLORS.success : d.sleepQuality >= 5 ? COLORS.warning : COLORS.error,
                }]}>
                  <Text style={styles.sleepValue}>{d.sleepQuality.toFixed(0)}</Text>
                </View>
                <Text style={styles.sleepLabel}>W{d.week}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Milestones */}
        <Text style={styles.sectionTitle}>Milestones</Text>
        <Card variant="elevated">
          {milestones.map((m, i) => (
            <View key={i} style={styles.milestoneRow}>
              <View style={[styles.milestoneIconBox, m.done && styles.milestoneIconDone]}>
                <Text style={styles.milestoneIcon}>{m.done ? m.icon : ''}</Text>
              </View>
              <View style={styles.milestoneConnector}>
                <View style={[styles.milestoneLine, m.done && styles.milestoneLineDone]} />
              </View>
              <View style={styles.milestoneInfo}>
                <Text style={[styles.milestoneLabel, m.done && styles.milestoneLabelDone]}>{m.label}</Text>
                <Text style={styles.milestoneWeek}>Week {m.week}</Text>
              </View>
              {m.done && <Text style={styles.milestoneCheck}></Text>}
            </View>
          ))}
        </Card>

        {/* Weekly Summary Table */}
        <Text style={styles.sectionTitle}>Weekly Data Log</Text>
        <Card variant="outlined">
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Week</Text>
            <Text style={styles.tableHeaderCell}>Score</Text>
            <Text style={styles.tableHeaderCell}>Weight</Text>
            <Text style={styles.tableHeaderCell}>Stress</Text>
            <Text style={styles.tableHeaderCell}>Sleep</Text>
          </View>
          {journeyData.map((d, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
              <Text style={styles.tableCell}>W{d.week}</Text>
              <Text style={[styles.tableCell, { color: getScoreColor(d.healthScore), fontWeight: '700' }]}>{d.healthScore}</Text>
              <Text style={styles.tableCell}>{d.weight.toFixed(1)}</Text>
              <Text style={styles.tableCell}>{d.stressLevel.toFixed(1)}</Text>
              <Text style={styles.tableCell}>{d.sleepQuality.toFixed(1)}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.disclaimer}>
          This app provides preventive health insights and does not replace professional medical advice.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: SIZES.screenPadding, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 14, color: '#FFFFFFCC', fontWeight: '600' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: '#FFFFFFCC' },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 22, marginBottom: 10 },
  // Score Card
  scoreCard: { marginTop: -16 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  scoreCircle: { width: 90, height: 90, borderRadius: 45, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  scoreValue: { fontSize: 30, fontWeight: '800' },
  scoreLabel: { fontSize: 10, color: COLORS.textSecondary },
  scoreStats: { flex: 1, gap: 8 },
  statItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '800' },
  statLabel: { fontSize: 11, color: COLORS.textSecondary },
  // Chart
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140, paddingTop: 20 },
  chartCol: { alignItems: 'center', flex: 1 },
  chartValue: { fontSize: 8, color: COLORS.textLight, marginBottom: 2 },
  chartBarWrapper: { width: 14, height: 100, justifyContent: 'flex-end' },
  chartBar: { width: '100%', borderRadius: 7, minHeight: 4 },
  chartLabel: { fontSize: 8, color: COLORS.textLight, marginTop: 4 },
  // Weight trend
  trendRow: { flexDirection: 'row', height: 80, alignItems: 'flex-end', paddingVertical: 10 },
  trendCol: { flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  trendDot: { width: 8, height: 8, borderRadius: 4, position: 'absolute' },
  trendLabels: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 8 },
  trendLabelText: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  trendArrow: { fontSize: 16, color: COLORS.textLight },
  // Stress
  stressGrid: { flexDirection: 'row', height: 80, alignItems: 'flex-end', gap: 2 },
  stressCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  stressBar: { width: '80%', borderRadius: 4, minHeight: 2 },
  stressLabel: { fontSize: 8, color: COLORS.textLight, marginTop: 4 },
  // Sleep
  sleepGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  sleepItem: { alignItems: 'center' },
  sleepCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  sleepValue: { fontSize: 12, fontWeight: '700', color: COLORS.text },
  sleepLabel: { fontSize: 8, color: COLORS.textLight, marginTop: 2 },
  // Milestones
  milestoneRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  milestoneIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  milestoneIconDone: { backgroundColor: COLORS.success + '20' },
  milestoneIcon: { fontSize: 20 },
  milestoneConnector: { width: 20, alignItems: 'center' },
  milestoneLine: { width: 2, height: 20, backgroundColor: COLORS.border },
  milestoneLineDone: { backgroundColor: COLORS.success },
  milestoneInfo: { flex: 1, marginLeft: 8 },
  milestoneLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  milestoneLabelDone: { color: COLORS.text },
  milestoneWeek: { fontSize: 11, color: COLORS.textSecondary },
  milestoneCheck: { fontSize: 16 },
  // Table
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 8, marginBottom: 4 },
  tableHeaderCell: { flex: 1, fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, textAlign: 'center' },
  tableRow: { flexDirection: 'row', paddingVertical: 7 },
  tableRowAlt: { backgroundColor: COLORS.background },
  tableCell: { flex: 1, fontSize: 12, color: COLORS.text, textAlign: 'center' },
  disclaimer: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 24, lineHeight: 14 },
});

export default HealthJourneyScreen;
