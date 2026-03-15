import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const RecipesScreen = () => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDosha, setSelectedDosha] = useState('all');
  const [favorites, setFavorites] = useState([]);

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'breakfast', name: 'Breakfast', icon: 'sunny' },
    { id: 'lunch', name: 'Lunch', icon: 'restaurant' },
    { id: 'dinner', name: 'Dinner', icon: 'moon' },
    { id: 'snacks', name: 'Snacks', icon: 'cafe' },
    { id: 'desserts', name: 'Desserts', icon: 'ice-cream' },
  ];

  const doshas = [
    { id: 'all', name: 'All Doshas', color: colors.textSecondary },
    { id: 'vata', name: 'Vata', color: colors.vata },
    { id: 'pitta', name: 'Pitta', color: colors.pitta },
    { id: 'kapha', name: 'Kapha', color: colors.kapha },
  ];

  const recipes = [
    {
      id: '1',
      title: 'Warming Oatmeal with Ghee',
      description: 'A grounding breakfast perfect for Vata dosha',
      category: 'breakfast',
      dosha: ['vata'],
      time: 15,
      difficulty: 'Easy',
      image: '🥣',
      color: colors.vata,
      ingredients: ['Rolled oats', 'Ghee', 'Cinnamon', 'Almond milk', 'Maple syrup'],
      instructions: [
        'Cook oats with almond milk',
        'Stir in ghee and cinnamon',
        'Top with maple syrup',
      ],
      calories: 320,
      protein: 8,
      carbs: 45,
      fat: 12,
      favorite: false,
    },
    {
      id: '2',
      title: 'Cooling Cucumber Salad',
      description: 'Refreshing salad to balance Pitta dosha',
      category: 'lunch',
      dosha: ['pitta'],
      time: 10,
      difficulty: 'Easy',
      image: '🥗',
      color: colors.pitta,
      ingredients: ['Cucumber', 'Mint', 'Cilantro', 'Lime juice', 'Coconut yogurt'],
      instructions: [
        'Slice cucumber thinly',
        'Chop fresh herbs',
        'Mix with lime juice and yogurt',
      ],
      calories: 120,
      protein: 3,
      carbs: 15,
      fat: 6,
      favorite: true,
    },
    {
      id: '3',
      title: 'Energizing Quinoa Bowl',
      description: 'Light yet satisfying meal for Kapha dosha',
      category: 'lunch',
      dosha: ['kapha'],
      time: 25,
      difficulty: 'Medium',
      image: '🥙',
      color: colors.kapha,
      ingredients: ['Quinoa', 'Roasted vegetables', 'Lemon', 'Fresh herbs', 'Olive oil'],
      instructions: [
        'Cook quinoa',
        'Roast vegetables',
        'Combine with lemon and herbs',
      ],
      calories: 380,
      protein: 12,
      carbs: 52,
      fat: 14,
      favorite: false,
    },
    {
      id: '4',
      title: 'Tridoshic Kitchari',
      description: 'Balancing meal for all doshas',
      category: 'dinner',
      dosha: ['vata', 'pitta', 'kapha'],
      time: 40,
      difficulty: 'Medium',
      image: '🍚',
      color: colors.primaryGreen,
      ingredients: ['Basmati rice', 'Mung dal', 'Ghee', 'Cumin', 'Coriander', 'Ginger'],
      instructions: [
        'Wash rice and dal',
        'Cook with spices and ghee',
        'Simmer until soft',
      ],
      calories: 420,
      protein: 15,
      carbs: 65,
      fat: 10,
      favorite: true,
    },
    {
      id: '5',
      title: 'Golden Milk Latte',
      description: 'Warm turmeric drink for evening',
      category: 'drinks',
      dosha: ['vata', 'kapha'],
      time: 5,
      difficulty: 'Easy',
      image: '🥛',
      color: colors.warningYellow,
      ingredients: ['Almond milk', 'Turmeric', 'Ginger', 'Cinnamon', 'Honey'],
      instructions: [
        'Warm milk',
        'Add spices',
        'Sweeten with honey',
      ],
      calories: 150,
      protein: 3,
      carbs: 12,
      fat: 8,
      favorite: false,
    },
    {
      id: '6',
      title: 'Spiced Apple Compote',
      description: 'Warming dessert for Vata balance',
      category: 'desserts',
      dosha: ['vata'],
      time: 20,
      difficulty: 'Easy',
      image: '🍎',
      color: colors.heartRate,
      ingredients: ['Apples', 'Cinnamon', 'Cardamom', 'Ghee', 'Dates'],
      instructions: [
        'Chop apples',
        'Cook with spices and ghee',
        'Sweeten with dates',
      ],
      calories: 180,
      protein: 1,
      carbs: 35,
      fat: 5,
      favorite: true,
    },
    {
      id: '7',
      title: 'Mung Bean Soup',
      description: 'Light and easy to digest',
      category: 'dinner',
      dosha: ['pitta', 'kapha'],
      time: 30,
      difficulty: 'Easy',
      image: '🥣',
      color: colors.spO2Blue,
      ingredients: ['Mung beans', 'Cumin', 'Coriander', 'Turmeric', 'Ghee'],
      instructions: [
        'Cook mung beans',
        'Add spices',
        'Simmer until creamy',
      ],
      calories: 250,
      protein: 14,
      carbs: 38,
      fat: 6,
      favorite: false,
    },
    {
      id: '8',
      title: 'Roasted Root Vegetables',
      description: 'Grounding side dish for Vata',
      category: 'sides',
      dosha: ['vata'],
      time: 35,
      difficulty: 'Easy',
      image: '🥕',
      color: colors.tempOrange,
      ingredients: ['Carrots', 'Sweet potatoes', 'Parsnips', 'Olive oil', 'Rosemary'],
      instructions: [
        'Chop vegetables',
        'Toss with oil and herbs',
        'Roast until tender',
      ],
      calories: 220,
      protein: 3,
      carbs: 35,
      fat: 9,
      favorite: false,
    },
  ];

  const filteredRecipes = recipes.filter(recipe => {
    if (searchQuery && !recipe.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'all' && recipe.category !== selectedCategory) {
      return false;
    }
    if (selectedDosha !== 'all' && !recipe.dosha.includes(selectedDosha)) {
      return false;
    }
    return true;
  });

  const toggleFavorite = (recipeId) => {
    setFavorites(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
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
          <Text style={styles.headerTitle}>Ayurvedic Recipes</Text>
          <TouchableOpacity style={styles.favoritesButton}>
            <Ionicons name="heart" size={24} color={colors.heartRate} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
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

        {/* Dosha Filter */}
        <View style={styles.doshaFilter}>
          <Text style={styles.filterLabel}>Filter by Dosha:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {doshas.map((dosha) => (
              <TouchableOpacity
                key={dosha.id}
                style={[
                  styles.doshaChip,
                  selectedDosha === dosha.id && styles.doshaChipActive,
                  selectedDosha === dosha.id && { backgroundColor: dosha.color },
                ]}
                onPress={() => setSelectedDosha(dosha.id)}
              >
                <Text style={[
                  styles.doshaChipText,
                  selectedDosha === dosha.id && styles.doshaChipTextActive,
                ]}>
                  {dosha.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results Count */}
        <Text style={styles.resultsText}>
          {filteredRecipes.length} recipes found
        </Text>

        {/* Recipes Grid */}
        <View style={styles.recipesGrid}>
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} style={styles.recipeCard}>
              <TouchableOpacity 
                style={styles.favoriteIcon}
                onPress={() => toggleFavorite(recipe.id)}
              >
                <Ionicons 
                  name={favorites.includes(recipe.id) ? 'heart' : 'heart-outline'} 
                  size={20} 
                  color={favorites.includes(recipe.id) ? colors.heartRate : colors.textTertiary} 
                />
              </TouchableOpacity>

              <LinearGradient
                colors={[recipe.color, `${recipe.color}CC`]}
                style={styles.recipeImage}
              >
                <Text style={styles.recipeEmoji}>{recipe.image}</Text>
              </LinearGradient>

              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeDescription} numberOfLines={2}>
                  {recipe.description}
                </Text>

                <View style={styles.recipeMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time" size={14} color={colors.textTertiary} />
                    <Text style={styles.metaText}>{recipe.time} min</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="flame" size={14} color={colors.textTertiary} />
                    <Text style={styles.metaText}>{recipe.calories} cal</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="fitness" size={14} color={colors.textTertiary} />
                    <Text style={styles.metaText}>{recipe.difficulty}</Text>
                  </View>
                </View>

                <View style={styles.doshaTags}>
                  {recipe.dosha.map((d) => (
                    <View 
                      key={d} 
                      style={[
                        styles.doshaTag,
                        { backgroundColor: d === 'vata' ? `${colors.vata}20` : 
                          d === 'pitta' ? `${colors.pitta}20` : 
                          `${colors.kapha}20` }
                      ]}
                    >
                      <Text style={[
                        styles.doshaTagText,
                        { color: d === 'vata' ? colors.vata : 
                          d === 'pitta' ? colors.pitta : 
                          colors.kapha }
                      ]}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.viewRecipeButton}>
                  <Text style={styles.viewRecipeText}>View Recipe</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>

        {/* Featured Recipe */}
        <Card style={styles.featuredCard}>
          <LinearGradient
            colors={[colors.primaryGreen, colors.primarySaffron]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featuredGradient}
          >
            <Text style={styles.featuredLabel}>Recipe of the Day</Text>
            <Text style={styles.featuredTitle}>Tridoshic Kitchari</Text>
            <Text style={styles.featuredDescription}>
              A perfectly balanced meal for all doshas. Easy to digest and nourishing.
            </Text>
            <TouchableOpacity style={styles.featuredButton}>
              <Text style={styles.featuredButtonText}>Get Recipe</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Card>

        {/* Meal Planning */}
        <Card style={styles.planCard}>
          <Text style={styles.planTitle}>Meal Planning</Text>
          <Text style={styles.planText}>
            Create a personalized meal plan based on your dosha and dietary preferences.
          </Text>
          <Button
            title="Create Meal Plan"
            onPress={() => {}}
            style={styles.planButton}
            gradient
          />
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
  favoritesButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 8,
    marginRight: 8,
  },
  categoryScroll: {
    marginBottom: 16,
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
  doshaFilter: {
    marginBottom: 16,
  },
  filterLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  doshaChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    backgroundColor: 'white',
  },
  doshaChipActive: {
    borderColor: 'transparent',
  },
  doshaChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  doshaChipTextActive: {
    color: 'white',
  },
  resultsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 16,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recipeCard: {
    width: '48%',
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeImage: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeEmoji: {
    fontSize: 40,
  },
  recipeContent: {
    padding: 12,
  },
  recipeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  recipeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 8,
    lineHeight: 16,
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    marginLeft: 2,
  },
  doshaTags: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  doshaTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  doshaTagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 9,
  },
  viewRecipeButton: {
    backgroundColor: colors.primarySaffron,
    paddingVertical: 6,
    borderRadius: 15,
    alignItems: 'center',
  },
  viewRecipeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: 'white',
  },
  featuredCard: {
    marginTop: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  featuredGradient: {
    padding: 20,
  },
  featuredLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    marginBottom: 8,
  },
  featuredTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: 'white',
    marginBottom: 6,
  },
  featuredDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 20,
  },
  featuredButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  featuredButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'white',
  },
  planCard: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
  },
  planTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  planText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  planButton: {
    marginBottom: 8,
  },
});

export default RecipesScreen;