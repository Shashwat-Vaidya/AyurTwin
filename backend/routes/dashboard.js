/**
 * Dashboard aggregate route - one call returns what the home screen needs.
 */
const express = require('express');
const db = require('../services/db');
const { authenticate } = require('../middleware/auth');
const diseaseEngine = require('../engines/diseaseEngine');
const healthScoreEngine = require('../engines/healthScoreEngine');
const alertsEngine = require('../engines/alertsEngine');
const { doshaScores, dominantDosha, bmi, stressIndex, sleepScore, activityScore, currentSeason } = require('../engines/common');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    const userId = req.user.id;
    const [userRes, profileRes, sensorRes, sensorHistoryRes, dinacharyaRes, prakritiRes] = await Promise.all([
        db.getUserById(userId),
        db.getHealthProfile(userId),
        db.getLatestSensor(userId),
        db.getSensorHistory(userId, 30), // Get 30 latest readings for trend analysis
        db.getTodayDinacharya(userId),
        db.getLatestPrakriti(userId),
    ]);

    const user = userRes.data;
    const profile = profileRes.data;
    const sensor = sensorRes.data;
    const sensorHistory = (sensorHistoryRes.data || []).reverse(); // Oldest first for trend analysis
    const dinacharyaPct = dinacharyaRes.data?.completion_pct || 0;

    // Enhanced prediction with sensor history and detailed explanations
    const prediction = diseaseEngine.predict({ user, profile, sensor: sensor || {} }, sensorHistory);
    const risks = prediction.risks;

    const scoreOut = healthScoreEngine.compute({ user, profile, sensor, risks, dinacharyaPct });
    await db.saveHealthScore(userId, scoreOut.score, scoreOut.breakdown);
    await db.savePrediction(userId, risks, prediction.model_used);

    const alerts = alertsEngine.build({ user, profile, sensor, risks, dinacharyaPct, healthScore: scoreOut.score });
    const dosha = doshaScores({ profile, sensor: sensor || {} });

    // top 3 diseases (descending)
    const topDiseases = Object.entries(risks)
        .sort((a, b) => b[1] - a[1]).slice(0, 3)
        .map(([name, pct]) => ({ name, pct, label: prediction.classified[name].label }));

    res.json({
        user: strip(user),
        prakriti_quiz: prakritiRes.data,
        profile,
        sensor,
        sensor_history_count: sensorHistory.length,
        bmi: bmi(user?.height_cm, user?.weight_kg),
        stress_index: stressIndex(profile?.stress_level, profile?.anxiety_level, sensor || {}, profile?.sleep_hours),
        sleep_score: sleepScore(profile?.sleep_hours, profile?.daytime_sleepiness),
        activity_score: activityScore(sensor || {}),
        season: currentSeason(),
        health_score: scoreOut.score,
        health_score_breakdown: scoreOut.breakdown,
        dominant_dosha: dominantDosha(dosha),
        dosha,
        top_diseases: topDiseases,
        disease_risks: risks,
        disease_classified: prediction.classified,
        disease_explanations: prediction.explain, // New: detailed explanations
        alerts,
        dinacharya: dinacharyaRes.data,
        model_used: prediction.model_used,
        confidence: prediction.confidence, // ML confidence score
    });
});

// Dedicated health-score explainer page
router.get('/health-score', authenticate, async (req, res) => {
    const [userRes, profileRes, sensorRes, dinacharyaRes, predRes] = await Promise.all([
        db.getUserById(req.user.id),
        db.getHealthProfile(req.user.id),
        db.getLatestSensor(req.user.id),
        db.getTodayDinacharya(req.user.id),
        db.getLatestPrediction(req.user.id),
    ]);
    const out = healthScoreEngine.compute({
        user: userRes.data, profile: profileRes.data, sensor: sensorRes.data,
        risks: predRes.data?.predictions || {}, dinacharyaPct: dinacharyaRes.data?.completion_pct || 0,
    });
    res.json(out);
});

function strip(u) { if (!u) return u; const { password_hash, ...rest } = u; return rest; }

module.exports = router;
