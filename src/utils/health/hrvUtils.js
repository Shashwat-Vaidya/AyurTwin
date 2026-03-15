/**
 * Heart Rate Variability (HRV) calculation and interpretation utilities
 */

/**
 * HRV measurement units
 */
export const HRV_UNITS = {
  MS: 'ms',
  MV: 'mV',
};

/**
 * HRV categories based on typical ranges
 */
export const HRV_CATEGORIES = {
  VERY_LOW: {
    name: 'Very Low',
    min: 0,
    max: 20,
    color: '#FF5A5F',
    description: 'Your HRV is very low, indicating high stress or fatigue',
    icon: 'alert-circle',
    recommendations: [
      'Prioritize rest and recovery',
      'Reduce stress levels',
      'Ensure adequate sleep',
      'Consider light activities only',
    ],
  },
  LOW: {
    name: 'Low',
    min: 20,
    max: 35,
    color: '#FFB347',
    description: 'Your HRV is below average. Focus on recovery.',
    icon: 'warning',
    recommendations: [
      'Get extra rest',
      'Practice relaxation techniques',
      'Avoid intense exercise',
      'Monitor stress levels',
    ],
  },
  MODERATE: {
    name: 'Moderate',
    min: 35,
    max: 50,
    color: '#4A90E2',
    description: 'Your HRV is in the moderate range',
    icon: 'information-circle',
    recommendations: [
      'Maintain balanced training',
      'Continue regular recovery',
      'Monitor for trends',
      'Stay hydrated',
    ],
  },
  GOOD: {
    name: 'Good',
    min: 50,
    max: 65,
    color: '#4CAF50',
    description: 'Your HRV is good, indicating balanced recovery',
    icon: 'checkmark-circle',
    recommendations: [
      'Maintain current routine',
      'Continue good sleep habits',
      'Keep stress management',
      'Optimal for training',
    ],
  },
  EXCELLENT: {
    name: 'Excellent',
    min: 65,
    max: 100,
    color: '#2E7D32',
    description: 'Your HRV is excellent, indicating great recovery',
    icon: 'trophy',
    recommendations: [
      'Great time for challenging workouts',
      'Push performance limits',
      'Maintain healthy habits',
      'Track what works well',
    ],
  },
};

/**
 * Calculate RMSSD (Root Mean Square of Successive Differences)
 * @param {Array} intervals - RR intervals in milliseconds
 * @returns {number} RMSSD value
 */
export const calculateRMSSD = (intervals) => {
  if (intervals.length < 2) return 0;

  let sumSquaredDifferences = 0;
  for (let i = 1; i < intervals.length; i++) {
    const diff = intervals[i] - intervals[i - 1];
    sumSquaredDifferences += diff * diff;
  }

  const rmssd = Math.sqrt(sumSquaredDifferences / (intervals.length - 1));
  return Math.round(rmssd * 10) / 10;
};

/**
 * Calculate SDNN (Standard Deviation of NN intervals)
 * @param {Array} intervals - RR intervals in milliseconds
 * @returns {number} SDNN value
 */
export const calculateSDNN = (intervals) => {
  if (intervals.length < 2) return 0;

  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const squaredDiffs = intervals.map(value => Math.pow(value - mean, 2));
  const sdnn = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / intervals.length);
  
  return Math.round(sdnn * 10) / 10;
};

/**
 * Calculate pNN50 (Percentage of successive RR intervals that differ by more than 50 ms)
 * @param {Array} intervals - RR intervals in milliseconds
 * @returns {number} pNN50 percentage
 */
export const calculatePNN50 = (intervals) => {
  if (intervals.length < 2) return 0;

  let count = 0;
  for (let i = 1; i < intervals.length; i++) {
    if (Math.abs(intervals[i] - intervals[i - 1]) > 50) {
      count++;
    }
  }

  const pnn50 = (count / (intervals.length - 1)) * 100;
  return Math.round(pnn50 * 10) / 10;
};

/**
 * Calculate LF/HF ratio (Low Frequency / High Frequency)
 * @param {number} lfPower - Low frequency power
 * @param {number} hfPower - High frequency power
 * @returns {number} LF/HF ratio
 */
export const calculateLFHFRatio = (lfPower, hfPower) => {
  if (hfPower === 0) return 0;
  return Math.round((lfPower / hfPower) * 100) / 100;
};

/**
 * Calculate HRV score based on multiple metrics
 * @param {Object} metrics - HRV metrics
 * @returns {number} HRV score (0-100)
 */
