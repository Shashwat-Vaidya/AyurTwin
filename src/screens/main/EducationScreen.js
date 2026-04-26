import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';

const CATEGORIES = ['All', 'Dosha', 'Lifestyle', 'Diet', 'Yoga', 'Remedies'];

const articles = [
  {
    id: 1, category: 'Dosha', icon: '', title: 'Understanding Vata Dosha',
    content: 'Vata dosha is composed of Space (Akasha) and Air (Vayu) elements. It governs all movement in the body including breathing, heartbeat, muscle contractions, and nerve impulses.\n\nCharacteristics of Vata-dominant people:\n• Thin, light build\n• Quick-thinking, creative\n• Enthusiastic, energetic\n• Tendency toward anxiety and dryness\n• Variable appetite and digestion\n\nWhen balanced: Creative, vital, intuitive\nWhen imbalanced: Anxiety, insomnia, dry skin, constipation\n\nBalancing Tips:\n• Eat warm, cooked, nourishing foods\n• Maintain a regular daily routine\n• Practice gentle yoga and meditation\n• Use warm sesame oil for Abhyanga (self-massage)\n• Avoid cold, dry, and raw foods',
    color: COLORS.vata,
  },
  {
    id: 2, category: 'Dosha', icon: '', title: 'Understanding Pitta Dosha',
    content: 'Pitta dosha is composed of Fire (Agni) and Water (Jala) elements. It governs digestion, metabolism, body temperature, and transformation processes.\n\nCharacteristics of Pitta-dominant people:\n• Medium, muscular build\n• Sharp intellect, focused\n• Strong digestion\n• Natural leaders\n• Tendency toward inflammation and anger\n\nWhen balanced: Intelligent, confident, courageous\nWhen imbalanced: Anger, inflammation, acid reflux, skin rashes\n\nBalancing Tips:\n• Eat cooling foods (cucumber, coconut, mint)\n• Avoid excessive heat and spicy foods\n• Practice calming activities and moonlight walks\n• Use coconut oil for massage\n• Practice Sheetali pranayama (cooling breath)',
    color: COLORS.pitta,
  },
  {
    id: 3, category: 'Dosha', icon: '', title: 'Understanding Kapha Dosha',
    content: 'Kapha dosha is composed of Earth (Prithvi) and Water (Jala) elements. It governs structure, lubrication, stability, and the immune system.\n\nCharacteristics of Kapha-dominant people:\n• Strong, well-built frame\n• Calm, patient, caring\n• Good long-term memory\n• Slow, steady metabolism\n• Tendency toward weight gain and lethargy\n\nWhen balanced: Calm, loving, forgiving, strong\nWhen imbalanced: Weight gain, congestion, depression, lethargy\n\nBalancing Tips:\n• Eat light, warm, spicy foods\n• Engage in vigorous daily exercise\n• Avoid heavy, oily, and cold foods\n• Wake up early (before 6 AM)\n• Use dry powder massage (Udvartana)',
    color: COLORS.kapha,
  },
  {
    id: 4, category: 'Lifestyle', icon: '', title: 'Dinacharya - The Ayurvedic Daily Routine',
    content: 'Dinacharya is the Ayurvedic concept of an ideal daily routine that aligns with natural cycles:\n\nMorning (Brahma Muhurta - 4:30-6:00 AM):\n• Wake before sunrise\n• Drink warm water with lemon\n• Oil pulling (Gandusha)\n• Tongue scraping\n• Nasal oil application (Nasya)\n• Self-massage with warm oil (Abhyanga)\n• Exercise and yoga\n• Meditation and pranayama\n• Warm, nourishing breakfast\n\nMidday (Pitta time - 10 AM-2 PM):\n• Largest meal of the day at noon\n• Walk 100 steps after meals\n• Productive work during peak energy\n\nEvening (Vata time - 2-6 PM):\n• Light creative work\n• Gentle exercise or walking\n• Light dinner before sunset\n\nNight (Kapha time - 6-10 PM):\n• Wind down activities\n• Warm milk with turmeric\n• Sleep by 10 PM',
    color: COLORS.secondary,
  },
  {
    id: 5, category: 'Diet', icon: '', title: 'Eating According to Your Dosha',
    content: 'Ayurveda emphasizes personalized nutrition based on your constitution:\n\nVata Diet:\n• Favor: Warm, cooked, moist, sweet, sour, salty\n• Avoid: Cold, dry, raw, bitter\n• Best foods: Soups, stews, warm grains, ghee, root vegetables\n\nPitta Diet:\n• Favor: Cool, sweet, bitter, astringent\n• Avoid: Hot, spicy, sour, salty, fried\n• Best foods: Salads, coconut, cucumber, sweet fruits, basmati rice\n\nKapha Diet:\n• Favor: Light, warm, pungent, bitter, astringent\n• Avoid: Heavy, oily, cold, sweet, salty\n• Best foods: Steamed vegetables, legumes, light grains, spices\n\nGeneral Guidelines:\n• Eat your largest meal at noon\n• Eat in a calm environment\n• Chew food thoroughly\n• Drink warm water throughout the day\n• Include all six tastes in each meal',
    color: COLORS.accent,
  },
  {
    id: 6, category: 'Yoga', icon: '', title: 'Yoga for Each Dosha',
    content: 'Different yoga practices suit different constitutions:\n\nYoga for Vata:\n• Gentle, grounding poses\n• Tree Pose (Vrksasana)\n• Child\'s Pose (Balasana)\n• Forward Folds\n• Slow Sun Salutations\n• Focus on steady breathing\n\nYoga for Pitta:\n• Cooling, non-competitive practice\n• Moon Salutation (Chandra Namaskar)\n• Seated twists\n• Forward bends\n• Avoid hot yoga\n• Practice Sheetali pranayama\n\nYoga for Kapha:\n• Vigorous, stimulating practice\n• Sun Salutation (Surya Namaskar)\n• Backbends\n• Standing poses\n• Kapalabhati pranayama\n• Dynamic flow sequences\n\nUniversal Practices:\n• Pranayama (breathing exercises)\n• Meditation\n• Yoga Nidra (yogic sleep)\n• Savasana (final relaxation)',
    color: COLORS.info,
  },
  {
    id: 7, category: 'Remedies', icon: '', title: 'Ayurvedic Home Remedies',
    content: 'Simple Ayurvedic remedies for common health issues:\n\nFor Stress & Anxiety:\n• Ashwagandha in warm milk\n• Brahmi tea\n• Jatamansi root powder\n• Warm sesame oil foot massage\n\nFor Digestion:\n• Ginger + lemon + salt before meals\n• Fennel tea after meals\n• Triphala at bedtime\n• CCF tea (cumin, coriander, fennel)\n\nFor Better Sleep:\n• Warm turmeric milk (Golden Milk)\n• Nutmeg in warm milk\n• Brahmi + Ashwagandha\n• Foot massage with ghee\n\nFor Immunity:\n• Chyawanprash (1 tsp daily)\n• Tulsi tea\n• Turmeric + black pepper\n• Amla (Indian gooseberry)\n\nFor Skin Health:\n• Turmeric face mask\n• Aloe vera gel\n• Neem paste\n• Rose water toner\n\nNote: Consult an Ayurvedic practitioner for personalized remedies.',
    color: COLORS.success,
  },
  {
    id: 8, category: 'Lifestyle', icon: '', title: 'Ritucharya - Seasonal Living',
    content: 'Ayurveda prescribes specific routines for each season:\n\nVasanta (Spring - Mar-May):\n• Kapha season - eat light, warm\n• Increase exercise\n• Use honey and ginger\n• Dry massage (Udvartana)\n\nGrishma (Summer - May-Jul):\n• Pitta season - eat cooling foods\n• Coconut water, mint, cucumber\n• Avoid excessive sun exposure\n• Light, sweet diet\n\nVarsha (Monsoon - Jul-Sep):\n• Vata aggravation - eat warm foods\n• Avoid raw salads\n• Use ginger and garlic\n• Light exercise only\n\nSharad (Autumn - Sep-Nov):\n• Pitta release - bitter, sweet foods\n• Panchakarma cleansing\n• Moon bathing\n\nHemanta/Shishira (Winter - Nov-Mar):\n• Build strength and immunity\n• Warm, nourishing, oily foods\n• Sesame oil massage\n• Regular exercise',
    color: COLORS.primary,
  },
];

const EducationScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = activeCategory === 'All' ? articles : articles.filter(a => a.category === activeCategory);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={COLORS.gradient.green} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Education</Text>
        <Text style={styles.headerSubtitle}>Learn about Ayurveda and wellness</Text>
      </LinearGradient>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} style={[styles.tab, activeCategory === c && styles.tabActive]} onPress={() => setActiveCategory(c)}>
            <Text style={[styles.tabText, activeCategory === c && styles.tabTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.content}>
        {filtered.map((article) => (
          <TouchableOpacity key={article.id} activeOpacity={0.8} onPress={() => setExpandedId(expandedId === article.id ? null : article.id)}>
            <Card variant="elevated"style={[styles.articleCard, { borderLeftColor: article.color, borderLeftWidth: 4 }]}>
              <View style={styles.articleHeader}>
                <Text style={styles.articleIcon}>{article.icon}</Text>
                <View style={styles.articleTitleArea}>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <View style={[styles.categoryBadge, { backgroundColor: article.color + '15' }]}>
                    <Text style={[styles.categoryBadgeText, { color: article.color }]}>{article.category}</Text>
                  </View>
                </View>
                <Text style={styles.expandIcon}>{expandedId === article.id ? '▲' : '▼'}</Text>
              </View>

              {expandedId === article.id && (
                <View style={styles.articleBody}>
                  <Text style={styles.articleContent}>{article.content}</Text>
                </View>
              )}
            </Card>
          </TouchableOpacity>
        ))}

        <Text style={styles.disclaimer}>
          This app provides preventive health insights and does not replace professional medical advice.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: SIZES.screenPadding, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn: { marginBottom: 6 },
  backText: { fontSize: 14, color: '#FFFFFFCC', fontWeight: '600' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: '#FFFFFFCC' },
  tabScroll: { paddingHorizontal: SIZES.screenPadding, paddingVertical: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: 8, ...SHADOWS.small },
  tabActive: { backgroundColor: COLORS.secondary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#FFF' },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 40 },
  articleCard: { marginBottom: 10 },
  articleHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  articleIcon: { fontSize: 28 },
  articleTitleArea: { flex: 1 },
  articleTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 4 },
  categoryBadgeText: { fontSize: 10, fontWeight: '700' },
  expandIcon: { fontSize: 14, color: COLORS.textLight },
  articleBody: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: COLORS.border },
  articleContent: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22 },
  disclaimer: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 24, lineHeight: 14 },
});

export default EducationScreen;
