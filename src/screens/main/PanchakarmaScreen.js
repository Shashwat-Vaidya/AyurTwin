import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../config/theme';
import { getPanchakarma } from '../../services/api';

const THERAPY_ICONS = {
  Vamana: 'arrow-up-outline',
  Virechana: 'arrow-down-outline',
  Basti: 'water-outline',
  Nasya: 'cloud-outline',
  Raktamokshana: 'medkit-outline',
};

const PanchakarmaScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getPanchakarma();
      if (res.success) setData(res.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.textLight} />
        <Text style={styles.errorText}>Could not load Panchakarma information.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Panchakarma</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.heroCard}>
        <Ionicons name="leaf" size={36} color={COLORS.primary} />
        <Text style={styles.heroTitle}>{data.title}</Text>
        <Text style={styles.heroOverview}>{data.overview}</Text>
      </View>

      <Text style={styles.sectionTitle}>The Five Therapies</Text>
      {(data.procedures || []).map((proc, i) => (
        <View key={`proc-${i}`} style={styles.therapyCard}>
          <View style={styles.therapyHeader}>
            <Ionicons name={THERAPY_ICONS[proc.name] || 'medkit-outline'} size={24} color={COLORS.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.therapyName}>{proc.name}</Text>
              <Text style={styles.therapyMeaning}>{proc.meaning}</Text>
            </View>
          </View>
          <Text style={styles.therapyIndication}>Indication: {proc.indication}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Treatment Phases</Text>
      {(data.phases || []).map((ph, i) => (
        <View key={`ph-${i}`} style={styles.phaseRow}>
          <Text style={styles.phaseNum}>{i + 1}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.phaseName}>{ph.phase}</Text>
            <Text style={styles.phaseDesc}>{ph.desc}</Text>
          </View>
        </View>
      ))}

      {data.duration && (
        <View style={styles.metaCard}>
          <Ionicons name="time-outline" size={20} color={COLORS.primary} />
          <Text style={styles.metaText}>Typical Duration: {data.duration}</Text>
        </View>
      )}

      {data.caveat && (
        <View style={styles.cautionCard}>
          <Ionicons name="warning-outline" size={20} color={COLORS.error} />
          <Text style={styles.cautionText}>{data.caveat}</Text>
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
  heroCard: { backgroundColor: COLORS.surface, margin: SIZES.md, padding: SIZES.lg, borderRadius: SIZES.borderRadiusLg, alignItems: 'center', ...SHADOWS.small },
  heroTitle: { ...FONTS.bold, fontSize: 16, marginTop: 12, textAlign: 'center' },
  heroOverview: { ...FONTS.caption, marginTop: 8, lineHeight: 20, textAlign: 'center' },
  sectionTitle: { ...FONTS.bold, fontSize: 16, marginHorizontal: SIZES.md, marginTop: SIZES.md, marginBottom: SIZES.sm },
  therapyCard: { backgroundColor: COLORS.surface, marginHorizontal: SIZES.md, marginBottom: 8, padding: SIZES.md, borderRadius: SIZES.borderRadius, ...SHADOWS.small },
  therapyHeader: { flexDirection: 'row', alignItems: 'center' },
  therapyName: { ...FONTS.bold, fontSize: 15 },
  therapyMeaning: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2, fontStyle: 'italic' },
  therapyIndication: { ...FONTS.caption, marginTop: 8, lineHeight: 18 },
  phaseRow: { flexDirection: 'row', backgroundColor: COLORS.surface, marginHorizontal: SIZES.md, marginBottom: 8, padding: SIZES.md, borderRadius: SIZES.borderRadius, ...SHADOWS.small },
  phaseNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, color: '#fff', textAlign: 'center', lineHeight: 28, fontWeight: '800', marginRight: 12 },
  phaseName: { ...FONTS.bold, fontSize: 14 },
  phaseDesc: { ...FONTS.caption, marginTop: 4, lineHeight: 18 },
  metaCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, margin: SIZES.md, padding: SIZES.md, borderRadius: SIZES.borderRadius, gap: 10 },
  metaText: { ...FONTS.bold, fontSize: 13 },
  cautionCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF5F5', marginHorizontal: SIZES.md, marginBottom: SIZES.lg, padding: SIZES.md, borderRadius: SIZES.borderRadius, borderLeftWidth: 4, borderLeftColor: COLORS.error, gap: 10 },
  cautionText: { ...FONTS.caption, flex: 1, color: COLORS.error, lineHeight: 18 },
});

export default PanchakarmaScreen;
