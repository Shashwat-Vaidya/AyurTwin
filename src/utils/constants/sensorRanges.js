/**
 * Sensor range constants for health monitoring
 */

/**
 * Heart rate ranges (bpm)
 */
export const HEART_RATE_RANGES = {
  resting: {
    min: 60,
    max: 100,
    unit: 'bpm',
  },
  zones: {
    zone1: { min: 50, max: 60, label: 'Very Light', color: '#4A90E2' },
    zone2: { min: 60, max: 70, label: 'Light', color: '#4CAF50' },
    zone3: { min: 70, max: 80, label: 'Moderate', color: '#FFB347' },
    zone4: { min: 80, max: 90, label: 'Hard', color: '#FF8C42' },
    zone5: { min: 90, max: 100, label: 'Maximum', color: '#FF5A5F' },
  },
  thresholds: {
    criticalLow: 40,
    low: 50,
    normal: { min: 60, max: 100 },
    high: 100,
    criticalHigh: 120,
  },
  ageBased: {
    infant: { min: 100, max: 160 },
    child: { min: 70, max: 120 },
    adult: { min: 60, max: 100 },
    senior: { min: 60, max: 100 },
  },
};

/**
 * Blood oxygen (SpO2) ranges (%)
 */
export const SPO2_RANGES = {
  normal: {
    min: 95,
    max: 100,
    color: '#4CAF50',
    label: 'Normal',
  },
  low: {
    min: 90,
    max: 94,
    color: '#FFB347',
    label: 'Low',
  },
  critical: {
    min: 0,
    max: 89,
    color: '#FF5A5F',
    label: 'Critical',
  },
  thresholds: {
    normal: 95,
    low: 90,
    critical: 85,
  },
};

/**
 * Temperature ranges (°C)
 */
export const TEMPERATURE_RANGES = {
  normal: {
    min: 36.1,
    max: 37.2,
    color: '#4CAF50',
    label: 'Normal',
  },
  low: {
    min: 35.0,
    max: 36.0,
    color: '#4A90E2',
    label: 'Low',
  },
  elevated: {
    min: 37.3,
    max: 38.0,
    color: '#FFB347',
    label: 'Elevated',
  },
  high: {
    min: 38.1,
    max: 39.0,
    color: '#FF8C42',
    label: 'High',
  },
  critical: {
    min: 39.1,
    max: 42.0,
    color: '#FF5A5F',
    label: 'Critical',
  },
  thresholds: {
    hypothermia: 35.0,
    normal: { min: 36.1, max: 37.2 },
    fever: 38.0,
    highFever: 39.0,
  },
};

/**
 * Temperature ranges (°F)
 */
export const TEMPERATURE_RANGES_F = {
  normal: {
    min: 97.0,
    max: 99.0,
    color: '#4CAF50',
    label: 'Normal',
  },
  low: {
    min: 95.0,
    max: 96.9,
    color: '#4A90E2',
    label: 'Low',
  },
  elevated: {
    min: 99.1,
    max: 100.4,
    color: '#FFB347',
    label: 'Elevated',
  },
  high: {
    min: 100.5,
    max: 102.2,
    color: '#FF8C42',
    label: 'High',
  },
  critical: {
    min: 102.3,
    max: 107.6,
    color: '#FF5A5F',
    label: 'Critical',
  },
};

/**
 * Stress level ranges (0-100)
 */
export const STRESS_RANGES = {
  relaxed: {
    min: 0,
    max: 30,
    color: '#4CAF50',
    label: 'Relaxed',
  },
  moderate: {
    min: 31,
    max: 50,
    color: '#4A90E2',
    label: 'Moderate',
  },
  elevated: {
    min: 51,
    max: 70,
    color: '#FFB347',
    label: 'Elevated',
  },
  high: {
    min: 71,
    max: 85,
    color: '#FF8C42',
    label: 'High',
  },
  severe: {
    min: 86,
    max: 100,
    color: '#FF5A5F',
    label: 'Severe',
  },
  thresholds: {
    low: 30,
    moderate: 50,
    high: 70,
    severe: 85,
  },
};

/**
 * Blood pressure ranges (mmHg)
 */
