/**
 * Shared helpers used across engines.
 */

function safeNum(v, d = 0) { const n = Number(v); return Number.isFinite(n) ? n : d; }

function bmi(heightCm, weightKg) {
    const h = safeNum(heightCm) / 100;
    if (h <= 0) return null;
    return +(safeNum(weightKg) / (h * h)).toFixed(1);
}

function activityScore(s = {}) {
    const a = Math.sqrt(safeNum(s.accel_x) ** 2 + safeNum(s.accel_y) ** 2 + safeNum(s.accel_z) ** 2);
    const g = Math.sqrt(safeNum(s.gyro_x) ** 2 + safeNum(s.gyro_y) ** 2 + safeNum(s.gyro_z) ** 2);
    return +(a + g).toFixed(2);
}

function sleepScore(hours, daytimeSleepiness) {
    const penalty = { low: 0, medium: 1.5, high: 3 }[daytimeSleepiness] || 0;
    return +Math.max(0, safeNum(hours, 7) - penalty).toFixed(1);
}

function stressIndex(userStress, anxiety, sensor = {}, sleep = 7) {
    const hr = safeNum(sensor.heart_rate, 72);
    const hrPenalty = hr > 90 ? (hr - 90) * 0.4 : 0;
    const sleepPenalty = sleep < 6 ? (6 - sleep) * 1.2 : 0;
    const raw = safeNum(userStress, 5) * 5 + safeNum(anxiety, 5) * 3 + hrPenalty + sleepPenalty;
    return Math.min(100, Math.round(raw));
}

function currentSeason(date = new Date()) {
    const m = date.getMonth();
    if (m === 11 || m <= 1) return 'winter';          // Dec-Feb
    if (m === 2 || m === 3) return 'spring';          // Mar-Apr
    if (m >= 4 && m <= 6)   return 'summer';          // May-Jul
    if (m === 7 || m === 8) return 'monsoon';         // Aug-Sep
    return 'autumn';                                   // Oct-Nov
}

function doshaScores({ profile = {}, sensor = {} } = {}) {
    // Lightweight vikriti estimator based on lifestyle + health profile.
    const stress = safeNum(profile.stress_level, 5);
    const sleep = safeNum(profile.sleep_hours, 7);
    const junk = { low: 0, medium: 1, high: 2 }[profile.junk_food_frequency] || 0;
    const digestion = { weak: 2, medium: 1, strong: 0 }[profile.digestion_strength] || 1;
    const tempTendency = { cold: 'vata', hot: 'pitta', normal: null }[profile.body_temp_tendency];
    const sResp = profile.stress_response;
    const activity = activityScore(sensor);

    let vata = 30, pitta = 30, kapha = 30;
    if (stress > 7)      vata += 15;
    if (sleep < 6)       vata += 10;
    if (sResp === 'anxious')   vata += 10;
    if (sResp === 'irritable') pitta += 10;
    if (sResp === 'calm')      kapha += 5;
    if (tempTendency === 'pitta') pitta += 15;
    if (tempTendency === 'vata')  vata  += 10;
    if (digestion === 2) vata += 8;
    if (digestion === 0) kapha += 8;
    if (junk === 2)      kapha += 10;
    if (activity < 1)    kapha += 10;
    if (activity > 2.2)  vata  += 5;

    const sum = vata + pitta + kapha;
    return {
        vata:  Math.round(vata  * 100 / sum),
        pitta: Math.round(pitta * 100 / sum),
        kapha: Math.round(kapha * 100 / sum),
    };
}

function dominantDosha(scores) {
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

module.exports = {
    safeNum, bmi, activityScore, sleepScore, stressIndex,
    currentSeason, doshaScores, dominantDosha,
};
