import * as z from 'zod';

/**
 * Heart rate validation schema
 */
export const heartRateSchema = z
  .number()
  .min(30, 'Heart rate must be at least 30 bpm')
  .max(220, 'Heart rate must not exceed 220 bpm')
  .int('Heart rate must be a whole number');

/**
 * SpO2 validation schema
 */
export const spo2Schema = z
  .number()
  .min(50, 'SpO2 must be at least 50%')
  .max(100, 'SpO2 must not exceed 100%')
  .int('SpO2 must be a whole number');

/**
 * Temperature validation schema
 */
export const temperatureSchema = z
  .number()
  .min(32, 'Temperature must be at least 32°C')
  .max(42, 'Temperature must not exceed 42°C');

/**
 * Stress level validation schema
 */
export const stressSchema = z
  .number()
  .min(0, 'Stress level must be at least 0')
  .max(100, 'Stress level must not exceed 100')
  .int('Stress level must be a whole number');

/**
 * Sleep duration validation schema
 */
export const sleepSchema = z
  .number()
  .min(0, 'Sleep duration cannot be negative')
  .max(24, 'Sleep duration cannot exceed 24 hours');

/**
 * Steps validation schema
 */
export const stepsSchema = z
  .number()
  .min(0, 'Steps cannot be negative')
  .max(100000, 'Steps cannot exceed 100,000')
  .int('Steps must be a whole number');

/**
 * Calories validation schema
 */
export const caloriesSchema = z
  .number()
  .min(0, 'Calories cannot be negative')
  .max(10000, 'Calories cannot exceed 10,000')
  .int('Calories must be a whole number');

/**
 * Distance validation schema
 */
export const distanceSchema = z
  .number()
  .min(0, 'Distance cannot be negative')
  .max(100, 'Distance cannot exceed 100 km');

/**
 * Blood pressure validation schema
 */
export const bloodPressureSchema = z.object({
  systolic: z
    .number()
    .min(70, 'Systolic pressure must be at least 70 mmHg')
    .max(250, 'Systolic pressure must not exceed 250 mmHg')
    .int('Systolic pressure must be a whole number'),
  diastolic: z
    .number()
    .min(40, 'Diastolic pressure must be at least 40 mmHg')
    .max(150, 'Diastolic pressure must not exceed 150 mmHg')
    .int('Diastolic pressure must be a whole number'),
}).refine((data) => data.systolic > data.diastolic, {
  message: 'Systolic pressure must be greater than diastolic pressure',
  path: ['systolic'],
});

/**
 * HRV validation schema
 */
export const hrvSchema = z
  .number()
  .min(10, 'HRV must be at least 10 ms')
  .max(200, 'HRV must not exceed 200 ms')
  .int('HRV must be a whole number');

/**
 * Respiratory rate validation schema
 */
export const respiratoryRateSchema = z
  .number()
  .min(8, 'Respiratory rate must be at least 8 breaths/min')
  .max(40, 'Respiratory rate must not exceed 40 breaths/min')
  .int('Respiratory rate must be a whole number');

/**
 * Glucose validation schema
 */
export const glucoseSchema = z
  .number()
  .min(20, 'Glucose must be at least 20 mg/dL')
  .max(600, 'Glucose must not exceed 600 mg/dL')
  .int('Glucose must be a whole number');

/**
 * Weight validation schema
 */
export const weightSchema = z
  .number()
  .min(2, 'Weight must be at least 2 kg')
  .max(300, 'Weight must not exceed 300 kg');

/**
 * Height validation schema
 */
export const heightSchema = z
  .number()
  .min(50, 'Height must be at least 50 cm')
  .max(250, 'Height must not exceed 250 cm')
  .int('Height must be a whole number');

/**
 * BMI validation schema
 */
export const bmiSchema = z
  .number()
  .min(10, 'BMI must be at least 10')
  .max(60, 'BMI must not exceed 60');

/**
 * Water intake validation schema
 */
export const waterIntakeSchema = z
  .number()
  .min(0, 'Water intake cannot be negative')
  .max(10, 'Water intake cannot exceed 10 L');

/**
 * Complete health reading validation schema
 */
