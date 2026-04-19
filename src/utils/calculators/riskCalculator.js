/**
 * Health risk calculation utilities
 */

/**
 * Calculate cardiovascular risk
 * @param {Object} data - User health data
 * @returns {Object} Cardiovascular risk assessment
 */
export const calculateCardiovascularRisk = (data) => {
  let risk = 0;
  const factors = [];

  // Age factor
  if (data.age > 45) {
    risk += 10;
    factors.push({ factor: 'Age > 45', points: 10 });
  }
  if (data.age > 55) {
    risk += 5;
    factors.push({ factor: 'Age > 55', points: 5 });
  }

  // Blood pressure
  if (data.systolicBP) {
    if (data.systolicBP > 140) {
      risk += 15;
      factors.push({ factor: 'High systolic BP', points: 15 });
    } else if (data.systolicBP > 130) {
      risk += 10;
      factors.push({ factor: 'Elevated systolic BP', points: 10 });
    }
  }

  // Cholesterol
  if (data.cholesterol) {
    if (data.cholesterol > 240) {
      risk += 15;
      factors.push({ factor: 'High cholesterol', points: 15 });
    } else if (data.cholesterol > 200) {
      risk += 10;
      factors.push({ factor: 'Borderline cholesterol', points: 10 });
    }
  }

  // Smoking
  if (data.smoking) {
    risk += 15;
    factors.push({ factor: 'Smoking', points: 15 });
  }

  // Diabetes
  if (data.diabetes) {
    risk += 15;
    factors.push({ factor: 'Diabetes', points: 15 });
  }

  // BMI
  if (data.bmi) {
    if (data.bmi > 30) {
      risk += 15;
      factors.push({ factor: 'Obese (BMI > 30)', points: 15 });
    } else if (data.bmi > 25) {
      risk += 10;
      factors.push({ factor: 'Overweight (BMI 25-30)', points: 10 });
    }
  }

  // Family history
  if (data.familyHistory?.heartDisease) {
    risk += 10;
    factors.push({ factor: 'Family history of heart disease', points: 10 });
  }

  // Physical activity
  if (data.activityLevel === 'sedentary') {
    risk += 10;
    factors.push({ factor: 'Sedentary lifestyle', points: 10 });
  }

  // Stress
  if (data.stressLevel > 70) {
    risk += 10;
    factors.push({ factor: 'High stress', points: 10 });
  }

  // Determine risk level
  let level;
  let color;
  let recommendation;

  if (risk >= 50) {
    level = 'High Risk';
    color = '#FF5A5F';
    recommendation = 'Consult a cardiologist immediately. Consider lifestyle changes and medication.';
  } else if (risk >= 30) {
    level = 'Moderate Risk';
    color = '#FFB347';
    recommendation = 'Monitor regularly. Improve diet, exercise, and stress management.';
  } else if (risk >= 15) {
    level = 'Low Risk';
    color = '#4A90E2';
    recommendation = 'Maintain healthy habits. Regular check-ups recommended.';
  } else {
    level = 'Very Low Risk';
    color = '#4CAF50';
    recommendation = 'Excellent! Keep up your healthy lifestyle.';
  }

  return {
    risk: Math.min(risk, 100),
    level,
    color,
    recommendation,
    factors,
  };
};

/**
 * Calculate diabetes risk
 * @param {Object} data - User health data
 * @returns {Object} Diabetes risk assessment
 */
export const calculateDiabetesRisk = (data) => {
  let risk = 0;
  const factors = [];

  // Age factor
  if (data.age > 45) {
    risk += 10;
    factors.push({ factor: 'Age > 45', points: 10 });
  }

  // BMI
  if (data.bmi) {
    if (data.bmi > 30) {
      risk += 20;
      factors.push({ factor: 'Obese (BMI > 30)', points: 20 });
    } else if (data.bmi > 25) {
      risk += 15;
      factors.push({ factor: 'Overweight (BMI 25-30)', points: 15 });
    }
  }

  // Family history
  if (data.familyHistory?.diabetes) {
    risk += 15;
    factors.push({ factor: 'Family history of diabetes', points: 15 });
  }

  // Gestational diabetes
  if (data.gestationalDiabetes) {
    risk += 10;
    factors.push({ factor: 'History of gestational diabetes', points: 10 });
  }

  // Physical activity
  if (data.activityLevel === 'sedentary') {
    risk += 10;
    factors.push({ factor: 'Sedentary lifestyle', points: 10 });
  }

  // Diet
  if (data.junkFoodFrequency > 5) {
    risk += 15;
    factors.push({ factor: 'High junk food consumption', points: 15 });
  } else if (data.junkFoodFrequency > 3) {
    risk += 10;
    factors.push({ factor: 'Moderate junk food consumption', points: 10 });
  }

  // Blood pressure
  if (data.systolicBP > 140) {
    risk += 10;
    factors.push({ factor: 'High blood pressure', points: 10 });
  }

  // Determine risk level
  let level;
  let color;
  let recommendation;

  if (risk >= 50) {
    level = 'High Risk';
    color = '#FF5A5F';
    recommendation = 'Consult a doctor for diabetes screening. Consider lifestyle changes immediately.';
  } else if (risk >= 30) {
    level = 'Moderate Risk';
    color = '#FFB347';
    recommendation = 'Monitor blood sugar. Improve diet and increase physical activity.';
  } else if (risk >= 15) {
    level = 'Low Risk';
    color = '#4A90E2';
    recommendation = 'Maintain healthy diet and regular exercise.';
  } else {
    level = 'Very Low Risk';
    color = '#4CAF50';
    recommendation = 'Excellent! Keep up your healthy habits.';
  }

  return {
    risk: Math.min(risk, 100),
    level,
    color,
    recommendation,
    factors,
  };
};

