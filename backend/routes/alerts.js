const express = require('express');
const db = require('../services/db');
const { authenticate } = require('../middleware/auth');
const alertsEngine = require('../engines/alertsEngine');
const diseaseEngine = require('../engines/diseaseEngine');

const router = express.Router();

// Live-computed alerts (no storage)
router.get('/', authenticate, async (req, res) => {
    const [u, p, s, d] = await Promise.all([
        db.getUserById(req.user.id), db.getHealthProfile(req.user.id),
        db.getLatestSensor(req.user.id), db.getTodayDinacharya(req.user.id),
    ]);
    const pred = diseaseEngine.predict({ user: u.data, profile: p.data, sensor: s.data || {} });
    const alerts = alertsEngine.build({
        user: u.data, profile: p.data, sensor: s.data || {}, risks: pred.risks,
        dinacharyaPct: d.data?.completion_pct || 0,
    });
    res.json({ alerts });
});

// Historical stored alerts
router.get('/history', authenticate, async (req, res) => {
    const { data } = await db.getAlerts(req.user.id);
    res.json({ alerts: data || [] });
});

module.exports = router;
