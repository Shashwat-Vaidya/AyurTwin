/**
 * Dosha calculation utilities for Prakriti analysis
 */

/**
 * Dosha definitions with characteristics
 */
export const DOSHA_TYPES = {
  VATA: 'vata',
  PITTA: 'pitta',
  KAPHA: 'kapha',
};

/**
 * Dosha qualities for assessment
 */
export const DOSHA_QUALITIES = {
  [DOSHA_TYPES.VATA]: {
    physical: [
      'Thin body frame',
      'Dry skin and hair',
      'Cold hands and feet',
      'Irregular appetite',
      'Light sleeper',
    ],
    mental: [
      'Creative and imaginative',
      'Quick learner',
      'Anxious under stress',
      'Enthusiastic',
    ],
    preferences: [
      'Prefers warm environments',
      'Likes sweet, sour, salty tastes',
      'Enjoys routine',
    ],
  },
  [DOSHA_TYPES.PITTA]: {
    physical: [
      'Medium body frame',
      'Warm body temperature',
      'Soft, oily skin',
      'Strong appetite',
      'Sound sleeper',
    ],
    mental: [
      'Intelligent and focused',
      'Sharp mind',
      'Irritable under stress',
      'Goal-oriented',
    ],
    preferences: [
      'Prefers cool environments',
      'Likes sweet, bitter, astringent tastes',
      'Enjoys challenges',
    ],
  },
  [DOSHA_TYPES.KAPHA]: {
    physical: [
      'Large body frame',
      'Cool, moist skin',
      'Strong build',
      'Steady appetite',
      'Heavy sleeper',
    ],
    mental: [
      'Calm and patient',
      'Good memory',
      'Withdrawn under stress',
      'Nurturing',
    ],
    preferences: [
      'Prefers warm, dry environments',
      'Likes pungent, bitter, astringent tastes',
      'Enjoys stability',
    ],
  },
};

/**
 * Quiz questions for dosha assessment
 */
export const DOSHA_QUIZ = [
  {
    id: 1,
    question: 'How would you describe your body frame?',
    options: [
      { text: 'Thin, lean, tall', dosha: DOSHA_TYPES.VATA, weight: 3 },
      { text: 'Medium, athletic', dosha: DOSHA_TYPES.PITTA, weight: 3 },
      { text: 'Large, broad, solid', dosha: DOSHA_TYPES.KAPHA, weight: 3 },
    ],
  },
  {
    id: 2,
    question: 'How is your skin typically?',
    options: [
      { text: 'Dry, rough, cool', dosha: DOSHA_TYPES.VATA, weight: 3 },
      { text: 'Warm, sensitive, prone to rashes', dosha: DOSHA_TYPES.PITTA, weight: 3 },
      { text: 'Smooth, oily, cool', dosha: DOSHA_TYPES.KAPHA, weight: 3 },
    ],
  },
  {
    id: 3,
    question: 'How would you describe your appetite?',
    options: [
      { text: 'Variable, sometimes low', dosha: DOSHA_TYPES.VATA, weight: 3 },
      { text: 'Strong, can\'t miss meals', dosha: DOSHA_TYPES.PITTA, weight: 3 },
      { text: 'Steady, but slow', dosha: DOSHA_TYPES.KAPHA, weight: 3 },
    ],
  },
  {
    id: 4,
    question: 'How do you react to stress?',
    options: [
      { text: 'Anxious, worried', dosha: DOSHA_TYPES.VATA, weight: 3 },
      { text: 'Irritable, angry', dosha: DOSHA_TYPES.PITTA, weight: 3 },
      { text: 'Withdrawn, calm', dosha: DOSHA_TYPES.KAPHA, weight: 3 },
    ],
  },
  {
    id: 5,
    question: 'How is your memory?',
    options: [
      { text: 'Quick to learn, quick to forget', dosha: DOSHA_TYPES.VATA, weight: 3 },
      { text: 'Sharp, precise', dosha: DOSHA_TYPES.PITTA, weight: 3 },
      { text: 'Slow to learn, excellent retention', dosha: DOSHA_TYPES.KAPHA, weight: 3 },
    ],
  },
  {
    id: 6,
    question: 'How would you describe your sleep?',
    options: [
      { text: 'Light, easily disturbed', dosha: DOSHA_TYPES.VATA, weight: 3 },
      { text: 'Moderate, sound', dosha: DOSHA_TYPES.PITTA, weight: 3 },
      { text: 'Heavy, prolonged', dosha: DOSHA_TYPES.KAPHA, weight: 3 },
    ],
  },
  {
    id: 7,
    question: 'How is your digestion?',
    options: [
      { text: 'Irregular, gas, bloating', dosha: DOSHA_TYPES.VATA, weight: 3 },
      { text: 'Fast, burning sensation', dosha: DOSHA_TYPES.PITTA, weight: 3 },
      { text: 'Slow, steady', dosha: DOSHA_TYPES.KAPHA, weight: 3 },
    ],
  },
  {
    id: 8,
    question: 'What\'s your typical energy pattern?',
    options: [
      { text: 'Comes in bursts, variable', dosha: DOSHA_TYPES.VATA, weight: 3 },
      { text: 'Moderate, focused', dosha: DOSHA_TYPES.PITTA, weight: 3 },
      { text: 'Steady, enduring', dosha: DOSHA_TYPES.KAPHA, weight: 3 },
    ],
  },
  {
    id: 9,
    question: 'How do you handle cold weather?',
    options: [
      { text: 'Dislike, feel cold easily', dosha: DOSHA_TYPES.VATA, weight: 3 },
      { text: 'Prefer cool weather', dosha: DOSHA_TYPES.PITTA, weight: 3 },
      { text: 'Comfortable, don\'t mind cold', dosha: DOSHA_TYPES.KAPHA, weight: 3 },
    ],
  },
  {
    id: 10,
    question: 'What\'s your natural hair type?',
    options: [
      { text: 'Dry, thin, frizzy', dosha: DOSHA_TYPES.VATA, weight: 3 },
      { text: 'Fine, straight, early graying', dosha: DOSHA_TYPES.PITTA, weight: 3 },
      { text: 'Thick, oily, lustrous', dosha: DOSHA_TYPES.KAPHA, weight: 3 },
    ],
  },
];

