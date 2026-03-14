import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import { setSleepMental } from '../../store/slices/userSlice';
import { updateFormData, setStepValidity, nextStep, previousStep } from '../../store/slices/registrationSlice';
import Button from '../../components/common/Button';
import ProgressIndicator from '../../components/common/ProgressIndicator';

const Step3SleepMental = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { formData } = useSelector((state) => state.registration);
  const { sleepMental: savedSleepMental } = useSelector((state) => state.user);

  // Form state
  const [sleepDuration, setSleepDuration] = useState(
    savedSleepMental?.sleepDuration || formData?.sleepMental?.sleepDuration || 7
  );
  const [sleepTime, setSleepTime] = useState(
    savedSleepMental?.sleepTime || formData?.sleepMental?.sleepTime || new Date()
  );
  const [wakeTime, setWakeTime] = useState(
    savedSleepMental?.wakeTime || formData?.sleepMental?.wakeTime || new Date()
  );
  const [daytimeSleepiness, setDaytimeSleepiness] = useState(
    savedSleepMental?.daytimeSleepiness || formData?.sleepMental?.daytimeSleepiness || 5
  );
  const [stressLevel, setStressLevel] = useState(
    savedSleepMental?.stressLevel || formData?.sleepMental?.stressLevel || 5
  );
  const [anxietyLevel, setAnxietyLevel] = useState(
    savedSleepMental?.anxietyLevel || formData?.sleepMental?.anxietyLevel || 5
  );

  // UI state
  const [showSleepPicker, setShowSleepPicker] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    validateForm();
  }, [sleepDuration, sleepTime, wakeTime, daytimeSleepiness, stressLevel, anxietyLevel]);

  const validateForm = () => {
    const newErrors = {};

    if (!sleepDuration) {
      newErrors.sleepDuration = 'Sleep duration is required';
    }

    if (!sleepTime) {
      newErrors.sleepTime = 'Sleep time is required';
    }

    if (!wakeTime) {
      newErrors.wakeTime = 'Wake time is required';
    }

    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    dispatch(setStepValidity({ step: 3, isValid }));
    
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      const sleepMentalData = {
        sleepDuration,
        sleepTime: sleepTime.toISOString(),
        wakeTime: wakeTime.toISOString(),
        daytimeSleepiness,
        stressLevel,
        anxietyLevel,
      };

      dispatch(setSleepMental(sleepMentalData));
      dispatch(updateFormData({ step: 'sleepMental', data: sleepMentalData }));
      dispatch(nextStep());
      navigation.navigate(ROUTES.STEP4_FAMILY_HISTORY);
    } else {
      const firstError = Object.values(errors)[0];
      Alert.alert('Validation Error', firstError);
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSleepDurationColor = () => {
    if (sleepDuration < 6) return colors.alertRed;
    if (sleepDuration >= 6 && sleepDuration < 7) return colors.warningYellow;
    if (sleepDuration >= 7 && sleepDuration <= 9) return colors.successGreen;
    return colors.warningYellow;
  };

  const getSleepQuality = () => {
    if (sleepDuration < 6) return 'Poor - Risk of health issues';
    if (sleepDuration >= 6 && sleepDuration < 7) return 'Fair - Could improve';
    if (sleepDuration >= 7 && sleepDuration <= 9) return 'Optimal - Great for health';
    return 'Excessive - May indicate issues';
  };

  const getStressColor = () => {
    if (stressLevel <= 3) return colors.successGreen;
    if (stressLevel <= 6) return colors.warningYellow;
    return colors.alertRed;
  };

  const getStressLevel = () => {
    if (stressLevel <= 3) return 'Low - Good management';
    if (stressLevel <= 6) return 'Moderate - Monitor closely';
    return 'High - Needs attention';
  };

  const getAnxietyColor = () => {
    if (anxietyLevel <= 3) return colors.successGreen;
    if (anxietyLevel <= 6) return colors.warningYellow;
    return colors.alertRed;
  };

  const getSleepinessColor = () => {
    if (daytimeSleepiness <= 3) return colors.successGreen;
    if (daytimeSleepiness <= 6) return colors.warningYellow;
    return colors.alertRed;
  };

  const getSleepinessLevel = () => {
    if (daytimeSleepiness <= 3) return 'Low - Well rested';
    if (daytimeSleepiness <= 6) return 'Moderate - May need more sleep';
    return 'High - Possible sleep disorder';
  };

  return (
    <View style={styles.container}>
      <ProgressIndicator currentStep={3} totalSteps={8} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Sleep & Mental Health</Text>
        <Text style={styles.sectionSubtitle}>
          Understanding your sleep patterns and mental well-being
        </Text>

        {/* Sleep Duration Slider */}
        <View style={styles.sliderWrapper}>
          <View style={styles.sliderHeader}>
            <View style={styles.sliderTitleContainer}>
              <Ionicons name="moon" size={24} color={getSleepDurationColor()} />
              <Text style={styles.sliderLabel}>Sleep Duration</Text>
            </View>
            <View style={[styles.valueBadge, { backgroundColor: getSleepDurationColor() }]}>
              <Text style={styles.valueText}>{sleepDuration.toFixed(1)} hours</Text>
            </View>
          </View>
          
          <Slider
            style={styles.slider}
            minimumValue={3}
            maximumValue={12}
            step={0.5}
            value={sleepDuration}
            onValueChange={setSleepDuration}
            minimumTrackTintColor={getSleepDurationColor()}
            maximumTrackTintColor="rgba(0,0,0,0.1)"
            thumbTintColor={getSleepDurationColor()}
          />
          
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderMinLabel}>3h</Text>
            <Text style={styles.sliderMidLabel}>7-9h (optimal)</Text>
            <Text style={styles.sliderMaxLabel}>12h</Text>
          </View>
          
          <View style={styles.recommendationCard}>
            <Ionicons 
              name={sleepDuration < 7 ? 'warning' : 'checkmark-circle'} 
              size={20} 
              color={getSleepDurationColor()} 
            />
            <Text style={[styles.recommendationText, { color: getSleepDurationColor() }]}>
              {getSleepQuality()}
            </Text>
          </View>
        </View>

        {/* Sleep Time Picker */}
        <View style={styles.timePickerWrapper}>
          <Text style={styles.timePickerLabel}>Bedtime</Text>
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowSleepPicker(true)}
          >
            <Ionicons name="moon-outline" size={24} color={colors.sleepIndigo} />
            <Text style={styles.timeText}>{formatTime(sleepTime)}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Wake Time Picker */}
        <View style={styles.timePickerWrapper}>
          <Text style={styles.timePickerLabel}>Wake-up Time</Text>
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowWakePicker(true)}
          >
            <Ionicons name="sunny-outline" size={24} color={colors.warningYellow} />
            <Text style={styles.timeText}>{formatTime(wakeTime)}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Sleep Consistency Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.spO2Blue} />
          <Text style={styles.infoText}>
            Consistent sleep and wake times help regulate your body's internal clock
          </Text>
        </View>

        {/* Daytime Sleepiness Slider */}
        <View style={styles.sliderWrapper}>
          <View style={styles.sliderHeader}>
            <View style={styles.sliderTitleContainer}>
              <Ionicons name="alert-circle" size={24} color={getSleepinessColor()} />
              <Text style={styles.sliderLabel}>Daytime Sleepiness</Text>
            </View>
            <View style={[styles.valueBadge, { backgroundColor: getSleepinessColor() }]}>
              <Text style={styles.valueText}>{daytimeSleepiness}/10</Text>
            </View>
          </View>
          
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={daytimeSleepiness}
            onValueChange={setDaytimeSleepiness}
            minimumTrackTintColor={getSleepinessColor()}
            maximumTrackTintColor="rgba(0,0,0,0.1)"
            thumbTintColor={getSleepinessColor()}
          />
          
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Rarely sleepy</Text>
            <Text style={styles.scaleLabel}>Very sleepy</Text>
          </View>
          
          <Text style={[styles.statusText, { color: getSleepinessColor() }]}>
            {getSleepinessLevel()}
          </Text>
        </View>

        {/* Stress Level Slider */}
        <View style={styles.sliderWrapper}>
          <View style={styles.sliderHeader}>
            <View style={styles.sliderTitleContainer}>
              <Ionicons name="flash" size={24} color={getStressColor()} />
              <Text style={styles.sliderLabel}>Stress Level</Text>
            </View>
            <View style={[styles.valueBadge, { backgroundColor: getStressColor() }]}>
              <Text style={styles.valueText}>{stressLevel}/10</Text>
            </View>
          </View>
          
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={stressLevel}
            onValueChange={setStressLevel}
            minimumTrackTintColor={getStressColor()}
            maximumTrackTintColor="rgba(0,0,0,0.1)"
            thumbTintColor={getStressColor()}
          />
          
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Low stress</Text>
            <Text style={styles.scaleLabel}>High stress</Text>
          </View>

          {/* Stress Management Tips */}
          {stressLevel > 6 && (
            <View style={styles.tipCard}>
              <Ionicons name="bulb" size={20} color={colors.warningYellow} />
              <Text style={styles.tipText}>
                Try deep breathing or meditation to reduce stress
              </Text>
            </View>
          )}
        </View>

        {/* Anxiety Level Slider */}
        <View style={styles.sliderWrapper}>
          <View style={styles.sliderHeader}>
            <View style={styles.sliderTitleContainer}>
              <Ionicons name="heart-dislike" size={24} color={getAnxietyColor()} />
              <Text style={styles.sliderLabel}>Anxiety Level</Text>
            </View>
            <View style={[styles.valueBadge, { backgroundColor: getAnxietyColor() }]}>
              <Text style={styles.valueText}>{anxietyLevel}/10</Text>
            </View>
          </View>
          
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={anxietyLevel}
            onValueChange={setAnxietyLevel}
            minimumTrackTintColor={getAnxietyColor()}
            maximumTrackTintColor="rgba(0,0,0,0.1)"
            thumbTintColor={getAnxietyColor()}
          />
          
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Minimal anxiety</Text>
            <Text style={styles.scaleLabel}>Severe anxiety</Text>
          </View>

          {/* Mental Health Resources */}
          {(stressLevel > 7 || anxietyLevel > 7) && (
            <View style={[styles.tipCard, styles.urgentCard]}>
              <Ionicons name="heart" size={20} color="white" />
              <Text style={styles.urgentText}>
                Consider speaking with a mental health professional
              </Text>
            </View>
          )}
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Sleep Score</Text>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Duration</Text>
              <View style={[styles.scoreDot, { backgroundColor: getSleepDurationColor() }]} />
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Stress</Text>
              <View style={[styles.scoreDot, { backgroundColor: getStressColor() }]} />
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Anxiety</Text>
              <View style={[styles.scoreDot, { backgroundColor: getAnxietyColor() }]} />
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Sleepiness</Text>
              <View style={[styles.scoreDot, { backgroundColor: getSleepinessColor() }]} />
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

      {/* Time Pickers */}
      {showSleepPicker && (
        <DateTimePicker
          value={sleepTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowSleepPicker(false);
            if (selectedTime) {
              setSleepTime(selectedTime);
            }
          }}
        />
      )}

      {showWakePicker && (
        <DateTimePicker
          value={wakeTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowWakePicker(false);
            if (selectedTime) {
              setWakeTime(selectedTime);
            }
          }}
        />
      )}
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
    marginBottom: 8,
  },
  sliderMinLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  sliderMidLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.primarySaffron,
  },
  sliderMaxLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  scaleLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  recommendationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  timePickerWrapper: {
    marginBottom: 16,
  },
  timePickerLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
  },
  timeText: {
    flex: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  urgentCard: {
    backgroundColor: colors.alertRed,
  },
  tipText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.warningYellow,
    marginLeft: 8,
  },
  urgentText: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  scoreDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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

export default Step3SleepMental;