/**
 * Upload all dataset JSON files into their Supabase tables.
 * Idempotent: clears the table first, then inserts.
 *
 *   node scripts/seedDatasets.js
 */

const fs = require('fs');
const path = require('path');
const { supabase } = require('../config/supabase');

const DIR = path.join(__dirname, '..', 'datasets');

function load(name) {
    return JSON.parse(fs.readFileSync(path.join(DIR, `${name}.json`), 'utf8'));
}

async function wipe(table) {
    const { error } = await supabase.from(table).delete().gte('id', 0);
    if (error) console.warn(`  wipe ${table}:`, error.message);
}

async function insert(table, rows) {
    const BATCH = 500;
    for (let i = 0; i < rows.length; i += BATCH) {
        const slice = rows.slice(i, i + BATCH);
        const { error } = await supabase.from(table).insert(slice);
        if (error) { console.error(`  insert ${table}:`, error.message); return false; }
    }
    return true;
}

function toRituRows(rows) {
    return rows.map(r => ({
        food_name: r.food_name,
        seasons: r.seasons,
        avoid_in: r.avoid_in,
        vata: r.vata,
        pitta: r.pitta,
        kapha: r.kapha,
        properties: r.properties,
    }));
}

async function main() {
    console.log('[seed] foods');
    await wipe('foods');
    await insert('foods', load('foods'));

    console.log('[seed] yoga_practices');
    await wipe('yoga_practices');
    await insert('yoga_practices', load('yoga'));

    console.log('[seed] ritucharya_foods');
    await wipe('ritucharya_foods');
    await insert('ritucharya_foods', toRituRows(load('ritucharya')));

    console.log('[seed] viruddha_ahar');
    await wipe('viruddha_ahar');
    await insert('viruddha_ahar', load('viruddha'));

    console.log('[seed] prevention_rules');
    await wipe('prevention_rules');
    await insert('prevention_rules', load('prevention'));

    console.log('[seed] chatbot_qa');
    await wipe('chatbot_qa');
    await insert('chatbot_qa', load('chatbot_qa'));

    console.log('[seed] done');
}

main().catch(e => { console.error(e); process.exit(1); });
