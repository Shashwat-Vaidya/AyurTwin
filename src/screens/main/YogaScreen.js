import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
import { useApp } from '../../context/AppContext';
import { getYogaRecommendations, buildYogaSession } from '../../services/api';

const SESSION_TYPES = [
  { key: 'morning', label: '🌅 Morning', desc: 'Energizing Surya flow' },
  { key: 'evening', label: '🌙 Evening', desc: 'Gentle wind-down' },
  { key: 'therapeutic', label: '💊 Therapeutic', desc: 'Healing-focused' },
];

const PoseItem = ({ pose, idx }) => (
  <View style={styles.poseCard}>
    <View style={styles.poseRow}>
      <View style={styles.poseIdx}><Text style={styles.poseIdxText}>{idx + 1}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.poseName}>{pose.name}</Text>
        {pose.sanskrit && <Text style={styles.poseSanskrit}>{pose.sanskrit}</Text>}
        <Text style={styles.poseMeta}>
          {pose.category} · {pose.duration} · {pose.difficulty || 'all levels'}
        </Text>
        {pose.reasons?.length > 0 && (
          <Text style={styles.poseReason}>✓ {pose.reasons[0]}</Text>
        )}
      </View>
    </View>
  </View>
);

const Section = ({ title, poses, emoji }) => {
  if (!poses?.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{emoji} {title}</Text>
      {poses.map((p, i) => <PoseItem key={i} pose={p} idx={i} />)}
    </View>
  );
};

const YogaScreen = ({ navigation }) => {
  const { state } = useApp();
  const userId = state.user?.id;
  const [sessionType, setSessionType] = useState('morning');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [session, setSession] = useState(null);

  const load = async (type) => {
    if (!userId) return;
    setLoading(true);
    const recs = await getYogaRecommendations(userId, type);
    if (recs.success) setData(recs.data);
    const sess = await buildYogaSession(userId, type, 30);
    if (sess.success) setSession(sess.data.session);
    setLoading(false);
  };

  useEffect(() => { load(sessionType); }, [userId, sessionType]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🧘 Yoga Practice</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabsRow}>
        {SESSION_TYPES.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, sessionType === t.key && styles.tabBtnActive]}
            onPress={() => setSessionType(t.key)}
          >
            <Text style={[styles.tabLabel, sessionType === t.key && styles.tabLabelActive]}>
              {t.label}
            </Text>
            <Text style={styles.tabDesc}>{t.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Building your session...</Text>
        </View>
      ) : (
        <>
          {session && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Today's {sessionType} session</Text>
              <Text style={styles.summaryDuration}>⏱️ ~{session.estimated_duration} minutes</Text>
              {session.dosha_tips?.length > 0 && (
                <View style={styles.tipsBox}>
                  <Text style={styles.tipsTitle}>💡 Dosha Tips</Text>
                  {session.dosha_tips.map((tip, i) => (
                    <Text key={i} style={styles.tip}>• {tip}</Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {session && (
            <>
              <Section title="Warm-up" poses={session.warmup} emoji="🔥" />
              <Section title="Main Sequence" poses={session.main_sequence} emoji="💪" />
              <Section title="Pranayama" poses={session.pranayama} emoji="🌬️" />
              <Section title="Meditation" poses={session.meditation} emoji="🕉️" />
              <Section title="Cool Down" poses={session.cooldown} emoji="❄️" />
              {session.savasana && (
                <Section title="Savasana" poses={[session.savasana]} emoji="😌" />
              )}
            </>
          )}

          {data?.all_recommendations?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📚 All Recommended Poses</Text>
              {data.all_recommendations.slice(0, 10).map((p, i) => (
                <PoseItem key={i} pose={{ ...p, duration: `${Math.round((p.duration_seconds || 30) / 60)} min` }} idx={i} />
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { padding: SIZES.xl, alignItems: 'center' },
  loadingText: { ...FONTS.caption, marginTop: SIZES.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.screenPadding, paddingTop: 50 },
  back: { fontSize: 28 },
  title: { ...FONTS.title, fontSize: 20 },
  tabsRow: { flexDirection: 'row', paddingHorizontal: SIZES.md, gap: 6 },
  tabBtn: { flex: 1, padding: SIZES.sm, borderRadius: SIZES.borderRadius, backgroundColor: COLORS.surface, alignItems: 'center', ...SHADOWS.small },
  tabBtnActive: { backgroundColor: COLORS.secondary },
  tabLabel: { ...FONTS.bold, fontSize: 13 },
  tabLabelActive: { color: '#fff' },
  tabDesc: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  summaryCard: { backgroundColor: COLORS.surface, margin: SIZES.md, padding: SIZES.md, borderRadius: SIZES.borderRadius, ...SHADOWS.small },
  summaryTitle: { ...FONTS.bold, textTransform: 'capitalize' },
  summaryDuration: { ...FONTS.caption, marginTop: 4 },
  tipsBox: { marginTop: SIZES.sm, backgroundColor: COLORS.background, padding: SIZES.sm, borderRadius: 8 },
  tipsTitle: { ...FONTS.bold, fontSize: 13, marginBottom: 4 },
  tip: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  section: { marginHorizontal: SIZES.md, marginBottom: SIZES.md },
  sectionTitle: { ...FONTS.bold, fontSize: 15, marginBottom: SIZES.sm },
  poseCard: { backgroundColor: COLORS.surface, padding: SIZES.sm, borderRadius: SIZES.borderRadius, marginBottom: 6, ...SHADOWS.small },
  poseRow: { flexDirection: 'row', alignItems: 'center' },
  poseIdx: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: SIZES.sm },
  poseIdxText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  poseName: { ...FONTS.bold, fontSize: 14 },
  poseSanskrit: { fontSize: 11, color: COLORS.primary, fontStyle: 'italic' },
  poseMeta: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  poseReason: { fontSize: 11, color: COLORS.success, marginTop: 2 },
});

export default YogaScreen;
