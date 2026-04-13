import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import { PRAKRITI_QUESTIONS, calculatePrakriti } from '../../data/prakritiQuestions';
import GradientButton from '../../components/common/GradientButton';
import ProgressBar from '../../components/common/ProgressBar';
import { useApp } from '../../context/AppContext';

const PrakritiQuizScreen = ({ navigation }) => {
  const { dispatch, updateRegistration } = useApp();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  const question = PRAKRITI_QUESTIONS[currentQ];

  const handleSelect = (key) => {
    setSelectedOption(key);
  };

  const handleNext = () => {
    if (!selectedOption) {
      Alert.alert('Select an option', 'Please choose an answer before proceeding.');
      return;
    }

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQ < PRAKRITI_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate result
      const prakritiResult = calculatePrakriti(newAnswers);
      setResult(prakritiResult);
      setShowResult(true);
      dispatch({ type: 'SET_PRAKRITI_RESULT', payload: prakritiResult });
      updateRegistration({
        prakriti_data: prakritiResult,
        prakriti: prakritiResult.prakriti,
      });
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      const newAnswers = answers.slice(0, -1);
      setAnswers(newAnswers);
      setSelectedOption(answers[answers.length - 1]);
    }
  };

  const handleFinish = () => {
    // Pop back to Register screen - this will keep us in the registration flow
    navigation.goBack();
  };

  const getDoshaColor = (dosha) => {
    if (dosha === 'vata') return COLORS.vata;
    if (dosha === 'pitta') return COLORS.pitta;
    return COLORS.kapha;
  };

  if (showResult && result) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.resultContent}>
        <Text style={styles.resultTitle}>Your Prakriti Result</Text>

        <View style={styles.prakritiTypeCard}>
          <LinearGradient
            colors={COLORS.gradient.saffron}
            style={styles.prakritiTypeBadge}
          >
            <Text style={styles.prakritiTypeText}>{result.prakriti}</Text>
          </LinearGradient>
        </View>

        {/* Triangle visualization */}
        <View style={styles.triangleContainer}>
          <View style={styles.doshaRow}>
            <View style={[styles.doshaBar, { flex: result.vata_percent }]}>
              <LinearGradient colors={['#7B68EE', '#9B89FF']} style={styles.doshaBarFill}>
                <Text style={styles.doshaBarText}>Vata</Text>
                <Text style={styles.doshaBarPercent}>{result.vata_percent}%</Text>
              </LinearGradient>
            </View>
          </View>
          <View style={styles.doshaRow}>
            <View style={[styles.doshaBar, { flex: result.pitta_percent }]}>
              <LinearGradient colors={['#FF6347', '#FF7F6A']} style={styles.doshaBarFill}>
                <Text style={styles.doshaBarText}>Pitta</Text>
                <Text style={styles.doshaBarPercent}>{result.pitta_percent}%</Text>
              </LinearGradient>
            </View>
          </View>
          <View style={styles.doshaRow}>
            <View style={[styles.doshaBar, { flex: result.kapha_percent }]}>
              <LinearGradient colors={['#32CD32', '#50E050']} style={styles.doshaBarFill}>
                <Text style={styles.doshaBarText}>Kapha</Text>
                <Text style={styles.doshaBarPercent}>{result.kapha_percent}%</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        <View style={styles.scoreGrid}>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: COLORS.vata }]}>{result.vata_score}</Text>
            <Text style={styles.scoreLabel}>Vata Answers</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: COLORS.pitta }]}>{result.pitta_score}</Text>
            <Text style={styles.scoreLabel}>Pitta Answers</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: COLORS.kapha }]}>{result.kapha_score}</Text>
            <Text style={styles.scoreLabel}>Kapha Answers</Text>
          </View>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.descTitle}>What this means:</Text>
          {result.prakriti.toLowerCase().includes('vata') && (
            <Text style={styles.descText}>
              Vata governs movement and nervous system. You tend to be creative, quick-thinking, and energetic. Balance with warm foods and regular routine.
            </Text>
          )}
          {result.prakriti.toLowerCase().includes('pitta') && (
            <Text style={styles.descText}>
              Pitta governs digestion and metabolism. You tend to be intelligent, determined, and focused. Balance with cooling foods and calming activities.
            </Text>
          )}
          {result.prakriti.toLowerCase().includes('kapha') && (
            <Text style={styles.descText}>
              Kapha governs structure and stability. You tend to be calm, loving, and strong. Balance with light foods and stimulating exercise.
            </Text>
          )}
          {result.prakriti === 'Tridosha' && (
            <Text style={styles.descText}>
              Tridosha means all three doshas are nearly balanced. This is rare and indicates a well-balanced constitution. Maintain balance with seasonal routines.
            </Text>
          )}
        </View>

        <GradientButton title="Continue Registration" onPress={handleFinish} style={styles.finishBtn} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar currentStep={currentQ + 1} totalSteps={22} label={`Q${currentQ + 1}/22`} />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{question.category}</Text>
        </View>
      </View>

      <ScrollView style={styles.questionSection} contentContainerStyle={styles.questionContent}>
        <Text style={styles.questionText}>{question.question}</Text>

        {question.options.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.optionCard,
              selectedOption === option.key && styles.optionCardSelected,
            ]}
            onPress={() => handleSelect(option.key)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.optionRadio,
              selectedOption === option.key && styles.optionRadioSelected,
            ]}>
              {selectedOption === option.key && <View style={styles.optionRadioDot} />}
            </View>
            <Text style={[
              styles.optionText,
              selectedOption === option.key && styles.optionTextSelected,
            ]}>{option.text}</Text>
            <View style={[styles.doshaTag, { backgroundColor: getDoshaColor(option.dosha) + '20' }]}>
              <Text style={[styles.doshaTagText, { color: getDoshaColor(option.dosha) }]}>{option.dosha}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentQ === 0}
          style={[styles.navBtn, currentQ === 0 && styles.navBtnDisabled]}
        >
          <Text style={styles.navBtnText}>Previous</Text>
        </TouchableOpacity>
        <GradientButton
          title={currentQ === 21 ? 'Submit' : 'Next'}
          onPress={handleNext}
          disabled={!selectedOption}
          style={styles.nextBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: SIZES.screenPadding, paddingTop: 16 },
  categoryBadge: {
    alignSelf: 'flex-start', backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 8,
  },
  categoryText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  questionSection: { flex: 1 },
  questionContent: { paddingHorizontal: SIZES.screenPadding, paddingVertical: 16 },
  questionText: { fontSize: 18, fontWeight: '700', color: COLORS.text, lineHeight: 26, marginBottom: 24 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderRadius: SIZES.borderRadiusLg, borderWidth: 2, borderColor: COLORS.border,
    marginBottom: 12, backgroundColor: COLORS.background,
  },
  optionCardSelected: { borderColor: COLORS.primary, backgroundColor: '#FFF5F0' },
  optionRadio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  optionRadioSelected: { borderColor: COLORS.primary },
  optionRadioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
  optionText: { flex: 1, fontSize: 14, color: COLORS.text, lineHeight: 20 },
  optionTextSelected: { fontWeight: '600', color: COLORS.primary },
  doshaTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  doshaTagText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  footer: {
    flexDirection: 'row', paddingHorizontal: SIZES.screenPadding,
    paddingVertical: 16, gap: 12, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  navBtn: {
    paddingVertical: 14, paddingHorizontal: 20, borderRadius: SIZES.borderRadius,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  nextBtn: { flex: 1 },
  // Result styles
  resultContent: { padding: SIZES.screenPadding, alignItems: 'center', paddingBottom: 40 },
  resultTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginTop: 20, marginBottom: 20 },
  prakritiTypeCard: { marginBottom: 24 },
  prakritiTypeBadge: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30 },
  prakritiTypeText: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  triangleContainer: { width: '100%', marginBottom: 24 },
  doshaRow: { flexDirection: 'row', marginBottom: 8 },
  doshaBar: { minWidth: 50 },
  doshaBarFill: {
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: SIZES.borderRadius,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  doshaBarText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  doshaBarPercent: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  scoreGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  scoreItem: { flex: 1, alignItems: 'center', padding: 16, backgroundColor: COLORS.background, borderRadius: SIZES.borderRadius },
  scoreValue: { fontSize: 28, fontWeight: '800' },
  scoreLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
  descriptionCard: { width: '100%', padding: 20, backgroundColor: COLORS.background, borderRadius: SIZES.borderRadiusLg, marginBottom: 24 },
  descTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  descText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  finishBtn: { width: '100%' },
});

export default PrakritiQuizScreen;
