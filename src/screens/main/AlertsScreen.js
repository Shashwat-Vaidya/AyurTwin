import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import { useApp } from '../../context/AppContext';
import {
  generateSimulatedVitals, generateDiseaseRisks, detectDoshaImbalance, generateAlerts,
} from '../../utils/healthCalculations';

const SECTIONS = ['All', 'Active', 'Stress', 'Dosha', 'Risk', 'System'];

const AlertsScreen = () => {
  const { state } = useApp();
  const [activeSection, setActiveSection] = useState('All');
  const [alerts, setAlerts] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    const profile = { ...state.user, ...(state.registrationData || {}) };
    const vitals = generateSimulatedVitals(profile);
    const risks = generateDiseaseRisks(profile);
    const doshaBalance = detectDoshaImbalance(state.prakritiResult, profile);
    const generated = generateAlerts(vitals, risks, doshaBalance);

    // Add some extra simulated alerts
    const extras = [
      { type: 'info', category: 'system', title: 'Health Data Updated', message: 'Your health metrics have been refreshed with latest data.' },
      { type: 'info', category: 'system', title: 'Weekly Report Ready', message: 'Your weekly health report is now available in Reports section.' },
    ];

    const stressLevel = profile.stress_level || 5;
    const sleepHours = profile.sleep_duration_hours || 7;
    const bmi = profile.bmi || 22;

    if (stressLevel > 7) {
      extras.push({ type: 'critical', category: 'stress', title: 'High Stress Alert', message: 'Your stress level is consistently high. Consider meditation and yoga.' });
    }
    if (sleepHours < 5) {
      extras.push({ type: 'warning', category: 'stress', title: 'Sleep Deficit', message: 'You are sleeping less than 5 hours. This increases health risks significantly.' });
    }
    if (bmi > 25) {
      extras.push({ type: 'warning', category: 'risk', title: 'BMI Alert', message: `Your BMI is ${bmi}. Consider increasing physical activity and adjusting diet.` });
    }

    const allAlerts = [...generated, ...extras].map((a, i) => ({ ...a, id: i, time: getRandomTime() }));
    setAlerts(allAlerts);

    // History
    setAlertHistory([
      { type: 'info', category: 'system', title: 'Profile Created', message: 'Your AyurTwin profile has been set up successfully.', time: 'Yesterday' },
      { type: 'info', category: 'dosha', title: 'Prakriti Assessed', message: 'Your dosha constitution has been determined.', time: '2 days ago' },
    ]);
  };

  const getRandomTime = () => {
    const mins = Math.floor(Math.random() * 120);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  const getAlertStyle = (type) => {
    const colors = {
      critical: { border: COLORS.error, bg: '#FFF5F5', icon: 'alert-circle-outline' },
      warning: { border: COLORS.warning, bg: '#FFFBF0', icon: 'warning-outline' },
      info: { border: COLORS.info, bg: '#F0F9FF', icon: 'information-circle-outline' },
    };
    return colors[type] || colors.info;
  };

  const filteredAlerts = activeSection === 'All' ? alerts :
    activeSection === 'Active' ? alerts.filter(a => a.type === 'critical' || a.type === 'warning') :
    alerts.filter(a => a.category === activeSection.toLowerCase());

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        <Text style={styles.subtitle}>{alerts.length} alerts</Text>
      </View>

      {/* Section Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
        {SECTIONS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.tab, activeSection === s && styles.tabActive]}
            onPress={() => setActiveSection(s)}
          >
            <Text style={[styles.tabText, activeSection === s && styles.tabTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.content}>
        {filteredAlerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={48} color={COLORS.success} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No alerts in this category</Text>
          </View>
        ) : (
          filteredAlerts.map((alert) => {
            const style = getAlertStyle(alert.type);
            return (
              <View key={`alert-${alert.id}`} style={[styles.alertCard, { borderLeftColor: style.border, backgroundColor: style.bg }]}>
                <View style={styles.alertHeader}>
                  <Ionicons name={style.icon} size={18} color={style.border} style={styles.alertIcon} />
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <View style={styles.alertFooter}>
                  <View style={[styles.alertBadge, { backgroundColor: style.border + '20' }]}>
                    <Text style={[styles.alertBadgeText, { color: style.border }]}>{alert.type}</Text>
                  </View>
                  <View style={[styles.alertBadge, { backgroundColor: COLORS.primary + '15' }]}>
                    <Text style={[styles.alertBadgeText, { color: COLORS.primary }]}>{alert.category}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}

        {/* Alert History */}
        <Text style={styles.sectionTitle}>Alert History</Text>
        {alertHistory.map((alert, idx) => {
          const style = getAlertStyle(alert.type);
          return (
            <View key={`hist-${idx}`} style={[styles.historyCard]}>
              <Ionicons name={style.icon} size={20} color={style.border} style={styles.historyIcon} />
              <View style={styles.historyInfo}>
                <Text style={styles.historyTitle}>{alert.title}</Text>
                <Text style={styles.historyMessage}>{alert.message}</Text>
              </View>
              <Text style={styles.historyTime}>{alert.time}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingHorizontal: SIZES.screenPadding, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary },
  tabScroll: { paddingHorizontal: SIZES.screenPadding, marginBottom: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: 8, ...SHADOWS.small },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#FFF' },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 30 },
  // Alert Card
  alertCard: {
    borderRadius: SIZES.borderRadius, padding: 16, marginBottom: 10,
    borderLeftWidth: 4, ...SHADOWS.small,
  },
  alertHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  alertIcon: { fontSize: 16, marginRight: 8 },
  alertTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text },
  alertTime: { fontSize: 11, color: COLORS.textLight },
  alertMessage: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  alertFooter: { flexDirection: 'row', gap: 8, marginTop: 10 },
  alertBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  alertBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  // History
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 24, marginBottom: 12 },
  historyCard: {
    flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius, marginBottom: 8, ...SHADOWS.small,
  },
  historyIcon: { fontSize: 20, marginRight: 12 },
  historyInfo: { flex: 1 },
  historyTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  historyMessage: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  historyTime: { fontSize: 11, color: COLORS.textLight },
  // Empty
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary },
  disclaimer: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 24, lineHeight: 14 },
});

export default AlertsScreen;
