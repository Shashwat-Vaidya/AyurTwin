/**
 * Ayurveda-related constants and data
 */

/**
 * Dosha definitions
 */
export const DOSHAS = {
  vata: {
    id: 'vata',
    name: 'Vata',
    elements: ['Air', 'Space'],
    qualities: ['Dry', 'Light', 'Cold', 'Rough', 'Subtle', 'Mobile'],
    color: '#7B6E8F',
    secondaryColor: '#9B8BA9',
    emoji: '🌬️',
    icon: 'wind',
    season: ['Autumn', 'Early Winter'],
    timeOfDay: ['2 AM - 6 AM', '2 PM - 6 PM'],
    description: 'Vata governs all movement in the body and mind. It controls blood flow, elimination, breathing, and the movement of thoughts across the mind.',
    physicalCharacteristics: [
      'Thin, light frame',
      'Dry skin and hair',
      'Cold hands and feet',
      'Variable appetite',
      'Light, interrupted sleep',
    ],
    mentalCharacteristics: [
      'Creative and enthusiastic',
      'Quick to learn but quick to forget',
      'Anxious under stress',
      'Flexible and adaptable',
    ],
    imbalanceSymptoms: [
      'Anxiety',
      'Constipation',
      'Dry skin',
      'Insomnia',
      'Joint pain',
      'Irregular digestion',
    ],
    balancingTips: [
      'Maintain regular routine',
      'Eat warm, grounding foods',
      'Stay warm',
      'Practice gentle yoga',
      'Get adequate rest',
      'Use warm oil massage',
    ],
  },
  pitta: {
    id: 'pitta',
    name: 'Pitta',
    elements: ['Fire', 'Water'],
    qualities: ['Hot', 'Sharp', 'Light', 'Oily', 'Liquid', 'Mobile'],
    color: '#FF6B6B',
    secondaryColor: '#FF8A8A',
    emoji: '🔥',
    icon: 'flame',
    season: ['Summer'],
    timeOfDay: ['10 AM - 2 PM', '10 PM - 2 AM'],
    description: 'Pitta governs digestion, metabolism, and energy production. It controls how we digest food and ideas, and our ability to perceive things clearly.',
    physicalCharacteristics: [
      'Medium build',
      'Warm body temperature',
      'Soft, oily skin',
      'Strong appetite',
      'Sound, restorative sleep',
    ],
    mentalCharacteristics: [
      'Intelligent and focused',
      'Sharp intellect',
      'Irritable under stress',
      'Goal-oriented',
    ],
    imbalanceSymptoms: [
      'Acid reflux',
      'Skin rashes',
      'Irritability',
      'Inflammation',
      'Excessive heat',
      'Perfectionism',
    ],
    balancingTips: [
      'Avoid excessive heat',
      'Eat cooling foods',
      'Take breaks',
      'Practice moderation',
      'Avoid spicy foods',
      'Spend time in nature',
    ],
  },
  kapha: {
    id: 'kapha',
    name: 'Kapha',
    elements: ['Water', 'Earth'],
    qualities: ['Heavy', 'Slow', 'Cool', 'Oily', 'Smooth', 'Stable'],
    color: '#6BA6A6',
    secondaryColor: '#8BB8B8',
    emoji: '🌊',
    icon: 'water',
    season: ['Spring'],
    timeOfDay: ['6 AM - 10 AM', '6 PM - 10 PM'],
    description: 'Kapha provides structure and lubrication. It maintains immunity, protects tissues, and keeps the joints lubricated.',
    physicalCharacteristics: [
      'Strong, solid build',
      'Smooth, oily skin',
      'Cool body temperature',
      'Steady appetite',
      'Deep, prolonged sleep',
    ],
    mentalCharacteristics: [
      'Calm and grounded',
      'Slow to learn but excellent retention',
      'Compassionate',
      'Patient and stable',
    ],
    imbalanceSymptoms: [
      'Weight gain',
      'Congestion',
      'Lethargy',
      'Depression',
      'Water retention',
      'Attachment',
    ],
    balancingTips: [
      'Stay active',
      'Eat light, warm foods',
      'Seek variety',
      'Wake up early',
      'Avoid heavy foods',
      'Practice invigorating exercise',
    ],
  },
};

/**
 * Prakriti types (constitution)
 */
