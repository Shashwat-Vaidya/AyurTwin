/**
 * AyurTwin Health Report — fixed 5-page PDF (pdfkit, streamed).
 *
 * Page 1 — Cover + patient profile + health score + latest vitals
 * Page 2 — Dosha balance + disease risk assessment
 * Page 3 — Diet recommendations (best/good/moderate/avoid) + ritucharya
 * Page 4 — Yoga plan + dinacharya + prevention
 * Page 5 — Ayurvedic suggestions + doctor's notes
 */
const PDFDocument = require('pdfkit');

const PRIMARY = '#D97706';
const DARK = '#1a1a1a';
const GRAY = '#555';
const LIGHT = '#999';

const PAGE_HEIGHT = 842;     // A4
const FOOTER_Y = 800;
const SAFE_BOTTOM = 770;     // never write past this in any block

function generate(res, data) {
    const doc = new PDFDocument({ size: 'A4', margin: 48, bufferPages: true, autoFirstPage: false });
    doc.pipe(res);

    // Page 1
    doc.addPage();
    coverHeader(doc, data);
    patientBlock(doc, data);
    healthScoreBlock(doc, data);
    vitalsBlock(doc, data);

    // Page 2
    doc.addPage();
    doshaBlock(doc, data);
    diseaseRisksBlock(doc, data);

    // Page 3
    doc.addPage();
    dietBlock(doc, data);
    ritucharyaBlock(doc, data);

    // Page 4
    doc.addPage();
    yogaBlock(doc, data);
    dinacharyaBlock(doc, data);
    preventionBlock(doc, data);

    // Page 5
    doc.addPage();
    ayurvedicSuggestions(doc, data);
    doctorsNotes(doc, data);

    addFooter(doc);
    doc.end();
}

// ─── sections ─────────────────────────────────────────────────────────
function coverHeader(doc, data) {
    doc.fillColor(PRIMARY).fontSize(26).font('Helvetica-Bold').text('AyurTwin', { align: 'center' });
    doc.fillColor(GRAY).fontSize(12).font('Helvetica').text('Personalized Ayurvedic Health Report', { align: 'center' });
    doc.fillColor(LIGHT).fontSize(9).font('Helvetica-Oblique')
        .text(`Generated ${new Date(data.generated_at).toLocaleString()}`, { align: 'center' });
    doc.moveDown(0.6);
    const y = doc.y;
    doc.moveTo(48, y).lineTo(547, y).strokeColor(PRIMARY).lineWidth(1.2).stroke();
    doc.moveDown(0.6);
}

function patientBlock(doc, data) {
    sectionTitle(doc, 'Patient Profile');
    const u = data.user || {};
    row(doc, 'Name', u.name);
    row(doc, 'Age / Gender', `${u.age || '—'} yrs / ${cap(u.gender)}`);
    row(doc, 'Height / Weight', `${u.height_cm || '—'} cm / ${u.weight_kg || '—'} kg`);
    row(doc, 'BMI', `${u.bmi || '—'}  ${bmiCategory(u.bmi)}`);
    row(doc, 'Prakriti', cap(u.prakriti));
    row(doc, 'Diet type / Season', `${cap(u.diet_type)} · ${cap(data.season)}`);
    if (data.calories) {
        row(doc, 'Daily caloric target', `${data.calories.daily_target} kcal (BMR ${data.calories.bmr})`);
    }
}

