/**
 * Calorie calculation utilities
 */

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @returns {number} BMR in calories
 */
export const calculateBMR = (weight, height, age, gender) => {
  if (!weight || !height || !age || !gender) return null;

  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - Activity level
 * @returns {number} TDEE in calories
 */
export const calculateTDEE = (bmr, activityLevel) => {
  if (!bmr) return null;

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const multiplier = multipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
};

/**
 * Calculate calories for weight loss
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} pace - Weight loss pace ('slow', 'moderate', 'fast')
 * @returns {number} Calorie target for weight loss
 */
export const calculateWeightLossCalories = (tdee, pace = 'moderate') => {
  if (!tdee) return null;

  const deficits = {
    slow: 250,
    moderate: 500,
    fast: 750,
  };

  const deficit = deficits[pace] || 500;
  return Math.max(tdee - deficit, 1200);
};

/**
 * Calculate calories for weight gain
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} pace - Weight gain pace ('slow', 'moderate', 'fast')
 * @returns {number} Calorie target for weight gain
 */
export const calculateWeightGainCalories = (tdee, pace = 'moderate') => {
  if (!tdee) return null;

  surpluses = {
    slow: 250,
    moderate: 500,
    fast: 750,
  };

  const surplus = surpluses[pace] || 500;
  return tdee + surplus;
};

/**
 * Calculate macronutrient distribution
 * @param {number} calories - Total daily calories
 * @param {Object} ratios - Macronutrient ratios (protein, carbs, fat)
 * @returns {Object} Macronutrients in grams
 */
export const calculateMacros = (calories, ratios = { protein: 0.3, carbs: 0.4, fat: 0.3 }) => {
  if (!calories) return null;

  const proteinCalories = calories * ratios.protein;
  const carbsCalories = calories * ratios.carbs;
  const fatCalories = calories * ratios.fat;

  return {
    protein: Math.round(proteinCalories / 4), // 4 cal/g
    carbs: Math.round(carbsCalories / 4),     // 4 cal/g
    fat: Math.round(fatCalories / 9),         // 9 cal/g
    proteinCalories: Math.round(proteinCalories),
    carbsCalories: Math.round(carbsCalories),
    fatCalories: Math.round(fatCalories),
  };
};

/**
 * Calculate calories burned during exercise
 * @param {string} activity - Type of activity
 * @param {number} weight - Weight in kg
 * @param {number} duration - Duration in minutes
 * @returns {number} Calories burned
 */
export const calculateExerciseCalories = (activity, weight, duration) => {
  if (!weight || !duration) return null;

  const metValues = {
    walking: 3.5,
    running: 8,
    cycling: 6,
    swimming: 5,
    yoga: 2.5,
    weightlifting: 3,
    hiking: 5,
    dancing: 4.5,
    elliptical: 4,
    stairs: 6,
  };

  const met = metValues[activity] || 3;
  return Math.round((met * 3.5 * weight * duration) / 200);
};

/**
 * Calculate calories in common foods
 * @param {string} food - Food name
 * @param {number} quantity - Quantity in grams
 * @returns {number} Calories
 */
export const calculateFoodCalories = (food, quantity) => {
  const calorieDensity = {
    rice: 1.3,      // per gram
    chicken: 1.65,
    vegetables: 0.3,
    fruits: 0.5,
    bread: 2.5,
    milk: 0.6,
    egg: 1.5,
    fish: 1.2,
    potato: 0.8,
    pasta: 1.3,
  };

  const density = calorieDensity[food] || 1;
  return Math.round(quantity * density);
};

/**
 * Calculate daily calorie needs based on goals
 * @param {Object} userData - User data
 * @returns {Object} Complete calorie recommendations
 */
export const calculateDailyCalories = (userData) => {
  const { weight, height, age, gender, activityLevel, goal, weightLossPace, weightGainPace } = userData;

  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  let targetCalories;
  let description;

  switch(goal) {
    case 'lose':
      targetCalories = calculateWeightLossCalories(tdee, weightLossPace);
      description = `To lose weight at a ${weightLossPace || 'moderate'} pace`;
      break;
    case 'gain':
      targetCalories = calculateWeightGainCalories(tdee, weightGainPace);
      description = `To gain weight at a ${weightGainPace || 'moderate'} pace`;
      break;
    default:
      targetCalories = tdee;
      description = 'To maintain your current weight';
  }

  const macros = calculateMacros(targetCalories);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    description,
    macros,
    maintenanceCalories: Math.round(tdee),
    weightLossCalories: {
      slow: Math.round(calculateWeightLossCalories(tdee, 'slow')),
      moderate: Math.round(calculateWeightLossCalories(tdee, 'moderate')),
      fast: Math.round(calculateWeightLossCalories(tdee, 'fast')),
    },
    weightGainCalories: {
      slow: Math.round(calculateWeightGainCalories(tdee, 'slow')),
      moderate: Math.round(calculateWeightGainCalories(tdee, 'moderate')),
      fast: Math.round(calculateWeightGainCalories(tdee, 'fast')),
    },
  };
};

