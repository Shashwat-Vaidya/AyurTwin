import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
import { useApp } from '../../context/AppContext';
import { getPreventionPlans } from '../../services/api';

const riskColor = (n) => n >= 70 ? COLORS.error : n >= 40 ? COLORS.warning : COLORS.success;

const DiseasePreventionScreen = ({ navigation }) => {
  const { state } = useApp();
  const userId = state.user?.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const res = await getPreventionPlans(userId);
      if (res.success) setData(res.data);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  const risks = data?.risks || {};
  const protocols = data?.prevention_protocols || [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>🛡️ Disease Prevention</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📈 Your Risk Profile</Text>
        {Object.entries(risks).map(([k, v]) => (
          <View key={k} style={styles.riskRow}>
            <Text style={styles.riskName}>{k.replace(/_/g, ' ')}</Text>
            <View style={styles.riskBarTrack}>
              <View style={[styles.riskBarFill, { width: `${v}%`, backgroundColor: riskColor(v) }]} />
            </View>
            <Text style={[styles.riskValue, { color: riskColor(v) }]}>{v}%</Text>
          </View>
        ))}
      </View>

      {protocols.map((p, i) => {
        const isOpen = expanded === i;
        return (
          <TouchableOpacity key={i} style={styles.card} onPress={() => setExpanded(isOpen ? null : i)} activeOpacity={0.8}>
            <View style={styles.protocolHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.protocolName}>{p.disease_name}</Text>
                {p.sanskrit_name && <Text style={styles.protocolSanskrit}>{p.sanskrit_name}</Text>}
              </View>
              <View style={[styles.riskPill, { backgroundColor: riskColor(p.risk_level || 0) }]}>
                <Text style={styles.riskPillText}>{p.risk_level || 0}%</Text>
              </View>
            </View>

            {isOpen && (
              <View style={styles.protocolBody}>
                {p.ayurvedic_understanding && (
                  <>
                    <Text style={styles.subTitle}>🕉️ Ayurvedic Understanding</Text>
                    <Text style={styles.bodyText}>{p.ayurvedic_understanding}</Text>
                  </>
                )}
                {p.dietary_guidelines?.length > 0 && (
                  <>
                    <Text style={styles.subTitle}>🍽️ Diet</Text>
                    {p.dietary_guidelines.map((g, j) => <Text key={j} style={styles.bullet}>• {g}</Text>)}
                  </>
                )}
                {p.lifestyle_changes?.length > 0 && (
                  <>
                    <Text style={styles.subTitle}>🧘 Lifestyle</Text>
                    {p.lifestyle_changes.map((g, j) => <Text key={j} style={styles.bullet}>• {g}</Text>)}
                  </>
                )}
                {p.herbs_recommended?.length > 0 && (
                  <>
                    <Text style={styles.subTitle}>🌿 Herbs</Text>
                    <Text style={styles.bodyText}>{p.herbs_recommended.join(', ')}</Text>
                  </>
                )}
                {p.yoga_poses?.length > 0 && (
                  <>
                    <Text style={styles.subTitle}>🧘 Yoga</Text>
                    <Text style={styles.bodyText}>{p.yoga_poses.join(', ')}</Text>
                  </>
                )}
                {p.warning_signs?.length > 0 && (
                  <>
                    <Text style={[styles.subTitle, { color: COLORS.error }]}>⚠️ Warning Signs</Text>
                    {p.warning_signs.map((w, j) => <Text key={j} style={[styles.bullet, { color: COLORS.error }]}>• {w}</Text>)}
                  </>
                )}
              </View>
            )}

            <Text style={styles.toggle}>{isOpen ? '▲ Tap to collapse' : '▼ Tap for prevention plan'}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.screenPadding, paddingTop: 50 },
  back: { fontSize: 28 },
  title: { ...FONTS.title, fontSize: 20 },
  card: { backgroundColor: COLORS.surface, margin: SIZES.md, padding: SIZES.md, borderRadius: SIZES.borderRadius, ...SHADOWS.small },
  sectionTitle: { ...FONTS.bold, marginBottom: SIZES.sm },
  riskRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  riskName: { width: 100, fontSize: 11, textTransform: 'capitalize' },
  riskBarTrack: { flex: 1, height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden', marginHorizontal: 8 },
  riskBarFill: { height: '100%', borderRadius: 4 },
  riskValue: { width: 44, textAlign: 'right', fontSize: 12, fontWeight: '700' },
  protocolHeader: { flexDirection: 'row', alignItems: 'center' },
  protocolName: { ...FONTS.bold, fontSize: 15 },
  protocolSanskrit: { fontSize: 11, fontStyle: 'italic', color: COLORS.textSecondary },
  riskPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  riskPillText: { color: '#fff', fontWeight: '700', fontSize: 11 },
  protocolBody: { marginTop: SIZES.sm, paddingTop: SIZES.sm, borderTopWidth: 1, borderTopColor: COLORS.border },
  subTitle: { ...FONTS.bold, fontSize: 13, marginTop: SIZES.sm },
  bodyText: { ...FONTS.caption, marginTop: 4, lineHeight: 18 },
  bullet: { ...FONTS.caption, marginTop: 4 },
  toggle: { fontSize: 11, color: COLORS.primary, textAlign: 'center', marginTop: SIZES.sm, fontWeight: '600' },
});

export default DiseasePreventionScreen;