function healthScoreBlock(doc, data) {
    sectionTitle(doc, 'Health Score');
    const score = data.health_score;
    const color = scoreColor(score);
    const y0 = doc.y;
    doc.fillColor(color).font('Helvetica-Bold').fontSize(36).text(`${score}`, 48, y0, { width: 110 });
    doc.fillColor(GRAY).font('Helvetica').fontSize(10).text('out of 500', 48, y0 + 40, { width: 110 });
    doc.fillColor(color).font('Helvetica-Bold').fontSize(12).text(scoreLabel(score), 170, y0 + 4, { width: 370 });
    doc.fillColor(DARK).font('Helvetica').fontSize(9);
    if (data.health_score_breakdown) {
        const entries = Object.entries(data.health_score_breakdown);
        const half = Math.ceil(entries.length / 2);
        const left = entries.slice(0, half), right = entries.slice(half);
        let yy = y0 + 22;
        for (let i = 0; i < Math.max(left.length, right.length); i++) {
            if (left[i]) {
                const [k, v] = left[i]; const sign = v >= 0 ? '+' : '';
                doc.fillColor(GRAY).text(`${k.replace(/_/g, ' ')}`, 170, yy, { width: 130 });
                doc.fillColor(v >= 0 ? '#16A34A' : '#DC2626').font('Helvetica-Bold').text(`${sign}${v}`, 295, yy, { width: 35, align: 'right' });
                doc.font('Helvetica');
            }
            if (right[i]) {
                const [k, v] = right[i]; const sign = v >= 0 ? '+' : '';
                doc.fillColor(GRAY).text(`${k.replace(/_/g, ' ')}`, 350, yy, { width: 130 });
                doc.fillColor(v >= 0 ? '#16A34A' : '#DC2626').font('Helvetica-Bold').text(`${sign}${v}`, 475, yy, { width: 35, align: 'right' });
                doc.font('Helvetica');
            }
            yy += 12;
        }
        doc.y = Math.max(yy, y0 + 70) + 4;
    } else {
        doc.y = y0 + 60;
    }
}

function vitalsBlock(doc, data) {
    sectionTitle(doc, 'Latest Vitals & Lifestyle');
    const s = data.vitals || {};
    const l = data.lifestyle || {};
    twoCol(doc, [
        ['Heart Rate', fmt(s.heart_rate, ' bpm')],
        ['SpO2', fmt(s.spo2, ' %')],
        ['Temperature', fmt(s.body_temperature, ' °C')],
        ['Sleep', `${fmt(l.sleep_hours, ' hrs')}`],
        ['Stress / Anxiety', `${fmt(l.stress_level)} / ${fmt(l.anxiety_level)} (of 10)`],
        ['Water', fmt(l.water_intake_l, ' L/day')],
        ['Exercise', fmt(l.exercise_frequency, ' days/wk')],
        ['Smoking / Alcohol', `${l.smoking ? 'Yes' : 'No'} / ${cap(l.alcohol)}`],
    ]);
}

function doshaBlock(doc, data) {
    sectionTitle(doc, 'Dosha Balance');
    const d = data.doshas || {};
    drawBar(doc, 'Vata', d.vata || 0, '#7B68EE');
    drawBar(doc, 'Pitta', d.pitta || 0, '#FF6347');
    drawBar(doc, 'Kapha', d.kapha || 0, '#32CD32');
    doc.moveDown(0.3);
    row(doc, 'Dominant', cap(d.dominant));
}

function diseaseRisksBlock(doc, data) {
    sectionTitle(doc, 'Disease Risk Assessment');
    const r = data.disease_risks || {};
    const sorted = Object.entries(r).sort((a, b) => b[1] - a[1]);
    for (const [k, pct] of sorted) {
        if (doc.y > SAFE_BOTTOM) break;
        const label = cap(k.replace(/_/g, ' '));
        const c = pct >= 60 ? '#DC2626' : pct >= 30 ? '#D97706' : '#16A34A';
        const y = doc.y;
        doc.fillColor(DARK).font('Helvetica').fontSize(10).text(label, 48, y, { width: 150 });
        doc.rect(220, y + 2, 250, 9).fillColor('#EEE').fill();
        doc.rect(220, y + 2, Math.max(2, (250 * pct) / 100), 9).fillColor(c).fill();
        doc.fillColor(c).font('Helvetica-Bold').fontSize(10).text(`${pct}%`, 480, y, { width: 60, align: 'right' });
        doc.moveDown(0.55);
    }
}

function dietBlock(doc, data) {
    sectionTitle(doc, 'Diet Recommendations');
    const d = data.diet || {};
    bulletsCapped(doc, '[Best] Eat freely', d.best, '#16A34A', 8);
    bulletsCapped(doc, '[Good]', d.good, '#65A30D', 6);
    bulletsCapped(doc, '[Moderate] Sometimes', d.moderate, '#D97706', 5);
    bulletsCapped(doc, '[Avoid]', d.avoid, '#DC2626', 5);
}

