/**
 * Auth routes: register (patient/family) + login.
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../services/db');
const { sign } = require('../middleware/auth');
const { requireFields } = require('../middleware/validate');

const router = express.Router();

// ── Register (patient) ─────────────────────────────────────────────
// Body: email, username, password, role='patient', full_name, age, gender,
//       height_cm, weight_kg, diet_type='veg|nonveg', prakriti (optional)
router.post('/register',
    requireFields('email', 'username', 'password'),
    async (req, res) => {
        try {
            const b = req.body;
            const [e, u] = await Promise.all([
                db.getUserByEmail(b.email),
                db.getUserByUsername(b.username),
            ]);
            if (e.data) return res.status(409).json({ error: 'email already registered' });
            if (u.data) return res.status(409).json({ error: 'username taken' });

            const hash = await bcrypt.hash(b.password, 10);
            const { data: user, error } = await db.createUser({
                email: b.email.toLowerCase(),
                username: b.username,
                password_hash: hash,
                role: b.role === 'family' ? 'family' : 'patient',
                full_name: b.full_name,
                age: b.age, gender: b.gender,
                height_cm: b.height_cm, weight_kg: b.weight_kg,
                diet_type: b.diet_type === 'nonveg' ? 'nonveg' : 'veg',
                prakriti: b.prakriti || null,
                last_health_update: new Date().toISOString(),
            });
            if (error) return res.status(400).json({ error: error.message });

            // also write health_profile if any lifestyle payload present
            if (b.health_profile) {
                await db.upsertHealthProfile(user.id, b.health_profile);
            }
            // If a family user just signed up, link any pending invites pre-addressed to this email.
            if (user.role === 'family') {
                const { supabase } = require('../config/supabase');
                await supabase.from('family_links')
                    .update({ family_user_id: user.id })
                    .ilike('family_email', user.email)
                    .is('family_user_id', null);
            }
            // prakriti quiz snapshot
            if (b.prakriti_quiz) {
                await db.savePrakritiQuiz({
                    user_id: user.id,
                    vata_score: b.prakriti_quiz.vata,
                    pitta_score: b.prakriti_quiz.pitta,
                    kapha_score: b.prakriti_quiz.kapha,
                    prakriti: b.prakriti_quiz.prakriti,
                    answers: b.prakriti_quiz.answers || null,
                });
            }

            res.status(201).json({ user: stripPwd(user), token: sign(user) });
        } catch (e) { res.status(500).json({ error: e.message }); }
    });

// ── Login ───────────────────────────────────────────────────────────
// Body: identifier (email or username), password
router.post('/login',
    requireFields('identifier', 'password'),
    async (req, res) => {
        try {
            const { identifier, password } = req.body;
            const { data: user } = await db.getUserByEmailOrUsername(identifier);
            if (!user) return res.status(401).json({ error: 'invalid credentials' });
            const ok = await bcrypt.compare(password, user.password_hash);
            if (!ok) return res.status(401).json({ error: 'invalid credentials' });
            res.json({ user: stripPwd(user), token: sign(user) });
        } catch (e) { res.status(500).json({ error: e.message }); }
    });

// ── Verify existing token (for "view patient dashboard" handoff) ────
router.post('/verify-patient-credentials',
    requireFields('identifier', 'password'),
    async (req, res) => {
        const { data: user } = await db.getUserByEmailOrUsername(req.body.identifier);
        if (!user || user.role !== 'patient') return res.status(404).json({ error: 'patient not found' });
        const ok = await bcrypt.compare(req.body.password, user.password_hash);
        if (!ok) return res.status(401).json({ error: 'invalid credentials' });
        res.json({ user: stripPwd(user), token: sign(user) });
    });

function stripPwd(u) { if (!u) return u; const { password_hash, ...rest } = u; return rest; }

module.exports = router;
