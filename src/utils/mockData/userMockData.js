/**
 * Mock user data for development and testing
 */

/**
 * Generate mock user profile
 * @param {Object} overrides - Override default values
 * @returns {Object} Mock user profile
 */
export const generateMockUser = (overrides = {}) => {
  const names = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sarah Williams', 'Michael Brown'];
  const emails = ['john@example.com', 'jane@example.com', 'alex@example.com', 'sarah@example.com', 'michael@example.com'];
  const randomIndex = Math.floor(Math.random() * names.length);

  return {
    id: `user_${Date.now()}`,
    fullName: overrides.fullName || names[randomIndex],
    email: overrides.email || emails[randomIndex],
    phone: overrides.phone || '+91 98765 43210',
    dateOfBirth: overrides.dateOfBirth || '1990-01-01',
    age: overrides.age || 33,
    gender: overrides.gender || ['male', 'female', 'other'][Math.floor(Math.random() * 3)],
    bloodGroup: overrides.bloodGroup || ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
    height: overrides.height || Math.floor(Math.random() * (185 - 155) + 155),
    weight: overrides.weight || Math.floor(Math.random() * (85 - 55) + 55),
    bmi: overrides.bmi || 22.5,
    profileImage: overrides.profileImage || null,
    createdAt: overrides.createdAt || new Date().toISOString(),
    updatedAt: overrides.updatedAt || new Date().toISOString(),
    isActive: overrides.isActive !== undefined ? overrides.isActive : true,
    isVerified: overrides.isVerified !== undefined ? overrides.isVerified : true,
    ...overrides,
  };
};

/**
 * Generate mock personal info
 * @param {Object} overrides - Override default values
 * @returns {Object} Mock personal info
 */
export const generateMockPersonalInfo = (overrides = {}) => {
  return {
    fullName: overrides.fullName || 'John Doe',
    email: overrides.email || 'john.doe@example.com',
    phone: overrides.phone || '+91 9876543210',
    dateOfBirth: overrides.dateOfBirth || '1990-01-01',
    age: overrides.age || 33,
    gender: overrides.gender || 'male',
    bloodGroup: overrides.bloodGroup || 'O+',
    height: overrides.height || 175,
    weight: overrides.weight || 70,
    bmi: overrides.bmi || 22.9,
    ...overrides,
  };
};

/**
 * Generate mock lifestyle data
 * @param {Object} overrides - Override default values
 * @returns {Object} Mock lifestyle data
 */
export const generateMockLifestyle = (overrides = {}) => {
  return {
    physicalActivity: overrides.physicalActivity || ['sedentary', 'light', 'moderate', 'active', 'veryActive'][Math.floor(Math.random() * 5)],
    workType: overrides.workType || ['sitting', 'active', 'mixed'][Math.floor(Math.random() * 3)],
    dietType: overrides.dietType || ['vegetarian', 'non-vegetarian', 'eggetarian', 'vegan', 'flexitarian'][Math.floor(Math.random() * 5)],
    smoking: overrides.smoking !== undefined ? overrides.smoking : Math.random() > 0.7,
    alcohol: overrides.alcohol !== undefined ? overrides.alcohol : Math.random() > 0.6,
    waterIntake: overrides.waterIntake || (Math.random() * 3 + 1).toFixed(1),
    junkFoodFrequency: overrides.junkFoodFrequency || Math.floor(Math.random() * 7),
    exerciseDuration: overrides.exerciseDuration || Math.floor(Math.random() * 3),
    ...overrides,
  };
};

/**
 * Generate mock sleep and mental health data
 * @param {Object} overrides - Override default values
 * @returns {Object} Mock sleep data
 */
export const generateMockSleepMental = (overrides = {}) => {
  return {
    sleepDuration: overrides.sleepDuration || (Math.random() * 4 + 5).toFixed(1),
    sleepTime: overrides.sleepTime || '23:00',
    wakeTime: overrides.wakeTime || '07:00',
    daytimeSleepiness: overrides.daytimeSleepiness || Math.floor(Math.random() * 10) + 1,
    stressLevel: overrides.stressLevel || Math.floor(Math.random() * 10) + 1,
    anxietyLevel: overrides.anxietyLevel || Math.floor(Math.random() * 10) + 1,
    ...overrides,
  };
};