function ritucharyaBlock(doc, data) {
    sectionTitle(doc, `Ritucharya — ${cap(data.season)}`);
    const r = data.ritucharya || {};
    bulletsCapped(doc, '[Favor] In this season', r.best, '#16A34A', 6);
    bulletsCapped(doc, '[Avoid] In this season', r.avoid, '#DC2626', 5);
}

function yogaBlock(doc, data) {
    sectionTitle(doc, 'Yoga & Meditation Plan');
    const y = data.yoga || {};
    bulletsCapped(doc, '[Morning]', toNames(y.morning), '#D97706', 4);
    bulletsCapped(doc, '[Evening]', toNames(y.evening), '#7B68EE', 3);
    bulletsCapped(doc, '[Therapeutic]', toNames(y.therapeutic), '#16A34A', 3);
}

function dinacharyaBlock(doc, data) {
    sectionTitle(doc, "Today's Dinacharya");
    if (data.dinacharya_today) {
        row(doc, 'Adherence', `${data.dinacharya_today.completion_pct || 0}%`);
        const tasks = data.dinacharya_today.tasks || {};
        let line = '';
        const items = [];
        for (const [k, v] of Object.entries(tasks)) {
            items.push(`${v ? '[x]' : '[ ]'} ${k.replace(/_/g, ' ')}`);
        }
        para(doc, items.join('   '), DARK);
    } else {
        para(doc, 'No dinacharya logged for today.', LIGHT);
    }
}

function preventionBlock(doc, data) {
    sectionTitle(doc, 'Disease Prevention Plan');
    const p = data.prevention || {};
    if (p.high_priority?.length)
        para(doc, `High-priority concerns: ${p.high_priority.join(', ')}`, '#DC2626');
    if (p.moderate_priority?.length)
        para(doc, `Moderate-priority: ${p.moderate_priority.join(', ')}`, '#D97706');
    bulletsCapped(doc, '[Prevention]', p.prevention, '#16A34A', 4);
    bulletsCapped(doc, '[Lifestyle]', p.lifestyle, '#0EA5E9', 3);
}

function ayurvedicSuggestions(doc, data) {
    sectionTitle(doc, 'Ayurvedic Suggestions');
    const p = data.prevention || {};
    if (p.ayurvedic?.length) {
        bulletsCapped(doc, 'Recommended for you', p.ayurvedic, PRIMARY, 8);
    } else {
        para(doc,
            'Maintain a sattvic diet. Practice abhyanga 4×/week with sesame oil. Drink ginger tea before meals to kindle agni. Sleep before 10pm and rise before sunrise.',
            DARK);
    }
    if (p.alerts?.length) bulletsCapped(doc, '[Alerts]', p.alerts, '#DC2626', 4);
}

function doctorsNotes(doc, data) {
    sectionTitle(doc, "Doctor's Consultation Notes");
    para(doc, 'For a qualified Ayurvedic vaidya / physician to fill in.', LIGHT);
    doc.moveDown(0.4);
    const labels = ['Observations', 'Diagnosis', 'Prescribed medicines / herbs', 'Therapy plan', 'Follow-up date'];
    for (const label of labels) {
        if (doc.y > 700) break;
        doc.fillColor(DARK).fontSize(10).font('Helvetica-Bold').text(`${label}:`);
        for (let i = 0; i < 2; i++) {
            const y = doc.y + 4;
            doc.moveTo(48, y).lineTo(547, y).strokeColor('#DDD').lineWidth(0.5).stroke();
            doc.moveDown(1);
        }
        doc.moveDown(0.3);
    }
    if (doc.y < 740) {
        doc.moveDown(0.5);
        const y = doc.y;
        doc.moveTo(48, y).lineTo(220, y).strokeColor(DARK).stroke();
        doc.moveTo(360, y).lineTo(547, y).strokeColor(DARK).stroke();
        doc.fontSize(9).fillColor(GRAY).text('Doctor signature', 48, y + 4);
        doc.text('Date', 360, y + 4);
    }
}

