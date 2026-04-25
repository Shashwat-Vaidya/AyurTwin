/**
 * Viruddha Ahar (food incompatibility) Engine.
 * Handles multi-food checks, dosha/digestion severity adjustment, autosuggest.
 */

const fs = require('fs');
const path = require('path');

let VIR_CACHE;
function loadVir() {
    if (!VIR_CACHE) {
        VIR_CACHE = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'datasets', 'viruddha.json'), 'utf8'));
    }
    return VIR_CACHE;
}

const SEVERITY_RANK = { low: 1, medium: 2, high: 3 };
const RANK_SEVERITY = { 1: 'low', 2: 'medium', 3: 'high' };

function norm(s) { return (s || '').toLowerCase().trim(); }

function check({ foods = [], prakriti, digestion_strength }, dataset) {
    const data = dataset || loadVir();
    const f = Array.from(new Set(foods.map(norm))).filter(Boolean);
    const results = [];

    for (let i = 0; i < f.length; i++) {
        for (let j = i + 1; j < f.length; j++) {
            const a = f[i], b = f[j];
            const hit = data.find(r =>
                (norm(r.food_1) === a && norm(r.food_2) === b) ||
                (norm(r.food_1) === b && norm(r.food_2) === a) ||
                (norm(r.food_1) === a && norm(r.food_2) === 'any food') ||
                (norm(r.food_1) === b && norm(r.food_2) === 'any food')
            );
            if (!hit) continue;

            let severity = SEVERITY_RANK[hit.severity] || 2;
            if (digestion_strength === 'weak') severity += 1;
            if ((prakriti === 'kapha' && /dairy|heavy/i.test((hit.reason || '') + ' ' + (hit.effects || ''))) ||
                (prakriti === 'pitta' && /sour|spicy|hot/i.test((hit.reason || '') + ' ' + (hit.effects || '')))) severity += 1;
            severity = Math.min(3, severity);

            results.push({
                pair: [hit.food_1, hit.food_2],
                is_viruddha: true,
                severity: RANK_SEVERITY[severity],
                reason: hit.reason,
                effects: hit.effects,
                alternatives: hit.alternatives,
            });
        }
    }

    if (!results.length) return { results: [], safe: true, message: 'No incompatibility found' };
    return { results, safe: false };
}

function suggest(q, dataset) {
    const s = norm(q);
    if (!s) return [];
    const data = dataset || loadVir();
    const set = new Set();
    for (const r of data) {
        if (norm(r.food_1).includes(s)) set.add(r.food_1);
        if (norm(r.food_2).includes(s)) set.add(r.food_2);
    }
    return [...set].slice(0, 10);
}

module.exports = { check, suggest };
