/**
 * Sensor routes - ESP32 ingest + latest + windowed history.
 */
const express = require('express');
const db = require('../services/db');
const { authenticate, optional } = require('../middleware/auth');

const router = express.Router();

// Validation helper
const isValidSensorData = (b) => {
    const errors = [];
    
    // Heart rate validation (40-180 bpm is healthy range)
    if (b.heart_rate !== null && b.heart_rate !== undefined) {
        if (b.heart_rate < 40 || b.heart_rate > 180) {
            errors.push(`heart_rate ${b.heart_rate} out of range (40-180)`);
        }
    }
    
    // SpO2 validation (80-100% is valid)
    if (b.spo2 !== null && b.spo2 !== undefined) {
        if (b.spo2 < 80 || b.spo2 > 100) {
            errors.push(`spo2 ${b.spo2} out of range (80-100)`);
        }
    }
    
    // Temperature validation (35-40.5°C is human range)
    if (b.body_temperature !== null && b.body_temperature !== undefined) {
        if (b.body_temperature < 35 || b.body_temperature > 40.5) {
            errors.push(`body_temperature ${b.body_temperature}°C out of range (35-40.5°C)`);
        }
    }
    
    // Motion sensors validation (-50 to +50 m/s² and °/s)
    if (b.accel_x !== null && b.accel_x !== undefined) {
        if (b.accel_x < -50 || b.accel_x > 50) {
            errors.push(`accel_x ${b.accel_x} out of range`);
        }
    }
    if (b.accel_y !== null && b.accel_y !== undefined) {
        if (b.accel_y < -50 || b.accel_y > 50) {
            errors.push(`accel_y ${b.accel_y} out of range`);
        }
    }
    if (b.accel_z !== null && b.accel_z !== undefined) {
        if (b.accel_z < -50 || b.accel_z > 50) {
            errors.push(`accel_z ${b.accel_z} out of range`);
        }
    }
    
    return { valid: errors.length === 0, errors };
};

// Ingest (no auth - ESP32 posts by user_id)
router.post('/ingest', optional, async (req, res) => {
    const b = req.body;
    if (!b.user_id) return res.status(400).json({ error: 'user_id required' });
    
    // Validate sensor data
    const { valid, errors } = isValidSensorData(b);
    if (!valid) {
        console.warn(`[sensor] Rejecting invalid data for user ${b.user_id}:`, errors);
        return res.status(400).json({ error: 'Invalid sensor reading: ' + errors.join(', ') });
    }
    
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