export const healthReadingSchema = z.object({
  heartRate: heartRateSchema.optional(),
  spo2: spo2Schema.optional(),
  temperature: temperatureSchema.optional(),
  stress: stressSchema.optional(),
  sleep: sleepSchema.optional(),
  steps: stepsSchema.optional(),
  calories: caloriesSchema.optional(),
  distance: distanceSchema.optional(),
  bloodPressure: bloodPressureSchema.optional(),
  hrv: hrvSchema.optional(),
  respiratoryRate: respiratoryRateSchema.optional(),
  glucose: glucoseSchema.optional(),
  weight: weightSchema.optional(),
  height: heightSchema.optional(),
  bmi: bmiSchema.optional(),
  waterIntake: waterIntakeSchema.optional(),
  timestamp: z.string().datetime().optional(),
});

/**
 * Validate heart rate
 * @param {number} value - Heart rate value
 * @returns {Object} Validation result
 */
export const validateHeartRate = (value) => {
  try {
    heartRateSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate SpO2
 * @param {number} value - SpO2 value
 * @returns {Object} Validation result
 */
export const validateSpO2 = (value) => {
  try {
    spo2Schema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate temperature
 * @param {number} value - Temperature value
 * @returns {Object} Validation result
 */
export const validateTemperature = (value) => {
  try {
    temperatureSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate stress level
 * @param {number} value - Stress level
 * @returns {Object} Validation result
 */
export const validateStress = (value) => {
  try {
    stressSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate sleep duration
 * @param {number} value - Sleep duration
 * @returns {Object} Validation result
 */
export const validateSleep = (value) => {
  try {
    sleepSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate steps
 * @param {number} value - Steps count
 * @returns {Object} Validation result
 */
export const validateSteps = (value) => {
  try {
    stepsSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate calories
 * @param {number} value - Calories
 * @returns {Object} Validation result
 */
export const validateCalories = (value) => {
  try {
    caloriesSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate distance
 * @param {number} value - Distance
 * @returns {Object} Validation result
 */
export const validateDistance = (value) => {
  try {
    distanceSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate blood pressure
 * @param {Object} bp - Blood pressure object
 * @returns {Object} Validation result
 */
export const validateBloodPressure = (bp) => {
  try {
    bloodPressureSchema.parse(bp);
    return { isValid: true, error: null };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { isValid: false, errors };
  }
};

/**
 * Validate HRV
 * @param {number} value - HRV value
 * @returns {Object} Validation result
 */
export const validateHRV = (value) => {
  try {
    hrvSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate respiratory rate
 * @param {number} value - Respiratory rate
 * @returns {Object} Validation result
 */
export const validateRespiratoryRate = (value) => {
  try {
    respiratoryRateSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate glucose
 * @param {number} value - Glucose value
 * @returns {Object} Validation result
 */
export const validateGlucose = (value) => {
  try {
    glucoseSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate weight
 * @param {number} value - Weight value
 * @returns {Object} Validation result
 */
export const validateWeight = (value) => {
  try {
    weightSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate height
 * @param {number} value - Height value
 * @returns {Object} Validation result
 */
export const validateHeight = (value) => {
  try {
    heightSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate BMI
 * @param {number} value - BMI value
 * @returns {Object} Validation result
 */
export const validateBMI = (value) => {
  try {
    bmiSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate water intake
 * @param {number} value - Water intake
 * @returns {Object} Validation result
 */
export const validateWaterIntake = (value) => {
  try {
    waterIntakeSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate complete health reading
 * @param {Object} data - Health reading data
 * @returns {Object} Validation result
 */
export const validateHealthReading = (data) => {
  try {
    healthReadingSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path.join('.')] = err.message;
    });
    return { isValid: false, errors };
  }
};

/**
 * Get health status based on value and ranges
 * @param {string} type - Metric type
 * @param {number} value - Metric value
 * @returns {Object} Status information
 */
export const getHealthStatus = (type, value) => {
  const ranges = {
    heartRate: {
      criticalLow: 40,
      low: 50,
      normal: [60, 100],
      high: 100,
      criticalHigh: 120,
    },
    spo2: {
      critical: 90,
      low: 95,
      normal: [95, 100],
    },
    temperature: {
      criticalLow: 35,
      low: 36,
      normal: [36.1, 37.2],
      high: 37.5,
      criticalHigh: 38.5,
    },
    stress: {
      low: 30,
      moderate: 50,
      high: 70,
      severe: 85,
    },
    glucose: {
      criticalLow: 54,
      low: 70,
      normal: [70, 140],
      high: 180,
      criticalHigh: 250,
    },
  };

  const range = ranges[type];
  if (!range) return { status: 'unknown', color: '#8D9BA5' };

  switch(type) {
    case 'heartRate':
      if (value < range.criticalLow) return { status: 'criticalLow', color: '#FF5A5F', label: 'Critically Low' };
      if (value < range.low) return { status: 'low', color: '#4A90E2', label: 'Low' };
      if (value >= range.normal[0] && value <= range.normal[1]) return { status: 'normal', color: '#4CAF50', label: 'Normal' };
      if (value > range.high) return { status: 'high', color: '#FFB347', label: 'High' };
      if (value > range.criticalHigh) return { status: 'criticalHigh', color: '#FF5A5F', label: 'Critically High' };
      break;

    case 'spo2':
      if (value < range.critical) return { status: 'critical', color: '#FF5A5F', label: 'Critical' };
      if (value < range.low) return { status: 'low', color: '#FFB347', label: 'Low' };
      return { status: 'normal', color: '#4CAF50', label: 'Normal' };

    case 'temperature':
      if (value < range.criticalLow) return { status: 'criticalLow', color: '#FF5A5F', label: 'Hypothermia' };
      if (value < range.low) return { status: 'low', color: '#4A90E2', label: 'Low' };
      if (value >= range.normal[0] && value <= range.normal[1]) return { status: 'normal', color: '#4CAF50', label: 'Normal' };
      if (value > range.high) return { status: 'high', color: '#FFB347', label: 'Elevated' };
      if (value > range.criticalHigh) return { status: 'criticalHigh', color: '#FF5A5F', label: 'Fever' };
      break;

    case 'stress':
      if (value < range.low) return { status: 'low', color: '#4CAF50', label: 'Low' };
      if (value < range.moderate) return { status: 'moderate', color: '#4A90E2', label: 'Moderate' };
      if (value < range.high) return { status: 'high', color: '#FFB347', label: 'High' };
      return { status: 'severe', color: '#FF5A5F', label: 'Severe' };

    case 'glucose':
      if (value < range.criticalLow) return { status: 'criticalLow', color: '#FF5A5F', label: 'Critical Low' };
      if (value < range.low) return { status: 'low', color: '#4A90E2', label: 'Low' };
      if (value >= range.normal[0] && value <= range.normal[1]) return { status: 'normal', color: '#4CAF50', label: 'Normal' };
      if (value > range.high) return { status: 'high', color: '#FFB347', label: 'High' };
      if (value > range.criticalHigh) return { status: 'criticalHigh', color: '#FF5A5F', label: 'Critical High' };
      break;
  }

  return { status: 'unknown', color: '#8D9BA5' };
};

/**
 * Check if health metric is within normal range
 * @param {string} type - Metric type
 * @param {number} value - Metric value
 * @returns {boolean} True if normal
 */
export const isInNormalRange = (type, value) => {
  const status = getHealthStatus(type, value);
  return status.status === 'normal';
};

export default {
  heartRateSchema,
  spo2Schema,
  temperatureSchema,
  stressSchema,
  sleepSchema,
  stepsSchema,
  caloriesSchema,
  distanceSchema,
  bloodPressureSchema,
  hrvSchema,
  respiratoryRateSchema,
  glucoseSchema,
  weightSchema,
  heightSchema,
  bmiSchema,
  waterIntakeSchema,
  healthReadingSchema,
  validateHeartRate,
  validateSpO2,
  validateTemperature,
  validateStress,
  validateSleep,
  validateSteps,
  validateCalories,
  validateDistance,
  validateBloodPressure,
  validateHRV,
  validateRespiratoryRate,
  validateGlucose,
  validateWeight,
  validateHeight,
  validateBMI,
  validateWaterIntake,
  validateHealthReading,
  getHealthStatus,
  isInNormalRange,
};