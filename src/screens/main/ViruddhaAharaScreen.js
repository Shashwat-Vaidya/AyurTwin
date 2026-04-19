import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
import { checkFoodCompatibility } from '../../services/api';

const ViruddhaAharaScreen = ({ navigation }) => {
  const [input, setInput] = useState('');
  const [foods, setFoods] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const addFood = () => {
    const v = input.trim();
    if (!v) return;
    setFoods([...foods, v]);
    setInput('');
    setResult(null);
  };

  const removeFood = (idx) => setFoods(foods.filter((_, i) => i !== idx));

  const check = async () => {
    if (foods.length < 2) return;
    setLoading(true);
    const res = await checkFoodCompatibility(foods);
    setLoading(false);
    if (res.success) setResult(res.data);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>⚠️ Viruddha Ahara</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.intro}>
        Check if foods in your meal are compatible per Charaka Samhita. Incompatible combinations
        (Viruddha Ahara) block digestive channels and generate ama (toxins).
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Add Foods to Check</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="e.g., milk, yogurt, fish..."
            onSubmitEditing={addFood}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addFood}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.foodList}>
          {foods.map((f, i) => (
            <TouchableOpacity key={i} style={styles.foodChip} onPress={() => removeFood(i)}>
              <Text style={styles.foodChipText}>{f} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.checkBtn, foods.length < 2 && styles.checkBtnDisabled]}
          onPress={check}
          disabled={foods.length < 2 || loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkBtnText}>🔍 Check Compatibility</Text>}
        </TouchableOpacity>
      </View>

      {result && (
        <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: result.isCompatible ? COLORS.success : COLORS.error }]}>
          <Text style={[styles.resultTitle, { color: result.isCompatible ? COLORS.success : COLORS.error }]}>
            {result.isCompatible ? '✅ Compatible' : '⚠️ Incompatible'}
          </Text>
          <Text style={styles.resultRec}>{result.recommendation}</Text>

          {result.incompatiblePairs?.length > 0 && (
            <View style={styles.subSection}>
              <Text style={styles.sectionTitle}>Incompatible Pairs</Text>
              {result.incompatiblePairs.map((p, i) => (
                <View key={i} style={styles.pairCard}>
                  <Text style={styles.pairFoods}>{p.food1} + {p.food2}</Text>
                  <Text style={styles.pairType}>{p.type} · severity: {p.severity}</Text>
                  <Text style={styles.pairExpl}>{p.explanation}</Text>
                  {p.reference && <Text style={styles.pairRef}>📖 {p.reference}</Text>}
                </View>
              ))}
            </View>
          )}

          {result.warnings?.length > 0 && (
            <View style={styles.subSection}>
              <Text style={styles.sectionTitle}>Timing Warnings</Text>
              {result.warnings.map((w, i) => (
                <View key={i} style={styles.warningCard}>
                  <Text style={styles.warningFood}>{w.food}</Text>
                  <Text style={styles.warningText}>{w.warning}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.screenPadding, paddingTop: 50 },
  back: { fontSize: 28 },
  title: { ...FONTS.title, fontSize: 20 },
  intro: { ...FONTS.caption, padding: SIZES.md, fontStyle: 'italic' },
  card: { backgroundColor: COLORS.surface, margin: SIZES.md, padding: SIZES.md, borderRadius: SIZES.borderRadius, ...SHADOWS.small },
  sectionTitle: { ...FONTS.bold, marginBottom: SIZES.sm },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10 },
  addBtn: { width: 44, backgroundColor: COLORS.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  foodList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: SIZES.sm, minHeight: 30 },
  foodChip: { backgroundColor: COLORS.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  foodChipText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  checkBtn: { backgroundColor: COLORS.primary, padding: SIZES.md, borderRadius: SIZES.borderRadius, alignItems: 'center', marginTop: SIZES.md },
  checkBtnDisabled: { opacity: 0.5 },
  checkBtnText: { color: '#fff', fontWeight: '700' },
  resultTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  resultRec: { ...FONTS.caption },
  subSection: { marginTop: SIZES.md, paddingTop: SIZES.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  pairCard: { backgroundColor: '#FFF5F5', padding: SIZES.sm, borderRadius: 8, marginBottom: 6 },
  pairFoods: { ...FONTS.bold, fontSize: 13, color: COLORS.error },
  pairType: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  pairExpl: { ...FONTS.caption, marginTop: 4 },
  pairRef: { fontSize: 10, fontStyle: 'italic', color: COLORS.textLight, marginTop: 4 },
  warningCard: { backgroundColor: '#FFFBEB', padding: SIZES.sm, borderRadius: 8, marginBottom: 6 },
  warningFood: { ...FONTS.bold, fontSize: 13, color: COLORS.warning },
  warningText: { ...FONTS.caption, marginTop: 2 },
});

export default ViruddhaAharaScreen;
