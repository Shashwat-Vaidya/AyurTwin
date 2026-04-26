import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Platform, Linking,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';
import { useApp } from '../../context/AppContext';
import { getReportPdfUrl } from '../../services/api';
import {
  calculateHealthScore, generateDiseaseRisks, detectDoshaImbalance,
  generateSimulatedVitals, generateTimelineData,
} from '../../utils/healthCalculations';

const { width } = Dimensions.get('window');
const TABS = ['Weekly', 'Monthly', 'Stress', 'Dosha', 'Risk'];

const ReportsScreen = ({ navigation }) => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('Weekly');
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const { url, token } = await getReportPdfUrl();
      const fname = `ayurtwin-report-${Date.now()}.pdf`;
      const dest = FileSystem.documentDirectory + fname;
      const res = await FileSystem.downloadAsync(url, dest, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status !== 200) throw new Error(`download failed (${res.status})`);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(res.uri, { mimeType: 'application/pdf', dialogTitle: 'AyurTwin Health Report' });
      } else if (Platform.OS === 'web') {
        Linking.openURL(res.uri);
      } else {
        Alert.alert('Saved', `Report saved to ${res.uri}`);
      }
    } catch (e) {
      Alert.alert('Download failed', e.message || 'Please try again');
    } finally {
      setDownloading(false);
    }
  };
  const profile = { ...state.user, ...(state.registrationData || {}) };
  const healthScore = calculateHealthScore(profile);
  const risks = generateDiseaseRisks(profile);
  const vitals = generateSimulatedVitals(profile);
  const dosha = detectDoshaImbalance(state.prakritiResult, profile);
  const timeData = generateTimelineData(24);

  // Simulated weekly averages
  const weeklyAvg = {
    heartRate: 74, temperature: 36.6, spo2: 97, stress: 48,
    sleepHours: profile.sleep_duration_hours || 7, activity: profile.exercise_minutes || 30,
    healthScore, caloriesAvg: 1850,
  };

  const renderWeekly = () => (
    <View>
      <Card variant="elevated"style={styles.summaryCard}>
        <Text style={styles.reportTitle}>Weekly Health Summary</Text>
        <Text style={styles.reportDate}>{getDateRange('week')}</Text>

        <View style={styles.scoreHighlight}>
          <View style={[styles.scoreBigCircle, { borderColor: getScoreColor(healthScore) }]}>
            <Text style={[styles.scoreBig, { color: getScoreColor(healthScore) }]}>{healthScore}</Text>
            <Text style={styles.scoreBigLabel}>Score</Text>
          </View>
          <Text style={[styles.scoreStatus, { color: getScoreColor(healthScore) }]}>
            {healthScore >= 70 ? 'Good Health' : healthScore >= 50 ? 'Moderate' : 'Needs Attention'}
          </Text>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Vital Averages</Text>
      <View style={styles.avgGrid}>
        <AvgCard label="Heart Rate"value={`${weeklyAvg.heartRate}`} unit="bpm"icon=""color={COLORS.heart} />
        <AvgCard label="Temperature"value={`${weeklyAvg.temperature}`} unit="°C"icon=""color={COLORS.temp} />
        <AvgCard label="SpO2"value={`${weeklyAvg.spo2}`} unit="%"icon=""color={COLORS.spo2} />
        <AvgCard label="Stress"value={`${weeklyAvg.stress}`} unit="idx"icon=""color={COLORS.stress} />
        <AvgCard label="Sleep"value={`${weeklyAvg.sleepHours}`} unit="hrs"icon=""color={COLORS.info} />
        <AvgCard label="Activity"value={`${weeklyAvg.activity}`} unit="min"icon=""color={COLORS.success} />
      </View>

      <Text style={styles.sectionTitle}>Daily Breakdown</Text>
      <Card variant="outlined">
        <View style={styles.breakdownHeader}>
          <Text style={styles.breakdownCell}>Day</Text>
          <Text style={styles.breakdownCell}>HR</Text>
          <Text style={styles.breakdownCell}>Stress</Text>
          <Text style={styles.breakdownCell}>Sleep</Text>
          <Text style={styles.breakdownCell}>Score</Text>
        </View>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
          const hr = 68 + Math.floor(Math.random() * 20);
          const st = 30 + Math.floor(Math.random() * 40);
          const sl = 5 + Math.floor(Math.random() * 4);
          const sc = 55 + Math.floor(Math.random() * 35);
          return (
            <View key={day} style={[styles.breakdownRow, i % 2 === 0 && styles.breakdownRowAlt]}>
              <Text style={styles.breakdownCell}>{day}</Text>
              <Text style={styles.breakdownCell}>{hr}</Text>
              <Text style={styles.breakdownCell}>{st}</Text>
              <Text style={styles.breakdownCell}>{sl}h</Text>
              <Text style={[styles.breakdownCell, { fontWeight: '700', color: getScoreColor(sc) }]}>{sc}</Text>
            </View>
          );
        })}
      </Card>

      <Text style={styles.sectionTitle}>Key Insights</Text>
      <InsightCard icon=""text="Your stress peaked on Wednesday. Consider scheduling relaxation activities mid-week." />
      <InsightCard icon=""text={`Your average health score this week is ${healthScore}. ${healthScore >= 70 ? 'Great job!' : 'Try improving sleep and exercise.'}`} />
      <InsightCard icon=""text={`You averaged ${weeklyAvg.activity} minutes of activity. ${weeklyAvg.activity >= 30 ? 'Keep it up!' : 'Aim for 30+ minutes daily.'}`} />
    </View>
  );

  const renderMonthly = () => (
    <View>
      <Card variant="elevated"style={styles.summaryCard}>
        <Text style={styles.reportTitle}>Monthly Health Summary</Text>
        <Text style={styles.reportDate}>{getDateRange('month')}</Text>

        <View style={styles.monthlyGrid}>
          <View style={styles.monthlyItem}>
            <Text style={styles.monthlyValue}>{healthScore}</Text>
            <Text style={styles.monthlyLabel}>Avg Score</Text>
          </View>
          <View style={styles.monthlyItem}>
            <Text style={[styles.monthlyValue, { color: COLORS.success }]}>+5</Text>
            <Text style={styles.monthlyLabel}>Improvement</Text>
          </View>
          <View style={styles.monthlyItem}>
            <Text style={[styles.monthlyValue, { color: COLORS.info }]}>28</Text>
            <Text style={styles.monthlyLabel}>Active Days</Text>
          </View>
          <View style={styles.monthlyItem}>
            <Text style={[styles.monthlyValue, { color: COLORS.primary }]}>85%</Text>
            <Text style={styles.monthlyLabel}>Consistency</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Monthly Trends</Text>
      <Card variant="elevated">
        <Text style={styles.trendTitle}>Week-by-Week Score</Text>
        <View style={styles.weekBars}>
          {[1, 2, 3, 4].map((w) => {
            const sc = healthScore - 10 + (w * 3) + Math.floor(Math.random() * 5);
            return (
              <View key={w} style={styles.weekBarCol}>
                <Text style={styles.weekBarValue}>{sc}</Text>
                <View style={[styles.weekBar, { height: sc, backgroundColor: getScoreColor(sc) }]} />
                <Text style={styles.weekBarLabel}>W{w}</Text>
              </View>
            );
          })}
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Achievements This Month</Text>
      <AchievementCard icon=""title="30 Day Streak"desc="You've been consistent for 30 days!" />
      <AchievementCard icon=""title="Stress Reduced"desc="Your average stress dropped by 12%" />
      <AchievementCard icon=""title="Better Sleep"desc="Average sleep improved by 30 minutes" />
    </View>
  );

  const renderStress = () => (
    <View>
      <Card variant="elevated"style={styles.summaryCard}>
        <Text style={styles.reportTitle}>Stress Report</Text>
        <View style={styles.stressOverview}>
          <View style={[styles.stressCircle, {
            borderColor: vitals.stressIndex > 60 ? COLORS.error : vitals.stressIndex > 40 ? COLORS.warning : COLORS.success,
          }]}>
            <Text style={[styles.stressValue, {
              color: vitals.stressIndex > 60 ? COLORS.error : vitals.stressIndex > 40 ? COLORS.warning : COLORS.success,
            }]}>{vitals.stressIndex}</Text>
            <Text style={styles.stressLabel}>Current</Text>
          </View>
          <View style={styles.stressInfo}>
            <InfoItem label="Weekly Avg"value="48" />
            <InfoItem label="Monthly Avg"value="52" />
            <InfoItem label="Peak"value="78" />
            <InfoItem label="Lowest"value="22" />
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Stress Patterns</Text>
      <Card variant="elevated">
        <Text style={styles.patternLabel}>Hourly Stress Distribution</Text>
        <View style={styles.hourlyGrid}>
          {timeData.slice(6, 22).map((d, i) => (
            <View key={i} style={styles.hourlyCol}>
              <View style={[styles.hourlyBar, {
                height: `${d.stress}%`,
                backgroundColor: d.stress > 60 ? COLORS.error : d.stress > 40 ? COLORS.warning : COLORS.success,
              }]} />
              <Text style={styles.hourlyLabel}>{d.hour}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Triggers & Recommendations</Text>
      <TriggerCard trigger="Poor Sleep (<6 hrs)"impact="High"recommendation="Improve sleep hygiene. Try warm milk before bed." />
      <TriggerCard trigger="Long Work Hours"impact="Medium"recommendation="Take 5-minute breaks every hour. Practice desk stretches." />
      <TriggerCard trigger="Low Physical Activity"impact="Medium"recommendation="Walk for 20 minutes daily. Try morning yoga." />
    </View>
  );

  const renderDosha = () => (
    <View>
      <Card variant="elevated"style={styles.summaryCard}>
        <Text style={styles.reportTitle}>Dosha Balance Report</Text>
        <View style={styles.doshaVisual}>
          <DoshaCircle label="Vata"percent={dosha.vata || 33} color={COLORS.vata} />
          <DoshaCircle label="Pitta"percent={dosha.pitta || 33} color={COLORS.pitta} />
          <DoshaCircle label="Kapha"percent={dosha.kapha || 33} color={COLORS.kapha} />
        </View>
        <Text style={styles.prakritiLabel}>Prakriti: {state.prakritiResult?.prakriti || 'Not assessed'}</Text>
        {dosha.imbalanceDetected && (
          <View style={styles.imbalanceAlert}>
            <Text style={styles.imbalanceText}> {dosha.dominantImbalance?.charAt(0).toUpperCase() + dosha.dominantImbalance?.slice(1)} imbalance detected</Text>
          </View>
        )}
      </Card>

      <Text style={styles.sectionTitle}>Dosha History</Text>
      <Card variant="elevated">
        {['This Week', 'Last Week', '2 Weeks Ago', '3 Weeks Ago'].map((period, i) => (
          <View key={i} style={styles.doshaHistRow}>
            <Text style={styles.doshaHistPeriod}>{period}</Text>
            <View style={styles.doshaHistBars}>
              <View style={[styles.doshaHistBar, { flex: 33 + (i * 2), backgroundColor: COLORS.vata }]} />
              <View style={[styles.doshaHistBar, { flex: 34 - i, backgroundColor: COLORS.pitta }]} />
              <View style={[styles.doshaHistBar, { flex: 33 - i, backgroundColor: COLORS.kapha }]} />
            </View>
          </View>
        ))}
      </Card>

      <Text style={styles.sectionTitle}>Balancing Tips</Text>
      {dosha.dominantImbalance === 'vata' && <TipCard dosha="Vata"tips={['Warm, cooked foods', 'Regular routine', 'Oil massage (Abhyanga)', 'Avoid cold, dry foods']} />}
      {dosha.dominantImbalance === 'pitta' && <TipCard dosha="Pitta"tips={['Cooling foods (cucumber, mint)', 'Avoid spicy food', 'Moonlight walks', 'Calming meditation']} />}
      {dosha.dominantImbalance === 'kapha' && <TipCard dosha="Kapha"tips={['Light, warm foods', 'Vigorous exercise', 'Avoid daytime sleep', 'Spices like ginger & turmeric']} />}
      {!dosha.dominantImbalance && <TipCard dosha="Balanced"tips={['Maintain current routine', 'Seasonal adjustments', 'Regular exercise', 'Mindful eating']} />}
    </View>
  );

  const renderRisk = () => {
    const sortedRisks = Object.entries(risks).sort((a, b) => b[1] - a[1]);
    return (
      <View>
        <Card variant="elevated"style={styles.summaryCard}>
          <Text style={styles.reportTitle}>Disease Risk Report</Text>
          <Text style={styles.reportNote}>Currently using rule-based logic. ML engine integration in next phase.</Text>
        </Card>

        <Text style={styles.sectionTitle}>All Risk Predictions</Text>
        {sortedRisks.map(([key, value]) => (
          <Card key={key} variant="elevated"style={[styles.riskCard, { borderLeftColor: getRiskColor(value) }]}>
            <View style={styles.riskHeader}>
              <Text style={styles.riskName}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
              <Text style={[styles.riskPercent, { color: getRiskColor(value) }]}>{value}%</Text>
            </View>
            <View style={styles.riskBarTrack}>
              <View style={[styles.riskBarFill, { width: `${value}%`, backgroundColor: getRiskColor(value) }]} />
            </View>
            <Text style={styles.riskAdvice}>
              {value > 70 ? 'High risk — Immediate lifestyle changes recommended' :
               value > 50 ? 'Moderate risk — Monitor and take preventive steps' :
               value > 30 ? 'Low-moderate risk — Maintain healthy habits' :
               'Low risk — Keep up the good work'}
            </Text>
          </Card>
        ))}

        <Text style={styles.sectionTitle}>Contributing Factors</Text>
        <Card variant="elevated">
          <FactorRow factor="BMI"value={profile.bmi ? `${profile.bmi}` : 'N/A'} impact={profile.bmi > 25 ? 'High' : 'Low'} />
          <FactorRow factor="Stress Level"value={`${profile.stress_level || 5}/10`} impact={(profile.stress_level || 5) > 6 ? 'High' : 'Low'} />
          <FactorRow factor="Sleep"value={`${profile.sleep_duration_hours || 7} hrs`} impact={(profile.sleep_duration_hours || 7) < 6 ? 'High' : 'Low'} />
          <FactorRow factor="Physical Activity"value={profile.physical_activity || 'Moderate'} impact={profile.physical_activity === 'low' ? 'High' : 'Low'} />
          <FactorRow factor="Smoking"value={profile.smoking ? 'Yes' : 'No'} impact={profile.smoking ? 'High' : 'None'} />
          <FactorRow factor="Family History"value={hasFamilyHistory(profile) ? 'Present' : 'None'} impact={hasFamilyHistory(profile) ? 'Medium' : 'None'} />
        </Card>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={COLORS.gradient.saffron} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports</Text>
        <TouchableOpacity onPress={handleDownloadPdf} disabled={downloading} style={styles.downloadBtn}>
          <Text style={styles.downloadText}>{downloading ? 'Preparing…' : '⬇︎ Download PDF'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, activeTab === t && styles.tabActive]} onPress={() => setActiveTab(t)}>
            <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.content}>
        {activeTab === 'Weekly' && renderWeekly()}
        {activeTab === 'Monthly' && renderMonthly()}
        {activeTab === 'Stress' && renderStress()}
        {activeTab === 'Dosha' && renderDosha()}
        {activeTab === 'Risk' && renderRisk()}

        <Text style={styles.disclaimer}>
          This app provides preventive health insights and does not replace professional medical advice.
        </Text>
      </View>
    </ScrollView>
  );
};

// --- Helper Components ---
const AvgCard = ({ label, value, unit, icon, color }) => (
  <View style={[styles.avgCard, { borderTopColor: color }]}>
    <Text style={styles.avgIcon}>{icon}</Text>
    <Text style={[styles.avgValue, { color }]}>{value}</Text>
    <Text style={styles.avgUnit}>{unit}</Text>
    <Text style={styles.avgLabel}>{label}</Text>
  </View>
);

const InsightCard = ({ icon, text }) => (
  <Card style={styles.insightCard}>
    <Text style={styles.insightIcon}>{icon}</Text>
    <Text style={styles.insightText}>{text}</Text>
  </Card>
);

const AchievementCard = ({ icon, title, desc }) => (
  <Card variant="elevated"style={styles.achieveCard}>
    <Text style={styles.achieveIcon}>{icon}</Text>
    <View style={styles.achieveInfo}>
      <Text style={styles.achieveTitle}>{title}</Text>
      <Text style={styles.achieveDesc}>{desc}</Text>
    </View>
  </Card>
);

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoItemLabel}>{label}</Text>
    <Text style={styles.infoItemValue}>{value}</Text>
  </View>
);

