import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';
import { useApp } from '../../context/AppContext';
import {
  calculateHealthScore, generateDiseaseRisks, detectDoshaImbalance,
  generateSimulatedVitals, getSeasonalAdvice,
} from '../../utils/healthCalculations';

const SmartInsightsScreen = ({ navigation }) => {
  const { state } = useApp();
  const profile = { ...state.user, ...(state.registrationData || {}) };
  const healthScore = calculateHealthScore(profile);
  const risks = generateDiseaseRisks(profile);
  const dosha = detectDoshaImbalance(state.prakritiResult, profile);
  const vitals = generateSimulatedVitals(profile);
  const season = getSeasonalAdvice();

  const [insights, setInsights] = useState([]);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = () => {
    const list = [];

    // Health Score insights
    if (healthScore >= 80) {
      list.push({ icon: '', title: 'Excellent Health', text: `Your health score is ${healthScore}. You're maintaining great habits! Keep it up.`, type: 'positive', priority: 1 });
    } else if (healthScore >= 60) {
      list.push({ icon: '', title: 'Room for Improvement', text: `Your health score is ${healthScore}. Focus on sleep quality and stress management to push above 80.`, type: 'info', priority: 2 });
    } else {
      list.push({ icon: '', title: 'Health Score Alert', text: `Your health score is ${healthScore}. This needs attention. Consider consulting a healthcare professional and following our recommendations.`, type: 'warning', priority: 1 });
    }

    // Stress insights
    if (vitals.stressIndex > 70) {
      list.push({ icon: '', title: 'High Stress This Week', text: 'Your stress index has been consistently above 70. Try incorporating 10-minute meditation sessions and Anulom Vilom pranayama.', type: 'warning', priority: 1 });
    } else if (vitals.stressIndex < 40) {
      list.push({ icon: '', title: 'Stress Well Managed', text: 'Your stress levels are in a healthy range. Whatever you\'re doing is working — keep it up!', type: 'positive', priority: 3 });
    }

    // Sleep insights
    const sleepHrs = profile.sleep_duration_hours || 7;
    if (sleepHrs < 6) {
      list.push({ icon: '', title: 'Sleep Deficit Detected', text: `You're averaging only ${sleepHrs} hours of sleep. Adults need 7-9 hours. Try warm turmeric milk before bed and avoid screens 1 hour before sleep.`, type: 'warning', priority: 1 });
    } else if (sleepHrs >= 7 && sleepHrs <= 8) {
      list.push({ icon: '', title: 'Good Sleep Pattern', text: `Your ${sleepHrs}-hour sleep duration is optimal. Your sleep quality contributes positively to your health score.`, type: 'positive', priority: 3 });
    }

    // BMI insights
    const bmi = profile.bmi || 22;
    if (bmi > 30) {
      list.push({ icon: '', title: 'BMI in Obese Range', text: `Your BMI is ${bmi}. This significantly increases risk for diabetes, heart disease, and joint problems. A structured diet and exercise plan is recommended.`, type: 'warning', priority: 1 });
    } else if (bmi > 25) {
      list.push({ icon: '', title: 'BMI Above Normal', text: `Your BMI is ${bmi}. Aim to bring it below 25 through diet adjustments and increased physical activity.`, type: 'info', priority: 2 });
    }

    // Risk insights
    const topRisk = Object.entries(risks).sort((a, b) => b[1] - a[1])[0];
    if (topRisk && topRisk[1] > 60) {
      list.push({ icon: '', title: `High ${topRisk[0].replace(/_/g, ' ')} Risk`, text: `Your ${topRisk[0].replace(/_/g, ' ')} risk is at ${topRisk[1]}%. This is influenced by your lifestyle, BMI, and family history. Follow our personalized recommendations.`, type: 'warning', priority: 1 });
    }

    // Dosha insights
    if (dosha.imbalanceDetected) {
      const dName = dosha.dominantImbalance.charAt(0).toUpperCase() + dosha.dominantImbalance.slice(1);
      list.push({ icon: '', title: `${dName} Dosha Imbalance`, text: `Your ${dName} dosha shows signs of imbalance. Follow ${dName}-balancing diet and lifestyle routines for better equilibrium.`, type: 'info', priority: 2 });
    }

    // Activity insight
    if (profile.physical_activity === 'low') {
      list.push({ icon: '', title: 'Low Physical Activity', text: 'Your activity level is low. Even 20-30 minutes of walking daily can significantly improve your health score and reduce disease risks.', type: 'info', priority: 2 });
    }

    // Seasonal insight
    list.push({ icon: '', title: `${season.season} Season Tip`, text: season.advice, type: 'info', priority: 3 });

    // Hydration insight
    const water = profile.water_intake_liters || 1.5;
    if (water < 1.5) {
      list.push({ icon: '', title: 'Stay Hydrated', text: 'You may not be drinking enough water. Aim for 8-10 glasses (2-2.5 liters) daily. Warm water is preferred in Ayurveda.', type: 'info', priority: 2 });
    }

    // Positive reinforcement
    if (healthScore >= 60 && vitals.stressIndex < 60 && sleepHrs >= 6) {
      list.push({ icon: '', title: 'Consistent Effort', text: 'You\'re showing consistent effort in maintaining your health. Your dedication to following routines is paying off!', type: 'positive', priority: 3 });
    }

    list.sort((a, b) => a.priority - b.priority);
    setInsights(list);
  };

  const getTypeStyle = (type) => {
    if (type === 'positive') return { bg: '#F0FFF4', border: COLORS.success };
    if (type === 'warning') return { bg: '#FFF5F5', border: COLORS.error };
    return { bg: '#F0F9FF', border: COLORS.info };
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Insights</Text>
        <Text style={styles.headerSubtitle}>Personalized health intelligence</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Summary */}
        <Card variant="elevated"style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{insights.filter(i => i.type === 'warning').length}</Text>
              <Text style={styles.summaryLabel}>Warnings</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: COLORS.info }]}>{insights.filter(i => i.type === 'info').length}</Text>
              <Text style={styles.summaryLabel}>Suggestions</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: COLORS.success }]}>{insights.filter(i => i.type === 'positive').length}</Text>
              <Text style={styles.summaryLabel}>Positives</Text>
            </View>
          </View>
        </Card>

        {/* Insights */}
        {insights.map((insight, i) => {
          const ts = getTypeStyle(insight.type);
          return (
            <Card key={i} style={[styles.insightCard, { backgroundColor: ts.bg, borderLeftColor: ts.border, borderLeftWidth: 4 }]}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightIcon}>{insight.icon}</Text>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <View style={[styles.priorityBadge, {
                  backgroundColor: insight.priority === 1 ? COLORS.error + '15' : insight.priority === 2 ? COLORS.warning + '15' : COLORS.success + '15',
                }]}>
                  <Text style={[styles.priorityText, {
                    color: insight.priority === 1 ? COLORS.error : insight.priority === 2 ? COLORS.warning : COLORS.success,
                  }]}>{insight.priority === 1 ? 'High' : insight.priority === 2 ? 'Medium' : 'Low'}</Text>
                </View>
              </View>
              <Text style={styles.insightText}>{insight.text}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: SIZES.screenPadding, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn: { marginBottom: 6 },
  backText: { fontSize: 14, color: '#FFFFFFCC', fontWeight: '600' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: '#FFFFFFCC' },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 40 },
  summaryCard: { marginTop: -12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: 26, fontWeight: '800', color: COLORS.error },
  summaryLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  insightCard: { marginTop: 10 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  insightIcon: { fontSize: 22 },
  insightTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  priorityText: { fontSize: 10, fontWeight: '700' },
  insightText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  disclaimer: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 24, lineHeight: 14 },
});

export default SmartInsightsScreen;
