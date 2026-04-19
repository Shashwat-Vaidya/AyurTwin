import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
import { useApp } from '../../context/AppContext';
import { getRitucharya } from '../../services/api';

const RitucharyaScreen = ({ navigation }) => {
  const { state } = useApp();
  const userId = state.user?.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const res = await getRitucharya(userId);
      if (res.success) setData(res.data);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  const r = data?.ritucharya;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>🍂 Ritucharya</Text>
        <View style={{ width: 24 }} />
      </View>

      {r && (
        <>
          <View style={styles.hero}>
            <Text style={styles.heroIcon}>{r.icon || '🌱'}</Text>
            <Text style={styles.heroSeason}>{r.season?.english}</Text>
            <Text style={styles.heroSanskrit}>{r.season?.sanskrit}</Text>
            <Text style={styles.heroMonths}>{r.season?.months}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🌡️ Dosha Behavior</Text>
            <Text style={styles.bodyText}>{r.dosha_behavior}</Text>
          </View>

          {r.favor?.length > 0 && (
            <View style={styles.card}>
              <Text style={[styles.sectionTitle, { color: COLORS.success }]}>✅ Favor</Text>
              {r.favor.map((f, i) => <Text key={i} style={styles.bullet}>• {f}</Text>)}
            </View>
          )}

          {r.avoid?.length > 0 && (
            <View style={styles.card}>
              <Text style={[styles.sectionTitle, { color: COLORS.error }]}>⛔ Avoid</Text>
              {r.avoid.map((f, i) => <Text key={i} style={styles.bullet}>• {f}</Text>)}
            </View>
          )}

          {r.foods?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>🍲 Seasonal Foods</Text>
              <Text style={styles.bodyText}>{r.foods.join(', ')}</Text>
            </View>
          )}

          {r.activities?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>🏃 Activities</Text>
              {r.activities.map((a, i) => <Text key={i} style={styles.bullet}>• {a}</Text>)}
            </View>
          )}

          {r.herbs?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>🌿 Recommended Herbs</Text>
              <Text style={styles.bodyText}>{r.herbs.join(', ')}</Text>
            </View>
          )}

          {r.lifestyle_tips?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>💫 Lifestyle Tips</Text>
              {r.lifestyle_tips.map((t, i) => <Text key={i} style={styles.bullet}>• {t}</Text>)}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.screenPadding, paddingTop: 50 },
  back: { fontSize: 28 },
  title: { ...FONTS.title, fontSize: 20 },
  hero: { backgroundColor: COLORS.secondary, margin: SIZES.md, padding: SIZES.lg, borderRadius: SIZES.borderRadiusLg, alignItems: 'center' },
  heroIcon: { fontSize: 64 },
  heroSeason: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 4 },
  heroSanskrit: { color: '#fff', fontStyle: 'italic', opacity: 0.9 },
  heroMonths: { color: '#fff', fontSize: 12, marginTop: 4, opacity: 0.8 },
  card: { backgroundColor: COLORS.surface, margin: SIZES.md, padding: SIZES.md, borderRadius: SIZES.borderRadius, ...SHADOWS.small },
  sectionTitle: { ...FONTS.bold, marginBottom: SIZES.sm },
  bodyText: { ...FONTS.regular, lineHeight: 20 },
  bullet: { ...FONTS.caption, marginTop: 4 },
});

export default RitucharyaScreen;
