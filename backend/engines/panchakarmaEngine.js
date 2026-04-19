/**
 * Panchakarma Readiness Assessment Engine
 *
 * Panchakarma = Five purification therapies in Ayurveda:
 * 1. Vamana (Therapeutic Emesis) - for Kapha disorders
 * 2. Virechana (Therapeutic Purgation) - for Pitta disorders
 * 3. Basti (Medicated Enema) - for Vata disorders
 * 4. Nasya (Nasal Medication) - for head/sinus disorders
 * 5. Raktamokshana (Blood Letting) - for blood disorders
 *
 * Assessment determines if a patient is ready for Panchakarma based on:
 * - Ama (toxin) accumulation level
 * - Ojas (vital essence) level
 * - Agni (digestive fire) strength
 * - Current dosha imbalance severity
 * - Overall constitution and strength (Bala)
 *
 * Reference: Charaka Samhita Siddhisthana
 */

/**
 * Comprehensive Panchakarma readiness assessment
 */
function assessPanchakarmaReadiness(doshaStatus, amaLevel, ojasLevel, agniType, userData, symptoms) {
  const age = userData?.age || 30;
  const bmi = userData?.bmi || 22;

  // Calculate individual scores
  const amaScore = amaLevel?.score || 30;
  const ojasScore = ojasLevel?.score || 60;
  const agniScore = calculateAgniScore(agniType);

  // Readiness score (higher = more ready/needing Panchakarma)
  let readinessScore = 0;

  // High ama = needs cleansing
  if (amaScore > 60) readinessScore += 30;
  else if (amaScore > 40) readinessScore += 20;
  else if (amaScore > 25) readinessScore += 10;

  // Dosha imbalance = needs correction
  const maxAggravation = Math.max(
    doshaStatus.aggravation?.vata || 0,
    doshaStatus.aggravation?.pitta || 0,
    doshaStatus.aggravation?.kapha || 0
  );
  if (maxAggravation > 20) readinessScore += 25;
  else if (maxAggravation > 10) readinessScore += 15;

  // Weak agni = needs correction
  if (agniType.type === 'Manda') readinessScore += 15;
  else if (agniType.type === 'Vishama') readinessScore += 10;

  // Symptom load
  let symptomCount = 0;
  if (symptoms?.digestive_issues) symptomCount++;
  if (symptoms?.joint_pain) symptomCount++;
  if (symptoms?.fatigue_level > 6) symptomCount++;
  if (symptoms?.frequent_thirst) symptomCount++;
  if (symptoms?.breathing_difficulty) symptomCount++;
  readinessScore += symptomCount * 5;

  // But check if patient is strong enough
  // Contraindications: very weak, very old, very young, very low BMI
  let contraindications = [];
  if (ojasScore < 25) {
    readinessScore -= 20;
    contraindications.push('Ojas too depleted - strengthen first with Rasayana therapy');
  }
  if (age > 70) {
    readinessScore -= 15;
    contraindications.push('Advanced age - only mild Panchakarma recommended');
  }
  if (age < 12) {
    readinessScore -= 30;
    contraindications.push('Too young for Panchakarma');
  }
  if (bmi < 17) {
    readinessScore -= 20;
    contraindications.push('Underweight - nourish first before cleansing');
  }

  readinessScore = Math.max(0, Math.min(100, readinessScore));

  // Determine recommended therapies based on dosha
  const recommendedTherapies = getRecommendedTherapies(doshaStatus, amaScore, symptoms);
  const contraindicated = getContraindicatedTherapies(doshaStatus, userData, ojasScore);
  const prepSteps = getPreparatorySteps(doshaStatus, amaScore, agniType);

  // Determine protocol
  let protocol;
  if (doshaStatus.kaphaStatus === 'aggravated') protocol = 'Kapha Shodhana';
  else if (doshaStatus.pittaStatus === 'aggravated') protocol = 'Pitta Shodhana';
  else if (doshaStatus.vataStatus === 'aggravated') protocol = 'Vata Shodhana';
  else protocol = 'Tridosha Shamana (Balancing)';

  return {
    readiness_score: readinessScore,
    ama_score: amaScore,
    ojas_score: ojasScore,
    agni_score: agniScore,
    assessment: getReadinessLevel(readinessScore),
    recommended_therapies: recommendedTherapies,
    contraindicated_therapies: contraindicated,
    preparatory_steps: prepSteps,
    dosha_specific_protocol: protocol,
    contraindications,
    post_panchakarma: getPostPanchakarmaGuidelines(doshaStatus),
    details: {
      ama_analysis: amaLevel,
      ojas_analysis: ojasLevel,
      agni_analysis: agniType,
      dosha_analysis: doshaStatus
    }
  };
}