/**
 * Calculate meal distribution
 * @param {number} totalCalories - Total daily calories
 * @param {string} mealPattern - Meal pattern (3 meals, 5 small meals, etc.)
 * @returns {Object} Calories per meal
 */
export const calculateMealDistribution = (totalCalories, mealPattern = '3meals') => {
  const patterns = {
    '3meals': {
      breakfast: 0.3,
      lunch: 0.4,
      dinner: 0.3,
    },
    '5meals': {
      breakfast: 0.2,
      snack1: 0.1,
      lunch: 0.3,
      snack2: 0.1,
      dinner: 0.3,
    },
    'intermittent': {
      lunch: 0.5,
      dinner: 0.5,
    },
  };

  const pattern = patterns[mealPattern] || patterns['3meals'];
  const distribution = {};

  for (const [meal, ratio] of Object.entries(pattern)) {
    distribution[meal] = Math.round(totalCalories * ratio);
  }

  return distribution;
};

/**
 * Calculate calories needed to reach goal weight
 * @param {Object} userData - User data
 * @param {number} targetWeight - Target weight in kg
 * @param {number} timeframe - Timeframe in weeks
 * @returns {Object} Calorie adjustment needed
 */
export const calculateWeightChangeCalories = (userData, targetWeight, timeframe) => {
  const { weight, height, age, gender, activityLevel } = userData;
  
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  
  const weightDiff = targetWeight - weight;
  const caloriesNeeded = weightDiff * 7700; // 7700 calories per kg
  
  const dailyAdjustment = Math.round(caloriesNeeded / (timeframe * 7));
  
  return {
    targetCalories: tdee + dailyAdjustment,
    dailyAdjustment,
    timeframe,
    totalCaloriesNeeded: Math.abs(caloriesNeeded),
    direction: weightDiff > 0 ? 'gain' : 'lose',
  };
};

/**
 * Calculate calories burned during daily activities
 * @param {Object} activityLog - Activity log
 * @returns {number} Total calories burned
 */
export const calculateDailyActivityCalories = (activityLog) => {
  let total = 0;

  for (const activity of activityLog) {
    const calories = calculateExerciseCalories(
      activity.type,
      activity.weight,
      activity.duration
    );
    total += calories || 0;
  }

  return total;
};

/**
 * Calculate calorie surplus/deficit for the day
 * @param {number} consumed - Calories consumed
 * @param {number} burned - Calories burned through exercise
 * @param {number} target - Target calories
 * @returns {Object} Surplus/deficit info
 */
export const calculateCalorieBalance = (consumed, burned, target) => {
  const netCalories = consumed - burned;
  const balance = target - netCalories;

  return {
    netCalories,
    balance,
    surplus: balance < 0 ? Math.abs(balance) : 0,
    deficit: balance > 0 ? balance : 0,
    isOnTrack: Math.abs(balance) <= 100,
    message: balance > 0 
      ? `You have ${balance} calories remaining`
      : `You've exceeded your target by ${Math.abs(balance)} calories`,
  };
};

/**
 * Get calorie recommendations based on health goals
 * @param {Object} healthData - User health data
 * @returns {Object} Personalized recommendations
 */
export const getPersonalizedCalorieRecommendations = (healthData) => {
  const { weight, height, age, gender, activityLevel, healthConditions = [] } = healthData;
  
  const baseCalories = calculateDailyCalories({ weight, height, age, gender, activityLevel, goal: 'maintain' });
  
  let adjustedCalories = baseCalories.targetCalories;
  let notes = [];

  // Adjust for health conditions
  if (healthConditions.includes('diabetes')) {
    adjustedCalories = Math.max(adjustedCalories - 200, 1500);
    notes.push('Lower calorie intake recommended for diabetes management');
  }

  if (healthConditions.includes('hypertension')) {
    notes.push('Focus on low-sodium foods');
  }

  if (healthConditions.includes('heartDisease')) {
    notes.push('Emphasize heart-healthy fats and fiber');
  }

  if (healthConditions.includes('thyroid')) {
    adjustedCalories = Math.round(adjustedCalories * 0.9);
    notes.push('Slightly lower calories may be needed due to thyroid condition');
  }

  return {
    ...baseCalories,
    adjustedCalories: Math.round(adjustedCalories),
    notes,
  };
};

export default {
  calculateBMR,
  calculateTDEE,
  calculateWeightLossCalories,
  calculateWeightGainCalories,
  calculateMacros,
  calculateExerciseCalories,
  calculateFoodCalories,
  calculateDailyCalories,
  calculateMealDistribution,
  calculateWeightChangeCalories,
  calculateDailyActivityCalories,
  calculateCalorieBalance,
  getPersonalizedCalorieRecommendations,
};