export const PRAKRITI_TYPES = {
  vata: {
    ...DOSHAS.vata,
    description: 'Vata Prakriti - Creative, energetic, variable constitution',
  },
  pitta: {
    ...DOSHAS.pitta,
    description: 'Pitta Prakriti - Intense, focused, warm constitution',
  },
  kapha: {
    ...DOSHAS.kapha,
    description: 'Kapha Prakriti - Calm, stable, nurturing constitution',
  },
  vataPitta: {
    id: 'vata-pitta',
    name: 'Vata-Pitta',
    primaryDoshas: ['vata', 'pitta'],
    color: '#B19CD9',
    emoji: '🌬️🔥',
    description: 'Mix of Vata and Pitta - Creative and intense, with both mobility and transformation.',
    balancingTips: [
      'Balance activity with rest',
      'Avoid extremes',
      'Stay warm but not hot',
      'Regular routine with flexibility',
    ],
  },
  pittaKapha: {
    id: 'pitta-kapha',
    name: 'Pitta-Kapha',
    primaryDoshas: ['pitta', 'kapha'],
    color: '#D4A5A5',
    emoji: '🔥🌊',
    description: 'Mix of Pitta and Kapha - Strong and steady with intense focus when needed.',
    balancingTips: [
      'Stay active but not overheated',
      'Light, warm foods',
      'Moderate exercise',
      'Avoid heavy, oily foods',
    ],
  },
  vataKapha: {
    id: 'vata-kapha',
    name: 'Vata-Kapha',
    primaryDoshas: ['vata', 'kapha'],
    color: '#9CAFB7',
    emoji: '🌬️🌊',
    description: 'Mix of Vata and Kapha - Creative yet stable, with periods of high energy and calm.',
    balancingTips: [
      'Maintain routine with variety',
      'Warm, light foods',
      'Gentle, regular exercise',
      'Stay warm and dry',
    ],
  },
  tridosha: {
    id: 'tridosha',
    name: 'Tri-Dosha',
    primaryDoshas: ['vata', 'pitta', 'kapha'],
    color: '#B5B35C',
    emoji: '🌿',
    description: 'All three doshas in balance - Most balanced constitution, adaptable to all situations.',
    balancingTips: [
      'Maintain balance through seasons',
      'Listen to your body',
      'Adjust routine as needed',
      'Practice all six tastes',
    ],
  },
};

/**
 * Six tastes (Rasas)
 */
export const SIX_TASTES = {
  sweet: {
    id: 'sweet',
    sanskrit: 'Madhura',
    elements: ['Earth', 'Water'],
    qualities: ['Heavy', 'Cold', 'Oily'],
    effects: {
      vata: 'Decreases',
      pitta: 'Decreases',
      kapha: 'Increases',
    },
    sources: ['Grains', 'Dairy', 'Sweet fruits', 'Honey', 'Sugar'],
    benefits: ['Builds tissues', 'Calming', 'Strengthening'],
    icon: '🍯',
  },
  sour: {
    id: 'sour',
    sanskrit: 'Amla',
    elements: ['Earth', 'Fire'],
    qualities: ['Light', 'Hot', 'Oily'],
    effects: {
      vata: 'Decreases',
      pitta: 'Increases',
      kapha: 'Decreases',
    },
    sources: ['Citrus', 'Yogurt', 'Fermented foods', 'Vinegar'],
    benefits: ['Stimulates digestion', 'Refreshing'],
    icon: '🍋',
  },
  salty: {
    id: 'salty',
    sanskrit: 'Lavana',
    elements: ['Water', 'Fire'],
    qualities: ['Heavy', 'Hot', 'Oily'],
    effects: {
      vata: 'Decreases',
      pitta: 'Increases',
      kapha: 'Increases',
    },
    sources: ['Salt', 'Seaweed', 'Salty foods'],
    benefits: ['Improves taste', 'Aids digestion', 'Electrolyte balance'],
    icon: '🧂',
  },
  pungent: {
    id: 'pungent',
    sanskrit: 'Katu',
    elements: ['Fire', 'Air'],
    qualities: ['Light', 'Hot', 'Dry'],
    effects: {
      vata: 'Increases',
      pitta: 'Increases',
      kapha: 'Decreases',
    },
    sources: ['Chili', 'Ginger', 'Pepper', 'Garlic', 'Spices'],
    benefits: ['Stimulates digestion', 'Clears sinuses'],
    icon: '🌶️',
  },
  bitter: {
    id: 'bitter',
    sanskrit: 'Tikta',
    elements: ['Air', 'Ether'],
    qualities: ['Light', 'Cold', 'Dry'],
    effects: {
      vata: 'Increases',
      pitta: 'Decreases',
      kapha: 'Decreases',
    },
    sources: ['Bitter greens', 'Turmeric', 'Coffee', 'Neem'],
    benefits: ['Detoxifying', 'Anti-inflammatory'],
    icon: '🥬',
  },
  astringent: {
    id: 'astringent',
    sanskrit: 'Kashaya',
    elements: ['Air', 'Earth'],
    qualities: ['Heavy', 'Cold', 'Dry'],
    effects: {
      vata: 'Increases',
      pitta: 'Decreases',
      kapha: 'Decreases',
    },
    sources: ['Legumes', 'Raw banana', 'Pomegranate', 'Tea'],
    benefits: ['Healing', 'Absorbs water'],
    icon: '🫘',
  },
};

