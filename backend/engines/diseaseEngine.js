/**
 * Enhanced Disease Risk Engine v2
 *
 * Features:
 * - ML logistic regression (model.json produced by scripts/trainModel.js)
 * - Advanced rule-based fallback with Ayurveda integration
 * - Sensor time-series analysis for better accuracy
 * - Dosha-specific disease predisposition
 * - Seasonal adjustments (Ritucharya principles)
 * - Confidence scores and reasoning
 *
 * Output: { diabetes, heart, hypertension, stress, sleep, asthma, arthritis,
 *           obesity, digestive, fever } — each 0..100 with confidence and reasons
 */

const fs = require('fs');
const path = require('path');
const { predict: mlPredict } = require('../ml/trainer');
const { bmi, activityScore, safeNum, sleepScore, currentSeason } = require('./common');

const MODEL_PATH = path.join(__dirname, '..', 'ml', 'model.json');

let model = null;
function loadModel() {
    if (model) return model;
    try {
        model = JSON.parse(fs.readFileSync(MODEL_PATH, 'utf8'));
        return model;
    } catch {
        return null;
    }
}

function toFeatureVector({ user = {}, profile = {}, sensor = {} }) {
    const b = bmi(user.height_cm, user.weight_kg) || 24;
    const act = activityScore(sensor) || 1;
    const junkMap = { low: 0, medium: 1, high: 2 };
    return {
        age: safeNum(user.age, 30),
        bmi: b,
        activity_score: act,
        hr: safeNum(sensor.heart_rate, 72),
        spo2: safeNum(sensor.spo2, 97),
        temp: safeNum(sensor.body_temperature, 36.8),
        stress: safeNum(profile.stress_level, 5),
        anxiety: safeNum(profile.anxiety_level, 5),
        sleep_hours: safeNum(profile.sleep_hours, 7),
        junk_food: junkMap[profile.junk_food_frequency] ?? 1,
        smoking: profile.smoking ? 1 : 0,
        water_l: safeNum(profile.water_intake_l, 2),
        exercise_freq: safeNum(profile.exercise_frequency, 3),
        fh_diabetes: profile.fh_diabetes ? 1 : 0,
        fh_heart: profile.fh_heart_disease ? 1 : 0,
        fh_hypertension: profile.fh_hypertension ? 1 : 0,
        fh_asthma: profile.fh_asthma ? 1 : 0,
        fh_arthritis: profile.fh_arthritis ? 1 : 0,
        sym_thirst: profile.sym_frequent_thirst ? 1 : 0,
        sym_urination: profile.sym_frequent_urination ? 1 : 0,
        sym_joint_pain: profile.sym_joint_pain ? 1 : 0,
        sym_breath: profile.sym_breathing_difficulty ? 1 : 0,
        sym_digestive: profile.sym_digestive_issue ? 1 : 0,
    };
}

