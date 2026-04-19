/**
 * Core Ayurvedic Recommendation Engine
 * Implements authentic Ayurvedic principles from Charaka Samhita, Ashtanga Hridaya
 *
 * Key Concepts:
 * - Prakriti (Constitution): Vata, Pitta, Kapha
 * - Vikriti (Current Imbalance)
 * - Agni (Digestive Fire): Sama, Vishama, Tikshna, Manda
 * - Ama (Toxins): Accumulated waste from poor digestion
 * - Ojas (Vital Essence): Strength of immunity and vitality
 * - Srotas (Channels): Body channels that can be blocked
 * - Rasa (Taste): Sweet, Sour, Salty, Pungent, Bitter, Astringent
 * - Guna (Quality): Heavy/Light, Hot/Cold, Oily/Dry, etc.
 * - Virya (Potency): Heating or Cooling
 * - Vipaka (Post-digestive effect): Sweet, Sour, Pungent
 */

// =====================================================
// DOSHA ANALYSIS ENGINE
// =====================================================

/**
 * Determine Agni (digestive fire) type based on dosha and symptoms
 * Charaka Samhita: 4 types of Agni
 */
function determineAgniType(doshaStatus, symptoms, ayurvedicInputs) {
  const digestionStrength = ayurvedicInputs?.digestion_strength || 5;
  const appetite = ayurvedicInputs?.appetite || 5;
  const digestiveIssues = symptoms?.digestive_issues || false;

  // Vishama Agni (Irregular) - Vata dominant
  if (doshaStatus.dominant === 'Vata' || (digestionStrength < 5 && appetite > 6)) {
    return {
      type: 'Vishama',
      sanskrit: 'Vishama Agni',
      description: 'Irregular digestive fire - sometimes strong, sometimes weak',
      recommendations: [
        'Eat at regular times without fail',
        'Favor warm, cooked, slightly oily foods',
        'Add ginger and cumin to meals',
        'Avoid raw and cold foods completely',
        'Small, frequent meals are better than large ones'
      ]
    };
  }

  // Tikshna Agni (Sharp/Intense) - Pitta dominant
  if (doshaStatus.dominant === 'Pitta' || (digestionStrength > 7 && appetite > 7)) {
    return {
      type: 'Tikshna',
      sanskrit: 'Tikshna Agni',
      description: 'Sharp, intense digestive fire - digests quickly, always hungry',
      recommendations: [
        'Never skip meals - Tikshna agni causes acidity if unfed',
        'Include cooling foods: coconut, cucumber, coriander',
        'Avoid excessive spicy, sour, and salty foods',
        'Lunch should be the largest meal',
        'Drink room temperature water, not ice cold'
      ]
    };
  }

  // Manda Agni (Sluggish) - Kapha dominant
  if (doshaStatus.dominant === 'Kapha' || (digestionStrength < 4 && appetite < 5)) {
    return {
      type: 'Manda',
      sanskrit: 'Manda Agni',
      description: 'Sluggish digestive fire - slow digestion, low appetite, heaviness after eating',
      recommendations: [
        'Eat only when truly hungry',
        'Favor light, warm, dry, and spiced foods',
        'Use ginger, black pepper, and long pepper (Trikatu) before meals',
        'Skip breakfast or have only warm water with honey',
        'Largest meal at noon, very light dinner',
        'Fast one day per week (warm water and herbal teas only)'
      ]
    };
  }

  // Sama Agni (Balanced) - Tridoshic or balanced
  return {
    type: 'Sama',
    sanskrit: 'Sama Agni',
    description: 'Balanced digestive fire - good digestion, regular appetite',
    recommendations: [
      'Maintain your excellent digestion with regular eating habits',
      'Eat according to the season (Ritucharya)',
      'Include all six tastes in your meals',
      'Continue balanced lifestyle practices'
    ]
  };
}

/**
 * Calculate Ama (toxin) level based on symptoms and lifestyle
 * High ama = clogged channels, poor digestion, disease susceptibility
 */
