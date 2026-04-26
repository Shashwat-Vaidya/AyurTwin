import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';

const AboutScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={COLORS.gradient.saffron} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        {/* Logo & Info */}
        <View style={styles.logoSection}>
          <LinearGradient colors={COLORS.gradient.saffron} style={styles.logo}>
            <Text style={styles.logoIcon}></Text>
          </LinearGradient>
          <Text style={styles.appName}>AyurTwin</Text>
          <Text style={styles.tagline}>Digital Health Twin</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Description */}
        <Card variant="elevated"style={styles.descCard}>
          <Text style={styles.descTitle}>About AyurTwin</Text>
          <Text style={styles.descText}>
            AyurTwin is an AI-powered Digital Health Twin system that combines modern technology with ancient Ayurvedic wisdom to provide preventive healthcare insights.
          </Text>
          <Text style={styles.descText}>
            Each user gets a virtual health profile (Digital Twin) that continuously stores health data, learns patterns, predicts risks, and suggests personalized improvements.
          </Text>
        </Card>

        {/* What We Do */}
        <Text style={styles.sectionTitle}>What We Do</Text>
        <View style={styles.featureList}>
          <FeatureItem icon=""title="AI Disease Prediction"desc="ML-powered risk analysis for 10+ diseases" />
          <FeatureItem icon=""title="Dosha Analysis"desc="Personalized Ayurvedic constitution assessment" />
          <FeatureItem icon=""title="Health Monitoring"desc="Real-time health metrics and vital tracking" />
          <FeatureItem icon=""title="Lifestyle Guidance"desc="Personalized diet, exercise, and routine recommendations" />
          <FeatureItem icon=""title="Family Monitoring"desc="Track health of your loved ones" />
          <FeatureItem icon=""title="Social Features"desc="Leaderboard and community motivation" />
        </View>

        {/* Technology */}
        <Text style={styles.sectionTitle}>Technology Stack</Text>
        <Card variant="elevated">
          <TechRow label="Frontend"value="React Native + Expo" />
          <TechRow label="Backend"value="Node.js + Express" />
          <TechRow label="Database"value="Supabase (PostgreSQL)" />
          <TechRow label="AI/ML"value="Random Forest, Gradient Boosting (planned)" />
          <TechRow label="Ayurveda Engine"value="Rule-based Dosha Analysis" />
        </Card>

        {/* Disclaimer */}
        <Text style={styles.sectionTitle}>Important Disclaimer</Text>
        <Card variant="outlined"style={styles.disclaimerCard}>
          <Text style={styles.disclaimerIcon}></Text>
          <Text style={styles.disclaimerText}>
            This application provides preventive health insights and risk predictions based on user-provided data. It does NOT provide medical diagnosis or replace professional medical advice. Always consult a qualified healthcare professional for medical concerns.
          </Text>
        </Card>

        {/* Credits */}
        <Text style={styles.sectionTitle}>Credits</Text>
        <Card variant="elevated">
          <Text style={styles.creditText}>Built with care for preventive healthcare.</Text>
          <Text style={styles.creditText}>Combining the wisdom of Ayurveda with modern AI.</Text>
          <Text style={[styles.creditText, { marginTop: 10, fontWeight: '700', color: COLORS.primary }]}>
            Made with  for a healthier world.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
};

const FeatureItem = ({ icon, title, desc }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureInfo}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  </View>
);

const TechRow = ({ label, value }) => (
  <View style={styles.techRow}>
    <Text style={styles.techLabel}>{label}</Text>
    <Text style={styles.techValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 60, paddingHorizontal: SIZES.screenPadding, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backBtn: {},
  backText: { fontSize: 14, color: '#FFFFFFCC', fontWeight: '600' },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 40, marginTop: -40 },
  logoSection: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12, ...SHADOWS.medium },
  logoIcon: { fontSize: 40 },
  appName: { fontSize: 30, fontWeight: '800', color: COLORS.primary },
  tagline: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  version: { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 22, marginBottom: 10 },
  descCard: {},
  descTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  descText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginBottom: 8 },
  featureList: { gap: 10 },
  featureItem: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: COLORS.surface, borderRadius: SIZES.borderRadius, gap: 14, ...SHADOWS.small },
  featureIcon: { fontSize: 28 },
  featureInfo: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  featureDesc: { fontSize: 12, color: COLORS.textSecondary },
  techRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  techLabel: { fontSize: 13, color: COLORS.textSecondary },
  techValue: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  disclaimerCard: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  disclaimerIcon: { fontSize: 24 },
  disclaimerText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  creditText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
});

export default AboutScreen;