const TriggerCard = ({ trigger, impact, recommendation }) => (
  <Card style={styles.triggerCard}>
    <View style={styles.triggerHeader}>
      <Text style={styles.triggerName}>{trigger}</Text>
      <View style={[styles.impactBadge, { backgroundColor: impact === 'High' ? COLORS.error + '20' : COLORS.warning + '20' }]}>
        <Text style={[styles.impactText, { color: impact === 'High' ? COLORS.error : COLORS.warning }]}>{impact}</Text>
      </View>
    </View>
    <Text style={styles.triggerRec}>{recommendation}</Text>
  </Card>
);

const DoshaCircle = ({ label, percent, color }) => (
  <View style={styles.doshaCircleItem}>
    <View style={[styles.doshaC, { borderColor: color }]}>
      <Text style={[styles.doshaCValue, { color }]}>{Math.round(percent)}%</Text>
    </View>
    <Text style={[styles.doshaCLabel, { color }]}>{label}</Text>
  </View>
);

const TipCard = ({ dosha, tips }) => (
  <Card variant="elevated">
    <Text style={styles.tipDosha}>{dosha} Balancing Tips:</Text>
    {tips.map((t, i) => (
      <Text key={i} style={styles.tipItem}>• {t}</Text>
    ))}
  </Card>
);

