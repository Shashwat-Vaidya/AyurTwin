/**
 * Disease Risk Engine
 *
 * Primary: ML logistic regression (model.json produced by scripts/trainModel.js).
 * Fallback: pure rule-based scoring if model is missing.
 *
 * Output: { diabetes, heart, hypertension, stress, sleep, asthma, arthritis,
 *           obesity, digestive, fever } — each 0..100
 * Also returns doshaModified scores and classification labels.
 */

const fs = require('fs');
const path = require('path');
const { predict: mlPredict } = require('../ml/trainer');
const { bmi, activityScore, safeNum, sleepScore } = require('./common');

const MODEL_PATH = path.join(__dirname, '..', 'ml', 'model.json');

let model = null;
function loadModel() {
    if (model) return model;
    try {
        model = JSON.parse(fs.readFileSync(MODEL_PATH, 'utf8'));
        return model;
    } catch {
        return null;
    }
}

function toFeatureVector({ user = {}, profile = {}, sensor = {} }) {
    const b = bmi(user.height_cm, user.weight_kg) || 24;
    const act = activityScore(sensor) || 1;
    const junkMap = { low: 0, medium: 1, high: 2 };
    return {
        age: safeNum(user.age, 30),
        bmi: b,
        activity_score: act,
        hr: safeNum(sensor.heart_rate, 72),
        spo2: safeNum(sensor.spo2, 97),
        temp: safeNum(sensor.body_temperature, 36.8),
        stress: safeNum(profile.stress_level, 5),
        anxiety: safeNum(profile.anxiety_level, 5),
        sleep_hours: safeNum(profile.sleep_hours, 7),
        junk_food: junkMap[profile.junk_food_frequency] ?? 1,
        smoking: profile.smoking ? 1 : 0,
        water_l: safeNum(profile.water_intake_l, 2),
        exercise_freq: safeNum(profile.exercise_frequency, 3),
        fh_diabetes: profile.fh_diabetes ? 1 : 0,
        fh_heart: profile.fh_heart_disease ? 1 : 0,
        fh_hypertension: profile.fh_hypertension ? 1 : 0,
        fh_asthma: profile.fh_asthma ? 1 : 0,
        fh_arthritis: profile.fh_arthritis ? 1 : 0,
        sym_thirst: profile.sym_frequent_thirst ? 1 : 0,
        sym_urination: profile.sym_frequent_urination ? 1 : 0,
        sym_joint_pain: profile.sym_joint_pain ? 1 : 0,
        sym_breath: profile.sym_breathing_difficulty ? 1 : 0,
        sym_digestive: profile.sym_digestive_issue ? 1 : 0,
    };
}

// Rule-based fallback if the ML model isn't loaded.
function ruleFallback(f) {
    const clamp = (x) => Math.max(0, Math.min(100, Math.round(x)));
    const hiHR = Math.max(0, f.hr - 75) / 0.4;
    const lowActivity = f.activity_score < 1.2 ? 1 : 0;
    return {
        diabetes: clamp(0.25 * (f.bmi - 22) * 4 + 0.15 * lowActivity * 100 +
            0.15 * f.junk_food * 33 + 20 * f.fh_diabetes +
            25 * (f.sym_thirst + f.sym_urination) / 2),
        heart: clamp(0.20 * hiHR + 0.20 * lowActivity * 100 + 20 * f.smoking +
            2 * f.stress + 20 * f.fh_heart + Math.max(0, f.age - 40) * 0.5),
        hypertension: clamp(0.22 * (f.bmi - 22) * 4 + 2.5 * f.stress +
            20 * f.fh_hypertension + 15 * f.smoking + Math.max(0, f.age - 40) * 0.6),
        stress: clamp(6 * f.stress + 2 * f.anxiety + Math.max(0, 7 - f.sleep_hours) * 5),
        sleep: clamp(Math.max(0, 8 - f.sleep_hours) * 10 + 2 * f.stress + 10 * f.junk_food),
        asthma: clamp(Math.max(0, 95 - f.spo2) * 8 + 30 * f.sym_breath + 20 * f.fh_asthma + 15 * f.smoking),
        arthritis: clamp(Math.max(0, f.age - 30) * 1.1 + 40 * f.sym_joint_pain +
            20 * f.fh_arthritis + 0.5 * (f.bmi - 22) * 4),
        obesity: clamp(Math.max(0, f.bmi - 23) * 7 + 10 * f.junk_food - 5 * f.activity_score),
        digestive: clamp(35 * f.sym_digestive + 3 * f.stress + 8 * f.junk_food - 5 * f.water_l),
        fever: clamp(Math.max(0, f.temp - 37) * 50 + Math.max(0, f.hr - 85) * 0.8),
    };
}

function ayurvedicAdjust(risks, prakriti) {
    const adj = { ...risks };
    const bump = (k, v) => adj[k] = Math.min(100, (adj[k] || 0) + v);
    switch (prakriti) {
        case 'vata':  bump('stress', 4); bump('arthritis', 5); break;
        case 'pitta': bump('hypertension', 5); bump('digestive', 4); break;
        case 'kapha': bump('diabetes', 5); bump('obesity', 5); break;
    }
    return adj;
}

function classify(pct) {
    if (pct <= 30) return 'low';
    if (pct <= 60) return 'moderate';
    if (pct <= 80) return 'high';
    return 'critical';
}

function predict(input) {
    const features = toFeatureVector(input);
    const mdl = loadModel();
    const base = mdl ? mlPredict(mdl, features) : ruleFallback(features);
    const adjusted = ayurvedicAdjust(base, input.user?.prakriti);
    const classified = Object.fromEntries(
        Object.entries(adjusted).map(([k, v]) => [k, { pct: v, label: classify(v) }])
    );
    return {
        model_used: mdl ? 'logreg-v1' : 'rule-fallback',
        features_snapshot: features,
        risks: adjusted,
        classified,
        explain: mdl ? explainAll(mdl, features, adjusted) : null,
    };
}

/**
 * Per-disease feature contribution table.
 * For each label, show the top features by signed contribution (w_i * x_i_standardized).
 */
function explainAll(model, rawFeatures, finalRisks) {
    const out = {};
    for (const labelKey of model.labels) {
        const m = model.models[labelKey];
        const contribs = model.features.map((f, j) => {
            const xRaw = rawFeatures[f] == null ? model.means[f] : rawFeatures[f];
            const xStd = (xRaw - model.means[f]) / model.stds[f];
            const c = m.w[j] * xStd;
            return { feature: f, raw_value: xRaw, contribution: +c.toFixed(3) };
        });
        contribs.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
        const diseaseName = labelKey.replace('label_', '');
        out[diseaseName] = {
            risk_pct: finalRisks[diseaseName],
            label: classify(finalRisks[diseaseName]),
            top_factors: contribs.slice(0, 6),
            intercept: +m.b.toFixed(3),
        };
    }
    return out;
}

module.exports = { predict, classify, ayurvedicAdjust };
