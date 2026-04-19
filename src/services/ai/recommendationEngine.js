import doshaCalculator from './doshaCalculator';
import diseasePrediction from './diseasePrediction';

class RecommendationEngine {
  constructor() {
    this.recommendationCache = new Map();
    this.lastUserState = null;
  }

  // Get personalized recommendations based on user data
  async getPersonalizedRecommendations(userData) {
    try {
      const recommendations = {
        diet: await this.getDietRecommendations(userData),
        exercise: this.getExerciseRecommendations(userData),
        lifestyle: this.getLifestyleRecommendations(userData),
        wellness: this.getWellnessRecommendations(userData),
        ayurveda: this.getAyurvedaRecommendations(userData),
        preventive: await this.getPreventiveRecommendations(userData),
      };

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return this.getFallbackRecommendations();
    }
  }

  // Diet recommendations
  async getDietRecommendations(userData) {
    const recommendations = [];
    const dosha = userData.prakriti?.dominant || 'vata';
    const doshaDiet = doshaCalculator.getDietaryRecommendations(dosha);

    // Base recommendations from dosha
    recommendations.push({
      category: 'dosha_based',
      title: `${dosha.charAt(0).toUpperCase() + dosha.slice(1)} Diet Guidelines`,
      suggestions: doshaDiet.favor,
      avoid: doshaDiet.avoid,
      priority: 'high',
    });

    // Calorie-based recommendations
    if (userData.calorieTarget) {
      const remainingCalories = userData.calorieTarget - (userData.consumedCalories || 0);
      
      if (remainingCalories < 0) {
        recommendations.push({
          category: 'calorie_alert',
          title: 'Calorie Limit Exceeded',
          message: 'You have exceeded your daily calorie target. Consider lighter meals for the rest of the day.',
          priority: 'medium',
        });
      } else if (remainingCalories < 300) {
        recommendations.push({
          category: 'calorie_suggestion',
          title: 'Light Dinner Suggested',
          message: `You have ${remainingCalories} calories remaining. Opt for a light dinner.`,
          priority: 'medium',
        });
      }
    }

    // Health condition-based recommendations
    if (userData.healthConditions) {
      if (userData.healthConditions.includes('diabetes')) {
        recommendations.push({
          category: 'condition_based',
          title: 'Diabetes-Friendly Diet',
          suggestions: [
            'Choose low-glycemic index foods',
            'Eat regular meals to maintain blood sugar',
            'Include protein with each meal',
            'Limit refined carbohydrates',
          ],
          priority: 'high',
        });
      }

      if (userData.healthConditions.includes('hypertension')) {
        recommendations.push({
          category: 'condition_based',
          title: 'Heart-Healthy Diet',
          suggestions: [
            'Reduce sodium intake',
            'Increase potassium-rich foods',
            'Choose lean proteins',
            'Limit processed foods',
          ],
          priority: 'high',
        });
      }
    }

    // Seasonal recommendations
    const season = this.getCurrentSeason();
    const seasonalDiet = doshaCalculator.getSeasonalRecommendations(dosha, season);
    
    recommendations.push({
      category: 'seasonal',
      title: `${season.charAt(0).toUpperCase() + season.slice(1)} Diet Tips`,
      message: seasonalDiet,
      priority: 'medium',
    });

    return recommendations;
  }

  // Exercise recommendations
  getExerciseRecommendations(userData) {
    const recommendations = [];
    const dosha = userData.prakriti?.dominant || 'vata';
    const activityLevel = userData.lifestyle?.physicalActivity || 'moderate';
    const age = userData.age || 30;

    // Dosha-based exercise
    const doshaExercises = {
      vata: {
        type: 'Gentle & Grounding',
        suggestions: [
          'Yoga (slow flow)',
          'Walking',
          'Swimming',
          'Tai Chi',
          'Light stretching',
        ],
        duration: '30-45 minutes',
        intensity: 'Low to moderate',
        bestTime: 'Morning',
      },
      pitta: {
        type: 'Moderate & Cooling',
        suggestions: [
          'Swimming',
          'Cycling',
          'Hiking',
          'Tennis',
          'Moderate yoga',
        ],
        duration: '45-60 minutes',
        intensity: 'Moderate',
        bestTime: 'Early morning or evening',
      },
      kapha: {
        type: 'Vigorous & Stimulating',
        suggestions: [
          'Running',
          'HIIT',
          'Weight training',
          'Dance',
          'Power yoga',
        ],
        duration: '60-90 minutes',
        intensity: 'High',
        bestTime: 'Morning',
      },
    };

    recommendations.push({
      category: 'dosha_based',
      title: `${dosha.charAt(0).toUpperCase() + dosha.slice(1)} Exercise Plan`,
      ...doshaExercises[dosha],
      priority: 'high',
    });

    // Activity level adjustments
    if (activityLevel === 'sedentary') {
      recommendations.push({
        category: 'activity_alert',
        title: 'Increase Daily Movement',
        message: 'Try to incorporate more movement throughout your day. Start with short walks after meals.',
        suggestions: [
          'Take stairs instead of elevator',
          'Stand while on phone calls',
          'Short walks every 2 hours',
          'Desk stretches',
        ],
        priority: 'high',
      });
    }

    // Age-based recommendations
    if (age > 50) {
      recommendations.push({
        category: 'age_based',
        title: 'Senior-Friendly Exercise',
        suggestions: [
          'Low-impact activities',
          'Balance exercises',
          'Strength training 2x/week',
          'Daily walking',
          'Gentle stretching',
        ],
        priority: 'medium',
      });
    }

    return recommendations;
  }

