import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';
import { useApp } from '../../context/AppContext';
import { getDashboard, getLatestSensor } from '../../services/api';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { state, logout } = useApp();
  const user = state.user || {};
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [sensorData, setSensorData] = useState(null);
  const [risks, setRisks] = useState({});
  const [healthScore, setHealthScore] = useState(0);
  const [doshaBalance, setDoshaBalance] = useState({ vata: 33, pitta: 33, kapha: 34 });
  const [alerts, setAlerts] = useState([]);
  const [dashUser, setDashUser] = useState(null);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    loadDashboard();
    const fast = setInterval(fetchSensor, 5000);     // live sensor every 5s
    const slow = setInterval(loadDashboard, 60000);  // full aggregate every 60s
    return () => { clearInterval(fast); clearInterval(slow); };
  }, []);

  const fetchSensor = async () => {
    if (!user?.id) return;
    const r = await getLatestSensor(user.id);
    if (r.success && r.data?.sensor) {
      const s = r.data.sensor;
      setSensorData({ ...s, temperature: s.body_temperature });
    }
  };

  const loadDashboard = async () => {
    const r = await getDashboard();
    if (!r.success) return;
    const d = r.data;
    setDashUser(d.user);
    setRisks(d.disease_risks || {});
    setHealthScore(d.health_score || 0);
    setDoshaBalance(d.dosha || { vata: 33, pitta: 33, kapha: 34 });
    setAlerts((d.alerts || []).map(a => ({ type: a.severity, title: a.title, message: a.message })));
    if (d.sensor) setSensorData({ ...d.sensor, temperature: d.sensor.body_temperature });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logout, style: 'destructive' },
    ]);
  };

  // Compute movement magnitude from accelerometer
  const getMovementLabel = () => {
    if (!sensorData) return { label: 'Resting', value: '0.0' };
    const ax = sensorData.accel_x || 0;
    const ay = sensorData.accel_y || 0;
    const az = sensorData.accel_z || 0;
    // magnitude minus gravity (~9.81), gives net body movement
    const magnitude = Math.abs(Math.sqrt(ax * ax + ay * ay + az * az) - 9.81);
    const rounded = magnitude.toFixed(2);
    let label = 'Resting';
    if (magnitude > 2.0) label = 'High Activity';
    else if (magnitude > 0.5) label = 'Walking';
    else if (magnitude > 0.1) label = 'Light Movement';
    return { label, value: rounded };
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDoshaBadge = () => {
    const prakriti = dashUser?.prakriti || user.prakriti || state.prakritiResult?.prakriti || 'Unknown';
    return String(prakriti).charAt(0).toUpperCase() + String(prakriti).slice(1);
  };

  const topRisks = Object.entries(risks)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const riskLabel = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const alertColors = { critical: COLORS.error, warning: COLORS.warning, info: COLORS.info };

  return (
    <Animated.ScrollView style={[styles.container, { opacity: fadeAnim }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={COLORS.gradient.saffron} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{dashUser?.full_name || dashUser?.username || user.full_name || user.username || 'User'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => navigation.navigate('MoreTab', { screen: 'Profile' })} style={styles.profileBtn}>
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Text style={styles.logoutIcon}>🚪</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.doshaBadge}>
          <Text style={styles.doshaBadgeText}>🔺 {getDoshaBadge()}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Health Score (tap to see breakdown) */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('HealthScoreBreakdown')}>
          <Card style={styles.healthScoreCard} variant="elevated">
            <View style={styles.healthScoreRow}>
              <View style={styles.healthScoreCircle}>
                <Text style={styles.healthScoreValue}>{healthScore}</Text>
                <Text style={styles.healthScoreLabel}>/ 500</Text>
              </View>
              <View style={styles.healthScoreInfo}>
                <Text style={styles.healthScoreTitle}>Health Score</Text>
                <Text style={[styles.healthScoreStatus, {
                  color: healthScore >= 400 ? COLORS.success : healthScore >= 300 ? COLORS.warning : COLORS.error
                }]}>
                  {healthScore >= 400 ? 'Excellent' : healthScore >= 300 ? 'Good' : healthScore >= 200 ? 'Moderate' : 'Needs Attention'}
                </Text>
                <Text style={styles.healthScoreDesc}>Tap to see how this is calculated →</Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Live Health Cards - fetched from Supabase every 5s */}
        <Text style={styles.sectionTitle}>Live Sensor Data</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vitalScroll}>
          <VitalCard icon="❤️" label="Heart Rate" value={`${sensorData?.heart_rate || '--'}`} unit="bpm" color={COLORS.heart} />
          <VitalCard icon="🌡️" label="Temperature" value={`${sensorData?.temperature || '--'}`} unit="°C" color={COLORS.temp} />
          <VitalCard icon="🫁" label="SpO2" value={`${sensorData?.spo2 || '--'}`} unit="%" color={COLORS.spo2} />
          <VitalCard icon="🏃" label="Body Motion" value={getMovementLabel().value} unit={getMovementLabel().label} color={COLORS.stress} />
        </ScrollView>

        {/* Recent Alerts */}
        {alerts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            {alerts.slice(0, 3).map((alert, idx) => (
              <View key={idx} style={[styles.alertCard, { borderLeftColor: alertColors[alert.type] || COLORS.info }]}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertMessage}>{alert.message}</Text>
              </View>
            ))}
          </>
        )}

        {/* Feature Cards */}
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureGrid}>
          <FeatureCard icon="🧠" title="AI Disease Prediction" desc="ML-powered risk analysis" onPress={() => navigation.navigate('MetricsTab')} />
          <FeatureCard icon="🔺" title="Dosha Detail" desc="Track your Ayurvedic profile" onPress={() => navigation.navigate('DoshaDetail')} />
          <FeatureCard icon="🌿" title="Lifestyle Guidance" desc="Personalized routines" onPress={() => navigation.navigate('LifestyleTab')} />
          <FeatureCard icon="📊" title="Smart Monitoring" desc="Real-time health tracking" onPress={() => navigation.navigate('MetricsTab')} />
          <FeatureCard icon="📈" title="Health Journey" desc="Track your progress" onPress={() => navigation.navigate('HealthJourney')} />
          <FeatureCard icon="💡" title="Smart Insights" desc="Personalized intelligence" onPress={() => navigation.navigate('SmartInsights')} />
          <FeatureCard icon="👨‍👩‍👧" title="Family Dashboard" desc="Monitor loved ones" onPress={() => navigation.navigate('Family')} />
          <FeatureCard icon="🏆" title="Leaderboard" desc="Community motivation" onPress={() => navigation.navigate('Leaderboard')} />
          <FeatureCard icon="🌐" title="Social Feed" desc="Share achievements" onPress={() => navigation.navigate('Social')} />
        </View>

        {/* Top 3 Disease Risks */}
        <Text style={styles.sectionTitle}>Top Disease Risks</Text>
        <Card style={styles.riskCard} variant="elevated">
          {topRisks.map(([key, value]) => (
            <TouchableOpacity key={key} style={styles.riskRow} activeOpacity={0.7}
              onPress={() => navigation.navigate('DiseaseRiskBreakdown', { disease: key })}>
              <Text style={styles.riskLabel}>{riskLabel(key)}</Text>
              <View style={styles.riskBarTrack}>
                <View style={[styles.riskBarFill, {
                  width: `${value}%`,
                  backgroundColor: value > 70 ? COLORS.error : value > 50 ? COLORS.warning : COLORS.success,
                }]} />
              </View>
              <Text style={[styles.riskPercent, {
                color: value > 70 ? COLORS.error : value > 50 ? COLORS.warning : COLORS.success,
              }]}>{value}%</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Smart Insights */}
        <TouchableOpacity onPress={() => navigation.navigate('SmartInsights')} activeOpacity={0.8}>
          <Text style={styles.sectionTitle}>Smart Insights →</Text>
          <Card style={styles.insightCard}>
            <Text style={styles.insightIcon}>💡</Text>
            <Text style={styles.insightText}>
              {sensorData?.heart_rate > 90
                ? 'Your heart rate is elevated. Take a break and practice deep breathing.'
                : sensorData?.spo2 < 96
                ? 'Your SpO2 is low. Practice deep breathing exercises and get fresh air.'
                : healthScore < 60
                ? 'Your health score needs improvement. Focus on sleep and exercise.'
                : 'You are doing well! Keep maintaining your healthy habits.'}
            </Text>
          </Card>
        </TouchableOpacity>

        {/* Dosha Balance Preview */}
        <TouchableOpacity onPress={() => navigation.navigate('DoshaDetail')} activeOpacity={0.8}>
          <Text style={styles.sectionTitle}>Dosha Balance →</Text>
        </TouchableOpacity>
        <Card variant="elevated">
          <View style={styles.doshaPreviewRow}>
            <DoshaBar label="Vata" percent={doshaBalance.vata || 33} color={COLORS.vata} />
            <DoshaBar label="Pitta" percent={doshaBalance.pitta || 33} color={COLORS.pitta} />
            <DoshaBar label="Kapha" percent={doshaBalance.kapha || 33} color={COLORS.kapha} />
          </View>
          {doshaBalance.imbalanceDetected && (
            <Text style={styles.doshaWarning}>
              ⚠️ {doshaBalance.dominantImbalance?.charAt(0).toUpperCase() + doshaBalance.dominantImbalance?.slice(1)} imbalance detected
            </Text>
          )}
        </Card>

        <Text style={styles.disclaimer}>
          This app provides preventive health insights and does not replace professional medical advice.
        </Text>
        <Text style={[styles.disclaimer, { marginTop: 4, fontWeight: '600' }]}>
          Developed by Shashwat Developers Group (SDG 2.0)
        </Text>
      </View>
    </Animated.ScrollView>
  );
};

