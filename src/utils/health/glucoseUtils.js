/**
 * Blood Glucose calculation and interpretation utilities
 */

/**
 * Glucose measurement units
 */
export const GLUCOSE_UNITS = {
  MG_DL: 'mg/dL',
  MMOL_L: 'mmol/L',
};

/**
 * Conversion factor between mg/dL and mmol/L
 */
export const MGDL_TO_MMOLL = 0.0555;
export const MMOLL_TO_MGDL = 18.0182;

/**
 * Glucose categories based on standard medical guidelines
 */
export const GLUCOSE_CATEGORIES = {
  // Fasting glucose categories
  FASTING: {
    LOW: {
      name: 'Low (Hypoglycemia)',
      min: 0,
      max: 70,
      color: '#4A90E2',
      description: 'Your blood glucose is below normal range',
      icon: 'arrow-down',
      urgency: 'high',
    },
    NORMAL: {
      name: 'Normal',
      min: 70,
      max: 100,
      color: '#4CAF50',
      description: 'Your fasting glucose is within normal range',
      icon: 'checkmark-circle',
      urgency: 'low',
    },
    PREDIABETES: {
      name: 'Prediabetes',
      min: 100,
      max: 126,
      color: '#FFB347',
      description: 'Your fasting glucose indicates prediabetes',
      icon: 'warning',
      urgency: 'medium',
    },
    DIABETES: {
      name: 'Diabetes',
      min: 126,
      max: 1000,
      color: '#FF5A5F',
      description: 'Your fasting glucose indicates diabetes',
      icon: 'alert',
      urgency: 'high',
    },
  },

  // Post-prandial (after meals) categories
  POST_PRANDIAL: {
    NORMAL: {
      name: 'Normal',
      min: 0,
      max: 140,
      color: '#4CAF50',
      description: 'Your post-meal glucose is within normal range',
      icon: 'checkmark-circle',
      urgency: 'low',
    },
    ELEVATED: {
      name: 'Elevated',
      min: 140,
      max: 200,
      color: '#FFB347',
      description: 'Your post-meal glucose is elevated',
      icon: 'warning',
      urgency: 'medium',
    },
    DIABETES: {
      name: 'Diabetes Range',
      min: 200,
      max: 1000,
      color: '#FF5A5F',
      description: 'Your post-meal glucose is in diabetes range',
      icon: 'alert',
      urgency: 'high',
    },
  },

  // HbA1c categories
  HBA1C: {
    NORMAL: {
      name: 'Normal',
      min: 0,
      max: 5.7,
      color: '#4CAF50',
      description: 'Your HbA1c is within normal range',
      icon: 'checkmark-circle',
      urgency: 'low',
    },
    PREDIABETES: {
      name: 'Prediabetes',
      min: 5.7,
      max: 6.5,
      color: '#FFB347',
      description: 'Your HbA1c indicates prediabetes',
      icon: 'warning',
      urgency: 'medium',
    },
    DIABETES: {
      name: 'Diabetes',
      min: 6.5,
      max: 20,
      color: '#FF5A5F',
      description: 'Your HbA1c indicates diabetes',
      icon: 'alert',
      urgency: 'high',
    },
  },
};

/**
 * Convert glucose between units
 * @param {number} value - Glucose value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export const convertGlucose = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;

  if (fromUnit === GLUCOSE_UNITS.MG_DL && toUnit === GLUCOSE_UNITS.MMOL_L) {
    return Number((value * MGDL_TO_MMOLL).toFixed(1));
  } else if (fromUnit === GLUCOSE_UNITS.MMOL_L && toUnit === GLUCOSE_UNITS.MG_DL) {
    return Math.round(value * MMOLL_TO_MGDL);
  }

  return value;
};

/**
 * Get glucose category for fasting reading
 * @param {number} value - Glucose value in mg/dL
 * @returns {Object} Glucose category
 */
export const getFastingGlucoseCategory = (value) => {
  if (!value) return null;

  if (value < GLUCOSE_CATEGORIES.FASTING.LOW.max) {
    return GLUCOSE_CATEGORIES.FASTING.LOW;
  } else if (value < GLUCOSE_CATEGORIES.FASTING.NORMAL.max) {
    return GLUCOSE_CATEGORIES.FASTING.NORMAL;
  } else if (value < GLUCOSE_CATEGORIES.FASTING.PREDIABETES.max) {
    return GLUCOSE_CATEGORIES.FASTING.PREDIABETES;
  } else {
    return GLUCOSE_CATEGORIES.FASTING.DIABETES;
  }
};

/**
 * Get glucose category for post-prandial reading
 * @param {number} value - Glucose value in mg/dL
 * @returns {Object} Glucose category
 */
