import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';
import { useApp } from '../../context/AppContext';
import {
  generateSimulatedVitals, generateDiseaseRisks, generateTimelineData,
  detectDoshaImbalance,
} from '../../utils/healthCalculations';
import { getLatestSensor } from '../../services/api';

const { width } = Dimensions.get('window');

const FILTERS = ['Day', 'Week', 'Month', 'Year'];

const DISEASES = [
  { key: 'diabetes', label: 'Diabetes', ion: 'water-outline' },
  { key: 'hypertension', label: 'Hypertension', ion: 'pulse-outline' },
  { key: 'heart_disease', label: 'Heart Disease', ion: 'heart-outline' },
  { key: 'stress', label: 'Stress', ion: 'flash-outline' },
  { key: 'sleep_disorder', label: 'Sleep Disorder', ion: 'moon-outline' },
  { key: 'asthma', label: 'Asthma', ion: 'cloud-outline' },
  { key: 'arthritis', label: 'Arthritis', ion: 'body-outline' },
  { key: 'obesity', label: 'Obesity', ion: 'scale-outline' },
  { key: 'digestive_disorder', label: 'Digestive Disorder', ion: 'restaurant-outline' },
  { key: 'fever', label: 'Fever', ion: 'thermometer-outline' },
];

const MetricsScreen = () => {
  const { state } = useApp();
  const [activeFilter, setActiveFilter] = useState('Day');
  const [vitals, setVitals] = useState({});
  const [risks, setRisks] = useState({});
  const [doshaBalance, setDoshaBalance] = useState({});
  const [timelineData, setTimelineData] = useState([]);

  const refreshSensor = async () => {
    if (!state.user?.id) return;
    try {
      const r = await getLatestSensor(state.user.id);
      if (r.success && r.data?.sensor) {
        const s = r.data.sensor;
        setVitals(prev => ({
          ...prev,
          heartRate: s.heart_rate ?? prev.heartRate,
          spo2: s.spo2 ?? prev.spo2,
          temperature: s.body_temperature ?? prev.temperature,
        }));
      } else if (!r.success) {
        console.warn('[MetricsScreen] Failed to fetch sensor:', r.error);
      }
    } catch (error) {
      console.error('[MetricsScreen] Sensor fetch error:', error);
    }
  };

  useEffect(() => {
    loadData();
    // Live sensor refresh every 5s
    const tick = setInterval(refreshSensor, 5000);
    return () => clearInterval(tick);
  }, [activeFilter, state.user?.id]);

  const loadData = () => {
    const profile = { ...state.user, ...(state.registrationData || {}) };
    setVitals(generateSimulatedVitals(profile));
    setRisks(generateDiseaseRisks(profile));
    setDoshaBalance(detectDoshaImbalance(state.prakritiResult, profile));

    const hours = activeFilter === 'Day' ? 24 : activeFilter === 'Week' ? 168 : 720;
    setTimelineData(generateTimelineData(Math.min(hours, 24)));
    refreshSensor();
  };

  const getRiskColor = (v) => v > 70 ? COLORS.error : v > 50 ? COLORS.warning : v > 30 ? COLORS.accent : COLORS.success;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Metrics</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricBox ion="heart-outline" label="Heart Rate" value={vitals.heartRate || 72} unit="bpm" color={COLORS.heart} />
          <MetricBox ion="cloud-outline" label="SpO2" value={vitals.spo2 || 98} unit="%" color={COLORS.spo2} />
          <MetricBox ion="thermometer-outline" label="Temp" value={vitals.temperature || 36.6} unit="°C" color={COLORS.temp} />
          <MetricBox ion="flash-outline" label="Stress" value={vitals.stressIndex || 45} unit="idx" color={COLORS.stress} />
          <MetricBox ion="moon-outline" label="Sleep" value={state.registrationData?.sleep_duration_hours || 7} unit="hrs" color={COLORS.info} />
          <MetricBox ion="walk-outline" label="Activity" value={state.registrationData?.exercise_minutes || 30} unit="min" color={COLORS.success} />
        </View>

        {/* Heart Rate Chart (Simplified) */}
        <Text style={styles.sectionTitle}>Heart Rate Trend</Text>
        <Card variant="elevated">
          <View style={styles.chartContainer}>
            {timelineData.slice(0, 12).map((d, i) => (
              <View key={i} style={styles.chartBarContainer}>
                <View style={[styles.chartBar, {
                  height: ((d.heartRate - 55) / 50) * 80,
                  backgroundColor: d.heartRate > 85 ? COLORS.error : COLORS.heart,
                }]} />
                <Text style={styles.chartLabel}>{d.hour}h</Text>
              </View>
            ))}
          </View>
          <Text style={styles.chartCaption}>Current: {vitals.heartRate || 72} bpm</Text>
        </Card>

        {/* Stress vs Sleep Chart */}
        <Text style={styles.sectionTitle}>Stress vs Sleep</Text>
        <Card variant="elevated">
          <View style={styles.compareRow}>
            <View style={styles.compareItem}>
              <View style={[styles.compareCircle, { borderColor: COLORS.stress }]}>
                <Text style={[styles.compareValue, { color: COLORS.stress }]}>{vitals.stressIndex || 45}</Text>
              </View>
              <Text style={styles.compareLabel}>Stress Index</Text>
            </View>
            <View style={styles.compareVs}><Text style={styles.compareVsText}>vs</Text></View>
            <View style={styles.compareItem}>
              <View style={[styles.compareCircle, { borderColor: COLORS.info }]}>
                <Text style={[styles.compareValue, { color: COLORS.info }]}>{state.registrationData?.sleep_duration_hours || 7}h</Text>
              </View>
              <Text style={styles.compareLabel}>Sleep Duration</Text>
            </View>
          </View>
        </Card>

        {/* Dosha Trend */}
        <Text style={styles.sectionTitle}>Dosha Balance Trend</Text>
        <Card variant="elevated">
          <View style={styles.doshaTriangle}>
            <DoshaHBar label="Vata" percent={doshaBalance.vata || 33} color={COLORS.vata} />
            <DoshaHBar label="Pitta" percent={doshaBalance.pitta || 33} color={COLORS.pitta} />
            <DoshaHBar label="Kapha" percent={doshaBalance.kapha || 33} color={COLORS.kapha} />
          </View>
        </Card>

        {/* Data Log */}
        <Text style={styles.sectionTitle}>Simulated Data Log</Text>
        <Card variant="outlined">
          <View style={styles.logHeader}>
            <Text style={styles.logHeaderText}>Time</Text>
            <Text style={styles.logHeaderText}>HR</Text>
            <Text style={styles.logHeaderText}>SpO2</Text>
            <Text style={styles.logHeaderText}>Temp</Text>
            <Text style={styles.logHeaderText}>Stress</Text>
          </View>
          {timelineData.slice(0, 8).map((d, i) => (
            <View key={i} style={styles.logRow}>
              <Text style={styles.logCell}>{d.label}</Text>
              <Text style={styles.logCell}>{d.heartRate}</Text>
              <Text style={styles.logCell}>{d.spo2}</Text>
              <Text style={styles.logCell}>{d.temp.toFixed(1)}</Text>
              <Text style={styles.logCell}>{d.stress}</Text>
            </View>
          ))}
        </Card>

        {/* All Disease Predictions */}
        <Text style={styles.sectionTitle}>All Disease Predictions</Text>
        <Text style={styles.sectionNote}>In next phase: integrated with ML prediction engine</Text>
        {DISEASES.map((disease) => {
          const value = risks[disease.key] || 0;
          return (
            <View key={disease.key} style={styles.diseaseRow}>
              <Ionicons name={disease.ion} size={18} color={getRiskColor(value)} style={styles.diseaseIcon} />
              <Text style={styles.diseaseLabel}>{disease.label}</Text>
              <View style={styles.diseaseBarTrack}>
                <View style={[styles.diseaseBarFill, { width: `${value}%`, backgroundColor: getRiskColor(value) }]} />
              </View>
              <Text style={[styles.diseasePercent, { color: getRiskColor(value) }]}>{value}%</Text>
            </View>
          );
        })}

        <Text style={styles.disclaimer}>
          This app provides preventive health insights and does not replace professional medical advice.
        </Text>
      </View>
    </ScrollView>
  );
};

