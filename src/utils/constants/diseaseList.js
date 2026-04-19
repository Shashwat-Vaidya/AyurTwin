/**
 * Disease-related constants and data
 */

/**
 * List of diseases tracked by the app
 */
export const DISEASE_LIST = [
  {
    id: 'diabetes',
    name: 'Diabetes',
    category: 'metabolic',
    description: 'A group of diseases that result in too much sugar in the blood',
    symptoms: [
      'Frequent urination',
      'Increased thirst',
      'Unexplained weight loss',
      'Fatigue',
      'Blurred vision',
    ],
    riskFactors: [
      'Family history',
      'Obesity',
      'Sedentary lifestyle',
      'Age > 45',
      'Poor diet',
    ],
    prevention: [
      'Maintain healthy weight',
      'Regular exercise',
      'Balanced diet',
      'Regular screening',
    ],
    icon: 'water',
    color: '#FF6B6B',
  },
  {
    id: 'hypertension',
    name: 'Hypertension',
    category: 'cardiovascular',
    description: 'High blood pressure, a common condition that can lead to serious health problems',
    symptoms: [
      'Often no symptoms',
      'Headaches',
      'Shortness of breath',
      'Nosebleeds',
    ],
    riskFactors: [
      'Age > 60',
      'Family history',
      'Obesity',
      'High sodium diet',
      'Stress',
    ],
    prevention: [
      'Reduce salt intake',
      'Regular exercise',
      'Limit alcohol',
      'Stress management',
    ],
    icon: 'speedometer',
    color: '#FF8C42',
  },
  {
    id: 'stress_anxiety',
    name: 'Stress/Anxiety',
    category: 'mental',
    description: 'Mental health conditions affecting daily life and well-being',
    symptoms: [
      'Restlessness',
      'Rapid heartbeat',
      'Difficulty concentrating',
      'Sleep problems',
      'Irritability',
    ],
    riskFactors: [
      'Work pressure',
      'Life changes',
      'Trauma',
      'Family history',
      'Chronic illness',
    ],
    prevention: [
      'Regular exercise',
      'Meditation',
      'Adequate sleep',
      'Professional help',
    ],
    icon: 'flash',
    color: '#9B6B9E',
  },
  {
    id: 'sleep_disorder',
    name: 'Sleep Disorder',
    category: 'neurological',
    description: 'Conditions that affect sleep quality, timing, and duration',
    symptoms: [
      'Difficulty falling asleep',
      'Daytime fatigue',
      'Irregular breathing',
      'Unrefreshing sleep',
    ],
    riskFactors: [
      'Stress',
      'Irregular schedule',
      'Screen time',
      'Medical conditions',
      'Medications',
    ],
    prevention: [
      'Consistent sleep schedule',
      'Relaxing bedtime routine',
      'Limit caffeine',
      'Comfortable sleep environment',
    ],
    icon: 'moon',
    color: '#5E4B8C',
  },
  {
    id: 'asthma',
    name: 'Asthma',
    category: 'respiratory',
    description: 'A condition in which airways narrow and swell, producing extra mucus',
    symptoms: [
      'Shortness of breath',
      'Chest tightness',
      'Wheezing',
      'Coughing',
    ],
    riskFactors: [
      'Family history',
      'Allergies',
      'Respiratory infections',
      'Environmental factors',
    ],
    prevention: [
      'Avoid triggers',
      'Regular medication',
      'Monitor breathing',
      'Allergy management',
    ],
    icon: 'medkit',
    color: '#4A90E2',
  },
  {
    id: 'arthritis',
    name: 'Arthritis',
    category: 'musculoskeletal',
    description: 'Inflammation of one or more joints, causing pain and stiffness',
    symptoms: [
      'Joint pain',
      'Stiffness',
      'Swelling',
      'Decreased range of motion',
    ],
    riskFactors: [
      'Age',
      'Family history',
      'Joint injuries',
      'Obesity',
      'Autoimmune conditions',
    ],
    prevention: [
      'Maintain healthy weight',
      'Low-impact exercise',
      'Joint protection',
      'Anti-inflammatory diet',
    ],
    icon: 'bone',
    color: '#4CAF50',
  },
  {
    id: 'obesity',
    name: 'Obesity',
    category: 'metabolic',
    description: 'Abnormal or excessive fat accumulation that presents health risks',
    symptoms: [
      'Excess body fat',
      'Shortness of breath',
      'Snoring',
      'Fatigue',
      'Joint pain',
    ],
    riskFactors: [
      'Poor diet',
      'Sedentary lifestyle',
      'Genetics',
      'Medical conditions',
      'Medications',
    ],
    prevention: [
      'Balanced diet',
      'Regular exercise',
      'Portion control',
      'Lifestyle modification',
    ],
    icon: 'body',
    color: '#FFB347',
  },
  {
    id: 'digestive_disorder',
    name: 'Digestive Disorder',
    category: 'gastrointestinal',
    description: 'Conditions affecting the digestive system',
    symptoms: [
      'Bloating',
      'Abdominal pain',
      'Heartburn',
      'Nausea',
      'Irregular bowel movements',
    ],
    riskFactors: [
      'Poor diet',
      'Stress',
      'Food intolerances',
      'Medications',
      'Infections',
    ],
    prevention: [
      'Healthy diet',
      'Regular meals',
      'Hydration',
      'Stress management',
      'Avoid trigger foods',
    ],
    icon: 'restaurant',
    color: '#FF9933',
  },
  {
    id: 'heart_disease',
    name: 'Heart Disease',
    category: 'cardiovascular',
    description: 'Conditions affecting the heart, including blood vessel diseases',
    symptoms: [
      'Chest pain',
      'Shortness of breath',
      'Palpitations',
      'Dizziness',
      'Fatigue',
    ],
    riskFactors: [
      'High blood pressure',
      'High cholesterol',
      'Smoking',
      'Diabetes',
      'Family history',
    ],
    prevention: [
      'Heart-healthy diet',
      'Regular exercise',
      'No smoking',
      'Limit alcohol',
      'Stress management',
    ],
    icon: 'heart',
    color: '#FF4D6D',
  },
  {
    id: 'fever_infection',
    name: 'Fever/Infection',
    category: 'infectious',
    description: 'Elevated body temperature due to infection or illness',
    symptoms: [
      'High temperature',
      'Chills',
      'Body aches',
      'Fatigue',
      'Sweating',
    ],
    riskFactors: [
      'Weak immune system',
      'Exposure to pathogens',
      'Poor hygiene',
      'Seasonal factors',
    ],
    prevention: [
      'Good hygiene',
      'Vaccination',
      'Avoid sick contacts',
      'Healthy lifestyle',
      'Adequate rest',
    ],
    icon: 'thermometer',
    color: '#FF8C42',
  },
];