  // Lifestyle recommendations
  getLifestyleRecommendations(userData) {
    const recommendations = [];
    const dosha = userData.prakriti?.dominant || 'vata';
    const sleepData = userData.sleep || { duration: 7, quality: 70 };
    const stressData = userData.stress || { level: 50 };

    // Daily routine based on dosha
    const dailyRoutine = doshaCalculator.getDailyRoutine(dosha);
    
    recommendations.push({
      category: 'daily_routine',
      title: 'Ideal Daily Routine',
      ...dailyRoutine,
      priority: 'high',
    });

    // Sleep recommendations
    if (sleepData.duration < 7) {
      recommendations.push({
        category: 'sleep',
        title: 'Improve Sleep Duration',
        message: 'You are not getting enough sleep. Aim for 7-8 hours.',
        suggestions: [
          'Maintain consistent sleep schedule',
          'Create relaxing bedtime routine',
          'Avoid screens 1 hour before bed',
          'Keep bedroom cool and dark',
        ],
        priority: 'high',
      });
    }

    if (sleepData.quality < 70) {
      recommendations.push({
        category: 'sleep_quality',
        title: 'Enhance Sleep Quality',
        message: 'Your sleep quality could be improved.',
        suggestions: [
          'Avoid caffeine after 4 PM',
          'Practice relaxation techniques',
          'Use white noise if needed',
          'Consider magnesium supplement',
        ],
        priority: 'medium',
      });
    }

    // Stress management
    if (stressData.level > 70) {
      recommendations.push({
        category: 'stress',
        title: 'High Stress Management',
        message: 'Your stress levels are elevated. Try these techniques:',
        suggestions: [
          'Deep breathing exercises',
          'Guided meditation',
          'Regular breaks during work',
          'Connect with nature',
          'Journaling',
        ],
        priority: 'high',
      });
    }

    return recommendations;
  }

  // Wellness recommendations
  getWellnessRecommendations(userData) {
    const recommendations = [];
    const currentMonth = new Date().getMonth();

    // Hydration reminders
    const waterIntake = userData.waterIntake || 0;
    const recommendedWater = this.calculateRecommendedWater(userData);
    
    if (waterIntake < recommendedWater * 0.7) {
      recommendations.push({
        category: 'hydration',
        title: 'Increase Water Intake',
        message: `You've only had ${waterIntake}L today. Aim for ${recommendedWater}L.`,
        suggestions: [
          'Keep water bottle at desk',
          'Set hourly reminders',
          'Infuse water with fruits',
          'Drink a glass before each meal',
        ],
        priority: 'high',
      });
    }

    // Seasonal wellness
    const seasonalTips = {
      0: { // January
        title: 'Winter Wellness',
        tips: ['Boost immunity', 'Stay warm', 'Eat warming foods', 'Moisturize skin'],
      },
      3: { // April
        title: 'Spring Detox',
        tips: ['Light eating', 'Increase activity', 'Spring cleaning', 'Allergy management'],
      },
      6: { // July
        title: 'Summer Care',
        tips: ['Stay hydrated', 'Sun protection', 'Light meals', 'Early morning exercise'],
      },
      9: { // October
        title: 'Fall Preparation',
        tips: ['Boost immunity', 'Prepare for cold', 'Organize schedule', 'Stress management'],
      },
    };

    const seasonKey = Math.floor(currentMonth / 3) * 3;
    if (seasonalTips[seasonKey]) {
      recommendations.push({
        category: 'seasonal_wellness',
        title: seasonalTips[seasonKey].title,
        suggestions: seasonalTips[seasonKey].tips,
        priority: 'medium',
      });
    }

    return recommendations;
  }

  // Ayurveda recommendations
  getAyurvedaRecommendations(userData) {
    const recommendations = [];
    const dosha = userData.prakriti?.dominant || 'vata';
    const currentDosha = userData.currentDosha || userData.prakriti;

    // Check for imbalances
    if (userData.prakriti && currentDosha) {
      const imbalances = doshaCalculator.checkImbalance(
        currentDosha,
        userData.prakriti,
        15
      );

      imbalances.forEach(imbalance => {
        const balancing = doshaCalculator.getBalancingRecommendations(imbalance);
        
        recommendations.push({
          category: 'dosha_imbalance',
          title: `${imbalance.dosha.charAt(0).toUpperCase() + imbalance.dosha.slice(1)} Imbalance`,
          severity: imbalance.severity,
          ...balancing,
          priority: imbalance.severity === 'high' ? 'high' : 'medium',
        });
      });
    }

    // Herbal recommendations
    const herbs = this.getHerbalRecommendations(dosha);
    recommendations.push({
      category: 'herbal',
      title: 'Beneficial Herbs',
      herbs,
      priority: 'medium',
    });

    return recommendations;
  }