export const BLOOD_PRESSURE_RANGES = {
  normal: {
    systolic: { min: 90, max: 120 },
    diastolic: { min: 60, max: 80 },
    color: '#4CAF50',
    label: 'Normal',
  },
  elevated: {
    systolic: { min: 120, max: 129 },
    diastolic: { min: 60, max: 80 },
    color: '#FFB347',
    label: 'Elevated',
  },
  stage1: {
    systolic: { min: 130, max: 139 },
    diastolic: { min: 80, max: 89 },
    color: '#FF8C42',
    label: 'Stage 1 Hypertension',
  },
  stage2: {
    systolic: { min: 140, max: 180 },
    diastolic: { min: 90, max: 120 },
    color: '#FF5A5F',
    label: 'Stage 2 Hypertension',
  },
  crisis: {
    systolic: { min: 180, max: 250 },
    diastolic: { min: 120, max: 150 },
    color: '#FF0000',
    label: 'Hypertensive Crisis',
  },
  thresholds: {
    systolic: {
      normal: 120,
      elevated: 129,
      stage1: 139,
      stage2: 180,
    },
    diastolic: {
      normal: 80,
      stage1: 89,
      stage2: 120,
    },
  },
};

/**
 * Respiratory rate ranges (breaths per minute)
 */
export const RESPIRATORY_RATE_RANGES = {
  adult: {
    normal: { min: 12, max: 20, color: '#4CAF50' },
    low: { min: 8, max: 11, color: '#4A90E2' },
    high: { min: 21, max: 30, color: '#FFB347' },
    critical: { min: 31, max: 40, color: '#FF5A5F' },
  },
  child: {
    normal: { min: 18, max: 30, color: '#4CAF50' },
    low: { min: 12, max: 17, color: '#4A90E2' },
    high: { min: 31, max: 40, color: '#FFB347' },
    critical: { min: 41, max: 50, color: '#FF5A5F' },
  },
  infant: {
    normal: { min: 30, max: 50, color: '#4CAF50' },
    low: { min: 20, max: 29, color: '#4A90E2' },
    high: { min: 51, max: 60, color: '#FFB347' },
    critical: { min: 61, max: 70, color: '#FF5A5F' },
  },
};

/**
 * Sleep duration ranges (hours)
 */
export const SLEEP_RANGES = {
  adult: {
    ideal: { min: 7, max: 9, color: '#4CAF50' },
    adequate: { min: 6, max: 7, color: '#4A90E2' },
    insufficient: { min: 4, max: 6, color: '#FFB347' },
    excessive: { min: 9, max: 12, color: '#FF8C42' },
  },
  child: {
    ideal: { min: 9, max: 11, color: '#4CAF50' },
    adequate: { min: 8, max: 9, color: '#4A90E2' },
    insufficient: { min: 6, max: 8, color: '#FFB347' },
    excessive: { min: 11, max: 14, color: '#FF8C42' },
  },
  infant: {
    ideal: { min: 12, max: 16, color: '#4CAF50' },
    adequate: { min: 10, max: 12, color: '#4A90E2' },
    insufficient: { min: 8, max: 10, color: '#FFB347' },
    excessive: { min: 16, max: 18, color: '#FF8C42' },
  },
  thresholds: {
    minimum: 5,
    recommended: 7,
    maximum: 9,
  },
};

/**
 * Activity ranges (steps per day)
 */
export const ACTIVITY_RANGES = {
  sedentary: {
    min: 0,
    max: 5000,
    color: '#FF5A5F',
    label: 'Sedentary',
  },
  lightlyActive: {
    min: 5000,
    max: 7500,
    color: '#FFB347',
    label: 'Lightly Active',
  },
  moderatelyActive: {
    min: 7500,
    max: 10000,
    color: '#4A90E2',
    label: 'Moderately Active',
  },
  active: {
    min: 10000,
    max: 12500,
    color: '#4CAF50',
    label: 'Active',
  },
  veryActive: {
    min: 12500,
    max: 15000,
    color: '#2E7D32',
    label: 'Very Active',
  },
  thresholds: {
    sedentary: 5000,
    lightlyActive: 7500,
    active: 10000,
    veryActive: 12500,
  },
};

/**
 * HRV ranges (ms)
 */