/**
 * Calculate hypertension risk
 * @param {Object} data - User health data
 * @returns {Object} Hypertension risk assessment
 */
export const calculateHypertensionRisk = (data) => {
  let risk = 0;
  const factors = [];

  // Age factor
  if (data.age > 40) {
    risk += 10;
    factors.push({ factor: 'Age > 40', points: 10 });
  }
  if (data.age > 60) {
    risk += 10;
    factors.push({ factor: 'Age > 60', points: 10 });
  }

  // Family history
  if (data.familyHistory?.hypertension) {
    risk += 15;
    factors.push({ factor: 'Family history of hypertension', points: 15 });
  }

  // BMI
  if (data.bmi > 30) {
    risk += 15;
    factors.push({ factor: 'Obese (BMI > 30)', points: 15 });
  } else if (data.bmi > 25) {
    risk += 10;
    factors.push({ factor: 'Overweight (BMI 25-30)', points: 10 });
  }

  // Sodium intake
  if (data.sodiumIntake > 2300) {
    risk += 15;
    factors.push({ factor: 'High sodium intake', points: 15 });
  }

  // Physical activity
  if (data.activityLevel === 'sedentary') {
    risk += 10;
    factors.push({ factor: 'Sedentary lifestyle', points: 10 });
  }

  // Smoking
  if (data.smoking) {
    risk += 10;
    factors.push({ factor: 'Smoking', points: 10 });
  }

  // Alcohol
  if (data.alcohol > 2) {
    risk += 10;
    factors.push({ factor: 'Excessive alcohol consumption', points: 10 });
  }

  // Stress
  if (data.stressLevel > 70) {
    risk += 10;
    factors.push({ factor: 'High stress', points: 10 });
  }

  // Determine risk level
  let level;
  let color;
  let recommendation;

  if (risk >= 50) {
    level = 'High Risk';
    color = '#FF5A5F';
    recommendation = 'Consult a doctor. Monitor blood pressure regularly. Reduce sodium intake.';
  } else if (risk >= 30) {
    level = 'Moderate Risk';
    color = '#FFB347';
    recommendation = 'Monitor blood pressure. Improve diet and exercise routine.';
  } else if (risk >= 15) {
    level = 'Low Risk';
    color = '#4A90E2';
    recommendation = 'Maintain healthy lifestyle. Regular blood pressure checks.';
  } else {
    level = 'Very Low Risk';
    color = '#4CAF50';
    recommendation = 'Excellent! Keep up your healthy habits.';
  }

  return {
    risk: Math.min(risk, 100),
    level,
    color,
    recommendation,
    factors,
  };
};

/**
 * Calculate stroke risk
 * @param {Object} data - User health data
 * @returns {Object} Stroke risk assessment
 */
export const calculateStrokeRisk = (data) => {
  let risk = 0;
  const factors = [];

  // Combine cardiovascular and hypertension risks
  const cvRisk = calculateCardiovascularRisk(data);
  const htnRisk = calculateHypertensionRisk(data);

  risk = (cvRisk.risk + htnRisk.risk) / 2;

  // Additional stroke-specific factors
  if (data.atrialFibrillation) {
    risk += 15;
    factors.push({ factor: 'Atrial fibrillation', points: 15 });
  }

  if (data.previousStroke) {
    risk += 25;
    factors.push({ factor: 'Previous stroke', points: 25 });
  }

  if (data.tia) {
    risk += 20;
    factors.push({ factor: 'Transient ischemic attack', points: 20 });
  }

  // Determine risk level
  let level;
  let color;
  let recommendation;

  if (risk >= 50) {
    level = 'High Risk';
    color = '#FF5A5F';
    recommendation = 'Immediate medical consultation recommended. Take preventive medications as prescribed.';
  } else if (risk >= 30) {
    level = 'Moderate Risk';
    color = '#FFB347';
    recommendation = 'Monitor risk factors. Maintain healthy lifestyle. Regular check-ups.';
  } else if (risk >= 15) {
    level = 'Low Risk';
    color = '#4A90E2';
    recommendation = 'Maintain healthy habits. Regular blood pressure checks.';
  } else {
    level = 'Very Low Risk';
    color = '#4CAF50';
    recommendation = 'Excellent! Keep up your healthy lifestyle.';
  }

  return {
    risk: Math.min(risk, 100),
    level,
    color,
    recommendation,
    factors: [...factors, ...cvRisk.factors, ...htnRisk.factors],
  };
};