// Enhanced rule-based fallback with Ayurveda principles
function ruleFallback(f, sensorHistory = []) {
    const clamp = (x) => Math.max(0, Math.min(100, Math.round(x)));
    const season = currentSeason();
    
    // Calculate more sophisticated metrics
    const hiHR = Math.max(0, Math.min(f.hr - 75, 30)) / 0.4; // capped at 30
    const lowActivity = f.activity_score < 1.2 ? 1 : 0;
    const chronicity = Math.min(sensorHistory.length / 30, 1); // 0-1 based on data history
    const spo2Risk = Math.max(0, 95 - f.spo2) * 1.5;
    
    // Analyze sensor trends if available
    const sensorTrend = analyzeSensorTrend(sensorHistory);
    
    return {
        diabetes: clamp(
            0.25 * Math.max(0, f.bmi - 24) * 4 +          // BMI (Kapha aggravation)
            0.15 * lowActivity * 100 +                    // Inactivity
            0.12 * f.junk_food * 40 +                    // Poor diet (ama production)
            25 * f.fh_diabetes +                          // Genetics
            30 * (f.sym_thirst + f.sym_urination) / 2 +  // Symptoms
            5 * Math.max(0, f.stress - 5) +              // Chronic stress
            sensorTrend.diabetes_trend * 10              // Trend analysis
        ),
        heart: clamp(
            0.22 * hiHR +                                 // Heart rate elevation
            0.18 * lowActivity * 100 +                    // Inactivity
            25 * f.smoking +                              // Smoking
            3 * f.stress +                                // Stress (Vata/Pitta aggravation)
            25 * f.fh_heart +                            // Family history
            Math.max(0, f.age - 40) * 0.8 +             // Age factor
            5 * spo2Risk +                               // SpO2 correlation
            sensorTrend.heart_trend * 8                 // Trend analysis
        ),
        hypertension: clamp(
            0.20 * Math.max(0, f.bmi - 24) * 4 +         // BMI (Kapha)
            3.5 * f.stress +                             // Stress (Pitta aggravation)
            28 * f.fh_hypertension +                     // Family history
            18 * f.smoking +                             // Smoking
            Math.max(0, f.age - 35) * 0.7 +             // Age
            5 * f.anxiety +                              // Anxiety
            sensorTrend.hypertension_trend * 10         // Trend
        ),
        stress: clamp(
            8 * f.stress +                               // Current stress level
            3 * f.anxiety +                              // Anxiety (compounding)
            Math.max(0, 8 - f.sleep_hours) * 6 +        // Sleep deprivation
            2 * f.junk_food +                           // Poor diet increases stress
            3 * (f.age > 40 ? 1 : 0) +                  // Age factor
            sensorTrend.stress_trend * 5                // Trend
        ),
        sleep: clamp(
            Math.max(0, 8 - f.sleep_hours) * 12 +        // Hours deviation from ideal
            3 * f.stress +                               // Stress disrupts sleep
            2 * f.anxiety +                              // Anxiety
            15 * f.junk_food +                          // Poor diet quality
            5 * (season === 'winter' ? 0 : 1) +         // Seasonal variation
            sensorTrend.sleep_trend * 8                 // Trend
        ),
        asthma: clamp(
            spo2Risk * 10 +                              // Low SpO2 is critical
            40 * f.sym_breath +                          // Direct symptoms
            25 * f.fh_asthma +                          // Family history
            20 * f.smoking +                            // Smoking (Pitta/Kapha)
            5 * (season === 'winter' ? 2 : 1) +        // Winter aggravation
            8 * (f.air_quality === 'poor' ? 1 : 0) +   // Environmental factors
            sensorTrend.asthma_trend * 6               // Trend
        ),
        arthritis: clamp(
            Math.max(0, f.age - 35) * 1.3 +             // Age-related (Vata)
            50 * f.sym_joint_pain +                     // Symptoms
            28 * f.fh_arthritis +                       // Family history
            8 * Math.max(0, f.bmi - 24) +              // Overweight stress on joints
            12 * (season === 'winter' || season === 'monsoon' ? 1 : 0) +  // Cold/damp aggravation
            5 * (f.activity_score > 3 ? -1 : 0.5) +   // High intense activity risk
            sensorTrend.arthritis_trend * 5           // Trend
        ),
        obesity: clamp(
            Math.max(0, f.bmi - 24) * 8.5 +             // BMI is primary (Kapha disease)
            18 * f.junk_food +                          // Poor diet (ama creation)
            8 * lowActivity * 100 +                     // Sedentary lifestyle
            3 * f.stress +                              // Stress eating
            5 * (f.sleep_hours > 9 ? 1 : 0) +          // Excessive sleep (Kapha)
            2 * Math.max(0, f.water_l - 3) * -1 +      // Hydration helps
            sensorTrend.obesity_trend * 6              // Trend
        ),
        digestive: clamp(
            45 * f.sym_digestive +                      // Symptoms (Pitta/Vata)
            5 * f.stress +                              // Stress affects digestion
            12 * f.junk_food +                          // Poor food choices
            3 * Math.max(0, 2 - f.water_l) +           // Dehydration
            8 * (f.meal_timing === 'irregular' ? 1 : 0) +  // Irregular eating
            6 * (season === 'summer' ? 2 : 1) +         // Heat aggravates Pitta
            sensorTrend.digestive_trend * 5            // Trend
        ),
        fever: clamp(
            Math.max(0, f.temp - 37.2) * 80 +           // Temperature elevation
            Math.max(0, f.hr - 90) * 1.2 +             // HR elevation with fever
            20 * Math.max(0, 95 - f.spo2) +            // Respiratory involvement
            5 * f.stress +                              // Stress immunosuppression
            chronicity * 5                              // Chronic conditions risk
        ),
    };
}

