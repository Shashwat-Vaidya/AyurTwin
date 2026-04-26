import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';
import { useApp } from '../../context/AppContext';
import { getDashboard } from '../../services/api';
import { detectDoshaImbalance } from '../../utils/healthCalculations';

const doshaData = {
  Vata: {
    color: COLORS.vata, gradient: ['#7B68EE', '#9B89FF'], icon: '',
    elements: 'Space + Air', qualities: 'Dry, Light, Cold, Rough, Subtle, Mobile',
    governs: 'Movement, Breathing, Nervous System, Circulation',
    body: 'Thin, light frame. Dry skin and hair. Small eyes. Irregular features.',
    mind: 'Creative, quick-thinking, enthusiastic. Tendency toward anxiety and fear.',
    digestion: 'Variable appetite. Irregular digestion. Tendency toward gas and bloating.',
    balanced: ['Creative and imaginative', 'Quick to learn', 'Flexible and adaptable', 'Energetic and vital'],
    imbalanced: ['Anxiety and fear', 'Insomnia', 'Dry skin and constipation', 'Weight loss', 'Joint pain'],
    diet: ['Warm, cooked foods', 'Sweet, sour, salty tastes', 'Ghee, warm milk, soups', 'Root vegetables', 'Avoid: cold, dry, raw foods'],
    lifestyle: ['Regular daily routine', 'Warm oil massage (Abhyanga)', 'Gentle yoga and tai chi', 'Early bedtime', 'Avoid excessive stimulation'],
    herbs: ['Ashwagandha', 'Shatavari', 'Brahmi', 'Ginger', 'Sesame oil'],
  },
  Pitta: {
    color: COLORS.pitta, gradient: ['#FF6347', '#FF7F6A'], icon: '',
    elements: 'Fire + Water', qualities: 'Hot, Sharp, Light, Liquid, Oily, Spreading',
    governs: 'Digestion, Metabolism, Body Temperature, Transformation',
    body: 'Medium build. Warm skin. Sharp features. Reddish complexion.',
    mind: 'Intelligent, focused, determined. Tendency toward anger and criticism.',
    digestion: 'Strong appetite. Fast digestion. Tendency toward acid reflux.',
    balanced: ['Intelligent and sharp', 'Natural leader', 'Strong digestion', 'Confident and courageous'],
    imbalanced: ['Anger and irritability', 'Acid reflux and ulcers', 'Skin rashes and inflammation', 'Excessive heat', 'Perfectionism'],
    diet: ['Cooling foods', 'Sweet, bitter, astringent tastes', 'Coconut, cucumber, mint', 'Leafy greens', 'Avoid: spicy, fried, sour foods'],
    lifestyle: ['Calming, non-competitive activities', 'Moonlight walks', 'Swimming and water sports', 'Cool environment', 'Avoid excessive sun'],
    herbs: ['Amalaki (Amla)', 'Shatavari', 'Neem', 'Sandalwood', 'Coconut oil'],
  },
  Kapha: {
    color: COLORS.kapha, gradient: ['#32CD32', '#50E050'], icon: '',
    elements: 'Earth + Water', qualities: 'Heavy, Slow, Cool, Oily, Smooth, Dense, Stable',
    governs: 'Structure, Lubrication, Stability, Immunity, Growth',
    body: 'Strong, well-built frame. Smooth, oily skin. Large eyes. Thick hair.',
    mind: 'Calm, patient, loving. Tendency toward attachment and lethargy.',
    digestion: 'Slow but steady appetite. Slow digestion. Tendency toward heaviness.',
    balanced: ['Calm and compassionate', 'Strong immunity', 'Good endurance', 'Loving and forgiving'],
    imbalanced: ['Weight gain', 'Congestion and mucus', 'Lethargy and depression', 'Attachment and possessiveness', 'Water retention'],
    diet: ['Light, warm, dry foods', 'Pungent, bitter, astringent tastes', 'Spices: ginger, turmeric, black pepper', 'Steamed vegetables, legumes', 'Avoid: heavy, oily, cold, sweet foods'],
    lifestyle: ['Vigorous daily exercise', 'Wake before 6 AM', 'Stimulating activities', 'Dry brushing', 'Avoid daytime napping'],
    herbs: ['Trikatu (ginger, pepper, pippali)', 'Guggulu', 'Turmeric', 'Triphala', 'Mustard oil'],
  },
};

