/**
 * Health Score (1 - 500) — additive, with input-driven contributions.
 *
 * Components (each can be positive or negative):
 *   vitals          : -40 .. +90    (HR, SpO2, body_temperature)
 *   bmi             : -25 .. +60    (closeness to 18.5–25)
 *   lifestyle       : -50 .. +120   (sleep, stress, anxiety, water, exercise, junk, smoking, alcohol)
 *   disease_penalty : -160 .. 0     (sum of high-risk diseases)
 *   dinacharya_bonus: 0   .. +50    (% of routine completed today)
 *   prakriti_bonus  : -10 .. +30    (alignment / dosha balance)
 *
 * Base constant: 250. Final = clamp(1, 500).
 * Same inputs always produce the same score (deterministic).
 */

const { safeNum, bmi, activityScore } = require('./common');

function vitals(sensor) {
    if (!sensor || sensor.heart_rate == null) return -10;       // no data → small penalty
    const hr = safeNum(sensor.heart_rate, 72);
    const spo2 = safeNum(sensor.spo2, 97);
    const temp = safeNum(sensor.body_temperature, 36.8);

    const hrPts = 50 - Math.min(50, Math.abs(hr - 72) * 1.4);   // 0..50
    const spPts = spo2 >= 97 ? 30 : spo2 >= 95 ? 22 : spo2 >= 92 ? 12 : -10;
    const tpPts = Math.abs(temp - 36.8) < 0.4 ? 10 : Math.abs(temp - 36.8) < 0.9 ? 4 : -10;
    return Math.round(hrPts + spPts + tpPts);                   // -30..90
}

function bmiScore(user) {
    const b = bmi(user.height_cm, user.weight_kg);
    if (!b) return 0;
    if (b >= 18.5 && b <= 24.9) return 60;
    if ((b >= 17 && b < 18.5) || (b >= 25 && b <= 28)) return 30;
    if ((b >= 15 && b < 17) || (b > 28 && b <= 32)) return 0;
    return -25;
}

function lifestyle(profile, sensor) {
    if (!profile) return 0;
    const sleep = safeNum(profile.sleep_hours, 7);
    const stress = safeNum(profile.stress_level, 5);
    const anxiety = safeNum(profile.anxiety_level, 5);
    const exer = safeNum(profile.exercise_frequency, 3);
    const water = safeNum(profile.water_intake_l, 2);

    // Sleep (-25 .. +30) — quadratic around 7.5h
    const sleepPts = Math.round(30 - Math.abs(sleep - 7.5) * 8);
    // Stress (-25 .. +25) — flat lower, drops above 5
    const stressPts = Math.round(25 - stress * 4 - anxiety * 1.2);
    // Activity (-10 .. +30) — sensor + self-reported
    const actPts = Math.round(Math.min(30, activityScore(sensor || {}) * 8 + exer * 2) - 5);
    // Water (-5 .. +15)
    const waterPts = Math.round(Math.max(-5, Math.min(15, (water - 1.5) * 8)));
    // Junk (-15 .. +15)
    const junkMap = { low: 15, medium: 0, high: -15 };
    const junkPts = junkMap[profile.junk_food_frequency] ?? 0;
    // Smoking (-30 / 0)
    const smkPts = profile.smoking ? -30 : 0;
    // Alcohol (-20..0)
    const alcMap = { none: 0, occasional: -8, frequent: -20 };
    const alcPts = alcMap[profile.alcohol] ?? 0;
    // Symptoms (small penalty each, max -25)
    let symPts = 0;
    ['sym_frequent_thirst','sym_frequent_urination','sym_joint_pain','sym_breathing_difficulty','sym_digestive_issue']
        .forEach(k => { if (profile[k]) symPts -= 5; });

    return sleepPts + stressPts + actPts + waterPts + junkPts + smkPts + alcPts + symPts;
}

