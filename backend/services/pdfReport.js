/**
 * Comprehensive PDF health report (pdfkit, streamed).
 * Sections: cover → patient → vitals → doshas → BMI/calories → disease risks
 *           → diet (best/good/moderate/avoid) → ritucharya → yoga → prevention
 *           → ayurvedic suggestions → dinacharya → doctor's notes.
 */
const PDFDocument = require('pdfkit');

const PRIMARY = '#D97706';
const DARK = '#1a1a1a';
const GRAY = '#555';
const LIGHT = '#999';

function generate(res, data) {
    const doc = new PDFDocument({ size: 'A4', margin: 48, bufferPages: true });
    doc.pipe(res);

    cover(doc, data);
    doc.addPage(); patientBlock(doc, data);
    healthScoreBlock(doc, data);
    vitalsBlock(doc, data);
    doc.addPage(); doshaBlock(doc, data);
    diseaseRisksBlock(doc, data);
    doc.addPage(); dietBlock(doc, data);
    ritucharyaBlock(doc, data);
    doc.addPage(); yogaBlock(doc, data);
    preventionBlock(doc, data);
    doc.addPage(); ayurvedicSuggestions(doc, data);
    dinacharyaBlock(doc, data);
    doctorsNotes(doc, data);

    addFooter(doc);
    doc.end();
}

// ─── sections ─────────────────────────────────────────────────────────
function cover(doc, data) {
    doc.fillColor(PRIMARY).fontSize(34).font('Helvetica-Bold').text('AyurTwin', { align: 'center' });
    doc.fillColor(GRAY).fontSize(14).font('Helvetica').text('Personalized Ayurvedic Health Report', { align: 'center' });
    doc.moveDown(4);
    doc.fillColor(DARK).fontSize(20).font('Helvetica-Bold').text(data.user.name || 'Patient', { align: 'center' });
    doc.fillColor(GRAY).fontSize(12).font('Helvetica')
        .text(`Prakriti: ${cap(data.user.prakriti)}  ·  Age: ${data.user.age || '—'}  ·  Diet: ${cap(data.user.diet_type)}`, { align: 'center' });
    doc.moveDown(8);
    const score = data.health_score;
    const color = scoreColor(score);
    doc.fillColor(color).fontSize(72).font('Helvetica-Bold').text(`${score}`, { align: 'center' });
    doc.fillColor(GRAY).fontSize(14).font('Helvetica').text(`Health Score · out of 500`, { align: 'center' });
    doc.fillColor(color).fontSize(13).font('Helvetica-Bold').text(scoreLabel(score), { align: 'center' });
    doc.moveDown(6);
    doc.fillColor(LIGHT).fontSize(10).font('Helvetica-Oblique')
        .text(`Generated ${new Date(data.generated_at).toLocaleString()}`, { align: 'center' });
}

function patientBlock(doc, data) {
    sectionTitle(doc, 'Patient Profile');
    const u = data.user;
    row(doc, 'Name', u.name);
    row(doc, 'Age / Gender', `${u.age || '—'} yrs / ${cap(u.gender)}`);
    row(doc, 'Height / Weight', `${u.height_cm || '—'} cm / ${u.weight_kg || '—'} kg`);
    row(doc, 'BMI', `${u.bmi || '—'}  ${bmiCategory(u.bmi)}`);
    row(doc, 'Prakriti', cap(u.prakriti));
    row(doc, 'Diet type', cap(u.diet_type));
    row(doc, 'Season', cap(data.season));
    if (data.calories) {
        row(doc, 'Daily caloric target', `${data.calories.daily_target} kcal (BMR ${data.calories.bmr})`);
        row(doc, 'Meal split (B / L / S / D)',
            `${data.calories.split.breakfast} / ${data.calories.split.lunch} / ${data.calories.split.snacks} / ${data.calories.split.dinner} kcal`);
    }
}

function healthScoreBlock(doc, data) {
    sectionTitle(doc, 'Health Score Breakdown');
    if (data.health_score_breakdown) {
        for (const [k, v] of Object.entries(data.health_score_breakdown)) {
            const sign = v >= 0 ? '+' : '';
            row(doc, k.replace(/_/g, ' '), `${sign}${v} pts`);
        }
    }
    row(doc, 'TOTAL', `${data.health_score} / 500`);
}