const MetricBox = ({ ion, label, value, unit, color }) => (
  <View style={[styles.metricBox, { borderTopColor: color }]}>
    <Ionicons name={ion} size={22} color={color} style={styles.metricIcon} />
    <Text style={[styles.metricValue, { color }]}>{value}</Text>
    <Text style={styles.metricUnit}>{unit}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const DoshaHBar = ({ label, percent, color }) => (
  <View style={styles.doshaHRow}>
    <Text style={[styles.doshaHLabel, { color }]}>{label}</Text>
    <View style={styles.doshaHTrack}>
      <View style={[styles.doshaHFill, { width: `${Math.min(percent, 100)}%`, backgroundColor: color }]} />
    </View>
    <Text style={[styles.doshaHPercent, { color }]}>{Math.round(percent)}%</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingHorizontal: SIZES.screenPadding, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  filterRow: { flexDirection: 'row', paddingHorizontal: SIZES.screenPadding, gap: 8, marginBottom: 8 },
  filterTab: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.surface, alignItems: 'center', ...SHADOWS.small },
  filterTabActive: { backgroundColor: COLORS.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  filterTextActive: { color: '#FFF' },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 20, marginBottom: 12 },
  sectionNote: { fontSize: 11, color: COLORS.textLight, marginBottom: 12, fontStyle: 'italic' },
  // Metrics Grid
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricBox: {
    width: (width - 60) / 3, padding: 12, backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius, alignItems: 'center', borderTopWidth: 3, ...SHADOWS.small,
  },
  metricIcon: { marginBottom: 4 },
  metricValue: { fontSize: 20, fontWeight: '800' },
  metricUnit: { fontSize: 10, color: COLORS.textLight },
  metricLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  // Chart
  chartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 100, paddingTop: 8 },
  chartBarContainer: { alignItems: 'center' },
  chartBar: { width: 14, borderRadius: 7, minHeight: 4 },
  chartLabel: { fontSize: 9, color: COLORS.textLight, marginTop: 4 },
  chartCaption: { textAlign: 'center', fontSize: 12, color: COLORS.textSecondary, marginTop: 8, fontWeight: '600' },
  // Compare
  compareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  compareItem: { alignItems: 'center' },
  compareCircle: { width: 70, height: 70, borderRadius: 35, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  compareValue: { fontSize: 18, fontWeight: '800' },
  compareLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 6 },
  compareVs: {},
  compareVsText: { fontSize: 14, fontWeight: '700', color: COLORS.textLight },
  // Dosha
  doshaTriangle: { gap: 12 },
  doshaHRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  doshaHLabel: { width: 50, fontSize: 13, fontWeight: '700' },
  doshaHTrack: { flex: 1, height: 12, backgroundColor: COLORS.border, borderRadius: 6, overflow: 'hidden' },
  doshaHFill: { height: '100%', borderRadius: 6 },
  doshaHPercent: { width: 40, fontSize: 13, fontWeight: '700', textAlign: 'right' },
  // Log
  logHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 8, marginBottom: 6 },
  logHeaderText: { flex: 1, fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, textAlign: 'center' },
  logRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  logCell: { flex: 1, fontSize: 12, color: COLORS.text, textAlign: 'center' },
  // Diseases
  diseaseRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  diseaseIcon: { fontSize: 18 },
  diseaseLabel: { width: 110, fontSize: 13, fontWeight: '500', color: COLORS.text },
  diseaseBarTrack: { flex: 1, height: 10, backgroundColor: COLORS.border, borderRadius: 5, overflow: 'hidden' },
  diseaseBarFill: { height: '100%', borderRadius: 5 },
  diseasePercent: { width: 38, fontSize: 13, fontWeight: '700', textAlign: 'right' },
  disclaimer: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 24, lineHeight: 14 },
});

export default MetricsScreen;