/**
 * Calculate dosha from quiz answers
 * @param {Array} answers - Array of answer objects with dosha property
 * @returns {Object} Dosha percentages and dominant type
 */
export const calculateDoshaFromQuiz = (answers) => {
  let vata = 0;
  let pitta = 0;
  let kapha = 0;

  answers.forEach(answer => {
    const weight = answer.weight || 1;
    switch(answer.dosha) {
      case DOSHA_TYPES.VATA:
        vata += weight;
        break;
      case DOSHA_TYPES.PITTA:
        pitta += weight;
        break;
      case DOSHA_TYPES.KAPHA:
        kapha += weight;
        break;
    }
  });

  const total = vata + pitta + kapha;
  
  return {
    vata: total > 0 ? Math.round((vata / total) * 100) : 33,
    pitta: total > 0 ? Math.round((pitta / total) * 100) : 33,
    kapha: total > 0 ? Math.round((kapha / total) * 100) : 34,
    dominant: getDominantDosha(vata, pitta, kapha),
    raw: { vata, pitta, kapha },
  };
};

/**
 * Calculate dosha from user inputs (lifestyle, physical characteristics)
 * @param {Object} inputs - User input data
 * @returns {Object} Dosha percentages
 */
export const calculateDoshaFromInputs = (inputs) => {
  let vata = 0;
  let pitta = 0;
  let kapha = 0;

  // Body frame
  switch(inputs.bodyFrame) {
    case 'thin':
      vata += 3;
      break;
    case 'medium':
      pitta += 2;
      kapha += 1;
      break;
    case 'large':
      kapha += 3;
      break;
  }

  // Skin type
  switch(inputs.skinType) {
    case 'dry':
      vata += 3;
      break;
    case 'sensitive':
      pitta += 3;
      break;
    case 'oily':
      kapha += 3;
      break;
  }

  // Hair type
  switch(inputs.hairType) {
    case 'dry':
      vata += 2;
      break;
    case 'thin':
      pitta += 2;
      break;
    case 'thick':
      kapha += 2;
      break;
  }

  // Appetite
  switch(inputs.appetite) {
    case 'variable':
      vata += 2;
      break;
    case 'strong':
      pitta += 2;
      break;
    case 'steady':
      kapha += 2;
      break;
  }

  // Digestion
  switch(inputs.digestion) {
    case 'irregular':
      vata += 3;
      break;
    case 'fast':
      pitta += 3;
      break;
    case 'slow':
      kapha += 3;
      break;
  }

  // Temperature preference
  switch(inputs.temperaturePreference) {
    case 'warm':
      vata += 2;
      break;
    case 'cool':
      pitta += 2;
      break;
    case 'any':
      kapha += 1;
      break;
  }

  // Sleep pattern
  switch(inputs.sleepPattern) {
    case 'light':
      vata += 2;
      break;
    case 'moderate':
      pitta += 2;
      break;
    case 'heavy':
      kapha += 2;
      break;
  }

  // Stress response
  switch(inputs.stressResponse) {
    case 'anxious':
      vata += 3;
      break;
    case 'irritable':
      pitta += 3;
      break;
    case 'calm':
      kapha += 3;
      break;
  }

  const total = vata + pitta + kapha;
  
  return {
    vata: total > 0 ? Math.round((vata / total) * 100) : 33,
    pitta: total > 0 ? Math.round((pitta / total) * 100) : 33,
    kapha: total > 0 ? Math.round((kapha / total) * 100) : 34,
    dominant: getDominantDosha(vata, pitta, kapha),
  };
};

