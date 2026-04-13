import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, Switch
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import InputField from '../../components/common/InputField';
import GradientButton from '../../components/common/GradientButton';
import ProgressBar from '../../components/common/ProgressBar';
import { useApp } from '../../context/AppContext';
import { calculateBMI } from '../../utils/healthCalculations';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];

const RegisterScreen = ({ navigation, route }) => {
  const { state, dispatch, updateRegistration } = useApp();
  const isPatient = state.userType === 'patient';
  const totalSteps = isPatient ? 8 : 2;

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Advance to step 8 when prakriti result is set and we're at step 7
  useEffect(() => {
    if (state.prakritiResult && step === 7) {
      setStep(8);
    }
  }, [state.prakritiResult, step]);

  // Step 0 — Role (already selected on landing, but can change)
  // Step 1 — Personal Info
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // Step 2 — Lifestyle
  const [physicalActivity, setPhysicalActivity] = useState('moderate');
  const [workType, setWorkType] = useState('sitting');
  const [dietType, setDietType] = useState('');
  const [smoking, setSmoking] = useState(false);
  const [alcohol, setAlcohol] = useState(false);
  const [waterIntake, setWaterIntake] = useState(5);
  const [junkFood, setJunkFood] = useState(3);
  const [exerciseMin, setExerciseMin] = useState(5);

  // Step 3 — Sleep & Mental
  const [sleepDuration, setSleepDuration] = useState(5);
  const [sleepTime, setSleepTime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [sleepiness, setSleepiness] = useState(3);
  const [stressLevel, setStressLevel] = useState(5);
  const [anxietyLevel, setAnxietyLevel] = useState(3);

  // Step 4 — Family History
  const [fhDiabetes, setFhDiabetes] = useState(false);
  const [fhHeart, setFhHeart] = useState(false);
  const [fhHypertension, setFhHypertension] = useState(false);
  const [fhAsthma, setFhAsthma] = useState(false);
  const [fhArthritis, setFhArthritis] = useState(false);

  // Step 5 — Symptoms
  const [symThirst, setSymThirst] = useState(false);
  const [symUrination, setSymUrination] = useState(false);
  const [symJointPain, setSymJointPain] = useState(false);
  const [symBreathing, setSymBreathing] = useState(false);
  const [symDigestive, setSymDigestive] = useState(false);
  const [fatigue, setFatigue] = useState(3);

  // Step 6 — Ayurvedic
  const [digestionStrength, setDigestionStrength] = useState(5);
  const [appetite, setAppetite] = useState(5);
  const [sweating, setSweating] = useState(5);
  const [bodyTemp, setBodyTemp] = useState('normal');
  const [stressResponse, setStressResponse] = useState('calm');

  // Step 7 — Prakriti (redirect to quiz)
  // Step 8 — Credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});

  const bmiData = calculateBMI(parseFloat(weight), parseFloat(height));

  const getBMIColor = () => {
    const colors = { underweight: COLORS.bmi.underweight, normal: COLORS.bmi.normal, overweight: COLORS.bmi.overweight, obese: COLORS.bmi.obese };
    return colors[bmiData.category] || COLORS.textLight;
  };

  const validateStep = () => {
    const errs = {};
    if (step === 1) {
      if (!firstName.trim()) errs.firstName = 'Required';
      if (!lastName.trim()) errs.lastName = 'Required';
      if (!email.trim()) errs.email = 'Required';
    }
    if (step === (isPatient ? 8 : 2)) {
      if (!username.trim()) errs.username = 'Required';
      if (!password.trim()) errs.password = 'Required';
      else if (password.length < 6) errs.password = 'Min 6 characters';
      if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    // Save step data
    if (step === 1) {
      updateRegistration({
        first_name: firstName, middle_name: middleName, last_name: lastName,
        email, phone, date_of_birth: dob, gender, blood_group: bloodGroup,
        height_cm: parseFloat(height), weight_kg: parseFloat(weight),
        bmi: bmiData.value, bmi_category: bmiData.category,
        age: dob ? new Date().getFullYear() - new Date(dob).getFullYear() : null,
      });
    }
    if (step === 2) {
      updateRegistration({
        physical_activity: physicalActivity, work_type: workType, diet_type: dietType,
        smoking, alcohol, water_intake_liters: waterIntake / 4,
        junk_food_frequency: junkFood, exercise_minutes: exerciseMin * 6,
      });
    }
    if (step === 3) {
      updateRegistration({
        sleep_duration_hours: sleepDuration + 3, sleep_time: sleepTime, wake_time: wakeTime,
        daytime_sleepiness: sleepiness, stress_level: stressLevel, anxiety_level: anxietyLevel,
      });
    }
    if (step === 4) {
      updateRegistration({
        family_history: { diabetes: fhDiabetes, heart_disease: fhHeart, hypertension: fhHypertension, asthma: fhAsthma, arthritis: fhArthritis },
      });
    }
    if (step === 5) {
      updateRegistration({
        frequent_thirst: symThirst, frequent_urination: symUrination, joint_pain: symJointPain,
        breathing_difficulty: symBreathing, digestive_issues: symDigestive, fatigue_level: fatigue,
      });
    }
    if (step === 6) {
      updateRegistration({
        digestion_strength: digestionStrength, appetite, sweating,
        body_temperature: bodyTemp, stress_response: stressResponse,
      });
    }

    if (isPatient && step === 7) {
      // Navigate to Prakriti Quiz
      navigation.navigate('PrakritiQuiz');
      return;
    }

    setStep(step + 1);
  };

  const handleRegister = async () => {
    if (!validateStep()) return;
    setLoading(true);

    const fullData = {
      ...state.registrationData,
      user_type: state.userType,
      username,
      password,
    };

    dispatch({ type: 'SET_REGISTRATION_DATA', payload: fullData });

    // For now, save to local and navigate
    try {
      const { registerUser } = require('../../services/api');
      const result = await registerUser(fullData);
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      
      if (result.success) {
        // Login the user
        await AsyncStorage.setItem('ayurtwin_user', JSON.stringify(result.data));
        dispatch({ type: 'SET_USER', payload: result.data });
      } else {
        // If Supabase fails, still allow local usage
        const mockUser = { id: 'local_' + Date.now(), ...fullData };
        await AsyncStorage.setItem('ayurtwin_user', JSON.stringify(mockUser));
        dispatch({ type: 'SET_USER', payload: mockUser });
      }
    } catch (err) {
      // Fallback: save locally
      const mockUser = { id: 'local_' + Date.now(), ...fullData };
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('ayurtwin_user', JSON.stringify(mockUser));
      dispatch({ type: 'SET_USER', payload: mockUser });
    }

    setLoading(false);
    
    // Clear registration data after successful login
    dispatch({ type: 'SET_REGISTRATION_DATA', payload: {} });
    dispatch({ type: 'SET_REGISTRATION_STEP', payload: 0 });
    
    // AppNavigator will automatically switch to home screen when isAuthenticated becomes true
  };

  const renderSlider = (label, value, setValue, min = 0, max = 10) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>{value}</Text>
      </View>
      <View style={styles.sliderTrack}>
        {Array.from({ length: max - min + 1 }, (_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setValue(min + i)}
            style={[styles.sliderDot, (min + i) <= value && styles.sliderDotActive]}
          />
        ))}
      </View>
    </View>
  );

  const renderToggle = (label, value, setValue) => (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={setValue}
        trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
        thumbColor={value ? COLORS.primary : '#f4f3f4'}
      />
    </View>
  );

  const renderChipSelector = (options, selected, setSelected) => (
    <View style={styles.chipRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value || opt}
          style={[styles.chip, (selected === (opt.value || opt)) && styles.chipActive]}
          onPress={() => setSelected(opt.value || opt)}
        >
          <Text style={[styles.chipText, (selected === (opt.value || opt)) && styles.chipTextActive]}>
            {opt.label || opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ---- STEP RENDERERS ----

  const renderStep0 = () => (
    <View>
      <Text style={styles.stepTitle}>Choose Account Type</Text>
      <TouchableOpacity
        style={[styles.roleCard, state.userType === 'patient' && styles.roleCardActive]}
        onPress={() => dispatch({ type: 'SET_USER_TYPE', payload: 'patient' })}
      >
        <Text style={styles.roleIcon}>👤</Text>
        <View style={styles.roleInfo}>
          <Text style={styles.roleTitle}>Patient</Text>
          <Text style={styles.roleDesc}>Full health tracking, predictions, and personalized guidance</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.roleCard, state.userType === 'family_member' && styles.roleCardActive]}
        onPress={() => dispatch({ type: 'SET_USER_TYPE', payload: 'family_member' })}
      >
        <Text style={styles.roleIcon}>👨‍👩‍👧</Text>
        <View style={styles.roleInfo}>
          <Text style={styles.roleTitle}>Family Member</Text>
          <Text style={styles.roleDesc}>Monitor and track health of your family members</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <InputField label="First Name *" value={firstName} onChangeText={setFirstName} placeholder="First name" icon="👤" error={errors.firstName} />
      <InputField label="Middle Name" value={middleName} onChangeText={setMiddleName} placeholder="Middle name" />
      <InputField label="Last Name *" value={lastName} onChangeText={setLastName} placeholder="Last name" error={errors.lastName} />
      <InputField label="Email *" value={email} onChangeText={setEmail} placeholder="Email address" keyboardType="email-address" icon="📧" error={errors.email} />
      <InputField label="Phone" value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" icon="📱" />
      <InputField label="Date of Birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} placeholder="1990-01-15" icon="📅" />

      <Text style={styles.fieldLabel}>Gender</Text>
      {renderChipSelector(GENDERS, gender, setGender)}

      <Text style={styles.fieldLabel}>Blood Group</Text>
      {renderChipSelector(BLOOD_GROUPS, bloodGroup, setBloodGroup)}

      <View style={styles.row}>
        <InputField label="Height (cm)" value={height} onChangeText={setHeight} placeholder="170" keyboardType="numeric" style={styles.halfInput} />
        <InputField label="Weight (kg)" value={weight} onChangeText={setWeight} placeholder="70" keyboardType="numeric" style={styles.halfInput} />
      </View>

      {height && weight && bmiData.value > 0 && (
        <View style={styles.bmiCard}>
          <View style={[styles.bmiCircle, { borderColor: getBMIColor() }]}>
            <Text style={[styles.bmiValue, { color: getBMIColor() }]}>{bmiData.value}</Text>
            <Text style={styles.bmiLabel}>BMI</Text>
          </View>
          <Text style={[styles.bmiCategory, { color: getBMIColor() }]}>{bmiData.category.toUpperCase()}</Text>
        </View>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Lifestyle</Text>
      <Text style={styles.fieldLabel}>Physical Activity</Text>
      {renderChipSelector([
        { label: '🚶 Low', value: 'low' },
        { label: '🏃 Moderate', value: 'moderate' },
        { label: '💪 High', value: 'high' },
      ], physicalActivity, setPhysicalActivity)}

      <Text style={styles.fieldLabel}>Work Type</Text>
      {renderChipSelector([
        { label: '💺 Sitting', value: 'sitting' },
        { label: '🏗 Active', value: 'active' },
        { label: '🔄 Mixed', value: 'mixed' },
      ], workType, setWorkType)}

      <InputField label="Diet Type" value={dietType} onChangeText={setDietType} placeholder="Vegetarian, Non-veg, Vegan..." icon="🍽" />

      {renderToggle('Smoking', smoking, setSmoking)}
      {renderToggle('Alcohol Consumption', alcohol, setAlcohol)}

      {renderSlider('Water Intake (glasses/day)', waterIntake, setWaterIntake, 1, 12)}
      {renderSlider('Junk Food Frequency (0=Never, 10=Daily)', junkFood, setJunkFood)}
      {renderSlider('Exercise (mins/day approx)', exerciseMin, setExerciseMin, 0, 10)}
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Sleep & Mental Health</Text>
      {renderSlider('Sleep Duration (hours)', sleepDuration + 3, (v) => setSleepDuration(v - 3), 3, 12)}
      <InputField label="Sleep Time" value={sleepTime} onChangeText={setSleepTime} placeholder="22:00" icon="🌙" />
      <InputField label="Wake Time" value={wakeTime} onChangeText={setWakeTime} placeholder="06:00" icon="🌅" />
      {renderSlider('Daytime Sleepiness (0-10)', sleepiness, setSleepiness)}
      {renderSlider('Stress Level (0-10)', stressLevel, setStressLevel)}
      {renderSlider('Anxiety Level (0-10)', anxietyLevel, setAnxietyLevel)}
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.stepTitle}>Family Medical History</Text>
      <Text style={styles.stepDesc}>Select conditions that run in your family:</Text>
      {renderToggle('Diabetes', fhDiabetes, setFhDiabetes)}
      {renderToggle('Heart Disease', fhHeart, setFhHeart)}
      {renderToggle('Hypertension', fhHypertension, setFhHypertension)}
      {renderToggle('Asthma', fhAsthma, setFhAsthma)}
      {renderToggle('Arthritis', fhArthritis, setFhArthritis)}
    </View>
  );

  const renderStep5 = () => (
    <View>
      <Text style={styles.stepTitle}>Current Symptoms</Text>
      <Text style={styles.stepDesc}>Select any symptoms you experience regularly:</Text>
      {renderToggle('Frequent Thirst', symThirst, setSymThirst)}
      {renderToggle('Frequent Urination', symUrination, setSymUrination)}
      {renderToggle('Joint Pain', symJointPain, setSymJointPain)}
      {renderToggle('Breathing Difficulty', symBreathing, setSymBreathing)}
      {renderToggle('Digestive Issues', symDigestive, setSymDigestive)}
      {renderSlider('Fatigue Level (0-10)', fatigue, setFatigue)}
    </View>
  );

  const renderStep6 = () => (
    <View>
      <Text style={styles.stepTitle}>Ayurvedic Inputs</Text>
      {renderSlider('Digestion Strength (0=Weak, 10=Strong)', digestionStrength, setDigestionStrength)}
      {renderSlider('Appetite (0=Low, 10=High)', appetite, setAppetite)}
      {renderSlider('Sweating (0=Low, 10=Heavy)', sweating, setSweating)}

      <Text style={styles.fieldLabel}>Body Temperature Tendency</Text>
      {renderChipSelector([
        { label: '❄️ Cold', value: 'cold' },
        { label: '🌡 Normal', value: 'normal' },
        { label: '🔥 Hot', value: 'hot' },
      ], bodyTemp, setBodyTemp)}

      <Text style={styles.fieldLabel}>Stress Response</Text>
      {renderChipSelector([
        { label: '😌 Calm', value: 'calm' },
        { label: '😤 Irritable', value: 'irritable' },
        { label: '😰 Anxious', value: 'anxious' },
      ], stressResponse, setStressResponse)}
    </View>
  );

  const renderStep7 = () => (
    <View>
      <Text style={styles.stepTitle}>Prakriti Assessment</Text>
      <View style={styles.quizPromptCard}>
        <Text style={styles.quizIcon}>🔺</Text>
        <Text style={styles.quizTitle}>Prakriti Quiz</Text>
        <Text style={styles.quizDesc}>
          Complete a 22-question assessment to determine your Ayurvedic constitution (Vata, Pitta, Kapha).
        </Text>
        <Text style={styles.quizNote}>This quiz is mandatory for patient accounts.</Text>

        {state.prakritiResult && (
          <View style={styles.prakritiResultCard}>
            <Text style={styles.prakritiResultTitle}>Your Prakriti: {state.prakritiResult.prakriti}</Text>
            <View style={styles.prakritiScores}>
              <Text style={[styles.doshaScore, { color: COLORS.vata }]}>Vata: {state.prakritiResult.vata_percent}%</Text>
              <Text style={[styles.doshaScore, { color: COLORS.pitta }]}>Pitta: {state.prakritiResult.pitta_percent}%</Text>
              <Text style={[styles.doshaScore, { color: COLORS.kapha }]}>Kapha: {state.prakritiResult.kapha_percent}%</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderStep8 = () => (
    <View>
      <Text style={styles.stepTitle}>Create Your Account</Text>
      <InputField label="Username *" value={username} onChangeText={setUsername} placeholder="Choose a username" icon="👤" error={errors.username} />
      <InputField label="Password *" value={password} onChangeText={setPassword} placeholder="Min 6 characters" secureTextEntry icon="🔒" error={errors.password} />
      <InputField label="Confirm Password *" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter password" secureTextEntry icon="🔒" error={errors.confirmPassword} />
    </View>
  );

  const renderCurrentStep = () => {
    if (!isPatient) {
      // Family member: Step 0 → Step 1 → Step 8 (credentials)
      if (step === 0) return renderStep0();
      if (step === 1) return renderStep1();
      if (step === 2) return renderStep8();
    }
    switch (step) {
      case 0: return renderStep0();
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      case 8: return renderStep8();
      default: return null;
    }
  };

  const isLastStep = step === totalSteps;
  const currentStepForProgress = step;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ProgressBar currentStep={currentStepForProgress} totalSteps={totalSteps} />

        {renderCurrentStep()}

        <View style={styles.buttonRow}>
          {step > 0 && (
            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backBtn}>
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            {isLastStep ? (
              <GradientButton title="Create Account" onPress={handleRegister} loading={loading} />
            ) : (
              <GradientButton
                title={step === 7 && isPatient && !state.prakritiResult ? 'Take Prakriti Quiz' : 'Next'}
                onPress={handleNext}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flexGrow: 1, paddingHorizontal: SIZES.screenPadding, paddingVertical: 20 },
  stepTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  stepDesc: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8, marginTop: 12 },
  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
    backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: '#FFF5F0', borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.primary, fontWeight: '700' },
  // Toggle
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  toggleLabel: { fontSize: 15, fontWeight: '500', color: COLORS.text },
  // Slider
  sliderContainer: { marginBottom: 20 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sliderLabel: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary },
  sliderValue: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  sliderTrack: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 30 },
  sliderDot: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.border,
  },
  sliderDotActive: { backgroundColor: COLORS.primary },
  // BMI
  bmiCard: { alignItems: 'center', paddingVertical: 20 },
  bmiCircle: {
    width: 100, height: 100, borderRadius: 50, borderWidth: 4,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  bmiValue: { fontSize: 24, fontWeight: '800' },
  bmiLabel: { fontSize: 12, color: COLORS.textSecondary },
  bmiCategory: { fontSize: 16, fontWeight: '700', textTransform: 'uppercase' },
  // Role cards
  roleCard: {
    flexDirection: 'row', alignItems: 'center', padding: 20,
    borderRadius: SIZES.borderRadiusLg, borderWidth: 2, borderColor: COLORS.border,
    marginBottom: 12, backgroundColor: COLORS.background,
  },
  roleCardActive: { borderColor: COLORS.primary, backgroundColor: '#FFF5F0' },
  roleIcon: { fontSize: 36, marginRight: 16 },
  roleInfo: { flex: 1 },
  roleTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  roleDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  // Quiz prompt
  quizPromptCard: { alignItems: 'center', padding: 30, backgroundColor: COLORS.background, borderRadius: SIZES.borderRadiusLg },
  quizIcon: { fontSize: 48, marginBottom: 12 },
  quizTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  quizDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8 },
  quizNote: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginTop: 12 },
  prakritiResultCard: { marginTop: 20, padding: 16, backgroundColor: COLORS.surface, borderRadius: SIZES.borderRadius, width: '100%' },
  prakritiResultTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  prakritiScores: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  doshaScore: { fontSize: 14, fontWeight: '600' },
  // Buttons
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 20 },
  backBtn: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: SIZES.borderRadius, borderWidth: 1.5, borderColor: COLORS.border, justifyContent: 'center' },
  backBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
});

export default RegisterScreen;