function calculateAmaLevel(symptoms, lifestyle, ayurvedicInputs) {
  let amaScore = 0;

  // Digestive indicators
  if (symptoms?.digestive_issues) amaScore += 15;
  if (ayurvedicInputs?.tongue_coating === 'thick_white') amaScore += 20;
  if (ayurvedicInputs?.tongue_coating === 'yellow') amaScore += 15;
  if (ayurvedicInputs?.bowel_regularity === 'irregular') amaScore += 10;
  if ((ayurvedicInputs?.digestion_strength || 5) < 4) amaScore += 15;

  // Lifestyle indicators
  if (lifestyle?.junk_food_frequency > 5) amaScore += 15;
  if ((lifestyle?.exercise_minutes || 0) < 20) amaScore += 10;
  if ((lifestyle?.water_intake_liters || 2) < 1.5) amaScore += 10;
  if (lifestyle?.smoking) amaScore += 15;
  if (lifestyle?.alcohol) amaScore += 10;

  // Symptom indicators
  if (symptoms?.fatigue_level > 6) amaScore += 10;
  if (symptoms?.joint_pain) amaScore += 10;
  if (symptoms?.frequent_thirst) amaScore += 5;

  amaScore = Math.min(100, Math.max(0, amaScore));

  let level;
  if (amaScore < 25) level = 'Low';
  else if (amaScore < 50) level = 'Moderate';
  else if (amaScore < 75) level = 'High';
  else level = 'Severe';

  return {
    score: amaScore,
    level,
    signs: getAmaSignsPresent(symptoms, ayurvedicInputs),
    detoxRecommendations: getDetoxRecommendations(level)
  };
}

function getAmaSignsPresent(symptoms, ayurvedicInputs) {
  const signs = [];
  if (ayurvedicInputs?.tongue_coating !== 'normal') signs.push('Coated tongue (Sama Jihva)');
  if (symptoms?.fatigue_level > 5) signs.push('Persistent fatigue (Alasya)');
  if (symptoms?.digestive_issues) signs.push('Digestive discomfort (Avipaka)');
  if (symptoms?.joint_pain) signs.push('Joint stiffness (Sandhishoola)');
  if (ayurvedicInputs?.bowel_regularity === 'irregular') signs.push('Irregular bowels (Vibandha)');
  return signs;
}

function getDetoxRecommendations(amaLevel) {
  const recs = {
    'Low': [
      'Maintain current healthy practices',
      'Drink warm water with lemon in morning',
      'Include Triphala before bed occasionally'
    ],
    'Moderate': [
      'Start day with warm water and lemon',
      'Take Triphala (1 tsp) nightly before bed',
      'Practice light fasting one day per week',
      'Include ginger-lemon-honey tea before meals',
      'Favor light, warm, cooked foods for 2 weeks'
    ],
    'High': [
      'Urgent: Begin Ama-reducing protocol',
      'Warm water with honey every morning (empty stomach)',
      'Triphala nightly, Trikatu before meals',
      'Light khichdi diet for 3-5 days',
      'No raw food, no dairy, no heavy foods',
      'Consider Panchakarma consultation'
    ],
    'Severe': [
      'Critical: Seek Ayurvedic practitioner for supervised Panchakarma',
      'Strict khichdi mono-diet for 7 days',
      'Complete rest and gentle yoga only',
      'Warm water sipping throughout day',
      'No cold, heavy, or processed foods',
      'Professional Panchakarma strongly recommended'
    ]
  };
  return recs[amaLevel] || recs['Moderate'];
}

/**
 * Calculate Ojas (vital essence / immunity strength)
 * High ojas = strong immunity, mental clarity, contentment
 * Low ojas = susceptibility to disease, fatigue, fear
 */