/**
 * Get dominant dosha
 * @param {number} vata - Vata score
 * @param {number} pitta - Pitta score
 * @param {number} kapha - Kapha score
 * @returns {string} Dominant dosha type
 */
export const getDominantDosha = (vata, pitta, kapha) => {
  const max = Math.max(vata, pitta, kapha);
  
  if (max === vata && vata > pitta + 10 && vata > kapha + 10) return DOSHA_TYPES.VATA;
  if (max === pitta && pitta > vata + 10 && pitta > kapha + 10) return DOSHA_TYPES.PITTA;
  if (max === kapha && kapha > vata + 10 && kapha > pitta + 10) return DOSHA_TYPES.KAPHA;
  
  // Mixed doshas
  if (vata > 40 && pitta > 40 && kapha < 20) return 'vata-pitta';
  if (pitta > 40 && kapha > 40 && vata < 20) return 'pitta-kapha';
  if (vata > 40 && kapha > 40 && pitta < 20) return 'vata-kapha';
  
  return 'tridosha';
};

/**
 * Get dosha description
 * @param {string} doshaType - Dosha type
 * @returns {Object} Dosha description
 */
export const getDoshaDescription = (doshaType) => {
  const descriptions = {
    [DOSHA_TYPES.VATA]: {
      name: 'Vata',
      elements: ['Air', 'Space'],
      qualities: ['Dry', 'Light', 'Cold', 'Rough', 'Mobile'],
      description: 'Vata types are creative, energetic, and quick-thinking. They tend to be thin, have dry skin, and prefer warm environments.',
      characteristics: ['Creative', 'Enthusiastic', 'Quick learner', 'Energetic'],
      challenges: ['Anxiety', 'Dry skin', 'Irregular digestion', 'Difficulty sleeping'],
      recommendations: 'Maintain regular routines, eat warm grounding foods, stay warm, and practice calming activities.',
    },
    [DOSHA_TYPES.PITTA]: {
      name: 'Pitta',
      elements: ['Fire', 'Water'],
      qualities: ['Hot', 'Sharp', 'Light', 'Oily', 'Intense'],
      description: 'Pitta types are intelligent, focused, and driven. They have medium builds, warm body temperature, and strong digestion.',
      characteristics: ['Intelligent', 'Ambitious', 'Good leaders', 'Sharp mind'],
      challenges: ['Irritability', 'Acidity', 'Inflammation', 'Perfectionism'],
      recommendations: 'Avoid spicy foods, stay cool, take breaks, and practice moderation.',
    },
    [DOSHA_TYPES.KAPHA]: {
      name: 'Kapha',
      elements: ['Water', 'Earth'],
      qualities: ['Heavy', 'Slow', 'Cool', 'Oily', 'Stable'],
      description: 'Kapha types are calm, loving, and stable. They tend to have solid builds, smooth skin, and steady energy.',
      characteristics: ['Calm', 'Loving', 'Patient', 'Strong'],
      challenges: ['Weight gain', 'Lethargy', 'Congestion', 'Attachment'],
      recommendations: 'Stay active, eat light foods, seek variety, and avoid heavy meals.',
    },
    'vata-pitta': {
      name: 'Vata-Pitta',
      description: 'You have a combination of Vata and Pitta, making you creative and driven, but potentially prone to anxiety and irritability.',
      characteristics: ['Creative', 'Ambitious', 'Quick', 'Intense'],
      challenges: ['Anxiety', 'Irritability', 'Burnout', 'Impatience'],
      recommendations: 'Balance activity with rest, avoid overexertion, and maintain regular routines.',
    },
    'pitta-kapha': {
      name: 'Pitta-Kapha',
      description: 'You have a combination of Pitta and Kapha, making you strong and determined, but potentially prone to stubbornness.',
      characteristics: ['Strong', 'Determined', 'Patient', 'Ambitious'],
      challenges: ['Stubbornness', 'Weight gain', 'Acidity', 'Resistance to change'],
      recommendations: 'Stay active, avoid heavy foods, and practice flexibility.',
    },
    'vata-kapha': {
      name: 'Vata-Kapha',
      description: 'You have a combination of Vata and Kapha, making you creative yet stable, but potentially prone to inconsistency.',
      characteristics: ['Creative', 'Stable', 'Adaptable', 'Calm'],
      challenges: ['Inconsistency', 'Weight fluctuations', 'Indecision', 'Lethargy'],
      recommendations: 'Maintain routines, stay warm, and balance activity with rest.',
    },
    tridosha: {
      name: 'Tri-Dosha',
      description: 'You have a balanced constitution with all three doshas equally present. This is rare and indicates great adaptability.',
      characteristics: ['Balanced', 'Adaptable', 'Versatile', 'Resilient'],
      challenges: ['May be prone to any imbalance depending on season'],
      recommendations: 'Pay attention to seasonal changes and adjust your routine accordingly.',
    },
  };

  return descriptions[doshaType] || descriptions[DOSHA_TYPES.VATA];
};

