/**
 * User profile + prakriti + health update routes.
 */
const express = require('express');
const db = require('../services/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get current user
router.get('/me', authenticate, async (req, res) => {
    const { data: user } = await db.getUserById(req.user.id);
    const { data: profile } = await db.getHealthProfile(req.user.id);
    res.json({ user: strip(user), profile });
});

// Get any user (for family monitoring when approved - checked client-side on handoff)
router.get('/:id', authenticate, async (req, res) => {
    const { data: user } = await db.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'not found' });
    res.json({ user: strip(user) });
});

// Update user basic profile
router.patch('/me', authenticate, async (req, res) => {
    const allow = ['full_name','age','gender','height_cm','weight_kg','diet_type','prakriti'];
    const fields = Object.fromEntries(Object.entries(req.body).filter(([k]) => allow.includes(k)));
    const { data, error } = await db.updateUser(req.user.id, fields);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ user: strip(data) });
});

// Submit a prakriti quiz (can be retaken - updates user.prakriti)
router.post('/prakriti-quiz', authenticate, async (req, res) => {
    const { vata, pitta, kapha, prakriti, answers } = req.body;
    await db.savePrakritiQuiz({
        user_id: req.user.id,
        vata_score: vata, pitta_score: pitta, kapha_score: kapha, prakriti, answers,
    });
    await db.updateUser(req.user.id, { prakriti, last_prakriti_update: new Date().toISOString() });
    res.json({ ok: true, prakriti });
});

// Health profile (initial + updates; 1 month gate enforced here)
router.put('/health-profile', authenticate, async (req, res) => {
    const { data: user } = await db.getUserById(req.user.id);
    if (user.last_health_update) {
        const days = (Date.now() - new Date(user.last_health_update).getTime()) / 86400000;
        if (days < 30 && !req.body.force) {
            return res.status(409).json({ error: 'health update allowed every 30 days', next_update_in_days: Math.ceil(30 - days) });
        }
    }
    const { error } = await db.upsertHealthProfile(req.user.id, req.body);
    if (error) return res.status(400).json({ error: error.message });
    await db.updateUser(req.user.id, { last_health_update: new Date().toISOString() });
    res.json({ ok: true });
});

// Quick gate check for the "Update Health Data" button
router.get('/health-update-status', authenticate, async (req, res) => {
    const { data: user } = await db.getUserById(req.user.id);
    if (!user.last_health_update) return res.json({ can_update: true });
    const days = (Date.now() - new Date(user.last_health_update).getTime()) / 86400000;
    res.json({
        can_update: days >= 30,
        next_update_in_days: Math.max(0, Math.ceil(30 - days)),
        last_update: user.last_health_update,
    });
});

function strip(u) { if (!u) return u; const { password_hash, ...rest } = u; return rest; }

module.exports = router;