function calculateOjasLevel(userData, symptoms, lifestyle, sleepData) {
  let ojasScore = 70; // Start at good baseline

  // Positive factors (increase ojas)
  if ((lifestyle?.exercise_minutes || 0) >= 30) ojasScore += 5;
  if ((lifestyle?.water_intake_liters || 2) >= 2.5) ojasScore += 3;
  if ((sleepData?.sleep_duration_hours || 7) >= 7) ojasScore += 5;
  if ((sleepData?.stress_level || 5) < 4) ojasScore += 5;
  if (lifestyle?.diet_type === 'Vegetarian') ojasScore += 3;
  if (!lifestyle?.smoking) ojasScore += 5;
  if (!lifestyle?.alcohol) ojasScore += 3;

  // Negative factors (decrease ojas)
  if (symptoms?.fatigue_level > 6) ojasScore -= 15;
  if ((sleepData?.stress_level || 5) > 7) ojasScore -= 15;
  if ((sleepData?.sleep_duration_hours || 7) < 5) ojasScore -= 15;
  if (lifestyle?.smoking) ojasScore -= 20;
  if (lifestyle?.alcohol) ojasScore -= 10;
  if (lifestyle?.junk_food_frequency > 6) ojasScore -= 10;
  if (symptoms?.frequent_thirst && symptoms?.frequent_urination) ojasScore -= 10;

  ojasScore = Math.min(100, Math.max(0, ojasScore));

  let level;
  if (ojasScore >= 75) level = 'High';
  else if (ojasScore >= 50) level = 'Moderate';
  else if (ojasScore >= 25) level = 'Low';
  else level = 'Depleted';

  return {
    score: ojasScore,
    level,
    ojasBuilders: [
      'Warm milk with ghee and dates',
      'Soaked almonds (5-6 daily)',
      'Ashwagandha with warm milk',
      'Adequate sleep (7-8 hours)',
      'Meditation and positive emotions',
      'Sattvic (pure, fresh) diet'
    ]
  };
}

/**
 * Calculate comprehensive dosha status (Vikriti - current state)
 * Compares Prakriti (birth constitution) vs current state
 */
function calculateDoshaStatus(prakriti, symptoms, lifestyle, sleepData, ayurvedicInputs) {
  const vataBase = prakriti?.vata_percent || 33;
  const pittaBase = prakriti?.pitta_percent || 33;
  const kaphaBase = prakriti?.kapha_percent || 34;

  let vataAggravation = 0;
  let pittaAggravation = 0;
  let kaphaAggravation = 0;

  // Vata aggravating factors
  if ((sleepData?.stress_level || 5) > 6) vataAggravation += 10;
  if ((sleepData?.sleep_duration_hours || 7) < 6) vataAggravation += 8;
  if ((sleepData?.anxiety_level || 5) > 6) vataAggravation += 10;
  if (ayurvedicInputs?.stress_response === 'anxious') vataAggravation += 8;
  if (ayurvedicInputs?.skin_type === 'dry') vataAggravation += 5;
  if (ayurvedicInputs?.pulse_quality === 'thready') vataAggravation += 8;
  if ((lifestyle?.exercise_minutes || 0) > 120) vataAggravation += 5; // Excessive exercise

  // Pitta aggravating factors
  if (ayurvedicInputs?.body_temperature === 'hot') pittaAggravation += 10;
  if (ayurvedicInputs?.stress_response === 'irritable') pittaAggravation += 10;
  if ((ayurvedicInputs?.digestion_strength || 5) > 7) pittaAggravation += 5;
  if ((ayurvedicInputs?.sweating || 5) > 6) pittaAggravation += 5;
  if (ayurvedicInputs?.tongue_coating === 'yellow') pittaAggravation += 8;
  if (ayurvedicInputs?.skin_type === 'oily') pittaAggravation += 3;
  if (lifestyle?.alcohol) pittaAggravation += 8;

  // Kapha aggravating factors
  if (lifestyle?.physical_activity === 'low') kaphaAggravation += 10;
  if ((sleepData?.daytime_sleepiness || 3) > 5) kaphaAggravation += 8;
  if ((lifestyle?.junk_food_frequency || 3) > 5) kaphaAggravation += 8;
  if (ayurvedicInputs?.tongue_coating === 'thick_white') kaphaAggravation += 10;
  if (ayurvedicInputs?.pulse_quality === 'heavy') kaphaAggravation += 8;
  const bmi = userData?.bmi || 22;
  if (bmi > 27) kaphaAggravation += 10;

  // Calculate current levels
  const currentVata = Math.min(100, vataBase + vataAggravation);
  const currentPitta = Math.min(100, pittaBase + pittaAggravation);
  const currentKapha = Math.min(100, kaphaBase + kaphaAggravation);

  // Normalize
  const total = currentVata + currentPitta + currentKapha;
  const normalizedVata = Math.round((currentVata / total) * 100);
  const normalizedPitta = Math.round((currentPitta / total) * 100);
  const normalizedKapha = 100 - normalizedVata - normalizedPitta;

  // Determine imbalance
  const maxDosha = Math.max(normalizedVata, normalizedPitta, normalizedKapha);
  let dominant;
  if (normalizedVata === maxDosha) dominant = 'Vata';
  else if (normalizedPitta === maxDosha) dominant = 'Pitta';
  else dominant = 'Kapha';

  const imbalanceThreshold = 45; // If any dosha exceeds 45%, it's aggravated
  const imbalanced = maxDosha > imbalanceThreshold;

  return {
    vata: normalizedVata,
    pitta: normalizedPitta,
    kapha: normalizedKapha,
    dominant,
    imbalanced,
    vataStatus: normalizedVata > imbalanceThreshold ? 'aggravated' : normalizedVata < 20 ? 'depleted' : 'balanced',
    pittaStatus: normalizedPitta > imbalanceThreshold ? 'aggravated' : normalizedPitta < 20 ? 'depleted' : 'balanced',
    kaphaStatus: normalizedKapha > imbalanceThreshold ? 'aggravated' : normalizedKapha < 20 ? 'depleted' : 'balanced',
    aggravation: {
      vata: vataAggravation,
      pitta: pittaAggravation,
      kapha: kaphaAggravation
    }
  };
}