  // Preventive recommendations based on disease risks
  async getPreventiveRecommendations(userData) {
    const recommendations = [];
    
    try {
      const risks = await diseasePrediction.predictDiseaseRisks(userData);
      const highRisks = risks.filter(r => r.risk >= 50);

      highRisks.forEach(risk => {
        recommendations.push({
          category: 'preventive',
          title: `${risk.name} Prevention`,
          risk: risk.risk,
          factors: diseasePrediction.getRiskFactors(userData, risk.name.toLowerCase()),
          recommendations: diseasePrediction.getRecommendations(userData, risk.name.toLowerCase()),
          priority: risk.risk >= 70 ? 'high' : 'medium',
        });
      });
    } catch (error) {
      console.error('Error getting preventive recommendations:', error);
    }

    return recommendations;
  }

  // Helper methods
  getCurrentSeason() {
    const month = new Date().getMonth();
    
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 9) return 'monsoon';
    if (month >= 10 && month <= 11) return 'autumn';
    if (month === 0 || month === 1) return 'winter';
    return 'spring';
  }

  calculateRecommendedWater(userData) {
    const weight = userData.weight || 70;
    const activityLevel = userData.lifestyle?.physicalActivity || 'moderate';
    
    // Base recommendation: 30ml per kg of body weight
    let water = weight * 0.03;
    
    // Adjust for activity level
    if (activityLevel === 'high') water += 0.5;
    if (activityLevel === 'moderate') water += 0.3;
    
    // Adjust for climate (simplified)
    const month = new Date().getMonth();
    if (month >= 5 && month <= 8) water += 0.5; // Summer months
    
    return Math.round(water * 10) / 10;
  }

  getHerbalRecommendations(dosha) {
    const herbs = {
      vata: [
        { name: 'Ashwagandha', benefit: 'Grounding & calming', usage: 'With warm milk' },
        { name: 'Triphala', benefit: 'Gentle detox', usage: 'At bedtime' },
        { name: 'Ginger', benefit: 'Warming & digestive', usage: 'With meals' },
        { name: 'Licorice', benefit: 'Nourishing', usage: 'As tea' },
      ],
      pitta: [
        { name: 'Shatavari', benefit: 'Cooling & nourishing', usage: 'With cool water' },
        { name: 'Brahmi', benefit: 'Mental clarity', usage: 'As supplement' },
        { name: 'Neem', benefit: 'Cooling & cleansing', usage: 'In capsules' },
        { name: 'Coriander', benefit: 'Cooling', usage: 'In cooking' },
      ],
      kapha: [
        { name: 'Tulsi', benefit: 'Stimulating & cleansing', usage: 'As tea' },
        { name: 'Ginger', benefit: 'Digestive & warming', usage: 'With honey' },
        { name: 'Turmeric', benefit: 'Anti-inflammatory', usage: 'With meals' },
        { name: 'Pippali', benefit: 'Metabolic stimulant', usage: 'With honey' },
      ],
    };

    const doshaMap = {
      vata: 'vata',
      pitta: 'pitta',
      kapha: 'kapha',
      'vata-pitta': 'vata',
      'pitta-kapha': 'pitta',
      'vata-kapha': 'vata',
      tridosha: 'vata',
    };

    return herbs[doshaMap[dosha]] || herbs.vata;
  }

  getFallbackRecommendations() {
    return {
      diet: [{
        category: 'general',
        title: 'Healthy Eating Basics',
        suggestions: [
          'Eat a balanced diet',
          'Include fruits and vegetables',
          'Stay hydrated',
          'Limit processed foods',
        ],
        priority: 'high',
      }],
      exercise: [{
        category: 'general',
        title: 'Stay Active',
        suggestions: [
          '30 minutes of daily activity',
          'Mix cardio and strength',
          'Take regular breaks',
          'Listen to your body',
        ],
        priority: 'high',
      }],
      lifestyle: [{
        category: 'general',
        title: 'Healthy Lifestyle',
        suggestions: [
          'Maintain regular sleep schedule',
          'Practice stress management',
          'Stay socially connected',
          'Regular health check-ups',
        ],
        priority: 'high',
      }],
      wellness: [],
      ayurveda: [],
      preventive: [],
    };
  }

  // Cache management
  clearCache() {
    this.recommendationCache.clear();
  }

  updateLastUserState(userData) {
    this.lastUserState = { ...userData };
  }
}

export default new RecommendationEngine();