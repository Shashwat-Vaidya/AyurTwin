"""
services/fusion_engine.py
Two-stage fusion pipeline:

  Stage 1 — Hard sensor rules (clinical thresholds)
      SpO2 < 92  → always flag hypoxia
      Temp > 38  → always flag fever
      etc.

  Stage 2 — Weighted score fusion
      final_risk = (0.7 × ML_risk) + (0.3 × ayurveda_boost)
      Ayurveda boost is computed from the dosha sensor scoring.

The result is a modified copy of the ML disease list with updated
flags and risk scores.
"""

from typing import Any, Dict, List


# ─── Hard clinical threshold rules ───────────────────────────────────────────
# Maps disease label → (condition_fn, alert_message)

_SENSOR_RULES: List[Dict[str, Any]] = [
    {
        "label":   "low_oxygen_respiratory_stress",
        "check":   lambda s: s.get("spo2", 100) < 92,
        "boost":   40,
        "alert":   "⚠️ Critical: SpO2 {spo2:.1f}% — possible hypoxia. Seek medical attention.",
    },
    {
        "label":   "asthma_risk",
        "check":   lambda s: s.get("spo2", 100) < 94,
        "boost":   25,
        "alert":   "⚠️ Low SpO2 ({spo2:.1f}%) — elevated asthma / respiratory risk.",
    },
    {
        "label":   "fever_infection",
        "check":   lambda s: s.get("body_temp", 37) > 38.0,
        "boost":   35,
        "alert":   "🌡️ Elevated temperature {body_temp:.1f}°C — possible fever or infection.",
    },
    {
        "label":   "hypertension_risk",
        "check":   lambda s: s.get("heart_rate", 75) > 100,
        "boost":   20,
        "alert":   "❤️ Tachycardia detected (HR {heart_rate:.0f} bpm) — hypertension risk elevated.",
    },
    {
        "label":   "poor_cardiovascular_fitness",
        "check":   lambda s: s.get("heart_rate", 75) > 100 or s.get("heart_rate", 75) < 50,
        "boost":   20,
        "alert":   "❤️ Abnormal heart rate ({heart_rate:.0f} bpm) — cardiovascular alert.",
    },
    {
        "label":   "fatigue_low_energy",
        "check":   lambda s: s.get("body_temp", 37) < 36.0,
        "boost":   15,
        "alert":   "🥶 Low body temperature ({body_temp:.1f}°C) — possible fatigue or hypothermia.",
    },
]


# ─── Ayurveda boost map ───────────────────────────────────────────────────────
# Diseases that Ayurvedic analysis can boost based on dosha aggravation

_AYUR_BOOST_MAP: Dict[str, Dict[str, float]] = {
    # disease_label: {dosha: boost_points}
    "stress_anxiety":               {"Vata": 15, "Pitta": 10},
    "sleep_disorder":               {"Vata": 15, "Kapha": 10},
    "hypertension_risk":            {"Pitta": 15},
    "fever_infection":              {"Pitta": 20},
    "fatigue_low_energy":           {"Vata": 15, "Kapha": 10},
    "low_oxygen_respiratory_stress":{"Kapha": 20},
    "asthma_risk":                  {"Kapha": 20},
    "obesity_risk":                 {"Kapha": 25},
    "poor_cardiovascular_fitness":  {"Vata": 10, "Pitta": 10},
    "dosha_imbalance":              {"Vata": 10, "Pitta": 10, "Kapha": 10},
}


def _score_doshas(sensor: Dict[str, Any], user: Dict[str, Any]) -> Dict[str, float]:
    """Quick dosha score from sensor + BMI (0–100 scale)."""
    hr   = sensor.get("heart_rate", 75)
    temp = sensor.get("body_temp",  37.0)
    spo2 = sensor.get("spo2",       98)
    bmi  = float(user.get("bmi") or 22)

    vata = pitta = kapha = 0.0

    if hr > 95:     vata  += 25
    if temp < 36.5: vata  += 15
    if bmi < 18.5:  vata  += 20

    if temp > 37.5: pitta += 30
    if hr > 100:    pitta += 20

    if bmi > 27:    kapha += 30
    if spo2 < 95:   kapha += 20

    return {
        "Vata":  min(vata,  100),
        "Pitta": min(pitta, 100),
        "Kapha": min(kapha, 100),
    }


def fuse(
    ml_results: List[Dict[str, Any]],
    sensor: Dict[str, Any],
    user: Dict[str, Any],
) -> tuple[List[Dict[str, Any]], List[str]]:
    """
    Fuse ML predictions with sensor rules and Ayurvedic boosts.

    Parameters
    ----------
    ml_results : list of disease dicts from DiseaseModel.predict()
    sensor     : raw sensor dict  (heart_rate, spo2, body_temp, ...)
    user       : Supabase user row (needs bmi)

    Returns
    -------
    (fused_results, alerts)
      fused_results : same structure as ml_results with updated flag + risk_score
      alerts        : list of plain-text critical alert strings
    """
    # Work on a copy
    results = [{**r} for r in ml_results]
    alerts:  List[str] = []

    label_index = {r["label"]: i for i, r in enumerate(results)}

    # ── Stage 1: Hard sensor rule overrides ──────────────────────────────────
    for rule in _SENSOR_RULES:
        label = rule["label"]
        if label not in label_index:
            continue
        idx = label_index[label]

        if rule["check"](sensor):
            results[idx]["flag"] = 1
            # Boost risk score (cap at 100)
            results[idx]["risk_score"] = min(
                100.0,
                results[idx]["risk_score"] + rule["boost"]
            )
            # Format and add alert
            alert_msg = rule["alert"].format(
                spo2=sensor.get("spo2", 0),
                body_temp=sensor.get("body_temp", 0),
                heart_rate=sensor.get("heart_rate", 0),
            )
            if alert_msg not in alerts:
                alerts.append(alert_msg)

    # ── Stage 2: Ayurveda boost (additive, 30% weight) ───────────────────────
    dosha_scores = _score_doshas(sensor, user)

    for r in results:
        label = r["label"]
        boosts = _AYUR_BOOST_MAP.get(label, {})

        ayur_boost = sum(
            (dosha_scores.get(dosha, 0) / 100.0) * pts
            for dosha, pts in boosts.items()
        )

        # Weighted blend: 70% ML + 30% Ayurveda boost
        r["risk_score"] = round(
            min(100.0, (r["risk_score"] * 0.7) + (ayur_boost * 0.3)),
            1,
        )

        # Re-evaluate flag after fusion (threshold: 40%)
        if r["risk_score"] >= 40:
            r["flag"] = 1

    return results, alerts