// =====================================================
// SEASONAL (RITUCHARYA) ENGINE
// =====================================================

/**
 * Get current Ayurvedic season (Ritu) based on month
 * 6 seasons in Ayurveda, each 2 months
 */
function getCurrentRitu() {
  const month = new Date().getMonth() + 1;

  const ritus = {
    'Shishira': { months: [1, 2], english: 'Late Winter', dominant: 'Kapha accumulates', taste: 'Sweet, Sour, Salty' },
    'Vasanta': { months: [3, 4], english: 'Spring', dominant: 'Kapha aggravates', taste: 'Pungent, Bitter, Astringent' },
    'Grishma': { months: [5, 6], english: 'Summer', dominant: 'Vata accumulates', taste: 'Sweet, Cool, Liquid' },
    'Varsha': { months: [7, 8], english: 'Monsoon', dominant: 'Vata aggravates', taste: 'Sweet, Sour, Salty (light)' },
    'Sharad': { months: [9, 10], english: 'Autumn', dominant: 'Pitta aggravates', taste: 'Sweet, Bitter, Astringent' },
    'Hemanta': { months: [11, 12], english: 'Early Winter', dominant: 'Vata calms, Kapha starts', taste: 'Sweet, Sour, Salty' }
  };

  for (const [name, info] of Object.entries(ritus)) {
    if (info.months.includes(month)) {
      return { ritu: name, ...info };
    }
  }
  return { ritu: 'Vasanta', ...ritus['Vasanta'] };
}

/**
 * Generate seasonal regimen (Ritucharya) recommendations
 */