export const calculateHRVScore = (metrics) => {
  const {
    rmssd,
    sdnn,
    pnn50,
    age = 30,
    gender = 'male',
  } = metrics;

  // Age and gender adjusted scoring
  const ageFactor = age > 50 ? 0.8 : age > 40 ? 0.9 : age > 30 ? 1 : 1.1;
  const genderFactor = gender === 'female' ? 1.1 : 1;

  // Normalize each metric to 0-100 scale
  const rmssdScore = Math.min(100, (rmssd / 60) * 100);
  const sdnnScore = Math.min(100, (sdnn / 70) * 100);
  const pnn50Score = Math.min(100, pnn50 * 2);

  // Weighted average
  const score = (rmssdScore * 0.4 + sdnnScore * 0.4 + pnn50Score * 0.2) * ageFactor * genderFactor;
  
  return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * Get HRV category based on RMSSD
 * @param {number} rmssd - RMSSD value in ms
 * @returns {Object} HRV category
 */
export const getHRVCategory = (rmssd) => {
  if (!rmssd) return HRV_CATEGORIES.MODERATE;

  if (rmssd < HRV_CATEGORIES.VERY_LOW.max) {
    return HRV_CATEGORIES.VERY_LOW;
  } else if (rmssd < HRV_CATEGORIES.LOW.max) {
    return HRV_CATEGORIES.LOW;
  } else if (rmssd < HRV_CATEGORIES.MODERATE.max) {
    return HRV_CATEGORIES.MODERATE;
  } else if (rmssd < HRV_CATEGORIES.GOOD.max) {
    return HRV_CATEGORIES.GOOD;
  } else {
    return HRV_CATEGORIES.EXCELLENT;
  }
};

/**
 * Calculate HRV trend
 * @param {Array} readings - Array of HRV readings with timestamps
 * @returns {Object} Trend information
 */
export const calculateHRVTrend = (readings) => {
  if (readings.length < 3) {
    return {
      trend: 'insufficient_data',
      direction: 'stable',
      change: 0,
      percentChange: 0,
    };
  }

  const recent = readings.slice(-7); // Last 7 readings
  const first = recent[0].value;
  const last = recent[recent.length - 1].value;
  const change = last - first;
  const percentChange = (change / first) * 100;

  let direction = 'stable';
  if (percentChange > 10) direction = 'increasing';
  else if (percentChange > 5) direction = 'slightly_increasing';
  else if (percentChange < -10) direction = 'decreasing';
  else if (percentChange < -5) direction = 'slightly_decreasing';

  // Calculate moving average
  const movingAverage = recent.reduce((sum, r) => sum + r.value, 0) / recent.length;

  return {
    trend: direction,
    direction,
    change: Math.round(change * 10) / 10,
    percentChange: Math.round(percentChange * 10) / 10,
    movingAverage: Math.round(movingAverage * 10) / 10,
    lastValue: last,
    firstValue: first,
  };
};

/**
 * Calculate HRV recovery rate
 * @param {number} baselineHRV - Baseline HRV
 * @param {number} currentHRV - Current HRV
 * @returns {Object} Recovery information
 */
export const calculateRecoveryRate = (baselineHRV, currentHRV) => {
  const percentOfBaseline = (currentHRV / baselineHRV) * 100;
  
  let recoveryStatus = 'poor';
  if (percentOfBaseline >= 95) recoveryStatus = 'excellent';
  else if (percentOfBaseline >= 85) recoveryStatus = 'good';
  else if (percentOfBaseline >= 75) recoveryStatus = 'moderate';

  return {
    percentOfBaseline: Math.round(percentOfBaseline),
    status: recoveryStatus,
    difference: currentHRV - baselineHRV,
  };
};

/**
 * Get readiness score based on HRV
 * @param {number} hrv - Current HRV
 * @param {number} baselineHRV - Baseline HRV
 * @returns {Object} Readiness score and recommendations
 */
export const getReadinessScore = (hrv, baselineHRV) => {
  const ratio = hrv / baselineHRV;
  let score = Math.min(100, Math.max(0, Math.round(ratio * 100)));
  
  let readiness = 'moderate';
  let recommendations = [];

  if (ratio > 1.1) {
    readiness = 'excellent';
    recommendations = [
      'Great day for intense workout',
      'Push your limits',
      'High performance expected',
      'Good time for competition',
    ];
  } else if (ratio > 0.95) {
    readiness = 'good';
    recommendations = [
      'Good day for challenging workout',
      'Normal training intensity',
      'Maintain performance',
      'Good recovery',
    ];
  } else if (ratio > 0.85) {
    readiness = 'moderate';
    recommendations = [
      'Moderate training recommended',
      'Focus on technique',
      'Monitor fatigue',
      'Ensure adequate recovery',
    ];
  } else if (ratio > 0.7) {
    readiness = 'low';
    recommendations = [
      'Light activity only',
      'Prioritize recovery',
      'Consider rest day',
      'Focus on mobility/stretching',
    ];
  } else {
    readiness = 'very_low';
    recommendations = [
      'Take a complete rest day',
      'Prioritize sleep',
      'Reduce stress',
      'Light walking only',
    ];
  }

  return {
    score,
    readiness,
    recommendations,
    ratio: Math.round(ratio * 100) / 100,
  };
};

/**
 * Calculate stress score from HRV
 * @param {number} hrv - Current HRV
 * @param {number} baselineHRV - Baseline HRV
 * @returns {number} Stress score (0-100)
 */
export const calculateStressScore = (hrv, baselineHRV) => {
  const ratio = hrv / baselineHRV;
  // Lower HRV = higher stress
  let stressScore = Math.max(0, Math.min(100, 100 - (ratio * 100)));
  return Math.round(stressScore);
};

/**
 * Calculate fatigue level from HRV trend
 * @param {Array} readings - Array of recent HRV readings
 * @returns {Object} Fatigue assessment
 */
export const calculateFatigueLevel = (readings) => {
  if (readings.length < 7) {
    return { level: 'unknown', score: 50 };
  }

  const recent = readings.slice(-7);
  const values = recent.map(r => r.value);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const baseline = readings.slice(-30, -7).reduce((a, b) => a + b, 0) / 23; // Last 30 days minus last 7

  const ratio = average / baseline;
  let level = 'moderate';
  let score = 50;

  if (ratio < 0.7) {
    level = 'severe';
    score = 80;
  } else if (ratio < 0.85) {
    level = 'high';
    score = 65;
  } else if (ratio < 0.95) {
    level = 'moderate';
    score = 45;
  } else {
    level = 'low';
    score = 25;
  }

  return {
    level,
    score,
    ratio: Math.round(ratio * 100) / 100,
    average: Math.round(average * 10) / 10,
    baseline: Math.round(baseline * 10) / 10,
  };
};

/**
 * Validate HRV reading
 * @param {number} value - HRV value
 * @returns {Object} Validation result
 */
export const validateHRVReading = (value) => {
  const errors = [];

  if (value < 10) {
    errors.push('HRV value is unusually low (below 10 ms)');
  }
  if (value > 200) {
    errors.push('HRV value is unusually high (above 200 ms)');
  }
  if (value < 20) {
    errors.push('Very low HRV - may indicate high stress or fatigue');
  }
  if (value > 150) {
    errors.push('Very high HRV - verify measurement accuracy');
  }

  return {
    isValid: errors.length === 0,
    errors,
    severity: value < 15 || value > 180 ? 'critical' :
              value < 20 || value > 150 ? 'high' : 'normal',
  };
};

/**
 * Get optimal HRV range based on age
 * @param {number} age - Age in years
 * @returns {Object} Optimal HRV range
 */
export const getOptimalHRVRange = (age) => {
  // Age-adjusted optimal ranges
  const baseRange = {
    '20-30': { min: 55, max: 105 },
    '30-40': { min: 45, max: 95 },
    '40-50': { min: 40, max: 85 },
    '50-60': { min: 35, max: 75 },
    '60+': { min: 30, max: 65 },
  };

  if (age < 30) return baseRange['20-30'];
  if (age < 40) return baseRange['30-40'];
  if (age < 50) return baseRange['40-50'];
  if (age < 60) return baseRange['50-60'];
  return baseRange['60+'];
};

/**
 * Format HRV value for display
 * @param {number} value - HRV value
 * @param {boolean} showUnit - Whether to show unit
 * @returns {string} Formatted HRV string
 */
export const formatHRV = (value, showUnit = true) => {
  const formatted = Math.round(value);
  return showUnit ? `${formatted} ms` : formatted.toString();
};

export default {
  HRV_UNITS,
  HRV_CATEGORIES,
  calculateRMSSD,
  calculateSDNN,
  calculatePNN50,
  calculateLFHFRatio,
  calculateHRVScore,
  getHRVCategory,
  calculateHRVTrend,
  calculateRecoveryRate,
  getReadinessScore,
  calculateStressScore,
  calculateFatigueLevel,
  validateHRVReading,
  getOptimalHRVRange,
  formatHRV,
};