/**
 * Calorie calculator using Mifflin-St Jeor BMR + activity multiplier.
 * Splits the daily kcal across breakfast / lunch / dinner / snacks.
 */

const { safeNum, bmi } = require('./common');

const ACTIVITY_MULT = {
    low: 1.375,       // light activity
    moderate: 1.55,   // moderate exercise
    high: 1.725,      // heavy
};

function mifflin({ gender = 'male', weight_kg, height_cm, age }) {
    const w = safeNum(weight_kg, 65), h = safeNum(height_cm, 170), a = safeNum(age, 30);
    const bmr = 10 * w + 6.25 * h - 5 * a + (gender === 'female' ? -161 : 5);
    return Math.round(bmr);
}

function compute({ user = {}, profile = {} }) {
    const bmr = mifflin(user);
    const mult = ACTIVITY_MULT[profile.physical_activity] || 1.375;
    const exerciseBonus = safeNum(profile.exercise_frequency, 0) * 20;  // ~20 kcal/day per session per week
    const tdee = Math.round(bmr * mult + exerciseBonus);

    const b = bmi(user.height_cm, user.weight_kg);
    let target = tdee;
    if (b && b > 28) target = Math.max(1200, tdee - 400);          // weight loss
    else if (b && b < 18.5) target = tdee + 300;                     // weight gain

    return {
        bmi: b,
        bmr,
        tdee,
        daily_target: target,
        split: {
            breakfast: Math.round(target * 0.25),
            lunch:     Math.round(target * 0.35),
            snacks:    Math.round(target * 0.10),
            dinner:    Math.round(target * 0.30),
        },
        note: b && b > 28 ? 'Target adjusted for weight loss' :
              b && b < 18.5 ? 'Target adjusted for weight gain' : 'Maintenance target',
    };
}

module.exports = { compute };
