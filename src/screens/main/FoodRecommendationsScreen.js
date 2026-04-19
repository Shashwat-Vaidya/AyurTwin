import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
import { useApp } from '../../context/AppContext';
import { getFoodRecommendations } from '../../services/api';

const TABS = [
  { key: 'highly_recommended', label: 'Best', color: COLORS.success, icon: '⭐' },
  { key: 'recommended', label: 'Good', color: COLORS.secondary, icon: '✅' },
  { key: 'moderate', label: 'OK', color: COLORS.warning, icon: '⚖️' },
  { key: 'avoid', label: 'Avoid', color: COLORS.error, icon: '⛔' },
];

const FoodCard = ({ food }) => (
  <View style={styles.foodCard}>
    <View style={styles.foodHeader}>
      <Text style={styles.foodName}>{food.name}</Text>
      <View style={styles.scorePill}>
        <Text style={styles.scoreText}>{food.score > 0 ? '+' : ''}{food.score}</Text>
      </View>
    </View>
    {food.category ? (
      <Text style={styles.category}>{food.category}</Text>
    ) : null}
    <View style={styles.propsRow}>
      {food.rasa ? <Tag label={`Rasa: ${food.rasa}`} /> : null}
      {food.virya ? <Tag label={`Virya: ${food.virya}`} /> : null}
      {food.guna ? <Tag label={`Guna: ${food.guna}`} /> : null}
    </View>
    {food.reasons?.length > 0 && (
      <View style={styles.reasons}>
        {food.reasons.map((r, i) => (
          <Text key={i} style={styles.reason}>• {r}</Text>
        ))}
      </View>
    )}
  </View>
);

const Tag = ({ label }) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>{label}</Text>
  </View>
);

const FoodRecommendationsScreen = ({ navigation }) => {
  const { state } = useApp();
  const userId = state.user?.id;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('highly_recommended');

  const load = async () => {
    if (!userId) return;
    const res = await getFoodRecommendations(userId);
    if (res.success) setData(res.data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, [userId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Analyzing your doshas & season...</Text>
      </View>
    );
  }

  const recs = data?.recommendations || {};
  const list = recs[tab] || [];
  const mealPlan = data?.meal_plan;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🍽️ Ayurvedic Foods</Text>
        <View style={{ width: 24 }} />
      </View>

      {data?.context && (
        <View style={styles.contextCard}>
          <Text style={styles.contextTitle}>Your Context</Text>
          <Text style={styles.contextItem}>Agni: {data.context.agni_type}</Text>
          <Text style={styles.contextItem}>Season: {data.context.season}</Text>
          <Text style={styles.contextItem}>Dominant Dosha: {data.context.dominant_dosha}</Text>
        </View>
      )}

      <View style={styles.tabsRow}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && { backgroundColor: t.color }]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]}>
              {t.icon} {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.listWrap}>
        {list.length === 0 ? (
          <Text style={styles.empty}>No foods in this category.</Text>
        ) : (
          list.map((f, i) => <FoodCard key={i} food={f} />)
        )}
      </View>

      {mealPlan && (
        <View style={styles.mealPlanCard}>
          <Text style={styles.sectionTitle}>🕐 Today's Meal Plan</Text>
          {Object.entries(mealPlan).filter(([k]) => !['guidelines', 'protein_target_g', 'protein_sources'].includes(k)).map(([key, meal]) => (
            <View key={key} style={styles.mealRow}>
              <Text style={styles.mealLabel}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
              <Text style={styles.mealTime}>{meal.time}</Text>
              <Text style={styles.mealItems}>{(meal.items || []).join(', ') || '-'}</Text>
              {meal.notes && <Text style={styles.mealNotes}>{meal.notes}</Text>}
            </View>
          ))}
          {mealPlan.guidelines?.length > 0 && (
            <View style={styles.guidelines}>
              <Text style={styles.sectionTitle}>📜 Guidelines</Text>
              {mealPlan.guidelines.map((g, i) => (
                <Text key={i} style={styles.guideline}>• {g}</Text>
              ))}
            </View>
          )}
          {mealPlan.protein_target_g && (
            <Text style={styles.proteinTarget}>
              🎯 Daily Protein Target: {mealPlan.protein_target_g}g
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  loadingText: { ...FONTS.caption, marginTop: SIZES.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.screenPadding, paddingTop: 50 },
  back: { fontSize: 28, color: COLORS.text },
  title: { ...FONTS.title, fontSize: 20 },
  contextCard: { backgroundColor: COLORS.surface, margin: SIZES.md, padding: SIZES.md, borderRadius: SIZES.borderRadius, ...SHADOWS.small },
  contextTitle: { ...FONTS.bold, marginBottom: 6 },
  contextItem: { ...FONTS.caption, marginTop: 2 },
  tabsRow: { flexDirection: 'row', paddingHorizontal: SIZES.md, gap: 6 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: SIZES.borderRadius, backgroundColor: COLORS.surface, alignItems: 'center' },
  tabLabel: { ...FONTS.caption, fontWeight: '600' },
  tabLabelActive: { color: '#fff' },
  listWrap: { padding: SIZES.md },
  empty: { ...FONTS.caption, textAlign: 'center', padding: SIZES.lg },
  foodCard: { backgroundColor: COLORS.surface, padding: SIZES.md, borderRadius: SIZES.borderRadius, marginBottom: SIZES.sm, ...SHADOWS.small },
  foodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  foodName: { ...FONTS.bold, fontSize: 15 },
  scorePill: { backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  scoreText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  category: { ...FONTS.caption, color: COLORS.secondary, marginTop: 2 },
  propsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 4 },
  tag: { backgroundColor: COLORS.background, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 10, color: COLORS.textSecondary },
  reasons: { marginTop: 8 },
  reason: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  mealPlanCard: { backgroundColor: COLORS.surface, margin: SIZES.md, padding: SIZES.md, borderRadius: SIZES.borderRadius, ...SHADOWS.small },
  sectionTitle: { ...FONTS.bold, fontSize: 16, marginBottom: SIZES.sm },
  mealRow: { borderLeftWidth: 3, borderLeftColor: COLORS.primary, paddingLeft: SIZES.sm, marginBottom: SIZES.sm },
  mealLabel: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  mealTime: { fontSize: 11, color: COLORS.textSecondary },
  mealItems: { ...FONTS.regular, marginTop: 2 },
  mealNotes: { fontSize: 11, color: COLORS.textLight, marginTop: 2, fontStyle: 'italic' },
  guidelines: { marginTop: SIZES.md, paddingTop: SIZES.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  guideline: { ...FONTS.caption, marginTop: 4 },
  proteinTarget: { ...FONTS.bold, color: COLORS.secondary, marginTop: SIZES.md, textAlign: 'center' },
});

export default FoodRecommendationsScreen;
