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

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import { setFamilyHistory } from '../../store/slices/userSlice';
import { updateFormData, setStepValidity, nextStep, previousStep } from '../../store/slices/registrationSlice';
import Button from '../../components/common/Button';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import ToggleSwitch from '../../components/forms/ToggleSwitch';

const Step4FamilyHistory = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { formData } = useSelector((state) => state.registration);
  const { familyHistory: savedFamilyHistory } = useSelector((state) => state.user);

  // Form state for family history
  const [diabetes, setDiabetes] = useState(
    savedFamilyHistory?.diabetes || formData?.familyHistory?.diabetes || false
  );
  const [heartDisease, setHeartDisease] = useState(
    savedFamilyHistory?.heartDisease || formData?.familyHistory?.heartDisease || false
  );
  const [hypertension, setHypertension] = useState(
    savedFamilyHistory?.hypertension || formData?.familyHistory?.hypertension || false
  );
  const [asthma, setAsthma] = useState(
    savedFamilyHistory?.asthma || formData?.familyHistory?.asthma || false
  );
  const [arthritis, setArthritis] = useState(
    savedFamilyHistory?.arthritis || formData?.familyHistory?.arthritis || false
  );

  // Additional state for family relationships (optional)
  const [showDetails, setShowDetails] = useState({});

  // UI state
  const [touched, setTouched] = useState(false);

  // Disease information with descriptions and risk factors
  const diseases = [
    {
      id: 'diabetes',
      name: 'Diabetes',
      icon: 'water',
      color: '#FF6B6B',
      description: 'Affects blood sugar regulation',
      risk: 'Increases your risk by 2-4x',
      familyMembers: ['Parents', 'Siblings', 'Grandparents'],
    },
    {
      id: 'heartDisease',
      name: 'Heart Disease',
      icon: 'heart',
      color: '#FF4D6D',
      description: 'Includes CAD, heart attacks',
      risk: 'Significant genetic component',
      familyMembers: ['Parents', 'Grandparents'],
    },
    {
      id: 'hypertension',
      name: 'Hypertension',
      icon: 'speedometer',
      color: '#FF8C42',
      description: 'High blood pressure',
      risk: 'Strong family link',
      familyMembers: ['Parents', 'Siblings'],
    },
    {
      id: 'asthma',
      name: 'Asthma',
      icon: 'medkit',
      color: '#4A90E2',
      description: 'Respiratory condition',
      risk: 'Often runs in families',
      familyMembers: ['Parents', 'Siblings'],
    },
    {
      id: 'arthritis',
      name: 'Arthritis',
      icon: 'bone',
      color: '#9B6B9E',
      description: 'Joint inflammation',
      risk: 'Genetic predisposition',
      familyMembers: ['Grandparents', 'Parents'],
    },
  ];

  useEffect(() => {
    // Form is always valid as toggles are optional
    dispatch(setStepValidity({ step: 4, isValid: true }));
  }, []);

  const handleNext = () => {
    const familyHistoryData = {
      diabetes,
      heartDisease,
      hypertension,
      asthma,
      arthritis,
    };

    dispatch(setFamilyHistory(familyHistoryData));
    dispatch(updateFormData({ step: 'familyHistory', data: familyHistoryData }));
    dispatch(nextStep());
    navigation.navigate(ROUTES.STEP5_SYMPTOMS);
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  const toggleShowDetails = (diseaseId) => {
    setShowDetails(prev => ({
      ...prev,
      [diseaseId]: !prev[diseaseId]
    }));
  };

  const getSelectedCount = () => {
    return [diabetes, heartDisease, hypertension, asthma, arthritis].filter(Boolean).length;
  };

  const getRiskLevel = () => {
    const count = getSelectedCount();
    if (count === 0) return { level: 'Low Risk', color: colors.successGreen };
    if (count <= 2) return { level: 'Moderate Risk', color: colors.warningYellow };
    return { level: 'High Risk', color: colors.alertRed };
  };

  return (
    <View style={styles.container}>
      <ProgressIndicator currentStep={4} totalSteps={8} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Family Medical History</Text>
        <Text style={styles.sectionSubtitle}>
          Help us understand your genetic predispositions
        </Text>

        {/* Risk Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="medical" size={24} color={colors.primarySaffron} />
            <Text style={styles.summaryTitle}>Genetic Risk Assessment</Text>
          </View>
          
          <View style={styles.riskContainer}>
            <View style={[styles.riskBadge, { backgroundColor: getRiskLevel().color }]}>
              <Text style={styles.riskText}>{getRiskLevel().level}</Text>
            </View>
            <Text style={styles.riskDescription}>
              Based on {getSelectedCount()} condition{getSelectedCount() !== 1 ? 's' : ''} reported
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(getSelectedCount() / 5) * 100}%`,
                    backgroundColor: getRiskLevel().color 
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.spO2Blue} />
          <Text style={styles.infoText}>
            Family history helps predict disease risks. Select any conditions that 
            run in your immediate family (parents, siblings, grandparents).
          </Text>
        </View>

        {/* Disease Toggles */}
        {diseases.map((disease) => {
          const value = getDiseaseValue(disease.id);
          const setValue = getDiseaseSetter(disease.id);

          return (
            <View key={disease.id} style={styles.diseaseCard}>
              <View style={styles.diseaseHeader}>
                <View style={styles.diseaseTitleContainer}>
                  <View style={[styles.diseaseIcon, { backgroundColor: `${disease.color}20` }]}>
                    <Ionicons name={disease.icon} size={24} color={disease.color} />
                  </View>
                  <View style={styles.diseaseInfo}>
                    <Text style={styles.diseaseName}>{disease.name}</Text>
                    <Text style={styles.diseaseDescription}>{disease.description}</Text>
                  </View>
                </View>
                <ToggleSwitch
                  value={value}
                  onValueChange={(newValue) => {
                    setValue(newValue);
                    setTouched(true);
                  }}
                  activeColor={disease.color}
                />
              </View>

              {value && (
                <View style={styles.diseaseDetails}>
                  <View style={styles.riskChip}>
                    <Ionicons name="warning" size={16} color={colors.warningYellow} />
                    <Text style={styles.riskChipText}>{disease.risk}</Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.viewDetailsButton}
                    onPress={() => toggleShowDetails(disease.id)}
                  >
                    <Text style={styles.viewDetailsText}>
                      {showDetails[disease.id] ? 'Hide details' : 'View details'}
                    </Text>
                    <Ionicons 
                      name={showDetails[disease.id] ? 'chevron-up' : 'chevron-down'} 
                      size={16} 
                      color={colors.primarySaffron} 
                    />
                  </TouchableOpacity>

                  {showDetails[disease.id] && (
                    <View style={styles.familyMembersList}>
                      <Text style={styles.familyMembersTitle}>Common in family:</Text>
                      <View style={styles.familyMembers}>
                        {disease.familyMembers.map((member, index) => (
                          <View key={index} style={styles.familyMemberChip}>
                            <Ionicons name="people" size={12} color={colors.textSecondary} />
                            <Text style={styles.familyMemberText}>{member}</Text>
                          </View>
                        ))}
                      </View>
                      
                      <View style={styles.recommendationBox}>
                        <Ionicons name="leaf" size={16} color={colors.primaryGreen} />
                        <Text style={styles.recommendationText}>
                          Regular screening recommended if selected
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {/* Additional Information */}
        <View style={styles.noteCard}>
          <Ionicons name="heart" size={20} color={colors.heartRate} />
          <Text style={styles.noteText}>
            This information helps us provide more accurate health predictions 
            and personalized prevention strategies.
          </Text>
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

  // Helper functions to get/set disease values
  function getDiseaseValue(id) {
    switch(id) {
      case 'diabetes': return diabetes;
      case 'heartDisease': return heartDisease;
      case 'hypertension': return hypertension;
      case 'asthma': return asthma;
      case 'arthritis': return arthritis;
      default: return false;
    }
  }

  function getDiseaseSetter(id) {
    switch(id) {
      case 'diabetes': return setDiabetes;
      case 'heartDisease': return setHeartDisease;
      case 'hypertension': return setHypertension;
      case 'asthma': return setAsthma;
      case 'arthritis': return setArthritis;
      default: return () => {};
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
  summaryCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  riskText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  riskDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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
  diseaseCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diseaseTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  diseaseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  diseaseInfo: {
    flex: 1,
  },
  diseaseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  diseaseDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  diseaseDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  riskChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  riskChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.warningYellow,
    marginLeft: 4,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewDetailsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
    marginRight: 4,
  },
  familyMembersList: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    padding: 12,
  },
  familyMembersTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  familyMembers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  familyMemberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  familyMemberText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 10,
    borderRadius: 8,
  },
  recommendationText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.primaryGreen,
    marginLeft: 8,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 77, 109, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    alignItems: 'center',
  },
  noteText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.heartRate,
    marginLeft: 12,
    lineHeight: 18,
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

export default Step4FamilyHistory;