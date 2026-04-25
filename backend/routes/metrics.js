/**
 * Metrics page - averages (daily/weekly/monthly), heart-rate trend (1h),
 * dosha trend.
 */
const express = require('express');
const db = require('../services/db');
const { authenticate } = require('../middleware/auth');
const { activityScore, stressIndex, doshaScores } = require('../engines/common');

const router = express.Router();

const WINDOW_MS = { daily: 86400e3, weekly: 7 * 86400e3, monthly: 30 * 86400e3 };

function avg(rows, key) {
    const v = rows.map(r => Number(r[key])).filter(Number.isFinite);
    return v.length ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(2) : null;
}

router.get('/:userId', authenticate, async (req, res) => {
    const win = req.query.window || 'daily';
    const since = new Date(Date.now() - (WINDOW_MS[win] || WINDOW_MS.daily)).toISOString();
    const [rows, profileRes] = await Promise.all([
        db.getSensorSince(req.params.userId, since),
        db.getHealthProfile(req.params.userId),
    ]);
    const data = rows.data || [];
    const profile = profileRes.data;

    const avgSensor = {
        heart_rate: avg(data, 'heart_rate'),
        spo2: avg(data, 'spo2'),
        body_temperature: avg(data, 'body_temperature'),
    };

    const activities = data.map(d => activityScore(d));
    const avgActivity = activities.length ? +(activities.reduce((a, b) => a + b, 0) / activities.length).toFixed(2) : null;

    const si = stressIndex(profile?.stress_level, profile?.anxiety_level,
        { heart_rate: avgSensor.heart_rate }, profile?.sleep_hours);

    res.json({
        window: win,
        sample_count: data.length,
        avg: avgSensor,
        avg_activity_score: avgActivity,
        stress_index: si,
        sleep_cycle: profile ? {
            sleep_hours: profile.sleep_hours,
            sleep_time: profile.sleep_time,
            wake_time: profile.wake_time,
            daytime_sleepiness: profile.daytime_sleepiness,
        } : null,
    });
});

// 1-hour heart-rate trend downsampled to ~60 points
router.get('/:userId/hr-trend', authenticate, async (req, res) => {
    const since = new Date(Date.now() - 3600e3).toISOString();
    const { data } = await db.getSensorSince(req.params.userId, since);
    const rows = data || [];
    const bucket = Math.max(1, Math.floor(rows.length / 60));
    const out = [];
    for (let i = 0; i < rows.length; i += bucket) {
        const slice = rows.slice(i, i + bucket);
        out.push({
            t: slice[0].recorded_at,
            hr: +(slice.reduce((a, b) => a + Number(b.heart_rate || 0), 0) / slice.length).toFixed(1),
        });
    }
    res.json({ points: out });
});

// Dosha trend (latest computed over last N readings)
router.get('/:userId/dosha-trend', authenticate, async (req, res) => {
    const profileRes = await db.getHealthProfile(req.params.userId);
    const { data: rows } = await db.getSensorHistory(req.params.userId, 24);
    const points = (rows || []).reverse().map(r => ({
        t: r.recorded_at, ...doshaScores({ profile: profileRes.data, sensor: r }),
    }));
    res.json({ points });
});

module.exports = router;
