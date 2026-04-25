import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../config/theme';
import Card from '../../components/common/Card';
import { getHealthScoreBreakdown } from '../../services/api';

const COMPONENTS = [
  { key: 'base',             label: 'Base score',          desc: 'Starting point for every user' },
  { key: 'vitals',           label: 'Vitals (HR/SpO₂/Temp)', desc: 'Lower deviations from optimal = higher score' },
  { key: 'bmi',              label: 'BMI',                 desc: 'Closer to 18.5–24.9 = higher score' },
  { key: 'lifestyle',        label: 'Lifestyle',           desc: 'Sleep, stress, exercise, water, junk, smoking, alcohol, symptoms' },
  { key: 'disease_penalty',  label: 'Disease risk penalty',desc: 'Subtracted based on ML disease-risk percentages' },
  { key: 'dinacharya_bonus', label: 'Dinacharya adherence',desc: '% of daily routine completed today' },
  { key: 'prakriti_bonus',   label: 'Prakriti alignment',  desc: 'Bonus when overall risks match prakriti balance' },
];

export default function HealthScoreBreakdownScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => { (async () => {
    const r = await getHealthScoreBreakdown();
    if (r.success) setData(r.data); else setErr(r.error);
  })(); }, []);

  if (err) return <View style={styles.center}><Text>{err}</Text></View>;
  if (!data) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

  const total = data.score;
  const max = data.max_score || 500;
  const pct = Math.round(total / max * 100);
  const color = total >= 400 ? COLORS.success : total >= 300 ? COLORS.warning : COLORS.error;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={COLORS.gradient.saffron} style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Health Score Breakdown</Text>
        <Text style={styles.subtitle}>How {total}/{max} was calculated</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Card variant="elevated" style={styles.scoreCard}>
          <Text style={[styles.bigScore, { color }]}>{total}</Text>
          <Text style={styles.outOf}>out of {max} ({pct}%)</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Component Contributions</Text>
        {COMPONENTS.map(c => {
          const v = data.breakdown?.[c.key] ?? 0;
          const positive = v >= 0;
          return (
            <View key={c.key} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{c.label}</Text>
                <Text style={styles.rowDesc}>{c.desc}</Text>
              </View>
              <Text style={[styles.rowValue, { color: positive ? COLORS.success : COLORS.error }]}>
                {positive ? '+' : ''}{v}
              </Text>
            </View>
          );
        })}

        {!!data.explanations?.length && (
          <>
            <Text style={styles.sectionTitle}>Why these numbers</Text>
            <Card>
              {data.explanations.map((e, i) => (
                <Text key={i} style={styles.explainLine}>• {e}</Text>
              ))}
            </Card>
          </>
        )}

        <Text style={styles.formula}>
          Final = 250 (base) + vitals + bmi + lifestyle − disease_penalty + dinacharya_bonus + prakriti_bonus, clamped to 1..500.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { padding: 24, paddingTop: 56, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn: { paddingVertical: 4 }, backText: { color: '#FFF', fontWeight: '700' },
  title: { color: '#FFF', fontSize: 22, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#FFFFFFCC', fontSize: 13 },
  content: { padding: 16 },
  scoreCard: { alignItems: 'center', padding: 20 },
  bigScore: { fontSize: 56, fontWeight: '800' },
  outOf: { color: COLORS.textSecondary, marginBottom: 12 },
  barTrack: { height: 12, backgroundColor: '#EEE', borderRadius: 6, width: '100%', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 6 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 18, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 14, marginBottom: 8, borderRadius: 12 },
  rowLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  rowDesc: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  rowValue: { fontSize: 18, fontWeight: '800', marginLeft: 12, minWidth: 60, textAlign: 'right' },
  explainLine: { fontSize: 12, color: COLORS.textSecondary, marginVertical: 2 },
  formula: { fontSize: 11, color: COLORS.textSecondary, fontStyle: 'italic', marginTop: 16, textAlign: 'center' },
});
