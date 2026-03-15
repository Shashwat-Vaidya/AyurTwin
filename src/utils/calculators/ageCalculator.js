/**
 * Age calculation utilities
 */

/**
 * Calculate age from date of birth
 * @param {Date|string} dob - Date of birth
 * @returns {number} Age in years
 */
export const calculateAge = (dob) => {
  if (!dob) return null;
  
  const birthDate = new Date(dob);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Calculate exact age with months and days
 * @param {Date|string} dob - Date of birth
 * @returns {Object} Age object with years, months, days
 */
export const calculateExactAge = (dob) => {
  if (!dob) return null;
  
  const birthDate = new Date(dob);
  const today = new Date();
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();
  
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days };
};

/**
 * Calculate age in months
 * @param {Date|string} dob - Date of birth
 * @returns {number} Age in months
 */
export const calculateAgeInMonths = (dob) => {
  if (!dob) return null;
  
  const birthDate = new Date(dob);
  const today = new Date();
  
  const years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();
  
  return years * 12 + months;
};

/**
 * Calculate age in days
 * @param {Date|string} dob - Date of birth
 * @returns {number} Age in days
 */
export const calculateAgeInDays = (dob) => {
  if (!dob) return null;
  
  const birthDate = new Date(dob);
  const today = new Date();
  
  const diffTime = Math.abs(today - birthDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculate age in weeks
 * @param {Date|string} dob - Date of birth
 * @returns {number} Age in weeks
 */
export const calculateAgeInWeeks = (dob) => {
  const days = calculateAgeInDays(dob);
  return days ? Math.floor(days / 7) : null;
};

/**
 * Calculate age group
 * @param {number} age - Age in years
 * @returns {string} Age group
 */
export const getAgeGroup = (age) => {
  if (age < 0) return 'Invalid';
  if (age < 2) return 'Infant';
  if (age < 12) return 'Child';
  if (age < 18) return 'Adolescent';
  if (age < 30) return 'Young Adult';
  if (age < 45) return 'Adult';
  if (age < 60) return 'Middle Age';
  if (age < 75) return 'Senior';
  return 'Elderly';
};

/**
 * Check if age is valid (not in future, reasonable)
 * @param {Date|string} dob - Date of birth
 * @returns {boolean} True if valid
 */
export const isValidAge = (dob) => {
  if (!dob) return false;
  
  const birthDate = new Date(dob);
  const today = new Date();
  const age = calculateAge(dob);
  
  // Check if birth date is in the future
  if (birthDate > today) return false;
  
  // Check if age is reasonable (max 120 years)
  if (age > 120) return false;
  
  return true;
};

/**
 * Get life stage based on age
 * @param {number} age - Age in years
 * @returns {string} Life stage
 */
export const getLifeStage = (age) => {
  if (age < 0) return 'Invalid';
  if (age < 1) return 'Infancy';
  if (age < 3) return 'Early Childhood';
  if (age < 6) return 'Preschool';
  if (age < 12) return 'Middle Childhood';
  if (age < 18) return 'Adolescence';
  if (age < 30) return 'Early Adulthood';
  if (age < 45) return 'Middle Adulthood';
  if (age < 60) return 'Late Adulthood';
  if (age < 75) return 'Early Elderly';
  return 'Late Elderly';
};

/**
 * Get developmental milestones based on age
 * @param {number} age - Age in years
 * @returns {Array} Developmental milestones
 */
export const getDevelopmentalMilestones = (age) => {
  if (age < 1) {
    return [
      'Rolls over',
      'Sits without support',
      'Babbles',
      'Responds to name',
    ];
  } else if (age < 3) {
    return [
      'Walks independently',
      'Says simple words',
      'Follows simple instructions',
      'Shows independence',
    ];
  } else if (age < 6) {
    return [
      'Runs and climbs',
      'Speaks in sentences',
      'Counts objects',
      'Plays with others',
    ];
  } else if (age < 12) {
    return [
      'Reads and writes',
      'Develops friendships',
      'Understands rules',
      'Shows reasoning',
    ];
  } else if (age < 18) {
    return [
      'Abstract thinking',
      'Identity formation',
      'Peer relationships',
      'Future planning',
    ];
  } else if (age < 30) {
    return [
      'Career establishment',
      'Relationship formation',
      'Independence',
      'Personal growth',
    ];
  } else if (age < 45) {
    return [
      'Career peak',
      'Family responsibilities',
      'Financial stability',
      'Community involvement',
    ];
  } else if (age < 60) {
    return [
      'Career transition',
      'Empty nest',
      'Grandparenting',
      'Leisure activities',
    ];
  } else {
    return [
      'Retirement',
      'Reflection',
      'Legacy building',
      'Wisdom sharing',
    ];
  }
};

/**
 * Calculate target heart rate zone based on age
 * @param {number} age - Age in years
 * @returns {Object} Heart rate zones
 */
export const getHeartRateZones = (age) => {
  const maxHR = 220 - age;
  
  return {
    max: maxHR,
    moderate: {
      min: Math.round(maxHR * 0.64),
      max: Math.round(maxHR * 0.76),
    },
    vigorous: {
      min: Math.round(maxHR * 0.77),
      max: Math.round(maxHR * 0.93),
    },
    zone2: {
      min: Math.round(maxHR * 0.6),
      max: Math.round(maxHR * 0.7),
    },
  };
};

/**
 * Calculate calorie needs based on age
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @param {string} activityLevel - Activity level
 * @returns {Object} Calorie estimates
 */
export const getCalorieNeedsByAge = (age, gender = 'female', activityLevel = 'moderate') => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  
  let bmr;
  
  if (gender === 'male') {
    if (age < 30) bmr = 15.3 * 70 + 679; // Approximate for 70kg
    else if (age < 60) bmr = 11.6 * 70 + 879;
    else bmr = 13.5 * 70 + 487;
  } else {
    if (age < 30) bmr = 14.7 * 60 + 496; // Approximate for 60kg
    else if (age < 60) bmr = 8.7 * 60 + 829;
    else bmr = 10.5 * 60 + 596;
  }
  
  const tdee = bmr * activityMultipliers[activityLevel];
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    maintain: Math.round(tdee),
    lose: Math.round(tdee - 500),
    gain: Math.round(tdee + 500),
  };
};

