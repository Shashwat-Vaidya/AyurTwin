/**
 * Ritucharya Routes - Seasonal Regimen
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { calculateDoshaStatus, getCurrentRitu, generateRitucharya } = require('../engines/ayurvedicEngine');

// GET /api/ritucharya/:userId
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await db.fetchCompleteUserProfile(userId);
    if (!profile.user) return res.status(404).json({ success: false, error: 'User not found' });

    const doshaStatus = calculateDoshaStatus(profile.prakriti, profile.symptoms, profile.lifestyle, profile.sleep, profile.ayurvedic);
    const ritu = getCurrentRitu();
    const plan = generateRitucharya(ritu.ritu, doshaStatus);

    // Store plan (best-effort)
    try {
      await db.saveRitucharyaPlan({
        user_id: userId,
        season: ritu.english,
        ritu_name: ritu.ritu,
        diet_plan: plan.diet,
        lifestyle_plan: { lifestyle: plan.lifestyle },
        exercise_plan: { exercise: plan.exercise },
        herbs_recommended: plan.herbs,
        foods_to_favor: plan.diet.favor,
        foods_to_avoid: plan.diet.avoid,
        dosha_considerations: { dosha: doshaStatus.dominant, note: plan.personalNote },
      });
    } catch (_) { /* non-critical */ }

    res.json({ success: true, data: { ritu, plan, doshaStatus } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
