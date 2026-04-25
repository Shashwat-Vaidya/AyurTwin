/**
 * Yoga Recommendation Engine
 * Returns 2-6 practices split into morning / evening / therapeutic.
 */

const fs = require('fs');
const path = require('path');
const { doshaScores, dominantDosha, safeNum, activityScore } = require('./common');

let YOGA_CACHE;
function loadYoga() {
    if (!YOGA_CACHE) {
        YOGA_CACHE = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'datasets', 'yoga.json'), 'utf8'));
    }
    return YOGA_CACHE;
}

function score(y, ctx) {
    const { dominant, stress, anxiety, sleep, activity, risks } = ctx;
    const prakriti = ctx.prakriti;

    let doshaMatch = 0;
    if (y.avoid_for?.includes(dominant)) doshaMatch = 0;
    else if (y.best_for?.includes(dominant)) doshaMatch = 1;
    else if (y.best_for?.includes(prakriti)) doshaMatch = 0.7;
    else doshaMatch = 0.4;

    let stressMatch = 0.5;
    const calming = y.benefits?.some(b => /stress|calm|anxi|relax|sleep/i.test(b));
    if ((stress > 7 || anxiety > 7) && calming) stressMatch = 1;
    if ((stress > 7 || anxiety > 7) && y.intensity === 'high') stressMatch = 0.1;

    let sleepMatch = 0.5;
    if (sleep < 6 && /sleep|relax|nidra|calm/i.test((y.benefits || []).join(' '))) sleepMatch = 1;
    if (sleep < 6 && y.intensity === 'high' && y.time_of_day === 'evening') sleepMatch = 0;

    let activityMatch = 0.5;
    if (activity < 1   && y.intensity === 'medium') activityMatch = 0.9;
    if (activity < 1   && y.intensity === 'high')   activityMatch = 1;
    if (activity > 2.2 && y.intensity === 'low')    activityMatch = 1;

    let diseaseMatch = 0.3;
    const benefitText = (y.benefits || []).join(' ').toLowerCase();
    if ((risks?.stress || 0)     > 60 && /stress|anxi|calm/i.test(benefitText))          diseaseMatch = 1;
    if ((risks?.heart || 0)      > 60 && /breath|pranayama/i.test(y.type + benefitText)) diseaseMatch = 1;
    if ((risks?.arthritis || 0)  > 60 && /joint|mobility/i.test(benefitText))            diseaseMatch = 1;
    if ((risks?.sleep || 0)      > 60 && /nidra|sleep/i.test(benefitText))               diseaseMatch = 1;

    return 0.30 * doshaMatch + 0.25 * stressMatch + 0.20 * sleepMatch +
           0.15 * activityMatch + 0.10 * diseaseMatch;
}

function recommend({ user, profile, sensor, risks = {} }, yogaList) {
    const list = yogaList || loadYoga();
    const scores = doshaScores({ profile, sensor });
    const dom = dominantDosha(scores);
    const prakriti = (user?.prakriti || dom).split('-')[0];
    const stress = safeNum(profile?.stress_level, 5);
    const anxiety = safeNum(profile?.anxiety_level, 5);
    const sleep = safeNum(profile?.sleep_hours, 7);
    const activity = activityScore(sensor || {});

    const ctx = { dominant: dom, prakriti, stress, anxiety, sleep, activity, risks };

    // filter impossible items
    const filtered = list.filter(y => !(y.avoid_for || []).includes(prakriti));
    const ranked = filtered.map(y => ({ y, s: score(y, ctx) })).sort((a, b) => b.s - a.s);

    const picks = (fn) => ranked.filter(fn).slice(0, 3).map(r => ({
        name: r.y.name,
        type: r.y.type,
        benefits: r.y.benefits,
        duration_min: r.y.duration_min,
        intensity: r.y.intensity,
        score: +r.s.toFixed(2),
    }));

    const morning = picks(r => r.y.time_of_day === 'morning' || r.y.time_of_day === 'both');
    const evening = picks(r => r.y.time_of_day === 'evening' || r.y.time_of_day === 'both');
    const therapeutic = picks(r => r.y.type === 'meditation' || r.y.type === 'pranayama');

    return { dominant_dosha: dom, prakriti, morning, evening, therapeutic };
}

module.exports = { recommend };
