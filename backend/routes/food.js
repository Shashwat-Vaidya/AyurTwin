/**
 * Food Routes - Recommendations, meal plans, food compatibility
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { calculateDoshaStatus, determineAgniType, getCurrentRitu } = require('../engines/ayurvedicEngine');
const { generateFoodRecommendations, generateMealPlan, checkFoodCompatibility } = require('../engines/foodEngine');

// GET /api/food/recommendations/:userId
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await db.fetchCompleteUserProfile(userId);
    if (!profile.user) return res.status(404).json({ success: false, error: 'User not found' });

    const { data: foodDb } = await db.getFoodDatabase();
    if (!foodDb || foodDb.length === 0) {
      return res.status(500).json({ success: false, error: 'Food database not populated' });
    }

    const doshaStatus = calculateDoshaStatus(profile.prakriti, profile.symptoms, profile.lifestyle, profile.sleep, profile.ayurvedic);
    const agniType = determineAgniType(doshaStatus, profile.symptoms, profile.ayurvedic);
    const ritu = getCurrentRitu();
    const dietType = profile.lifestyle?.diet_type || 'Vegetarian';

    const recommendations = generateFoodRecommendations(foodDb, doshaStatus, ritu, agniType.type, dietType, profile.symptoms);
    const mealPlan = generateMealPlan(recommendations, doshaStatus, agniType.type, profile.user);

    // Store recommendations (best-effort)
    try {
      const recsToStore = recommendations.highly_recommended.slice(0, 10).map(f => ({
        user_id: userId,
        food_id: f.id,
        food_name: f.name,
        recommendation_type: 'highly_recommended',
        score: f.score,
        reasons: f.reasons,
      }));
      if (recsToStore.length > 0) await db.saveFoodRecommendations(recsToStore);

      await db.saveMealPlan({
        user_id: userId,
        plan_date: new Date().toISOString().split('T')[0],
        upon_waking: mealPlan.upon_waking,
        breakfast: mealPlan.breakfast,
        mid_morning: mealPlan.mid_morning,
        lunch: mealPlan.lunch,
        evening_snack: mealPlan.afternoon,
        dinner: mealPlan.dinner,
        before_bed: mealPlan.before_bed,
        dietary_guidelines: mealPlan.guidelines,
        total_protein_g: mealPlan.protein_target_g,
        season: ritu.english,
        dosha_focus: doshaStatus.dominant,
      });
    } catch (_) { /* non-critical */ }

    res.json({
      success: true,
      data: { doshaStatus, agni: agniType, season: ritu, recommendations, mealPlan },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/food/check-compatibility
router.post('/check-compatibility', async (req, res) => {
  try {
    const { user_id, foods } = req.body;
    if (!foods || foods.length < 2) {
      return res.status(400).json({ success: false, error: 'Provide at least 2 foods' });
    }

    const { data: rules } = await db.getViruddhaRules();
    const result = checkFoodCompatibility(foods, rules || []);

    if (user_id) {
      await db.logViruddhaCheck({
        user_id,
        foods_checked: foods,
        incompatible_pairs: result.incompatiblePairs,
        is_compatible: result.isCompatible,
      });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/food/database
router.get('/database', async (req, res) => {
  try {
    const { data, error } = await db.getFoodDatabase(req.query);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
