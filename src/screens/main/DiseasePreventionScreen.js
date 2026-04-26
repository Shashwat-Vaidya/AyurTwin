import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
import { getPreventionPlans } from '../../services/api';

const DiseasePreventionScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getPreventionPlans();
      if (res.success) setData(res.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  if (!data) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.textLight} />
        <Text style={styles.errorText}>Could not load prevention plan.</Text>
      </View>
    );
  }

  const high = data.high_priority || [];
  const moderate = data.moderate_priority || [];
  const prevention = data.prevention || [];
  const lifestyle = data.lifestyle || [];
  const ayurvedic = data.ayurvedic || [];
  const alerts = data.alerts || [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Disease Prevention</Text>
        <View style={{ width: 24 }} />
      </View>

      {alerts.length > 0 && (
        <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: COLORS.error }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning-outline" size={18} color={COLORS.error} />
            <Text style={styles.sectionTitle}>Urgent Alerts</Text>
          </View>
          {alerts.map((a, i) => (
            <Text key={`al-${i}`} style={[styles.bullet, { color: COLORS.error }]}>• {a}</Text>
          ))}
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Risk Priority</Text>
        </View>
        {high.length > 0 ? (
          <>
            <Text style={styles.subTitle}>High Priority</Text>
            {high.map((d, i) => (
              <View key={`h-${i}`} style={[styles.riskPill, { backgroundColor: COLORS.error + '15', borderColor: COLORS.error }]}>
                <Text style={[styles.riskPillText, { color: COLORS.error }]}>{d}</Text>
              </View>
            ))}
          </>
        ) : null}
        {moderate.length > 0 ? (
          <>
            <Text style={styles.subTitle}>Moderate Priority</Text>
            {moderate.map((d, i) => (
              <View key={`m-${i}`} style={[styles.riskPill, { backgroundColor: COLORS.warning + '15', borderColor: COLORS.warning }]}>
                <Text style={[styles.riskPillText, { color: COLORS.warning }]}>{d}</Text>
              </View>
            ))}
          </>
        ) : null}
        {high.length === 0 && moderate.length === 0 && (
          <Text style={styles.bodyText}>No significant disease risks detected. Maintain your current routine.</Text>
        )}
      </View>

      {prevention.length > 0 && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medkit-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Prevention Steps</Text>
          </View>
          {prevention.map((g, i) => (
            <Text key={`p-${i}`} style={styles.bullet}>• {g}</Text>
          ))}
        </View>
      )}

      {lifestyle.length > 0 && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="walk-outline" size={18} color={COLORS.success} />
            <Text style={styles.sectionTitle}>Lifestyle Changes</Text>
          </View>
          {lifestyle.map((g, i) => (
            <Text key={`l-${i}`} style={styles.bullet}>• {g}</Text>
          ))}
        </View>
      )}

      {ayurvedic.length > 0 && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="leaf-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Ayurvedic Guidance</Text>
          </View>
          {ayurvedic.map((g, i) => (
            <Text key={`a-${i}`} style={styles.bullet}>• {g}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  errorText: { ...FONTS.caption, marginTop: 12, textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.screenPadding, paddingTop: 50 },
  title: { ...FONTS.title, fontSize: 20 },
  card: { backgroundColor: COLORS.surface, margin: SIZES.md, padding: SIZES.md, borderRadius: SIZES.borderRadius, ...SHADOWS.small },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SIZES.sm },
  sectionTitle: { ...FONTS.bold, fontSize: 14 },
  subTitle: { ...FONTS.bold, fontSize: 12, marginTop: SIZES.sm, marginBottom: 4, color: COLORS.textSecondary },
  bodyText: { ...FONTS.caption, lineHeight: 18 },
  bullet: { ...FONTS.caption, marginTop: 4, lineHeight: 18 },
  riskPill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, borderWidth: 1, marginRight: 6, marginTop: 4 },
  riskPillText: { fontSize: 12, fontWeight: '700' },
});

export default DiseasePreventionScreen;
