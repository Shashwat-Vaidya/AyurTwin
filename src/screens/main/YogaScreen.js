import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../config/theme';
import Card from '../../components/common/Card';
import { getYogaRecommendations } from '../../services/api';

const TABS = [
  { key: 'morning',     label: 'Morning',     ion: 'sunny-outline' },
  { key: 'evening',     label: 'Evening',     ion: 'moon-outline' },
  { key: 'therapeutic', label: 'Therapeutic', ion: 'medical-outline' },
];

export default function YogaScreen({ navigation }) {
  const [tab, setTab] = useState('morning');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => { (async () => {
    setLoading(true);
    const r = await getYogaRecommendations();
    if (r.success) setData(r.data); else setErr(r.error);
    setLoading(false);
  })(); }, []);

  const list = data?.[tab] || [];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={COLORS.gradient.saffron} style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Ionicons name="body-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Yoga & Meditation</Text>
        </View>
        <Text style={styles.subtitle}>
          {data ? `Personalized for prakriti: ${cap(data.prakriti)} · dominant: ${cap(data.dominant_dosha)}` : ' '}
        </Text>
      </LinearGradient>

      <View style={styles.tabRow}>
        {TABS.map(t => (
          <TouchableOpacity key={t.key} style={[styles.tab, tab === t.key && styles.tabActive]} onPress={() => setTab(t.key)}>
            <Ionicons name={t.ion} size={16} color={tab === t.key ? '#FFF' : COLORS.text} style={{ marginBottom: 2 }} />
            <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>
      ) : err ? (
        <Text style={styles.empty}>{err}</Text>
      ) : list.length === 0 ? (
        <Text style={styles.empty}>No practices recommended for this time. Switch tab.</Text>
      ) : (
        <View style={{ padding: 16 }}>
          {list.map((y, i) => (
            <Card key={`${y.name}-${i}`} variant="elevated" style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.name}>{y.name}</Text>
                <View style={[styles.badge, badgeColor(y.intensity)]}>
                  <Text style={styles.badgeText}>{y.intensity}</Text>
                </View>
              </View>
              <Text style={styles.meta}>{cap(y.type)} · {y.duration_min} min</Text>
              {y.benefits?.length > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Ionicons name="sparkles-outline" size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
                  <Text style={[styles.benefits, { marginTop: 0 }]}>{y.benefits.join(' · ')}</Text>
                </View>
              )}
              <View style={styles.scoreBar}>
                <View style={[styles.scoreFill, { width: `${(y.score || 0) * 100}%` }]} />
              </View>
              <Text style={styles.scoreText}>match score: {Math.round((y.score || 0) * 100)}%</Text>
            </Card>
          ))}
        </View>
      )}

      <Text style={styles.footer}>
        Recommendations are derived from your prakriti, current stress/sleep/activity, and predicted disease risks.
      </Text>
    </ScrollView>
  );
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function badgeColor(intensity) {
  if (intensity === 'high') return { backgroundColor: '#FEE2E2', borderColor: COLORS.error };
  if (intensity === 'medium') return { backgroundColor: '#FFEDD5', borderColor: COLORS.warning };
  return { backgroundColor: '#DCFCE7', borderColor: COLORS.success };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 24, paddingTop: 56, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  back: { marginBottom: 4 }, backText: { color: '#FFF', fontWeight: '700' },
  title: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#FFFFFFCC', fontSize: 12, marginTop: 4 },
  tabRow: { flexDirection: 'row', padding: 12 },
  tab: { flex: 1, padding: 10, marginHorizontal: 4, backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#EEE', alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabLabel: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  tabLabelActive: { color: '#FFF' },
  center: { padding: 40, alignItems: 'center' },
  empty: { textAlign: 'center', color: COLORS.textSecondary, padding: 24 },
  card: { padding: 14, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.text, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  meta: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
  benefits: { fontSize: 12, color: COLORS.text, marginTop: 6, fontStyle: 'italic' },
  scoreBar: { height: 6, backgroundColor: '#EEE', borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  scoreFill: { height: '100%', backgroundColor: COLORS.primary },
  scoreText: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4 },
  footer: { fontSize: 11, color: COLORS.textSecondary, fontStyle: 'italic', textAlign: 'center', padding: 16 },
});
