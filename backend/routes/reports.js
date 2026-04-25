/**
 * Reports:
 *   GET /api/reports/me          → JSON
 *   GET /api/reports/me/pdf      → binary PDF download (streamed)
 */
const express = require('express');
const db = require('../services/db');
const { authenticate } = require('../middleware/auth');
const diseaseEngine = require('../engines/diseaseEngine');
const healthScoreEngine = require('../engines/healthScoreEngine');
const dietEngine = require('../engines/dietEngine');
const yogaEngine = require('../engines/yogaEngine');
const ritucharyaEngine = require('../engines/ritucharyaEngine');
const preventionEngine = require('../engines/preventionEngine');
const calorieEngine = require('../engines/calorieEngine');
const pdfReport = require('../services/pdfReport');
const { bmi, doshaScores, dominantDosha, currentSeason } = require('../engines/common');

const router = express.Router();

async function buildReport(userId) {
    const [u, p, s, hs, din] = await Promise.all([
        db.getUserById(userId), db.getHealthProfile(userId),
        db.getLatestSensor(userId), db.getLatestHealthScore(userId),
        db.getTodayDinacharya(userId),
    ]);
    const pred = diseaseEngine.predict({ user: u.data, profile: p.data, sensor: s.data || {} });
    const scoreOut = healthScoreEngine.compute({
        user: u.data, profile: p.data, sensor: s.data,
        risks: pred.risks, dinacharyaPct: din.data?.completion_pct || 0,
    });
    const doshas = doshaScores({ profile: p.data, sensor: s.data || {} });
    const diet = dietEngine.classify(u.data, p.data, s.data || {});
    const yoga = yogaEngine.recommend({ user: u.data, profile: p.data, sensor: s.data || {}, risks: pred.risks });
    const ritu = ritucharyaEngine.recommend({ user: u.data, profile: p.data, sensor: s.data || {} });
    const prev = preventionEngine.generate({ user: u.data, profile: p.data, risks: pred.risks });
    const cal = calorieEngine.compute({ user: u.data, profile: p.data });
    return {
        generated_at: new Date().toISOString(),
        user: { name: u.data?.full_name || u.data?.username, age: u.data?.age, gender: u.data?.gender,
                height_cm: u.data?.height_cm, weight_kg: u.data?.weight_kg,
                bmi: bmi(u.data?.height_cm, u.data?.weight_kg),
                prakriti: u.data?.prakriti, diet_type: u.data?.diet_type },
        season: currentSeason(),
        vitals: s.data,
        lifestyle: p.data,
        doshas: { ...doshas, dominant: dominantDosha(doshas) },
        disease_risks: pred.risks,
        disease_classified: pred.classified,
        health_score: scoreOut.score,
        health_score_breakdown: scoreOut.breakdown,
        dinacharya_today: din.data,
        last_recorded_health_score: hs.data,
        diet: {
            best:     (diet.best     || []).slice(0, 12).map(f => f.name),
            good:     (diet.good     || []).slice(0, 12).map(f => f.name),
            moderate: (diet.moderate || []).slice(0, 8).map(f => f.name),
            avoid:    (diet.avoid    || []).slice(0, 12).map(f => f.name),
        },
        ritucharya: {
            best:  (ritu.best  || []).slice(0, 8).map(f => f.name),
            good:  (ritu.good  || []).slice(0, 8).map(f => f.name),
            avoid: (ritu.avoid || []).slice(0, 8).map(f => f.name),
        },
        yoga: {
            morning: (yoga.morning || []).slice(0, 4).map(y => y.name),
            evening: (yoga.evening || []).slice(0, 4).map(y => y.name),
            therapeutic: (yoga.therapeutic || []).slice(0, 4).map(y => y.name),
        },
        prevention: prev,
        calories: cal,
    };
}

router.get('/me', authenticate, async (req, res) => {
    res.json(await buildReport(req.user.id));
});

router.get('/me/pdf', authenticate, async (req, res) => {
    const data = await buildReport(req.user.id);
    const fname = `ayurtwin-report-${new Date().toISOString().slice(0, 10)}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fname}"`);
    pdfReport.generate(res, data);
});

module.exports = router;
