/**
 * Ayurvedic Diet Engine
 * Classifies a foods dataset into best / good / moderate / avoid for a user.
 */

const path = require('path');
const fs = require('fs');
const { doshaScores, dominantDosha, safeNum, bmi } = require('./common');

let FOODS_CACHE;
function loadFoods() {
    if (!FOODS_CACHE) {
        FOODS_CACHE = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'datasets', 'foods.json'), 'utf8'));
    }
    return FOODS_CACHE;
}

const LABEL_SCORE = { best: 1.0, good: 0.66, moderate: 0.33, avoid: 0 };

function classify(user, profile, sensor, foodsList) {
    const foods = foodsList || loadFoods();
    const scores = doshaScores({ profile, sensor });
    const dom = dominantDosha(scores);
    const prakriti = (user?.prakriti || dom).split('-')[0];          // take first if dual
    const b = bmi(user?.height_cm, user?.weight_kg) || 24;
    const stress = safeNum(profile?.stress_level, 5);
    const digestion = profile?.digestion_strength;
    const diet = user?.diet_type || 'veg';

    const out = { best: [], good: [], moderate: [], avoid: [] };
    const buckets = [];

    for (const f of foods) {
        if (diet === 'veg' && f.veg === false) continue;

        const domLabel = f[dom];
        const praLabel = f[prakriti] || domLabel;
        let score = 0.6 * (LABEL_SCORE[domLabel] ?? 0.33) + 0.4 * (LABEL_SCORE[praLabel] ?? 0.33);

        // health modifiers
        const props = f.properties || [];
        if (digestion === 'weak' && (props.includes('heavy') || props.includes('oily'))) score -= 0.15;
        if (b > 28 && (props.includes('heavy') || props.includes('sweet'))) score -= 0.15;
        if (stress > 7 && props.includes('warming') && dom === 'vata') score += 0.1;
        if (stress > 7 && props.includes('pungent') && dom === 'pitta') score -= 0.1;

        score = Math.max(0, Math.min(1, score));
        buckets.push({ food: f, score });
    }

    for (const { food, score } of buckets) {
        const entry = { name: food.food_name, category: food.category, calories: food.calories, properties: food.properties };
        if (score >= 0.75) out.best.push(entry);
        else if (score >= 0.5)  out.good.push(entry);
        else if (score >= 0.25) out.moderate.push(entry);
        else out.avoid.push(entry);
    }

    return { dominant_dosha: dom, prakriti, dosha_scores: scores, ...out };
}

function searchFoods(query, foodsList) {
    const q = (query || '').toLowerCase().trim();
    if (!q) return [];
    return (foodsList || loadFoods())
        .filter(f => f.food_name.toLowerCase().includes(q))
        .slice(0, 20);
}

module.exports = { classify, searchFoods };