export const HRV_RANGES = {
  poor: {
    min: 0,
    max: 30,
    color: '#FF5A5F',
    label: 'Poor',
  },
  fair: {
    min: 31,
    max: 45,
    color: '#FFB347',
    label: 'Fair',
  },
  good: {
    min: 46,
    max: 60,
    color: '#4A90E2',
    label: 'Good',
  },
  excellent: {
    min: 61,
    max: 100,
    color: '#4CAF50',
    label: 'Excellent',
  },
  thresholds: {
    poor: 30,
    fair: 45,
    good: 60,
  },
};

/**
 * Glucose ranges (mg/dL)
 */
export const GLUCOSE_RANGES = {
  normal: {
    fasting: { min: 70, max: 100 },
    postPrandial: { min: 70, max: 140 },
    color: '#4CAF50',
    label: 'Normal',
  },
  prediabetes: {
    fasting: { min: 101, max: 125 },
    postPrandial: { min: 141, max: 199 },
    color: '#FFB347',
    label: 'Prediabetes',
  },
  diabetes: {
    fasting: { min: 126, max: 300 },
    postPrandial: { min: 200, max: 400 },
    color: '#FF5A5F',
    label: 'Diabetes',
  },
  thresholds: {
    normal: 100,
    prediabetes: 125,
    diabetes: 126,
    low: 70,
    criticalLow: 54,
  },
};

/**
 * BMI ranges
 */
export const BMI_RANGES = {
  underweight: {
    min: 0,
    max: 18.4,
    color: '#4A90E2',
    label: 'Underweight',
  },
  normal: {
    min: 18.5,
    max: 24.9,
    color: '#4CAF50',
    label: 'Normal',
  },
  overweight: {
    min: 25.0,
    max: 29.9,
    color: '#FFB347',
    label: 'Overweight',
  },
  obese: {
    min: 30.0,
    max: 34.9,
    color: '#FF8C42',
    label: 'Obese Class I',
  },
  severelyObese: {
    min: 35.0,
    max: 39.9,
    color: '#FF5A5F',
    label: 'Obese Class II',
  },
  morbidlyObese: {
    min: 40.0,
    max: 60.0,
    color: '#FF0000',
    label: 'Obese Class III',
  },
  thresholds: {
    underweight: 18.5,
    normal: 25,
    overweight: 30,
    obese: 35,
  },
};

/**
 * Get range status for a value
 * @param {number} value - Sensor value
 * @param {Object} ranges - Range object with min/max for each level
 * @returns {Object} Status with label, color, and level
 */
export const getRangeStatus = (value, ranges) => {
  for (const [key, range] of Object.entries(ranges)) {
    if (range.min !== undefined && range.max !== undefined) {
      if (value >= range.min && value <= range.max) {
        return {
          level: key,
          label: range.label || key,
          color: range.color,
          inRange: true,
        };
      }
    }
  }
  return {
    level: 'unknown',
    label: 'Unknown',
    color: '#8D9BA5',
    inRange: false,
  };
};

/**
 * Get heart rate zone
 * @param {number} hr - Heart rate
 * @param {number} maxHR - Maximum heart rate
 * @returns {Object} Zone information
 */
export const getHeartRateZone = (hr, maxHR) => {
  const percentage = (hr / maxHR) * 100;
  
  if (percentage < 50) return HEART_RATE_RANGES.zones.zone1;
  if (percentage < 60) return HEART_RATE_RANGES.zones.zone2;
  if (percentage < 70) return HEART_RATE_RANGES.zones.zone3;
  if (percentage < 80) return HEART_RATE_RANGES.zones.zone4;
  return HEART_RATE_RANGES.zones.zone5;
};

export default {
  HEART_RATE_RANGES,
  SPO2_RANGES,
  TEMPERATURE_RANGES,
  TEMPERATURE_RANGES_F,
  STRESS_RANGES,
  BLOOD_PRESSURE_RANGES,
  RESPIRATORY_RATE_RANGES,
  SLEEP_RANGES,
  ACTIVITY_RANGES,
  HRV_RANGES,
  GLUCOSE_RANGES,
  BMI_RANGES,
  getRangeStatus,
  getHeartRateZone,
};