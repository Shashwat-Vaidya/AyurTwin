/**
 * Dashboard Routes - Complete health analysis
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { calculateDoshaStatus, determineAgniType, calculateAmaLevel, calculateOjasLevel, predictDiseaseRisks, getCurrentRitu } = require('../engines/ayurvedicEngine');
const { fusePredictions } = require('../engines/fusionEngine');
const { createLogger } = require('../utils/logger');

const log = createLogger('dashboard');

// GET /api/dashboard/:userId
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await db.fetchCompleteUserProfile(userId);

    if (!profile.user) return res.status(404).json({ success: false, error: 'User not found' });

    // Calculate dosha status
    const doshaStatus = calculateDoshaStatus(
      profile.prakriti, profile.symptoms, profile.lifestyle, profile.sleep, profile.ayurvedic
    );

    // Calculate Agni, Ama, Ojas
    const agniType = determineAgniType(doshaStatus, profile.symptoms, profile.ayurvedic);
    const amaLevel = calculateAmaLevel(profile.symptoms, profile.lifestyle, profile.ayurvedic);
    const ojasLevel = calculateOjasLevel(profile.user, profile.symptoms, profile.lifestyle, profile.sleep);

    // Predict diseases
    const { risks, healthScore } = predictDiseaseRisks(
      profile.user, doshaStatus, profile.symptoms, profile.lifestyle,
      profile.sleep, profile.familyHistory, profile.ayurvedic
    );

    // Get latest sensor data and fuse predictions
    const { data: latestSensor } = await db.getLatestSensor(userId);
    let fusedRisks = risks;
    let sensorAlerts = [];
    let doshaFromSensor = null;

    if (latestSensor) {
      const fusion = fusePredictions(risks, latestSensor, profile.user);
      fusedRisks = fusion.fusedRisks;
      sensorAlerts = fusion.alerts;
      doshaFromSensor = fusion.doshaFromSensor;
    }

    // Get current season
    const ritu = getCurrentRitu();

    // Store disease prediction (best-effort)
    try {
      await db.savePrediction({
        user_id: userId,
        diabetes_risk: fusedRisks.diabetes,
        hypertension_risk: fusedRisks.hypertension,
        heart_disease_risk: fusedRisks.heart_disease,
        stress_risk: fusedRisks.stress,
        sleep_disorder_risk: fusedRisks.sleep_disorder,
        asthma_risk: fusedRisks.asthma,
        arthritis_risk: fusedRisks.arthritis,
        obesity_risk: fusedRisks.obesity,
        digestive_disorder_risk: fusedRisks.digestive_disorder,
        fever_risk: fusedRisks.fever,
        thyroid_risk: fusedRisks.thyroid,
        overall_health_score: healthScore,
        prediction_method: 'hybrid_fusion',
        model_confidence: 0.85,
      });
    } catch (_) { /* non-critical */ }

    // Store dosha balance (best-effort)
    try {
      await db.saveDoshaBalance({
        user_id: userId,
        vata_level: doshaStatus.vata,
        pitta_level: doshaStatus.pitta,
        kapha_level: doshaStatus.kapha,
        agni_strength: agniType.type,
        ama_level: amaLevel.level,
        ojas_level: ojasLevel.level,
        imbalance_detected: doshaStatus.imbalanced,
        imbalance_type: doshaStatus.imbalanced ? `${doshaStatus.dominant} aggravated` : null,
      });
    } catch (_) { /* non-critical */ }

    res.json({
      success: true,
      data: {
        profile: profile.user,
        prakriti: profile.prakriti,
        doshaStatus,
        agni: agniType,
        ama: amaLevel,
        ojas: ojasLevel,
        risks: fusedRisks,
        healthScore,
        season: ritu,
        sensor: latestSensor || null,
        sensorAlerts,
        doshaFromSensor,
        summary: {
          dominant_dosha: doshaStatus.dominant,
          dosha_imbalance: doshaStatus.imbalanced,
          top_risks: Object.entries(fusedRisks)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, value]) => ({ name, value })),
        },
      },
    });
  } catch (err) {
    log.error('Dashboard error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
