const express = require('express');
const db = require('../services/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Community feed
router.get('/', async (_req, res) => {
    const { data } = await db.listPosts();
    res.json({ posts: data || [] });
});

// Create a post (must be logged in)
router.post('/', authenticate, async (req, res) => {
    const { title, body, tags } = req.body;
    if (!body) return res.status(400).json({ error: 'body required' });
    const { data: user } = await db.getUserById(req.user.id);
    const { data, error } = await db.createPost({
        user_id: req.user.id,
        author_name: user?.full_name || user?.username,
        title, body, tags: tags || [],
    });
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ post: data });
});

router.post('/:id/like', authenticate, async (req, res) => {
    await db.likePost(req.params.id);
    res.json({ ok: true });
});

module.exports = router;
