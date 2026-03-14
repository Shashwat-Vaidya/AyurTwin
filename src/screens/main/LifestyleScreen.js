import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

const LifestyleScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { prakriti } = useSelector((state) => state.user);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Local state
  const [selectedTab, setSelectedTab] = useState('daily');
  const [checklist, setChecklist] = useState({
    oilPulling: false,
    tongueScraping: false,
    warmWater: false,
    meditation: false,
    yoga: false,
    mealTiming: false,
    earlyDinner: false,
  });

  // Calorie calculator state
  const [calorieInputs, setCalorieInputs] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
  });
  const [targetCalories, setTargetCalories] = useState(2000);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    calculateTargetCalories();
  }, []);

  const calculateTargetCalories = () => {
    // Simple BMR calculation based on user data
    const { age, gender, height, weight } = user?.personalInfo || {};
    if (age && gender && height && weight) {
      let bmr;
      if (gender === 'Male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      
      // Adjust based on activity level
      const activityMultiplier = {
        low: 1.2,
        moderate: 1.375,
        high: 1.55,
      }[user?.lifestyle?.physicalActivity] || 1.2;
      
      setTargetCalories(Math.round(bmr * activityMultiplier));
    }
  };

  const getDoshaColor = () => {
    switch(prakriti?.type) {
      case 'vata': return '#7B6E8F';
      case 'pitta': return '#FF6B6B';
      case 'kapha': return '#6BA6A6';
      default: return colors.primarySaffron;
    }
  };

  const getDoshaRecommendations = () => {
    switch(prakriti?.type) {
      case 'vata':
        return {
          diet: 'Warm, moist, grounding foods. Avoid cold and dry.',
          exercise: 'Gentle yoga, walking, swimming. Avoid overexertion.',
          routine: 'Regular daily routine, early to bed, oil massage.',
        };
      case 'pitta':
        return {
          diet: 'Cool, refreshing foods. Avoid spicy and oily.',
          exercise: 'Moderate exercise, avoid midday sun, swimming good.',
          routine: 'Stay cool, avoid skipping meals, lunch as largest meal.',
        };
      case 'kapha':
        return {
          diet: 'Light, warm, stimulating foods. Avoid heavy, oily.',
          exercise: 'Vigorous exercise, variety needed, morning best.',
          routine: 'Early rising, dry brushing, stay active.',
        };
      default:
        return {
          diet: 'Balanced diet with all six tastes.',
          exercise: 'Mixed routine based on your needs.',
          routine: 'Listen to your body and maintain consistency.',
        };
    }
  };

  const totalCalories = calorieInputs.breakfast + calorieInputs.lunch + calorieInputs.dinner + calorieInputs.snacks;
  const caloriesRemaining = targetCalories - totalCalories;
  const caloriesPercentage = (totalCalories / targetCalories) * 100;

  const getCalorieColor = () => {
    if (caloriesPercentage < 70) return colors.spO2Blue;
    if (caloriesPercentage < 90) return colors.successGreen;
    if (caloriesPercentage < 110) return colors.warningYellow;
    return colors.alertRed;
  };

  const tabs = [
    { id: 'daily', label: 'Dinacharya', icon: 'sunny' },
    { id: 'diet', label: 'Diet', icon: 'restaurant' },
    { id: 'seasonal', label: 'Ritucharya', icon: 'leaf' },
    { id: 'stress', label: 'Stress Relief', icon: 'heart' },
  ];

  const dinacharyaItems = [
    { id: 'oilPulling', label: 'Oil Pulling', time: 'Morning', icon: 'water', benefit: 'Oral health, detox' },
    { id: 'tongueScraping', label: 'Tongue Scraping', time: 'Morning', icon: 'remove', benefit: 'Remove toxins' },
    { id: 'warmWater', label: 'Warm Water', time: 'Upon waking', icon: 'cafe', benefit: 'Digestion boost' },
    { id: 'meditation', label: 'Meditation', time: 'Morning/Evening', icon: 'leaf', benefit: 'Mental clarity' },
    { id: 'yoga', label: 'Yoga', time: 'Morning', icon: 'body', benefit: 'Flexibility, strength' },
    { id: 'mealTiming', label: 'Regular Meals', time: 'Fixed times', icon: 'time', benefit: 'Digestive rhythm' },
    { id: 'earlyDinner', label: 'Early Dinner', time: 'Before sunset', icon: 'moon', benefit: 'Better sleep' },
  ];

  const seasonalAdvice = [
    {
      season: 'Spring (Vasant)',
      dosha: 'Kapha',
      advice: 'Light diet, detox, vigorous exercise, honey instead of sugar',
      icon: 'flower',
      color: colors.primaryGreen,
    },
    {
      season: 'Summer (Grishma)',
      dosha: 'Pitta',
      advice: 'Cooling foods, sweet fruits, avoid spicy, stay hydrated',
      icon: 'sunny',
      color: colors.warningYellow,
    },
    {
      season: 'Monsoon (Varsha)',
      dosha: 'Vata',
      advice: 'Warm cooked foods, ginger tea, avoid raw vegetables',
      icon: 'rainy',
      color: colors.spO2Blue,
    },
    {
      season: 'Autumn (Sharad)',
      dosha: 'Pitta',
      advice: 'Bitter & sweet tastes, avoid fermented foods, cool environment',
      icon: 'leaf',
      color: colors.tempOrange,
    },
    {
      season: 'Early Winter (Hemant)',
      dosha: 'Vata',
      advice: 'Warm, nourishing foods, oil massage, stay warm',
      icon: 'snow',
      color: colors.stressPurple,
    },
    {
      season: 'Late Winter (Shishir)',
      dosha: 'Kapha',
      advice: 'Warm, light foods, exercise, avoid heavy sweets',
      icon: 'snow',
      color: colors.primarySaffron,
    },
  ];

  const stressReliefTools = [
    {
      id: '1',
      title: 'Pranayama',
      description: '5 min breathing exercise',
      icon: 'leaf',
      color: colors.primaryGreen,
      time: '5 min',
    },
    {
      id: '2',
      title: 'Meditation',
      description: 'Guided mindfulness',
      icon: 'heart',
      color: colors.stressPurple,
      time: '10 min',
    },
    {
      id: '3',
      title: 'Yoga Nidra',
      description: 'Deep relaxation',
      icon: 'moon',
      color: colors.sleepIndigo,
      time: '15 min',
    },
    {
      id: '4',
      title: 'Aromatherapy',
      description: 'Essential oils',
      icon: 'flower',
      color: colors.tempOrange,
      time: 'Ongoing',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.headerTitle}>Lifestyle Guidance</Text>
          <View style={[styles.doshaTag, { backgroundColor: getDoshaColor() }]}>
            <Text style={styles.doshaTagText}>
              {prakriti?.type?.charAt(0).toUpperCase() + prakriti?.type?.slice(1) || 'Balanced'}
            </Text>
          </View>
        </Animated.View>

        {/* Tab Navigation */}
        <Animated.View 
          style={[
            styles.tabContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  selectedTab === tab.id && styles.tabActive,
                ]}
                onPress={() => setSelectedTab(tab.id)}
              >
                <Ionicons 
                  name={tab.icon} 
                  size={20} 
                  color={selectedTab === tab.id ? 'white' : colors.textSecondary} 
                />
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab.id && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Content based on selected tab */}
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Daily Routine (Dinacharya) */}
          {selectedTab === 'daily' && (
            <View>
              {/* Personalized Quote */}
              <View style={styles.quoteCard}>
                <Ionicons name="leaf" size={24} color={colors.primaryGreen} />
                <Text style={styles.quoteText}>
                  {getDoshaRecommendations().routine}
                </Text>
              </View>

              {/* Checklist */}
              <Text style={styles.sectionTitle}>Morning Routine Checklist</Text>
              {dinacharyaItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.checklistItem}
                  onPress={() => setChecklist(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                >
                  <View style={[styles.checkbox, checklist[item.id] && styles.checkboxChecked]}>
                    {checklist[item.id] && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <View style={styles.checklistContent}>
                    <View style={styles.checklistHeader}>
                      <Ionicons name={item.icon} size={16} color={colors.primarySaffron} />
                      <Text style={styles.checklistLabel}>{item.label}</Text>
                      <Text style={styles.checklistTime}>{item.time}</Text>
                    </View>
                    <Text style={styles.checklistBenefit}>{item.benefit}</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Progress */}
              <View style={styles.progressCard}>
                <Text style={styles.progressTitle}>Daily Routine Progress</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${(Object.values(checklist).filter(Boolean).length / 7) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {Object.values(checklist).filter(Boolean).length}/7 completed
                </Text>
              </View>
            </View>
          )}

          {/* Diet Recommendations */}
          {selectedTab === 'diet' && (
            <View>
              {/* Diet Quote */}
              <View style={styles.quoteCard}>
                <Ionicons name="restaurant" size={24} color={colors.primaryGreen} />
                <Text style={styles.quoteText}>
                  {getDoshaRecommendations().diet}
                </Text>
              </View>

              {/* Calorie Calculator Toggle */}
              <TouchableOpacity 
                style={styles.calculatorToggle}
                onPress={() => setShowCalculator(!showCalculator)}
              >
                <Text style={styles.calculatorToggleText}>Calorie Calculator</Text>
                <Ionicons 
                  name={showCalculator ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={colors.primarySaffron} 
                />
              </TouchableOpacity>

              {/* Calorie Calculator */}
              {showCalculator && (
                <View style={styles.calculatorCard}>
                  <Text style={styles.calculatorTitle}>Daily Calorie Tracker</Text>
                  
                  <View style={styles.calorieCircle}>
                    <LinearGradient
                      colors={[colors.primarySaffron, colors.primaryGreen]}
                      style={styles.calorieCircleGradient}
                    >
                      <View style={styles.calorieCircleInner}>
                        <Text style={styles.calorieNumber}>{totalCalories}</Text>
                        <Text style={styles.calorieLabel}>consumed</Text>
                        <Text style={styles.calorieTarget}>target: {targetCalories}</Text>
                      </View>
                    </LinearGradient>
                  </View>

                  <View style={styles.calorieInputs}>
                    <View style={styles.calorieInputRow}>
                      <Text style={styles.calorieInputLabel}>Breakfast</Text>
                      <TextInput
                        style={styles.calorieInput}
                        value={calorieInputs.breakfast.toString()}
                        onChangeText={(text) => setCalorieInputs(prev => ({ ...prev, breakfast: parseInt(text) || 0 }))}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                    <View style={styles.calorieInputRow}>
                      <Text style={styles.calorieInputLabel}>Lunch</Text>
                      <TextInput
                        style={styles.calorieInput}
                        value={calorieInputs.lunch.toString()}
                        onChangeText={(text) => setCalorieInputs(prev => ({ ...prev, lunch: parseInt(text) || 0 }))}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                    <View style={styles.calorieInputRow}>
                      <Text style={styles.calorieInputLabel}>Dinner</Text>
                      <TextInput
                        style={styles.calorieInput}
                        value={calorieInputs.dinner.toString()}
                        onChangeText={(text) => setCalorieInputs(prev => ({ ...prev, dinner: parseInt(text) || 0 }))}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                    <View style={styles.calorieInputRow}>
                      <Text style={styles.calorieInputLabel}>Snacks</Text>
                      <TextInput
                        style={styles.calorieInput}
                        value={calorieInputs.snacks.toString()}
                        onChangeText={(text) => setCalorieInputs(prev => ({ ...prev, snacks: parseInt(text) || 0 }))}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                  </View>

                  <View style={[styles.calorieStatus, { backgroundColor: getCalorieColor() }]}>
                    <Text style={styles.calorieStatusText}>
                      {caloriesRemaining > 0 
                        ? `${caloriesRemaining} calories remaining` 
                        : `${Math.abs(caloriesRemaining)} calories over target`}
                    </Text>
                  </View>
                </View>
              )}

              {/* Meal Suggestions */}
              <Text style={styles.sectionTitle}>Today's Suggestions</Text>
              <View style={styles.mealCard}>
                <Ionicons name="sunny" size={24} color={colors.warningYellow} />
                <View style={styles.mealContent}>
                  <Text style={styles.mealTitle}>Breakfast (7-8 AM)</Text>
                  <Text style={styles.mealSuggestion}>Warm oatmeal with fruits, herbal tea</Text>
                </View>
              </View>
              <View style={styles.mealCard}>
                <Ionicons name="sunny" size={24} color={colors.tempOrange} />
                <View style={styles.mealContent}>
                  <Text style={styles.mealTitle}>Lunch (12-1 PM)</Text>
                  <Text style={styles.mealSuggestion}>Rice, dal, vegetables, salad</Text>
                </View>
              </View>
              <View style={styles.mealCard}>
                <Ionicons name="moon" size={24} color={colors.sleepIndigo} />
                <View style={styles.mealContent}>
                  <Text style={styles.mealTitle}>Dinner (6-7 PM)</Text>
                  <Text style={styles.mealSuggestion}>Light soup, vegetables, quinoa</Text>
                </View>
              </View>
            </View>
          )}

          {/* Seasonal Advice (Ritucharya) */}
          {selectedTab === 'seasonal' && (
            <View>
              <View style={styles.quoteCard}>
                <Ionicons name="leaf" size={24} color={colors.primaryGreen} />
                <Text style={styles.quoteText}>
                  Align your lifestyle with nature's rhythms for optimal health
                </Text>
              </View>

              {seasonalAdvice.map((item, index) => (
                <View key={index} style={[styles.seasonCard, { borderLeftColor: item.color }]}>
                  <View style={styles.seasonHeader}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                    <Text style={styles.seasonTitle}>{item.season}</Text>
                    <View style={[styles.doshaBadge, { backgroundColor: item.color }]}>
                      <Text style={styles.doshaBadgeText}>{item.dosha}</Text>
                    </View>
                  </View>
                  <Text style={styles.seasonAdvice}>{item.advice}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Stress Relief Tools */}
          {selectedTab === 'stress' && (
            <View>
              <View style={styles.quoteCard}>
                <Ionicons name="heart" size={24} color={colors.heartRate} />
                <Text style={styles.quoteText}>
                  {getDoshaRecommendations().exercise}
                </Text>
              </View>

              <Text style={styles.sectionTitle}>Quick Stress Relief</Text>
              <View style={styles.stressGrid}>
                {stressReliefTools.map((tool) => (
                  <TouchableOpacity key={tool.id} style={styles.stressCard}>
                    <View style={[styles.stressIcon, { backgroundColor: `${tool.color}20` }]}>
                      <Ionicons name={tool.icon} size={30} color={tool.color} />
                    </View>
                    <Text style={styles.stressTitle}>{tool.title}</Text>
                    <Text style={styles.stressDescription}>{tool.description}</Text>
                    <View style={styles.stressTime}>
                      <Ionicons name="time" size={12} color={colors.textTertiary} />
                      <Text style={styles.stressTimeText}>{tool.time}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Exercise Suggestions */}
              <Text style={styles.sectionTitle}>Exercise Recommendations</Text>
              <View style={styles.exerciseCard}>
                <Ionicons name="walk" size={24} color={colors.primaryGreen} />
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseTitle}>Walking</Text>
                  <Text style={styles.exerciseDesc}>30 mins, preferably morning</Text>
                </View>
              </View>
              <View style={styles.exerciseCard}>
                <Ionicons name="body" size={24} color={colors.primarySaffron} />
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseTitle}>Yoga</Text>
                  <Text style={styles.exerciseDesc}>Sun salutations, gentle stretches</Text>
                </View>
              </View>
              <View style={styles.exerciseCard}>
                <Ionicons name="fitness" size={24} color={colors.stressPurple} />
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseTitle}>Breathing</Text>
                  <Text style={styles.exerciseDesc}>Pranayama, deep breathing</Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>

        {/* View All Button */}
        <Animated.View 
          style={[
            styles.viewAllButton,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Button
            title="View Complete Guide"
            onPress={() => {}}
            outline
          />
        </Animated.View>
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
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.textPrimary,
  },
  doshaTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  doshaTagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
  },
  tabContainer: {
    marginBottom: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  tabActive: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  tabTextActive: {
    color: 'white',
  },
  content: {
    marginBottom: 20,
  },
  quoteCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  quoteText: {
    flex: 1,
    fontFamily: 'Inter-Italic',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primarySaffron,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primarySaffron,
  },
  checklistContent: {
    flex: 1,
  },
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checklistLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 6,
    flex: 1,
  },
  checklistTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  checklistBenefit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 22,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  progressTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primarySaffron,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  calculatorToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
  },
  calculatorToggleText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  calculatorCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  calculatorTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  calorieCircle: {
    alignItems: 'center',
    marginBottom: 20,
  },
  calorieCircleGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calorieCircleInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calorieNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.textPrimary,
  },
  calorieLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  calorieTarget: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 2,
  },
  calorieInputs: {
    marginBottom: 16,
  },
  calorieInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  calorieInputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
  },
  calorieInput: {
    width: 80,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    textAlign: 'right',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  calorieStatus: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  calorieStatusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  mealContent: {
    flex: 1,
    marginLeft: 12,
  },
  mealTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  mealSuggestion: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  seasonCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  seasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  seasonTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  doshaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  doshaBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: 'white',
  },
  seasonAdvice: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  stressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stressCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  stressIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stressTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  stressDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  stressTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stressTimeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  exerciseContent: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  exerciseDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  viewAllButton: {
    marginTop: 10,
  },
});

export default LifestyleScreen;