/**
 * Seasonal cycles (Ritucharya)
 */
export const SEASONS = {
  spring: {
    id: 'spring',
    sanskrit: 'Vasant',
    months: 'March - May',
    dominantDosha: 'kapha',
    qualities: ['Cool', 'Moist', 'Heavy'],
    recommendations: [
      'Light, dry foods',
      'Vigorous exercise',
      'Detoxification',
      'Avoid heavy, oily foods',
      'Early waking',
    ],
    foods: ['Barley', 'Millet', 'Honey', 'Bitter greens'],
    herbs: ['Turmeric', 'Ginger', 'Neem'],
    color: '#4CAF50',
    icon: 'flower',
  },
  summer: {
    id: 'summer',
    sanskrit: 'Grishma',
    months: 'June - August',
    dominantDosha: 'pitta',
    qualities: ['Hot', 'Sharp', 'Intense'],
    recommendations: [
      'Cooling foods',
      'Avoid midday sun',
      'Stay hydrated',
      'Sweet fruits',
      'Cooling herbs',
    ],
    foods: ['Cucumber', 'Melons', 'Coconut', 'Mint'],
    herbs: ['Coriander', 'Fennel', 'Shatavari'],
    color: '#FF8C42',
    icon: 'sunny',
  },
  monsoon: {
    id: 'monsoon',
    sanskrit: 'Varsha',
    months: 'September - October',
    dominantDosha: 'vata',
    qualities: ['Cool', 'Damp', 'Variable'],
    recommendations: [
      'Warm, cooked foods',
      'Avoid raw vegetables',
      'Ginger tea',
      'Stay dry',
      'Boost immunity',
    ],
    foods: ['Rice', 'Mung dal', 'Soups', 'Ginger'],
    herbs: ['Ginger', 'Tulsi', 'Cinnamon'],
    color: '#4A90E2',
    icon: 'rainy',
  },
  autumn: {
    id: 'autumn',
    sanskrit: 'Sharad',
    months: 'November - December',
    dominantDosha: 'pitta',
    qualities: ['Cool', 'Dry', 'Clear'],
    recommendations: [
      'Sweet, bitter tastes',
      'Avoid fermented foods',
      'Cooling practices',
      'Moonlight walks',
    ],
    foods: ['Rice', 'Pumpkin', 'Ghee', 'Sweet potatoes'],
    herbs: ['Shatavari', 'Licorice', 'Brahmi'],
    color: '#FFB347',
    icon: 'leaf',
  },
  earlyWinter: {
    id: 'earlyWinter',
    sanskrit: 'Hemant',
    months: 'January - February',
    dominantDosha: 'vata',
    qualities: ['Cold', 'Dry', 'Light'],
    recommendations: [
      'Warm, nourishing foods',
      'Oil massage',
      'Stay warm',
      'Regular routine',
    ],
    foods: ['Root vegetables', 'Nuts', 'Warm milk', 'Sesame'],
    herbs: ['Ashwagandha', 'Ginger', 'Cinnamon'],
    color: '#9B6B9E',
    icon: 'snow',
  },
  lateWinter: {
    id: 'lateWinter',
    sanskrit: 'Shishir',
    months: 'February - March',
    dominantDosha: 'kapha',
    qualities: ['Cold', 'Heavy', 'Stable'],
    recommendations: [
      'Light, warm foods',
      'Stay active',
      'Dry brushing',
      'Early waking',
    ],
    foods: ['Barley', 'Corn', 'Steamed vegetables'],
    herbs: ['Ginger', 'Turmeric', 'Pippali'],
    color: '#FF6B6B',
    icon: 'snow',
  },
};

/**
 * Ayurvedic herbs
 */
