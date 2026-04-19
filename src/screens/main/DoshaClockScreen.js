import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
import { useApp } from '../../context/AppContext';
import { getDoshaClock } from '../../services/api';

const DOSHA_COLORS = { Vata: COLORS.vata, Pitta: COLORS.pitta, Kapha: COLORS.kapha };
const PERIODS = [
  { start: 6, end: 10, dosha: 'Kapha', icon: '🌅', desc: 'Morning Kapha - slow & steady' },
  { start: 10, end: 14, dosha: 'Pitta', icon: '☀️', desc: 'Midday Pitta - digestion peaks' },
  { start: 14, end: 18, dosha: 'Vata', icon: '🌬️', desc: 'Afternoon Vata - creative & mobile' },
  { start: 18, end: 22, dosha: 'Kapha', icon: '🌆', desc: 'Evening Kapha - wind down' },
  { start: 22, end: 2, dosha: 'Pitta', icon: '🌙', desc: 'Night Pitta - metabolism & repair' },
  { start: 2, end: 6, dosha: 'Vata', icon: '🌌', desc: 'Pre-dawn Vata - meditation ideal' },
];

const DoshaClockScreen = ({ navigation }) => {
  const { state } = useApp();
  const userId = state.user?.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const res = await getDoshaClock(userId);
      if (res.success) setData(res.data);
      setLoading(false);
    })();
  }, [userId]);

  const currentHour = new Date().getHours();
  const currentPeriod = PERIODS.find(p =>
    p.start < p.end ? currentHour >= p.start && currentHour < p.end
      : currentHour >= p.start || currentHour < p.end
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🕐 Dosha Clock</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <>
          {currentPeriod && (
            <View style={[styles.currentCard, { backgroundColor: DOSHA_COLORS[currentPeriod.dosha] }]}>
              <Text style={styles.currentIcon}>{currentPeriod.icon}</Text>
              <Text style={styles.currentDosha}>{currentPeriod.dosha} Time</Text>
              <Text style={styles.currentDesc}>{currentPeriod.desc}</Text>
              {data?.recommendation && (
                <View style={styles.recBox}>
                  <Text style={styles.recTitle}>Right now:</Text>
                  <Text style={styles.recText}>{data.recommendation.activity}</Text>
                  {data.recommendation.tip && <Text style={styles.recTip}>💡 {data.recommendation.tip}</Text>}
                </View>
              )}
            </View>
          )}

          <Text style={styles.sectionTitle}>Daily Rhythm (Kala Chakra)</Text>
          {PERIODS.map((p, i) => {
            const isCurrent = p === currentPeriod;
            return (
              <View key={i} style={[styles.periodCard, isCurrent && styles.periodActive]}>
                <View style={[styles.periodBar, { backgroundColor: DOSHA_COLORS[p.dosha] }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.periodTime}>
                    {p.icon} {String(p.start).padStart(2,'0')}:00 - {String(p.end).padStart(2,'0')}:00
                  </Text>
                  <Text style={[styles.periodDosha, { color: DOSHA_COLORS[p.dosha] }]}>{p.dosha}</Text>
                  <Text style={styles.periodDesc}>{p.desc}</Text>
                </View>
                {isCurrent && <Text style={styles.nowTag}>NOW</Text>}
              </View>
            );
          })}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.screenPadding, paddingTop: 50 },
  back: { fontSize: 28 },
  title: { ...FONTS.title, fontSize: 20 },
  currentCard: { margin: SIZES.md, padding: SIZES.lg, borderRadius: SIZES.borderRadiusLg, alignItems: 'center', ...SHADOWS.medium },
  currentIcon: { fontSize: 48 },
  currentDosha: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 8 },
  currentDesc: { color: '#fff', marginTop: 4, textAlign: 'center' },
  recBox: { marginTop: SIZES.md, backgroundColor: 'rgba(255,255,255,0.2)', padding: SIZES.sm, borderRadius: 8, width: '100%' },
  recTitle: { color: '#fff', fontWeight: '700', fontSize: 12 },
  recText: { color: '#fff', marginTop: 4 },
  recTip: { color: '#fff', fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  sectionTitle: { ...FONTS.bold, marginHorizontal: SIZES.md, marginBottom: SIZES.sm },
  periodCard: { flexDirection: 'row', backgroundColor: COLORS.surface, marginHorizontal: SIZES.md, marginBottom: 8, padding: SIZES.sm, borderRadius: SIZES.borderRadius, ...SHADOWS.small, alignItems: 'center' },
  periodActive: { borderWidth: 2, borderColor: COLORS.primary },
  periodBar: { width: 5, height: '90%', borderRadius: 3, marginRight: SIZES.sm },
  periodTime: { ...FONTS.bold, fontSize: 13 },
  periodDosha: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  periodDesc: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  nowTag: { backgroundColor: COLORS.primary, color: '#fff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, fontSize: 10, fontWeight: '800' },
});

export default DoshaClockScreen;