function calculateAgniScore(agniType) {
  switch (agniType.type) {
    case 'Sama': return 85;
    case 'Tikshna': return 65;
    case 'Vishama': return 45;
    case 'Manda': return 30;
    default: return 50;
  }
}

function getReadinessLevel(score) {
  if (score >= 70) return {
    level: 'Strongly Recommended',
    message: 'High toxin accumulation and dosha imbalance detected. Panchakarma would be highly beneficial.',
    urgency: 'high'
  };
  if (score >= 50) return {
    level: 'Recommended',
    message: 'Moderate imbalance present. Panchakarma would help restore balance and prevent disease progression.',
    urgency: 'moderate'
  };
  if (score >= 30) return {
    level: 'Optional - Seasonal Cleanse',
    message: 'Mild imbalance. Seasonal Panchakarma (Ritucharya) would be beneficial for maintenance.',
    urgency: 'low'
  };
  return {
    level: 'Not Currently Needed',
    message: 'Good balance maintained. Continue current practices. Consider seasonal mini-cleanses.',
    urgency: 'none'
  };
}

function getRecommendedTherapies(doshaStatus, amaScore, symptoms) {
  const therapies = [];

  if (doshaStatus.kaphaStatus === 'aggravated') {
    therapies.push({
      name: 'Vamana (Therapeutic Emesis)',
      sanskrit: 'Vamana Karma',
      purpose: 'Primary therapy for Kapha disorders - removes excess Kapha from chest and stomach',
      process: 'After oleation and sudation preparation, medicated emetic substances are given to induce controlled vomiting',
      duration: '1 day (with 7-14 days preparation)',
      conditions_treated: ['Obesity', 'Respiratory issues', 'Diabetes (Kapha type)', 'Skin diseases', 'Hypothyroid'],
      contraindications: ['Heart disease', 'High BP', 'Elderly', 'Children', 'Pregnancy']
    });

    therapies.push({
      name: 'Udvartana (Dry Powder Massage)',
      sanskrit: 'Udvartana',
      purpose: 'Reduces Kapha, breaks down subcutaneous fat, opens channels',
      process: 'Upward massage with dry herbal powder (Triphala, Kolakulathadi)',
      duration: '45-60 minutes, 7-14 days course',
      conditions_treated: ['Obesity', 'Cellulite', 'Skin dullness', 'Kapha accumulation'],
      contraindications: ['Skin injuries', 'Very dry skin (Vata)']
    });
  }

  if (doshaStatus.pittaStatus === 'aggravated') {
    therapies.push({
      name: 'Virechana (Therapeutic Purgation)',
      sanskrit: 'Virechana Karma',
      purpose: 'Primary therapy for Pitta disorders - cleanses liver, blood, and small intestine',
      process: 'After oleation with medicated ghee, controlled purgation is induced with specific herbs',
      duration: '1 day (with 5-7 days preparation)',
      conditions_treated: ['Skin diseases', 'Acidity', 'Liver disorders', 'Hypertension', 'Inflammatory conditions'],
      contraindications: ['Rectal prolapse', 'Ulcerative colitis (active)', 'Dehydration']
    });

    therapies.push({
      name: 'Shirodhara',
      sanskrit: 'Shirodhara',
      purpose: 'Stream of medicated oil on forehead - deeply calms Pitta fire in mind',
      process: 'Continuous stream of warm medicated oil poured on forehead for 30-45 minutes',
      duration: '30-45 min per session, 7 days course',
      conditions_treated: ['Stress', 'Insomnia', 'Hypertension', 'Anxiety', 'Migraine'],
      contraindications: ['Fever', 'Acute inflammation', 'Brain tumor']
    });
  }

  if (doshaStatus.vataStatus === 'aggravated') {
    therapies.push({
      name: 'Basti (Medicated Enema)',
      sanskrit: 'Basti Karma',
      purpose: 'Primary therapy for Vata disorders - most important of all Panchakarma. Colon is seat of Vata.',
      process: 'Medicated oils/decoctions administered rectally. Two types: Anuvasana (oil) and Niruha (decoction)',
      duration: '8-30 days course (alternating oil and decoction)',
      conditions_treated: ['Joint pain', 'Constipation', 'Lower back pain', 'Nervous system disorders', 'Paralysis'],
      contraindications: ['Diarrhea', 'Rectal bleeding', 'Diabetes (uncontrolled)']
    });

    therapies.push({
      name: 'Abhyanga (Oil Massage)',
      sanskrit: 'Abhyanga',
      purpose: 'Full body oil massage - nourishes tissues, calms Vata, improves circulation',
      process: 'Warm medicated oil massage over entire body in specific strokes',
      duration: '45-60 minutes, daily or as course',
      conditions_treated: ['Vata disorders', 'Dry skin', 'Joint stiffness', 'Anxiety', 'Insomnia'],
      contraindications: ['Fever', 'Indigestion', 'During Kapha aggravation']
    });
  }

  // Universal therapies
  therapies.push({
    name: 'Nasya (Nasal Administration)',
    sanskrit: 'Nasya Karma',
    purpose: 'Clears head, sinuses, and improves mental clarity. "Nasa hi shiraso dwaram" - Nose is gateway to head.',
    process: 'Medicated oil or powder administered through nostrils after facial steam',
    duration: '7-14 days course',
    conditions_treated: ['Sinusitis', 'Headache', 'Hair loss', 'Memory issues', 'Neck stiffness'],
    contraindications: ['After meals', 'During menstruation', 'Cold/fever']
  });

  return therapies;
}