/**
 * Check for dosha imbalance
 * @param {Object} current - Current dosha percentages
 * @param {Object} baseline - Baseline dosha percentages
 * @param {number} threshold - Threshold for imbalance
 * @returns {Array} Imbalance information
 */
export const checkDoshaImbalance = (current, baseline, threshold = 15) => {
  const imbalances = [];

  if (Math.abs(current.vata - baseline.vata) > threshold) {
    imbalances.push({
      dosha: DOSHA_TYPES.VATA,
      change: current.vata - baseline.vata,
      severity: Math.abs(current.vata - baseline.vata) > 25 ? 'high' : 'medium',
      direction: current.vata > baseline.vata ? 'increased' : 'decreased',
    });
  }

  if (Math.abs(current.pitta - baseline.pitta) > threshold) {
    imbalances.push({
      dosha: DOSHA_TYPES.PITTA,
      change: current.pitta - baseline.pitta,
      severity: Math.abs(current.pitta - baseline.pitta) > 25 ? 'high' : 'medium',
      direction: current.pitta > baseline.pitta ? 'increased' : 'decreased',
    });
  }

  if (Math.abs(current.kapha - baseline.kapha) > threshold) {
    imbalances.push({
      dosha: DOSHA_TYPES.KAPHA,
      change: current.kapha - baseline.kapha,
      severity: Math.abs(current.kapha - baseline.kapha) > 25 ? 'high' : 'medium',
      direction: current.kapha > baseline.kapha ? 'increased' : 'decreased',
    });
  }

  return imbalances;
};

/**
 * Get balancing recommendations for imbalanced dosha
 * @param {string} dosha - Dosha type
 * @param {string} direction - 'increased' or 'decreased'
 * @returns {Object} Balancing recommendations
 */
export const getBalancingRecommendations = (dosha, direction = 'increased') => {
  const recommendations = {
    [DOSHA_TYPES.VATA]: {
      increased: {
        diet: ['Warm, cooked foods', 'Healthy fats', 'Sweet fruits', 'Warm spices'],
        avoid: ['Cold foods', 'Raw vegetables', 'Dry snacks', 'Carbonated drinks'],
        lifestyle: ['Regular routine', 'Stay warm', 'Gentle exercise', 'Oil massage'],
        herbs: ['Ashwagandha', 'Triphala', 'Ginger'],
      },
      decreased: {
        diet: ['Light, warming foods', 'Stimulating spices'],
        lifestyle: ['Gentle stimulation', 'Warm environment'],
      },
    },
    [DOSHA_TYPES.PITTA]: {
      increased: {
        diet: ['Cool foods', 'Sweet fruits', 'Leafy greens', 'Coconut'],
        avoid: ['Spicy foods', 'Fermented foods', 'Caffeine', 'Alcohol'],
        lifestyle: ['Stay cool', 'Moderate exercise', 'Cooling activities', 'Moon walks'],
        herbs: ['Shatavari', 'Brahmi', 'Coriander'],
      },
      decreased: {
        diet: ['Warming foods', 'Moderate spices'],
        lifestyle: ['Gentle warming activities'],
      },
    },
    [DOSHA_TYPES.KAPHA]: {
      increased: {
        diet: ['Light, warm foods', 'Steamed vegetables', 'Legumes', 'Honey'],
        avoid: ['Heavy foods', 'Dairy', 'Fried foods', 'Sweets'],
        lifestyle: ['Vigorous exercise', 'Early rising', 'Variety', 'Dry brushing'],
        herbs: ['Tulsi', 'Ginger', 'Turmeric'],
      },
      decreased: {
        diet: ['Nourishing foods', 'Healthy fats'],
        lifestyle: ['Restorative activities', 'Warm environment'],
      },
    },
  };

  return recommendations[dosha]?.[direction] || recommendations[DOSHA_TYPES.VATA].increased;
};

export default {
  DOSHA_TYPES,
  DOSHA_QUALITIES,
  DOSHA_QUIZ,
  calculateDoshaFromQuiz,
  calculateDoshaFromInputs,
  getDominantDosha,
  getDoshaDescription,
  checkDoshaImbalance,
  getBalancingRecommendations,
};