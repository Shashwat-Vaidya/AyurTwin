/**
 * Family Routes - Invites, approvals, connections
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');
const supabase = require('../config/supabase');

// POST /api/family/invite
router.post('/invite', async (req, res) => {
  try {
    const { patient_id, email, relationship } = req.body;

    const { data: familyUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!familyUser) return res.status(404).json({ success: false, error: 'User not found' });

    const { error } = await db.createFamilyConnection({
      patient_id,
      family_member_id: familyUser.id,
      relationship,
      status: 'pending',
    });

    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/family/accept
router.post('/accept', async (req, res) => {
  try {
    const { connection_id } = req.body;
    const { error } = await db.updateFamilyConnection(connection_id, 'accepted');
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/family/reject
router.post('/reject', async (req, res) => {
  try {
    const { connection_id } = req.body;
    const { error } = await db.updateFamilyConnection(connection_id, 'rejected');
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/family/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { data, error } = await db.getFamilyConnections(req.params.userId);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/family/pending/:userId
router.get('/pending/:userId', async (req, res) => {
  try {
    const { data, error } = await db.getPendingInvites(req.params.userId);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
