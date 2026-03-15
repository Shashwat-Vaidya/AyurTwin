/**
 * BMI Calculator Utility
 * Provides functions for calculating and interpreting Body Mass Index (BMI)
 */

/**
 * Calculate BMI from height and weight
 * @param {number} height - Height in centimeters
 * @param {number} weight - Weight in kilograms
 * @returns {number} BMI value rounded to 1 decimal place
 */
export const calculateBMI = (height, weight) => {
  if (!height || !weight) return null;
  if (height <= 0 || weight <= 0) return null;
  
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10;
};

/**
 * Get BMI category based on BMI value
 * @param {number} bmi - BMI value
 * @returns {Object} Category information with label, color, and description
 */
export const getBMICategory = (bmi) => {
  if (!bmi) return null;
  
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: '#4A90E2',
      range: '< 18.5',
      description: 'You may need to gain some weight for optimal health.',
      healthRisks: [
        'Nutritional deficiencies',
        'Weakened immune system',
        'Osteoporosis risk',
        'Fertility issues',
      ],
      recommendations: [
        'Increase calorie intake with nutrient-dense foods',
        'Include healthy fats and proteins',
        'Strength training to build muscle',
        'Consult a nutritionist for meal planning',
      ],
    };
  }
  
  if (bmi >= 18.5 && bmi < 25) {
    return {
      category: 'Normal',
      color: '#4CAF50',
      range: '18.5 - 24.9',
      description: 'You are in a healthy weight range for your height.',
      healthRisks: [
        'Low risk of weight-related health issues',
        'Maintain with balanced diet and exercise',
      ],
      recommendations: [
        'Maintain current healthy habits',
        'Regular physical activity',
        'Balanced nutrition',
        'Regular health check-ups',
      ],
    };
  }
  
  if (bmi >= 25 && bmi < 30) {
    return {
      category: 'Overweight',
      color: '#FF8C42',
      range: '25 - 29.9',
      description: 'You may be at risk for certain health conditions.',
      healthRisks: [
        'Increased risk of hypertension',
        'Higher cholesterol levels',
        'Type 2 diabetes risk',
        'Joint problems',
      ],
      recommendations: [
        'Moderate calorie reduction',
        'Increase physical activity',
        'Focus on whole foods',
        'Consult healthcare provider for guidance',
      ],
    };
  }
  
  if (bmi >= 30) {
    return {
      category: 'Obese',
      color: '#FF5A5F',
      range: '≥ 30',
      description: 'Significantly increased risk of health issues.',
      healthRisks: [
        'High blood pressure',
        'Type 2 diabetes',
        'Heart disease',
        'Sleep apnea',
        'Joint pain',
      ],
      recommendations: [
        'Medical supervision for weight loss',
        'Structured diet plan',
        'Regular exercise program',
        'Consider lifestyle counseling',
      ],
    };
  }
  
  return null;
};

/**
 * Calculate ideal weight range based on height
 * @param {number} height - Height in centimeters
 * @returns {Object} Ideal weight range in kilograms
 */
export const getIdealWeightRange = (height) => {
  if (!height || height <= 0) return null;
  
  const heightInMeters = height / 100;
  
  // BMI 18.5 to 24.9 is normal range
  const minWeight = 18.5 * (heightInMeters * heightInMeters);
  const maxWeight = 24.9 * (heightInMeters * heightInMeters);
  
  return {
    min: Math.round(minWeight * 10) / 10,
    max: Math.round(maxWeight * 10) / 10,
  };
};

/**
 * Calculate weight to lose/gain to reach normal BMI
 * @param {number} height - Height in centimeters
 * @param {number} weight - Current weight in kilograms
 * @returns {Object} Weight adjustment needed
 */
export const getWeightAdjustment = (height, weight) => {
  if (!height || !weight) return null;
  
  const idealRange = getIdealWeightRange(height);
  if (!idealRange) return null;
  
  const bmi = calculateBMI(height, weight);
  
  if (bmi < 18.5) {
    const gainNeeded = idealRange.min - weight;
    return {
      action: 'gain',
      amount: Math.round(gainNeeded * 10) / 10,
      message: `You need to gain approximately ${Math.round(gainNeeded * 10) / 10} kg to reach a healthy weight.`,
    };
  }
  
  if (bmi > 24.9) {
    const loseNeeded = weight - idealRange.max;
    return {
      action: 'lose',
      amount: Math.round(loseNeeded * 10) / 10,
      message: `You need to lose approximately ${Math.round(loseNeeded * 10) / 10} kg to reach a healthy weight.`,
    };
  }
  
  return {
    action: 'maintain',
    amount: 0,
    message: 'You are already in a healthy weight range.',
  };
};

/**
 * Get comprehensive BMI report
 * @param {number} height - Height in centimeters
 * @param {number} weight - Weight in kilograms
 * @returns {Object} Complete BMI analysis
 */
export const getCompleteBMIReport = (height, weight) => {
  const bmi = calculateBMI(height, weight);
  if (!bmi) return null;
  
  const category = getBMICategory(bmi);
  const idealRange = getIdealWeightRange(height);
  const adjustment = getWeightAdjustment(height, weight);
  
  return {
    bmi,
    category,
    idealRange,
    adjustment,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Validate BMI input values
 * @param {number} height - Height in centimeters
 * @param {number} weight - Weight in kilograms
 * @returns {Object} Validation result
 */
export const validateBMIInput = (height, weight) => {
  const errors = {};
  
  if (!height || height <= 0) {
    errors.height = 'Height must be greater than 0';
  } else if (height < 50) {
    errors.height = 'Height seems too low (minimum 50 cm)';
  } else if (height > 250) {
    errors.height = 'Height seems too high (maximum 250 cm)';
  }
  
  if (!weight || weight <= 0) {
    errors.weight = 'Weight must be greater than 0';
  } else if (weight < 2) {
    errors.weight = 'Weight seems too low (minimum 2 kg)';
  } else if (weight > 300) {
    errors.weight = 'Weight seems too high (maximum 300 kg)';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Calculate BMI from imperial units
 * @param {number} heightFeet - Height in feet
 * @param {number} heightInches - Additional inches
 * @param {number} weightLbs - Weight in pounds
 * @returns {Object} BMI and metric conversions
 */
export const calculateBMIFromImperial = (heightFeet, heightInches, weightLbs) => {
  if (!heightFeet || !weightLbs) return null;
  
  const totalInches = (heightFeet * 12) + (heightInches || 0);
  const heightCm = totalInches * 2.54;
  const weightKg = weightLbs * 0.453592;
  
  const bmi = calculateBMI(heightCm, weightKg);
  
  return {
    bmi,
    heightCm: Math.round(heightCm * 10) / 10,
    weightKg: Math.round(weightKg * 10) / 10,
  };
};

/**
 * BMI calculator with unit conversion
 */
export default {
  calculateBMI,
  getBMICategory,
  getIdealWeightRange,
  getWeightAdjustment,
  getCompleteBMIReport,
  validateBMIInput,
  calculateBMIFromImperial,
};