function getContraindicatedTherapies(doshaStatus, userData, ojasScore) {
  const contraindicated = [];

  if (ojasScore < 30) {
    contraindicated.push('Strong Shodhana (purification) - Ojas too low. Build strength first with Rasayana.');
  }
  if (userData?.age > 65) {
    contraindicated.push('Vamana (emesis) and strong Virechana - use milder alternatives.');
  }
  if (doshaStatus.vataStatus === 'aggravated' && doshaStatus.dominant === 'Vata') {
    contraindicated.push('Vamana - may severely aggravate Vata. Use Basti instead.');
  }

  return contraindicated;
}

function getPreparatorySteps(doshaStatus, amaScore, agniType) {
  const steps = [];

  // 1. Deepana-Pachana (Kindle fire, digest ama)
  steps.push({
    step: 1,
    name: 'Deepana-Pachana (Kindle Agni, Digest Ama)',
    duration: '3-7 days',
    details: 'Take Trikatu (ginger+pepper+pippali) or Hingvastak churna before meals to strengthen digestive fire and begin ama digestion.',
    herbs: ['Trikatu', 'Hingvastak Churna', 'Chitrakadi Vati']
  });

  // 2. Snehapana (Internal Oleation)
  steps.push({
    step: 2,
    name: 'Snehapana (Internal Oleation)',
    duration: '3-7 days',
    details: doshaStatus.pittaStatus === 'aggravated'
      ? 'Take increasing doses of medicated ghee (Tikta Ghrita for Pitta) on empty stomach.'
      : 'Take increasing doses of plain or medicated ghee on empty stomach. Start with 25ml, increase daily.',
    herbs: ['Medicated Ghee', 'Tikta Ghrita (for Pitta)', 'Plain Cow Ghee']
  });

  // 3. Abhyanga + Swedana (External Oleation + Sudation)
  steps.push({
    step: 3,
    name: 'Abhyanga + Swedana (Oil Massage + Steam)',
    duration: '3 days',
    details: 'Full body oil massage followed by steam bath. This loosens toxins from tissues and moves them toward the GI tract for elimination.',
    herbs: [
      doshaStatus.vataStatus === 'aggravated' ? 'Dhanwantaram Oil' : 'Ksheerabala Oil',
      'Sesame Oil (for Vata)', 'Coconut Oil (for Pitta)'
    ]
  });

  return steps;
}

