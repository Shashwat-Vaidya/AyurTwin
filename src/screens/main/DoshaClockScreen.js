import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';

const DOSHA_COLORS = { Vata: COLORS.vata, Pitta: COLORS.pitta, Kapha: COLORS.kapha };
const DOSHA_ICONS = { Vata: 'cloud-outline', Pitta: 'flame-outline', Kapha: 'water-outline' };

const PERIODS = [
  { start: 6,  end: 10, dosha: 'Kapha', desc: 'Morning Kapha — slow & steady. Ideal for exercise.', activity: 'Brisk walk, sun salutations, energizing yoga' },
  { start: 10, end: 14, dosha: 'Pitta', desc: 'Midday Pitta — digestion peaks. Eat the largest meal.', activity: 'Have your main meal between 12 and 1 PM' },
  { start: 14, end: 18, dosha: 'Vata', desc: 'Afternoon Vata — creative & mobile. Great for focused work.', activity: 'Creative tasks, light snack, herbal tea' },
  { start: 18, end: 22, dosha: 'Kapha', desc: 'Evening Kapha — wind down. Time for light dinner.', activity: 'Light dinner before 7 PM, gentle walk, family time' },
  { start: 22, end: 2,  dosha: 'Pitta', desc: 'Night Pitta — metabolism & repair. Sleep before 10:30 PM.', activity: 'Sleep before 10:30 PM for cellular repair' },
  { start: 2,  end: 6,  dosha: 'Vata', desc: 'Pre-dawn Vata — meditation ideal. Wake before 6 AM.', activity: 'Wake at 5 AM, meditation, pranayama' },
];

const DoshaClockScreen = ({ navigation }) => {
  const currentHour = new Date().getHours();
  const currentPeriod = PERIODS.find(p =>
    p.start < p.end ? currentHour >= p.start && currentHour < p.end
      : currentHour >= p.start || currentHour < p.end
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Dosha Clock</Text>
        <View style={{ width: 24 }} />
      </View>

      {currentPeriod && (
        <View style={[styles.currentCard, { backgroundColor: DOSHA_COLORS[currentPeriod.dosha] }]}>
          <Ionicons name={DOSHA_ICONS[currentPeriod.dosha]} size={48} color="#fff" />
          <Text style={styles.currentDosha}>{currentPeriod.dosha} Time</Text>
          <Text style={styles.currentDesc}>{currentPeriod.desc}</Text>
          <View style={styles.recBox}>
            <Text style={styles.recTitle}>Right now</Text>
            <Text style={styles.recText}>{currentPeriod.activity}</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Daily Rhythm (Kala Chakra)</Text>
      {PERIODS.map((p, i) => {
        const isCurrent = p === currentPeriod;
        return (
          <View key={`p-${i}`} style={[styles.periodCard, isCurrent && styles.periodActive]}>
            <View style={[styles.periodBar, { backgroundColor: DOSHA_COLORS[p.dosha] }]} />
            <Ionicons name={DOSHA_ICONS[p.dosha]} size={22} color={DOSHA_COLORS[p.dosha]} style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.periodTime}>
                {String(p.start).padStart(2, '0')}:00 — {String(p.end).padStart(2, '0')}:00
              </Text>
              <Text style={[styles.periodDosha, { color: DOSHA_COLORS[p.dosha] }]}>{p.dosha}</Text>
              <Text style={styles.periodDesc}>{p.desc}</Text>
            </View>
            {isCurrent && <Text style={styles.nowTag}>NOW</Text>}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.screenPadding, paddingTop: 50 },
  title: { ...FONTS.title, fontSize: 20 },
  currentCard: { margin: SIZES.md, padding: SIZES.lg, borderRadius: SIZES.borderRadiusLg, alignItems: 'center', ...SHADOWS.medium },
  currentDosha: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 8 },
  currentDesc: { color: '#fff', marginTop: 4, textAlign: 'center' },
  recBox: { marginTop: SIZES.md, backgroundColor: 'rgba(255,255,255,0.2)', padding: SIZES.sm, borderRadius: 8, width: '100%' },
  recTitle: { color: '#fff', fontWeight: '700', fontSize: 12 },
  recText: { color: '#fff', marginTop: 4 },
  sectionTitle: { ...FONTS.bold, marginHorizontal: SIZES.md, marginBottom: SIZES.sm, marginTop: SIZES.sm },
  periodCard: { flexDirection: 'row', backgroundColor: COLORS.surface, marginHorizontal: SIZES.md, marginBottom: 8, padding: SIZES.sm, borderRadius: SIZES.borderRadius, ...SHADOWS.small, alignItems: 'center' },
  periodActive: { borderWidth: 2, borderColor: COLORS.primary },
  periodBar: { width: 5, height: 50, borderRadius: 3, marginRight: SIZES.sm },
  periodTime: { ...FONTS.bold, fontSize: 13 },
  periodDosha: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  periodDesc: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  nowTag: { backgroundColor: COLORS.primary, color: '#fff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, fontSize: 10, fontWeight: '800' },
});

export default DoshaClockScreen;
