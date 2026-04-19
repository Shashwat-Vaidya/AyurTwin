/**
 * Sensor Routes - Ingest, fetch latest, history
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// POST /api/sensors/ingest
router.post('/ingest', async (req, res) => {
  try {
    const { user_id, device_id, temperature, spo2, heart_rate, accel_x, accel_y, accel_z } = req.body;

    const { data, error } = await db.insertSensorReading({
      user_id,
      device_id: device_id || 'ATB-200',
      temperature,
      spo2,
      heart_rate,
      accel_x,
      accel_y,
      accel_z,
    });

    if (error) return res.status(400).json({ success: false, error: error.message });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/sensors/latest/:userId
router.get('/latest/:userId', async (req, res) => {
  try {
    const { data, error } = await db.getLatestSensor(req.params.userId);
    if (error && error.code !== 'PGRST116') {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.json({ success: true, data: data || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/sensors/history/:userId
router.get('/history/:userId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const { data, error } = await db.getSensorHistory(req.params.userId, limit);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