const DoshaDetailScreen = ({ navigation }) => {
  const { state } = useApp();
  const [dash, setDash] = useState(null);

  useEffect(() => { (async () => {
    const r = await getDashboard();
    if (r.success) setDash(r.data);
  })(); }, []);

  if (!dash) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', flex: 1 }]}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  // backend's quiz row + live dosha balance
  const quiz = dash.prakriti_quiz || {};
  const live = dash.dosha || { vata: 33, pitta: 33, kapha: 33 };
  const userPrakriti = (dash.user?.prakriti || quiz.prakriti || 'vata').toLowerCase();
  const prakriti = {
    prakriti: capitalize(userPrakriti.replace('-', '-')),
    vata_percent: quiz.vata_score ?? live.vata,
    pitta_percent: quiz.pitta_score ?? live.pitta,
    kapha_percent: quiz.kapha_score ?? live.kapha,
  };
  const profile = { ...state.user, ...(state.registrationData || {}) };
  const dosha = detectDoshaImbalance(prakriti, profile);
  const primaryDosha = capitalize(userPrakriti.split('-')[0]);
  const data = doshaData[primaryDosha] || doshaData.Vata;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={data.gradient} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.doshaIcon}>{data.icon}</Text>
          <Text style={styles.headerTitle}>{prakriti.prakriti || 'Your Dosha'}</Text>
          <Text style={styles.headerSubtitle}>Detailed Dosha Analysis</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Score overview */}
        <Card variant="elevated"style={styles.scoreCard}>
          <View style={styles.doshaScores}>
            <ScoreCircle label="Vata"percent={prakriti.vata_percent || 33} color={COLORS.vata} />
            <ScoreCircle label="Pitta"percent={prakriti.pitta_percent || 33} color={COLORS.pitta} />
            <ScoreCircle label="Kapha"percent={prakriti.kapha_percent || 33} color={COLORS.kapha} />
          </View>
          {dosha.imbalanceDetected && (
            <View style={styles.imbalanceBox}>
              <Text style={styles.imbalanceText}> {dosha.dominantImbalance?.charAt(0).toUpperCase() + dosha.dominantImbalance?.slice(1)} imbalance detected</Text>
            </View>
          )}
        </Card>

        {/* About this Dosha */}
        <Text style={styles.sectionTitle}>About {primaryDosha}</Text>
        <Card variant="elevated">
          <DetailRow label="Elements"value={data.elements} />
          <DetailRow label="Qualities"value={data.qualities} />
          <DetailRow label="Governs"value={data.governs} />
        </Card>

        <Text style={styles.sectionTitle}>Physical Traits</Text>
        <Card variant="elevated">
          <Text style={styles.descText}>{data.body}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Mental Traits</Text>
        <Card variant="elevated">
          <Text style={styles.descText}>{data.mind}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Digestion</Text>
        <Card variant="elevated">
          <Text style={styles.descText}>{data.digestion}</Text>
        </Card>

        {/* Balanced vs Imbalanced */}
        <Text style={styles.sectionTitle}>When Balanced</Text>
        <Card variant="elevated"style={{ borderLeftWidth: 3, borderLeftColor: COLORS.success }}>
          {data.balanced.map((item, i) => (
            <Text key={i} style={styles.listItem}> {item}</Text>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>When Imbalanced</Text>
        <Card variant="elevated"style={{ borderLeftWidth: 3, borderLeftColor: COLORS.error }}>
          {data.imbalanced.map((item, i) => (
            <Text key={i} style={styles.listItem}> {item}</Text>
          ))}
        </Card>

        {/* Diet */}
        <Text style={styles.sectionTitle}>Diet Recommendations</Text>
        <Card variant="elevated"style={{ borderLeftWidth: 3, borderLeftColor: data.color }}>
          {data.diet.map((item, i) => (
            <Text key={i} style={styles.listItem}> {item}</Text>
          ))}
        </Card>

        {/* Lifestyle */}
        <Text style={styles.sectionTitle}>Lifestyle Tips</Text>
        <Card variant="elevated"style={{ borderLeftWidth: 3, borderLeftColor: data.color }}>
          {data.lifestyle.map((item, i) => (
            <Text key={i} style={styles.listItem}> {item}</Text>
          ))}
        </Card>

        {/* Herbs */}
        <Text style={styles.sectionTitle}>Recommended Herbs</Text>
        <View style={styles.herbsGrid}>
          {data.herbs.map((herb, i) => (
            <View key={i} style={[styles.herbChip, { backgroundColor: data.color + '15', borderColor: data.color }]}>
              <Text style={[styles.herbText, { color: data.color }]}>{herb}</Text>
            </View>
          ))}
        </View>

        {/* All three doshas overview */}
        <Text style={styles.sectionTitle}>All Doshas</Text>
        {['Vata', 'Pitta', 'Kapha'].map((d) => {
          const dd = doshaData[d];
          return (
            <Card key={d} variant="elevated"style={[styles.allDoshaCard, { borderLeftWidth: 3, borderLeftColor: dd.color }]}>
              <View style={styles.allDoshaHeader}>
                <Text style={styles.allDoshaIcon}>{dd.icon}</Text>
                <Text style={[styles.allDoshaName, { color: dd.color }]}>{d}</Text>
                <Text style={styles.allDoshaElements}>{dd.elements}</Text>
              </View>
              <Text style={styles.allDoshaGoverns}>{dd.governs}</Text>
            </Card>
          );
        })}

        <Text style={styles.disclaimer}>
          This app provides preventive health insights and does not replace professional medical advice.
        </Text>
      </View>
    </ScrollView>
  );
};

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

const ScoreCircle = ({ label, percent, color }) => (
  <View style={styles.scoreCircleItem}>
    <View style={[styles.scoreCircle, { borderColor: color }]}>
      <Text style={[styles.scoreCircleValue, { color }]}>{Math.round(percent || 33)}%</Text>
    </View>
    <Text style={[styles.scoreCircleLabel, { color }]}>{label}</Text>
  </View>
);

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 30, paddingHorizontal: SIZES.screenPadding, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', marginBottom: 10 },
  backText: { fontSize: 14, color: '#FFFFFFCC', fontWeight: '600' },
  headerContent: { alignItems: 'center' },
  doshaIcon: { fontSize: 48, marginBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: '#FFFFFFCC', marginTop: 2 },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 22, marginBottom: 10 },
  scoreCard: { marginTop: -16 },
  doshaScores: { flexDirection: 'row', justifyContent: 'space-around' },
  scoreCircleItem: { alignItems: 'center' },
  scoreCircle: { width: 70, height: 70, borderRadius: 35, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  scoreCircleValue: { fontSize: 16, fontWeight: '800' },
  scoreCircleLabel: { fontSize: 13, fontWeight: '700', marginTop: 6 },
  imbalanceBox: { marginTop: 14, padding: 10, backgroundColor: COLORS.warning + '15', borderRadius: 10, alignItems: 'center' },
  imbalanceText: { fontSize: 13, fontWeight: '600', color: COLORS.warning },
  detailRow: { marginBottom: 12 },
  detailLabel: { fontSize: 12, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', marginBottom: 3 },
  detailValue: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  descText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  listItem: { fontSize: 14, color: COLORS.text, lineHeight: 26 },
  herbsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  herbChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1.5 },
  herbText: { fontSize: 13, fontWeight: '600' },
  allDoshaCard: { marginBottom: 8 },
  allDoshaHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  allDoshaIcon: { fontSize: 22 },
  allDoshaName: { fontSize: 16, fontWeight: '700' },
  allDoshaElements: { fontSize: 12, color: COLORS.textSecondary },
  allDoshaGoverns: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  disclaimer: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 24, lineHeight: 14 },
});

export default DoshaDetailScreen;