/**
 * Generate mock family history
 * @param {Object} overrides - Override default values
 * @returns {Object} Mock family history
 */
export const generateMockFamilyHistory = (overrides = {}) => {
  return {
    diabetes: overrides.diabetes !== undefined ? overrides.diabetes : Math.random() > 0.7,
    heartDisease: overrides.heartDisease !== undefined ? overrides.heartDisease : Math.random() > 0.8,
    hypertension: overrides.hypertension !== undefined ? overrides.hypertension : Math.random() > 0.6,
    asthma: overrides.asthma !== undefined ? overrides.asthma : Math.random() > 0.9,
    arthritis: overrides.arthritis !== undefined ? overrides.arthritis : Math.random() > 0.8,
    ...overrides,
  };
};

/**
 * Generate mock symptoms
 * @param {Object} overrides - Override default values
 * @returns {Object} Mock symptoms
 */
export const generateMockSymptoms = (overrides = {}) => {
  return {
    frequentThirst: overrides.frequentThirst !== undefined ? overrides.frequentThirst : Math.random() > 0.8,
    frequentUrination: overrides.frequentUrination !== undefined ? overrides.frequentUrination : Math.random() > 0.8,
    jointPain: overrides.jointPain !== undefined ? overrides.jointPain : Math.random() > 0.7,
    breathingDifficulty: overrides.breathingDifficulty !== undefined ? overrides.breathingDifficulty : Math.random() > 0.9,
    digestiveIssues: overrides.digestiveIssues !== undefined ? overrides.digestiveIssues : Math.random() > 0.6,
    fatigueLevel: overrides.fatigueLevel || Math.floor(Math.random() * 10) + 1,
    ...overrides,
  };
};

/**
 * Generate mock ayurvedic inputs
 * @param {Object} overrides - Override default values
 * @returns {Object} Mock ayurvedic inputs
 */
export const generateMockAyurvedicInputs = (overrides = {}) => {
  return {
    digestionStrength: overrides.digestionStrength || Math.floor(Math.random() * 10) + 1,
    appetiteLevel: overrides.appetiteLevel || Math.floor(Math.random() * 10) + 1,
    sweatingLevel: overrides.sweatingLevel || Math.floor(Math.random() * 10) + 1,
    temperaturePreference: overrides.temperaturePreference || ['cold', 'normal', 'hot'][Math.floor(Math.random() * 3)],
    stressResponse: overrides.stressResponse || ['calm', 'irritable', 'anxious'][Math.floor(Math.random() * 3)],
    ...overrides,
  };
};

/**
 * Generate mock prakriti
 * @param {Object} overrides - Override default values
 * @returns {Object} Mock prakriti
 */
export const generateMockPrakriti = (overrides = {}) => {
  const vata = overrides.vata || Math.floor(Math.random() * 40 + 20);
  const pitta = overrides.pitta || Math.floor(Math.random() * 40 + 20);
  const kapha = 100 - vata - pitta;

  return {
    type: overrides.type || ['vata', 'pitta', 'kapha', 'vata-pitta', 'pitta-kapha', 'vata-kapha', 'tridosha'][Math.floor(Math.random() * 7)],
    vata: overrides.vata || vata,
    pitta: overrides.pitta || pitta,
    kapha: overrides.kapha || kapha,
    ...overrides,
  };
};

/**
 * Generate complete mock user profile
 * @param {Object} overrides - Override default values
 * @returns {Object} Complete mock user
 */