function vitalsBlock(doc, data) {
    sectionTitle(doc, 'Latest Vitals');
    const s = data.vitals || {};
    row(doc, 'Heart Rate',  fmt(s.heart_rate, ' bpm'));
    row(doc, 'SpO₂',        fmt(s.spo2, ' %'));
    row(doc, 'Temperature', fmt(s.body_temperature, ' °C'));
    row(doc, 'Recorded',    s.recorded_at ? new Date(s.recorded_at).toLocaleString() : '—');
    if (data.lifestyle) {
        const l = data.lifestyle;
        row(doc, 'Sleep', `${fmt(l.sleep_hours,' hrs')} (sleepiness: ${cap(l.daytime_sleepiness)})`);
        row(doc, 'Stress / Anxiety', `${fmt(l.stress_level)} / ${fmt(l.anxiety_level)} of 10`);
        row(doc, 'Water', `${fmt(l.water_intake_l, ' L/day')}`);
        row(doc, 'Exercise', `${fmt(l.exercise_frequency, ' days/wk')}`);
        row(doc, 'Smoking / Alcohol', `${l.smoking ? 'Yes' : 'No'} / ${cap(l.alcohol)}`);
    }
}

function doshaBlock(doc, data) {
    sectionTitle(doc, 'Dosha Balance (current)');
    const d = data.doshas || {};
    drawBar(doc, 'Vata',  d.vata  || 0, '#7B68EE');
    drawBar(doc, 'Pitta', d.pitta || 0, '#FF6347');
    drawBar(doc, 'Kapha', d.kapha || 0, '#32CD32');
    doc.moveDown(0.5);
    row(doc, 'Dominant', cap(d.dominant));
}

function diseaseRisksBlock(doc, data) {
    sectionTitle(doc, 'Disease Risk Assessment (ML)');
    const r = data.disease_risks || {};
    const sorted = Object.entries(r).sort((a, b) => b[1] - a[1]);
    for (const [k, pct] of sorted) {
        const label = cap(k.replace(/_/g, ' '));
        const c = pct >= 60 ? '#DC2626' : pct >= 30 ? '#D97706' : '#16A34A';
        const y = doc.y;
        doc.fillColor(DARK).font('Helvetica').fontSize(11).text(label, 48, y, { width: 150 });
        doc.rect(220, y + 2, 250, 10).fillColor('#EEE').fill();
        doc.rect(220, y + 2, Math.max(2, (250 * pct) / 100), 10).fillColor(c).fill();
        doc.fillColor(c).font('Helvetica-Bold').fontSize(11).text(`${pct}%`, 480, y, { width: 60, align: 'right' });
        doc.moveDown(0.6);
    }
}

function dietBlock(doc, data) {
    sectionTitle(doc, 'Diet Recommendations');
    const d = data.diet || {};
    bullets(doc, '✅ Best — eat freely', d.best, '#16A34A');
    bullets(doc, '👍 Good',               d.good, '#65A30D');
    bullets(doc, '⚖️ Moderate — sometimes', d.moderate, '#D97706');
    bullets(doc, '❌ Avoid',               d.avoid, '#DC2626');
}

function ritucharyaBlock(doc, data) {
    sectionTitle(doc, `Ritucharya — Foods for ${cap(data.season)}`);
    const r = data.ritucharya || {};
    bullets(doc, '✅ Favor in this season', r.best, '#16A34A');
    bullets(doc, '👍 Suitable',              r.good, '#65A30D');
    bullets(doc, '❌ Avoid in this season',  r.avoid, '#DC2626');
}

function yogaBlock(doc, data) {
    sectionTitle(doc, 'Yoga & Meditation Plan');
    const y = data.yoga || {};
    bullets(doc, '🌅 Morning practice', y.morning, '#D97706');
    bullets(doc, '🌙 Evening wind-down', y.evening, '#7B68EE');
    bullets(doc, '💊 Therapeutic',       y.therapeutic, '#16A34A');
}

function preventionBlock(doc, data) {
    sectionTitle(doc, 'Disease Prevention Plan');
    const p = data.prevention || {};
    if (p.high_priority?.length)
        para(doc, `High-priority concerns: ${p.high_priority.join(', ')}`, '#DC2626');
    if (p.moderate_priority?.length)
        para(doc, `Moderate-priority: ${p.moderate_priority.join(', ')}`, '#D97706');
    bullets(doc, '🛡️ Prevention', p.prevention, '#16A34A');
    bullets(doc, '🏃 Lifestyle changes', p.lifestyle, '#0EA5E9');
    if (p.alerts?.length) bullets(doc, '⚠️ Alerts', p.alerts, '#DC2626');
}

function ayurvedicSuggestions(doc, data) {
    sectionTitle(doc, 'Ayurvedic Suggestions');
    const p = data.prevention || {};
    if (p.ayurvedic?.length) {
        bullets(doc, 'Recommended for you', p.ayurvedic, PRIMARY);
    } else {
        para(doc, 'Maintain a sattvic diet. Practice abhyanga 4×/week with sesame oil. Drink ginger tea before meals to kindle agni. Sleep before 10pm and rise before sunrise.', DARK);
    }
}

