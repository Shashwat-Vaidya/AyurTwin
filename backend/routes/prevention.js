const express = require('express');
const db = require('../services/db');
const { authenticate } = require('../middleware/auth');
const preventionEngine = require('../engines/preventionEngine');
const diseaseEngine = require('../engines/diseaseEngine');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    const [u, p, s] = await Promise.all([
        db.getUserById(req.user.id), db.getHealthProfile(req.user.id), db.getLatestSensor(req.user.id),
    ]);
    const pred = diseaseEngine.predict({ user: u.data, profile: p.data, sensor: s.data || {} });
    res.json(preventionEngine.generate({ user: u.data, profile: p.data, risks: pred.risks }));
});

module.exports = router;