/**
 * Calculate sleep needs based on age
 * @param {number} age - Age in years
 * @returns {Object} Sleep recommendations
 */
export const getSleepNeedsByAge = (age) => {
  if (age < 1) {
    return { min: 12, max: 16, recommended: 14 };
  } else if (age < 3) {
    return { min: 11, max: 14, recommended: 12 };
  } else if (age < 6) {
    return { min: 10, max: 13, recommended: 11 };
  } else if (age < 12) {
    return { min: 9, max: 12, recommended: 10 };
  } else if (age < 18) {
    return { min: 8, max: 10, recommended: 9 };
  } else if (age < 60) {
    return { min: 7, max: 9, recommended: 8 };
  } else {
    return { min: 7, max: 8, recommended: 7.5 };
  }
};

/**
 * Calculate fluid needs based on age
 * @param {number} age - Age in years
 * @param {number} weight - Weight in kg
 * @returns {Object} Fluid recommendations
 */
export const getFluidNeedsByAge = (age, weight) => {
  let baseFluid;
  
  if (age < 1) {
    baseFluid = weight * 150 / 1000; // 150 ml/kg
  } else if (age < 3) {
    baseFluid = 1.3;
  } else if (age < 6) {
    baseFluid = 1.7;
  } else if (age < 12) {
    baseFluid = 2.4;
  } else if (age < 18) {
    baseFluid = age < 14 ? 2.8 : 3.3;
  } else if (age < 60) {
    baseFluid = age < 30 ? 3.7 : 3.3;
  } else {
    baseFluid = 2.5;
  }
  
  return {
    min: baseFluid,
    recommended: baseFluid + 0.5,
    max: baseFluid + 1,
  };
};

export default {
  calculateAge,
  calculateExactAge,
  calculateAgeInMonths,
  calculateAgeInDays,
  calculateAgeInWeeks,
  getAgeGroup,
  isValidAge,
  getLifeStage,
  getDevelopmentalMilestones,
  getHeartRateZones,
  getCalorieNeedsByAge,
  getSleepNeedsByAge,
  getFluidNeedsByAge,
};