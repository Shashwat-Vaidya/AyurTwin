import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
import { useApp } from '../../context/AppContext';
import { getPanchakarmaAssessment } from '../../services/api';

const PanchakarmaScreen = ({ navigation }) => {
  const { state } = useApp();
  const userId = state.user?.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const res = await getPanchakarmaAssessment(userId);
      if (res.success) setData(res.data);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  const a = data?.assessment;
  const scoreColor = a?.readiness_score >= 70 ? COLORS.success : a?.readiness_score >= 40 ? COLORS.warning : COLORS.error;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>🌿 Panchakarma</Text>
        <View style={{ width: 24 }} />
      </View>

      {a && (
        <>
          <View style={[styles.scoreCard, { borderColor: scoreColor }]}>
            <Text style={styles.scoreLabel}>Readiness Score</Text>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>{a.readiness_score}/100</Text>
            <Text style={styles.scoreStatus}>{a.status}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>📊 Current State</Text>
            <Row label="Ama (Toxins)" value={a.ama_level} />
            <Row label="Ojas (Vitality)" value={a.ojas_level} />
            <Row label="Agni (Digestion)" value={a.agni_type} />
            <Row label="Dominant Dosha" value={a.dominant_dosha} />
          </View>

          {a.recommended_therapies?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>💊 Recommended Therapies</Text>
              {a.recommended_therapies.map((t, i) => (
                <View key={i} style={styles.therapyCard}>
                  <Text style={styles.therapyName}>{t.name}</Text>
                  {t.sanskrit && <Text style={styles.therapySanskrit}>{t.sanskrit}</Text>}
                  <Text style={styles.therapyDesc}>{t.description}</Text>
                  {t.duration && <Text style={styles.therapyMeta}>Duration: {t.duration}</Text>}
                  {t.target && <Text style={styles.therapyMeta}>Target: {t.target}</Text>}
                </View>
              ))}
            </View>
          )}

          {a.preparatory_steps?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>🪴 Preparatory Steps (Purvakarma)</Text>
              {a.preparatory_steps.map((s, i) => (
                <View key={i} style={styles.stepRow}>
                  <Text style={styles.stepNum}>{i + 1}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepName}>{s.name}</Text>
                    <Text style={styles.stepDesc}>{s.description}</Text>
                    {s.duration && <Text style={styles.stepMeta}>⏱️ {s.duration}</Text>}
                  </View>
                </View>
              ))}
            </View>
          )}

          {a.post_protocol?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>🍵 Post-Panchakarma (Samsarjana Krama)</Text>
              {a.post_protocol.map((p, i) => (
                <Text key={i} style={styles.bullet}>• {p}</Text>
              ))}
            </View>
          )}

          {a.cautions?.length > 0 && (
            <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: COLORS.error }]}>
              <Text style={styles.sectionTitle}>⚠️ Cautions</Text>
              {a.cautions.map((c, i) => (
                <Text key={i} style={styles.caution}>• {c}</Text>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.screenPadding, paddingTop: 50 },
  back: { fontSize: 28 },
  title: { ...FONTS.title, fontSize: 20 },
  scoreCard: { backgroundColor: COLORS.surface, margin: SIZES.md, padding: SIZES.lg, borderRadius: SIZES.borderRadiusLg, alignItems: 'center', borderWidth: 2, ...SHADOWS.small },
  scoreLabel: { ...FONTS.caption },
  scoreValue: { fontSize: 36, fontWeight: '800', marginTop: 4 },
  scoreStatus: { ...FONTS.bold, marginTop: 4 },
  card: { backgroundColor: COLORS.surface, margin: SIZES.md, padding: SIZES.md, borderRadius: SIZES.borderRadius, ...SHADOWS.small },
  sectionTitle: { ...FONTS.bold, fontSize: 15, marginBottom: SIZES.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowLabel: { ...FONTS.caption },
  rowValue: { ...FONTS.bold, fontSize: 13 },
  therapyCard: { backgroundColor: COLORS.background, padding: SIZES.sm, borderRadius: 8, marginBottom: 8 },
  therapyName: { ...FONTS.bold, color: COLORS.primary },
  therapySanskrit: { fontSize: 11, fontStyle: 'italic', color: COLORS.textSecondary },
  therapyDesc: { ...FONTS.caption, marginTop: 4 },
  therapyMeta: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  stepRow: { flexDirection: 'row', marginBottom: SIZES.sm },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.secondary, color: '#fff', textAlign: 'center', lineHeight: 24, fontWeight: '700', marginRight: SIZES.sm },
  stepName: { ...FONTS.bold, fontSize: 13 },
  stepDesc: { ...FONTS.caption, marginTop: 2 },
  stepMeta: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  bullet: { ...FONTS.caption, marginTop: 4 },
  caution: { ...FONTS.caption, color: COLORS.error, marginTop: 4 },
});

export default PanchakarmaScreen;