export const getPostPrandialGlucoseCategory = (value) => {
  if (!value) return null;

  if (value < GLUCOSE_CATEGORIES.POST_PRANDIAL.NORMAL.max) {
    return GLUCOSE_CATEGORIES.POST_PRANDIAL.NORMAL;
  } else if (value < GLUCOSE_CATEGORIES.POST_PRANDIAL.ELEVATED.max) {
    return GLUCOSE_CATEGORIES.POST_PRANDIAL.ELEVATED;
  } else {
    return GLUCOSE_CATEGORIES.POST_PRANDIAL.DIABETES;
  }
};

/**
 * Get HbA1c category
 * @param {number} value - HbA1c percentage
 * @returns {Object} HbA1c category
 */
export const getHbA1cCategory = (value) => {
  if (!value) return null;

  if (value < GLUCOSE_CATEGORIES.HBA1C.NORMAL.max) {
    return GLUCOSE_CATEGORIES.HBA1C.NORMAL;
  } else if (value < GLUCOSE_CATEGORIES.HBA1C.PREDIABETES.max) {
    return GLUCOSE_CATEGORIES.HBA1C.PREDIABETES;
  } else {
    return GLUCOSE_CATEGORIES.HBA1C.DIABETES;
  }
};

/**
 * Calculate estimated HbA1c from average glucose
 * @param {number} avgGlucose - Average glucose in mg/dL
 * @returns {number} Estimated HbA1c
 */
export const calculateEstimatedHbA1c = (avgGlucose) => {
  return Number(((avgGlucose + 46.7) / 28.7).toFixed(1));
};

/**
 * Calculate average glucose from HbA1c
 * @param {number} hba1c - HbA1c percentage
 * @returns {number} Estimated average glucose in mg/dL
 */
export const calculateAverageGlucoseFromHbA1c = (hba1c) => {
  return Math.round(28.7 * hba1c - 46.7);
};

/**
 * Calculate glucose variability
 * @param {Array} readings - Array of glucose readings
 * @returns {Object} Variability metrics
 */
