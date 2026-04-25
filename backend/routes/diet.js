/**
 * Diet + food endpoints (diet recommendation, calorie calc, food search).
 */
const express = require('express');
const db = require('../services/db');
const { authenticate } = require('../middleware/auth');
const dietEngine = require('../engines/dietEngine');
const calorieEngine = require('../engines/calorieEngine');
const ritucharyaEngine = require('../engines/ritucharyaEngine');
const viruddhaEngine = require('../engines/viruddhaEngine');

const router = express.Router();

// Diet recommendations for current user
router.get('/recommendations', authenticate, async (req, res) => {
    const [u, p, s] = await Promise.all([
        db.getUserById(req.user.id), db.getHealthProfile(req.user.id), db.getLatestSensor(req.user.id),
    ]);
    res.json(dietEngine.classify(u.data, p.data, s.data || {}));
});

// Calorie calculator
router.get('/calories', authenticate, async (req, res) => {
    const [u, p] = await Promise.all([db.getUserById(req.user.id), db.getHealthProfile(req.user.id)]);
    res.json(calorieEngine.compute({ user: u.data, profile: p.data }));
});

// Ritucharya
router.get('/ritucharya', authenticate, async (req, res) => {
    const [u, p, s] = await Promise.all([
        db.getUserById(req.user.id), db.getHealthProfile(req.user.id), db.getLatestSensor(req.user.id),
    ]);
    const season = req.query.season;
    res.json(ritucharyaEngine.recommend({ user: u.data, profile: p.data, sensor: s.data || {} }, season));
});

// Viruddha check
router.post('/check-viruddha', authenticate, async (req, res) => {
    const { foods = [], prakriti, digestion_strength } = req.body;
    res.json(viruddhaEngine.check({ foods, prakriti, digestion_strength }));
});

router.get('/viruddha-suggest', authenticate, (req, res) => {
    res.json({ suggestions: viruddhaEngine.suggest(req.query.q) });
});

router.get('/food-search', authenticate, (req, res) => {
    res.json({ results: dietEngine.searchFoods(req.query.q) });
});

module.exports = router;
