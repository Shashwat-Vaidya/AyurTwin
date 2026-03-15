/**
 * Blood Pressure calculation and interpretation utilities
 */

/**
 * Blood pressure categories based on AHA guidelines
 */
export const BP_CATEGORIES = {
  NORMAL: {
    name: 'Normal',
    systolicMin: 90,
    systolicMax: 120,
    diastolicMin: 60,
    diastolicMax: 80,
    color: '#4CAF50',
    description: 'Your blood pressure is normal. Maintain healthy habits.',
    icon: 'checkmark-circle',
  },
  ELEVATED: {
    name: 'Elevated',
    systolicMin: 120,
    systolicMax: 129,
    diastolicMin: 60,
    diastolicMax: 80,
    color: '#FFB347',
    description: 'Your blood pressure is elevated. Consider lifestyle changes.',
    icon: 'warning',
  },
  STAGE1: {
    name: 'High BP Stage 1',
    systolicMin: 130,
    systolicMax: 139,
    diastolicMin: 80,
    diastolicMax: 89,
    color: '#FF8C42',
    description: 'Stage 1 hypertension. Consult your healthcare provider.',
    icon: 'alert',
  },
  STAGE2: {
    name: 'High BP Stage 2',
    systolicMin: 140,
    systolicMax: 180,
    diastolicMin: 90,
    diastolicMax: 120,
    color: '#FF5A5F',
    description: 'Stage 2 hypertension. Seek medical attention.',
    icon: 'alert-circle',
  },
  CRISIS: {
    name: 'Hypertensive Crisis',
    systolicMin: 180,
    systolicMax: 300,
    diastolicMin: 120,
    diastolicMax: 200,
    color: '#FF0000',
    description: 'Hypertensive crisis! Seek emergency medical attention immediately.',
    icon: 'warning',
  },
  LOW: {
    name: 'Low BP',
    systolicMin: 0,
    systolicMax: 90,
    diastolicMin: 0,
    diastolicMax: 60,
    color: '#4A90E2',
    description: 'Your blood pressure is low. Monitor for symptoms like dizziness.',
    icon: 'information-circle',
  },
};

/**
 * Get blood pressure category
 * @param {number} systolic - Systolic pressure
 * @param {number} diastolic - Diastolic pressure
 * @returns {Object} BP category
 */
export const getBPCategory = (systolic, diastolic) => {
  if (!systolic || !diastolic) return null;

  if (systolic >= BP_CATEGORIES.CRISIS.systolicMin || diastolic >= BP_CATEGORIES.CRISIS.diastolicMin) {
    return BP_CATEGORIES.CRISIS;
  }
  if (systolic >= BP_CATEGORIES.STAGE2.systolicMin || diastolic >= BP_CATEGORIES.STAGE2.diastolicMin) {
    return BP_CATEGORIES.STAGE2;
  }
  if (systolic >= BP_CATEGORIES.STAGE1.systolicMin || diastolic >= BP_CATEGORIES.STAGE1.diastolicMin) {
    return BP_CATEGORIES.STAGE1;
  }
  if (systolic >= BP_CATEGORIES.ELEVATED.systolicMin && diastolic < BP_CATEGORIES.ELEVATED.diastolicMax) {
    return BP_CATEGORIES.ELEVATED;
  }
  if (systolic >= BP_CATEGORIES.NORMAL.systolicMin && systolic <= BP_CATEGORIES.NORMAL.systolicMax &&
      diastolic >= BP_CATEGORIES.NORMAL.diastolicMin && diastolic <= BP_CATEGORIES.NORMAL.diastolicMax) {
    return BP_CATEGORIES.NORMAL;
  }
  return BP_CATEGORIES.LOW;
};

/**
 * Calculate mean arterial pressure (MAP)
 * @param {number} systolic - Systolic pressure
 * @param {number} diastolic - Diastolic pressure
 * @returns {number} MAP
 */
export const calculateMAP = (systolic, diastolic) => {
  return Math.round((systolic + 2 * diastolic) / 3);
};

/**
 * Calculate pulse pressure
 * @param {number} systolic - Systolic pressure
 * @param {number} diastolic - Diastolic pressure
 * @returns {number} Pulse pressure
 */
export const calculatePulsePressure = (systolic, diastolic) => {
  return systolic - diastolic;
};

/**
 * Calculate blood pressure variability
 * @param {Array} readings - Array of BP readings
 * @returns {Object} Variability metrics
 */
