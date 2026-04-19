/**
 * Fusion Engine - Ported from AyurTwin 3.0 Python backend
 *
 * Two-stage fusion pipeline:
 *   Stage 1 - Hard sensor rules (clinical thresholds)
 *   Stage 2 - Weighted score fusion: ML risk + Ayurveda dosha boost
 *
 * Combines sensor data with Ayurvedic dosha analysis
 * for enhanced disease risk assessment
 */
const { SENSOR_THRESHOLDS } = require('../config/constants');

// ─── Hard clinical threshold rules ───────────────────────────────────
const SENSOR_RULES = [
  {
    label: 'respiratory_issue',
    check: (s) => (s.spo2 || 100) < SENSOR_THRESHOLDS.spo2.critical,
    boost: 40,
    alert: (s) => `Critical: SpO2 ${s.spo2?.toFixed(1)}% — possible hypoxia. Seek medical attention.`,
  },
  {
    label: 'asthma',
    check: (s) => (s.spo2 || 100) < SENSOR_THRESHOLDS.spo2.low,
    boost: 25,
    alert: (s) => `Low SpO2 (${s.spo2?.toFixed(1)}%) — elevated respiratory risk.`,
  },
  {
    label: 'fever',
    check: (s) => (s.temperature || 37) > SENSOR_THRESHOLDS.temperature.fever,
    boost: 35,
    alert: (s) => `Elevated temperature ${s.temperature?.toFixed(1)}C — possible fever or infection.`,
  },
  {
    label: 'hypertension',
    check: (s) => (s.heart_rate || 75) > SENSOR_THRESHOLDS.heart_rate.high,
    boost: 20,
    alert: (s) => `Tachycardia detected (HR ${s.heart_rate?.toFixed(0)} bpm) — hypertension risk elevated.`,
  },
  {
    label: 'heart_disease',
    check: (s) => (s.heart_rate || 75) > SENSOR_THRESHOLDS.heart_rate.high || (s.heart_rate || 75) < SENSOR_THRESHOLDS.heart_rate.low,
    boost: 20,
    alert: (s) => `Abnormal heart rate (${s.heart_rate?.toFixed(0)} bpm) — cardiovascular alert.`,
  },
  {
    label: 'stress',
    check: (s) => (s.heart_rate || 75) > 95 && (s.temperature || 37) > 37.3,
    boost: 15,
    alert: (s) => `Elevated HR and temperature suggest physiological stress response.`,
  },
];

// ─── Ayurveda dosha boost map ────────────────────────────────────────
const AYUR_BOOST_MAP = {
  stress: { Vata: 15, Pitta: 10 },
  sleep_disorder: { Vata: 15, Kapha: 10 },
  hypertension: { Pitta: 15 },
  fever: { Pitta: 20 },
  diabetes: { Kapha: 15 },
  obesity: { Kapha: 25 },
  heart_disease: { Vata: 10, Pitta: 10 },
  asthma: { Kapha: 20 },
  digestive_disorder: { Vata: 10, Pitta: 10 },
  arthritis: { Vata: 20 },
  thyroid: { Vata: 10, Kapha: 15 },
};

/**
 * Quick dosha score from live sensor data + BMI
 */
function scoreDoshas(sensor, userProfile) {
  const hr = sensor.heart_rate || 75;
  const temp = sensor.temperature || 37.0;
  const spo2 = sensor.spo2 || 98;
  const bmi = userProfile?.bmi || 22;

  let vata = 0, pitta = 0, kapha = 0;

  if (hr > 95) vata += 25;
  if (temp < 36.5) vata += 15;
  if (bmi < 18.5) vata += 20;

  if (temp > 37.5) pitta += 30;
  if (hr > 100) pitta += 20;

  if (bmi > 27) kapha += 30;
  if (spo2 < 95) kapha += 20;

  return {
    Vata: Math.min(vata, 100),
    Pitta: Math.min(pitta, 100),
    Kapha: Math.min(kapha, 100),
  };
}

/**
 * Fuse disease risk predictions with sensor rules and Ayurvedic boosts
 *
 * @param {Object} risks - Disease risk scores { diabetes: 35, hypertension: 42, ... }
 * @param {Object} sensor - Live sensor data { heart_rate, spo2, temperature, accel_x/y/z }
 * @param {Object} userProfile - User row from Supabase (needs bmi)
 * @returns {{ fusedRisks, alerts, doshaFromSensor }}
 */
function fusePredictions(risks, sensor, userProfile) {
  const fusedRisks = { ...risks };
  const alerts = [];

  // Stage 1: Hard sensor rule overrides
  for (const rule of SENSOR_RULES) {
    if (!(rule.label in fusedRisks)) continue;
    if (rule.check(sensor)) {
      fusedRisks[rule.label] = Math.min(100, fusedRisks[rule.label] + rule.boost);
      const alertMsg = rule.alert(sensor);
      if (!alerts.includes(alertMsg)) alerts.push(alertMsg);
    }
  }

  // Stage 2: Ayurveda dosha boost (30% weight)
  const doshaScores = scoreDoshas(sensor, userProfile);

  for (const [disease, boosts] of Object.entries(AYUR_BOOST_MAP)) {
    if (!(disease in fusedRisks)) continue;

    let ayurBoost = 0;
    for (const [dosha, pts] of Object.entries(boosts)) {
      ayurBoost += ((doshaScores[dosha] || 0) / 100) * pts;
    }

    // Weighted blend: 70% original + 30% Ayurveda boost
    fusedRisks[disease] = Math.round(
      Math.min(100, fusedRisks[disease] * 0.7 + ayurBoost * 0.3) * 10
    ) / 10;
  }

  return {
    fusedRisks,
    alerts,
    doshaFromSensor: doshaScores,
  };
}

module.exports = { fusePredictions, scoreDoshas };