export const AYURVEDIC_HERBS = {
  ashwagandha: {
    name: 'Ashwagandha',
    sanskrit: 'Ashwagandha',
    scientific: 'Withania somnifera',
    doshaEffect: { vata: 'decreases', pitta: 'decreases', kapha: 'decreases' },
    benefits: ['Stress relief', 'Energy', 'Immunity', 'Sleep'],
    usage: 'With warm milk at bedtime',
    caution: 'Avoid with hyperthyroidism',
  },
  triphala: {
    name: 'Triphala',
    sanskrit: 'Triphala',
    scientific: 'Terminalia chebula, Terminalia bellirica, Emblica officinalis',
    doshaEffect: { vata: 'decreases', pitta: 'decreases', kapha: 'decreases' },
    benefits: ['Digestion', 'Detox', 'Regularity', 'Antioxidant'],
    usage: 'At bedtime with warm water',
    caution: 'May cause loose stools initially',
  },
  brahmi: {
    name: 'Brahmi',
    sanskrit: 'Brahmi',
    scientific: 'Bacopa monnieri',
    doshaEffect: { vata: 'decreases', pitta: 'decreases', kapha: 'decreases' },
    benefits: ['Memory', 'Mental clarity', 'Calmness', 'Nervine'],
    usage: 'As supplement or tea',
    caution: 'Avoid with slow heart rate',
  },
  tulsi: {
    name: 'Tulsi',
    sanskrit: 'Tulsi',
    scientific: 'Ocimum sanctum',
    doshaEffect: { vata: 'decreases', pitta: 'decreases', kapha: 'decreases' },
    benefits: ['Immunity', 'Respiratory health', 'Stress', 'Fever'],
    usage: 'As tea daily',
    caution: 'May thin blood',
  },
  turmeric: {
    name: 'Turmeric',
    sanskrit: 'Haridra',
    scientific: 'Curcuma longa',
    doshaEffect: { vata: 'decreases', pitta: 'decreases', kapha: 'decreases' },
    benefits: ['Anti-inflammatory', 'Antioxidant', 'Wound healing', 'Immunity'],
    usage: 'With meals, with black pepper',
    caution: 'Avoid with blood thinners',
  },
  ginger: {
    name: 'Ginger',
    sanskrit: 'Shunti',
    scientific: 'Zingiber officinale',
    doshaEffect: { vata: 'decreases', pitta: 'increases', kapha: 'decreases' },
    benefits: ['Digestion', 'Nausea', 'Circulation', 'Cold'],
    usage: 'As tea or with meals',
    caution: 'Avoid in high pitta conditions',
  },
  neem: {
    name: 'Neem',
    sanskrit: 'Nimba',
    scientific: 'Azadirachta indica',
    doshaEffect: { vata: 'increases', pitta: 'decreases', kapha: 'decreases' },
    benefits: ['Skin health', 'Detox', 'Immune support', 'Blood purifier'],
    usage: 'In capsules or tea',
    caution: 'Avoid during pregnancy',
  },
};

/**
 * Daily routine (Dinacharya) practices
 */
export const DINACHARYA = {
  waking: {
    time: '4:30 - 6:00 AM',
    practices: ['Wake before sunrise', 'Drink warm water', 'Elimination'],
  },
  cleansing: {
    time: 'Upon waking',
    practices: ['Tongue scraping', 'Oil pulling', 'Nasya (nasal oil)'],
  },
  bathing: {
    time: 'After cleansing',
    practices: ['Abhyanga (self-massage)', 'Warm bath', 'Dry brushing'],
  },
  exercise: {
    time: 'Morning',
    practices: ['Yoga', 'Pranayama', 'Walking', 'Exercise appropriate for dosha'],
  },
  meditation: {
    time: 'After exercise',
    practices: ['Meditation', 'Prayer', 'Gratitude practice'],
  },
  meals: {
    breakfast: 'Light meal, 7-8 AM',
    lunch: 'Largest meal, 12-1 PM',
    dinner: 'Light meal, before sunset',
  },
  work: {
    morning: 'Most productive hours',
    afternoon: 'Take short breaks',
    evening: 'Wind down activities',
  },
  evening: {
    practices: ['Evening walk', 'Digital detox', 'Prepare for sleep'],
  },
  sleep: {
    bedtime: '10:00 PM',
    practices: ['Oil on feet', 'Warm milk with spices', 'Calming routine'],
  },
};

/**
 * Get dosha by ID
 * @param {string} doshaId - Dosha ID
 * @returns {Object} Dosha object
 */
export const getDoshaById = (doshaId) => {
  return DOSHAS[doshaId] || PRAKRITI_TYPES[doshaId] || null;
};

/**
 * Get taste by ID
 * @param {string} tasteId - Taste ID
 * @returns {Object} Taste object
 */
export const getTasteById = (tasteId) => {
  return SIX_TASTES[tasteId] || null;
};

/**
 * Get season by ID
 * @param {string} seasonId - Season ID
 * @returns {Object} Season object
 */
export const getSeasonById = (seasonId) => {
  return SEASONS[seasonId] || null;
};

/**
 * Get current season based on month
 * @returns {Object} Current season
 */
export const getCurrentSeason = () => {
  const month = new Date().getMonth();
  
  if (month >= 2 && month <= 4) return SEASONS.spring;
  if (month >= 5 && month <= 7) return SEASONS.summer;
  if (month >= 8 && month <= 9) return SEASONS.monsoon;
  if (month >= 10 && month <= 11) return SEASONS.autumn;
  if (month === 0 || month === 1) return SEASONS.earlyWinter;
  return SEASONS.spring;
};

export default {
  DOSHAS,
  PRAKRITI_TYPES,
  SIX_TASTES,
  SEASONS,
  AYURVEDIC_HERBS,
  DINACHARYA,
  getDoshaById,
  getTasteById,
  getSeasonById,
  getCurrentSeason,
};