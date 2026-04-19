/**
 * Disease Prevention Routes
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// GET /api/prevention/:userId
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const { data: predictions } = await db.getLatestPrediction(userId);
    const { data: protocols } = await db.getPreventionProtocols();

    if (!predictions || !protocols) {
      return res.status(404).json({ success: false, error: 'Required data not found' });
    }

    const riskMap = {
      'Diabetes': predictions.diabetes_risk,
      'Hypertension': predictions.hypertension_risk,
      'Heart Disease': predictions.heart_disease_risk,
      'Obesity': predictions.obesity_risk,
      'Stress & Anxiety': predictions.stress_risk,
      'Digestive Disorders': predictions.digestive_disorder_risk,
    };

    const preventionPlans = [];
    for (const protocol of protocols) {
      const risk = riskMap[protocol.disease_name];
      if (risk === undefined) continue;

      let riskLevel;
      if (risk >= 70) riskLevel = 'critical';
      else if (risk >= 50) riskLevel = 'high';
      else if (risk >= 30) riskLevel = 'moderate';
      else riskLevel = 'low';

      preventionPlans.push({
        disease: protocol.disease_name,
        ayurvedic_name: protocol.ayurvedic_name,
        associated_dosha: protocol.associated_dosha,
        risk_score: risk,
        risk_level: riskLevel,
        dietary_protocol: protocol.dietary_protocol,
        lifestyle_protocol: protocol.lifestyle_protocol,
        yoga_protocol: protocol.yoga_protocol,
        herbal_remedies: protocol.herbal_remedies,
        panchakarma_therapy: protocol.panchakarma_therapy,
        warning_signs: protocol.warning_signs,
      });
    }

    preventionPlans.sort((a, b) => b.risk_score - a.risk_score);
    res.json({ success: true, data: preventionPlans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
