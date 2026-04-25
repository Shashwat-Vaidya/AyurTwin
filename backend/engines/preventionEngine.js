/**
 * Disease Prevention Engine.
 * Aggregates personalized prevention advice from disease risks + profile.
 */

const fs = require('fs');
const path = require('path');
const { safeNum, bmi } = require('./common');

let PREV_CACHE;
function loadPrev() {
    if (!PREV_CACHE) {
        PREV_CACHE = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'datasets', 'prevention.json'), 'utf8'));
    }
    return PREV_CACHE;
}

const DISEASE_ALIAS = {
    diabetes: 'Diabetes', heart: 'Heart Disease', hypertension: 'Hypertension',
    stress: 'Stress Disorder', sleep: 'Sleep Disorder', asthma: 'Asthma',
    arthritis: 'Arthritis', obesity: 'Obesity', digestive: 'Digestive Disorder', fever: 'Fever',
};

function priority(pct) {
    if (pct > 60) return 'high';
    if (pct > 30) return 'moderate';
    return 'low';
}

function generate({ user = {}, profile = {}, risks = {} }, dataset) {
    const data = dataset || loadPrev();
    const byDisease = Object.fromEntries(data.map(d => [d.disease, d]));

    const high = [], moderate = [];
    const prevention = new Set(), lifestyle = new Set(), ayurvedic = new Set();
    const alerts = [];

    for (const [k, pct] of Object.entries(risks)) {
        const p = priority(pct);
        const diseaseName = DISEASE_ALIAS[k];
        if (!diseaseName) continue;
        if (p === 'high') high.push({ disease: diseaseName, risk: pct });
        else if (p === 'moderate') moderate.push({ disease: diseaseName, risk: pct });
        if (p === 'high' || p === 'moderate') {
            const entry = byDisease[diseaseName];
            if (entry) {
                (entry.prevention || []).forEach(x => prevention.add(x));
                (entry.lifestyle || []).forEach(x => lifestyle.add(x));
                (entry.ayurvedic || []).forEach(x => ayurvedic.add(x));
            }
        }
    }

    // cross-rules
    const b = bmi(user.height_cm, user.weight_kg);
    if (b && b > 30 && (risks.diabetes || 0) > 50) prevention.add('Start a 12-week weight-loss plan (500 kcal/day deficit)');
    if (safeNum(profile.stress_level) > 8 && safeNum(profile.sleep_hours, 7) < 6) {
        lifestyle.add('Schedule sleep hygiene: fixed bedtime + Yoga Nidra daily');
        ayurvedic.add('Ashwagandha 300mg + warm-oil foot massage before bed');
    }
    if ((risks.asthma || 0) > 60 && profile.smoking) alerts.push('Smoking + asthma risk: consult pulmonologist now');
    if ((risks.heart || 0) > 70) alerts.push('High cardiac risk - schedule ECG + lipid profile this week');
    if (safeNum(profile.water_intake_l, 2) < 1.5) lifestyle.add('Increase water to at least 2.5 L/day');

    // dosha layer
    switch (user.prakriti) {
        case 'vata':  ayurvedic.add('Favor warm cooked grounding foods; avoid cold/raw/dry'); break;
        case 'pitta': ayurvedic.add('Favor cooling sweet bitter foods; avoid spicy/oily/fried'); break;
        case 'kapha': ayurvedic.add('Favor light warm pungent foods; avoid heavy/sweet/dairy-heavy'); break;
    }

    return {
        high_priority: high.sort((a, b) => b.risk - a.risk).map(h => h.disease),
        moderate_priority: moderate.sort((a, b) => b.risk - a.risk).map(m => m.disease),
        prevention: [...prevention],
        lifestyle: [...lifestyle],
        ayurvedic: [...ayurvedic],
        alerts,
    };
}

module.exports = { generate };
