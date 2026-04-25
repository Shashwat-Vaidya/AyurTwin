/**
 * One-shot trainer: generate dataset → train 10 logistic regressions →
 * write model.json + dataset.csv + optionally upload CSV rows to Supabase.
 *
 *   node scripts/trainModel.js                 # trains + writes artifacts
 *   node scripts/trainModel.js --upload        # + uploads 10k rows to supabase
 */

const fs = require('fs');
const path = require('path');
const { generate } = require('../ml/datasetGenerator');
const { train } = require('../ml/trainer');

const OUT_DIR = path.join(__dirname, '..', 'ml');
const CSV_PATH = path.join(OUT_DIR, 'dataset.csv');
const MODEL_PATH = path.join(OUT_DIR, 'model.json');

async function main() {
    const upload = process.argv.includes('--upload');
    console.log('[train] generating 10,000 synthetic rows...');
    const rows = generate(10000);

    console.log('[train] writing CSV...');
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(',')].concat(rows.map(r => keys.map(k => r[k]).join(','))).join('\n');
    fs.writeFileSync(CSV_PATH, csv);

    console.log('[train] training 10 binary classifiers...');
    const t0 = Date.now();
    const model = train(rows);
    console.log(`[train] done in ${((Date.now()-t0)/1000).toFixed(1)}s`);

    console.log('[train] model metrics:');
    for (const [k, v] of Object.entries(model.metrics)) {
        console.log(`  ${k.padEnd(22)} acc=${v.acc}  prec=${v.prec}  rec=${v.rec}  f1=${v.f1}`);
    }

    fs.writeFileSync(MODEL_PATH, JSON.stringify(model, null, 2));
    console.log(`[train] wrote ${MODEL_PATH} (${(fs.statSync(MODEL_PATH).size/1024).toFixed(1)} KB)`);
    console.log(`[train] wrote ${CSV_PATH}   (${(fs.statSync(CSV_PATH).size/1024).toFixed(1)} KB)`);

    if (upload) {
        const { supabase } = require('../config/supabase');
        console.log('[train] uploading dataset to supabase.ml_disease_dataset (batches of 500)...');
        const BATCH = 500;
        for (let i = 0; i < rows.length; i += BATCH) {
            const slice = rows.slice(i, i + BATCH);
            const { error } = await supabase.from('ml_disease_dataset').insert(slice);
            if (error) { console.error('[train] upload error:', error.message); break; }
            process.stdout.write(`\r  uploaded ${Math.min(i + BATCH, rows.length)}/${rows.length}`);
        }
        console.log('\n[train] upload done.');
    }
}

main().catch(e => { console.error(e); process.exit(1); });