const FactorRow = ({ factor, value, impact }) => (
  <View style={styles.factorRow}>
    <Text style={styles.factorName}>{factor}</Text>
    <Text style={styles.factorValue}>{value}</Text>
    <View style={[styles.factorBadge, {
      backgroundColor: impact === 'High' ? COLORS.error + '15' : impact === 'Medium' ? COLORS.warning + '15' : COLORS.success + '15',
    }]}>
      <Text style={[styles.factorImpact, {
        color: impact === 'High' ? COLORS.error : impact === 'Medium' ? COLORS.warning : COLORS.success,
      }]}>{impact}</Text>
    </View>
  </View>
);

// --- Helpers ---
const getScoreColor = (s) => s >= 70 ? COLORS.success : s >= 50 ? COLORS.warning : COLORS.error;
const getRiskColor = (v) => v > 70 ? COLORS.error : v > 50 ? COLORS.warning : v > 30 ? COLORS.accent : COLORS.success;
const hasFamilyHistory = (p) => p.family_history && Object.values(p.family_history).some(Boolean);
const getDateRange = (type) => {
  const now = new Date();
  if (type === 'week') {
    const start = new Date(now); start.setDate(now.getDate() - 7);
    return `${start.toLocaleDateString()} - ${now.toLocaleDateString()}`;
  }
  return `${new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString()} - ${now.toLocaleDateString()}`;
};

