/**
 * Ritucharya (seasonal diet) Engine.
 */

const fs = require('fs');
const path = require('path');
const { currentSeason, doshaScores, dominantDosha, safeNum, bmi } = require('./common');

let RITU_CACHE;
function loadRitu() {
    if (!RITU_CACHE) {
        RITU_CACHE = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'datasets', 'ritucharya.json'), 'utf8'));
    }
    return RITU_CACHE;
}

const LABEL_SCORE = { best: 1.0, good: 0.66, moderate: 0.33, avoid: 0 };

function recommend({ user, profile, sensor }, season = currentSeason(), dataset) {
    const foods = dataset || loadRitu();
    const scores = doshaScores({ profile, sensor });
    const dom = dominantDosha(scores);
    const prakriti = (user?.prakriti || dom).split('-')[0];
    const temp = profile?.body_temp_tendency;
    const digestion = profile?.digestion_strength;
    const stress = safeNum(profile?.stress_level, 5);
    const b = bmi(user?.height_cm, user?.weight_kg) || 24;

    const out = { season, best: [], good: [], moderate: [], avoid: [] };

    for (const f of foods) {
        const inSeason = (f.seasons || []).includes(season);
        const blocked = (f.avoid_in || []).includes(season);
        if (blocked) { out.avoid.push({ name: f.food_name, reason: `avoid in ${season}` }); continue; }

        const seasonMatch = inSeason ? 1 : 0.3;
        const doshaMatch = LABEL_SCORE[f[dom]] ?? 0.4;
        let healthMatch = 0.5;
        const props = f.properties || [];
        if (digestion === 'weak' && props.includes('heavy')) healthMatch -= 0.3;
        if (temp === 'hot' && props.includes('cooling')) healthMatch += 0.3;
        if (temp === 'cold' && props.includes('warming')) healthMatch += 0.3;
        if (b > 28 && props.includes('oily')) healthMatch -= 0.2;
        if (stress > 7 && props.includes('warming') && dom === 'vata') healthMatch += 0.2;
        healthMatch = Math.max(0, Math.min(1, healthMatch));

        const final = 0.5 * seasonMatch + 0.3 * doshaMatch + 0.2 * healthMatch;
        const entry = { name: f.food_name, properties: props };
        if (final > 0.75) out.best.push(entry);
        else if (final > 0.5) out.good.push(entry);
        else if (final > 0.25) out.moderate.push(entry);
        else out.avoid.push(entry);
    }

    out.dominant_dosha = dom;
    out.prakriti = prakriti;
    return out;
}

module.exports = { recommend };
