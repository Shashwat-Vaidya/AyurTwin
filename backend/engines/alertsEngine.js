/**
 * Alerts / Smart Insights engine.
 * Checks vitals, risks, lifestyle and builds categorized alerts.
 */

const { safeNum } = require('./common');

function build({ user = {}, profile = {}, sensor = {}, risks = {}, dinacharyaPct = 0, healthScore = 250 } = {}) {
    const alerts = [];
    const s = sensor || {};
    const p = profile || {};

    const hr = safeNum(s.heart_rate);
    const spo2 = safeNum(s.spo2);
    const temp = safeNum(s.body_temperature);
    const stress = safeNum(p.stress_level, 5);
    const sleep = safeNum(p.sleep_hours, 7);

    if (temp >= 38) alerts.push({ category: 'vital', severity: 'critical', title: 'High body temperature', message: `${temp}°C detected - rest, hydrate, monitor.` });
    else if (temp >= 37.5) alerts.push({ category: 'vital', severity: 'warning', title: 'Mild fever', message: `${temp}°C` });

    if (spo2 && spo2 < 92) alerts.push({ category: 'vital', severity: 'critical', title: 'Low SpO₂', message: `${spo2}% - seek medical advice` });
    else if (spo2 && spo2 < 95) alerts.push({ category: 'vital', severity: 'warning', title: 'SpO₂ below optimal', message: `${spo2}%` });

    if (hr && hr > 110) alerts.push({ category: 'vital', severity: 'warning', title: 'Elevated heart rate', message: `${hr} bpm` });
    if (hr && hr < 50)  alerts.push({ category: 'vital', severity: 'warning', title: 'Low heart rate', message: `${hr} bpm` });

    for (const [k, pct] of Object.entries(risks)) {
        if (pct >= 80) alerts.push({ category: 'disease', severity: 'critical', title: `${k} risk critical`, message: `${pct}% - take preventive action` });
        else if (pct >= 60) alerts.push({ category: 'disease', severity: 'warning', title: `High ${k} risk`, message: `${pct}%` });
    }

    if (stress >= 8) alerts.push({ category: 'lifestyle', severity: 'warning', title: 'High stress', message: `Level ${stress}/10 - try Bhramari pranayama` });
    if (sleep < 5)   alerts.push({ category: 'sleep', severity: 'warning', title: 'Sleep deficit', message: `${sleep} hrs - aim for 7-8` });
    if (dinacharyaPct < 30) alerts.push({ category: 'lifestyle', severity: 'info', title: 'Low routine adherence', message: 'Complete daily checklist for a health-score boost' });
    if (healthScore < 200) alerts.push({ category: 'lifestyle', severity: 'warning', title: 'Health score low', message: 'Check prevention plan' });

    return alerts;
}

module.exports = { build };
