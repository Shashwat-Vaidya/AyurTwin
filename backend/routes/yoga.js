const express = require('express');
const db = require('../services/db');
const { authenticate } = require('../middleware/auth');
const yogaEngine = require('../engines/yogaEngine');
const diseaseEngine = require('../engines/diseaseEngine');

const router = express.Router();

router.get('/recommendations', authenticate, async (req, res) => {
    const [u, p, s] = await Promise.all([
        db.getUserById(req.user.id), db.getHealthProfile(req.user.id), db.getLatestSensor(req.user.id),
    ]);
    const pred = diseaseEngine.predict({ user: u.data, profile: p.data, sensor: s.data || {} });
    res.json(yogaEngine.recommend({ user: u.data, profile: p.data, sensor: s.data || {}, risks: pred.risks }));
});

module.exports = router;