function getPostPanchakarmaGuidelines(doshaStatus) {
  return {
    diet: {
      day_1_3: 'Peya (thin rice gruel) - very light and easy to digest',
      day_4_7: 'Vilepi (thick rice gruel) with ghee - gradually increase complexity',
      day_8_14: 'Khichdi with vegetables - gentle return to normal food',
      day_15_plus: 'Normal diet following dosha-appropriate guidelines',
      note: 'This gradual diet is called Samsarjana Krama - vital for rebuilding Agni after cleansing'
    },
    lifestyle: [
      'Complete rest for first 3 days',
      'No travel, heavy exercise, or sun exposure for 1 week',
      'Early to bed, early to rise',
      'Avoid cold foods, cold water, and wind exposure',
      'Gentle pranayama from day 3',
      'Light yoga from day 7'
    ],
    rasayana: {
      description: 'After Panchakarma, the body is like a clean cloth - it absorbs Rasayana (rejuvenative) medicines best.',
      herbs: [
        'Chyawanprash (general rejuvenation)',
        'Ashwagandha (strength and vitality)',
        'Brahmi (mental clarity)',
        'Shatavari (female reproductive health)',
        'Amalaki (immunity and ojas builder)'
      ]
    }
  };
}

/**
 * Nadi Pariksha (Digital Pulse Analysis) Engine
 *
 * Maps ESP32 pulse sensor data to Ayurvedic pulse types:
 * - Vata Pulse (Sarpa Gati / Snake-like): Irregular, thin, fast, moves in zigzag
 * - Pitta Pulse (Manduka Gati / Frog-like): Regular, strong, bounding, jumps
 * - Kapha Pulse (Hamsa Gati / Swan-like): Slow, steady, heavy, gliding
 */
