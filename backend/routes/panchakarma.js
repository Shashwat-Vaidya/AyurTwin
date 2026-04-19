/**
 * Panchakarma Routes - Assessment
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { calculateDoshaStatus, determineAgniType, calculateAmaLevel, calculateOjasLevel } = require('../engines/ayurvedicEngine');
const { assessPanchakarmaReadiness } = require('../engines/panchakarmaEngine');

// GET /api/panchakarma/:userId
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await db.fetchCompleteUserProfile(userId);
    if (!profile.user) return res.status(404).json({ success: false, error: 'User not found' });

    const doshaStatus = calculateDoshaStatus(profile.prakriti, profile.symptoms, profile.lifestyle, profile.sleep, profile.ayurvedic);
    const agniType = determineAgniType(doshaStatus, profile.symptoms, profile.ayurvedic);
    const amaLevel = calculateAmaLevel(profile.symptoms, profile.lifestyle, profile.ayurvedic);
    const ojasLevel = calculateOjasLevel(profile.user, profile.symptoms, profile.lifestyle, profile.sleep);

    const assessment = assessPanchakarmaReadiness(doshaStatus, amaLevel, ojasLevel, agniType, profile.user, profile.symptoms);

    // Store assessment (best-effort)
    try {
      await db.savePanchakarmaAssessment({
        user_id: userId,
        ama_score: assessment.ama_score,
        ojas_score: assessment.ojas_score,
        agni_score: assessment.agni_score,
        readiness_score: assessment.readiness_score,
        recommended_therapies: assessment.recommended_therapies.map(t => t.name),
        contraindicated_therapies: assessment.contraindicated_therapies,
        preparatory_steps: assessment.preparatory_steps,
        dosha_specific_protocol: assessment.dosha_specific_protocol,
        assessment_details: assessment.details,
      });
    } catch (_) { /* non-critical */ }

    res.json({ success: true, data: assessment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
