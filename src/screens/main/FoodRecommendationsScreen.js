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
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
import { useApp } from '../../context/AppContext';
import { getFoodRecommendations } from '../../services/api';

const TABS = [
  { key: 'best',     label: 'Best',     color: COLORS.success, ion: 'star' },
  { key: 'good',     label: 'Good',     color: COLORS.primary, ion: 'thumbs-up-outline' },
  { key: 'moderate', label: 'OK',       color: COLORS.warning, ion: 'remove-circle-outline' },
  { key: 'avoid',    label: 'Avoid',    color: COLORS.error,   ion: 'close-circle-outline' },
];

const FoodCard = ({ food }) => (
  <View style={styles.foodCard}>
    <View style={styles.foodHeader}>
      <Text style={styles.foodName}>{food.name}</Text>
      {food.calories ? (
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>{food.calories} kcal</Text>
        </View>
      ) : null}
    </View>
    {food.category ? <Text style={styles.category}>{food.category}</Text> : null}
    {food.properties?.length > 0 && (
      <View style={styles.propsRow}>
        {food.properties.slice(0, 4).map((p, i) => (
          <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>{p}</Text>
          </View>
        ))}
      </View>
    )}
  </View>
);

const FoodRecommendationsScreen = ({ navigation }) => {
  const { state } = useApp();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('best');

  const load = async () => {
    const res = await getFoodRecommendations();
    if (res.success) setData(res.data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Analyzing your dosha & season...</Text>
      </View>
    );
  }

  const list = (data && data[tab]) || [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Ayurvedic Foods</Text>
        <View style={{ width: 24 }} />
      </View>

      {data && (
        <View style={styles.contextCard}>
          <Text style={styles.contextTitle}>Your Profile</Text>
          <Text style={styles.contextItem}>Dominant Dosha: {data.dominant_dosha}</Text>
          <Text style={styles.contextItem}>Prakriti: {data.prakriti}</Text>
          {data.dosha_scores && (
            <Text style={styles.contextItem}>
              Vata {data.dosha_scores.vata}% · Pitta {data.dosha_scores.pitta}% · Kapha {data.dosha_scores.kapha}%
            </Text>
          )}
        </View>
      )}

      <View style={styles.tabsRow}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && { backgroundColor: t.color }]}
            onPress={() => setTab(t.key)}
          >
            <Ionicons name={t.ion} size={14} color={tab === t.key ? '#fff' : t.color} style={{ marginRight: 4 }} />
            <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]}>
              {t.label} ({(data && data[t.key]?.length) || 0})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.listWrap}>
        {list.length === 0 ? (
          <Text style={styles.empty}>No foods in this category.</Text>
        ) : (
          list.map((f, i) => <FoodCard key={`${tab}-${i}`} food={f} />)
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  loadingText: { ...FONTS.caption, marginTop: SIZES.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.screenPadding, paddingTop: 50 },
  title: { ...FONTS.title, fontSize: 20 },
  contextCard: { backgroundColor: COLORS.surface, margin: SIZES.md, padding: SIZES.md, borderRadius: SIZES.borderRadius, ...SHADOWS.small },
  contextTitle: { ...FONTS.bold, marginBottom: 6 },
  contextItem: { ...FONTS.caption, marginTop: 2 },
  tabsRow: { flexDirection: 'row', paddingHorizontal: SIZES.md, gap: 6, marginBottom: 8 },
  tabBtn: { flex: 1, paddingVertical: 10, paddingHorizontal: 4, borderRadius: SIZES.borderRadius, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  tabLabel: { ...FONTS.caption, fontWeight: '600', fontSize: 11 },
  tabLabelActive: { color: '#fff' },
  listWrap: { padding: SIZES.md },
  empty: { ...FONTS.caption, textAlign: 'center', padding: SIZES.lg },
  foodCard: { backgroundColor: COLORS.surface, padding: SIZES.md, borderRadius: SIZES.borderRadius, marginBottom: SIZES.sm, ...SHADOWS.small },
  foodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  foodName: { ...FONTS.bold, fontSize: 15, flex: 1 },
  scorePill: { backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  scoreText: { color: '#fff', fontWeight: '700', fontSize: 11 },
  category: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 },
  propsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 4 },
  tag: { backgroundColor: COLORS.background, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 10, color: COLORS.textSecondary },
});

export default FoodRecommendationsScreen;