// Analyze sensor data trends over time
function analyzeSensorTrend(sensorHistory = []) {
    const trend = {
        diabetes_trend: 0, heart_trend: 0, hypertension_trend: 0,
        stress_trend: 0, sleep_trend: 0, asthma_trend: 0,
        arthritis_trend: 0, obesity_trend: 0, digestive_trend: 0
    };
    
    if (sensorHistory.length < 2) return trend;
    
    // Analyze last 7 readings for trend
    const recent = sensorHistory.slice(-7);
    if (recent.length === 0) return trend;
    
    const avgHR = recent.reduce((s, r) => s + (r.heart_rate || 0), 0) / recent.length;
    const avgSpo2 = recent.reduce((s, r) => s + (r.spo2 || 97), 0) / recent.length;
    const avgTemp = recent.reduce((s, r) => s + (r.body_temperature || 36.8), 0) / recent.length;
    
    const hrTrend = recent[recent.length - 1].heart_rate - recent[0].heart_rate;
    const spo2Trend = recent[recent.length - 1].spo2 - recent[0].spo2;
    
    // Increasing heart rate → increased disease risk
    trend.heart_trend = hrTrend > 5 ? 2 : hrTrend < -5 ? -1 : 0;
    trend.hypertension_trend = hrTrend > 5 ? 1.5 : 0;
    trend.diabetes_trend = Math.max(0, avgHR - 80) * 0.1;
    
    // Decreasing SpO2 → respiratory issues
    trend.asthma_trend = spo2Trend < -2 ? 3 : 0;
    
    // Temperature elevation
    trend.fever = avgTemp > 37 ? (avgTemp - 37) * 50 : 0;
    
    return trend;
}

// Advanced Ayurveda-based adjustments
function ayurvedicAdjust(risks, prakriti, season = 'spring', profile = {}) {
    const adj = { ...risks };
    const bump = (k, v) => adj[k] = Math.min(100, (adj[k] || 0) + v);
    const reduce = (k, v) => adj[k] = Math.max(0, (adj[k] || 0) - v);
    
    // Constitutional (Prakriti) adjustments
    switch (prakriti) {
        case 'vata': 
            bump('stress', 8);           // Vata = movement, nervous system
            bump('arthritis', 12);       // Vata → joint instability
            bump('sleep', 10);          // Vata → sleep irregularity
            reduce('fever', 3);          // Vata is cool/dry
            break;
        case 'pitta': 
            bump('hypertension', 10);   // Pitta = intensity, fire
            bump('digestive', 8);       // Pitta = stomach heat
            bump('fever', 8);           // Pitta = heat
            bump('stress', 6);          // Pitta = irritability
            reduce('arthritis', 2);     // Pitta has less joint issues
            break;
        case 'kapha': 
            bump('diabetes', 12);       // Kapha = sluggish metabolism
            bump('obesity', 15);        // Kapha = heavy, dull
            bump('sleep', 8);           // Kapha = excess sleep
            bump('asthma', 8);          // Kapha = congestion
            reduce('stress', 5);        // Kapha = calm, grounded
            break;
    }
    
    // Seasonal (Ritucharya) adjustments
    switch (season) {
        case 'winter':
            bump('arthritis', 5);       // Cold aggravates Vata joints
            bump('asthma', 5);          // Cold air issues
            reduce('pitta', 3);         // Cold reduces Pitta
            break;
        case 'summer':
            bump('hypertension', 5);    // Heat elevates BP
            bump('digestive', 8);       // Heat = Pitta aggravation
            bump('stress', 6);          // Summer stress
            break;
        case 'monsoon':
            bump('arthritis', 6);       // Damp air
            bump('digestive', 10);      // Moisture aggravates digestion
            bump('asthma', 7);          // Humid environment
            break;
        case 'spring':
            bump('asthma', 4);          // Pollen season
            bump('obesity', 4);         // Spring sluggishness
            break;
    }
    
    // Age-related adjustments (Vata increases with age)
    if (profile.age > 50) {
        bump('arthritis', 8);
        bump('stress', 4);
    } else if (profile.age > 65) {
        bump('arthritis', 12);
        bump('stress', 6);
        bump('heart', 6);
    }
    
    // Lifestyle factors
    if (profile.exercise_frequency > 5) {
        reduce('obesity', 5);
        reduce('stress', 3);
        reduce('heart', 2);
    }
    if (profile.water_intake_l > 3) {
        reduce('digestive', 3);
        reduce('dehydration', 5);
    }
    if (profile.smoking) {
        bump('asthma', 10);
        bump('heart', 8);
        bump('hypertension', 6);
    }
    
    return adj;
}

