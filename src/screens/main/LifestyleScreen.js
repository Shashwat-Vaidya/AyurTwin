import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';
import GradientButton from '../../components/common/GradientButton';
import { useApp } from '../../context/AppContext';
import { calculateCalories, getSeasonalAdvice } from '../../utils/healthCalculations';

const LifestyleScreen = ({ navigation }) => {
  const { state } = useApp();
  const user = state.user || {};
  const regData = state.registrationData || {};
  const prakriti = state.prakritiResult?.prakriti?.toLowerCase() || 'vata';

  // Dinacharya
  const [dinacharya, setDinacharya] = useState({
    wake_early: false, drink_water: false, exercise: false, meditation: false,
    healthy_breakfast: false, healthy_lunch: false, healthy_dinner: false, early_sleep: false,
  });

  // Calorie calculator
  const [calAge, setCalAge] = useState(String(regData.age || user.age || 25));
  const [calHeight, setCalHeight] = useState(String(regData.height_cm || user.height_cm || 170));
  const [calWeight, setCalWeight] = useState(String(regData.weight_kg || user.weight_kg || 70));
  const [calGender, setCalGender] = useState(regData.gender?.toLowerCase() || 'male');
  const [calActivity, setCalActivity] = useState(regData.physical_activity || 'moderate');
  const [calorieResult, setCalorieResult] = useState(null);

  // Meal tracker
  const [meals, setMeals] = useState({
    breakfast: { done: false, calories: '' },
    lunch: { done: false, calories: '' },
    dinner: { done: false, calories: '' },
  });

  const season = getSeasonalAdvice();

  const toggleDinacharya = (key) => {
    setDinacharya({ ...dinacharya, [key]: !dinacharya[key] });
  };

  const completedCount = Object.values(dinacharya).filter(Boolean).length;
  const dinacharyaProgress = (completedCount / 8) * 100;

  const handleCalorieCalc = () => {
    const result = calculateCalories(
      parseInt(calAge), parseFloat(calHeight), parseFloat(calWeight),
      calGender, calActivity
    );
    setCalorieResult(result);
  };

  const getDietRecommendations = () => {
    if (prakriti.includes('vata')) return [
      { meal: 'Breakfast', items: 'Warm oatmeal with ghee, dates, and almonds. Warm milk with turmeric.' },
      { meal: 'Lunch', items: 'Rice with dal, cooked vegetables, ghee. Warm lentil soup.' },
      { meal: 'Dinner', items: 'Light khichdi with vegetables. Warm milk before bed.' },
    ];
    if (prakriti.includes('pitta')) return [
      { meal: 'Breakfast', items: 'Cooling smoothie with banana, coconut. Oats with fruits.' },
      { meal: 'Lunch', items: 'Basmati rice, green vegetables, cucumber raita. Coconut water.' },
      { meal: 'Dinner', items: 'Light salad with mint. Mung bean soup. Cooling herbal tea.' },
    ];
    return [
      { meal: 'Breakfast', items: 'Light toast with honey. Ginger tea. Fresh fruits.' },
      { meal: 'Lunch', items: 'Steamed vegetables with spices. Light grains. Warm soup.' },
      { meal: 'Dinner', items: 'Light soup with ginger. Steamed vegetables. Avoid heavy food.' },
    ];
  };

  const exerciseRecommendations = () => {
    if (prakriti.includes('vata')) return [
      { name: 'Gentle Yoga', duration: '30 min', icon: '🧘' },
      { name: 'Walking', duration: '30 min', icon: '🚶' },
      { name: 'Tai Chi', duration: '20 min', icon: '🌊' },
    ];
    if (prakriti.includes('pitta')) return [
      { name: 'Swimming', duration: '30 min', icon: '🏊' },
      { name: 'Moon Salutation', duration: '20 min', icon: '🌙' },
      { name: 'Cycling', duration: '30 min', icon: '🚴' },
    ];
    return [
      { name: 'Brisk Walking', duration: '45 min', icon: '🏃' },
      { name: 'HIIT', duration: '20 min', icon: '💪' },
      { name: 'Power Yoga', duration: '30 min', icon: '🔥' },
    ];
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Lifestyle</Text>
        <Text style={styles.subtitle}>Personalized for {state.prakritiResult?.prakriti || 'your'} constitution</Text>
      </View>

      <View style={styles.content}>
        {/* Ayurvedic Feature Tiles */}
        <Text style={styles.sectionTitle}>Ayurvedic Tools</Text>
        <View style={styles.tileGrid}>
          {[
            { label: 'Foods',        ion: 'restaurant-outline',      screen: 'FoodRecommendations', color: '#FF6B35' },
            { label: 'Yoga',         ion: 'body-outline',            screen: 'Yoga',               color: '#2D6A4F' },
            { label: 'Dosha Clock',  ion: 'time-outline',            screen: 'DoshaClock',         color: '#7B68EE' },
            { label: 'Panchakarma',  ion: 'flower-outline',          screen: 'Panchakarma',        color: '#40916C' },
            { label: 'Ritucharya',   ion: 'calendar-outline',        screen: 'Ritucharya',         color: '#FFB347' },
            { label: 'Food Compat.', ion: 'warning-outline',         screen: 'ViruddhaAhara',      color: '#FFC107' },
            { label: 'Prevention',   ion: 'shield-checkmark-outline',screen: 'DiseasePrevention',  color: '#17A2B8' },
          ].map((t) => (
            <TouchableOpacity
              key={t.screen}
              style={[styles.tile, { borderTopColor: t.color }]}
              onPress={() => navigation?.navigate?.(t.screen)}
            >
              <Ionicons name={t.ion} size={28} color={t.color} style={{ marginBottom: 6 }} />
              <Text style={styles.tileLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dinacharya */}
        <Text style={styles.sectionTitle}>🌅 Dinacharya (Daily Routine)</Text>
        <Card variant="elevated">
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>{completedCount}/8 completed</Text>
            <Text style={[styles.progressPercent, { color: dinacharyaProgress > 60 ? COLORS.success : COLORS.warning }]}>
              {Math.round(dinacharyaProgress)}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${dinacharyaProgress}%` }]} />
          </View>
          {[
            { key: 'wake_early', label: 'Wake up early (before 6 AM)', icon: '🌅' },
            { key: 'drink_water', label: 'Drink warm water', icon: '💧' },
            { key: 'exercise', label: 'Exercise / Yoga', icon: '🏃' },
            { key: 'meditation', label: 'Meditation (10 min)', icon: '🧘' },
            { key: 'healthy_breakfast', label: 'Healthy breakfast', icon: '🍳' },
            { key: 'healthy_lunch', label: 'Balanced lunch', icon: '🍱' },
            { key: 'healthy_dinner', label: 'Light dinner (before 8 PM)', icon: '🍲' },
            { key: 'early_sleep', label: 'Sleep by 10 PM', icon: '😴' },
          ].map((item) => (
            <TouchableOpacity key={item.key} style={styles.checkItem} onPress={() => toggleDinacharya(item.key)}>
              <Text style={styles.checkIcon}>{dinacharya[item.key] ? '✅' : '⬜'}</Text>
              <Text style={styles.checkEmoji}>{item.icon}</Text>
              <Text style={[styles.checkLabel, dinacharya[item.key] && styles.checkLabelDone]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Diet Recommendations */}
        <Text style={styles.sectionTitle}>🍽 Diet Recommendations</Text>
        <Text style={styles.sectionNote}>Based on your {state.prakritiResult?.prakriti || 'Dosha'} constitution</Text>
        {getDietRecommendations().map((meal, idx) => (
          <Card key={idx} style={styles.mealCard}>
            <Text style={styles.mealTitle}>{meal.meal}</Text>
            <Text style={styles.mealItems}>{meal.items}</Text>
          </Card>
        ))}

        {/* Calorie Calculator */}
        <Text style={styles.sectionTitle}>🔥 Calorie Calculator</Text>
        <Card variant="elevated">
          <View style={styles.calcRow}>
            <View style={styles.calcField}>
              <Text style={styles.calcLabel}>Age</Text>
              <TextInput style={styles.calcInput} value={calAge} onChangeText={setCalAge} keyboardType="numeric" />
            </View>
            <View style={styles.calcField}>
              <Text style={styles.calcLabel}>Height (cm)</Text>
              <TextInput style={styles.calcInput} value={calHeight} onChangeText={setCalHeight} keyboardType="numeric" />
            </View>
          </View>
          <View style={styles.calcRow}>
            <View style={styles.calcField}>
              <Text style={styles.calcLabel}>Weight (kg)</Text>
              <TextInput style={styles.calcInput} value={calWeight} onChangeText={setCalWeight} keyboardType="numeric" />
            </View>
            <View style={styles.calcField}>
              <Text style={styles.calcLabel}>Activity</Text>
              <View style={styles.calcChips}>
                {['low', 'moderate', 'high'].map((a) => (
                  <TouchableOpacity key={a} onPress={() => setCalActivity(a)}
                    style={[styles.miniChip, calActivity === a && styles.miniChipActive]}>
                    <Text style={[styles.miniChipText, calActivity === a && styles.miniChipTextActive]}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <GradientButton title="Calculate" onPress={handleCalorieCalc} style={styles.calcBtn} />

          {calorieResult && (
            <View style={styles.calcResult}>
              <View style={styles.calcResultItem}>
                <Text style={styles.calcResultValue}>{calorieResult.bmr}</Text>
                <Text style={styles.calcResultLabel}>BMR (cal)</Text>
              </View>
              <View style={styles.calcResultItem}>
                <Text style={[styles.calcResultValue, { color: COLORS.primary }]}>{calorieResult.tdee}</Text>
                <Text style={styles.calcResultLabel}>Daily Need</Text>
              </View>
              <View style={styles.calcResultItem}>
                <Text style={[styles.calcResultValue, { color: COLORS.success }]}>{calorieResult.forWeightLoss}</Text>
                <Text style={styles.calcResultLabel}>Weight Loss</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Meal Tracker */}
        <Text style={styles.sectionTitle}>🍛 Meal Tracker</Text>
        <Card variant="elevated">
          {['breakfast', 'lunch', 'dinner'].map((meal) => (
            <View key={meal} style={styles.mealTrackRow}>
              <TouchableOpacity onPress={() => setMeals({ ...meals, [meal]: { ...meals[meal], done: !meals[meal].done } })}>
                <Text style={styles.mealTrackCheck}>{meals[meal].done ? '✅' : '⬜'}</Text>
              </TouchableOpacity>
              <Text style={styles.mealTrackName}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</Text>
              <TextInput
                style={styles.mealTrackInput}
                placeholder="cal"
                keyboardType="numeric"
                value={meals[meal].calories}
                onChangeText={(v) => setMeals({ ...meals, [meal]: { ...meals[meal], calories: v } })}
              />
            </View>
          ))}
          <View style={styles.mealTotalRow}>
            <Text style={styles.mealTotalLabel}>Total:</Text>
            <Text style={styles.mealTotalValue}>
              {Object.values(meals).reduce((sum, m) => sum + (parseInt(m.calories) || 0), 0)} cal
            </Text>
          </View>
        </Card>

        {/* Ritucharya */}
        <Text style={styles.sectionTitle}>🌦 Ritucharya (Seasonal Routine)</Text>
        <Card variant="elevated" style={[styles.seasonCard, { borderLeftColor: COLORS[season.dosha] }]}>
          <Text style={styles.seasonTitle}>{season.season}</Text>
          <Text style={styles.seasonAdvice}>{season.advice}</Text>
          <View style={[styles.seasonBadge, { backgroundColor: COLORS[season.dosha] + '20' }]}>
            <Text style={[styles.seasonBadgeText, { color: COLORS[season.dosha] }]}>{season.dosha} season</Text>
          </View>
        </Card>

        {/* Exercise */}
        <Text style={styles.sectionTitle}>🧘 Exercise Suggestions</Text>
        <View style={styles.exerciseGrid}>
          {exerciseRecommendations().map((ex, idx) => (
            <Card key={idx} style={styles.exerciseCard}>
              <Text style={styles.exerciseIcon}>{ex.icon}</Text>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseDuration}>{ex.duration}</Text>
            </Card>
          ))}
        </View>

        {/* Stress Relief */}
        <Text style={styles.sectionTitle}>😌 Stress Relief Tools</Text>
        <Card variant="elevated">
          {[
            { icon: '🧘', name: 'Guided Meditation', desc: '10-minute calming meditation' },
            { icon: '🌬', name: 'Breathing Exercise', desc: 'Anulom Vilom pranayama - 5 min' },
            { icon: '🎵', name: 'Calming Music', desc: 'Nature sounds for relaxation' },
            { icon: '📝', name: 'Gratitude Journal', desc: 'Write 3 things you are grateful for' },
          ].map((tool, idx) => (
            <TouchableOpacity key={idx} style={styles.toolRow}>
              <Text style={styles.toolIcon}>{tool.icon}</Text>
              <View style={styles.toolInfo}>
                <Text style={styles.toolName}>{tool.name}</Text>
                <Text style={styles.toolDesc}>{tool.desc}</Text>
              </View>
              <Text style={styles.toolArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>

        <Text style={styles.disclaimer}>
          This app provides preventive health insights and does not replace professional medical advice.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingHorizontal: SIZES.screenPadding, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 20, marginBottom: 10 },
  sectionNote: { fontSize: 11, color: COLORS.textLight, marginBottom: 8, fontStyle: 'italic' },
  // Progress
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressText: { fontSize: 13, color: COLORS.textSecondary },
  progressPercent: { fontSize: 14, fontWeight: '700' },
  progressTrack: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden', marginBottom: 14 },
  progressFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 3 },
  // Checklist
  checkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  checkIcon: { fontSize: 18 },
  checkEmoji: { fontSize: 18 },
  checkLabel: { fontSize: 14, color: COLORS.text },
  checkLabelDone: { textDecorationLine: 'line-through', color: COLORS.textLight },
  // Meal recommendation
  mealCard: { marginBottom: 8 },
  mealTitle: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  mealItems: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  // Calorie
  calcRow: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  calcField: { flex: 1 },
  calcLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 4 },
  calcInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10, fontSize: 14 },
  calcChips: { flexDirection: 'row', gap: 4 },
  miniChip: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, backgroundColor: COLORS.background },
  miniChipActive: { backgroundColor: COLORS.primary },
  miniChipText: { fontSize: 10, fontWeight: '600', color: COLORS.textSecondary },
  miniChipTextActive: { color: '#FFF' },
  calcBtn: { marginTop: 8 },
  calcResult: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  calcResultItem: { alignItems: 'center' },
  calcResultValue: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  calcResultLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  // Meal Tracker
  mealTrackRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  mealTrackCheck: { fontSize: 20 },
  mealTrackName: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  mealTrackInput: { width: 60, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 6, fontSize: 13, textAlign: 'center' },
  mealTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 },
  mealTotalLabel: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  mealTotalValue: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  // Season
  seasonCard: { borderLeftWidth: 4 },
  seasonTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  seasonAdvice: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginTop: 6 },
  seasonBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, marginTop: 10 },
  seasonBadgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  // Exercise
  exerciseGrid: { flexDirection: 'row', gap: 10 },
  exerciseCard: { flex: 1, alignItems: 'center', padding: 14 },
  exerciseIcon: { fontSize: 28, marginBottom: 6 },
  exerciseName: { fontSize: 12, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  exerciseDuration: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  // Tools
  toolRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: COLORS.border, gap: 12 },
  toolIcon: { fontSize: 24 },
  toolInfo: { flex: 1 },
  toolName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  toolDesc: { fontSize: 12, color: COLORS.textSecondary },
  toolArrow: { fontSize: 24, color: COLORS.textLight },
  disclaimer: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 24, lineHeight: 14 },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  tile: { width: '30%', backgroundColor: COLORS.surface, padding: 12, borderRadius: 12, alignItems: 'center', borderTopWidth: 3, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  tileIcon: { fontSize: 28, marginBottom: 4 },
  tileLabel: { fontSize: 11, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
});

export default LifestyleScreen;
