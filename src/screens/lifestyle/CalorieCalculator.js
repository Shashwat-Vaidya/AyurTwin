import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const CalorieCalculator = () => {
  const navigation = useNavigation();

  // User input state
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain'); // lose, maintain, gain

  // Results state
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [macros, setMacros] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  // Meal breakdown
  const [meals, setMeals] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
  });

  // Activity levels
  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', multiplier: 1.2, desc: 'Little or no exercise' },
    { id: 'light', label: 'Light Activity', multiplier: 1.375, desc: 'Light exercise 1-3 days/week' },
    { id: 'moderate', label: 'Moderate', multiplier: 1.55, desc: 'Moderate exercise 3-5 days/week' },
    { id: 'active', label: 'Active', multiplier: 1.725, desc: 'Hard exercise 6-7 days/week' },
    { id: 'veryActive', label: 'Very Active', multiplier: 1.9, desc: 'Very hard exercise & physical job' },
  ];

  // Goals
  const goals = [
    { id: 'lose', label: 'Lose Weight', adjustment: -500, icon: 'trending-down', color: colors.alertRed },
    { id: 'maintain', label: 'Maintain', adjustment: 0, icon: 'remove', color: colors.primaryGreen },
    { id: 'gain', label: 'Gain Weight', adjustment: 500, icon: 'trending-up', color: colors.successGreen },
  ];

  // Calculate BMR and TDEE
  useEffect(() => {
    calculateCalories();
  }, [age, gender, height, weight, activityLevel, goal]);

  const calculateCalories = () => {
    // BMR Calculation (Mifflin-St Jeor Equation)
    let bmrValue = 0;
    const weightNum = parseFloat(weight) || 70;
    const heightNum = parseFloat(height) || 170;
    const ageNum = parseFloat(age) || 30;

    if (gender === 'male') {
      bmrValue = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
    } else {
      bmrValue = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
    }

    setBmr(Math.round(bmrValue));

    // TDEE Calculation
    const activityMultiplier = activityLevels.find(a => a.id === activityLevel)?.multiplier || 1.55;
    const tdeeValue = bmrValue * activityMultiplier;
    setTdee(Math.round(tdeeValue));

    // Calorie Target based on goal
    const goalAdjustment = goals.find(g => g.id === goal)?.adjustment || 0;
    const targetValue = tdeeValue + goalAdjustment;
    setCalorieTarget(Math.round(targetValue));

    // Calculate Macros (using standard ratios)
    // Protein: 30%, Carbs: 40%, Fat: 30% of calories
    const proteinCalories = targetValue * 0.3;
    const carbsCalories = targetValue * 0.4;
    const fatCalories = targetValue * 0.3;

    setMacros({
      protein: Math.round(proteinCalories / 4), // 4 calories per gram
      carbs: Math.round(carbsCalories / 4),     // 4 calories per gram
      fat: Math.round(fatCalories / 9),         // 9 calories per gram
    });

    // Calculate meal distribution (30% breakfast, 35% lunch, 25% dinner, 10% snacks)
    setMeals({
      breakfast: Math.round(targetValue * 0.3),
      lunch: Math.round(targetValue * 0.35),
      dinner: Math.round(targetValue * 0.25),
      snacks: Math.round(targetValue * 0.1),
    });
  };

  // Get BMI Category
  const getBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const bmi = parseFloat(weight) / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = () => {
    const heightInMeters = parseFloat(height) / 100;
    const bmi = parseFloat(weight) / (heightInMeters * heightInMeters);
    
    if (bmi < 18.5) return { category: 'Underweight', color: colors.spO2Blue };
    if (bmi < 25) return { category: 'Normal', color: colors.successGreen };
    if (bmi < 30) return { category: 'Overweight', color: colors.warningYellow };
    return { category: 'Obese', color: colors.alertRed };
  };

  const bmiInfo = getBMICategory();
  const bmiValue = getBMI();

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
          <Text style={styles.headerTitle}>Calorie Calculator</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* BMI Card */}
        <Card style={styles.bmiCard}>
          <View style={styles.bmiHeader}>
            <Text style={styles.bmiTitle}>Your BMI</Text>
            <View style={[styles.bmiBadge, { backgroundColor: bmiInfo.color }]}>
              <Text style={styles.bmiBadgeText}>{bmiInfo.category}</Text>
            </View>
          </View>
          <Text style={[styles.bmiValue, { color: bmiInfo.color }]}>{bmiValue}</Text>
          <View style={styles.bmiScale}>
            <View style={[styles.bmiScaleSegment, { backgroundColor: colors.spO2Blue }]} />
            <View style={[styles.bmiScaleSegment, { backgroundColor: colors.successGreen }]} />
            <View style={[styles.bmiScaleSegment, { backgroundColor: colors.warningYellow }]} />
            <View style={[styles.bmiScaleSegment, { backgroundColor: colors.alertRed }]} />
          </View>
        </Card>

        {/* Input Form */}
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Your Details</Text>

          {/* Age */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholder="years"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          {/* Gender */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderButtons}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'male' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('male')}
              >
                <Ionicons 
                  name="male" 
                  size={20} 
                  color={gender === 'male' ? 'white' : colors.textSecondary} 
                />
                <Text style={[
                  styles.genderButtonText,
                  gender === 'male' && styles.genderButtonTextActive
                ]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'female' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('female')}
              >
                <Ionicons 
                  name="female" 
                  size={20} 
                  color={gender === 'female' ? 'white' : colors.textSecondary} 
                />
                <Text style={[
                  styles.genderButtonText,
                  gender === 'female' && styles.genderButtonTextActive
                ]}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Height */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholder="cm"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          {/* Weight */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="kg"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </Card>

        {/* Activity Level */}
        <Card style={styles.activityCard}>
          <Text style={styles.formTitle}>Activity Level</Text>
          
          {activityLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.activityOption,
                activityLevel === level.id && styles.activityOptionActive,
              ]}
              onPress={() => setActivityLevel(level.id)}
            >
              <View style={styles.activityLeft}>
                <View style={[
                  styles.activityDot,
                  activityLevel === level.id && { backgroundColor: colors.primarySaffron }
                ]} />
                <View>
                  <Text style={styles.activityLabel}>{level.label}</Text>
                  <Text style={styles.activityDesc}>{level.desc}</Text>
                </View>
              </View>
              <Text style={styles.activityMultiplier}>{level.multiplier}</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Goal */}
        <Card style={styles.goalCard}>
          <Text style={styles.formTitle}>Your Goal</Text>
          
          <View style={styles.goalButtons}>
            {goals.map((g) => (
              <TouchableOpacity
                key={g.id}
                style={[
                  styles.goalButton,
                  goal === g.id && { borderColor: g.color, borderWidth: 2 }
                ]}
                onPress={() => setGoal(g.id)}
              >
                <Ionicons name={g.icon} size={24} color={goal === g.id ? g.color : colors.textTertiary} />
                <Text style={[
                  styles.goalButtonText,
                  goal === g.id && { color: g.color }
                ]}>{g.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Results */}
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.resultsCard}
        >
          <Text style={styles.resultsTitle}>Your Daily Calories</Text>
          
          <View style={styles.mainResult}>
            <Text style={styles.calorieValue}>{calorieTarget}</Text>
            <Text style={styles.calorieUnit}>calories/day</Text>
          </View>

          <View style={styles.resultsGrid}>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>BMR</Text>
              <Text style={styles.resultValue}>{bmr}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>TDEE</Text>
              <Text style={styles.resultValue}>{tdee}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Adjustment</Text>
              <Text style={styles.resultValue}>
                {goal === 'lose' ? '-500' : goal === 'gain' ? '+500' : '0'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Macro Breakdown */}
        <Card style={styles.macroCard}>
          <Text style={styles.macroTitle}>Macro Breakdown</Text>
          
          <View style={styles.macroGrid}>
            <View style={[styles.macroItem, { backgroundColor: `${colors.heartRate}20` }]}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={[styles.macroValue, { color: colors.heartRate }]}>{macros.protein}g</Text>
              <Text style={styles.macroPercentage}>30%</Text>
            </View>
            
            <View style={[styles.macroItem, { backgroundColor: `${colors.primaryGreen}20` }]}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={[styles.macroValue, { color: colors.primaryGreen }]}>{macros.carbs}g</Text>
              <Text style={styles.macroPercentage}>40%</Text>
            </View>
            
            <View style={[styles.macroItem, { backgroundColor: `${colors.warningYellow}20` }]}>
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={[styles.macroValue, { color: colors.warningYellow }]}>{macros.fat}g</Text>
              <Text style={styles.macroPercentage}>30%</Text>
            </View>
          </View>
        </Card>

        {/* Meal Distribution */}
        <Card style={styles.mealCard}>
          <Text style={styles.mealTitle}>Suggested Meal Distribution</Text>
          
          <View style={styles.mealItem}>
            <View style={styles.mealLeft}>
              <Ionicons name="sunny" size={20} color={colors.warningYellow} />
              <Text style={styles.mealName}>Breakfast</Text>
            </View>
            <Text style={styles.mealCalories}>{meals.breakfast} cal</Text>
          </View>
          
          <View style={styles.mealItem}>
            <View style={styles.mealLeft}>
              <Ionicons name="sunny" size={20} color={colors.tempOrange} />
              <Text style={styles.mealName}>Lunch</Text>
            </View>
            <Text style={styles.mealCalories}>{meals.lunch} cal</Text>
          </View>
          
          <View style={styles.mealItem}>
            <View style={styles.mealLeft}>
              <Ionicons name="moon" size={20} color={colors.sleepIndigo} />
              <Text style={styles.mealName}>Dinner</Text>
            </View>
            <Text style={styles.mealCalories}>{meals.dinner} cal</Text>
          </View>
          
          <View style={styles.mealItem}>
            <View style={styles.mealLeft}>
              <Ionicons name="cafe" size={20} color={colors.stressPurple} />
              <Text style={styles.mealName}>Snacks</Text>
            </View>
            <Text style={styles.mealCalories}>{meals.snacks} cal</Text>
          </View>
        </Card>

        {/* Tips */}
        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={24} color={colors.warningYellow} />
            <Text style={styles.tipsTitle}>Tips</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.tipText}>Drink water before meals to control portions</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.tipText}>Eat protein with every meal</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.tipText}>Track your food intake for accuracy</Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Save to Profile"
            onPress={() => Alert.alert('Success', 'Calorie target saved to profile')}
            style={styles.saveButton}
            gradient
          />
          <Button
            title="Reset"
            onPress={() => {
              setAge('30');
              setGender('male');
              setHeight('170');
              setWeight('70');
              setActivityLevel('moderate');
              setGoal('maintain');
            }}
            style={styles.resetButton}
            outline
          />
        </View>

        {/* Note */}
        <Text style={styles.note}>
          This is an estimate. Individual calorie needs may vary based on metabolism, 
          body composition, and other factors.
        </Text>
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
  infoButton: {
    padding: 8,
  },
  bmiCard: {
    padding: 16,
    marginBottom: 16,
  },
  bmiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bmiTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textSecondary,
  },
  bmiBadge: {
    paddingHorizontal: 10,
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
    marginBottom: 12,
  },
  bmiScale: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bmiScaleSegment: {
    flex: 1,
    height: '100%',
  },
  formCard: {
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    width: 100,
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
  },
  genderButtons: {
    flex: 1,
    flexDirection: 'row',
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  genderButtonActive: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  genderButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  genderButtonTextActive: {
    color: 'white',
  },
  activityCard: {
    padding: 16,
    marginBottom: 16,
  },
  activityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginRight: 12,
  },
  activityLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  activityDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  activityMultiplier: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.primarySaffron,
  },
  goalCard: {
    padding: 16,
    marginBottom: 16,
  },
  goalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  goalButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  resultsCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  resultsTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 12,
  },
  mainResult: {
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: 'white',
  },
  calorieUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  resultsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  resultItem: {
    alignItems: 'center',
  },
  resultLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
    marginBottom: 4,
  },
  resultValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: 'white',
  },
  macroCard: {
    padding: 16,
    marginBottom: 16,
  },
  macroTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  macroLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  macroValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 2,
  },
  macroPercentage: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  mealCard: {
    padding: 16,
    marginBottom: 16,
  },
  mealTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealName: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  mealCalories: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.primarySaffron,
  },
  tipsCard: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 179, 71, 0.05)',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
  },
  resetButton: {
    flex: 1,
    marginLeft: 8,
  },
  note: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default CalorieCalculator;