export const calculateBPVariability = (readings) => {
  if (readings.length < 2) return null;

  const systolicReadings = readings.map(r => r.systolic);
  const diastolicReadings = readings.map(r => r.diastolic);

  const systolicMean = systolicReadings.reduce((a, b) => a + b, 0) / systolicReadings.length;
  const diastolicMean = diastolicReadings.reduce((a, b) => a + b, 0) / diastolicReadings.length;

  const systolicVariance = systolicReadings.reduce((acc, val) => 
    acc + Math.pow(val - systolicMean, 2), 0) / systolicReadings.length;
  const diastolicVariance = diastolicReadings.reduce((acc, val) => 
    acc + Math.pow(val - diastolicMean, 2), 0) / diastolicReadings.length;

  return {
    systolicSD: Math.sqrt(systolicVariance),
    diastolicSD: Math.sqrt(diastolicVariance),
    systolicMean,
    diastolicMean,
    systolicRange: Math.max(...systolicReadings) - Math.min(...systolicReadings),
    diastolicRange: Math.max(...diastolicReadings) - Math.min(...diastolicReadings),
  };
};

/**
 * Calculate average blood pressure
 * @param {Array} readings - Array of BP readings
 * @returns {Object} Average BP
 */
export const calculateAverageBP = (readings) => {
  if (readings.length === 0) return null;

  const sumSystolic = readings.reduce((sum, r) => sum + r.systolic, 0);
  const sumDiastolic = readings.reduce((sum, r) => sum + r.diastolic, 0);

  return {
    systolic: Math.round(sumSystolic / readings.length),
    diastolic: Math.round(sumDiastolic / readings.length),
  };
};

/**
 * Get blood pressure status
 * @param {number} systolic - Systolic pressure
 * @param {number} diastolic - Diastolic pressure
 * @returns {Object} Status with recommendations
 */
export const getBPStatus = (systolic, diastolic) => {
  const category = getBPCategory(systolic, diastolic);
  
  let recommendations = [];
  let riskFactors = [];

  switch (category.name) {
    case BP_CATEGORIES.NORMAL.name:
      recommendations = [
        'Maintain healthy diet',
        'Regular exercise',
        'Limit sodium intake',
        'Monitor regularly',
      ];
      riskFactors = ['Low risk of cardiovascular issues'];
      break;
      
    case BP_CATEGORIES.ELEVATED.name:
      recommendations = [
        'Reduce sodium intake',
        'Increase physical activity',
        'Maintain healthy weight',
        'Limit alcohol consumption',
        'Stress management',
      ];
      riskFactors = ['Increased risk of developing hypertension'];
      break;
      
    case BP_CATEGORIES.STAGE1.name:
      recommendations = [
        'Consult healthcare provider',
        'Monitor BP regularly',
        'Lifestyle modifications',
        'Consider medication if recommended',
        'Dietary changes (DASH diet)',
      ];
      riskFactors = [
        'Risk of heart disease',
        'Risk of stroke',
        'Kidney damage risk',
      ];
      break;
      
    case BP_CATEGORIES.STAGE2.name:
      recommendations = [
        'Seek medical attention promptly',
        'Take prescribed medications',
        'Frequent BP monitoring',
        'Strict lifestyle modifications',
        'Regular follow-ups',
      ];
      riskFactors = [
        'High risk of heart attack',
        'High risk of stroke',
        'Kidney damage',
        'Vision problems',
      ];
      break;
      
    case BP_CATEGORIES.CRISIS.name:
      recommendations = [
        'EMERGENCY - Call 911 immediately',
        'Do not wait',
        'Go to emergency room',
      ];
      riskFactors = [
        'Life-threatening condition',
        'Organ damage risk',
        'Stroke risk',
      ];
      break;
      
    default:
      recommendations = [
        'Monitor for symptoms',
        'Stay hydrated',
        'Stand up slowly',
        'Consult if symptomatic',
      ];
      riskFactors = [
        'May cause dizziness',
        'Fainting risk',
      ];
  }

  return {
    category: category.name,
    color: category.color,
    description: category.description,
    recommendations,
    riskFactors,
    icon: category.icon,
  };
};

/**
 * Format blood pressure reading
 * @param {number} systolic - Systolic pressure
 * @param {number} diastolic - Diastolic pressure
 * @returns {string} Formatted BP string
 */
export const formatBP = (systolic, diastolic) => {
  return `${systolic}/${diastolic} mmHg`;
};

