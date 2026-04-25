/**
 * Disease-risk prediction via the ML engine.
 */
const express = require('express');
const db = require('../services/db');
const { authenticate } = require('../middleware/auth');
const diseaseEngine = require('../engines/diseaseEngine');

const router = express.Router();

// POST /predict-risk - explicit payload
router.post('/predict-risk', authenticate, async (req, res) => {
    const out = diseaseEngine.predict(req.body);
    await db.savePrediction(req.user.id, out.risks, out.model_used);
    res.json(out);
});

// GET /predict-risk/me - uses stored profile + latest sensor
router.get('/predict-risk/me', authenticate, async (req, res) => {
    const [u, p, s] = await Promise.all([
        db.getUserById(req.user.id), db.getHealthProfile(req.user.id), db.getLatestSensor(req.user.id),
    ]);
    const out = diseaseEngine.predict({ user: u.data, profile: p.data, sensor: s.data || {} });
    await db.savePrediction(req.user.id, out.risks, out.model_used);
    res.json(out);
});

// GET /predict-risk/me/explain/:disease - feature contributions for one disease
router.get('/predict-risk/me/explain/:disease', authenticate, async (req, res) => {
    const [u, p, s] = await Promise.all([
        db.getUserById(req.user.id), db.getHealthProfile(req.user.id), db.getLatestSensor(req.user.id),
    ]);
    const out = diseaseEngine.predict({ user: u.data, profile: p.data, sensor: s.data || {} });
    const detail = out.explain?.[req.params.disease];
    if (!detail) return res.status(404).json({ error: 'unknown disease' });
    res.json({
        disease: req.params.disease,
        model_used: out.model_used,
        ...detail,
        features_snapshot: out.features_snapshot,
    });
});

module.exports = router;