function diseasePenalty(risks = {}) {
    const weights = { diabetes: 1.4, heart: 1.6, hypertension: 1.3, stress: 1.0,
                      asthma: 1.0, arthritis: 0.8, obesity: 1.0, digestive: 0.7,
                      sleep: 0.9, fever: 0.6 };
    let total = 0;
    for (const [k, w] of Object.entries(weights)) {
        const r = safeNum(risks[k], 0);
        if (r > 70)      total -= (r - 70) * w * 0.8 + 12 * w;
        else if (r > 50) total -= (r - 50) * w * 0.5 + 6 * w;
        else if (r > 30) total -= (r - 30) * w * 0.2;
    }
    return Math.max(-160, Math.round(total));
}

function dinacharyaBonus(pct) {
    return Math.round(Math.max(0, Math.min(50, safeNum(pct, 0) * 0.5)));
}

function prakritiBonus(user, risks = {}) {
    if (!user?.prakriti) return -10;
    const hi = Object.values(risks).filter(v => v > 60).length;
    const mid = Object.values(risks).filter(v => v > 40 && v <= 60).length;
    if (hi === 0 && mid <= 1) return 30;
    if (hi <= 1 && mid <= 2) return 15;
    if (hi <= 2) return 0;
    return -10;
}

function compute({ user = {}, profile = {}, sensor = {}, risks = {}, dinacharyaPct = 0 } = {}) {
    const v = vitals(sensor);
    const bm = bmiScore(user);
    const ls = lifestyle(profile, sensor);
    const dp = diseasePenalty(risks);
    const db = dinacharyaBonus(dinacharyaPct);
    const pb = prakritiBonus(user, risks);
    const raw = 250 + v + bm + ls + dp + db + pb;
    const score = Math.max(1, Math.min(500, Math.round(raw)));

    return {
        score,
        max_score: 500,
        breakdown: {
            base: 250,
            vitals: v,
            bmi: bm,
            lifestyle: ls,
            disease_penalty: dp,
            dinacharya_bonus: db,
            prakriti_bonus: pb,
        },
        explanations: explainComponents(profile, sensor, user, risks, dinacharyaPct),
    };
}

function explainComponents(profile, sensor, user, risks, dinacharyaPct) {
    const out = [];
    const hr = safeNum(sensor?.heart_rate);
    const spo2 = safeNum(sensor?.spo2);
    const sleep = safeNum(profile?.sleep_hours);
    const stress = safeNum(profile?.stress_level);
    const b = bmi(user?.height_cm, user?.weight_kg);

    if (hr) out.push(`Heart rate ${hr} bpm — ${Math.abs(hr - 72) < 8 ? 'in optimal range' : 'outside resting band 65–80'}`);
    if (spo2) out.push(`SpO₂ ${spo2}% — ${spo2 >= 97 ? 'optimal' : spo2 >= 95 ? 'acceptable' : 'low; needs monitoring'}`);
    if (b) out.push(`BMI ${b} — ${b >= 18.5 && b <= 24.9 ? 'normal' : b > 25 ? 'overweight zone' : 'underweight zone'}`);
    if (sleep) out.push(`Sleep ${sleep} hrs — ${sleep >= 7 && sleep <= 8 ? 'within ideal 7–8' : sleep < 6 ? 'deficit' : 'excessive'}`);
    if (stress) out.push(`Stress ${stress}/10 — ${stress > 7 ? 'high (penalty)' : stress > 4 ? 'moderate' : 'low (bonus)'}`);
    if (profile?.smoking) out.push('Smoking — −30 pts');
    if (profile?.alcohol === 'frequent') out.push('Frequent alcohol — −20 pts');
    const hiRisks = Object.entries(risks || {}).filter(([_, v]) => v > 60);
    if (hiRisks.length) out.push(`High-risk diseases: ${hiRisks.map(([k, v]) => `${k} (${v}%)`).join(', ')} — penalty applied`);
    if (dinacharyaPct) out.push(`Dinacharya ${dinacharyaPct}% complete today — bonus`);
    return out;
}

module.exports = { compute };
