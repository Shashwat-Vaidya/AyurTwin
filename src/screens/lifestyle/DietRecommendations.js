import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const DietRecommendations = () => {
  const navigation = useNavigation();

  // State for selected dosha
  const [selectedDosha, setSelectedDosha] = useState('vata'); // vata, pitta, kapha
  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  // Get dosha color
  const getDoshaColor = () => {
    switch(selectedDosha) {
      case 'vata': return colors.vata;
      case 'pitta': return colors.pitta;
      case 'kapha': return colors.kapha;
      default: return colors.primarySaffron;
    }
  };

  // Dosha diet guidelines
  const doshaGuidelines = {
    vata: {
      qualities: 'Dry, light, cold, rough',
      imbalance: 'Gas, bloating, anxiety, dry skin',
      diet: 'Warm, moist, grounding, oily',
      avoid: 'Cold, dry, raw, carbonated drinks',
      tastes: 'Sweet, sour, salty',
      reduce: 'Pungent, bitter, astringent',
    },
    pitta: {
      qualities: 'Hot, sharp, oily, light',
      imbalance: 'Acidity, inflammation, anger, rashes',
      diet: 'Cool, refreshing, moderate',
      avoid: 'Spicy, oily, fermented, caffeine',
      tastes: 'Sweet, bitter, astringent',
      reduce: 'Pungent, sour, salty',
    },
    kapha: {
      qualities: 'Heavy, cold, oily, slow',
      imbalance: 'Congestion, lethargy, weight gain',
      diet: 'Light, warm, dry, stimulating',
      avoid: 'Heavy, oily, sweet, cold',
      tastes: 'Pungent, bitter, astringent',
      reduce: 'Sweet, sour, salty',
    },
  };

  // Meal recommendations
  const meals = {
    breakfast: {
      vata: ['Warm oatmeal with ghee', 'Cream of rice', 'Warm spiced milk', 'Cooked apples'],
      pitta: ['Coconut rice', 'Sweet fruits', 'Barley cereal', 'Cool smoothies'],
      kapha: ['Quinoa porridge', 'Apple compote', 'Herbal tea', 'Light millet'],
    },
    lunch: {
      vata: ['Warm soups', 'Steamed vegetables', 'Basmati rice', 'Mung dal'],
      pitta: ['Salads', 'Cucumber raita', 'Basmati rice', 'Zucchini dishes'],
      kapha: ['Steamed greens', 'Quinoa', 'Lentil soup', 'Light curries'],
    },
    dinner: {
      vata: ['Kitchari', 'Stewed vegetables', 'Warm soups', 'Mashed root veggies'],
      pitta: ['Light soups', 'Steamed veggies', 'Couscous', 'Fresh salads'],
      kapha: ['Vegetable broth', 'Steamed greens', 'Light grains', 'Spiced lentils'],
    },
    snacks: {
      vata: ['Dates', 'Warm nuts', 'Banana', 'Warm milk'],
      pitta: ['Sweet fruits', 'Coconut water', 'Cool smoothies', 'Mint tea'],
      kapha: ['Apple slices', 'Roasted seeds', 'Ginger tea', 'Air-popped popcorn'],
    },
  };

  // Foods to favor
  const foodsToFavor = {
    vata: [
      { name: 'Cooked vegetables', icon: 'leaf' },
      { name: 'Warm soups', icon: 'restaurant' },
      { name: 'Basmati rice', icon: 'nutrition' },
      { name: 'Ghee', icon: 'water' },
      { name: 'Bananas', icon: 'fruit' },
      { name: 'Almonds', icon: 'nutrition' },
    ],
    pitta: [
      { name: 'Cucumber', icon: 'leaf' },
      { name: 'Coconut', icon: 'nutrition' },
      { name: 'Sweet fruits', icon: 'fruit' },
      { name: 'Cilantro', icon: 'leaf' },
      { name: 'Mint', icon: 'leaf' },
      { name: 'Zucchini', icon: 'nutrition' },
    ],
    kapha: [
      { name: 'Leafy greens', icon: 'leaf' },
      { name: 'Apples', icon: 'fruit' },
      { name: 'Quinoa', icon: 'nutrition' },
      { name: 'Ginger', icon: 'flame' },
      { name: 'Honey', icon: 'water' },
      { name: 'Pomegranate', icon: 'fruit' },
    ],
  };

  // Foods to avoid
  const foodsToAvoid = {
    vata: [
      { name: 'Raw vegetables', icon: 'leaf' },
      { name: 'Cold drinks', icon: 'water' },
      { name: 'Dry snacks', icon: 'nutrition' },
      { name: 'Carbonated drinks', icon: 'wine' },
    ],
    pitta: [
      { name: 'Spicy food', icon: 'flame' },
      { name: 'Fermented foods', icon: 'nutrition' },
      { name: 'Caffeine', icon: 'cafe' },
      { name: 'Oily foods', icon: 'water' },
    ],
    kapha: [
      { name: 'Dairy', icon: 'nutrition' },
      { name: 'Fried foods', icon: 'restaurant' },
      { name: 'Bread', icon: 'nutrition' },
      { name: 'Sweets', icon: 'ice-cream' },
    ],
  };

  // Daily meal plan
  const mealPlan = [
    { time: '7:00 AM', meal: 'Breakfast', items: meals.breakfast[selectedDosha] },
    { time: '12:00 PM', meal: 'Lunch', items: meals.lunch[selectedDosha] },
    { time: '4:00 PM', meal: 'Snack', items: meals.snacks[selectedDosha] },
    { time: '7:00 PM', meal: 'Dinner', items: meals.dinner[selectedDosha] },
  ];

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
          <Text style={styles.headerTitle}>Diet Recommendations</Text>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Ionicons name="bookmark-outline" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Dosha Selector */}
        <Card style={styles.doshaCard}>
          <Text style={styles.doshaCardTitle}>Personalize for your dosha</Text>
          <View style={styles.doshaButtons}>
            {['vata', 'pitta', 'kapha'].map((dosha) => (
              <TouchableOpacity
                key={dosha}
                style={[
                  styles.doshaButton,
                  selectedDosha === dosha && styles.doshaButtonActive,
                  { borderColor: selectedDosha === dosha ? getDoshaColor() : colors.textTertiary }
                ]}
                onPress={() => setSelectedDosha(dosha)}
              >
                <Text style={[
                  styles.doshaButtonText,
                  selectedDosha === dosha && { color: getDoshaColor() }
                ]}>
                  {dosha.charAt(0).toUpperCase() + dosha.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Dosha Guidelines */}
        <LinearGradient
          colors={[getDoshaColor(), `${getDoshaColor()}CC`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.guidelineCard}
        >
          <Text style={styles.guidelineTitle}>
            {selectedDosha.charAt(0).toUpperCase() + selectedDosha.slice(1)} Diet Guidelines
          </Text>
          
          <View style={styles.guidelineRow}>
            <Ionicons name="thermometer" size={20} color="white" />
            <Text style={styles.guidelineText}>
              Qualities: {doshaGuidelines[selectedDosha].qualities}
            </Text>
          </View>
          
          <View style={styles.guidelineRow}>
            <Ionicons name="alert-circle" size={20} color="white" />
            <Text style={styles.guidelineText}>
              Imbalance signs: {doshaGuidelines[selectedDosha].imbalance}
            </Text>
          </View>
          
          <View style={styles.guidelineRow}>
            <Ionicons name="restaurant" size={20} color="white" />
            <Text style={styles.guidelineText}>
              Best diet: {doshaGuidelines[selectedDosha].diet}
            </Text>
          </View>
          
          <View style={styles.guidelineRow}>
            <Ionicons name="close-circle" size={20} color="white" />
            <Text style={styles.guidelineText}>
              Avoid: {doshaGuidelines[selectedDosha].avoid}
            </Text>
          </View>
        </LinearGradient>

        {/* Six Tastes */}
        <Card style={styles.tastesCard}>
          <Text style={styles.tastesTitle}>The Six Tastes</Text>
          <View style={styles.tasteGrid}>
            <View style={[styles.tasteItem, { backgroundColor: `${colors.successGreen}20` }]}>
              <Text style={styles.tasteName}>Sweet</Text>
              <Text style={styles.tasteEffect}>Builds tissues</Text>
            </View>
            <View style={[styles.tasteItem, { backgroundColor: `${colors.primaryGreen}20` }]}>
              <Text style={styles.tasteName}>Sour</Text>
              <Text style={styles.tasteEffect}>Stimulates</Text>
            </View>
            <View style={[styles.tasteItem, { backgroundColor: `${colors.tempOrange}20` }]}>
              <Text style={styles.tasteName}>Salty</Text>
              <Text style={styles.tasteEffect}>Retains water</Text>
            </View>
            <View style={[styles.tasteItem, { backgroundColor: `${colors.alertRed}20` }]}>
              <Text style={styles.tasteName}>Pungent</Text>
              <Text style={styles.tasteEffect}>Digestive</Text>
            </View>
            <View style={[styles.tasteItem, { backgroundColor: `${colors.stressPurple}20` }]}>
              <Text style={styles.tasteName}>Bitter</Text>
              <Text style={styles.tasteEffect}>Detoxifying</Text>
            </View>
            <View style={[styles.tasteItem, { backgroundColor: `${colors.spO2Blue}20` }]}>
              <Text style={styles.tasteName}>Astringent</Text>
              <Text style={styles.tasteEffect}>Absorbs water</Text>
            </View>
          </View>
          <Text style={styles.tasteRecommendation}>
            <Text style={styles.bold}>Favor: </Text>
            {doshaGuidelines[selectedDosha].tastes}
          </Text>
          <Text style={styles.tasteRecommendation}>
            <Text style={styles.bold}>Reduce: </Text>
            {doshaGuidelines[selectedDosha].reduce}
          </Text>
        </Card>

        {/* Daily Meal Plan */}
        <Text style={styles.sectionTitle}>Today's Meal Plan</Text>
        
        <View style={styles.mealTabs}>
          {['breakfast', 'lunch', 'snacks', 'dinner'].map((meal) => (
            <TouchableOpacity
              key={meal}
              style={[
                styles.mealTab,
                selectedMeal === meal && styles.mealTabActive,
              ]}
              onPress={() => setSelectedMeal(meal)}
            >
              <Text style={[
                styles.mealTabText,
                selectedMeal === meal && styles.mealTabTextActive,
              ]}>
                {meal.charAt(0).toUpperCase() + meal.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.mealCard}>
          <View style={styles.mealHeader}>
            <Ionicons name="restaurant" size={24} color={getDoshaColor()} />
            <Text style={styles.mealTitle}>
              {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)} Suggestions
            </Text>
          </View>
          
          {meals[selectedMeal][selectedDosha].map((item, index) => (
            <View key={index} style={styles.mealItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.successGreen} />
              <Text style={styles.mealItemText}>{item}</Text>
            </View>
          ))}
        </Card>

        {/* Foods to Favor */}
        <Text style={styles.sectionTitle}>Foods to Favor</Text>
        <Card style={styles.foodsCard}>
          <View style={styles.foodsGrid}>
            {foodsToFavor[selectedDosha].map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <View style={[styles.foodIcon, { backgroundColor: `${getDoshaColor()}20` }]}>
                  <Ionicons name={food.icon} size={24} color={getDoshaColor()} />
                </View>
                <Text style={styles.foodName}>{food.name}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Foods to Avoid */}
        <Text style={styles.sectionTitle}>Foods to Avoid</Text>
        <Card style={[styles.foodsCard, styles.avoidCard]}>
          <View style={styles.foodsGrid}>
            {foodsToAvoid[selectedDosha].map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <View style={[styles.foodIcon, { backgroundColor: `${colors.alertRed}20` }]}>
                  <Ionicons name={food.icon} size={24} color={colors.alertRed} />
                </View>
                <Text style={styles.foodName}>{food.name}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Meal Timing */}
        <Card style={styles.timingCard}>
          <Text style={styles.timingTitle}>Optimal Meal Times</Text>
          {mealPlan.map((meal, index) => (
            <View key={index} style={styles.timingItem}>
              <View style={styles.timingLeft}>
                <Text style={styles.timingTime}>{meal.time}</Text>
                <Text style={styles.timingMeal}>{meal.meal}</Text>
              </View>
              <View style={styles.timingDots}>
                {meal.items.map((_, i) => (
                  <View key={i} style={styles.timingDot} />
                ))}
              </View>
            </View>
          ))}
        </Card>

        {/* Ayurvedic Tip */}
        <Card style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color={colors.warningYellow} />
          <Text style={styles.tipText}>
            Eat your largest meal at noon when digestive fire (Agni) is strongest.
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Create Meal Plan"
            onPress={() => Alert.alert('Coming Soon', 'Personalized meal planner coming soon!')}
            style={styles.planButton}
            gradient
          />
          <Button
            title="Recipes"
            onPress={() => {}}
            style={styles.recipesButton}
            outline
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
  bookmarkButton: {
    padding: 8,
  },
  doshaCard: {
    padding: 16,
    marginBottom: 16,
  },
  doshaCardTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  doshaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  doshaButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  doshaButtonActive: {
    backgroundColor: 'white',
    borderWidth: 2,
  },
  doshaButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  guidelineCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  guidelineTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
    marginBottom: 16,
  },
  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  guidelineText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    marginLeft: 12,
    lineHeight: 20,
  },
  tastesCard: {
    padding: 16,
    marginBottom: 16,
  },
  tastesTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  tasteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tasteItem: {
    width: '30%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  tasteName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  tasteEffect: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  tasteRecommendation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  bold: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  mealTabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mealTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  mealTabActive: {
    borderBottomColor: colors.primarySaffron,
  },
  mealTabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  mealTabTextActive: {
    color: colors.primarySaffron,
  },
  mealCard: {
    padding: 16,
    marginBottom: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  mealTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textSecondary,
    marginLeft: 10,
  },
  foodsCard: {
    padding: 16,
    marginBottom: 16,
  },
  avoidCard: {
    backgroundColor: 'rgba(255, 90, 95, 0.02)',
  },
  foodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  foodItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  foodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodName: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  timingCard: {
    padding: 16,
    marginBottom: 16,
  },
  timingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  timingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timingLeft: {
    width: 100,
  },
  timingTime: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  timingMeal: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  timingDots: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  timingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primarySaffron,
    marginLeft: 4,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.warningYellow,
    marginLeft: 12,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  planButton: {
    flex: 1,
    marginRight: 8,
  },
  recipesButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default DietRecommendations;