function generateRitucharya(ritu, doshaStatus) {
  const ritucharya = {
    'Shishira': {
      diet: {
        favor: ['Sweet foods', 'Sour foods', 'Salty foods', 'Warm milk with ghee', 'Sesame products', 'Jaggery', 'Warm soups', 'Urad dal', 'Wheat'],
        avoid: ['Cold drinks', 'Raw foods', 'Light dry foods', 'Fasting', 'Vata-aggravating foods'],
        guidelines: 'Strength is at its peak. Eat nourishing, heavy foods. Agni is strongest in winter.'
      },
      lifestyle: ['Abhyanga with sesame oil daily', 'Warm clothing', 'Sunbathing (moderate)', 'Exercise can be vigorous', 'Warm water bathing'],
      exercise: ['Vigorous exercise allowed', 'Wrestling, swimming recommended in texts', 'Surya Namaskar 12+ rounds', 'Strength training'],
      herbs: ['Ashwagandha', 'Shatavari', 'Bala', 'Sesame oil internally and externally']
    },
    'Vasanta': {
      diet: {
        favor: ['Barley', 'Honey (not heated)', 'Mung dal', 'Old rice', 'Ginger', 'Light foods', 'Bitter vegetables'],
        avoid: ['Heavy foods', 'Sweet foods in excess', 'Cold dairy', 'Fried foods', 'Daytime sleeping'],
        guidelines: 'Kapha melts and floods the body. Eat light, dry, warm foods to counteract.'
      },
      lifestyle: ['Dry powder massage (Udvartana)', 'Vigorous exercise', 'No daytime sleeping', 'Nasya (nasal drops)', 'Early rising'],
      exercise: ['Most vigorous exercise of the year', 'Kapalabhati pranayama', 'Running, vigorous yoga', 'Surya Namaskar fast-paced'],
      herbs: ['Trikatu (ginger, pepper, pippali)', 'Honey with warm water', 'Triphala', 'Turmeric']
    },
    'Grishma': {
      diet: {
        favor: ['Sweet foods', 'Cool foods', 'Liquid foods', 'Coconut water', 'Rice', 'Milk', 'Ghee', 'Mung dal'],
        avoid: ['Spicy foods', 'Sour foods', 'Salty foods', 'Alcohol', 'Excessive exercise'],
        guidelines: 'Sun depletes strength. Eat cooling, sweet, liquid foods. Reduce activity.'
      },
      lifestyle: ['Stay in cool places', 'Moonlight walks', 'Sandalwood application', 'Light cotton clothes', 'Afternoon rest allowed'],
      exercise: ['Light exercise only', 'Swimming', 'Evening walks', 'Gentle yoga', 'Sheetali pranayama'],
      herbs: ['Amalaki', 'Shatavari', 'Brahmi', 'Rose water', 'Sandalwood']
    },
    'Varsha': {
      diet: {
        favor: ['Old grains', 'Warm soups', 'Ginger tea', 'Mung dal', 'Rock salt', 'Honey'],
        avoid: ['Heavy foods', 'Raw foods', 'River water', 'Excessive liquids', 'Leafy greens (contamination)'],
        guidelines: 'Agni is weakest. Vata aggravates. Eat warm, light, easily digestible foods.'
      },
      lifestyle: ['Fumigation of clothes', 'Avoid getting wet in rain', 'Use boiled water', 'Abhyanga with medicated oils', 'Avoid daytime sleeping'],
      exercise: ['Moderate exercise', 'Indoor yoga', 'Avoid overexertion', 'Pranayama practice'],
      herbs: ['Haritaki', 'Dried ginger', 'Pippali', 'Saindhava (rock salt)', 'Asafoetida']
    },
    'Sharad': {
      diet: {
        favor: ['Sweet foods', 'Bitter foods', 'Ghee', 'Rice', 'Mung dal', 'Amla', 'Milk'],
        avoid: ['Sour foods', 'Spicy foods', 'Oil', 'Fat in excess', 'Yogurt', 'Alcohol'],
        guidelines: 'Pitta releases. Favor sweet and bitter tastes. This is the time for Virechana (purgation).'
      },
      lifestyle: ['Moonlight exposure (Chandrika)', 'Virechana Panchakarma recommended', 'Moderate exercise', 'Cooling activities'],
      exercise: ['Moderate exercise', 'Moon Salutations', 'Cooling pranayama', 'Swimming'],
      herbs: ['Amalaki', 'Guduchi (Giloy)', 'Shatavari', 'Yashtimadhu (Licorice)']
    },
    'Hemanta': {
      diet: {
        favor: ['Milk products', 'Sugarcane', 'Rice', 'Oils and fats', 'Warm foods', 'Sweet sour salty tastes', 'Meat soups (if non-veg)'],
        avoid: ['Light dry foods', 'Cold drinks', 'Fasting', 'Vata-aggravating foods'],
        guidelines: 'Agni strengthens as cold increases. Body needs more fuel. Eat heavy, nourishing foods.'
      },
      lifestyle: ['Abhyanga with warm oils', 'Warm clothing', 'Exercise vigorously', 'Sunbathing', 'Warm water for bathing'],
      exercise: ['Vigorous exercise', 'Strength building', 'Active yoga', 'Morning Surya Namaskar'],
      herbs: ['Ashwagandha', 'Bala', 'Shatavari', 'Sesame oil (internal and external)']
    }
  };

  const plan = ritucharya[ritu] || ritucharya['Vasanta'];

  // Personalize based on dosha status
  if (doshaStatus.vataStatus === 'aggravated') {
    plan.personalNote = 'Your Vata is aggravated. Extra emphasis on warm, oily, grounding foods and regular routine.';
    plan.diet.favor.push('Extra ghee', 'Warm milk', 'Cooked root vegetables');
  } else if (doshaStatus.pittaStatus === 'aggravated') {
    plan.personalNote = 'Your Pitta is aggravated. Favor cooling foods even within seasonal recommendations.';
    plan.diet.favor.push('Coconut', 'Cucumber', 'Coriander');
  } else if (doshaStatus.kaphaStatus === 'aggravated') {
    plan.personalNote = 'Your Kapha is aggravated. Favor lighter options within seasonal recommendations.';
    plan.diet.favor.push('Honey', 'Ginger', 'Light grains');
  }

  return plan;
}