function analyzeNadiPariksha(sensorData) {
  const pulseRate = sensorData?.pulse_rate || sensorData?.heart_rate || 72;
  const variability = sensorData?.hrv || calculateMockHRV(pulseRate);
  const amplitude = sensorData?.amplitude || calculateMockAmplitude(pulseRate);

  let vataPulse = 0, pittaPulse = 0, kaphaPulse = 0;
  let nadiType, rhythm, volume, character;

  // Rate-based analysis
  if (pulseRate > 85) {
    vataPulse += 0.3;
    pittaPulse += 0.2;
  } else if (pulseRate > 70) {
    pittaPulse += 0.3;
  } else {
    kaphaPulse += 0.3;
  }

  // Variability-based (high variability = Vata)
  if (variability > 60) {
    vataPulse += 0.3;
    rhythm = 'irregular_thin';
  } else if (variability > 35) {
    pittaPulse += 0.2;
    rhythm = 'regular_strong';
  } else {
    kaphaPulse += 0.3;
    rhythm = 'regular_slow';
  }

  // Amplitude-based
  if (amplitude > 70) {
    pittaPulse += 0.2;
    volume = 'full';
    character = 'bounding';
  } else if (amplitude > 40) {
    kaphaPulse += 0.2;
    volume = 'heavy';
    character = 'swan_like';
  } else {
    vataPulse += 0.2;
    volume = 'thready';
    character = 'snake_like';
  }

  // Normalize
  const total = vataPulse + pittaPulse + kaphaPulse;
  if (total > 0) {
    vataPulse = Math.round((vataPulse / total) * 100) / 100;
    pittaPulse = Math.round((pittaPulse / total) * 100) / 100;
    kaphaPulse = Math.round((kaphaPulse / total) * 100) / 100;
  }

  // Determine dominant nadi
  if (vataPulse >= pittaPulse && vataPulse >= kaphaPulse) {
    nadiType = 'Vata Nadi (Sarpa Gati - Snake-like)';
  } else if (pittaPulse >= kaphaPulse) {
    nadiType = 'Pitta Nadi (Manduka Gati - Frog-like)';
  } else {
    nadiType = 'Kapha Nadi (Hamsa Gati - Swan-like)';
  }

  // Generate interpretation
  const interpretation = generateNadiInterpretation(vataPulse, pittaPulse, kaphaPulse, pulseRate);

  return {
    pulse_rate: pulseRate,
    pulse_rhythm: rhythm,
    pulse_volume: volume,
    pulse_character: character,
    vata_pulse: vataPulse,
    pitta_pulse: pittaPulse,
    kapha_pulse: kaphaPulse,
    nadi_type: nadiType,
    interpretation,
    confidence_score: 0.75 + (sensorData?.quality_score || 80) / 400
  };
}

function generateNadiInterpretation(vata, pitta, kapha, rate) {
  const parts = [];

  if (vata > 0.45) {
    parts.push(`Strong Vata pulse detected (${Math.round(vata * 100)}%). The pulse moves like a snake - thin, irregular, and swift. This indicates Vata dominance with potential for anxiety, restlessness, or nervous system sensitivity.`);
    parts.push('Recommendation: Grounding foods (warm, oily), regular routine, Abhyanga (oil massage), and calming practices.');
  } else if (pitta > 0.45) {
    parts.push(`Strong Pitta pulse detected (${Math.round(pitta * 100)}%). The pulse jumps like a frog - strong, regular, and bounding. This indicates strong Pitta with active metabolism and sharp digestion.`);
    parts.push('Recommendation: Cooling foods, avoid excessive heat and spice, practice Moon Salutations, Sheetali pranayama.');
  } else if (kapha > 0.45) {
    parts.push(`Strong Kapha pulse detected (${Math.round(kapha * 100)}%). The pulse glides like a swan - slow, steady, and deep. This indicates Kapha dominance with stability but potential for sluggishness.`);
    parts.push('Recommendation: Light, warm, spiced foods, vigorous exercise, avoid daytime sleep, Kapalabhati pranayama.');
  } else {
    parts.push('Balanced pulse detected. No single dosha strongly dominates the pulse pattern.');
    parts.push('Continue balanced lifestyle practices.');
  }

  if (rate > 90) parts.push('Note: Elevated pulse rate. May indicate stress, fever, or Pitta aggravation.');
  if (rate < 55) parts.push('Note: Low pulse rate. May indicate strong Kapha or athletic conditioning.');

  return parts.join(' ');
}

function calculateMockHRV(pulseRate) {
  // Higher pulse rate typically correlates with lower HRV (more Vata-like)
  if (pulseRate > 85) return 40 + Math.random() * 30;
  if (pulseRate > 70) return 30 + Math.random() * 25;
  return 20 + Math.random() * 20;
}

function calculateMockAmplitude(pulseRate) {
  if (pulseRate > 80) return 50 + Math.random() * 30;
  if (pulseRate > 65) return 60 + Math.random() * 25;
  return 40 + Math.random() * 30;
}

module.exports = {
  assessPanchakarmaReadiness,
  analyzeNadiPariksha
};
