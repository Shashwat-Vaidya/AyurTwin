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
import { setLifestyle } from '../../store/slices/userSlice';
import { updateFormData, setStepValidity, nextStep, previousStep } from '../../store/slices/registrationSlice';
import Button from '../../components/common/Button';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import ToggleSwitch from '../../components/forms/ToggleSwitch';

const Step2Lifestyle = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { formData } = useSelector((state) => state.registration);
  const { lifestyle: savedLifestyle } = useSelector((state) => state.user);

  // Form state
  const [physicalActivity, setPhysicalActivity] = useState(
    savedLifestyle?.physicalActivity || formData?.lifestyle?.physicalActivity || ''
  );
  const [workType, setWorkType] = useState(
    savedLifestyle?.workType || formData?.lifestyle?.workType || ''
  );
  const [dietType, setDietType] = useState(
    savedLifestyle?.dietType || formData?.lifestyle?.dietType || ''
  );
  const [smoking, setSmoking] = useState(
    savedLifestyle?.smoking || formData?.lifestyle?.smoking || false
  );
  const [alcohol, setAlcohol] = useState(
    savedLifestyle?.alcohol || formData?.lifestyle?.alcohol || false
  );
  const [waterIntake, setWaterIntake] = useState(
    savedLifestyle?.waterIntake || formData?.lifestyle?.waterIntake || 2
  );
  const [junkFoodFrequency, setJunkFoodFrequency] = useState(
    savedLifestyle?.junkFoodFrequency || formData?.lifestyle?.junkFoodFrequency || 0
  );
  const [exerciseDuration, setExerciseDuration] = useState(
    savedLifestyle?.exerciseDuration || formData?.lifestyle?.exerciseDuration || 0
  );

  // UI state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Options
  const activityLevels = [
    { label: 'Low', value: 'low', description: 'Little or no exercise' },
    { label: 'Moderate', value: 'moderate', description: 'Exercise 3-5 days/week' },
    { label: 'High', value: 'high', description: 'Intense exercise 6-7 days/week' },
  ];

  const workTypes = [
    { label: 'Sitting', value: 'sitting', icon: 'chair', description: 'Desk job, minimal movement' },
    { label: 'Active', value: 'active', icon: 'walk', description: 'On feet, moderate movement' },
    { label: 'Mixed', value: 'mixed', icon: 'sync', description: 'Combination of both' },
  ];

  const dietTypes = [
    { label: 'Vegetarian', value: 'vegetarian', icon: 'leaf' },
    { label: 'Non-Vegetarian', value: 'non-vegetarian', icon: 'fast-food' },
    { label: 'Mixed', value: 'mixed', icon: 'restaurant' },
  ];

  useEffect(() => {
    validateForm();
  }, [physicalActivity, workType, dietType]);

  const validateForm = () => {
    const newErrors = {};

    if (!physicalActivity) {
      newErrors.physicalActivity = 'Please select your activity level';
    }
    if (!workType) {
      newErrors.workType = 'Please select your work type';
    }
    if (!dietType) {
      newErrors.dietType = 'Please select your diet type';
    }

    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    dispatch(setStepValidity({ step: 2, isValid }));
    
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      const lifestyleData = {
        physicalActivity,
        workType,
        dietType,
        smoking,
        alcohol,
        waterIntake,
        junkFoodFrequency,
        exerciseDuration,
      };

      dispatch(setLifestyle(lifestyleData));
      dispatch(updateFormData({ step: 'lifestyle', data: lifestyleData }));
      dispatch(nextStep());
      navigation.navigate(ROUTES.STEP3_SLEEP_MENTAL);
    } else {
      const firstError = Object.values(errors)[0];
      Alert.alert('Validation Error', firstError);
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  const getActivityIcon = (level) => {
    switch(level) {
      case 'low': return 'bed-outline';
      case 'moderate': return 'walk-outline';
      case 'high': return 'fitness-outline';
      default: return 'help-outline';
    }
  };

  const getWaterIntakeColor = () => {
    if (waterIntake < 2) return colors.alertRed;
    if (waterIntake >= 2 && waterIntake < 3) return colors.warningYellow;
    return colors.successGreen;
  };

  const getJunkFoodColor = () => {
    if (junkFoodFrequency <= 2) return colors.successGreen;
    if (junkFoodFrequency <= 4) return colors.warningYellow;
    return colors.alertRed;
  };

  const getExerciseColor = () => {
    if (exerciseDuration >= 1) return colors.successGreen;
    if (exerciseDuration >= 0.5) return colors.warningYellow;
    return colors.alertRed;
  };

  return (
    <View style={styles.container}>
      <ProgressIndicator currentStep={2} totalSteps={8} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Lifestyle Information</Text>
        <Text style={styles.sectionSubtitle}>
          Tell us about your daily habits for personalized recommendations
        </Text>

        {/* Physical Activity Level */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>
            Physical Activity Level <Text style={styles.required}>*</Text>
          </Text>
          {activityLevels.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.optionCard,
                physicalActivity === level.value && styles.optionCardSelected,
              ]}
              onPress={() => {
                setPhysicalActivity(level.value);
                setTouched({ ...touched, physicalActivity: true });
              }}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons
                  name={getActivityIcon(level.value)}
                  size={24}
                  color={physicalActivity === level.value ? colors.primarySaffron : colors.textTertiary}
                />
              </View>
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionLabel,
                    physicalActivity === level.value && styles.optionLabelSelected,
                  ]}
                >
                  {level.label}
                </Text>
                <Text style={styles.optionDescription}>{level.description}</Text>
              </View>
              {physicalActivity === level.value && (
                <Ionicons name="checkmark-circle"size={24} color={colors.primarySaffron} />
              )}
            </TouchableOpacity>
          ))}
          {errors.physicalActivity && touched.physicalActivity && (
            <Text style={styles.errorText}>{errors.physicalActivity}</Text>
          )}
        </View>

        {/* Work Type */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>
            Work Type <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.workTypeContainer}>
            {workTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.workTypeCard,
                  workType === type.value && styles.workTypeCardSelected,
                ]}
                onPress={() => {
                  setWorkType(type.value);
                  setTouched({ ...touched, workType: true });
                }}
              >
                <Ionicons
                  name={type.icon}
                  size={32}
                  color={workType === type.value ? 'white' : colors.primarySaffron}
                />
                <Text
                  style={[
                    styles.workTypeLabel,
                    workType === type.value && styles.workTypeLabelSelected,
                  ]}
                >
                  {type.label}
                </Text>
                <Text
                  style={[
                    styles.workTypeDescription,
                    workType === type.value && styles.workTypeDescriptionSelected,
                  ]}
                  numberOfLines={2}
                >
                  {type.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.workType && touched.workType && (
            <Text style={styles.errorText}>{errors.workType}</Text>
          )}
        </View>

        {/* Diet Type */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>
            Diet Type <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.dietContainer}>
            {dietTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.dietCard,
                  dietType === type.value && styles.dietCardSelected,
                ]}
                onPress={() => {
                  setDietType(type.value);
                  setTouched({ ...touched, dietType: true });
                }}
              >
                <Ionicons
                  name={type.icon}
                  size={28}
                  color={dietType === type.value ? 'white' : colors.primaryGreen}
                />
                <Text
                  style={[
                    styles.dietLabel,
                    dietType === type.value && styles.dietLabelSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.dietType && touched.dietType && (
            <Text style={styles.errorText}>{errors.dietType}</Text>
          )}
        </View>

        {/* Smoking Toggle */}
        <View style={styles.toggleWrapper}>
          <View style={styles.toggleHeader}>
            <Ionicons name="cigarette-outline"size={24} color={colors.textSecondary} />
            <Text style={styles.toggleLabel}>Smoking</Text>
          </View>
          <ToggleSwitch
            value={smoking}
            onValueChange={setSmoking}
            activeColor={colors.alertRed}
          />
        </View>

        {/* Alcohol Toggle */}
        <View style={styles.toggleWrapper}>
          <View style={styles.toggleHeader}>
            <Ionicons name="wine-outline"size={24} color={colors.textSecondary} />
            <Text style={styles.toggleLabel}>Alcohol Consumption</Text>
          </View>
          <ToggleSwitch
            value={alcohol}
            onValueChange={setAlcohol}
            activeColor={colors.warningYellow}
          />
        </View>

        {/* Daily Water Intake */}
        <View style={styles.sliderWrapper}>
          <View style={styles.sliderHeader}>
            <View style={styles.sliderTitleContainer}>
              <Ionicons name="water-outline"size={24} color={getWaterIntakeColor()} />
              <Text style={styles.sliderLabel}>Daily Water Intake</Text>
            </View>
            <View style={[styles.valueBadge, { backgroundColor: getWaterIntakeColor() }]}>
              <Text style={styles.valueText}>{waterIntake.toFixed(1)} L</Text>
            </View>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={5}
            step={0.1}
            value={waterIntake}
            onValueChange={setWaterIntake}
            minimumTrackTintColor={getWaterIntakeColor()}
            maximumTrackTintColor="rgba(0,0,0,0.1)"thumbTintColor={getWaterIntakeColor()}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderMinLabel}>0.5L</Text>
            <Text style={styles.sliderMaxLabel}>5L</Text>
          </View>
          <Text style={styles.recommendationText}>
            {waterIntake < 2 
              ? 'Try to drink at least 2L per day' 
              : waterIntake >= 3 
              ? 'Excellent! Staying well hydrated' 
              : 'Good amount for basic hydration'}
          </Text>
        </View>

        {/* Junk Food Frequency */}
        <View style={styles.sliderWrapper}>
          <View style={styles.sliderHeader}>
            <View style={styles.sliderTitleContainer}>
              <Ionicons name="fast-food-outline"size={24} color={getJunkFoodColor()} />
              <Text style={styles.sliderLabel}>Junk Food (times/week)</Text>
            </View>
            <View style={[styles.valueBadge, { backgroundColor: getJunkFoodColor() }]}>
              <Text style={styles.valueText}>{junkFoodFrequency}×</Text>
            </View>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={7}
            step={1}
            value={junkFoodFrequency}
            onValueChange={setJunkFoodFrequency}
            minimumTrackTintColor={getJunkFoodColor()}
            maximumTrackTintColor="rgba(0,0,0,0.1)"thumbTintColor={getJunkFoodColor()}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderMinLabel}>0</Text>
            <Text style={styles.sliderMaxLabel}>7</Text>
          </View>
          <Text style={styles.recommendationText}>
            {junkFoodFrequency === 0 
              ? 'No junk food - Excellent!' 
              : junkFoodFrequency <= 2 
              ? 'Moderate consumption' 
              : junkFoodFrequency <= 4 
              ? 'Try to reduce to 2 times or less' 
              : 'High consumption - health risk'}
          </Text>
        </View>

        {/* Exercise Duration */}
        <View style={styles.sliderWrapper}>
          <View style={styles.sliderHeader}>
            <View style={styles.sliderTitleContainer}>
              <Ionicons name="fitness-outline"size={24} color={getExerciseColor()} />
              <Text style={styles.sliderLabel}>Exercise (hours/day)</Text>
            </View>
            <View style={[styles.valueBadge, { backgroundColor: getExerciseColor() }]}>
              <Text style={styles.valueText}>{exerciseDuration.toFixed(1)}h</Text>
            </View>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={4}
            step={0.5}
            value={exerciseDuration}
            onValueChange={setExerciseDuration}
            minimumTrackTintColor={getExerciseColor()}
            maximumTrackTintColor="rgba(0,0,0,0.1)"thumbTintColor={getExerciseColor()}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderMinLabel}>0h</Text>
            <Text style={styles.sliderMaxLabel}>4h</Text>
          </View>
          <Text style={styles.recommendationText}>
            {exerciseDuration === 0 
              ? 'Try to add at least 30 mins of exercise' 
              : exerciseDuration < 0.5 
              ? 'Aim for 30 mins minimum' 
              : exerciseDuration >= 1 
              ? 'Great job! Active lifestyle' 
              : 'Good start!'}
          </Text>
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
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  required: {
    color: colors.alertRed,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.alertRed,
    marginTop: 4,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: colors.primarySaffron,
    backgroundColor: 'rgba(255, 153, 51, 0.02)',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: colors.primarySaffron,
  },
  optionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  workTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workTypeCard: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  workTypeCardSelected: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  workTypeLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  workTypeLabelSelected: {
    color: 'white',
  },
  workTypeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  workTypeDescriptionSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  dietContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dietCard: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  dietCardSelected: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  dietLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 8,
  },
  dietLabelSelected: {
    color: 'white',
  },
  toggleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
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
    marginBottom: 12,
  },
  sliderTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
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
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderMinLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  sliderMaxLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  recommendationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
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

export default Step2Lifestyle;