// =====================================================
// DOSHA CLOCK (KALA CHAKRA)
// =====================================================

/**
 * Get dosha-based time recommendations
 * Each dosha dominates specific 4-hour periods twice daily
 *
 * Kapha: 6-10 AM / 6-10 PM
 * Pitta: 10 AM-2 PM / 10 PM-2 AM
 * Vata: 2-6 PM / 2-6 AM
 */
function getDoshaClockRecommendation(hour, doshaStatus) {
  if (typeof hour !== 'number') hour = new Date().getHours();

  let period, dominantDosha, recommendations, activities;

  if (hour >= 2 && hour < 6) {
    period = 'Brahma Muhurta to Early Morning (2-6 AM)';
    dominantDosha = 'Vata';
    activities = 'meditation';
    recommendations = {
      ideal: 'Wake up during Brahma Muhurta (96 min before sunrise, ~4:30-5 AM). This is the most sattvic time - ideal for meditation, prayer, and spiritual practice.',
      activities: ['Wake by 5 AM', 'Meditation and pranayama', 'Spiritual study', 'Creative work', 'Elimination (natural bowel movement time)'],
      avoid: ['Sleeping past 6 AM (accumulates Kapha)', 'Heavy foods', 'Excessive stimulation']
    };
  } else if (hour >= 6 && hour < 10) {
    period = 'Morning Kapha Time (6-10 AM)';
    dominantDosha = 'Kapha';
    activities = 'exercise';
    recommendations = {
      ideal: 'Kapha energy makes this the best time for exercise and physical activity. Move vigorously to counteract Kapha heaviness.',
      activities: ['Vigorous exercise (yoga, running, gym)', 'Abhyanga (oil massage) before shower', 'Light breakfast by 8 AM', 'Active work tasks'],
      avoid: ['Sleeping in', 'Heavy breakfast', 'Sedentary activities', 'Cold drinks']
    };
  } else if (hour >= 10 && hour < 14) {
    period = 'Midday Pitta Time (10 AM-2 PM)';
    dominantDosha = 'Pitta';
    activities = 'eating';
    recommendations = {
      ideal: 'Digestive fire (Agni) is at its peak. This MUST be your largest meal. Pitta energy supports mental sharpness.',
      activities: ['Largest meal of the day (noon)', 'Intellectual work', 'Decision making', 'Important meetings', 'Walk after lunch (100 steps)'],
      avoid: ['Skipping lunch', 'Light/insufficient eating', 'Excessive sun exposure', 'Arguments (Pitta is high)']
    };
  } else if (hour >= 14 && hour < 18) {
    period = 'Afternoon Vata Time (2-6 PM)';
    dominantDosha = 'Vata';
    activities = 'creative_work';
    recommendations = {
      ideal: 'Vata energy supports creativity and communication. Good for creative tasks. Energy may dip - stay grounded.',
      activities: ['Creative projects', 'Communication tasks', 'Light snack if needed (4 PM)', 'Herbal tea', 'Problem solving'],
      avoid: ['Heavy snacking', 'Excessive caffeine', 'Overstimulation', 'Starting new heavy tasks']
    };
  } else if (hour >= 18 && hour < 22) {
    period = 'Evening Kapha Time (6-10 PM)';
    dominantDosha = 'Kapha';
    activities = 'winding_down';
    recommendations = {
      ideal: 'Kapha energy promotes calmness and sleep preparation. Eat light dinner early. Begin winding down routine.',
      activities: ['Light dinner by 7 PM', 'Gentle walk after dinner', 'Family time', 'Light reading', 'Warm milk with spices (9 PM)', 'Sleep by 10 PM'],
      avoid: ['Heavy dinner', 'Screen time after 9 PM', 'Intense exercise', 'Stimulating content', 'Late eating']
    };
  } else {
    period = 'Night Pitta Time (10 PM-2 AM)';
    dominantDosha = 'Pitta';
    activities = 'sleeping';
    recommendations = {
      ideal: 'Body performs internal cleansing and repair. Pitta digests emotions and experiences. MUST be asleep during this time.',
      activities: ['Deep sleep', 'Body repair and detoxification', 'Liver cleansing', 'Emotional processing', 'Tissue regeneration'],
      avoid: ['Being awake (disrupts repair cycle)', 'Eating (diverts Pitta from repair to digestion)', 'Screen time', 'Mental work']
    };
  }

  // Personalize based on user's dosha
  let personalTip = '';
  if (doshaStatus.dominant === dominantDosha) {
    personalTip = `Your dominant dosha (${dominantDosha}) matches this time period. You may feel its effects more strongly. Balance with opposing qualities.`;
  }

  return {
    hour,
    period,
    dominantDosha,
    activityType: activities,
    recommendations,
    personalTip
  };
}