/**
 * Calculate metabolic syndrome risk
 * @param {Object} data - User health data
 * @returns {Object} Metabolic syndrome assessment
 */
export const calculateMetabolicSyndromeRisk = (data) => {
  const criteria = [];
  let criteriaMet = 0;

  // Waist circumference
  if (data.waistCircumference) {
    const threshold = data.gender === 'male' ? 102 : 88;
    if (data.waistCircumference > threshold) {
      criteriaMet++;
      criteria.push({ 
        criteria: 'Increased waist circumference',
        value: data.waistCircumference,
        threshold,
      });
    }
  }

  // Triglycerides
  if (data.triglycerides > 150) {
    criteriaMet++;
    criteria.push({ 
      criteria: 'High triglycerides',
      value: data.triglycerides,
      threshold: 150,
    });
  }

  // HDL cholesterol
  const hdlThreshold = data.gender === 'male' ? 40 : 50;
  if (data.hdl < hdlThreshold) {
    criteriaMet++;
    criteria.push({ 
      criteria: 'Low HDL cholesterol',
      value: data.hdl,
      threshold: hdlThreshold,
    });
  }

  // Blood pressure
  if (data.systolicBP > 130 || data.diastolicBP > 85) {
    criteriaMet++;
    criteria.push({ 
      criteria: 'Elevated blood pressure',
      systolic: data.systolicBP,
      diastolic: data.diastolicBP,
    });
  }

  // Fasting glucose
  if (data.fastingGlucose > 100) {
    criteriaMet++;
    criteria.push({ 
      criteria: 'Elevated fasting glucose',
      value: data.fastingGlucose,
      threshold: 100,
    });
  }

  const hasMetabolicSyndrome = criteriaMet >= 3;

  return {
    hasMetabolicSyndrome,
    criteriaMet,
    totalCriteria: 5,
    criteria,
    risk: (criteriaMet / 5) * 100,
    recommendation: hasMetabolicSyndrome
      ? 'You meet the criteria for metabolic syndrome. Consult a doctor for comprehensive management.'
      : 'Continue maintaining healthy lifestyle to prevent metabolic syndrome.',
  };
};

/**
 * Calculate overall health risk score
 * @param {Object} data - User health data
 * @returns {Object} Overall health risk assessment
 */
export const calculateOverallHealthRisk = (data) => {
  const risks = {
    cardiovascular: calculateCardiovascularRisk(data),
    diabetes: calculateDiabetesRisk(data),
    hypertension: calculateHypertensionRisk(data),
    stroke: calculateStrokeRisk(data),
    metabolic: calculateMetabolicSyndromeRisk(data),
  };

  const averageRisk = Object.values(risks).reduce((sum, r) => {
    return sum + (r.risk || 0);
  }, 0) / 4; // Exclude metabolic as it's different scale

  let overallLevel;
  let overallColor;
  let overallRecommendation;

  if (averageRisk >= 50) {
    overallLevel = 'High Risk';
    overallColor = '#FF5A5F';
    overallRecommendation = 'High overall health risk. Comprehensive medical evaluation recommended.';
  } else if (averageRisk >= 30) {
    overallLevel = 'Moderate Risk';
    overallColor = '#FFB347';
    overallRecommendation = 'Moderate health risk. Focus on improving lifestyle factors.';
  } else if (averageRisk >= 15) {
    overallLevel = 'Low Risk';
    overallColor = '#4A90E2';
    overallRecommendation = 'Low health risk. Maintain healthy habits.';
  } else {
    overallLevel = 'Very Low Risk';
    overallColor = '#4CAF50';
    overallRecommendation = 'Excellent overall health! Keep up your healthy lifestyle.';
  }

  return {
    overallRisk: Math.round(averageRisk),
    overallLevel,
    overallColor,
    overallRecommendation,
    risks,
    timestamp: new Date().toISOString(),
  };
};

export default {
  calculateCardiovascularRisk,
  calculateDiabetesRisk,
  calculateHypertensionRisk,
  calculateStrokeRisk,
  calculateMetabolicSyndromeRisk,
  calculateOverallHealthRisk,
};