function dinacharyaBlock(doc, data) {
    sectionTitle(doc, "Today's Dinacharya");
    if (data.dinacharya_today) {
        row(doc, 'Adherence today', `${data.dinacharya_today.completion_pct || 0}%`);
        const tasks = data.dinacharya_today.tasks || {};
        for (const [k, v] of Object.entries(tasks)) {
            const tick = v ? '✓' : '·';
            doc.fillColor(v ? '#16A34A' : LIGHT).fontSize(11).font('Helvetica')
                .text(`  ${tick} ${k.replace(/_/g, ' ')}`);
        }
    } else {
        para(doc, 'No dinacharya logged for today.', LIGHT);
    }
}

function doctorsNotes(doc, data) {
    sectionTitle(doc, "Doctor's Consultation Notes");
    para(doc, 'For a qualified Ayurvedic vaidya / physician to fill in.', LIGHT);
    doc.moveDown(0.5);
    for (const label of ['Observations', 'Examination findings', 'Diagnosis', 'Prescribed medicines / herbs', 'Therapy plan', 'Follow-up date']) {
        doc.fillColor(DARK).fontSize(11).font('Helvetica-Bold').text(`${label}:`);
        // 4 blank ruled lines
        for (let i = 0; i < 4; i++) {
            const y = doc.y + 4;
            doc.moveTo(48, y).lineTo(547, y).strokeColor('#DDD').lineWidth(0.5).stroke();
            doc.moveDown(1);
        }
        doc.moveDown(0.5);
    }
    doc.moveDown(1);
    const y = doc.y;
    doc.moveTo(48, y).lineTo(220, y).strokeColor(DARK).stroke();
    doc.moveTo(360, y).lineTo(547, y).strokeColor(DARK).stroke();
    doc.fontSize(10).fillColor(GRAY).text('Doctor signature', 48, y + 4);
    doc.text('Date', 360, y + 4);
}

function addFooter(doc) {
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).fillColor(LIGHT).font('Helvetica-Oblique')
            .text(`AyurTwin · ${i + 1}/${range.count} · This report supports — does not replace — professional medical advice. Developed by SDG 2.0`,
                48, 800, { width: 500, align: 'center' });
    }
}

// ─── helpers ──────────────────────────────────────────────────────────
function sectionTitle(doc, title) {
    doc.moveDown(0.5);
    doc.fillColor(PRIMARY).fontSize(15).font('Helvetica-Bold').text(title);
    const y = doc.y + 1;
    doc.moveTo(48, y).lineTo(547, y).strokeColor(PRIMARY).lineWidth(1.5).stroke();
    doc.moveDown(0.5);
}
function row(doc, label, value) {
    if (doc.y > 760) doc.addPage();
    const y = doc.y;
    doc.fillColor(GRAY).font('Helvetica').fontSize(10).text(label, 48, y, { width: 170 });
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(10).text(String(value), 220, y, { width: 320 });
    doc.moveDown(0.3);
}
function para(doc, txt, color = DARK) {
    if (doc.y > 760) doc.addPage();
    doc.fillColor(color).font('Helvetica').fontSize(10).text(txt, { align: 'left' });
    doc.moveDown(0.5);
}
function bullets(doc, title, items, color = DARK) {
    if (!items || items.length === 0) return;
    if (doc.y > 720) doc.addPage();
    doc.fillColor(color).font('Helvetica-Bold').fontSize(11).text(title);
    doc.fillColor(DARK).font('Helvetica').fontSize(10);
    for (const it of items) {
        if (doc.y > 770) doc.addPage();
        doc.text(`  • ${it}`);
    }
    doc.moveDown(0.4);
}
function drawBar(doc, label, pct, color) {
    const y = doc.y;
    doc.fillColor(DARK).font('Helvetica').fontSize(11).text(label, 48, y, { width: 80 });
    doc.rect(140, y + 2, 320, 12).fillColor('#EEE').fill();
    doc.rect(140, y + 2, Math.max(2, (320 * pct) / 100), 12).fillColor(color).fill();
    doc.fillColor(color).font('Helvetica-Bold').fontSize(11).text(`${pct}%`, 470, y, { width: 60, align: 'right' });
    doc.moveDown(0.7);
}

function fmt(v, unit = '') { return v == null ? '—' : `${v}${unit}`; }
function cap(s) { return s ? String(s).charAt(0).toUpperCase() + String(s).slice(1) : '—'; }
function scoreColor(s) { if (s >= 400) return '#16A34A'; if (s >= 300) return '#D97706'; return '#DC2626'; }
function scoreLabel(s) {
    if (s >= 400) return 'Excellent';
    if (s >= 300) return 'Good';
    if (s >= 200) return 'Moderate — room to improve';
    return 'Needs medical attention';
}
function bmiCategory(b) {
    if (!b) return '';
    if (b < 18.5) return '(underweight)';
    if (b < 25) return '(normal)';
    if (b < 30) return '(overweight)';
    return '(obese)';
}

module.exports = { generate };
