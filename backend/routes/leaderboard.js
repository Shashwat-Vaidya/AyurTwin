/**
 * Leaderboard Routes
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const { data, error } = await db.getLeaderboard();
    if (error) return res.status(400).json({ success: false, error: error.message });
    // Only include patients
    const patients = (data || []).filter(entry => entry.user?.user_type === 'patient');
    res.json({ success: true, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/leaderboard/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { data, error } = await db.getLeaderboardEntry(req.params.userId);
    if (error && error.code !== 'PGRST116') {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.json({ success: true, data: data || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/leaderboard/:userId
router.put('/:userId', async (req, res) => {
  try {
    const { data, error } = await db.upsertLeaderboard({ user_id: req.params.userId, ...req.body });
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