const VitalCard = ({ icon, label, value, unit, color }) => (
  <View style={[styles.vitalCard, { borderTopColor: color }]}>
    <Text style={styles.vitalIcon}>{icon}</Text>
    <Text style={[styles.vitalValue, { color }]}>{value}</Text>
    <Text style={styles.vitalUnit}>{unit}</Text>
    <Text style={styles.vitalLabel}>{label}</Text>
  </View>
);

const FeatureCard = ({ icon, title, desc, onPress }) => (
  <TouchableOpacity style={styles.featureCard} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDesc}>{desc}</Text>
  </TouchableOpacity>
);

const DoshaBar = ({ label, percent, color }) => (
  <View style={styles.doshaBarItem}>
    <Text style={[styles.doshaBarLabel, { color }]}>{label}</Text>
    <View style={styles.doshaBarTrack}>
      <View style={[styles.doshaBarFill, { height: `${Math.min(percent, 100)}%`, backgroundColor: color }]} />
    </View>
    <Text style={[styles.doshaBarPercent, { color }]}>{Math.round(percent)}%</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: SIZES.screenPadding, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 14, color: '#FFFFFFCC', fontWeight: '500' },
  userName: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  headerActions: { flexDirection: 'row', gap: 8 },
  profileBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF30', alignItems: 'center', justifyContent: 'center' },
  profileIcon: { fontSize: 22 },
  logoutBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF30', alignItems: 'center', justifyContent: 'center' },
  logoutIcon: { fontSize: 20 },
  doshaBadge: { marginTop: 12, alignSelf: 'flex-start', backgroundColor: '#FFFFFF30', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16 },
  doshaBadgeText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  content: { padding: SIZES.screenPadding, paddingTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12, marginTop: 20 },
  // Health Score
  healthScoreCard: { marginBottom: 8 },
  healthScoreRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  healthScoreCircle: {
    width: 90, height: 90, borderRadius: 45, borderWidth: 4, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  healthScoreValue: { fontSize: 28, fontWeight: '800', color: COLORS.primary },
  healthScoreLabel: { fontSize: 9, color: COLORS.textSecondary },
  healthScoreInfo: { flex: 1 },
  healthScoreTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  healthScoreStatus: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  healthScoreDesc: { fontSize: 11, color: COLORS.textLight, marginTop: 4 },
  // Vital Cards
  vitalScroll: { marginBottom: 8 },
  vitalCard: {
    width: 110, padding: 14, backgroundColor: COLORS.surface, borderRadius: SIZES.borderRadiusLg,
    alignItems: 'center', marginRight: 12, borderTopWidth: 3, ...SHADOWS.small,
  },
  vitalIcon: { fontSize: 24, marginBottom: 6 },
  vitalValue: { fontSize: 22, fontWeight: '800' },
  vitalUnit: { fontSize: 11, color: COLORS.textLight },
  vitalLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
  // Alerts
  alertCard: {
    backgroundColor: COLORS.surface, borderRadius: SIZES.borderRadius, padding: 14,
    marginBottom: 8, borderLeftWidth: 4, ...SHADOWS.small,
  },
  alertTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  alertMessage: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  // Features
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: {
    width: (width - 52) / 2, padding: 16, backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadiusLg, ...SHADOWS.small,
  },
  featureIcon: { fontSize: 28, marginBottom: 8 },
  featureTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  featureDesc: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  // Risks
  riskCard: { padding: 16 },
  riskRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  riskLabel: { width: 100, fontSize: 13, fontWeight: '500', color: COLORS.text },
  riskBarTrack: { flex: 1, height: 8, backgroundColor: COLORS.border, borderRadius: 4, marginHorizontal: 10, overflow: 'hidden' },
  riskBarFill: { height: '100%', borderRadius: 4 },
  riskPercent: { width: 40, textAlign: 'right', fontSize: 14, fontWeight: '700' },
  // Insights
  insightCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  insightIcon: { fontSize: 28 },
  insightText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  // Dosha
  doshaPreviewRow: { flexDirection: 'row', justifyContent: 'space-around', height: 120 },
  doshaBarItem: { alignItems: 'center', width: 60 },
  doshaBarLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  doshaBarTrack: { flex: 1, width: 24, backgroundColor: COLORS.border, borderRadius: 12, overflow: 'hidden', justifyContent: 'flex-end' },
  doshaBarFill: { width: '100%', borderRadius: 12 },
  doshaBarPercent: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  doshaWarning: { fontSize: 12, color: COLORS.warning, textAlign: 'center', marginTop: 12, fontWeight: '600' },
  disclaimer: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 24, marginBottom: 30, lineHeight: 14 },
});

export default DashboardScreen;