/**
 * Disease categories
 */
export const DISEASE_CATEGORIES = [
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    icon: 'heart',
    color: '#FF4D6D',
    diseases: ['hypertension', 'heart_disease'],
  },
  {
    id: 'metabolic',
    name: 'Metabolic',
    icon: 'fitness',
    color: '#FF6B6B',
    diseases: ['diabetes', 'obesity'],
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: 'medkit',
    color: '#4A90E2',
    diseases: ['asthma'],
  },
  {
    id: 'mental',
    name: 'Mental Health',
    icon: 'flash',
    color: '#9B6B9E',
    diseases: ['stress_anxiety'],
  },
  {
    id: 'neurological',
    name: 'Neurological',
    icon: 'brain',
    color: '#5E4B8C',
    diseases: ['sleep_disorder'],
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal',
    icon: 'bone',
    color: '#4CAF50',
    diseases: ['arthritis'],
  },
  {
    id: 'gastrointestinal',
    name: 'Gastrointestinal',
    icon: 'restaurant',
    color: '#FF9933',
    diseases: ['digestive_disorder'],
  },
  {
    id: 'infectious',
    name: 'Infectious',
    icon: 'thermometer',
    color: '#FF8C42',
    diseases: ['fever_infection'],
  },
];

/**
 * Risk levels with colors and descriptions
 */
