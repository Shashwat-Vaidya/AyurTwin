/**
 * Dinacharya & Meal Tracking Routes
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// POST /api/dinacharya
router.post('/', async (req, res) => {
  try {
    const { user_id, date, ...data } = req.body;
    const { error } = await db.saveDinacharya(user_id, date, data);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dinacharya/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { data, error } = await db.getDinacharyaHistory(req.params.userId);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/meals
router.post('/meals', async (req, res) => {
  try {
    const { user_id, ...data } = req.body;
    const { data: meal, error } = await db.saveMeal({ user_id, ...data });
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, data: meal });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