function classify(pct) {
    if (pct <= 30) return 'low';
    if (pct <= 60) return 'moderate';
    if (pct <= 80) return 'high';
    return 'critical';
}

function predict(input, sensorHistory = []) {
    const features = toFeatureVector(input);
    const mdl = loadModel();
    const season = currentSeason();
    
    // Get base predictions from ML or rules
    const base = mdl ? mlPredict(mdl, features) : ruleFallback(features, sensorHistory);
    
    // Apply Ayurveda-based adjustments
    const adjusted = ayurvedicAdjust(
        base,
        input.user?.prakriti || 'vata',
        season,
        input.profile || {}
    );
    
    // Generate detailed explanations
    const classified = Object.fromEntries(
        Object.entries(adjusted).map(([k, v]) => [k, { pct: v, label: classify(v) }])
    );
    
    return {
        model_used: mdl ? 'ml-hybrid-v2' : 'rule-based-ayurvedic',
        features_snapshot: features,
        risks: adjusted,
        classified,
        season: season,
        prakriti: input.user?.prakriti,
        confidence: mdl ? 0.85 : 0.70,  // ML models are more confident
        explain: generateExplanations(adjusted, features, sensorHistory, season, input),
    };
}

// Generate detailed reasoning for each disease risk
function generateExplanations(risks, features, sensorHistory, season, input) {
    const explanations = {};
    
    explanations.diabetes = {
        risk_level: classify(risks.diabetes),
        primary_factors: [
            features.bmi > 25 ? `High BMI (${features.bmi.toFixed(1)}) - primary Kapha aggravation` : null,
            features.activity_score < 1.2 ? 'Low activity level - sedentary lifestyle' : null,
            features.sym_thirst || features.sym_urination ? 'Frequent thirst/urination symptoms' : null,
            features.fh_diabetes ? 'Family history of diabetes' : null,
            features.junk_food > 1 ? 'High junk food intake - increases ama (toxins)' : null,
        ].filter(Boolean),
        ayurveda_insight: `${input.user?.prakriti === 'kapha' ? 'Kapha constitution increases risk significantly. Focus on warming, stimulating foods and regular exercise.' : 'Current lifestyle is increasing Kapha dosha. Reduce heavy, sweet foods.'}`,
        recommendations: [
            'Increase physical activity to 30+ mins daily',
            'Reduce refined carbs and sugar (ama-producing)',
            'Include warming spices: turmeric, ginger, fenugreek',
            'Practice Kapal Bhati pranayama to enhance metabolism',
            'Monitor blood sugar regularly'
        ]
    };
    
    explanations.heart = {
        risk_level: classify(risks.heart),
        primary_factors: [
            features.hr > 85 ? `Elevated resting heart rate (${features.hr} bpm)` : null,
            features.activity_score < 1.2 ? 'Sedentary lifestyle - poor cardiovascular fitness' : null,
            features.smoking ? 'Smoking - major risk factor' : null,
            features.fh_heart ? 'Family history of heart disease' : null,
            features.stress > 6 ? 'High stress levels' : null,
            features.age > 40 ? 'Age > 40 years' : null,
        ].filter(Boolean),
        ayurveda_insight: 'Heart health reflects Agni (digestive fire) quality. Pitta and Vata imbalances weaken heart function.',
        recommendations: [
            'Regular aerobic exercise (walking, swimming)',
            'Meditation and stress reduction (Pitta calming)',
            'Ashwagandha (adaptogenic herb) - 500mg daily',
            'Avoid excess salt and stimulants',
            'Include heart-healthy fats (ghee, coconut)',
            'Monitor BP and heart rate regularly'
        ]
    };
    
    explanations.hypertension = {
        risk_level: classify(risks.hypertension),
        primary_factors: [
            features.stress > 6 ? `High stress (${features.stress}/10)` : null,
            features.bmi > 25 ? 'Overweight - increases BP' : null,
            features.smoking ? 'Smoking' : null,
            features.fh_hypertension ? 'Family history' : null,
            features.age > 40 ? 'Age-related increase' : null,
        ].filter(Boolean),
        ayurveda_insight: 'Pitta aggravation (heat, intensity) elevates blood pressure. Vata excess causes erratic BP patterns.',
        recommendations: [
            'Reduce salt intake significantly',
            'Daily meditation (10-15 mins)',
            'Brahmi and Jatamansi herbs for calm',
            'Avoid spicy/heating foods',
            'Regular walking or swimming',
            'Monitor BP at home weekly'
        ]
    };
    
    explanations.stress = {
        risk_level: classify(risks.stress),
        primary_factors: [
            features.stress > 7 ? `Very high stress (${features.stress}/10)` : null,
            features.sleep_hours < 6 ? `Insufficient sleep (${features.sleep_hours}h, need 7-9)` : null,
            features.anxiety > 5 ? 'High anxiety levels' : null,
        ].filter(Boolean),
        ayurveda_insight: 'Vata imbalance (anxiety, worry). Pitta excess (intensity, irritability). Both weaken immunity.',
        recommendations: [
            'Abhyanga (oil massage) daily - Vata pacifying',
            'Yoga and pranayama (Alternate nostril breathing)',
            'Herbal teas: Brahmi, Ashwagandha, Jatamansi',
            'Establish consistent sleep schedule',
            'Limit caffeine and stimulants',
            'Practice mindfulness for 10+ mins daily'
        ]
    };
    
    explanations.sleep = {
        risk_level: classify(risks.sleep),
        primary_factors: [
            features.sleep_hours < 7 ? `Low sleep hours (${features.sleep_hours}h)` : null,
            features.stress > 5 ? 'Stress disrupts sleep' : null,
            features.junk_food > 1 ? 'Poor diet affects sleep quality' : null,
        ].filter(Boolean),
        ayurveda_insight: `${season === 'winter' ? 'Winter increases Vata - naturally more sleep needed.' : 'Current season may affect sleep patterns.'}`,
        recommendations: [
            'Establish consistent sleep schedule',
            'Avoid screens 1 hour before bed',
            'Warm milk with nutmeg and cardamom before sleep',
            'Gentle yoga or Yin yoga in evening',
            'Shirodhara therapy if possible',
            'Sleep in dark, cool room'
        ]
    };
    
    explanations.asthma = {
        risk_level: classify(risks.asthma),
        primary_factors: [
            features.spo2 < 95 ? `Low SpO2 (${features.spo2}%) - concerning` : null,
            features.sym_breath ? 'Breathing difficulty symptoms' : null,
            features.smoking ? 'Smoking' : null,
            season === 'winter' || season === 'monsoon' ? `${season} season aggravates breathing` : null,
        ].filter(Boolean),
        ayurveda_insight: 'Kapha excess in respiratory system (heaviness, congestion). Vata disturbance causes spasm.',
        recommendations: [
            'Avoid cold drinks and heavy dairy',
            'Warm spiced foods: ginger, turmeric, black pepper',
            'Pranayama: Bhramari (bee breathing), Kapal Bhati',
            'Herbal inhalation: eucalyptus, neem',
            'Avoid exposure to cold, damp, smoky environments',
            'Consider bronchodilator herbs: Vasaka, Tulsi'
        ]
    };
    
    explanations.arthritis = {
        risk_level: classify(risks.arthritis),
        primary_factors: [
            features.age > 40 ? `Age (${features.age}y) - Vata naturally increases` : null,
            features.sym_joint_pain ? 'Joint pain symptoms present' : null,
            features.fh_arthritis ? 'Family history' : null,
            season === 'winter' || season === 'monsoon' ? `${season} cold/damp aggravates joints` : null,
        ].filter(Boolean),
        ayurveda_insight: 'Pure Vata disorder - dryness, roughness, mobility issues. Ama (toxins) accumulation in joints.',
        recommendations: [
            'Warm oil massage (Abhyanga) - critical for Vata',
            'Heating, nourishing foods: sesame, ghee, bone broth',
            'Avoid raw vegetables; prefer cooked',
            'Gentle yoga: avoid extreme stretching',
            'Turmeric + black pepper + ghee - anti-inflammatory',
            'Guggulu and Ashwagandha supplements',
            'Stay warm, avoid draft and cold exposure'
        ]
    };
    
    explanations.obesity = {
        risk_level: classify(risks.obesity),
        primary_factors: [
            features.bmi > 25 ? `High BMI (${features.bmi.toFixed(1)})` : null,
            features.activity_score < 1.5 ? 'Low activity level' : null,
            features.junk_food > 1 ? 'High refined food intake' : null,
        ].filter(Boolean),
        ayurveda_insight: 'Kapha excess: heavy, dull, slow metabolism. Poor Agni (digestive fire) = ama accumulation',
        recommendations: [
            'Favor warm, light, stimulating foods',
            'Spices: mustard, fenugreek, ginger, black pepper',
            'Eat only when hungry (strong Agni sign)',
            'Regular vigorous exercise (30+ mins/day)',
            'Reduce sweet, oily, heavy foods',
            'Triphala before bed - metabolic support',
            'Practice Kapal Bhati and Bhastrika pranayama'
        ]
    };
    
    explanations.digestive = {
        risk_level: classify(risks.digestive),
        primary_factors: [
            features.sym_digestive ? 'Digestive symptoms reported' : null,
            features.junk_food > 1 ? 'Poor food quality' : null,
            features.stress > 5 ? 'Stress impairs digestion' : null,
            season === 'summer' ? 'Summer heat aggravates Pitta digestion' : null,
        ].filter(Boolean),
        ayurveda_insight: 'Weak Agni (digestive fire) = ama production. Pitta excess = hyperacidity. Vata = irregular digestion.',
        recommendations: [
            'Eat warm, freshly cooked foods',
            'Include digestive spices: ginger, cumin, fennel',
            'Sip warm water during meals',
            'Avoid raw, cold foods',
            'Eat in calm, seated environment',
            'Triphala or Hingvastak powder for regular digestion',
            'Buttermilk with cumin after meals'
        ]
    };
    
    explanations.fever = {
        risk_level: classify(risks.fever),
        primary_factors: [
            features.temp > 37.2 ? `Elevated temperature (${features.temp}°C)` : null,
            features.hr > 90 ? 'Elevated heart rate - possible infection' : null,
        ].filter(Boolean),
        ayurveda_insight: 'Body\'s natural response to clear toxins. Support with cooling, immune-strengthening approach.',
        recommendations: [
            'Rest and light, nourishing foods',
            'Cooling herbs: Tulsi, Neem, Brahmi',
            'Herbal teas with honey and lemon',
            'Avoid heavy, oily foods during fever',
            'Stay hydrated with room-temperature water',
            'Cool compress on forehead if needed',
            'Monitor temperature; seek care if > 39°C'
        ]
    };
    
    return explanations;
}

/**
 * Per-disease feature contribution table.
 * For each label, show the top features by signed contribution (w_i * x_i_standardized).
 */
function explainAll(model, rawFeatures, finalRisks) {
    const out = {};
    for (const labelKey of model.labels) {
        const m = model.models[labelKey];
        const contribs = model.features.map((f, j) => {
            const xRaw = rawFeatures[f] == null ? model.means[f] : rawFeatures[f];
            const xStd = (xRaw - model.means[f]) / model.stds[f];
            const c = m.w[j] * xStd;
            return { feature: f, raw_value: xRaw, contribution: +c.toFixed(3) };
        });
        contribs.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
        const diseaseName = labelKey.replace('label_', '');
        out[diseaseName] = {
            risk_pct: finalRisks[diseaseName],
            label: classify(finalRisks[diseaseName]),
            top_factors: contribs.slice(0, 6),
            intercept: +m.b.toFixed(3),
        };
    }
    return out;
}

module.exports = { predict, classify, ayurvedicAdjust };
