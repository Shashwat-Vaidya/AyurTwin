/**
 * Sensor routes - ESP32 ingest + latest + windowed history.
 */
const express = require('express');
const db = require('../services/db');
const { authenticate, optional } = require('../middleware/auth');

const router = express.Router();

// Ingest (no auth - ESP32 posts by user_id)
router.post('/ingest', optional, async (req, res) => {
    const b = req.body;
    if (!b.user_id) return res.status(400).json({ error: 'user_id required' });
    const { error } = await db.insertSensor({
        user_id: b.user_id,
        heart_rate: b.heart_rate,
        spo2: b.spo2,
        body_temperature: b.body_temperature,
        accel_x: b.accel_x, accel_y: b.accel_y, accel_z: b.accel_z,
        gyro_x: b.gyro_x,   gyro_y: b.gyro_y,   gyro_z: b.gyro_z,
        recorded_at: b.recorded_at || new Date().toISOString(),
    });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ ok: true });
});

// Latest (dashboard polls every 5s)
router.get('/latest/:userId', authenticate, async (req, res) => {
    const { data } = await db.getLatestSensor(req.params.userId);
    res.json({ sensor: data });
});

// History window (daily | weekly | monthly | last N rows)
router.get('/history/:userId', authenticate, async (req, res) => {
    const { window = 'daily', limit = 5000 } = req.query;
    const now = Date.now();
    const msMap = { daily: 86400000, weekly: 7 * 86400000, monthly: 30 * 86400000, hour: 3600000 };
    const since = new Date(now - (msMap[window] || msMap.daily)).toISOString();
    const { data } = await db.getSensorSince(req.params.userId, since);
    res.json({ window, rows: (data || []).slice(-limit) });
});

module.exports = router;
