import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
import { useApp } from '../../context/AppContext';
import { analyzeNadi, getNadiHistory } from '../../services/api';

const NadiParikshaScreen = ({ navigation }) => {
  const { state } = useApp();
  const userId = state.user?.id;
  const [pulseRate, setPulseRate] = useState('72');
  const [hrv, setHrv] = useState('45');
  const [amplitude, setAmplitude] = useState('medium');
  const [rhythm, setRhythm] = useState('regular');
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const res = await getNadiHistory(userId);
      if (res.success) setHistory(res.data.history || []);
    })();
  }, [userId]);

  const handleAnalyze = async () => {
    if (!userId) return;
    setLoading(true);
    const res = await analyzeNadi(userId, {
      pulse_rate: parseInt(pulseRate),
      hrv: parseInt(hrv),
      amplitude,
      rhythm,
    });
    setLoading(false);
    if (res.success) setAnalysis(res.data.analysis);
    else Alert.alert('Error', res.error);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>💓 Nadi Pariksha</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.intro}>
        Pulse diagnosis based on classical Ayurveda. Measure your pulse at the wrist (radial artery)
        or connect an ESP32 sensor for automatic readings.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Enter Pulse Data</Text>
        <Field label="Pulse Rate (BPM)" value={pulseRate} onChange={setPulseRate} keyboardType="numeric" />
        <Field label="HRV (ms)" value={hrv} onChange={setHrv} keyboardType="numeric" />

        <Text style={styles.fieldLabel}>Amplitude</Text>
        <View style={styles.row}>
          {['low', 'medium', 'high'].map(a => (
            <TouchableOpacity key={a} style={[styles.chip, amplitude === a && styles.chipActive]} onPress={() => setAmplitude(a)}>
              <Text style={[styles.chipText, amplitude === a && styles.chipTextActive]}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Rhythm</Text>
        <View style={styles.row}>
          {['regular', 'irregular', 'thready', 'bounding'].map(r => (
            <TouchableOpacity key={r} style={[styles.chip, rhythm === r && styles.chipActive]} onPress={() => setRhythm(r)}>
              <Text style={[styles.chipText, rhythm === r && styles.chipTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.analyzeBtn} onPress={handleAnalyze} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.analyzeBtnText}>🔍 Analyze Pulse</Text>}
        </TouchableOpacity>
      </View>

      {analysis && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🌀 Nadi Analysis</Text>
          <View style={styles.nadiType}>
            <Text style={styles.nadiIcon}>🐍</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.nadiName}>{analysis.nadi_type}</Text>
              <Text style={styles.nadiDesc}>{analysis.description}</Text>
            </View>
          </View>

          <Text style={styles.dosha}>Dominant Dosha: {analysis.dominant_dosha}</Text>
          <View style={styles.doshaBars}>
            {['vata', 'pitta', 'kapha'].map(d => (
              <View key={d} style={styles.doshaBarRow}>
                <Text style={styles.doshaLabel}>{d.toUpperCase()}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, {
                    width: `${analysis.dosha_percentages?.[d] || 0}%`,
                    backgroundColor: d === 'vata' ? COLORS.vata : d === 'pitta' ? COLORS.pitta : COLORS.kapha,
                  }]} />
                </View>
                <Text style={styles.doshaPct}>{analysis.dosha_percentages?.[d] || 0}%</Text>
              </View>
            ))}
          </View>

          {analysis.insights?.length > 0 && (
            <>
              <Text style={styles.insightTitle}>Insights</Text>
              {analysis.insights.map((ins, i) => (
                <Text key={i} style={styles.insight}>• {ins}</Text>
              ))}
            </>
          )}
        </View>
      )}

      {history.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📜 History</Text>
          {history.slice(0, 5).map((h, i) => (
            <View key={i} style={styles.historyRow}>
              <Text style={styles.historyDate}>{new Date(h.created_at).toLocaleDateString()}</Text>
              <Text style={styles.historyType}>{h.nadi_type}</Text>
              <Text style={styles.historyDosha}>{h.dominant_dosha}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const Field = ({ label, value, onChange, keyboardType }) => (
  <>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput style={styles.input} value={value} onChangeText={onChange} keyboardType={keyboardType} />
  </>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.screenPadding, paddingTop: 50 },
  back: { fontSize: 28 },
  title: { ...FONTS.title, fontSize: 20 },
  intro: { ...FONTS.caption, padding: SIZES.md, fontStyle: 'italic' },
  card: { backgroundColor: COLORS.surface, margin: SIZES.md, padding: SIZES.md, borderRadius: SIZES.borderRadius, ...SHADOWS.small },
  sectionTitle: { ...FONTS.bold, marginBottom: SIZES.sm },
  fieldLabel: { ...FONTS.caption, marginTop: SIZES.sm, marginBottom: 4, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 12, color: COLORS.text },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  analyzeBtn: { backgroundColor: COLORS.primary, padding: SIZES.md, borderRadius: SIZES.borderRadius, marginTop: SIZES.md, alignItems: 'center' },
  analyzeBtnText: { color: '#fff', fontWeight: '700' },
  nadiType: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, padding: SIZES.sm, borderRadius: 8, marginBottom: SIZES.sm },
  nadiIcon: { fontSize: 32, marginRight: SIZES.sm },
  nadiName: { ...FONTS.bold },
  nadiDesc: { ...FONTS.caption, marginTop: 2 },
  dosha: { ...FONTS.bold, marginTop: SIZES.sm },
  doshaBars: { marginTop: SIZES.sm },
  doshaBarRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  doshaLabel: { width: 60, fontSize: 11, fontWeight: '700' },
  barTrack: { flex: 1, height: 10, backgroundColor: COLORS.border, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  doshaPct: { width: 40, textAlign: 'right', fontSize: 11, fontWeight: '700' },
  insightTitle: { ...FONTS.bold, marginTop: SIZES.md },
  insight: { ...FONTS.caption, marginTop: 4 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  historyDate: { fontSize: 11, color: COLORS.textSecondary },
  historyType: { fontSize: 12, fontWeight: '600' },
  historyDosha: { fontSize: 11, color: COLORS.primary },
});

export default NadiParikshaScreen;
