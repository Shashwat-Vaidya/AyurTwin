const express = require('express');
const db = require('../services/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/today', authenticate, async (req, res) => {
    const { data } = await db.getTodayDinacharya(req.user.id);
    res.json({ entry: data });
});

router.post('/', authenticate, async (req, res) => {
    const { tasks } = req.body;
    if (!tasks || typeof tasks !== 'object') return res.status(400).json({ error: 'tasks object required' });
    const keys = Object.keys(tasks);
    const done = keys.filter(k => tasks[k] === true).length;
    const pct = keys.length ? Math.round(done / keys.length * 100) : 0;
    const date = new Date().toISOString().slice(0, 10);
    const { error } = await db.upsertDinacharya(req.user.id, date, tasks, pct);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ completion_pct: pct });
});

module.exports = router;