export const generateMockCompleteUser = (overrides = {}) => {
  const personalInfo = generateMockPersonalInfo(overrides.personalInfo);
  const lifestyle = generateMockLifestyle(overrides.lifestyle);
  const sleepMental = generateMockSleepMental(overrides.sleepMental);
  const familyHistory = generateMockFamilyHistory(overrides.familyHistory);
  const symptoms = generateMockSymptoms(overrides.symptoms);
  const ayurvedicInputs = generateMockAyurvedicInputs(overrides.ayurvedicInputs);
  const prakriti = generateMockPrakriti(overrides.prakriti);

  return {
    id: overrides.id || `user_${Date.now()}`,
    personalInfo,
    lifestyle,
    sleepMental,
    familyHistory,
    symptoms,
    ayurvedicInputs,
    prakriti,
    createdAt: overrides.createdAt || new Date().toISOString(),
    updatedAt: overrides.updatedAt || new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Generate multiple mock users
 * @param {number} count - Number of users to generate
 * @returns {Array} Array of mock users
 */
export const generateMockUsers = (count = 5) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(generateMockCompleteUser({ id: `user_${i + 1}` }));
  }
  return users;
};

/**
 * Mock user credentials for testing
 */
export const MOCK_CREDENTIALS = {
  valid: {
    email: 'test@ayurtwin.com',
    password: 'Test@123',
  },
  invalid: {
    email: 'wrong@example.com',
    password: 'wrongpass',
  },
};

/**
 * Mock users for testing different scenarios
 */
export const MOCK_USERS = {
  standard: generateMockCompleteUser({
    id: 'user_standard',
    personalInfo: { fullName: 'Standard User', email: 'standard@example.com' },
  }),
  
  premium: generateMockCompleteUser({
    id: 'user_premium',
    personalInfo: { fullName: 'Premium User', email: 'premium@example.com' },
  }),
  
  admin: generateMockCompleteUser({
    id: 'user_admin',
    personalInfo: { fullName: 'Admin User', email: 'admin@example.com' },
  }),
  
  newUser: generateMockCompleteUser({
    id: 'user_new',
    personalInfo: { fullName: 'New User', email: 'new@example.com' },
    createdAt: new Date().toISOString(),
  }),
  
  elderly: generateMockCompleteUser({
    id: 'user_elderly',
    personalInfo: { fullName: 'Elderly User', email: 'elderly@example.com', age: 70, dateOfBirth: '1954-01-01' },
  }),
  
  athlete: generateMockCompleteUser({
    id: 'user_athlete',
    personalInfo: { fullName: 'Athlete User', email: 'athlete@example.com', height: 180, weight: 75 },
    lifestyle: { physicalActivity: 'veryActive', exerciseDuration: 3 },
  }),
  
  sedentary: generateMockCompleteUser({
    id: 'user_sedentary',
    personalInfo: { fullName: 'Sedentary User', email: 'sedentary@example.com', height: 170, weight: 85 },
    lifestyle: { physicalActivity: 'sedentary', exerciseDuration: 0 },
  }),
  
  vataDominant: generateMockCompleteUser({
    id: 'user_vata',
    personalInfo: { fullName: 'Vata User', email: 'vata@example.com' },
    prakriti: { type: 'vata', vata: 60, pitta: 20, kapha: 20 },
  }),
  
  pittaDominant: generateMockCompleteUser({
    id: 'user_pitta',
    personalInfo: { fullName: 'Pitta User', email: 'pitta@example.com' },
    prakriti: { type: 'pitta', vata: 20, pitta: 60, kapha: 20 },
  }),
  
  kaphaDominant: generateMockCompleteUser({
    id: 'user_kapha',
    personalInfo: { fullName: 'Kapha User', email: 'kapha@example.com' },
    prakriti: { type: 'kapha', vata: 20, pitta: 20, kapha: 60 },
  }),
};

export default {
  generateMockUser,
  generateMockPersonalInfo,
  generateMockLifestyle,
  generateMockSleepMental,
  generateMockFamilyHistory,
  generateMockSymptoms,
  generateMockAyurvedicInputs,
  generateMockPrakriti,
  generateMockCompleteUser,
  generateMockUsers,
  MOCK_CREDENTIALS,
  MOCK_USERS,
};