/**
 * Validate blood pressure reading
 * @param {number} systolic - Systolic pressure
 * @param {number} diastolic - Diastolic pressure
 * @returns {Object} Validation result
 */
export const validateBPReading = (systolic, diastolic) => {
  const errors = [];

  if (systolic < 30 || systolic > 300) {
    errors.push('Systolic value seems invalid (should be 30-300 mmHg)');
  }
  if (diastolic < 20 || diastolic > 200) {
    errors.push('Diastolic value seems invalid (should be 20-200 mmHg)');
  }
  if (systolic <= diastolic) {
    errors.push('Systolic should be greater than diastolic');
  }
  if (systolic - diastolic < 10) {
    errors.push('Pulse pressure seems narrow (less than 10 mmHg)');
  }
  if (systolic - diastolic > 100) {
    errors.push('Pulse pressure seems wide (greater than 100 mmHg)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate time in target range
 * @param {Array} readings - Array of BP readings with timestamps
 * @param {Object} targetRange - Target range { systolicMin, systolicMax, diastolicMin, diastolicMax }
 * @returns {number} Percentage of time in range
 */
export const calculateTimeInRange = (readings, targetRange = null) => {
  if (readings.length < 2) return 0;

  const range = targetRange || {
    systolicMin: BP_CATEGORIES.NORMAL.systolicMin,
    systolicMax: BP_CATEGORIES.NORMAL.systolicMax,
    diastolicMin: BP_CATEGORIES.NORMAL.diastolicMin,
    diastolicMax: BP_CATEGORIES.NORMAL.diastolicMax,
  };

  let timeInRange = 0;
  let totalTime = 0;

  for (let i = 0; i < readings.length - 1; i++) {
    const current = readings[i];
    const next = readings[i + 1];
    const timeDiff = new Date(next.timestamp) - new Date(current.timestamp);

    const isCurrentInRange = 
      current.systolic >= range.systolicMin &&
      current.systolic <= range.systolicMax &&
      current.diastolic >= range.diastolicMin &&
      current.diastolic <= range.diastolicMax;

    const isNextInRange = 
      next.systolic >= range.systolicMin &&
      next.systolic <= range.systolicMax &&
      next.diastolic >= range.diastolicMin &&
      next.diastolic <= range.diastolicMax;

    if (isCurrentInRange && isNextInRange) {
      timeInRange += timeDiff;
    }
    totalTime += timeDiff;
  }

  return (timeInRange / totalTime) * 100;
};

/**
 * Get blood pressure trend
 * @param {Array} readings - Array of BP readings
 * @returns {string} Trend direction
 */
export const getBPTrend = (readings) => {
  if (readings.length < 3) return 'stable';

  const recent = readings.slice(-3);
  const firstAvg = (recent[0].systolic + recent[0].diastolic) / 2;
  const lastAvg = (recent[2].systolic + recent[2].diastolic) / 2;
  
  const change = lastAvg - firstAvg;
  
  if (Math.abs(change) < 5) return 'stable';
  return change > 0 ? 'increasing' : 'decreasing';
};

/**
 * Calculate target blood pressure based on age and health conditions
 * @param {number} age - Age in years
 * @param {Array} conditions - Health conditions
 * @returns {Object} Target BP range
 */
export const calculateTargetBP = (age, conditions = []) => {
  let targetSystolic = 120;
  let targetDiastolic = 80;

  if (age > 60) {
    targetSystolic = 130;
    targetDiastolic = 80;
  }

  if (conditions.includes('diabetes')) {
    targetSystolic = 130;
    targetDiastolic = 80;
  }

  if (conditions.includes('kidneyDisease')) {
    targetSystolic = 130;
    targetDiastolic = 80;
  }

  if (conditions.includes('heartDisease')) {
    targetSystolic = 130;
    targetDiastolic = 80;
  }

  return {
    systolicMin: targetSystolic - 10,
    systolicMax: targetSystolic + 10,
    diastolicMin: targetDiastolic - 10,
    diastolicMax: targetDiastolic + 10,
    target: `${targetSystolic}/${targetDiastolic}`,
  };
};

export default {
  BP_CATEGORIES,
  getBPCategory,
  calculateMAP,
  calculatePulsePressure,
  calculateBPVariability,
  calculateAverageBP,
  getBPStatus,
  formatBP,
  validateBPReading,
  calculateTimeInRange,
  getBPTrend,
  calculateTargetBP,
};