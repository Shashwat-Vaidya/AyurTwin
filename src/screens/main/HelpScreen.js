import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';
import GradientButton from '../../components/common/GradientButton';

const faqs = [
  { q: 'What is AyurTwin?', a: 'AyurTwin is an AI-powered Digital Health Twin that combines modern technology with Ayurvedic principles to provide preventive healthcare insights, disease risk predictions, and personalized lifestyle guidance.' },
  { q: 'How accurate are the disease predictions?', a: 'The predictions are risk indicators based on your health data, lifestyle, and family history. They are NOT medical diagnoses. Currently, rule-based logic is used. ML models will be integrated in the next phase for improved accuracy.' },
  { q: 'What is a Dosha?', a: 'In Ayurveda, Doshas (Vata, Pitta, Kapha) are biological energies that govern our physical and mental processes. Your unique combination determines your Prakriti (constitution), which guides personalized health recommendations.' },
  { q: 'Is my health data secure?', a: 'Yes, your data is stored securely using Supabase with Row Level Security. We do not share your personal health data with third parties.' },
  { q: 'Can family members see my data?', a: 'Only if you explicitly invite them and they accept. Family members can view your dashboard, alerts, and reports, but cannot modify your data.' },
  { q: 'How do I improve my health score?', a: 'Focus on: maintaining healthy BMI, reducing stress, getting 7-8 hours of sleep, regular exercise, and following dosha-specific dietary recommendations.' },
  { q: 'Does this app replace a doctor?', a: 'No. AyurTwin provides preventive health insights and Ayurvedic guidance. It does NOT diagnose diseases or replace professional medical advice. Always consult a healthcare professional for medical concerns.' },
  { q: 'Can I retake the Prakriti quiz?', a: 'Currently the quiz is taken during registration. In future updates, you will be able to retake it to track changes in your constitution over time.' },
];

const HelpScreen = ({ navigation }) => {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState('bug');

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter your feedback.');
      return;
    }
    Alert.alert('Thank You!', 'Your feedback has been submitted. We appreciate your input!');
    setFeedbackText('');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={COLORS.gradient.saffron} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>We're here to help you</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Help */}
        <Text style={styles.sectionTitle}>Quick Help</Text>
        <View style={styles.helpGrid}>
          <HelpCard icon=""title="Chat with AyurBot"desc="Ask health questions" />
          <HelpCard icon=""title="Email Support"desc="support@ayurtwin.com" />
          <HelpCard icon=""title="User Guide"desc="How to use the app" />
          <HelpCard icon=""title="Report Bug"desc="Help us improve" />
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, i) => (
          <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => setExpandedIdx(expandedIdx === i ? null : i)}>
            <Card style={styles.faqCard}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                <Text style={styles.faqExpand}>{expandedIdx === i ? '▲' : '▼'}</Text>
              </View>
              {expandedIdx === i && (
                <Text style={styles.faqAnswer}>{faq.a}</Text>
              )}
            </Card>
          </TouchableOpacity>
        ))}

        {/* Feedback Form */}
        <Text style={styles.sectionTitle}>Send Feedback</Text>
        <Card variant="elevated">
          <Text style={styles.feedbackLabel}>Type</Text>
          <View style={styles.feedbackTypes}>
            {['bug', 'feature', 'general'].map((t) => (
              <TouchableOpacity key={t} style={[styles.feedbackTypeBtn, feedbackType === t && styles.feedbackTypeBtnActive]} onPress={() => setFeedbackType(t)}>
                <Text style={[styles.feedbackTypeText, feedbackType === t && styles.feedbackTypeTextActive]}>
                  {t === 'bug' ? 'Bug' : t === 'feature' ? 'Feature' : 'General'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.feedbackLabel}>Message</Text>
          <TextInput
            style={styles.feedbackInput}
            value={feedbackText}
            onChangeText={setFeedbackText}
            placeholder="Describe your feedback..."multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <GradientButton title="Submit Feedback"onPress={handleSubmitFeedback} />
        </Card>

        {/* Contact Info */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Card variant="elevated">
          <ContactRow icon=""label="Email"value="support@ayurtwin.com" />
          <ContactRow icon=""label="Website"value="www.ayurtwin.com" />
          <ContactRow icon=""label="Location"value="India" />
        </Card>

        <Text style={styles.disclaimer}>
          This app provides preventive health insights and does not replace professional medical advice.
        </Text>
      </View>
    </ScrollView>
  );
};

const HelpCard = ({ icon, title, desc }) => (
  <Card style={styles.helpCard}>
    <Text style={styles.helpCardIcon}>{icon}</Text>
    <Text style={styles.helpCardTitle}>{title}</Text>
    <Text style={styles.helpCardDesc}>{desc}</Text>
  </Card>
);

const ContactRow = ({ icon, label, value }) => (
  <View style={styles.contactRow}>
    <Text style={styles.contactIcon}>{icon}</Text>
    <Text style={styles.contactLabel}>{label}</Text>
    <Text style={styles.contactValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: SIZES.screenPadding, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn: { marginBottom: 6 },
  backText: { fontSize: 14, color: '#FFFFFFCC', fontWeight: '600' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: '#FFFFFFCC' },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 22, marginBottom: 10 },
  // Help Grid
  helpGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  helpCard: { width: '47%', alignItems: 'center', padding: 16 },
  helpCardIcon: { fontSize: 28, marginBottom: 6 },
  helpCardTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  helpCardDesc: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2 },
  // FAQ
  faqCard: { marginBottom: 8 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.text, lineHeight: 20 },
  faqExpand: { fontSize: 12, color: COLORS.textLight, marginLeft: 10 },
  faqAnswer: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  // Feedback
  feedbackLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6, marginTop: 10 },
  feedbackTypes: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  feedbackTypeBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: COLORS.background, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border },
  feedbackTypeBtnActive: { borderColor: COLORS.primary, backgroundColor: '#FFF5F0' },
  feedbackTypeText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  feedbackTypeTextActive: { color: COLORS.primary },
  feedbackInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 14, minHeight: 100, marginBottom: 12 },
  // Contact
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: COLORS.border, gap: 10 },
  contactIcon: { fontSize: 18 },
  contactLabel: { fontSize: 14, color: COLORS.textSecondary },
  contactValue: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.text, textAlign: 'right' },
  disclaimer: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 24, lineHeight: 14 },
});

export default HelpScreen;
