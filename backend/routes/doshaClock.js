/**
 * Dosha Clock Routes - Kala Chakra time-based recommendations
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { calculateDoshaStatus, getDoshaClockRecommendation } = require('../engines/ayurvedicEngine');

// GET /api/dosha-clock/:userId
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const hour = req.query.hour !== undefined ? parseInt(req.query.hour) : new Date().getHours();

    const profile = await db.fetchCompleteUserProfile(userId);
    if (!profile.user) return res.status(404).json({ success: false, error: 'User not found' });

    const doshaStatus = calculateDoshaStatus(profile.prakriti, profile.symptoms, profile.lifestyle, profile.sleep, profile.ayurvedic);

    const current = getDoshaClockRecommendation(hour, doshaStatus);

    // Full 24-hour schedule
    const fullDay = [];
    for (let h = 0; h < 24; h++) {
      const rec = getDoshaClockRecommendation(h, doshaStatus);
      fullDay.push({ hour: h, ...rec });
    }

    res.json({ success: true, data: { current, fullDay, doshaStatus } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/dosha-clock/log
router.post('/log', async (req, res) => {
  try {
    const { user_id, time_period, dominant_dosha, recommendation, activity_type, followed } = req.body;
    const { error } = await db.logDoshaClock({
      user_id, time_period, dominant_dosha, recommendation, activity_type, followed,
    });
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