export const calculateGlucoseVariability = (readings) => {
  if (readings.length < 2) return null;

  const values = readings.map(r => r.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;

  return {
    mean: Math.round(mean),
    standardDeviation: Math.round(Math.sqrt(variance)),
    coefficientOfVariation: Math.round((Math.sqrt(variance) / mean) * 100),
    min: Math.min(...values),
    max: Math.max(...values),
    range: Math.max(...values) - Math.min(...values),
  };
};

/**
 * Calculate time in range
 * @param {Array} readings - Array of glucose readings with timestamps
 * @param {number} lowThreshold - Low threshold (default: 70)
 * @param {number} highThreshold - High threshold (default: 180)
 * @returns {Object} Time in range statistics
 */
export const calculateTimeInRange = (readings, lowThreshold = 70, highThreshold = 180) => {
  if (readings.length < 2) return null;

  let timeBelow = 0;
  let timeInRange = 0;
  let timeAbove = 0;
  let totalTime = 0;

  for (let i = 0; i < readings.length - 1; i++) {
    const current = readings[i];
    const next = readings[i + 1];
    const timeDiff = new Date(next.timestamp) - new Date(current.timestamp);

    if (current.value < lowThreshold) {
      timeBelow += timeDiff;
    } else if (current.value > highThreshold) {
      timeAbove += timeDiff;
    } else {
      timeInRange += timeDiff;
    }
    totalTime += timeDiff;
  }

  return {
    below: (timeBelow / totalTime) * 100,
    inRange: (timeInRange / totalTime) * 100,
    above: (timeAbove / totalTime) * 100,
  };
};

/**
 * Get glucose status with recommendations
 * @param {number} value - Glucose value
 * @param {string} type - Reading type ('fasting', 'postPrandial', 'random')
 * @returns {Object} Status with recommendations
 */
export const getGlucoseStatus = (value, type = 'fasting') => {
  let category;
  let recommendations = [];
  let riskFactors = [];

  if (type === 'fasting') {
    category = getFastingGlucoseCategory(value);
    
    if (category === GLUCOSE_CATEGORIES.FASTING.NORMAL) {
      recommendations = [
        'Maintain healthy diet',
        'Regular exercise',
        'Monitor regularly',
      ];
      riskFactors = ['Low risk of diabetes'];
    } else if (category === GLUCOSE_CATEGORIES.FASTING.PREDIABETES) {
      recommendations = [
        'Reduce sugar and carbohydrate intake',
        'Increase physical activity',
        'Lose weight if overweight',
        'Monitor glucose regularly',
        'Consult healthcare provider',
      ];
      riskFactors = [
        'High risk of developing type 2 diabetes',
        'Increased cardiovascular risk',
      ];
    } else if (category === GLUCOSE_CATEGORIES.FASTING.DIABETES) {
      recommendations = [
        'Consult healthcare provider immediately',
        'Follow prescribed treatment plan',
        'Monitor glucose regularly',
        'Maintain healthy diet',
        'Regular exercise',
      ];
      riskFactors = [
        'Diabetes complications',
        'Cardiovascular disease',
        'Kidney disease',
        'Nerve damage',
      ];
    } else if (category === GLUCOSE_CATEGORIES.FASTING.LOW) {
      recommendations = [
        'Consume fast-acting carbohydrates',
        'Eat regular meals',
        'Monitor glucose closely',
        'Consult if recurrent',
      ];
      riskFactors = [
        'Hypoglycemia symptoms',
        'Risk of fainting',
      ];
    }
  } else if (type === 'postPrandial') {
    category = getPostPrandialGlucoseCategory(value);
    
    if (category === GLUCOSE_CATEGORIES.POST_PRANDIAL.NORMAL) {
      recommendations = [
        'Continue healthy eating habits',
        'Monitor post-meal spikes',
      ];
      riskFactors = ['Normal glucose response'];
    } else if (category === GLUCOSE_CATEGORIES.POST_PRANDIAL.ELEVATED) {
      recommendations = [
        'Reduce portion sizes',
        'Choose low-glycemic foods',
        'Walk after meals',
        'Monitor patterns',
      ];
      riskFactors = ['Impaired glucose tolerance'];
    } else {
      recommendations = [
        'Consult healthcare provider',
        'Review meal composition',
        'Consider medication adjustment',
        'Monitor frequently',
      ];
      riskFactors = ['Diabetes complications'];
    }
  }

  return {
    value,
    category: category.name,
    color: category.color,
    description: category.description,
    recommendations,
    riskFactors,
    icon: category.icon,
    urgency: category.urgency,
  };
};

/**
 * Calculate glucose trend
 * @param {Array} readings - Array of recent readings
 * @returns {string} Trend direction
 */
export const calculateGlucoseTrend = (readings) => {
  if (readings.length < 3) return 'stable';

  const recent = readings.slice(-3);
  const first = recent[0].value;
  const last = recent[2].value;
  
  const change = last - first;
  const percentChange = (change / first) * 100;

  if (Math.abs(percentChange) < 5) return 'stable';
  if (percentChange > 5) return 'rising';
  if (percentChange > 15) return 'rising rapidly';
  if (percentChange < -5) return 'falling';
  if (percentChange < -15) return 'falling rapidly';

  return 'stable';
};

/**
 * Validate glucose reading
 * @param {number} value - Glucose value
 * @param {string} unit - Unit of measurement
 * @returns {Object} Validation result
 */
export const validateGlucoseReading = (value, unit = GLUCOSE_UNITS.MG_DL) => {
  const errors = [];
  const valueMgDl = unit === GLUCOSE_UNITS.MG_DL ? value : convertGlucose(value, unit, GLUCOSE_UNITS.MG_DL);

  if (valueMgDl < 20) {
    errors.push('Glucose value is critically low (below 20 mg/dL)');
  }
  if (valueMgDl > 600) {
    errors.push('Glucose value is critically high (above 600 mg/dL)');
  }
  if (valueMgDl < 54) {
    errors.push('Severe hypoglycemia - seek immediate attention');
  }
  if (valueMgDl > 400) {
    errors.push('Severe hyperglycemia - seek medical attention');
  }

  return {
    isValid: errors.length === 0,
    errors,
    severity: valueMgDl < 54 || valueMgDl > 400 ? 'critical' : 
              valueMgDl < 70 || valueMgDl > 300 ? 'high' : 'normal',
  };
};

/**
 * Calculate insulin sensitivity factor
 * @param {number} weight - Weight in kg
 * @param {number} totalDailyInsulin - Total daily insulin units
 * @returns {number} Insulin sensitivity factor
 */
export const calculateInsulinSensitivity = (weight, totalDailyInsulin) => {
  // Using 1800 rule for rapid-acting insulin
  return Math.round(1800 / totalDailyInsulin);
};

/**
 * Calculate carbohydrate ratio
 * @param {number} totalDailyInsulin - Total daily insulin units
 * @returns {number} Carbohydrate ratio (grams per unit)
 */
export const calculateCarbRatio = (totalDailyInsulin) => {
  // Using 500 rule
  return Math.round(500 / totalDailyInsulin);
};

/**
 * Format glucose value for display
 * @param {number} value - Glucose value
 * @param {string} unit - Unit of measurement
 * @param {boolean} showUnit - Whether to show unit
 * @returns {string} Formatted glucose string
 */
export const formatGlucose = (value, unit = GLUCOSE_UNITS.MG_DL, showUnit = true) => {
  const formatted = Math.round(value);
  return showUnit ? `${formatted} ${unit}` : formatted.toString();
};

export default {
  GLUCOSE_UNITS,
  GLUCOSE_CATEGORIES,
  convertGlucose,
  getFastingGlucoseCategory,
  getPostPrandialGlucoseCategory,
  getHbA1cCategory,
  calculateEstimatedHbA1c,
  calculateAverageGlucoseFromHbA1c,
  calculateGlucoseVariability,
  calculateTimeInRange,
  getGlucoseStatus,
  calculateGlucoseTrend,
  validateGlucoseReading,
  calculateInsulinSensitivity,
  calculateCarbRatio,
  formatGlucose,
};