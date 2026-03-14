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
import { setAyurvedicInputs } from '../../store/slices/userSlice';
import { updateFormData, setStepValidity, nextStep, previousStep } from '../../store/slices/registrationSlice';
import Button from '../../components/common/Button';
import ProgressIndicator from '../../components/common/ProgressIndicator';

const Step6AyurvedicInputs = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { formData } = useSelector((state) => state.registration);
  const { ayurvedicInputs: savedInputs } = useSelector((state) => state.user);

  // Form state
  const [digestionStrength, setDigestionStrength] = useState(
    savedInputs?.digestionStrength || formData?.ayurvedicInputs?.digestionStrength || 5
  );
  const [appetiteLevel, setAppetiteLevel] = useState(
    savedInputs?.appetiteLevel || formData?.ayurvedicInputs?.appetiteLevel || 5
  );
  const [sweatingLevel, setSweatingLevel] = useState(
    savedInputs?.sweatingLevel || formData?.ayurvedicInputs?.sweatingLevel || 5
  );
  const [temperaturePreference, setTemperaturePreference] = useState(
    savedInputs?.temperaturePreference || formData?.ayurvedicInputs?.temperaturePreference || ''
  );
  const [stressResponse, setStressResponse] = useState(
    savedInputs?.stressResponse || formData?.ayurvedicInputs?.stressResponse || ''
  );

  // UI state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showInfo, setShowInfo] = useState({});

  // Options
  const temperatureOptions = [
    { label: 'Cold', value: 'cold', icon: 'snow', description: 'Prefer cool environments, feel cold easily' },
    { label: 'Normal', value: 'normal', icon: 'thermometer', description: 'Comfortable in most temperatures' },
    { label: 'Hot', value: 'hot', icon: 'flame', description: 'Prefer warmth, feel hot easily' },
  ];

  const stressResponseOptions = [
    { label: 'Calm', value: 'calm', icon: 'leaf', description: 'Stay composed under pressure' },
    { label: 'Irritable', value: 'irritable', icon: 'flash', description: 'Get frustrated or angry' },
    { label: 'Anxious', value: 'anxious', icon: 'heart-dislike', description: 'Feel worried or nervous' },
  ];

  useEffect(() => {
    validateForm();
  }, [digestionStrength, appetiteLevel, sweatingLevel, temperaturePreference, stressResponse]);

  const validateForm = () => {
    const newErrors = {};

    if (!temperaturePreference) {
      newErrors.temperaturePreference = 'Please select your temperature preference';
    }
    if (!stressResponse) {
      newErrors.stressResponse = 'Please select your stress response style';
    }

    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    dispatch(setStepValidity({ step: 6, isValid }));
    
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      const ayurvedicData = {
        digestionStrength,
        appetiteLevel,
        sweatingLevel,
        temperaturePreference,
        stressResponse,
      };

      dispatch(setAyurvedicInputs(ayurvedicData));
      dispatch(updateFormData({ step: 'ayurvedicInputs', data: ayurvedicData }));
      dispatch(nextStep());
      navigation.navigate(ROUTES.STEP7_PRAKRITI);
    } else {
      const firstError = Object.values(errors)[0];
      Alert.alert('Validation Error', firstError);
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  // Color helpers based on values
  const getDigestionColor = () => {
    if (digestionStrength <= 3) return colors.alertRed;
    if (digestionStrength <= 6) return colors.warningYellow;
    return colors.successGreen;
  };

  const getDigestionDescription = () => {
    if (digestionStrength <= 3) return 'Weak - Prone to bloating, gas, indigestion';
    if (digestionStrength <= 6) return 'Variable - Sometimes good, sometimes issues';
    return 'Strong - Digest well, good metabolism';
  };

  const getAppetiteColor = () => {
    if (appetiteLevel <= 3) return colors.alertRed;
    if (appetiteLevel <= 6) return colors.warningYellow;
    return colors.successGreen;
  };

  const getAppetiteDescription = () => {
    if (appetiteLevel <= 3) return 'Low - Often skip meals, eat small amounts';
    if (appetiteLevel <= 6) return 'Moderate - Eat regular meals';
    return 'High - Always hungry, enjoy eating';
  };

  const getSweatingColor = () => {
    if (sweatingLevel <= 3) return colors.successGreen;
    if (sweatingLevel <= 6) return colors.warningYellow;
    return colors.alertRed;
  };

  const getSweatingDescription = () => {
    if (sweatingLevel <= 3) return 'Low - Sweat minimally, even in heat';
    if (sweatingLevel <= 6) return 'Moderate - Normal sweating pattern';
    return 'High - Sweat easily, even in cool weather';
  };

  // Dosha indicators based on selections
  const getDoshaInfluence = () => {
    let vata = 0, pitta = 0, kapha = 0;

    // Digestion influence
    if (digestionStrength <= 3) vata += 2;
    else if (digestionStrength >= 8) pitta += 2;
    else kapha += 1;

    // Appetite influence
    if (appetiteLevel <= 3) vata += 1;
    else if (appetiteLevel >= 8) pitta += 2;
    else kapha += 2;

    // Sweating influence
    if (sweatingLevel >= 8) pitta += 2;
    else if (sweatingLevel <= 3) vata += 1;
    else kapha += 1;

    // Temperature preference
    if (temperaturePreference === 'cold') pitta += 2;
    else if (temperaturePreference === 'hot') vata += 1;
    else kapha += 2;

    // Stress response
    if (stressResponse === 'anxious') vata += 3;
    else if (stressResponse === 'irritable') pitta += 3;
    else kapha += 2;

    // Determine dominant dosha
    const max = Math.max(vata, pitta, kapha);
    if (max === vata) return { dosha: 'Vata', color: '#7B6E8F' };
    if (max === pitta) return { dosha: 'Pitta', color: '#FF6B6B' };
    return { dosha: 'Kapha', color: '#6BA6A6' };
  };

  return (
    <View style={styles.container}>
      <ProgressIndicator currentStep={6} totalSteps={8} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Ayurvedic Lifestyle Inputs</Text>
        <Text style={styles.sectionSubtitle}>
          These help us understand your unique constitution (Prakriti)
        </Text>

        {/* Dosha Preview Card */}
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Your Dosha Tendency</Text>
          <View style={styles.previewContent}>
            <View style={[styles.previewBadge, { backgroundColor: getDoshaInfluence().color }]}>
              <Text style={styles.previewBadgeText}>{getDoshaInfluence().dosha}</Text>
            </View>
            <Text style={styles.previewText}>
              Based on your current selections
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="leaf" size={24} color={colors.primaryGreen} />
          <Text style={styles.infoText}>
            In Ayurveda, these factors help determine your dosha balance and guide 
            personalized health recommendations.
          </Text>
        </View>

        {/* Digestion Strength */}
        <View style={styles.sliderWrapper}>
          <View style={styles.sliderHeader}>
            <View style={styles.sliderTitleContainer}>
              <Ionicons name="restaurant" size={24} color={getDigestionColor()} />
              <Text style={styles.sliderLabel}>Digestion Strength (Agni)</Text>
              <TouchableOpacity onPress={() => setShowInfo({ ...showInfo, digestion: !showInfo.digestion })}>
                <Ionicons name="information-circle-outline" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
            <View style={[styles.valueBadge, { backgroundColor: getDigestionColor() }]}>
              <Text style={styles.valueText}>{digestionStrength}/10</Text>
            </View>
          </View>

          {showInfo.digestion && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                Agni is your digestive fire. Strong Agni means you digest food well, 
                weak Agni leads to indigestion and toxin buildup.
              </Text>
            </View>
          )}
          
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={digestionStrength}
            onValueChange={setDigestionStrength}
            minimumTrackTintColor={getDigestionColor()}
            maximumTrackTintColor="rgba(0,0,0,0.1)"
            thumbTintColor={getDigestionColor()}
          />
          
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Weak</Text>
            <Text style={styles.scaleLabel}>Strong</Text>
          </View>

          <Text style={[styles.description, { color: getDigestionColor() }]}>
            {getDigestionDescription()}
          </Text>
        </View>

        {/* Appetite Level */}
        <View style={styles.sliderWrapper}>
          <View style={styles.sliderHeader}>
            <View style={styles.sliderTitleContainer}>
              <Ionicons name="fast-food" size={24} color={getAppetiteColor()} />
              <Text style={styles.sliderLabel}>Appetite Level</Text>
              <TouchableOpacity onPress={() => setShowInfo({ ...showInfo, appetite: !showInfo.appetite })}>
                <Ionicons name="information-circle-outline" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
            <View style={[styles.valueBadge, { backgroundColor: getAppetiteColor() }]}>
              <Text style={styles.valueText}>{appetiteLevel}/10</Text>
            </View>
          </View>

          {showInfo.appetite && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                Appetite varies by dosha. Vata types have variable appetite, 
                Pitta types have strong appetite, Kapha types have steady but slower appetite.
              </Text>
            </View>
          )}
          
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={appetiteLevel}
            onValueChange={setAppetiteLevel}
            minimumTrackTintColor={getAppetiteColor()}
            maximumTrackTintColor="rgba(0,0,0,0.1)"
            thumbTintColor={getAppetiteColor()}
          />
          
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Low</Text>
            <Text style={styles.scaleLabel}>High</Text>
          </View>

          <Text style={[styles.description, { color: getAppetiteColor() }]}>
            {getAppetiteDescription()}
          </Text>
        </View>

        {/* Sweating Level */}
        <View style={styles.sliderWrapper}>
          <View style={styles.sliderHeader}>
            <View style={styles.sliderTitleContainer}>
              <Ionicons name="water" size={24} color={getSweatingColor()} />
              <Text style={styles.sliderLabel}>Sweating Level</Text>
              <TouchableOpacity onPress={() => setShowInfo({ ...showInfo, sweating: !showInfo.sweating })}>
                <Ionicons name="information-circle-outline" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
            <View style={[styles.valueBadge, { backgroundColor: getSweatingColor() }]}>
              <Text style={styles.valueText}>{sweatingLevel}/10</Text>
            </View>
          </View>

          {showInfo.sweating && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                Sweating relates to metabolism. Pitta types sweat easily, 
                Vata types sweat less, Kapha types have moderate sweating.
              </Text>
            </View>
          )}
          
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={sweatingLevel}
            onValueChange={setSweatingLevel}
            minimumTrackTintColor={getSweatingColor()}
            maximumTrackTintColor="rgba(0,0,0,0.1)"
            thumbTintColor={getSweatingColor()}
          />
          
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Minimal</Text>
            <Text style={styles.scaleLabel}>Excessive</Text>
          </View>

          <Text style={[styles.description, { color: getSweatingColor() }]}>
            {getSweatingDescription()}
          </Text>
        </View>

        {/* Temperature Preference */}
        <View style={styles.optionsWrapper}>
          <Text style={styles.optionsLabel}>Body Temperature Preference</Text>
          <View style={styles.optionsContainer}>
            {temperatureOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionCard,
                  temperaturePreference === option.value && styles.optionCardSelected,
                ]}
                onPress={() => {
                  setTemperaturePreference(option.value);
                  setTouched({ ...touched, temperature: true });
                }}
              >
                <Ionicons 
                  name={option.icon} 
                  size={32} 
                  color={temperaturePreference === option.value ? 'white' : colors.primarySaffron} 
                />
                <Text 
                  style={[
                    styles.optionLabel,
                    temperaturePreference === option.value && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text 
                  style={[
                    styles.optionDescription,
                    temperaturePreference === option.value && styles.optionDescriptionSelected,
                  ]}
                  numberOfLines={2}
                >
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.temperaturePreference && touched.temperature && (
            <Text style={styles.errorText}>{errors.temperaturePreference}</Text>
          )}
        </View>

        {/* Stress Response Style */}
        <View style={styles.optionsWrapper}>
          <Text style={styles.optionsLabel}>Stress Response Style</Text>
          <View style={styles.optionsContainer}>
            {stressResponseOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionCard,
                  stressResponse === option.value && styles.optionCardSelected,
                ]}
                onPress={() => {
                  setStressResponse(option.value);
                  setTouched({ ...touched, stress: true });
                }}
              >
                <Ionicons 
                  name={option.icon} 
                  size={32} 
                  color={stressResponse === option.value ? 'white' : getStressColor(option.value)} 
                />
                <Text 
                  style={[
                    styles.optionLabel,
                    stressResponse === option.value && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text 
                  style={[
                    styles.optionDescription,
                    stressResponse === option.value && styles.optionDescriptionSelected,
                  ]}
                  numberOfLines={2}
                >
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.stressResponse && touched.stress && (
            <Text style={styles.errorText}>{errors.stressResponse}</Text>
          )}
        </View>

        {/* Dosha Correlation Card */}
        <View style={styles.correlationCard}>
          <Text style={styles.correlationTitle}>What This Means</Text>
          
          <View style={styles.correlationItem}>
            <View style={[styles.correlationDot, { backgroundColor: '#7B6E8F' }]} />
            <View style={styles.correlationContent}>
              <Text style={styles.correlationLabel}>Vata Tendency:</Text>
              <Text style={styles.correlationText}>
                Variable digestion, low appetite, minimal sweating, prefers warmth, anxious under stress
              </Text>
            </View>
          </View>

          <View style={styles.correlationItem}>
            <View style={[styles.correlationDot, { backgroundColor: '#FF6B6B' }]} />
            <View style={styles.correlationContent}>
              <Text style={styles.correlationLabel}>Pitta Tendency:</Text>
              <Text style={styles.correlationText}>
                Strong digestion, high appetite, excessive sweating, prefers cool, irritable under stress
              </Text>
            </View>
          </View>

          <View style={styles.correlationItem}>
            <View style={[styles.correlationDot, { backgroundColor: '#6BA6A6' }]} />
            <View style={styles.correlationContent}>
              <Text style={styles.correlationLabel}>Kapha Tendency:</Text>
              <Text style={styles.correlationText}>
                Steady digestion, moderate appetite, moderate sweating, prefers warm, calm under stress
              </Text>
            </View>
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
    </View>
  );

  // Helper function for stress colors
  function getStressColor(value) {
    switch(value) {
      case 'calm': return colors.primaryGreen;
      case 'irritable': return colors.alertRed;
      case 'anxious': return colors.stressPurple;
      default: return colors.textTertiary;
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
  previewCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  previewTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  previewBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  previewText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
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
  sliderWrapper: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sliderLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
    marginRight: 4,
  },
  infoBox: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  infoBoxText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  valueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  valueText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 8,
  },
  scaleLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  description: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  optionsWrapper: {
    marginBottom: 20,
  },
  optionsLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  optionCardSelected: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  optionLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: 'white',
  },
  optionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  optionDescriptionSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.alertRed,
    marginTop: 4,
    marginLeft: 4,
  },
  correlationCard: {
    backgroundColor: 'rgba(245, 245, 220, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
  },
  correlationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  correlationItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  correlationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  correlationContent: {
    flex: 1,
  },
  correlationLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  correlationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
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

export default Step6AyurvedicInputs;