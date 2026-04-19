/**
 * Ayurvedic Food Recommendation Engine
 *
 * Implements food recommendations based on:
 * - Prakriti (constitution) and Vikriti (imbalance)
 * - Rasa (6 tastes) and their dosha effects
 * - Virya (potency) - heating vs cooling
 * - Guna (qualities) - heavy/light, oily/dry
 * - Ritucharya (seasonal eating)
 * - Agni (digestive fire) type
 * - Viruddha Ahara (incompatible combinations)
 *
 * Reference: Charaka Samhita Sutrasthana Ch. 25-27
 */

/**
 * Score a food item for a specific user based on Ayurvedic principles
 */
function scoreFoodForUser(food, doshaStatus, season, agniType, dietType, symptoms) {
  let score = 0;
  const reasons = [];

  const doshaEffect = food.dosha_effect || {};

  // 1. DOSHA BALANCING (Primary factor - weight: 30%)
  // Principle: Like increases like, opposites balance
  for (const [dosha, effect] of Object.entries(doshaEffect)) {
    const status = doshaStatus[`${dosha}Status`];
    if (status === 'aggravated' && effect < 0) {
      score += 4; // Reduces aggravated dosha - highly beneficial
      reasons.push(`Pacifies aggravated ${capitalize(dosha)}`);
    } else if (status === 'aggravated' && effect > 0) {
      score -= 4; // Increases aggravated dosha - avoid
      reasons.push(`Aggravates ${capitalize(dosha)} further`);
    } else if (status === 'depleted' && effect > 0) {
      score += 2; // Increases depleted dosha - helpful
      reasons.push(`Nourishes depleted ${capitalize(dosha)}`);
    } else if (status === 'depleted' && effect < 0) {
      score -= 1; // Reduces already depleted dosha
    }
  }

  // 2. SEASONAL APPROPRIATENESS (Weight: 20%)
  const foodSeason = (food.best_season || '').toLowerCase();
  const currentSeason = (season?.english || 'Spring').toLowerCase();
  if (foodSeason.includes('all season') || foodSeason.includes(currentSeason)) {
    score += 3;
    reasons.push(`Appropriate for ${season?.english || 'current season'}`);
  } else {
    score -= 2;
    reasons.push(`Not ideal for ${season?.english || 'current season'}`);
  }

  // 3. AGNI COMPATIBILITY (Weight: 15%)
  if (agniType === 'Manda' && food.guna && food.guna.includes('Light')) {
    score += 2;
    reasons.push('Light food suits your sluggish digestion');
  } else if (agniType === 'Manda' && food.guna && food.guna.includes('Heavy')) {
    score -= 2;
    reasons.push('Heavy food may overwhelm sluggish digestion');
  } else if (agniType === 'Tikshna' && food.virya === 'Cool') {
    score += 1;
    reasons.push('Cooling food balances sharp digestion');
  } else if (agniType === 'Vishama') {
    // Vishama needs warm, cooked, slightly oily foods
    if (food.virya === 'Warm' || (food.guna && food.guna.includes('Oily'))) {
      score += 2;
      reasons.push('Warm/oily food stabilizes irregular digestion');
    }
  }

  // 4. DIETARY RESTRICTION CHECK
  if (dietType === 'Vegetarian' && !food.is_vegetarian) {
    return { score: -100, reasons: ['Not suitable for vegetarian diet'], category: 'exclude' };
  }
  if (dietType === 'Vegan' && !food.is_vegan) {
    return { score: -100, reasons: ['Not suitable for vegan diet'], category: 'exclude' };
  }

  // 5. SYMPTOM-SPECIFIC ADJUSTMENTS
  if (symptoms?.digestive_issues) {
    if (food.guna && food.guna.includes('Light')) score += 1;
    if (food.guna && food.guna.includes('Heavy')) score -= 1;
  }
  if (symptoms?.joint_pain && food.virya === 'Warm') {
    score += 1; // Warm virya helps joint pain (Vata)
  }

  // 6. RASA (TASTE) BALANCING
  // Charaka: Each taste has specific dosha effects
  const rasa = food.rasa || '';
  if (doshaStatus.vataStatus === 'aggravated') {
    if (rasa.includes('Sweet') || rasa.includes('Sour') || rasa.includes('Salty')) score += 1;
    if (rasa.includes('Bitter') || rasa.includes('Astringent') || rasa.includes('Pungent')) score -= 1;
  }
  if (doshaStatus.pittaStatus === 'aggravated') {
    if (rasa.includes('Sweet') || rasa.includes('Bitter') || rasa.includes('Astringent')) score += 1;
    if (rasa.includes('Sour') || rasa.includes('Salty') || rasa.includes('Pungent')) score -= 1;
  }
  if (doshaStatus.kaphaStatus === 'aggravated') {
    if (rasa.includes('Pungent') || rasa.includes('Bitter') || rasa.includes('Astringent')) score += 1;
    if (rasa.includes('Sweet') || rasa.includes('Sour') || rasa.includes('Salty')) score -= 1;
  }

  // Categorize
  let category;
  if (score >= 5) category = 'highly_recommended';
  else if (score >= 2) category = 'recommended';
  else if (score >= 0) category = 'moderate';
  else category = 'avoid';

  return { score, reasons: reasons.slice(0, 4), category };
}

