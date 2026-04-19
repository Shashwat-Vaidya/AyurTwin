/**
 * Nadi Pariksha Routes - Digital Pulse Analysis
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { analyzeNadiPariksha } = require('../engines/panchakarmaEngine');

// POST /api/nadi/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { user_id, sensor_data } = req.body;
    const analysis = analyzeNadiPariksha(sensor_data || {});

    const { data, error } = await db.saveNadiPariksha({
      user_id,
      ...analysis,
      raw_sensor_data: sensor_data,
    });

    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, data: { analysis, record: data } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/nadi/history/:userId
router.get('/history/:userId', async (req, res) => {
  try {
    const { data, error } = await db.getNadiHistory(req.params.userId);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
