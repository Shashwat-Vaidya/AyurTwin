/**
 * Family invite + approval workflow.
 *
 * Flow:
 *   Patient enters family member's email (must already be registered as role='family').
 *   Backend checks users table:
 *     - if family user found  → create link with family_user_id set and status='pending'
 *       and send them an invite email.
 *     - if not found          → refuse with 404 so patient tells them to register first.
 *   The family user sees the pending invite in their Family Dashboard and approves/rejects.
 *   After approval, family can view the patient's dashboard (credential check handled
 *   client-side via /auth/verify-patient-credentials).
 */
const express = require('express');
const db = require('../services/db');
const { authenticate } = require('../middleware/auth');
const { sendMail, familyInviteEmail } = require('../services/mailer');

const router = express.Router();

router.post('/invite', authenticate, async (req, res) => {
    if (req.user.role !== 'patient') return res.status(403).json({ error: 'only patients can invite' });
    const { family_email, family_name, family_age, family_role } = req.body;
    if (!family_email) return res.status(400).json({ error: 'family_email required' });

    // 1. The family email must already be a registered family user
    const { data: familyUser } = await db.getUserByEmail(family_email);
    if (!familyUser) {
        return res.status(404).json({
            error: 'No family account with this email. Ask them to sign up as a Family Member first.',
        });
    }
    if (familyUser.role !== 'family') {
        return res.status(400).json({ error: 'This email is a patient account, not a family account.' });
    }

    // 2. Create the link (pending)
    const { data: invite, error } = await db.inviteFamily({
        patient_id: req.user.id,
        family_email: family_email.toLowerCase(),
        family_user_id: familyUser.id,
        family_name: family_name || familyUser.full_name,
        family_age: family_age || familyUser.age,
        family_role,
        status: 'pending',
    });
    if (error) return res.status(400).json({ error: error.message });

    // 3. Email the family member (best-effort; never blocks the API)
    try {
        const { data: patient } = await db.getUserById(req.user.id);
        const { html, text } = familyInviteEmail({
            patientName: patient?.full_name || patient?.username || 'A patient',
            familyEmail: family_email,
            familyName: family_name || familyUser.full_name,
            familyRole: family_role,
        });
        await sendMail({
            to: family_email,
            subject: `${patient?.full_name || 'A patient'} invited you on AyurTwin`,
            html, text,
        });
    } catch (mailErr) {
        console.warn('[family/invite] mail failed:', mailErr.message);
    }

    res.status(201).json({ invite, emailed: true });
});

router.get('/my-family', authenticate, async (req, res) => {
    const { data } = await db.listFamilyForPatient(req.user.id);
    res.json({ family: data || [] });
});

router.get('/invites', authenticate, async (req, res) => {
    if (req.user.role !== 'family') return res.status(403).json({ error: 'family only' });
    const { data } = await db.listFamilyInvites(req.user.id, req.user.email);
    res.json({ invites: (data || []).filter(r => r.status === 'pending') });
});

router.post('/respond', authenticate, async (req, res) => {
    const { invite_id, action } = req.body;
    if (!['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'bad action' });
    const status = action === 'approve' ? 'approved' : 'rejected';
    const { data, error } = await db.respondInvite(invite_id, status, req.user.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ invite: data });
});

router.get('/patients', authenticate, async (req, res) => {
    if (req.user.role !== 'family') return res.status(403).json({ error: 'family only' });
    const { data } = await db.listApprovedPatientsForFamily(req.user.id);
    res.json({ patients: data || [] });
});

module.exports = router;