function addFooter(doc) {
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).fillColor(LIGHT).font('Helvetica-Oblique')
            .text(`AyurTwin · Page ${i + 1} of ${range.count} · Supports — does not replace — professional medical advice. Developed by SDG 2.0`,
                48, FOOTER_Y, { width: 500, align: 'center' });
    }
}

// ─── helpers ──────────────────────────────────────────────────────────
function sectionTitle(doc, title) {
    if (doc.y > SAFE_BOTTOM) return;
    doc.moveDown(0.4);
    doc.fillColor(PRIMARY).fontSize(13).font('Helvetica-Bold').text(title);
    const y = doc.y + 1;
    doc.moveTo(48, y).lineTo(547, y).strokeColor(PRIMARY).lineWidth(1).stroke();
    doc.moveDown(0.35);
}
function row(doc, label, value) {
    if (doc.y > SAFE_BOTTOM) return;
    const y = doc.y;
    doc.fillColor(GRAY).font('Helvetica').fontSize(9.5).text(label, 48, y, { width: 170 });
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(9.5).text(String(value ?? '—'), 220, y, { width: 320 });
    doc.moveDown(0.25);
}
function twoCol(doc, pairs) {
    const startY = doc.y;
    const half = Math.ceil(pairs.length / 2);
    const left = pairs.slice(0, half), right = pairs.slice(half);
    let yy = startY;
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
        if (yy > SAFE_BOTTOM) break;
        if (left[i]) {
            doc.fillColor(GRAY).font('Helvetica').fontSize(9.5).text(left[i][0], 48, yy, { width: 110 });
            doc.fillColor(DARK).font('Helvetica-Bold').fontSize(9.5).text(String(left[i][1] ?? '—'), 160, yy, { width: 130 });
        }
        if (right[i]) {
            doc.fillColor(GRAY).font('Helvetica').fontSize(9.5).text(right[i][0], 305, yy, { width: 110 });
            doc.fillColor(DARK).font('Helvetica-Bold').fontSize(9.5).text(String(right[i][1] ?? '—'), 420, yy, { width: 130 });
        }
        yy += 14;
    }
    doc.y = yy + 4;
}
function para(doc, txt, color = DARK) {
    if (doc.y > SAFE_BOTTOM) return;
    doc.fillColor(color).font('Helvetica').fontSize(9.5).text(txt, { align: 'left' });
    doc.moveDown(0.4);
}
function bulletsCapped(doc, title, items, color = DARK, max = 6) {
    if (!items || items.length === 0) return;
    if (doc.y > SAFE_BOTTOM - 30) return;
    doc.fillColor(color).font('Helvetica-Bold').fontSize(10).text(title);
    doc.fillColor(DARK).font('Helvetica').fontSize(9.5);
    const list = items.slice(0, max);
    for (const it of list) {
        if (doc.y > SAFE_BOTTOM) break;
        doc.text(`  • ${typeof it === 'string' ? it : (it?.name || JSON.stringify(it))}`);
    }
    if (items.length > max) {
        doc.fillColor(LIGHT).fontSize(8.5).text(`  … and ${items.length - max} more`);
    }
    doc.moveDown(0.3);
}
function drawBar(doc, label, pct, color) {
    const y = doc.y;
    doc.fillColor(DARK).font('Helvetica').fontSize(10).text(label, 48, y, { width: 70 });
    doc.rect(130, y + 2, 330, 11).fillColor('#EEE').fill();
    doc.rect(130, y + 2, Math.max(2, (330 * pct) / 100), 11).fillColor(color).fill();
    doc.fillColor(color).font('Helvetica-Bold').fontSize(10).text(`${pct}%`, 470, y, { width: 60, align: 'right' });
    doc.moveDown(0.65);
}
function toNames(list) {
    if (!Array.isArray(list)) return [];
    return list.map(x => typeof x === 'string' ? x : (x?.name || ''));
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