export const RISK_LEVELS = {
  veryLow: {
    label: 'Very Low',
    color: '#4CAF50',
    range: [0, 20],
    description: 'Minimal risk. Maintain healthy habits.',
  },
  low: {
    label: 'Low',
    color: '#4A90E2',
    range: [21, 40],
    description: 'Low risk. Continue monitoring.',
  },
  medium: {
    label: 'Medium',
    color: '#FFB347',
    range: [41, 60],
    description: 'Moderate risk. Consider lifestyle changes.',
  },
  high: {
    label: 'High',
    color: '#FF8C42',
    range: [61, 80],
    description: 'High risk. Consult healthcare provider.',
  },
  veryHigh: {
    label: 'Very High',
    color: '#FF5A5F',
    range: [81, 100],
    description: 'Critical risk. Seek medical attention.',
  },
};

/**
 * Get risk level based on percentage
 * @param {number} percentage - Risk percentage
 * @returns {Object} Risk level object
 */
export const getRiskLevel = (percentage) => {
  if (percentage <= 20) return RISK_LEVELS.veryLow;
  if (percentage <= 40) return RISK_LEVELS.low;
  if (percentage <= 60) return RISK_LEVELS.medium;
  if (percentage <= 80) return RISK_LEVELS.high;
  return RISK_LEVELS.veryHigh;
};

/**
 * Get disease by ID
 * @param {string} id - Disease ID
 * @returns {Object} Disease object
 */
export const getDiseaseById = (id) => {
  return DISEASE_LIST.find(disease => disease.id === id);
};

/**
 * Get diseases by category
 * @param {string} categoryId - Category ID
 * @returns {Array} Array of diseases
 */
export const getDiseasesByCategory = (categoryId) => {
  return DISEASE_LIST.filter(disease => disease.category === categoryId);
};

/**
 * Common disease symptoms for quick reference
 */
export const COMMON_SYMPTOMS = [
  'Fever',
  'Cough',
  'Fatigue',
  'Headache',
  'Nausea',
  'Dizziness',
  'Chest pain',
  'Shortness of breath',
  'Joint pain',
  'Muscle ache',
  'Loss of appetite',
  'Weight loss',
  'Weight gain',
  'Insomnia',
  'Anxiety',
  'Depression',
  'Palpitations',
  'Sweating',
  'Chills',
  'Rash',
];

/**
 * Disease prevention tips by category
 */
export const PREVENTION_TIPS = {
  cardiovascular: [
    'Maintain healthy blood pressure',
    'Control cholesterol levels',
    'Eat heart-healthy diet',
    'Exercise regularly',
    'Avoid smoking',
    'Limit alcohol',
  ],
  metabolic: [
    'Maintain healthy weight',
    'Monitor blood sugar',
    'Eat balanced meals',
    'Stay physically active',
    'Limit processed foods',
  ],
  respiratory: [
    'Avoid smoking',
    'Reduce allergen exposure',
    'Practice breathing exercises',
    'Get vaccinated',
    'Maintain good air quality',
  ],
  mental: [
    'Practice stress management',
    'Get adequate sleep',
    'Stay socially connected',
    'Seek professional help',
    'Exercise regularly',
  ],
  neurological: [
    'Maintain consistent sleep schedule',
    'Create relaxing bedtime routine',
    'Limit screen time before bed',
    'Avoid caffeine late in day',
    'Create comfortable sleep environment',
  ],
  musculoskeletal: [
    'Maintain healthy weight',
    'Exercise regularly',
    'Practice good posture',
    'Use proper body mechanics',
    'Stretch regularly',
  ],
  gastrointestinal: [
    'Eat regular meals',
    'Stay hydrated',
    'Limit trigger foods',
    'Manage stress',
    'Chew food thoroughly',
  ],
  infectious: [
    'Practice good hygiene',
    'Get vaccinated',
    'Avoid sick contacts',
    'Boost immune system',
    'Stay home when sick',
  ],
};

export default {
  DISEASE_LIST,
  DISEASE_CATEGORIES,
  RISK_LEVELS,
  COMMON_SYMPTOMS,
  PREVENTION_TIPS,
  getRiskLevel,
  getDiseaseById,
  getDiseasesByCategory,
};