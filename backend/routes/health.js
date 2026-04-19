/**
 * Health Data Routes - Save lifestyle, sleep, symptoms, family history, ayurvedic data, prakriti quiz
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// POST /api/health/lifestyle
router.post('/lifestyle', async (req, res) => {
  try {
    const { user_id, ...data } = req.body;
    const { error } = await db.saveLifestyle(user_id, data);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/health/sleep-mental
router.post('/sleep-mental', async (req, res) => {
  try {
    const { user_id, ...data } = req.body;
    const { error } = await db.saveSleepMental(user_id, data);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/health/family-history
router.post('/family-history', async (req, res) => {
  try {
    const { user_id, ...data } = req.body;
    const { error } = await db.saveFamilyHistory(user_id, data);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/health/symptoms
router.post('/symptoms', async (req, res) => {
  try {
    const { user_id, ...data } = req.body;
    const { error } = await db.saveSymptoms(user_id, data);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/health/ayurvedic
router.post('/ayurvedic', async (req, res) => {
  try {
    const { user_id, ...data } = req.body;
    const { error } = await db.saveAyurvedic(user_id, data);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/prakriti/submit
router.post('/prakriti/submit', async (req, res) => {
  try {
    const { user_id, answers } = req.body;
    let vata = 0, pitta = 0, kapha = 0;
    answers.forEach((a) => {
      if (a === 'a') vata++;
      else if (a === 'b') pitta++;
      else if (a === 'c') kapha++;
    });

    const total = vata + pitta + kapha;
    const vata_percent = parseFloat(((vata / total) * 100).toFixed(1));
    const pitta_percent = parseFloat(((pitta / total) * 100).toFixed(1));
    const kapha_percent = parseFloat(((kapha / total) * 100).toFixed(1));

    const scores = { Vata: vata_percent, Pitta: pitta_percent, Kapha: kapha_percent };
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const d1 = sorted[0][1] - sorted[1][1];
    const d2 = sorted[1][1] - sorted[2][1];

    let prakriti;
    if (d1 < 5 && d2 < 5) prakriti = 'Tridosha';
    else if (d1 < 10) prakriti = `${sorted[0][0]}-${sorted[1][0]}`;
    else prakriti = sorted[0][0];

    const result = {
      user_id,
      answers: JSON.stringify(answers),
      vata_score: vata, pitta_score: pitta, kapha_score: kapha,
      vata_percent, pitta_percent, kapha_percent, prakriti,
    };

    const { error } = await db.savePrakritiQuiz(user_id, result);
    if (error) return res.status(400).json({ success: false, error: error.message });

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
