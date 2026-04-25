/**
 * Synthetic health dataset generator for the ML disease predictor.
 * Creates 10,000 rows with realistic parameter distributions and
 * rule-derived disease labels (which we then train a logistic regression on).
 *
 * Written so labels are NOT a perfect function of inputs - we add Gaussian
 * noise to each probability so the trained model is non-trivial.
 */

function randn() {
    // Box-Muller
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function bern(p) { return Math.random() < p ? 1 : 0; }
function clip(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

function generateRow() {
    const age = randInt(18, 80);
    const bmi = +clip(rand(18, 36) + randn() * 0.5, 15, 40).toFixed(1);
    const activity_score = +clip(rand(0.5, 2.5) + randn() * 0.1, 0.3, 3).toFixed(2);
    const hr = +clip(rand(60, 110) + randn() * 3, 50, 130).toFixed(0);
    const spo2 = +clip(rand(92, 99) + randn() * 0.5, 88, 100).toFixed(0);
    const temp = +clip(rand(36.3, 37.4) + randn() * 0.1, 35.5, 39.5).toFixed(1);
    const stress = randInt(1, 10);
    const anxiety = clip(stress + randInt(-2, 2), 1, 10);
    const sleep_hours = +clip(rand(4, 9) + randn() * 0.5, 3, 10).toFixed(1);
    const junk_food = randInt(0, 2);   // 0=low, 1=med, 2=high
    const smoking = bern(0.25);
    const water_l = +rand(0.8, 4).toFixed(1);
    const exercise_freq = randInt(0, 7);
    const fh_diabetes = bern(0.25);
    const fh_heart = bern(0.2);
    const fh_hypertension = bern(0.3);
    const fh_asthma = bern(0.15);
    const fh_arthritis = bern(0.2);
    const sym_thirst = bern(0.15);
    const sym_urination = bern(0.15);
    const sym_joint_pain = bern(0.25);
    const sym_breath = bern(0.1);
    const sym_digestive = bern(0.2);

    // --- derive probabilities, clip to [0.02, 0.98], sample label ---
    const pDiab = sigmoid(
        -4 + 0.06 * (bmi - 22) + 0.6 * junk_food + 1.2 * fh_diabetes +
        1.1 * sym_thirst + 1.0 * sym_urination - 0.4 * activity_score
    );
    const pHeart = sigmoid(
        -4.5 + 0.04 * (hr - 70) + 1.5 * smoking - 0.5 * activity_score +
        0.2 * stress + 1.3 * fh_heart + 0.03 * (age - 40)
    );
    const pHyper = sigmoid(
        -4 + 0.05 * (bmi - 22) + 0.3 * stress + 1.2 * fh_hypertension +
        1.0 * smoking + 0.03 * (age - 40) - 0.3 * activity_score
    );
    const pStress = sigmoid(
        -4 + 0.6 * stress + 0.3 * anxiety - 0.25 * sleep_hours + 0.02 * (hr - 70)
    );
    const pSleep = sigmoid(
        -3 - 0.5 * sleep_hours + 0.3 * stress + 0.3 * anxiety + 0.4 * junk_food
    );
    const pAsthma = sigmoid(
        -4.5 + 1.8 * sym_breath - 0.4 * (spo2 - 95) + 1.2 * fh_asthma +
        0.8 * smoking
    );
    const pArth = sigmoid(
        -5 + 0.04 * (age - 30) + 1.6 * sym_joint_pain - 0.5 * activity_score +
        1.0 * fh_arthritis + 0.03 * (bmi - 22)
    );
    const pObese = sigmoid(
        -5 + 0.5 * (bmi - 25) + 0.5 * junk_food - 0.6 * activity_score -
        0.2 * exercise_freq
    );
    const pDig = sigmoid(
        -3 + 1.4 * sym_digestive + 0.4 * stress + 0.4 * junk_food -
        0.3 * water_l
    );
    const pFever = sigmoid(-6 + 2.5 * (temp - 37) + 0.04 * (hr - 70));

    return {
        age, bmi, activity_score, hr, spo2, temp, stress, anxiety, sleep_hours,
        junk_food, smoking, water_l, exercise_freq,
        fh_diabetes, fh_heart, fh_hypertension, fh_asthma, fh_arthritis,
        sym_thirst, sym_urination, sym_joint_pain, sym_breath, sym_digestive,
        label_diabetes: bern(pDiab),
        label_heart: bern(pHeart),
        label_hypertension: bern(pHyper),
        label_stress: bern(pStress),
        label_sleep: bern(pSleep),
        label_asthma: bern(pAsthma),
        label_arthritis: bern(pArth),
        label_obesity: bern(pObese),
        label_digestive: bern(pDig),
        label_fever: bern(pFever),
    };
}

function generate(n = 10000) {
    const rows = [];
    for (let i = 0; i < n; i++) rows.push(generateRow());
    return rows;
}

module.exports = { generate, generateRow };
