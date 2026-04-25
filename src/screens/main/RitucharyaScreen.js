import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../config/theme';
import Card from '../../components/common/Card';
import { getRitucharya } from '../../services/api';

const SEASON_INFO = {
  summer:  { icon: '☀️', sanskrit: 'Grishma',  hint: 'Cooling foods, hydration, light meals' },
  monsoon: { icon: '🌧️', sanskrit: 'Varsha',   hint: 'Warm cooked food, ginger tea, boost agni' },
  autumn:  { icon: '🍂', sanskrit: 'Sharad',    hint: 'Reduce pitta — sweet, bitter, astringent' },
  winter:  { icon: '❄️', sanskrit: 'Hemanta',  hint: 'Warming, oily, nourishing rasayanas' },
  spring:  { icon: '🌸', sanskrit: 'Vasanta',  hint: 'Light, dry, bitter — burn off kapha' },
};

const COLORS_BUCKET = {
  best: '#16A34A', good: '#65A30D', moderate: '#D97706', avoid: '#DC2626',
};
const LABEL_BUCKET = {
  best: '✅ Best — eat freely',
  good: '👍 Good',
  moderate: '⚖️ Moderate — sometimes',
  avoid: '❌ Avoid in this season',
};

export default function RitucharyaScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => { (async () => {
    const r = await getRitucharya();
    if (r.success) setData(r.data); else setErr(r.error);
    setLoading(false);
  })(); }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;
  if (err)     return <View style={styles.center}><Text>{err}</Text></View>;

  const seasonKey = data?.season || 'autumn';
  const info = SEASON_INFO[seasonKey] || SEASON_INFO.autumn;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={COLORS.gradient.saffron} style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}><Text style={styles.back}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>🍂 Ritucharya</Text>
        <Text style={styles.subtitle}>Seasonal diet for {cap(data?.prakriti)} (dominant: {cap(data?.dominant_dosha)})</Text>
      </LinearGradient>

      <View style={styles.hero}>
        <Text style={styles.heroIcon}>{info.icon}</Text>
        <Text style={styles.heroSeason}>{cap(seasonKey)}</Text>
        <Text style={styles.heroSanskrit}>({info.sanskrit})</Text>
        <Text style={styles.heroHint}>{info.hint}</Text>
      </View>

      {['best', 'good', 'moderate', 'avoid'].map(bucket => (
        <View key={bucket} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS_BUCKET[bucket] }]}>
            {LABEL_BUCKET[bucket]}  ({(data?.[bucket] || []).length})
          </Text>
          {(data?.[bucket] || []).slice(0, 30).map((f, i) => (
            <View key={`${bucket}-${i}`} style={[styles.foodChip, { borderColor: COLORS_BUCKET[bucket] + '55' }]}>
              <Text style={styles.foodName}>{f.name}</Text>
              {f.properties?.length > 0 && (
                <Text style={styles.foodProps}>· {f.properties.join(' · ')}</Text>
              )}
            </View>
          ))}
          {!data?.[bucket]?.length && <Text style={styles.empty}>—</Text>}
        </View>
      ))}

      <Text style={styles.footer}>
        Computed from current season + your prakriti + digestion strength + body-temp tendency. Backend re-evaluates every refresh.
      </Text>
    </ScrollView>
  );
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { padding: 24, paddingTop: 56, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  back: { color: '#FFF', fontWeight: '700' },
  title: { color: '#FFF', fontSize: 22, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#FFFFFFCC', fontSize: 12, marginTop: 2 },
  hero: { alignItems: 'center', padding: 24, backgroundColor: '#FFF', margin: 16, borderRadius: 16 },
  heroIcon: { fontSize: 56 },
  heroSeason: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginTop: 6 },
  heroSanskrit: { fontSize: 13, color: COLORS.textSecondary },
  heroHint: { fontSize: 12, color: COLORS.text, marginTop: 8, textAlign: 'center', fontStyle: 'italic' },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
  foodChip: { backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 6, borderWidth: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  foodName: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  foodProps: { fontSize: 10, color: COLORS.textSecondary, marginLeft: 6 },
  empty: { color: COLORS.textSecondary, fontStyle: 'italic' },
  footer: { fontSize: 11, color: COLORS.textSecondary, fontStyle: 'italic', textAlign: 'center', padding: 16 },
});