const styles = StyleSheet.create({
  downloadBtn: { marginTop: 12, alignSelf: 'flex-start', backgroundColor: '#FFFFFF33', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  downloadText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: SIZES.screenPadding, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn: { marginBottom: 6 },
  backText: { fontSize: 14, color: '#FFFFFFCC', fontWeight: '600' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  tabScroll: { paddingHorizontal: SIZES.screenPadding, paddingVertical: 12 },
  tab: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: 8, ...SHADOWS.small },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#FFF' },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 40 },
  summaryCard: { marginBottom: 8 },
  reportTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  reportDate: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 16 },
  reportNote: { fontSize: 11, color: COLORS.textLight, fontStyle: 'italic' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 20, marginBottom: 10 },
  // Score
  scoreHighlight: { alignItems: 'center' },
  scoreBigCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  scoreBig: { fontSize: 32, fontWeight: '800' },
  scoreBigLabel: { fontSize: 11, color: COLORS.textSecondary },
  scoreStatus: { fontSize: 16, fontWeight: '700' },
  // Avg Grid
  avgGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  avgCard: { width: (width - 56) / 3, padding: 10, backgroundColor: COLORS.surface, borderRadius: SIZES.borderRadius, alignItems: 'center', borderTopWidth: 3, ...SHADOWS.small },
  avgIcon: { fontSize: 18, marginBottom: 2 },
  avgValue: { fontSize: 18, fontWeight: '800' },
  avgUnit: { fontSize: 10, color: COLORS.textLight },
  avgLabel: { fontSize: 9, color: COLORS.textSecondary, marginTop: 2 },
  // Breakdown
  breakdownHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 8, marginBottom: 4 },
  breakdownRow: { flexDirection: 'row', paddingVertical: 7 },
  breakdownRowAlt: { backgroundColor: COLORS.background },
  breakdownCell: { flex: 1, fontSize: 12, color: COLORS.text, textAlign: 'center' },
  // Insights
  insightCard: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  insightIcon: { fontSize: 22 },
  insightText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  // Monthly
  monthlyGrid: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  monthlyItem: { alignItems: 'center' },
  monthlyValue: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  monthlyLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  weekBars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 120 },
  weekBarCol: { alignItems: 'center' },
  weekBarValue: { fontSize: 11, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  weekBar: { width: 30, borderRadius: 8 },
  weekBarLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  trendTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 12 },
  // Achievement
  achieveCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 14 },
  achieveIcon: { fontSize: 32 },
  achieveInfo: { flex: 1 },
  achieveTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  achieveDesc: { fontSize: 12, color: COLORS.textSecondary },
  // Stress
  stressOverview: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 12 },
  stressCircle: { width: 90, height: 90, borderRadius: 45, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  stressValue: { fontSize: 28, fontWeight: '800' },
  stressLabel: { fontSize: 10, color: COLORS.textSecondary },
  stressInfo: { flex: 1, gap: 6 },
  infoItem: { flexDirection: 'row', justifyContent: 'space-between' },
  infoItemLabel: { fontSize: 13, color: COLORS.textSecondary },
  infoItemValue: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  patternLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  hourlyGrid: { flexDirection: 'row', height: 80, alignItems: 'flex-end', gap: 2 },
  hourlyCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  hourlyBar: { width: '80%', borderRadius: 3, minHeight: 2 },
  hourlyLabel: { fontSize: 7, color: COLORS.textLight, marginTop: 2 },
  // Trigger
  triggerCard: { marginBottom: 8 },
  triggerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  triggerName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  impactBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  impactText: { fontSize: 10, fontWeight: '700' },
  triggerRec: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  // Dosha
  doshaVisual: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 },
  doshaCircleItem: { alignItems: 'center' },
  doshaC: { width: 65, height: 65, borderRadius: 32, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  doshaCValue: { fontSize: 15, fontWeight: '800' },
  doshaCLabel: { fontSize: 13, fontWeight: '700', marginTop: 6 },
  prakritiLabel: { textAlign: 'center', fontSize: 15, fontWeight: '700', color: COLORS.primary },
  imbalanceAlert: { marginTop: 10, padding: 10, backgroundColor: COLORS.warning + '15', borderRadius: 8, alignItems: 'center' },
  imbalanceText: { fontSize: 13, fontWeight: '600', color: COLORS.warning },
  doshaHistRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  doshaHistPeriod: { width: 80, fontSize: 11, color: COLORS.textSecondary },
  doshaHistBars: { flex: 1, flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden' },
  doshaHistBar: { height: '100%' },
  // Tips
  tipDosha: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  tipItem: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22 },
  // Risk
  riskCard: { marginBottom: 10, borderLeftWidth: 4 },
  riskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  riskName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  riskPercent: { fontSize: 18, fontWeight: '800' },
  riskBarTrack: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  riskBarFill: { height: '100%', borderRadius: 4 },
  riskAdvice: { fontSize: 12, color: COLORS.textSecondary, fontStyle: 'italic' },
  // Factors
  factorRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  factorName: { flex: 1, fontSize: 13, color: COLORS.text },
  factorValue: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginRight: 10 },
  factorBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  factorImpact: { fontSize: 10, fontWeight: '700' },
  disclaimer: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 24, lineHeight: 14 },
});

export default ReportsScreen;
