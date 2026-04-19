import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import { setPrakriti } from '../../store/slices/userSlice';
import { updateFormData, setStepValidity, nextStep, previousStep } from '../../store/slices/registrationSlice';
import Button from '../../components/common/Button';
import ProgressIndicator from '../../components/common/ProgressIndicator';

const { width } = Dimensions.get('window');

const Step7PrakritiSelection = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { formData } = useSelector((state) => state.registration);
  const { prakriti: savedPrakriti, ayurvedicInputs } = useSelector((state) => state.user);

  // Form state
  const [prakritiType, setPrakritiType] = useState(
    savedPrakriti?.type || formData?.prakriti?.type || ''
  );
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizStep, setQuizStep] = useState(0);
  
  // Dosha percentages (for visualization)
  const [doshaPercentages, setDoshaPercentages] = useState({
    vata: savedPrakriti?.vata || 33.33,
    pitta: savedPrakriti?.pitta || 33.33,
    kapha: savedPrakriti?.kapha || 33.33,
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showInfo, setShowInfo] = useState({});

  // Prakriti options
  const prakritiOptions = [
    { 
      value: 'vata', 
      label: 'Vata', 
      icon: 'wind', 
      color: '#7B6E8F',
      description: 'Air & Space - Creative, energetic, variable',
      characteristics: ['Light sleep', 'Variable appetite', 'Dry skin', 'Quick mind'],
    },
    { 
      value: 'pitta', 
      label: 'Pitta', 
      icon: 'flame', 
      color: '#FF6B6B',
      description: 'Fire & Water - Intense, focused, warm',
      characteristics: ['Strong appetite', 'Warm body', 'Sharp intellect', 'Irritable when hungry'],
    },
    { 
      value: 'kapha', 
      label: 'Kapha', 
      icon: 'water', 
      color: '#6BA6A6',
      description: 'Water & Earth - Calm, stable, nurturing',
      characteristics: ['Heavy sleep', 'Steady energy', 'Cool skin', 'Slow to anger'],
    },
    { 
      value: 'vata-pitta', 
      label: 'Vata-Pitta', 
      icon: 'sync', 
      color: '#B19CD9',
      description: 'Mix of Vata and Pitta',
      characteristics: ['Creative & intense', 'Variable but focused'],
    },
    { 
      value: 'pitta-kapha', 
      label: 'Pitta-Kapha', 
      icon: 'sync', 
      color: '#D4A5A5',
      description: 'Mix of Pitta and Kapha',
      characteristics: ['Stable but intense', 'Strong & steady'],
    },
    { 
      value: 'vata-kapha', 
      label: 'Vata-Kapha', 
      icon: 'sync', 
      color: '#9CAFB7',
      description: 'Mix of Vata and Kapha',
      characteristics: ['Creative but stable', 'Variable yet calm'],
    },
    { 
      value: 'tridosha', 
      label: 'Tri-Dosha', 
      icon: 'leaf', 
      color: '#B5B35C',
      description: 'All three doshas balanced',
      characteristics: ['Most balanced', 'Adaptable to all situations'],
    },
  ];

  // Quiz questions (simplified version - 10 questions instead of 22 for demo)
  const quizQuestions = [
    {
      question: "How would you describe your body frame?",
      options: [
        { text: "Thin, lean, tall", dosha: "vata" },
        { text: "Medium, muscular", dosha: "pitta" },
        { text: "Large, broad, solid", dosha: "kapha" },
      ]
    },
    {
      question: "How is your skin typically?",
      options: [
        { text: "Dry, rough, cool", dosha: "vata" },
        { text: "Warm, sensitive, prone to rashes", dosha: "pitta" },
        { text: "Smooth, oily, cool", dosha: "kapha" },
      ]
    },
    {
      question: "How is your appetite?",
      options: [
        { text: "Variable, sometimes low", dosha: "vata" },
        { text: "Strong, can't miss meals", dosha: "pitta" },
        { text: "Steady, but slow", dosha: "kapha" },
      ]
    },
    {
      question: "How do you react to stress?",
      options: [
        { text: "Anxious, worried", dosha: "vata" },
        { text: "Irritable, angry", dosha: "pitta" },
        { text: "Withdrawn, calm", dosha: "kapha" },
      ]
    },
    {
      question: "How is your memory?",
      options: [
        { text: "Quick to learn, quick to forget", dosha: "vata" },
        { text: "Sharp, precise", dosha: "pitta" },
        { text: "Slow to learn, excellent retention", dosha: "kapha" },
      ]
    },
    {
      question: "How would you describe your sleep?",
      options: [
        { text: "Light, easily disturbed", dosha: "vata" },
        { text: "Moderate, sound", dosha: "pitta" },
        { text: "Heavy, prolonged", dosha: "kapha" },
      ]
    },
    {
      question: "How is your digestion?",
      options: [
        { text: "Irregular, gas, bloating", dosha: "vata" },
        { text: "Fast, burning sensation", dosha: "pitta" },
        { text: "Slow, steady, produces mucus", dosha: "kapha" },
      ]
    },
    {
      question: "What's your typical energy pattern?",
      options: [
        { text: "Comes in bursts, variable", dosha: "vata" },
        { text: "Moderate, focused", dosha: "pitta" },
        { text: "Steady, enduring", dosha: "kapha" },
      ]
    },
    {
      question: "How do you handle cold weather?",
      options: [
        { text: "Dislike, feel cold easily", dosha: "vata" },
        { text: "Prefer cool weather", dosha: "pitta" },
        { text: "Comfortable, don't mind cold", dosha: "kapha" },
      ]
    },
    {
      question: "What's your natural hair type?",
      options: [
        { text: "Dry, thin, frizzy", dosha: "vata" },
        { text: "Fine, straight, early graying", dosha: "pitta" },
        { text: "Thick, oily, lustrous", dosha: "kapha" },
      ]
    }
  ];

  useEffect(() => {
    // If we have Ayurvedic inputs, calculate suggested dosha
    if (ayurvedicInputs && Object.keys(ayurvedicInputs).length > 0) {
      calculateDoshaFromInputs();
    }
  }, []);

  const calculateDoshaFromInputs = () => {
    let vata = 0, pitta = 0, kapha = 0;
    
    // Digestion strength
    if (ayurvedicInputs.digestionStrength <= 3) vata += 2;
    else if (ayurvedicInputs.digestionStrength >= 8) pitta += 2;
    else kapha += 2;

    // Appetite
    if (ayurvedicInputs.appetiteLevel <= 3) vata += 2;
    else if (ayurvedicInputs.appetiteLevel >= 8) pitta += 2;
    else kapha += 2;

    // Sweating
    if (ayurvedicInputs.sweatingLevel >= 8) pitta += 2;
    else if (ayurvedicInputs.sweatingLevel <= 3) vata += 1;
    else kapha += 2;

    // Temperature preference
    if (ayurvedicInputs.temperaturePreference === 'cold') pitta += 3;
    else if (ayurvedicInputs.temperaturePreference === 'hot') vata += 2;
    else kapha += 3;

    // Stress response
    if (ayurvedicInputs.stressResponse === 'anxious') vata += 3;
    else if (ayurvedicInputs.stressResponse === 'irritable') pitta += 3;
    else kapha += 3;

    // Convert to percentages
    const total = vata + pitta + kapha;
    if (total > 0) {
      setDoshaPercentages({
        vata: Math.round((vata / total) * 100),
        pitta: Math.round((pitta / total) * 100),
        kapha: Math.round((kapha / total) * 100),
      });
    }
  };

  const calculateQuizResults = () => {
    let vata = 0, pitta = 0, kapha = 0;
    
    Object.values(quizAnswers).forEach(answer => {
      if (answer === 'vata') vata++;
      else if (answer === 'pitta') pitta++;
      else if (answer === 'kapha') kapha++;
    });

    const total = vata + pitta + kapha;
    if (total > 0) {
      const percentages = {
        vata: Math.round((vata / total) * 100),
        pitta: Math.round((pitta / total) * 100),
        kapha: Math.round((kapha / total) * 100),
      };
      setDoshaPercentages(percentages);
      
      // Determine dominant dosha
      const max = Math.max(vata, pitta, kapha);
      if (max === vata) setPrakritiType('vata');
      else if (max === pitta) setPrakritiType('pitta');
      else if (max === kapha) setPrakritiType('kapha');
    }
    
    setShowQuiz(false);
    setQuizStep(0);
  };

  const handleNext = () => {
    if (!prakritiType) {
      Alert.alert('Selection Required', 'Please select your Prakriti or take the quiz');
      return;
    }

    const prakritiData = {
      type: prakritiType,
      vata: doshaPercentages.vata,
      pitta: doshaPercentages.pitta,
      kapha: doshaPercentages.kapha,
      quizAnswers: quizAnswers,
    };

    dispatch(setPrakriti(prakritiData));
    dispatch(updateFormData({ step: 'prakriti', data: prakritiData }));
    dispatch(nextStep());
    navigation.navigate(ROUTES.STEP8_CREDENTIALS);
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  const getDoshaColor = (dosha) => {
    switch(dosha) {
      case 'vata': return '#7B6E8F';
      case 'pitta': return '#FF6B6B';
      case 'kapha': return '#6BA6A6';
      default: return colors.textTertiary;
    }
  };

  // Chart data for dosha visualization
  const pieData = [
    {
      name: 'Vata',
      population: doshaPercentages.vata,
      color: '#7B6E8F',
      legendFontColor: colors.textSecondary,
      legendFontSize: 12,
    },
    {
      name: 'Pitta',
      population: doshaPercentages.pitta,
      color: '#FF6B6B',
      legendFontColor: colors.textSecondary,
      legendFontSize: 12,
    },
    {
      name: 'Kapha',
      population: doshaPercentages.kapha,
      color: '#6BA6A6',
      legendFontColor: colors.textSecondary,
      legendFontSize: 12,
    },
  ];

  return (
    <View style={styles.container}>
      <ProgressIndicator currentStep={7} totalSteps={8} />
      
      {!showQuiz ? (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Prakriti Analysis</Text>
          <Text style={styles.sectionSubtitle}>
            Discover your Ayurvedic constitution (Prakriti)
          </Text>

          {/* Dosha Visualization */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Your Dosha Balance</Text>
            {doshaPercentages.vata === 33.33 ? (
              <View style={styles.equalDoshaMessage}>
                <Ionicons name="leaf" size={40} color={colors.primaryGreen} />
                <Text style={styles.equalDoshaText}>
                  Take the quiz to discover your unique dosha balance
                </Text>
              </View>
            ) : (
              <>
                <PieChart
                  data={pieData}
                  width={width - 80}
                  height={180}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
                <View style={styles.percentageLabels}>
                  <Text style={[styles.percentageText, { color: '#7B6E8F' }]}>
                    Vata: {doshaPercentages.vata}%
                  </Text>
                  <Text style={[styles.percentageText, { color: '#FF6B6B' }]}>
                    Pitta: {doshaPercentages.pitta}%
                  </Text>
                  <Text style={[styles.percentageText, { color: '#6BA6A6' }]}>
                    Kapha: {doshaPercentages.kapha}%
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={colors.spO2Blue} />
            <Text style={styles.infoText}>
              Your Prakriti is your unique mind-body constitution. It determines your 
              disease tendencies, ideal diet, exercise regime, and healing herbs.
            </Text>
          </View>

          {/* Quick Selection */}
          <Text style={styles.sectionTitle}>Select Your Prakriti</Text>
          <View style={styles.prakritiGrid}>
            {prakritiOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.prakritiCard,
                  prakritiType === option.value && styles.prakritiCardSelected,
                  { borderColor: option.color }
                ]}
                onPress={() => {
                  setPrakritiType(option.value);
                  // Update percentages based on selection
                  if (option.value === 'vata') {
                    setDoshaPercentages({ vata: 70, pitta: 15, kapha: 15 });
                  } else if (option.value === 'pitta') {
                    setDoshaPercentages({ vata: 15, pitta: 70, kapha: 15 });
                  } else if (option.value === 'kapha') {
                    setDoshaPercentages({ vata: 15, pitta: 15, kapha: 70 });
                  } else if (option.value === 'vata-pitta') {
                    setDoshaPercentages({ vata: 45, pitta: 45, kapha: 10 });
                  } else if (option.value === 'pitta-kapha') {
                    setDoshaPercentages({ vata: 10, pitta: 45, kapha: 45 });
                  } else if (option.value === 'vata-kapha') {
                    setDoshaPercentages({ vata: 45, pitta: 10, kapha: 45 });
                  } else if (option.value === 'tridosha') {
                    setDoshaPercentages({ vata: 33, pitta: 33, kapha: 34 });
                  }
                }}
              >
                <View style={[styles.prakritiIcon, { backgroundColor: `${option.color}20` }]}>
                  <Ionicons name={option.icon} size={28} color={option.color} />
                </View>
                <Text style={[
                  styles.prakritiLabel,
                  prakritiType === option.value && styles.prakritiLabelSelected
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.prakritiDescription} numberOfLines={2}>
                  {option.description}
                </Text>
                <View style={styles.characteristicsContainer}>
                  {option.characteristics.map((char, index) => (
                    <View key={index} style={styles.characteristicChip}>
                      <Text style={styles.characteristicText}>{char}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quiz Button */}
          <View style={styles.quizSection}>
            <Text style={styles.quizTitle}>Not sure about your Prakriti?</Text>
            <TouchableOpacity
              style={styles.quizButton}
              onPress={() => setShowQuiz(true)}
            >
              <Ionicons name="help-circle" size={24} color="white" />
              <Text style={styles.quizButtonText}>Take Prakriti Quiz</Text>
            </TouchableOpacity>
            <Text style={styles.quizNote}>
              10 quick questions to determine your dosha
            </Text>
          </View>

          {/* Why Prakriti Matters */}
          <View style={styles.whyCard}>
            <Text style={styles.whyTitle}>Why Prakriti Matters</Text>
            <View style={styles.whyItem}>
              <Ionicons name="leaf" size={20} color={colors.primaryGreen} />
              <Text style={styles.whyText}>Determines disease tendencies</Text>
            </View>
            <View style={styles.whyItem}>
              <Ionicons name="restaurant" size={20} color={colors.primaryGreen} />
              <Text style={styles.whyText}>Guides ideal diet choices</Text>
            </View>
            <View style={styles.whyItem}>
              <Ionicons name="fitness" size={20} color={colors.primaryGreen} />
              <Text style={styles.whyText}>Shapes exercise recommendations</Text>
            </View>
            <View style={styles.whyItem}>
              <Ionicons name="medkit" size={20} color={colors.primaryGreen} />
              <Text style={styles.whyText}>Identifies healing herbs</Text>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Back"
              onPress={handleBack}
              style={styles.backButton}
              outline
            />
            <Button
              title="Next"
              onPress={handleNext}
              style={styles.nextButton}
              gradient
            />
          </View>
        </ScrollView>
      ) : (
        // Quiz View
        <View style={styles.quizContainer}>
          <View style={styles.quizHeader}>
            <TouchableOpacity 
              style={styles.quizBackButton}
              onPress={() => setShowQuiz(false)}
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.quizHeaderTitle}>Prakriti Quiz</Text>
            <Text style={styles.quizStep}>Question {quizStep + 1}/10</Text>
          </View>

          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((quizStep + 1) / 10) * 100}%` }
              ]} 
            />
          </View>

          <ScrollView style={styles.quizContent}>
            <Text style={styles.quizQuestion}>
              {quizQuestions[quizStep].question}
            </Text>

            <View style={styles.quizOptions}>
              {quizQuestions[quizStep].options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quizOption,
                    quizAnswers[quizStep] === option.dosha && styles.quizOptionSelected,
                  ]}
                  onPress={() => {
                    setQuizAnswers({
                      ...quizAnswers,
                      [quizStep]: option.dosha
                    });
                  }}
                >
                  <View style={[
                    styles.quizOptionDot,
                    { backgroundColor: getDoshaColor(option.dosha) }
                  ]} />
                  <Text style={[
                    styles.quizOptionText,
                    quizAnswers[quizStep] === option.dosha && styles.quizOptionTextSelected
                  ]}>
                    {option.text}
                  </Text>
                  {quizAnswers[quizStep] === option.dosha && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primaryGreen} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {quizAnswers[quizStep] && (
              <View style={styles.quizTip}>
                <Ionicons name="bulb" size={20} color={colors.warningYellow} />
                <Text style={styles.quizTipText}>
                  {getDoshaTip(quizAnswers[quizStep])}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.quizFooter}>
            <TouchableOpacity
              style={[
                styles.quizNavButton,
                quizStep === 0 && styles.quizNavButtonDisabled
              ]}
              onPress={() => setQuizStep(quizStep - 1)}
              disabled={quizStep === 0}
            >
              <Text style={styles.quizNavButtonText}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quizNavButton,
                styles.quizNavButtonNext,
                !quizAnswers[quizStep] && styles.quizNavButtonDisabled
              ]}
              onPress={() => {
                if (quizStep === 9) {
                  calculateQuizResults();
                } else {
                  setQuizStep(quizStep + 1);
                }
              }}
              disabled={!quizAnswers[quizStep]}
            >
              <Text style={styles.quizNavButtonNextText}>
                {quizStep === 9 ? 'See Results' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  function getDoshaTip(dosha) {
    switch(dosha) {
      case 'vata':
        return 'Vata types benefit from warm, grounding foods and routines.';
      case 'pitta':
        return 'Pitta types thrive with cooling foods and moderate exercise.';
      case 'kapha':
        return 'Kapha types need stimulating activities and light foods.';
      default:
        return '';
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  chartCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  chartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  equalDoshaMessage: {
    alignItems: 'center',
    padding: 20,
  },
  equalDoshaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  percentageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  percentageText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
  prakritiGrid: {
    marginTop: 12,
    marginBottom: 20,
  },
  prakritiCard: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  prakritiCardSelected: {
    backgroundColor: 'rgba(255, 153, 51, 0.02)',
    shadowColor: colors.primarySaffron,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  prakritiIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  prakritiLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  prakritiLabelSelected: {
    color: colors.primarySaffron,
  },
  prakritiDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  characteristicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  characteristicChip: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  characteristicText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  quizSection: {
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
  },
  quizTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  quizButton: {
    flexDirection: 'row',
    backgroundColor: colors.primarySaffron,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  quizButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
  quizNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  whyCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  whyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  whyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  whyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    flex: 2,
    marginLeft: 10,
  },
  // Quiz styles
  quizContainer: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  quizBackButton: {
    marginRight: 16,
  },
  quizHeaderTitle: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  quizStep: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textTertiary,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primarySaffron,
  },
  quizContent: {
    flex: 1,
    padding: 20,
  },
  quizQuestion: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 24,
    lineHeight: 28,
  },
  quizOptions: {
    marginBottom: 20,
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  quizOptionSelected: {
    borderColor: colors.primaryGreen,
    backgroundColor: 'rgba(76, 175, 80, 0.02)',
  },
  quizOptionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  quizOptionText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
  },
  quizOptionTextSelected: {
    color: colors.textPrimary,
    fontFamily: 'Inter-Medium',
  },
  quizTip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  quizTipText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.warningYellow,
    marginLeft: 12,
  },
  quizFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  quizNavButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.primarySaffron,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  quizNavButtonDisabled: {
    opacity: 0.3,
  },
  quizNavButtonNext: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  quizNavButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.primarySaffron,
  },
  quizNavButtonNextText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});

export default Step7PrakritiSelection;