/**
 * Generate complete food recommendations for a user
 */
function generateFoodRecommendations(foodDatabase, doshaStatus, season, agniType, dietType, symptoms) {
  const scoredFoods = [];

  for (const food of foodDatabase) {
    const result = scoreFoodForUser(food, doshaStatus, season, agniType, dietType, symptoms);
    if (result.category !== 'exclude') {
      scoredFoods.push({
        ...food,
        score: result.score,
        reasons: result.reasons,
        recommendation_type: result.category
      });
    }
  }

  // Sort by score descending
  scoredFoods.sort((a, b) => b.score - a.score);

  return {
    highly_recommended: scoredFoods.filter(f => f.recommendation_type === 'highly_recommended').slice(0, 15),
    recommended: scoredFoods.filter(f => f.recommendation_type === 'recommended').slice(0, 15),
    moderate: scoredFoods.filter(f => f.recommendation_type === 'moderate').slice(0, 10),
    avoid: scoredFoods.filter(f => f.recommendation_type === 'avoid').slice(0, 10),
    all_scored: scoredFoods
  };
}

/**
 * Generate personalized meal plan based on recommendations
 */
function generateMealPlan(recommendations, doshaStatus, agniType, userData) {
  const highRec = recommendations.highly_recommended || [];
  const rec = recommendations.recommended || [];
  const allGood = [...highRec, ...rec];

  const getByCategory = (cat) => allGood.filter(f => f.category === cat).map(f => f.name);
  const getByTime = (time) => allGood.filter(f => (f.best_time || '').includes(time)).map(f => f.name);

  // Build meal plan following Ayurvedic meal timing principles
  const mealPlan = {
    upon_waking: {
      time: '6:00-6:30 AM',
      items: ['Warm water with lemon', 'Tongue scraping'],
      notes: 'Start the day by kindling Agni. Warm water clears overnight ama.'
    },
    breakfast: {
      time: '7:30-8:30 AM',
      items: getByTime('Breakfast').slice(0, 3),
      notes: agniType === 'Manda'
        ? 'Light breakfast or skip if not hungry. Honey in warm water is sufficient.'
        : 'Moderate breakfast. Include cooked grains and warm beverages.'
    },
    mid_morning: {
      time: '10:00-10:30 AM',
      items: getByCategory('Fruits').slice(0, 2).concat(getByCategory('Nuts').slice(0, 1)),
      notes: 'Light snack if needed. Fruits are best eaten alone or before meals, never after.'
    },
    lunch: {
      time: '12:00-1:00 PM',
      items: [
        ...getByCategory('Grains').slice(0, 1),
        ...getByCategory('Legumes').slice(0, 1),
        ...getByCategory('Vegetables').slice(0, 2),
        ...getByCategory('Spices').slice(0, 2)
      ],
      notes: 'LARGEST MEAL of the day. Agni peaks at noon. Include all 6 tastes. Eat mindfully without distractions.'
    },
    afternoon: {
      time: '3:00-4:00 PM',
      items: getByCategory('Beverages').slice(0, 2),
      notes: 'Vata time - stay grounded. Herbal tea or warm water.'
    },
    dinner: {
      time: '6:00-7:00 PM',
      items: [
        ...getByCategory('Grains').slice(0, 1),
        ...getByCategory('Vegetables').slice(0, 2)
      ],
      notes: 'LIGHTEST meal. Eat at least 3 hours before sleep. Soup or light cooked food preferred.'
    },
    before_bed: {
      time: '9:00-9:30 PM',
      items: ['Warm milk with turmeric and cardamom (if tolerated)', 'Triphala with warm water'],
      notes: 'Golden milk calms Vata and promotes sleep. Triphala gently cleanses.'
    }
  };

  // Dietary guidelines based on dosha
  const guidelines = [];
  if (doshaStatus.vataStatus === 'aggravated') {
    guidelines.push(
      'Eat warm, cooked, moist, and slightly oily foods',
      'Favor sweet, sour, and salty tastes',
      'Never skip meals - regular eating times are medicine for Vata',
      'Use warming spices: ginger, cumin, cinnamon, asafoetida',
      'Avoid raw, cold, dry, and frozen foods'
    );
  }
  if (doshaStatus.pittaStatus === 'aggravated') {
    guidelines.push(
      'Eat cooling and moderately warm foods (not hot)',
      'Favor sweet, bitter, and astringent tastes',
      'Never eat when angry or stressed - calm eating is essential for Pitta',
      'Use cooling spices: coriander, fennel, cardamom, mint',
      'Avoid spicy, sour, salty, fermented foods and alcohol'
    );
  }
  if (doshaStatus.kaphaStatus === 'aggravated') {
    guidelines.push(
      'Eat light, warm, dry, and well-spiced foods',
      'Favor pungent, bitter, and astringent tastes',
      'Eat only when truly hungry - Kapha benefits from occasional fasting',
      'Use stimulating spices: black pepper, ginger, turmeric, mustard',
      'Avoid heavy, oily, cold, sweet, and dairy-rich foods'
    );
  }

  mealPlan.guidelines = guidelines;

  // Protein plan
  const weight = userData?.weight_kg || 65;
  const activityLevel = userData?.physical_activity || 'moderate';
  const proteinMultiplier = activityLevel === 'high' ? 1.2 : activityLevel === 'moderate' ? 1.0 : 0.8;
  const dailyProtein = Math.round(weight * proteinMultiplier);

  mealPlan.protein_target_g = dailyProtein;
  mealPlan.protein_sources = allGood
    .filter(f => f.protein_g > 3)
    .sort((a, b) => b.protein_g - a.protein_g)
    .slice(0, 8)
    .map(f => ({ name: f.name, protein_per_100g: f.protein_g, category: f.category }));

  return mealPlan;
}

