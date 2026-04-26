import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import { setSymptoms } from '../../store/slices/userSlice';
import { updateFormData, setStepValidity, nextStep, previousStep } from '../../store/slices/registrationSlice';
import Button from '../../components/common/Button';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import ToggleSwitch from '../../components/forms/ToggleSwitch';

const Step5Symptoms = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { formData } = useSelector((state) => state.registration);
  const { symptoms: savedSymptoms } = useSelector((state) => state.user);

  // Form state for symptoms
  const [frequentThirst, setFrequentThirst] = useState(
    savedSymptoms?.frequentThirst || formData?.symptoms?.frequentThirst || false
  );
  const [frequentUrination, setFrequentUrination] = useState(
    savedSymptoms?.frequentUrination || formData?.symptoms?.frequentUrination || false
  );
  const [jointPain, setJointPain] = useState(
    savedSymptoms?.jointPain || formData?.symptoms?.jointPain || false
  );
  const [breathingDifficulty, setBreathingDifficulty] = useState(
    savedSymptoms?.breathingDifficulty || formData?.symptoms?.breathingDifficulty || false
  );
  const [digestiveIssues, setDigestiveIssues] = useState(
    savedSymptoms?.digestiveIssues || formData?.symptoms?.digestiveIssues || false
  );
  const [fatigueLevel, setFatigueLevel] = useState(
    savedSymptoms?.fatigueLevel || formData?.symptoms?.fatigueLevel || 5
  );

  // Additional symptom details
  const [symptomDuration, setSymptomDuration] = useState({});
  const [symptomSeverity, setSymptomSeverity] = useState({});

  // UI state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showDetails, setShowDetails] = useState({});

  // Symptom definitions
  const symptoms = [
    {
      id: 'frequentThirst',
      name: 'Frequent Thirst',
      icon: 'water',
      color: '#4A90E2',
      description: 'Feeling thirsty more often than usual',
      associated: ['Diabetes', 'Dehydration'],
      colorCode: colors.spO2Blue,
    },
    {
      id: 'frequentUrination',
      name: 'Frequent Urination',
      icon: 'md-water',
      color: '#4A90E2',
      description: 'Needing to urinate more frequently',
      associated: ['Diabetes', 'UTI'],
      colorCode: colors.spO2Blue,
    },
    {
      id: 'jointPain',
      name: 'Joint Pain',
      icon: 'bone',
      color: '#9B6B9E',
      description: 'Pain, stiffness, or swelling in joints',
      associated: ['Arthritis', 'Inflammation'],
      colorCode: colors.stressPurple,
    },
    {
      id: 'breathingDifficulty',
      name: 'Breathing Difficulty',
      icon: 'medkit',
      color: '#FF6B6B',
      description: 'Shortness of breath or wheezing',
      associated: ['Asthma', 'Heart Disease'],
      colorCode: colors.alertRed,
    },
    {
      id: 'digestiveIssues',
      name: 'Digestive Issues',
      icon: 'restaurant',
      color: '#FF8C42',
      description: 'Bloating, acidity, or irregular bowel movements',
      associated: ['Digestive Disorder', 'IBS'],
      colorCode: colors.warningYellow,
    },
  ];

  useEffect(() => {
    validateForm();
  }, [frequentThirst, frequentUrination, jointPain, breathingDifficulty, digestiveIssues, fatigueLevel]);

  const validateForm = () => {
    const newErrors = {};
    
    // No required fields, but we'll validate fatigue level range
    if (fatigueLevel < 1 || fatigueLevel > 10) {
      newErrors.fatigueLevel = 'Fatigue level must be between 1 and 10';
    }

    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    dispatch(setStepValidity({ step: 5, isValid }));
    
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      const symptomsData = {
        frequentThirst,
        frequentUrination,
        jointPain,
        breathingDifficulty,
        digestiveIssues,
        fatigueLevel,
        symptomDuration,
        symptomSeverity,
      };

      dispatch(setSymptoms(symptomsData));
      dispatch(updateFormData({ step: 'symptoms', data: symptomsData }));
      dispatch(nextStep());
      navigation.navigate(ROUTES.STEP6_AYURVEDIC_INPUTS);
    } else {
      const firstError = Object.values(errors)[0];
      Alert.alert('Validation Error', firstError);
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  const toggleShowDetails = (symptomId) => {
    setShowDetails(prev => ({
      ...prev,
      [symptomId]: !prev[symptomId]
    }));
  };

  const updateSymptomDuration = (symptomId, duration) => {
    setSymptomDuration(prev => ({
      ...prev,
      [symptomId]: duration
    }));
  };

  const updateSymptomSeverity = (symptomId, severity) => {
    setSymptomSeverity(prev => ({
      ...prev,
      [symptomId]: severity
    }));
  };

  const getFatigueColor = () => {
    if (fatigueLevel <= 3) return colors.successGreen;
    if (fatigueLevel <= 6) return colors.warningYellow;
    return colors.alertRed;
  };

  const getFatigueLevel = () => {
    if (fatigueLevel <= 3) return 'Low Energy';
    if (fatigueLevel <= 6) return 'Moderate Fatigue';
    return 'Severe Fatigue';
  };

  const getFatigueDescription = () => {
    if (fatigueLevel <= 3) return 'Feeling energetic and active';
    if (fatigueLevel <= 6) return 'Tired but can manage daily activities';
    return 'Extremely tired, difficulty with daily tasks';
  };

  const getSymptomCount = () => {
    return [frequentThirst, frequentUrination, jointPain, breathingDifficulty, digestiveIssues]
      .filter(Boolean).length;
  };

  const getSymptomScore = () => {
    const count = getSymptomCount();
    const fatigueContribution = fatigueLevel / 2;
    return Math.min(100, Math.round((count * 10) + fatigueContribution));
  };

  const getHealthRiskLevel = () => {
    const score = getSymptomScore();
    if (score < 20) return { level: 'Low Risk', color: colors.successGreen };
    if (score < 40) return { level: 'Mild Risk', color: colors.bmiGreen };
    if (score < 60) return { level: 'Moderate Risk', color: colors.warningYellow };
    if (score < 80) return { level: 'High Risk', color: colors.bmiOrange };
    return { level: 'Critical Risk', color: colors.alertRed };
  };

  return (
    <View style={styles.container}>
      <ProgressIndicator currentStep={5} totalSteps={8} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Current Symptoms</Text>
        <Text style={styles.sectionSubtitle}>
          Help us understand any symptoms you're experiencing
        </Text>

        {/* Symptom Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Ionicons name="pulse"size={24} color={colors.heartRate} />
            <Text style={styles.scoreTitle}>Symptom Assessment Score</Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreValue, { color: getHealthRiskLevel().color }]}>
                {getSymptomScore()}
              </Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
            <View style={styles.scoreInfo}>
              <View style={[styles.riskBadge, { backgroundColor: getHealthRiskLevel().color }]}>
                <Text style={styles.riskText}>{getHealthRiskLevel().level}</Text>
              </View>
              <Text style={styles.scoreDescription}>
                Based on {getSymptomCount()} symptom{getSymptomCount() !== 1 ? 's' : ''} and fatigue level
              </Text>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle"size={24} color={colors.spO2Blue} />
          <Text style={styles.infoText}>
            Select any symptoms you've noticed recently. This helps us identify 
            potential health concerns early.
          </Text>
        </View>

        {/* Symptom Toggles */}
        {symptoms.map((symptom) => {
          const value = getSymptomValue(symptom.id);
          const setValue = getSymptomSetter(symptom.id);

          return (
            <View key={symptom.id} style={styles.symptomCard}>
              <View style={styles.symptomHeader}>
                <View style={styles.symptomTitleContainer}>
                  <View style={[styles.symptomIcon, { backgroundColor: `${symptom.color}20` }]}>
                    <Ionicons name={symptom.icon} size={24} color={symptom.color} />
                  </View>
                  <View style={styles.symptomInfo}>
                    <Text style={styles.symptomName}>{symptom.name}</Text>
                    <Text style={styles.symptomDescription}>{symptom.description}</Text>
                  </View>
                </View>
                <ToggleSwitch
                  value={value}
                  onValueChange={(newValue) => {
                    setValue(newValue);
                    setTouched({ ...touched, [symptom.id]: true });
                  }}
                  activeColor={symptom.color}
                />
              </View>

              {value && (
                <View style={styles.symptomDetails}>
                  {/* Associated Conditions */}
                  <View style={styles.associatedContainer}>
                    <Text style={styles.associatedLabel}>May indicate:</Text>
                    <View style={styles.associatedChips}>
                      {symptom.associated.map((condition, index) => (
                        <View key={index} style={styles.associatedChip}>
                          <Text style={styles.associatedChipText}>{condition}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Duration Selector */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>How long have you noticed this?</Text>
                    <View style={styles.durationOptions}>
                      {['< 1 week', '1-4 weeks', '> 1 month'].map((duration) => (
                        <TouchableOpacity
                          key={duration}
                          style={[
                            styles.durationOption,
                            symptomDuration[symptom.id] === duration && styles.durationOptionSelected,
                          ]}
                          onPress={() => updateSymptomDuration(symptom.id, duration)}
                        >
                          <Text
                            style={[
                              styles.durationText,
                              symptomDuration[symptom.id] === duration && styles.durationTextSelected,
                            ]}
                          >
                            {duration}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Severity Selector */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>How severe is it?</Text>
                    <View style={styles.severityOptions}>
                      {['Mild', 'Moderate', 'Severe'].map((severity, index) => {
                        const colors_ = ['#4CAF50', '#FFB347', '#FF5A5F'];
                        return (
                          <TouchableOpacity
                            key={severity}
                            style={[
                              styles.severityOption,
                              { borderColor: colors_[index] },
                              symptomSeverity[symptom.id] === severity && {
                                backgroundColor: colors_[index],
                              },
                            ]}
                            onPress={() => updateSymptomSeverity(symptom.id, severity)}
                          >
                            <Text
                              style={[
                                styles.severityText,
                                { color: colors_[index] },
                                symptomSeverity[symptom.id] === severity && styles.severityTextSelected,
                              ]}
                            >
                              {severity}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* View Details Toggle */}
                  <TouchableOpacity 
                    style={styles.viewDetailsButton}
                    onPress={() => toggleShowDetails(symptom.id)}
                  >
                    <Text style={styles.viewDetailsText}>
                      {showDetails[symptom.id] ? 'Hide recommendations' : 'See recommendations'}
                    </Text>
                    <Ionicons 
                      name={showDetails[symptom.id] ? 'chevron-up' : 'chevron-down'} 
                      size={16} 
                      color={colors.primarySaffron} 
                    />
                  </TouchableOpacity>

                  {showDetails[symptom.id] && (
                    <View style={styles.recommendationsBox}>
                      <Text style={styles.recommendationsTitle}> Ayurvedic Perspective:</Text>
                      <Text style={styles.recommendationText}>
                        {getAyurvedicAdvice(symptom.id)}
                      </Text>
                      <View style={styles.tipContainer}>
                        <Ionicons name="leaf"size={16} color={colors.primaryGreen} />
                        <Text style={styles.tipText}>
                          Track this symptom in the app for better insights
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {/* Fatigue Level Slider */}
        <View style={styles.fatigueSection}>
          <Text style={styles.fatigueTitle}>Fatigue Level</Text>
          
          <View style={styles.fatigueHeader}>
            <View style={styles.fatigueIconContainer}>
              <Ionicons name="battery-charging"size={24} color={getFatigueColor()} />
              <Text style={styles.fatigueLabel}>Energy Level</Text>
            </View>
            <View style={[styles.fatigueBadge, { backgroundColor: getFatigueColor() }]}>
              <Text style={styles.fatigueBadgeText}>{getFatigueLevel()}</Text>
            </View>
          </View>

          <Slider
            style={styles.fatigueSlider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={fatigueLevel}
            onValueChange={setFatigueLevel}
            minimumTrackTintColor={getFatigueColor()}
            maximumTrackTintColor="rgba(0,0,0,0.1)"thumbTintColor={getFatigueColor()}
          />

          <View style={styles.fatigueScale}>
            <Text style={styles.fatigueScaleLabel}>Energetic</Text>
            <Text style={styles.fatigueScaleLabel}>Exhausted</Text>
          </View>

          <Text style={[styles.fatigueDescription, { color: getFatigueColor() }]}>
            {getFatigueDescription()}
          </Text>

          {/* Fatigue Tips based on level */}
          {fatigueLevel > 6 && (
            <View style={styles.fatigueTip}>
              <Ionicons name="bulb"size={20} color={colors.warningYellow} />
              <Text style={styles.fatigueTipText}>
                Consider checking iron levels and sleep quality
              </Text>
            </View>
          )}
        </View>

        {/* Weekly Tracking Reminder */}
        <View style={styles.reminderCard}>
          <Ionicons name="calendar"size={24} color={colors.primarySaffron} />
          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>Track Symptoms Weekly</Text>
            <Text style={styles.reminderText}>
              Regular tracking helps identify patterns and triggers
            </Text>
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Back"onPress={handleBack}
            style={styles.backButton}
            outline
          />
          <Button
            title="Next"onPress={handleNext}
            style={styles.nextButton}
            gradient
          />
        </View>
      </ScrollView>
    </View>
  );

  // Helper functions
  function getSymptomValue(id) {
    switch(id) {
      case 'frequentThirst': return frequentThirst;
      case 'frequentUrination': return frequentUrination;
      case 'jointPain': return jointPain;
      case 'breathingDifficulty': return breathingDifficulty;
      case 'digestiveIssues': return digestiveIssues;
      default: return false;
    }
  }

  function getSymptomSetter(id) {
    switch(id) {
      case 'frequentThirst': return setFrequentThirst;
      case 'frequentUrination': return setFrequentUrination;
      case 'jointPain': return setJointPain;
      case 'breathingDifficulty': return setBreathingDifficulty;
      case 'digestiveIssues': return setDigestiveIssues;
      default: return () => {};
    }
  }

  function getAyurvedicAdvice(symptomId) {
    const advice = {
      frequentThirst: 'May indicate Pitta imbalance. Stay hydrated with cool water and avoid spicy foods.',
      frequentUrination: 'Could be related to Vata imbalance. Warm herbal teas and regular meal times help.',
      jointPain: 'Often Vata imbalance. Warm oil massage and gentle yoga can provide relief.',
      breathingDifficulty: 'May indicate Kapha imbalance. Steam inhalation and breathing exercises help.',
      digestiveIssues: 'Often Agni (digestive fire) imbalance. Ginger tea and light meals are beneficial.',
    };
    return advice[symptomId] || 'Consult with our AI for personalized recommendations.';
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
  scoreCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scoreValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
  },
  scoreMax: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  scoreInfo: {
    flex: 1,
  },
  riskBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  riskText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'white',
  },
  scoreDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  symptomCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  symptomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symptomTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  symptomIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  symptomInfo: {
    flex: 1,
  },
  symptomName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  symptomDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  symptomDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  associatedContainer: {
    marginBottom: 16,
  },
  associatedLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  associatedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  associatedChip: {
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  associatedChipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.primarySaffron,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  durationOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  durationOptionSelected: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  durationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  durationTextSelected: {
    color: 'white',
  },
  severityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityOption: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  severityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  severityTextSelected: {
    color: 'white',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  viewDetailsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.primarySaffron,
    marginRight: 4,
  },
  recommendationsBox: {
    backgroundColor: 'rgba(245, 245, 220, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  recommendationsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.primaryGreen,
    marginBottom: 6,
  },
  recommendationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  tipText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.primaryGreen,
    marginLeft: 6,
  },
  fatigueSection: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
  },
  fatigueTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  fatigueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fatigueIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fatigueLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  fatigueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fatigueBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'white',
  },
  fatigueSlider: {
    width: '100%',
    height: 40,
  },
  fatigueScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 12,
  },
  fatigueScaleLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  fatigueDescription: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  fatigueTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    padding: 10,
    borderRadius: 8,
  },
  fatigueTipText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.warningYellow,
    marginLeft: 8,
  },
  reminderCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  reminderContent: {
    flex: 1,
    marginLeft: 12,
  },
  reminderTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  reminderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
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
});

export default Step5Symptoms;