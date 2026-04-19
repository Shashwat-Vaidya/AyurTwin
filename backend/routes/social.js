/**
 * Social Routes - Feed, Posts, Likes
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// GET /api/social/feed
router.get('/feed', async (req, res) => {
  try {
    const { data, error } = await db.getSocialFeed();
    if (error) return res.status(400).json({ success: false, error: error.message });
    // Only show posts from registered patients
    const patientPosts = (data || []).filter(post => post.user?.user_type === 'patient');
    res.json({ success: true, data: patientPosts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/social/post
router.post('/post', async (req, res) => {
  try {
    const { user_id, content, post_type, image_url } = req.body;
    const { data, error } = await db.createPost({ user_id, content, post_type, image_url });
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/social/like
router.post('/like', async (req, res) => {
  try {
    const { post_id, user_id } = req.body;
    await db.likePost(post_id, user_id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