/**
 * Check food compatibility (Viruddha Ahara)
 * Based on Charaka Samhita Sutrasthana Ch. 26
 */
function checkFoodCompatibility(foods, viruddhaRules) {
  const incompatiblePairs = [];
  const warnings = [];

  for (let i = 0; i < foods.length; i++) {
    for (let j = i + 1; j < foods.length; j++) {
      const food1 = foods[i].toLowerCase();
      const food2 = foods[j].toLowerCase();

      for (const rule of viruddhaRules) {
        const a = rule.food_a.toLowerCase();
        const b = rule.food_b.toLowerCase();

        if ((food1.includes(a) && food2.includes(b)) || (food1.includes(b) && food2.includes(a))) {
          incompatiblePairs.push({
            food1: foods[i],
            food2: foods[j],
            type: rule.incompatibility_type,
            severity: rule.severity,
            explanation: rule.explanation,
            reference: rule.reference_text
          });
        }
      }
    }
  }

  // Time-based checks
  const currentHour = new Date().getHours();
  for (const food of foods) {
    const fl = food.toLowerCase();
    if (fl.includes('yogurt') && (currentHour >= 18 || currentHour < 6)) {
      warnings.push({
        food,
        warning: 'Yogurt should not be consumed at night (after sunset). It increases Kapha and blocks channels.',
        severity: 'moderate'
      });
    }
    if (fl.includes('banana') && currentHour >= 19) {
      warnings.push({
        food,
        warning: 'Banana at night increases Kapha and can cause congestion. Best consumed in morning.',
        severity: 'mild'
      });
    }
  }

  return {
    isCompatible: incompatiblePairs.length === 0 && warnings.length === 0,
    incompatiblePairs,
    warnings,
    recommendation: incompatiblePairs.length > 0
      ? 'These foods should not be consumed together. Separate by at least 2 hours.'
      : warnings.length > 0
        ? 'Consider the timing warnings for optimal digestion.'
        : 'This food combination is compatible per Ayurvedic principles.'
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  scoreFoodForUser,
  generateFoodRecommendations,
  generateMealPlan,
  checkFoodCompatibility
};
