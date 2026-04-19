/**
 * Application Constants
 */

// Disease IDs mapping
const DISEASES = {
  DIABETES: { id: 1, name: 'Diabetes', ayurvedic: 'Prameha' },
  HYPERTENSION: { id: 2, name: 'Hypertension', ayurvedic: 'Rakta Vata' },
  HEART_DISEASE: { id: 3, name: 'Heart Disease', ayurvedic: 'Hridaya Roga' },
  STRESS: { id: 4, name: 'Stress & Anxiety', ayurvedic: 'Chittodvega' },
  SLEEP_DISORDER: { id: 5, name: 'Sleep Disorder', ayurvedic: 'Anidra' },
  ASTHMA: { id: 6, name: 'Asthma', ayurvedic: 'Shwasa' },
  ARTHRITIS: { id: 7, name: 'Arthritis', ayurvedic: 'Amavata' },
  OBESITY: { id: 8, name: 'Obesity', ayurvedic: 'Sthaulya' },
  DIGESTIVE: { id: 9, name: 'Digestive Disorder', ayurvedic: 'Agnimandya' },
  FEVER: { id: 10, name: 'Fever/Infection', ayurvedic: 'Jwara' },
  THYROID: { id: 11, name: 'Thyroid', ayurvedic: 'Galaganda' },
};

// Dosha types
const DOSHAS = {
  VATA: 'Vata',
  PITTA: 'Pitta',
  KAPHA: 'Kapha',
};

// Ayurvedic seasons (Ritu)
const RITUS = [
  { ritu: 'Shishira', english: 'Late Winter', months: [1, 2], dominant: 'Kapha accumulates', taste: 'Pungent, Bitter, Astringent' },
  { ritu: 'Vasanta', english: 'Spring', months: [3, 4], dominant: 'Kapha aggravated', taste: 'Pungent, Bitter, Astringent' },
  { ritu: 'Grishma', english: 'Summer', months: [5, 6], dominant: 'Vata accumulates', taste: 'Sweet, Cold, Liquid' },
  { ritu: 'Varsha', english: 'Monsoon', months: [7, 8], dominant: 'Vata aggravated', taste: 'Sour, Salty, Oily' },
  { ritu: 'Sharad', english: 'Autumn', months: [9, 10], dominant: 'Pitta aggravated', taste: 'Sweet, Bitter, Astringent' },
  { ritu: 'Hemanta', english: 'Early Winter', months: [11, 12], dominant: 'Strong digestion', taste: 'Sweet, Sour, Salty' },
];

// Dosha Clock time periods
const DOSHA_CLOCK = [
  { start: 2, end: 6, dosha: 'Vata', period: 'Brahma Muhurta', activities: ['Wake up', 'Meditation', 'Pranayama', 'Light yoga'] },
  { start: 6, end: 10, dosha: 'Kapha', period: 'Morning Kapha', activities: ['Exercise', 'Heavy breakfast', 'Active work', 'Abhyanga'] },
  { start: 10, end: 14, dosha: 'Pitta', period: 'Midday Pitta', activities: ['Main meal', 'Important decisions', 'Focused work', 'Study'] },
  { start: 14, end: 18, dosha: 'Vata', period: 'Afternoon Vata', activities: ['Creative work', 'Light snack', 'Social activities', 'Walk'] },
  { start: 18, end: 22, dosha: 'Kapha', period: 'Evening Kapha', activities: ['Light dinner', 'Relaxation', 'Gentle yoga', 'Wind down'] },
  { start: 22, end: 2, dosha: 'Pitta', period: 'Night Pitta', activities: ['Deep sleep', 'Body repair', 'Metabolism', 'Detox'] },
];

// User roles
const USER_ROLES = {
  PATIENT: 'patient',
  FAMILY_MEMBER: 'family_member',
  DOCTOR: 'doctor',
};

// Sensor clinical thresholds
const SENSOR_THRESHOLDS = {
  heart_rate: { low: 50, high: 100, critical_low: 40, critical_high: 130 },
  spo2: { low: 92, normal: 95, critical: 88 },
  temperature: { low: 36.0, high: 37.5, fever: 38.0, critical: 39.5 },
};

module.exports = {
  DISEASES,
  DOSHAS,
  RITUS,
  DOSHA_CLOCK,
  USER_ROLES,
  SENSOR_THRESHOLDS,
};
