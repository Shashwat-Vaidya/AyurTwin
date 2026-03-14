/**
 * BMI Calculator Utility
 * BMI = weight(kg) / height(m)²
 */

// Calculate BMI from height (cm) and weight (kg)
export const calculateBMI = (heightCm, weightKg) => {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return null;
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10; // Round to 1 decimal
};

// Get BMI category
export const getBMICategory = (bmi) => {
  if (!bmi) return { label: 'Unknown', color: '#8D9BA5', range: '' };
  
  if (bmi < 18.5) {
    return {
      label: 'Underweight',
      color: '#4A90E2', // Blue
      range: '< 18.5',
      risk: 'Low',
      recommendation: 'Consider increasing calorie intake with nutrient-rich foods',
    };
  }
  if (bmi < 25) {
    return {
      label: 'Normal',
      color: '#4CAF50', // Green
      range: '18.5 - 24.9',
      risk: 'Very Low',
      recommendation: 'Maintain healthy diet and exercise routine',
    };
  }
  if (bmi < 30) {
    return {
      label: 'Overweight',
      color: '#FF8C42', // Orange
      range: '25 - 29.9',
      risk: 'Low to Moderate',
      recommendation: 'Consider increasing physical activity and balanced diet',
    };
  }
  return {
    label: 'Obese',
    color: '#FF5A5F', // Red
    range: '≥ 30',
    risk: 'High',
    recommendation: 'Consult with healthcare provider for weight management plan',
  };
};

// Calculate ideal weight range for height (based on BMI 18.5-24.9)
export const calculateIdealWeightRange = (heightCm) => {
  if (!heightCm || heightCm <= 0) return null;

  const heightM = heightCm / 100;
  const minWeight = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxWeight = Math.round(24.9 * heightM * heightM * 10) / 10;

  return {
    min: minWeight,
    max: maxWeight,
  };
};

// Calculate BMI from imperial units (feet, inches, pounds)
export const calculateBMIFromImperial = (feet, inches, pounds) => {
  const totalInches = feet * 12 + inches;
  const heightM = totalInches * 0.0254;
  const weightKg = pounds * 0.453592;
  
  return calculateBMI(heightM * 100, weightKg);
};

// Convert height between cm and feet/inches
export const convertHeight = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;

  if (fromUnit === 'cm' && toUnit === 'ft') {
    const totalInches = value / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  }

  if (fromUnit === 'ft' && toUnit === 'cm') {
    const { feet, inches } = value;
    const totalInches = feet * 12 + inches;
    return Math.round(totalInches * 2.54 * 10) / 10;
  }

  return value;
};

// Convert weight between kg and lbs
export const convertWeight = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;

  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return Math.round(value * 2.20462 * 10) / 10;
  }

  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return Math.round(value * 0.453592 * 10) / 10;
  }

  return value;
};

// Calculate body fat percentage (rough estimate using BMI and age/gender)
export const estimateBodyFat = (bmi, age, gender) => {
  if (!bmi || !age || !gender) return null;

  // Rough estimate using BMI-based formula
  // Men: (1.20 * BMI) + (0.23 * Age) - 16.2
  // Women: (1.20 * BMI) + (0.23 * Age) - 5.4
  const base = 1.20 * bmi + 0.23 * age;
  
  if (gender === 'Male') {
    return Math.round((base - 16.2) * 10) / 10;
  } else {
    return Math.round((base - 5.4) * 10) / 10;
  }
};

// Get health risk based on BMI and waist circumference (if available)
export const getHealthRisk = (bmi, waistCm = null, gender = null) => {
  const category = getBMICategory(bmi);
  
  if (!waistCm || !gender) {
    return {
      ...category,
      riskFactors: ['Based on BMI only'],
    };
  }

  // Add waist circumference risk
  const waistRisk = gender === 'Male'
    ? waistCm > 102 ? 'High' : waistCm > 94 ? 'Moderate' : 'Low'
    : waistCm > 88 ? 'High' : waistCm > 80 ? 'Moderate' : 'Low';

  return {
    ...category,
    waistRisk,
    riskFactors: [
      category.risk !== 'Low' ? `${category.label} BMI` : null,
      waistRisk !== 'Low' ? 'Elevated waist circumference' : null,
    ].filter(Boolean),
  };
};