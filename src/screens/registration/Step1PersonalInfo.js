import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import { setPersonalInfo, calculateBMI, calculateAge } from '../../store/slices/userSlice';
import { updateFormData, setStepValidity, nextStep } from '../../store/slices/registrationSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ProgressIndicator from '../../components/common/ProgressIndicator';

const Step1PersonalInfo = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { formData } = useSelector((state) => state.registration);
  const { personalInfo: savedPersonalInfo } = useSelector((state) => state.user);

  // Form state
  const [fullName, setFullName] = useState(savedPersonalInfo?.fullName || formData?.personalInfo?.fullName || '');
  const [email, setEmail] = useState(savedPersonalInfo?.email || formData?.personalInfo?.email || '');
  const [phone, setPhone] = useState(savedPersonalInfo?.phone || formData?.personalInfo?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(savedPersonalInfo?.dateOfBirth || formData?.personalInfo?.dateOfBirth || null);
  const [age, setAge] = useState(savedPersonalInfo?.age || formData?.personalInfo?.age || '');
  const [gender, setGender] = useState(savedPersonalInfo?.gender || formData?.personalInfo?.gender || '');
  const [bloodGroup, setBloodGroup] = useState(savedPersonalInfo?.bloodGroup || formData?.personalInfo?.bloodGroup || '');
  const [height, setHeight] = useState(savedPersonalInfo?.height || formData?.personalInfo?.height || '');
  const [weight, setWeight] = useState(savedPersonalInfo?.weight || formData?.personalInfo?.weight || '');
  const [bmi, setBmi] = useState(savedPersonalInfo?.bmi || formData?.personalInfo?.bmi || '');

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Blood groups
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    validateForm();
  }, [fullName, email, phone, dateOfBirth, gender, height, weight]);

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Date of Birth validation
    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    // Gender validation
    if (!gender) {
      newErrors.gender = 'Please select your gender';
    }

    // Height validation
    if (!height) {
      newErrors.height = 'Height is required';
    } else if (isNaN(height) || height < 50 || height > 250) {
      newErrors.height = 'Height must be between 50-250 cm';
    }

    // Weight validation
    if (!weight) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(weight) || weight < 20 || weight > 300) {
      newErrors.weight = 'Weight must be between 20-300 kg';
    }

    setErrors(newErrors);
    
    // Update validity in Redux
    const isValid = Object.keys(newErrors).length === 0;
    dispatch(setStepValidity({ step: 1, isValid }));
    
    return isValid;
  };

  const calculateBMIValue = (ht, wt) => {
    if (ht && wt && ht > 0) {
      const heightInMeters = parseFloat(ht) / 100;
      const weightInKg = parseFloat(wt);
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      return Math.round(bmiValue * 10) / 10;
    }
    return '';
  };

  const handleHeightChange = (value) => {
    setHeight(value);
    if (value && weight) {
      const bmiValue = calculateBMIValue(value, weight);
      setBmi(bmiValue);
    }
  };

  const handleWeightChange = (value) => {
    setWeight(value);
    if (height && value) {
      const bmiValue = calculateBMIValue(height, value);
      setBmi(bmiValue);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      
      // Calculate age
      const today = new Date();
      let calculatedAge = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge.toString());
    }
  };

  const getBMIColor = (bmiValue) => {
    if (!bmiValue) return colors.textTertiary;
    const bmiNum = parseFloat(bmiValue);
    if (bmiNum < 18.5) return colors.bmiBlue; // Underweight
    if (bmiNum >= 18.5 && bmiNum < 25) return colors.bmiGreen; // Normal
    if (bmiNum >= 25 && bmiNum < 30) return colors.bmiOrange; // Overweight
    return colors.bmiRed; // Obese
  };

  const getBMICategory = (bmiValue) => {
    if (!bmiValue) return '';
    const bmiNum = parseFloat(bmiValue);
    if (bmiNum < 18.5) return 'Underweight';
    if (bmiNum >= 18.5 && bmiNum < 25) return 'Normal';
    if (bmiNum >= 25 && bmiNum < 30) return 'Overweight';
    return 'Obese';
  };

  const handleNext = () => {
    if (validateForm()) {
      // Save data to Redux
      const personalData = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        dateOfBirth: dateOfBirth.toISOString(),
        age: parseInt(age),
        gender,
        bloodGroup,
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: parseFloat(bmi),
      };

      dispatch(setPersonalInfo(personalData));
      dispatch(updateFormData({ step: 'personalInfo', data: personalData }));
      dispatch(nextStep());
      navigation.navigate(ROUTES.STEP2_LIFESTYLE);
    } else {
      // Show first error
      const firstError = Object.values(errors)[0];
      Alert.alert('Validation Error', firstError);
    }
  };

  return (
    <View style={styles.container}>
      <ProgressIndicator currentStep={1} totalSteps={8} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Basic Personal Information</Text>
        <Text style={styles.sectionSubtitle}>Tell us about yourself to get started</Text>

        {/* Full Name */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
          <View style={[styles.inputContainer, errors.fullName && touched.fullName && styles.inputError]}>
            <Ionicons name="person-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textTertiary}
              value={fullName}
              onChangeText={setFullName}
              onBlur={() => setTouched({ ...touched, fullName: true })}
            />
          </View>
          {errors.fullName && touched.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}
        </View>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
          <View style={[styles.inputContainer, errors.email && touched.email && styles.inputError]}>
            <Ionicons name="mail-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              onBlur={() => setTouched({ ...touched, email: true })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email && touched.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
        </View>

        {/* Phone */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
          <View style={[styles.inputContainer, errors.phone && touched.phone && styles.inputError]}>
            <Ionicons name="call-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor={colors.textTertiary}
              value={phone}
              onChangeText={setPhone}
              onBlur={() => setTouched({ ...touched, phone: true })}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          {errors.phone && touched.phone && (
            <Text style={styles.errorText}>{errors.phone}</Text>
          )}
        </View>

        {/* Date of Birth & Age */}
        <View style={styles.rowContainer}>
          <View style={[styles.inputWrapper, styles.halfWidth]}>
            <Text style={styles.label}>Date of Birth <Text style={styles.required}>*</Text></Text>
            <TouchableOpacity
              style={[styles.inputContainer, errors.dateOfBirth && touched.dateOfBirth && styles.inputError]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
              <Text style={[styles.input, !dateOfBirth && styles.placeholderText]}>
                {dateOfBirth ? dateOfBirth.toLocaleDateString() : 'Select date'}
              </Text>
            </TouchableOpacity>
            {errors.dateOfBirth && touched.dateOfBirth && (
              <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
            )}
          </View>

          <View style={[styles.inputWrapper, styles.halfWidth]}>
            <Text style={styles.label}>Age</Text>
            <View style={[styles.inputContainer, styles.disabledInput]}>
              <Ionicons name="calendar-number-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.disabledText]}
                value={age}
                editable={false}
                placeholder="Auto-calculated"
              />
            </View>
          </View>
        </View>

        {/* Gender */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
          <View style={styles.genderContainer}>
            {['Male', 'Female', 'Other'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.genderOption,
                  gender === option && styles.genderOptionSelected,
                ]}
                onPress={() => setGender(option)}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === option && styles.genderTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender && touched.gender && (
            <Text style={styles.errorText}>{errors.gender}</Text>
          )}
        </View>

        {/* Blood Group */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Blood Group</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.bloodGroupScroll}
          >
            <View style={styles.bloodGroupContainer}>
              {bloodGroups.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.bloodGroupOption,
                    bloodGroup === group && styles.bloodGroupOptionSelected,
                  ]}
                  onPress={() => setBloodGroup(group)}
                >
                  <Text
                    style={[
                      styles.bloodGroupText,
                      bloodGroup === group && styles.bloodGroupTextSelected,
                    ]}
                  >
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Height & Weight */}
        <View style={styles.rowContainer}>
          <View style={[styles.inputWrapper, styles.halfWidth]}>
            <Text style={styles.label}>Height (cm) <Text style={styles.required}>*</Text></Text>
            <View style={[styles.inputContainer, errors.height && touched.height && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="170"
                placeholderTextColor={colors.textTertiary}
                value={height}
                onChangeText={handleHeightChange}
                onBlur={() => setTouched({ ...touched, height: true })}
                keyboardType="numeric"
              />
            </View>
            {errors.height && touched.height && (
              <Text style={styles.errorText}>{errors.height}</Text>
            )}
          </View>

          <View style={[styles.inputWrapper, styles.halfWidth]}>
            <Text style={styles.label}>Weight (kg) <Text style={styles.required}>*</Text></Text>
            <View style={[styles.inputContainer, errors.weight && touched.weight && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="70"
                placeholderTextColor={colors.textTertiary}
                value={weight}
                onChangeText={handleWeightChange}
                onBlur={() => setTouched({ ...touched, weight: true })}
                keyboardType="numeric"
              />
            </View>
            {errors.weight && touched.weight && (
              <Text style={styles.errorText}>{errors.weight}</Text>
            )}
          </View>
        </View>

        {/* BMI Display */}
        {bmi ? (
          <View style={[styles.bmiContainer, { borderColor: getBMIColor(bmi) }]}>
            <View style={styles.bmiHeader}>
              <Text style={styles.bmiLabel}>Your BMI</Text>
              <View style={[styles.bmiBadge, { backgroundColor: getBMIColor(bmi) }]}>
                <Text style={styles.bmiBadgeText}>{getBMICategory(bmi)}</Text>
              </View>
            </View>
            <Text style={[styles.bmiValue, { color: getBMIColor(bmi) }]}>{bmi}</Text>
            <View style={styles.bmiScale}>
              <View style={[styles.bmiScaleSegment, { backgroundColor: colors.bmiBlue }]} />
              <View style={[styles.bmiScaleSegment, { backgroundColor: colors.bmiGreen }]} />
              <View style={[styles.bmiScaleSegment, { backgroundColor: colors.bmiOrange }]} />
              <View style={[styles.bmiScaleSegment, { backgroundColor: colors.bmiRed }]} />
              <View style={[styles.bmiIndicator, { left: `${(parseFloat(bmi) / 40) * 100}%` }]} />
            </View>
            <View style={styles.bmiScaleLabels}>
              <Text style={styles.bmiScaleLabel}>18.5</Text>
              <Text style={styles.bmiScaleLabel}>25</Text>
              <Text style={styles.bmiScaleLabel}>30</Text>
            </View>
          </View>
        ) : null}

        <Button
          title="Next"
          onPress={handleNext}
          style={styles.nextButton}
          gradient
        />
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
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
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  required: {
    color: colors.alertRed,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: colors.alertRed,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.alertRed,
    marginTop: 4,
    marginLeft: 4,
  },
  placeholderText: {
    color: colors.textTertiary,
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
  },
  disabledText: {
    color: colors.textTertiary,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  genderOptionSelected: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  genderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  genderTextSelected: {
    color: 'white',
  },
  bloodGroupScroll: {
    flexGrow: 0,
  },
  bloodGroupContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  bloodGroupOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'white',
  },
  bloodGroupOptionSelected: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  bloodGroupText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  bloodGroupTextSelected: {
    color: 'white',
  },
  bmiContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  bmiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bmiLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textSecondary,
  },
  bmiBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bmiBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'white',
  },
  bmiValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    marginBottom: 16,
  },
  bmiScale: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  bmiScaleSegment: {
    flex: 1,
    height: '100%',
  },
  bmiIndicator: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.textPrimary,
    top: -4,
    marginLeft: -8,
  },
  bmiScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  bmiScaleLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  nextButton: {
    marginTop: 20,
  },
});

export default Step1PersonalInfo;