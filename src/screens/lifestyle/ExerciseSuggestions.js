import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

const ExerciseSuggestions = () => {
  const navigation = useNavigation();

  const [selectedDosha, setSelectedDosha] = useState('vata');
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const doshas = [
    { id: 'vata', name: 'Vata', color: colors.vata, emoji: '🌬️' },
    { id: 'pitta', name: 'Pitta', color: colors.pitta, emoji: '🔥' },
    { id: 'kapha', name: 'Kapha', color: colors.kapha, emoji: '🌊' },
  ];

  const levels = [
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'cardio', name: 'Cardio', icon: 'heart' },
    { id: 'strength', name: 'Strength', icon: 'barbell' },
    { id: 'flexibility', name: 'Flexibility', icon: 'body' },
    { id: 'yoga', name: 'Yoga', icon: 'leaf' },
  ];

  const exercises = [
    {
      id: '1',
      name: 'Brisk Walking',
      category: 'cardio',
      duration: '30 min',
      calories: '150-200',
      intensity: 'Moderate',
      dosha: ['vata', 'kapha'],
      level: 'beginner',
      image: '🚶',
      description: 'Simple walking at a pace that elevates heart rate',
      benefits: ['Improves circulation', 'Reduces stress', 'Easy on joints'],
    },
    {
      id: '2',
      name: 'Sun Salutations',
      category: 'yoga',
      duration: '15 min',
      calories: '80-100',
      intensity: 'Moderate',
      dosha: ['vata', 'pitta', 'kapha'],
      level: 'beginner',
      image: '🧘',
      description: '12 yoga poses in sequence',
      benefits: ['Full body stretch', 'Energizing', 'Improves flexibility'],
    },
    {
      id: '3',
      name: 'Swimming',
      category: 'cardio',
      duration: '30 min',
      calories: '200-300',
      intensity: 'Moderate',
      dosha: ['pitta', 'kapha'],
      level: 'intermediate',
      image: '🏊',
      description: 'Low-impact full body workout',
      benefits: ['Cooling for Pitta', 'Builds endurance', 'Joint-friendly'],
    },
    {
      id: '4',
      name: 'Weight Training',
      category: 'strength',
      duration: '45 min',
      calories: '250-350',
      intensity: 'High',
      dosha: ['kapha'],
      level: 'intermediate',
      image: '🏋️',
      description: 'Resistance training with weights',
      benefits: ['Builds muscle', 'Increases metabolism', 'Strengthens bones'],
    },
    {
      id: '5',
      name: 'Hatha Yoga',
      category: 'yoga',
      duration: '60 min',
      calories: '150-200',
      intensity: 'Low',
      dosha: ['vata', 'pitta'],
      level: 'beginner',
      image: '🧘',
      description: 'Gentle yoga focusing on poses and breathing',
      benefits: ['Calms Vata', 'Reduces anxiety', 'Improves balance'],
    },
    {
      id: '6',
      name: 'Running',
      category: 'cardio',
      duration: '20 min',
      calories: '200-300',
      intensity: 'High',
      dosha: ['kapha'],
      level: 'advanced',
      image: '🏃',
      description: 'High-intensity running',
      benefits: ['Excellent for Kapha', 'Builds stamina', 'Releases endorphins'],
    },
    {
      id: '7',
      name: 'Pilates',
      category: 'flexibility',
      duration: '45 min',
      calories: '180-250',
      intensity: 'Moderate',
      dosha: ['vata', 'pitta'],
      level: 'intermediate',
      image: '🤸',
      description: 'Core-strengthening and flexibility exercises',
      benefits: ['Core strength', 'Posture improvement', 'Body awareness'],
    },
    {
      id: '8',
      name: 'Cooling Yoga',
      category: 'yoga',
      duration: '30 min',
      calories: '100-150',
      intensity: 'Low',
      dosha: ['pitta'],
      level: 'beginner',
      image: '🧘',
      description: 'Gentle, cooling yoga poses',
      benefits: ['Cools Pitta', 'Reduces inflammation', 'Calming'],
    },
  ];

  const filteredExercises = exercises.filter(exercise => {
    if (selectedCategory !== 'all' && exercise.category !== selectedCategory) return false;
    if (selectedLevel && exercise.level !== selectedLevel) return false;
    if (selectedDosha && !exercise.dosha.includes(selectedDosha)) return false;
    return true;
  });

  const getDoshaRecommendation = () => {
    switch(selectedDosha) {
      case 'vata':
        return 'Gentle, grounding exercises. Avoid overexertion.';
      case 'pitta':
        return 'Cooling, moderate exercise. Avoid midday heat.';
      case 'kapha':
        return 'Vigorous, stimulating exercise. Morning is best.';
      default:
        return '';
    }
  };

  const getIntensityColor = (intensity) => {
    switch(intensity) {
      case 'Low': return colors.successGreen;
      case 'Moderate': return colors.warningYellow;
      case 'High': return colors.alertRed;
      default: return colors.textSecondary;
    }
  };

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
          <Text style={styles.headerTitle}>Exercise Suggestions</Text>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Dosha Selector */}
        <View style={styles.doshaContainer}>
          <Text style={styles.sectionLabel}>Personalize for your dosha</Text>
          <View style={styles.doshaButtons}>
            {doshas.map((dosha) => (
              <TouchableOpacity
                key={dosha.id}
                style={[
                  styles.doshaButton,
                  selectedDosha === dosha.id && { borderColor: dosha.color, borderWidth: 2 }
                ]}
                onPress={() => setSelectedDosha(dosha.id)}
              >
                <Text style={styles.doshaEmoji}>{dosha.emoji}</Text>
                <Text style={[
                  styles.doshaButtonText,
                  selectedDosha === dosha.id && { color: dosha.color }
                ]}>
                  {dosha.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.doshaRecommendation}>{getDoshaRecommendation()}</Text>
        </View>

        {/* Level Selector */}
        <View style={styles.levelContainer}>
          <Text style={styles.sectionLabel}>Your Fitness Level</Text>
          <View style={styles.levelButtons}>
            {levels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelButton,
                  selectedLevel === level.id && styles.levelButtonActive,
                ]}
                onPress={() => setSelectedLevel(level.id)}
              >
                <Text style={[
                  styles.levelButtonText,
                  selectedLevel === level.id && styles.levelButtonTextActive,
                ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.id ? 'white' : colors.textSecondary} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Exercise Count */}
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {filteredExercises.length} exercises found
          </Text>
        </View>

        {/* Exercise List */}
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseEmoji}>{exercise.image}</Text>
              <View style={styles.exerciseHeaderInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.exerciseMeta}>
                  <View style={styles.exerciseMetaItem}>
                    <Ionicons name="time" size={12} color={colors.textTertiary} />
                    <Text style={styles.exerciseMetaText}>{exercise.duration}</Text>
                  </View>
                  <View style={styles.exerciseMetaItem}>
                    <Ionicons name="flame" size={12} color={colors.tempOrange} />
                    <Text style={styles.exerciseMetaText}>{exercise.calories} cal</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.intensityBadge, { backgroundColor: `${getIntensityColor(exercise.intensity)}20` }]}>
                <Text style={[styles.intensityText, { color: getIntensityColor(exercise.intensity) }]}>
                  {exercise.intensity}
                </Text>
              </View>
            </View>

            <Text style={styles.exerciseDescription}>{exercise.description}</Text>

            <View style={styles.benefitsContainer}>
              {exercise.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.successGreen} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.exerciseFooter}>
              <View style={styles.doshaTags}>
                {exercise.dosha.map((d) => (
                  <View 
                    key={d} 
                    style={[
                      styles.doshaTag,
                      { backgroundColor: d === 'vata' ? `${colors.vata}20` : d === 'pitta' ? `${colors.pitta}20` : `${colors.kapha}20` }
                    ]}
                  >
                    <Text style={[
                      styles.doshaTagText,
                      { color: d === 'vata' ? colors.vata : d === 'pitta' ? colors.pitta : colors.kapha }
                    ]}>
                      {d === 'vata' ? '🌬️' : d === 'pitta' ? '🔥' : '🌊'} {d.charAt(0).toUpperCase() + d.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>Start</Text>
                <Ionicons name="play" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        {/* Weekly Plan */}
        <Card style={styles.planCard}>
          <Text style={styles.planTitle}>Recommended Weekly Plan</Text>
          
          <View style={styles.planDay}>
            <Text style={styles.planDayName}>Monday</Text>
            <Text style={styles.planDayExercise}>Brisk Walking (30 min)</Text>
          </View>
          
          <View style={styles.planDay}>
            <Text style={styles.planDayName}>Tuesday</Text>
            <Text style={styles.planDayExercise}>Sun Salutations (15 min)</Text>
          </View>
          
          <View style={styles.planDay}>
            <Text style={styles.planDayName}>Wednesday</Text>
            <Text style={styles.planDayExercise}>Rest Day / Gentle Stretching</Text>
          </View>
          
          <View style={styles.planDay}>
            <Text style={styles.planDayName}>Thursday</Text>
            <Text style={styles.planDayExercise}>Swimming (30 min)</Text>
          </View>
          
          <View style={styles.planDay}>
            <Text style={styles.planDayName}>Friday</Text>
            <Text style={styles.planDayExercise}>Hatha Yoga (45 min)</Text>
          </View>
          
          <View style={styles.planDay}>
            <Text style={styles.planDayName}>Saturday</Text>
            <Text style={styles.planDayExercise}>Weight Training (45 min)</Text>
          </View>
          
          <View style={styles.planDay}>
            <Text style={styles.planDayName}>Sunday</Text>
            <Text style={styles.planDayExercise}>Rest / Light Walking</Text>
          </View>

          <Button
            title="Create My Plan"
            onPress={() => {}}
            style={styles.createPlanButton}
            gradient
          />
        </Card>

        {/* Tips */}
        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={24} color={colors.warningYellow} />
            <Text style={styles.tipsTitle}>Exercise Tips</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="water" size={16} color={colors.spO2Blue} />
            <Text style={styles.tipText}>Stay hydrated before, during, and after exercise</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="fitness" size={16} color={colors.primaryGreen} />
            <Text style={styles.tipText}>Warm up for 5-10 minutes before exercising</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="body" size={16} color={colors.stressPurple} />
            <Text style={styles.tipText}>Listen to your body and rest when needed</Text>
          </View>
        </Card>
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
  favoriteButton: {
    padding: 8,
  },
  doshaContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  doshaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  doshaButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  doshaEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  doshaButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  doshaRecommendation: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  levelContainer: {
    marginBottom: 20,
  },
  levelButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  levelButtonActive: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  levelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  levelButtonTextActive: {
    color: 'white',
  },
  categoryScroll: {
    marginBottom: 15,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  categoryChipActive: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  categoryTextActive: {
    color: 'white',
  },
  countContainer: {
    marginBottom: 15,
  },
  countText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
  },
  exerciseCard: {
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  exerciseEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  exerciseHeaderInfo: {
    flex: 1,
  },
  exerciseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
  },
  exerciseMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseMetaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  intensityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  intensityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
  exerciseDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  benefitsContainer: {
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  doshaTags: {
    flexDirection: 'row',
  },
  doshaTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  doshaTagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySaffron,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'white',
    marginRight: 4,
  },
  planCard: {
    padding: 16,
    marginVertical: 16,
  },
  planTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  planDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  planDayName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  planDayExercise: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  createPlanButton: {
    marginTop: 16,
  },
  tipsCard: {
    padding: 16,
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
});

export default ExerciseSuggestions;