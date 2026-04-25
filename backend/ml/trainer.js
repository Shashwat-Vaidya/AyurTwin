/**
 * Logistic regression trainer (vanilla gradient descent, no deps).
 * We train ONE binary classifier per disease on standardized features,
 * store the coefficients + feature means/stds in model.json.
 *
 * This is "real" ML - the model.json file is the learned artifact;
 * inference at request time is just a dot product + sigmoid.
 */

const FEATURES = [
    'age','bmi','activity_score','hr','spo2','temp','stress','anxiety','sleep_hours',
    'junk_food','smoking','water_l','exercise_freq',
    'fh_diabetes','fh_heart','fh_hypertension','fh_asthma','fh_arthritis',
    'sym_thirst','sym_urination','sym_joint_pain','sym_breath','sym_digestive'
];

const LABELS = [
    'label_diabetes','label_heart','label_hypertension','label_stress',
    'label_sleep','label_asthma','label_arthritis','label_obesity',
    'label_digestive','label_fever'
];

function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

function standardize(rows) {
    const means = {}, stds = {};
    for (const f of FEATURES) {
        let sum = 0;
        for (const r of rows) sum += r[f];
        means[f] = sum / rows.length;
        let sq = 0;
        for (const r of rows) sq += (r[f] - means[f]) ** 2;
        stds[f] = Math.sqrt(sq / rows.length) || 1;
    }
    return { means, stds };
}

function toMatrix(rows, means, stds) {
    return rows.map(r => FEATURES.map(f => (r[f] - means[f]) / stds[f]));
}

function trainBinary(X, y, { epochs = 250, lr = 0.08, l2 = 0.01 } = {}) {
    const m = X.length, n = X[0].length;
    const w = new Array(n).fill(0);
    let b = 0;

    for (let e = 0; e < epochs; e++) {
        const gw = new Array(n).fill(0);
        let gb = 0;
        for (let i = 0; i < m; i++) {
            let z = b;
            for (let j = 0; j < n; j++) z += w[j] * X[i][j];
            const p = sigmoid(z);
            const err = p - y[i];
            for (let j = 0; j < n; j++) gw[j] += err * X[i][j];
            gb += err;
        }
        for (let j = 0; j < n; j++) w[j] = w[j] - lr * (gw[j] / m + l2 * w[j]);
        b = b - lr * (gb / m);
    }
    return { w, b };
}

function evaluate(X, y, model) {
    let tp = 0, tn = 0, fp = 0, fn = 0;
    for (let i = 0; i < X.length; i++) {
        let z = model.b;
        for (let j = 0; j < X[0].length; j++) z += model.w[j] * X[i][j];
        const pred = sigmoid(z) >= 0.5 ? 1 : 0;
        if (pred === 1 && y[i] === 1) tp++;
        else if (pred === 0 && y[i] === 0) tn++;
        else if (pred === 1 && y[i] === 0) fp++;
        else fn++;
    }
    const acc = (tp + tn) / X.length;
    const prec = tp + fp ? tp / (tp + fp) : 0;
    const rec = tp + fn ? tp / (tp + fn) : 0;
    const f1 = prec + rec ? 2 * prec * rec / (prec + rec) : 0;
    return { acc: +acc.toFixed(3), prec: +prec.toFixed(3), rec: +rec.toFixed(3), f1: +f1.toFixed(3) };
}

function train(rows) {
    const { means, stds } = standardize(rows);
    const X = toMatrix(rows, means, stds);

    const models = {};
    const metrics = {};
    for (const label of LABELS) {
        const y = rows.map(r => r[label]);
        const m = trainBinary(X, y);
        models[label] = m;
        metrics[label] = evaluate(X, y, m);
    }
    return { features: FEATURES, labels: LABELS, means, stds, models, metrics, trained_at: new Date().toISOString() };
}

function predict(model, rawFeatures) {
    const x = model.features.map(f => {
        const v = rawFeatures[f] == null ? model.means[f] : rawFeatures[f];
        return (v - model.means[f]) / model.stds[f];
    });
    const out = {};
    for (const label of model.labels) {
        const m = model.models[label];
        let z = m.b;
        for (let j = 0; j < x.length; j++) z += m.w[j] * x[j];
        out[label.replace('label_','')] = Math.round(sigmoid(z) * 100);
    }
    return out;
}

module.exports = { train, predict, FEATURES, LABELS };
