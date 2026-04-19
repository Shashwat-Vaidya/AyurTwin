/**
 * Yoga Routes - Recommendations, session building, session logging
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { calculateDoshaStatus } = require('../engines/ayurvedicEngine');
const { generateYogaRecommendations, buildYogaSession } = require('../engines/yogaEngine');

// GET /api/yoga/recommendations/:userId
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const sessionType = req.query.session || req.query.sessionType || 'morning';
    const duration = parseInt(req.query.duration) || 30;

    const profile = await db.fetchCompleteUserProfile(userId);
    if (!profile.user) return res.status(404).json({ success: false, error: 'User not found' });

    const { data: yogaDb } = await db.getYogaPoses();
    if (!yogaDb || yogaDb.length === 0) {
      return res.status(500).json({ success: false, error: 'Yoga database not populated' });
    }

    const doshaStatus = calculateDoshaStatus(profile.prakriti, profile.symptoms, profile.lifestyle, profile.sleep, profile.ayurvedic);

    // Get latest disease risks
    const { data: latestPrediction } = await db.getLatestPrediction(userId);
    const risks = latestPrediction ? {
      diabetes: latestPrediction.diabetes_risk,
      hypertension: latestPrediction.hypertension_risk,
      heart_disease: latestPrediction.heart_disease_risk,
      stress: latestPrediction.stress_risk,
      sleep_disorder: latestPrediction.sleep_disorder_risk,
      obesity: latestPrediction.obesity_risk,
      digestive_disorder: latestPrediction.digestive_disorder_risk,
    } : {};

    const recommendations = generateYogaRecommendations(yogaDb, doshaStatus, profile.user, risks, sessionType);
    const session = buildYogaSession(recommendations, sessionType, duration, doshaStatus);

    // Store top recommendations (best-effort)
    try {
      const topRecs = recommendations.slice(0, 10).map((p, idx) => ({
        user_id: userId,
        pose_id: p.id,
        pose_name: p.name,
        recommendation_reason: p.reasons.join('; '),
        priority: idx + 1,
        session_type: sessionType,
      }));
      if (topRecs.length > 0) await db.saveYogaRecommendations(topRecs);
    } catch (_) { /* non-critical */ }

    res.json({
      success: true,
      data: {
        doshaStatus, sessionType, session,
        top_poses: recommendations.slice(0, 15),
        avoid_poses: recommendations.filter(p => p.score < -2).slice(0, 5),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/yoga/session
router.post('/session', async (req, res) => {
  try {
    const { user_id, session_type, poses_completed, duration_minutes, feeling_before, feeling_after, notes } = req.body;

    const { data, error } = await db.saveYogaSession({
      user_id,
      session_date: new Date().toISOString().split('T')[0],
      session_type,
      poses_completed,
      duration_minutes,
      feeling_before,
      feeling_after,
      notes,
    });

    if (error) return res.status(400).json({ success: false, error: error.message });

    // Update leaderboard
    const { data: currentLb } = await db.getLeaderboardEntry(user_id);
    if (currentLb) {
      await db.upsertLeaderboard({
        user_id,
        yoga_score: (currentLb.yoga_score || 0) + Math.min(10, duration_minutes / 3),
        total_score: (currentLb.total_score || 0) + 5,
      });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
