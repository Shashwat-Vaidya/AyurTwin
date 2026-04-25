import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../config/theme';
import Card from '../../components/common/Card';
import { explainDiseaseRisk } from '../../services/api';

const FEATURE_LABELS = {
  age: 'Age', bmi: 'BMI', activity_score: 'Activity score',
  hr: 'Heart rate', spo2: 'SpO₂', temp: 'Body temperature',
  stress: 'Stress level', anxiety: 'Anxiety level', sleep_hours: 'Sleep hours',
  junk_food: 'Junk food intake', smoking: 'Smoking', water_l: 'Water (L/day)',
  exercise_freq: 'Exercise / week',
  fh_diabetes: 'Family history: diabetes', fh_heart: 'Family history: heart',
  fh_hypertension: 'Family history: hypertension', fh_asthma: 'Family history: asthma',
  fh_arthritis: 'Family history: arthritis',
  sym_thirst: 'Symptom: thirst', sym_urination: 'Symptom: urination',
  sym_joint_pain: 'Symptom: joint pain', sym_breath: 'Symptom: breathing',
  sym_digestive: 'Symptom: digestive',
};

export default function DiseaseRiskBreakdownScreen({ route, navigation }) {
  const disease = route?.params?.disease || 'diabetes';
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => { (async () => {
    const r = await explainDiseaseRisk(disease);
    if (r.success) setData(r.data); else setErr(r.error);
  })(); }, [disease]);

  if (err) return <View style={styles.center}><Text>{err}</Text></View>;
  if (!data) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

  const color = data.risk_pct >= 60 ? COLORS.error : data.risk_pct >= 30 ? COLORS.warning : COLORS.success;
  const factors = data.top_factors || [];
  const maxAbs = Math.max(0.01, ...factors.map(f => Math.abs(f.contribution)));

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={COLORS.gradient.saffron} style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{cap(disease)} Risk</Text>
        <Text style={styles.subtitle}>Why this prediction · model: {data.model_used}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Card variant="elevated" style={styles.scoreCard}>
          <Text style={[styles.bigScore, { color }]}>{data.risk_pct}%</Text>
          <Text style={styles.outOf}>{cap(data.label)} risk</Text>
        </Card>

        <Text style={styles.sectionTitle}>Top contributing factors</Text>
        <Text style={styles.lead}>
          The ML model multiplies each input by a learned weight. Bars to the right push risk up; bars to the left push it down.
        </Text>

        {factors.map((f, i) => {
          const w = Math.abs(f.contribution) / maxAbs;
          const positive = f.contribution > 0;
          return (
            <View key={f.feature + i} style={styles.factorRow}>
              <Text style={styles.factorLabel}>{FEATURE_LABELS[f.feature] || f.feature}</Text>
              <Text style={styles.factorValue}>value: {fmtVal(f.raw_value)}</Text>
              <View style={styles.barRow}>
                <View style={styles.barLeft}>
                  {!positive && <View style={[styles.bar, { width: `${w * 100}%`, backgroundColor: COLORS.success, alignSelf: 'flex-end' }]} />}
                </View>
                <View style={styles.barCenter} />
                <View style={styles.barRight}>
                  {positive && <View style={[styles.bar, { width: `${w * 100}%`, backgroundColor: COLORS.error }]} />}
                </View>
              </View>
              <Text style={[styles.contribText, { color: positive ? COLORS.error : COLORS.success }]}>
                {positive ? '+' : ''}{f.contribution}
              </Text>
            </View>
          );
        })}

        <Text style={styles.formula}>
          risk % ≈ σ(intercept + Σ wᵢ·xᵢ) × 100, where each xᵢ is your standardized input. Trained on 10,000 synthetic patients.
        </Text>
      </View>
    </ScrollView>
  );
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function fmtVal(v) { if (v === 0 || v === 1) return v ? 'yes' : 'no'; return Number.isInteger(v) ? v : (Math.round(v * 100) / 100); }

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
  outOf: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 18, marginBottom: 4 },
  lead: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 12 },
  factorRow: { backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginBottom: 8 },
  factorLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  factorValue: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 6 },
  barRow: { flexDirection: 'row', height: 10, alignItems: 'center' },
  barLeft: { flex: 1 }, barRight: { flex: 1 },
  barCenter: { width: 2, height: 10, backgroundColor: '#999' },
  bar: { height: 8, borderRadius: 4 },
  contribText: { fontSize: 11, fontWeight: '700', textAlign: 'right', marginTop: 4 },
  formula: { fontSize: 11, color: COLORS.textSecondary, fontStyle: 'italic', marginTop: 16, textAlign: 'center' },
});
