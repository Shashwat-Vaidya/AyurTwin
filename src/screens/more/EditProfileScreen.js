import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const EditProfileScreen = () => {
  const navigation = useNavigation();

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);

  // Personal info state
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [dateOfBirth, setDateOfBirth] = useState(new Date(1990, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('male');
  const [bloodGroup, setBloodGroup] = useState('O+');

  // Body metrics state
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');
  const [bmi, setBmi] = useState('24.2');

  // Health preferences
  const [dietType, setDietType] = useState('vegetarian');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [sleepGoal, setSleepGoal] = useState('7-8');
  const [waterIntake, setWaterIntake] = useState('2.5');

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('Jane Doe');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98765 43211');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');

  const [isEditing, setIsEditing] = useState({
    personal: false,
    metrics: false,
    preferences: false,
    emergency: false,
  });

  // Blood groups
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Diet types
  const dietTypes = [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Non-Vegetarian', value: 'non-vegetarian' },
    { label: 'Eggetarian', value: 'eggetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Flexitarian', value: 'flexitarian' },
  ];

  // Activity levels
  const activityLevels = [
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Light Activity', value: 'light' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Active', value: 'active' },
    { label: 'Very Active', value: 'veryActive' },
  ];

  // Sleep goals
  const sleepGoals = ['5-6', '6-7', '7-8', '8-9', '9+'];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to change profile picture');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const calculateAge = () => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    if (heightInMeters && weightInKg) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      return bmiValue.toFixed(1);
    }
    return '0';
  };

  const handleSave = () => {
    Alert.alert(
      'Save Changes',
      'Are you sure you want to save these changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const toggleEdit = (section) => {
    setIsEditing(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSectionHeader = (title, section, icon) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <Ionicons name={icon} size={22} color={colors.primarySaffron} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleEdit(section)}>
        <Ionicons 
          name={isEditing[section] ? 'close' : 'create-outline'} 
          size={22} 
          color={colors.primarySaffron} 
        />
      </TouchableOpacity>
    </View>
  );

  const renderInfoRow = (label, value, icon) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLabelContainer}>
        <Ionicons name={icon} size={18} color={colors.textSecondary} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const renderEditableRow = (label, value, setValue, icon, keyboardType = 'default') => (
    <View style={styles.editableRow}>
      <View style={styles.infoLabelContainer}>
        <Ionicons name={icon} size={18} color={colors.textSecondary} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <TextInput
        style={styles.editableInput}
        value={value}
        onChangeText={setValue}
        keyboardType={keyboardType}
        placeholderTextColor={colors.textTertiary}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveHeaderButton}>
            <Ionicons name="checkmark" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View style={styles.profileImageSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>JD</Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <Card style={styles.section}>
          {renderSectionHeader('Personal Information', 'personal', 'person-outline')}
          
          {isEditing.personal ? (
            <>
              {renderEditableRow('Full Name', fullName, setFullName, 'person-outline')}
              {renderEditableRow('Email', email, setEmail, 'mail-outline', 'email-address')}
              {renderEditableRow('Phone', phone, setPhone, 'call-outline', 'phone-pad')}
              
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Date of Birth</Text>
                </View>
                <Text style={styles.dateValue}>{dateOfBirth.toLocaleDateString()}</Text>
              </TouchableOpacity>

              <View style={styles.pickerContainer}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="male-female-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Gender</Text>
                </View>
                <Picker
                  selectedValue={gender}
                  onValueChange={setGender}
                  style={styles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>

              <View style={styles.pickerContainer}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="water-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Blood Group</Text>
                </View>
                <Picker
                  selectedValue={bloodGroup}
                  onValueChange={setBloodGroup}
                  style={styles.picker}
                  mode="dropdown"
                >
                  {bloodGroups.map(group => (
                    <Picker.Item key={group} label={group} value={group} />
                  ))}
                </Picker>
              </View>
            </>
          ) : (
            <>
              {renderInfoRow('Full Name', fullName, 'person-outline')}
              {renderInfoRow('Email', email, 'mail-outline')}
              {renderInfoRow('Phone', phone, 'call-outline')}
              {renderInfoRow('Date of Birth', dateOfBirth.toLocaleDateString(), 'calendar-outline')}
              {renderInfoRow('Gender', gender.charAt(0).toUpperCase() + gender.slice(1), 'male-female-outline')}
              {renderInfoRow('Blood Group', bloodGroup, 'water-outline')}
              {renderInfoRow('Age', `${calculateAge()} years`, 'time-outline')}
            </>
          )}
        </Card>

        {/* Body Metrics */}
        <Card style={styles.section}>
          {renderSectionHeader('Body Metrics', 'metrics', 'fitness-outline')}
          
          {isEditing.metrics ? (
            <>
              {renderEditableRow('Height (cm)', height, setHeight, 'resize-outline', 'numeric')}
              {renderEditableRow('Weight (kg)', weight, setWeight, 'barbell-outline', 'numeric')}
              {renderInfoRow('BMI', calculateBMI(), 'calculator-outline')}
            </>
          ) : (
            <>
              {renderInfoRow('Height', `${height} cm`, 'resize-outline')}
              {renderInfoRow('Weight', `${weight} kg`, 'barbell-outline')}
              {renderInfoRow('BMI', calculateBMI(), 'calculator-outline')}
            </>
          )}
        </Card>

        {/* Health Preferences */}
        <Card style={styles.section}>
          {renderSectionHeader('Health Preferences', 'preferences', 'heart-outline')}
          
          {isEditing.preferences ? (
            <>
              <View style={styles.pickerContainer}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="leaf-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Diet Type</Text>
                </View>
                <Picker
                  selectedValue={dietType}
                  onValueChange={setDietType}
                  style={styles.picker}
                  mode="dropdown"
                >
                  {dietTypes.map(type => (
                    <Picker.Item key={type.value} label={type.label} value={type.value} />
                  ))}
                </Picker>
              </View>

              <View style={styles.pickerContainer}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="fitness-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Activity Level</Text>
                </View>
                <Picker
                  selectedValue={activityLevel}
                  onValueChange={setActivityLevel}
                  style={styles.picker}
                  mode="dropdown"
                >
                  {activityLevels.map(level => (
                    <Picker.Item key={level.value} label={level.label} value={level.value} />
                  ))}
                </Picker>
              </View>

              <View style={styles.pickerContainer}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="moon-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Sleep Goal</Text>
                </View>
                <Picker
                  selectedValue={sleepGoal}
                  onValueChange={setSleepGoal}
                  style={styles.picker}
                  mode="dropdown"
                >
                  {sleepGoals.map(goal => (
                    <Picker.Item key={goal} label={`${goal} hours`} value={goal} />
                  ))}
                </Picker>
              </View>

              {renderEditableRow('Water Intake (L)', waterIntake, setWaterIntake, 'water-outline', 'numeric')}
            </>
          ) : (
            <>
              {renderInfoRow('Diet Type', dietType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), 'leaf-outline')}
              {renderInfoRow('Activity Level', activityLevels.find(l => l.value === activityLevel)?.label || 'Moderate', 'fitness-outline')}
              {renderInfoRow('Sleep Goal', `${sleepGoal} hours`, 'moon-outline')}
              {renderInfoRow('Water Intake', `${waterIntake} L/day`, 'water-outline')}
            </>
          )}
        </Card>

        {/* Emergency Contact */}
        <Card style={styles.section}>
          {renderSectionHeader('Emergency Contact', 'emergency', 'shield-outline')}
          
          {isEditing.emergency ? (
            <>
              {renderEditableRow('Contact Name', emergencyName, setEmergencyName, 'person-outline')}
              {renderEditableRow('Phone Number', emergencyPhone, setEmergencyPhone, 'call-outline', 'phone-pad')}
              
              <View style={styles.pickerContainer}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="people-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Relationship</Text>
                </View>
                <Picker
                  selectedValue={emergencyRelation}
                  onValueChange={setEmergencyRelation}
                  style={styles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label="Spouse" value="Spouse" />
                  <Picker.Item label="Parent" value="Parent" />
                  <Picker.Item label="Sibling" value="Sibling" />
                  <Picker.Item label="Friend" value="Friend" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </>
          ) : (
            <>
              {renderInfoRow('Contact Name', emergencyName, 'person-outline')}
              {renderInfoRow('Phone Number', emergencyPhone, 'call-outline')}
              {renderInfoRow('Relationship', emergencyRelation, 'people-outline')}
            </>
          )}
        </Card>

        {/* Save Button */}
        <Button
          title="Save All Changes"
          onPress={handleSave}
          style={styles.saveButton}
          gradient
        />

        {/* Cancel Button */}
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          outline
        />
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="default"
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  saveHeaderButton: {
    padding: 8,
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primarySaffron,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primarySaffron,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primarySaffron,
  },
  placeholderText: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: 'white',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primarySaffron,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  changePhotoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  infoValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
  },
  editableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  editableInput: {
    width: '60%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: 'white',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dateValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  picker: {
    width: '60%',
    height: 40,
  },
  saveButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 20,
  },
});

export default EditProfileScreen;