// =====================================================
// DISEASE PREDICTION ENGINE (Rule-based + Feature weights)
// =====================================================

/**
 * Predict disease risks using Ayurvedic principles + modern risk factors
 * Combines:
 * 1. Ayurvedic dosha-disease correlation (Charaka Samhita)
 * 2. Modern epidemiological risk factors
 * 3. Family history weighting
 * 4. Lifestyle factor analysis
 */
function predictDiseaseRisks(userData, doshaStatus, symptoms, lifestyle, sleepData, familyHistory, ayurvedicInputs) {
  const bmi = userData?.bmi || 22;
  const age = userData?.age || 30;
  const gender = userData?.gender || 'Male';
  const stressLevel = sleepData?.stress_level || 5;
  const sleepHours = sleepData?.sleep_duration_hours || 7;
  const activityMultiplier = lifestyle?.physical_activity === 'high' ? 0.7 : lifestyle?.physical_activity === 'moderate' ? 0.85 : 1.0;

  const clamp = (v) => Math.max(5, Math.min(95, Math.round(v)));

  // DIABETES (Prameha/Madhumeha) - Kapha dominant disease
  let diabetesRisk = 12;
  if (doshaStatus.dominant === 'Kapha') diabetesRisk += 15; // Kapha prakriti increases Prameha risk
  if (bmi > 27) diabetesRisk += (bmi - 27) * 5;
  if (familyHistory?.diabetes) diabetesRisk += 20;
  if (stressLevel > 7) diabetesRisk += 8;
  if (lifestyle?.junk_food_frequency > 5) diabetesRisk += 10;
  if (symptoms?.frequent_thirst && symptoms?.frequent_urination) diabetesRisk += 15;
  if (age > 40) diabetesRisk += 8;
  if ((ayurvedicInputs?.appetite || 5) > 7) diabetesRisk += 5;
  diabetesRisk *= activityMultiplier;

  // HYPERTENSION (Rakta Gata Vata) - Vata-Pitta disease
  let hypertensionRisk = 10;
  if (doshaStatus.pittaStatus === 'aggravated') hypertensionRisk += 12;
  if (doshaStatus.vataStatus === 'aggravated') hypertensionRisk += 8;
  if (bmi > 25) hypertensionRisk += (bmi - 25) * 3;
  if (stressLevel > 6) hypertensionRisk += stressLevel * 2;
  if (familyHistory?.hypertension) hypertensionRisk += 18;
  if (lifestyle?.smoking) hypertensionRisk += 12;
  if (lifestyle?.alcohol) hypertensionRisk += 8;
  if (age > 45) hypertensionRisk += 10;
  if (ayurvedicInputs?.stress_response === 'irritable') hypertensionRisk += 8;
  hypertensionRisk *= activityMultiplier;

  // HEART DISEASE (Hridroga) - All doshas
  let heartRisk = 8;
  if (bmi > 30) heartRisk += 18;
  else if (bmi > 25) heartRisk += 10;
  if (familyHistory?.heart_disease) heartRisk += 22;
  if (lifestyle?.smoking) heartRisk += 18;
  if (lifestyle?.alcohol) heartRisk += 8;
  if (stressLevel > 7) heartRisk += 10;
  if (age > 50) heartRisk += 12;
  if (gender === 'Male') heartRisk += 5;
  heartRisk *= activityMultiplier;

  // STRESS/ANXIETY (Chittodvega) - Vata dominant
  let stressRisk = 15;
  if (doshaStatus.dominant === 'Vata') stressRisk += 15;
  if (doshaStatus.vataStatus === 'aggravated') stressRisk += 10;
  stressRisk += stressLevel * 5;
  if (sleepHours < 6) stressRisk += 12;
  if ((sleepData?.anxiety_level || 3) > 6) stressRisk += 15;
  if (ayurvedicInputs?.stress_response === 'anxious') stressRisk += 10;

  // SLEEP DISORDER - Vata dominant
  let sleepRisk = 10;
  if (doshaStatus.vataStatus === 'aggravated') sleepRisk += 12;
  sleepRisk += (8 - sleepHours) * 6;
  if (stressLevel > 6) sleepRisk += stressLevel * 2;
  if ((sleepData?.daytime_sleepiness || 3) > 5) sleepRisk += 12;
  if (symptoms?.fatigue_level > 6) sleepRisk += 8;

  // OBESITY (Sthaulya) - Kapha dominant
  let obesityRisk = 8;
  if (doshaStatus.dominant === 'Kapha') obesityRisk += 15;
  if (bmi > 30) obesityRisk += 40;
  else if (bmi > 27) obesityRisk += 25;
  else if (bmi > 25) obesityRisk += 15;
  if (lifestyle?.physical_activity === 'low') obesityRisk += 15;
  if (lifestyle?.junk_food_frequency > 5) obesityRisk += 12;

  // DIGESTIVE DISORDER (Agni Mandya) - All doshas
  let digestiveRisk = 12;
  if (doshaStatus.dominant === 'Vata') digestiveRisk += 8; // Vishama agni
  if (symptoms?.digestive_issues) digestiveRisk += 20;
  if (stressLevel > 6) digestiveRisk += 10;
  if (lifestyle?.junk_food_frequency > 5) digestiveRisk += 12;
  if ((ayurvedicInputs?.digestion_strength || 5) < 4) digestiveRisk += 15;

  // RESPIRATORY/ASTHMA (Shwasa) - Kapha-Vata
  let asthmaRisk = 8;
  if (doshaStatus.kaphaStatus === 'aggravated') asthmaRisk += 10;
  if (familyHistory?.asthma) asthmaRisk += 25;
  if (lifestyle?.smoking) asthmaRisk += 20;
  if (symptoms?.breathing_difficulty) asthmaRisk += 20;

  // ARTHRITIS (Amavata) - Vata + Ama
  let arthritisRisk = 8;
  if (doshaStatus.vataStatus === 'aggravated') arthritisRisk += 12;
  if (familyHistory?.arthritis) arthritisRisk += 20;
  if (symptoms?.joint_pain) arthritisRisk += 20;
  if (bmi > 30) arthritisRisk += 10;
  if (age > 45) arthritisRisk += 8;

  // THYROID - Vata-Kapha
  let thyroidRisk = 8;
  if (doshaStatus.kaphaStatus === 'aggravated') thyroidRisk += 10;
  if (gender === 'Female') thyroidRisk += 8;
  if (stressLevel > 7) thyroidRisk += 8;
  if (symptoms?.fatigue_level > 6) thyroidRisk += 8;
  if (bmi > 28 || bmi < 18) thyroidRisk += 8;

  // FEVER/INFECTION (Jwara)
  let feverRisk = 8;
  if (stressLevel > 8) feverRisk += 8;
  if (sleepHours < 5) feverRisk += 10;
  if (lifestyle?.smoking) feverRisk += 5;

  const risks = {
    diabetes: clamp(diabetesRisk),
    hypertension: clamp(hypertensionRisk),
    heart_disease: clamp(heartRisk),
    stress: clamp(stressRisk),
    sleep_disorder: clamp(sleepRisk),
    obesity: clamp(obesityRisk),
    digestive_disorder: clamp(digestiveRisk),
    asthma: clamp(asthmaRisk),
    arthritis: clamp(arthritisRisk),
    thyroid: clamp(thyroidRisk),
    fever: clamp(feverRisk)
  };

  // Calculate overall health score
  const avgRisk = Object.values(risks).reduce((a, b) => a + b, 0) / Object.values(risks).length;
  const healthScore = clamp(100 - avgRisk);

  return { risks, healthScore };
}

module.exports = {
  determineAgniType,
  calculateAmaLevel,
  calculateOjasLevel,
  calculateDoshaStatus,
  getCurrentRitu,
  generateRitucharya,
  getDoshaClockRecommendation,
  predictDiseaseRisks
};
