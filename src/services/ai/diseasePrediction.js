import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class DiseasePredictionService {
  constructor() {
    this.model = null;
    this.modelLoaded = false;
    this.modelPath = 'https://models.ayurtwin.com/disease-prediction/model.json';
    this.labels = [
      'diabetes',
      'hypertension',
      'stress_anxiety',
      'sleep_disorder',
      'asthma',
      'arthritis',
      'obesity',
      'digestive_disorder',
      'heart_disease',
      'fever_infection',
    ];
    this.featureNames = [
      'age',
      'gender',
      'bmi',
      'heart_rate',
      'spo2',
      'temperature',
      'stress_level',
      'sleep_duration',
      'activity_level',
      'family_history_diabetes',
      'family_history_heart',
      'family_history_hypertension',
      'family_history_asthma',
      'family_history_arthritis',
      'smoking',
      'alcohol',
      'exercise_frequency',
      'diet_type',
      'water_intake',
      'junk_food_frequency',
    ];
  }

  async loadModel() {
    try {
      // Try to load from local storage first
      const localModel = await this.loadLocalModel();
      if (localModel) {
        this.model = localModel;
        this.modelLoaded = true;
        console.log('Model loaded from local storage');
        return;
      }

      // Load from remote
      this.model = await tf.loadLayersModel(this.modelPath);
      this.modelLoaded = true;
      
      // Save locally for future use
      await this.saveModelLocally();
      
      console.log('Model loaded from remote');
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }

  async loadLocalModel() {
    try {
      const modelJSON = await AsyncStorage.getItem('@model:json');
      const modelWeights = await AsyncStorage.getItem('@model:weights');
      
      if (modelJSON && modelWeights) {
        return await tf.loadLayersModel(
          bundleResourceIO(
            JSON.parse(modelJSON),
            [JSON.parse(modelWeights)]
          )
        );
      }
      return null;
    } catch (error) {
      console.error('Error loading local model:', error);
      return null;
    }
  }

  async saveModelLocally() {
    try {
      const modelJSON = this.model.toJSON();
      const modelWeights = await this.model.getWeights();
      
      await AsyncStorage.setItem('@model:json', JSON.stringify(modelJSON));
      await AsyncStorage.setItem('@model:weights', JSON.stringify(modelWeights));
    } catch (error) {
      console.error('Error saving model locally:', error);
    }
  }

  preprocessFeatures(userData) {
    // Normalize features
    const features = [];
    
    // Age (normalize to 0-1, assuming max age 100)
    features.push((userData.age || 30) / 100);
    
    // Gender (one-hot encode)
    features.push(userData.gender === 'male' ? 1 : 0);
    features.push(userData.gender === 'female' ? 1 : 0);
    
    // BMI (normalize to 0-1, assuming max BMI 60)
    features.push((userData.bmi || 22) / 60);
    
    // Heart rate (normalize to 0-1, assuming range 40-180)
    features.push(((userData.heartRate || 72) - 40) / 140);
    
    // SpO2 (normalize to 0-1, assuming range 70-100)
    features.push(((userData.spo2 || 98) - 70) / 30);
    
    // Temperature (normalize to 0-1, assuming range 35-40)
    features.push(((userData.temperature || 36.6) - 35) / 5);
    
    // Stress level (normalize to 0-1)
    features.push((userData.stressLevel || 50) / 100);
    
    // Sleep duration (normalize to 0-1, assuming max 12 hours)
    features.push((userData.sleepDuration || 7) / 12);
    
    // Activity level (categorical: 0=sedentary, 1=light, 2=moderate, 3=active, 4=very active)
    const activityMap = { sedentary: 0, light: 0.25, moderate: 0.5, active: 0.75, veryActive: 1 };
    features.push(activityMap[userData.activityLevel] || 0.5);
    
    // Family history (binary)
    features.push(userData.familyHistory?.diabetes ? 1 : 0);
    features.push(userData.familyHistory?.heartDisease ? 1 : 0);
    features.push(userData.familyHistory?.hypertension ? 1 : 0);
    features.push(userData.familyHistory?.asthma ? 1 : 0);
    features.push(userData.familyHistory?.arthritis ? 1 : 0);
    
    // Lifestyle factors
    features.push(userData.smoking ? 1 : 0);
    features.push(userData.alcohol ? 1 : 0);
    
    // Exercise frequency (normalize to 0-1, assuming max 7 days/week)
    features.push((userData.exerciseFrequency || 3) / 7);
    
    // Diet type (categorical)
    const dietMap = { vegetarian: 0.25, vegan: 0, nonVegetarian: 0.75, mixed: 0.5 };
    features.push(dietMap[userData.dietType] || 0.5);
    
    // Water intake (normalize to 0-1, assuming max 4L)
    features.push((userData.waterIntake || 2) / 4);
    
    // Junk food frequency (normalize to 0-1, assuming max 7 times/week)
    features.push((userData.junkFoodFrequency || 2) / 7);

    return tf.tensor2d([features]);
  }

  async predictDiseaseRisks(userData) {
    if (!this.modelLoaded) {
      await this.loadModel();
    }

    try {
      const features = this.preprocessFeatures(userData);
      const predictions = this.model.predict(features);
      const probabilities = await predictions.data();

      const risks = this.labels.map((disease, index) => ({
        name: this.formatDiseaseName(disease),
        risk: Math.round(probabilities[index] * 100),
        level: this.getRiskLevel(probabilities[index]),
        probability: probabilities[index],
      }));

      // Sort by risk level (highest first)
      return risks.sort((a, b) => b.risk - a.risk);
    } catch (error) {
      console.error('Error making predictions:', error);
      throw error;
    }
  }

  async predictSingleDisease(userData, diseaseName) {
    const risks = await this.predictDiseaseRisks(userData);
    return risks.find(r => r.name.toLowerCase().includes(diseaseName.toLowerCase()));
  }

  getRiskLevel(probability) {
    if (probability >= 0.7) return 'high';
    if (probability >= 0.4) return 'medium';
    if (probability >= 0.2) return 'low';
    return 'very low';
  }

  formatDiseaseName(disease) {
    const names = {
      diabetes: 'Diabetes',
      hypertension: 'Hypertension',
      stress_anxiety: 'Stress/Anxiety',
      sleep_disorder: 'Sleep Disorder',
      asthma: 'Asthma',
      arthritis: 'Arthritis',
      obesity: 'Obesity',
      digestive_disorder: 'Digestive Disorder',
      heart_disease: 'Heart Disease',
      fever_infection: 'Fever/Infection',
    };
    return names[disease] || disease;
  }

  getRiskFactors(userData, disease) {
    const factors = [];

    switch(disease) {
      case 'diabetes':
        if (userData.bmi > 25) factors.push('High BMI');
        if (userData.familyHistory?.diabetes) factors.push('Family history');
        if (userData.age > 45) factors.push('Age > 45');
        if (userData.junkFoodFrequency > 3) factors.push('High junk food intake');
        if (userData.activityLevel === 'sedentary') factors.push('Sedentary lifestyle');
        break;

      case 'hypertension':
        if (userData.stressLevel > 70) factors.push('High stress');
        if (userData.bmi > 25) factors.push('High BMI');
        if (userData.familyHistory?.hypertension) factors.push('Family history');
        if (userData.smoking) factors.push('Smoking');
        if (userData.alcohol) factors.push('Alcohol consumption');
        break;

      case 'heart_disease':
        if (userData.bmi > 25) factors.push('High BMI');
        if (userData.smoking) factors.push('Smoking');
        if (userData.familyHistory?.heartDisease) factors.push('Family history');
        if (userData.stressLevel > 70) factors.push('High stress');
        if (userData.activityLevel === 'sedentary') factors.push('Sedentary lifestyle');
        break;

      default:
        // Generic factors
        if (userData.age > 50) factors.push('Age > 50');
        if (userData.bmi > 25) factors.push('High BMI');
        if (userData.smoking) factors.push('Smoking');
        if (userData.alcohol) factors.push('Alcohol consumption');
        if (userData.stressLevel > 70) factors.push('High stress');
        break;
    }

    return factors;
  }

  getRecommendations(userData, disease) {
    const recommendations = [];

    switch(disease) {
      case 'diabetes':
        recommendations.push('Monitor blood sugar regularly');
        recommendations.push('Maintain a balanced diet low in sugar');
        recommendations.push('Exercise at least 30 minutes daily');
        recommendations.push('Maintain healthy weight');
        break;

      case 'hypertension':
        recommendations.push('Reduce salt intake');
        recommendations.push('Monitor blood pressure regularly');
        recommendations.push('Practice stress management techniques');
        recommendations.push('Limit alcohol consumption');
        break;

      case 'stress_anxiety':
        recommendations.push('Practice daily meditation');
        recommendations.push('Ensure adequate sleep (7-9 hours)');
        recommendations.push('Take regular breaks during work');
        recommendations.push('Consider counseling if symptoms persist');
        break;

      default:
        recommendations.push('Maintain regular health check-ups');
        recommendations.push('Follow a balanced diet');
        recommendations.push('Stay physically active');
        recommendations.push('Get adequate sleep');
        break;
    }

    return recommendations;
  }

  async getPersonalizedHealthScore(userData) {
    const risks = await this.predictDiseaseRisks(userData);
    
    // Calculate health score (100 - average risk)
    const avgRisk = risks.reduce((sum, r) => sum + r.risk, 0) / risks.length;
    const healthScore = Math.max(0, 100 - avgRisk);

    // Get top risk factors
    const topRisks = risks.slice(0, 3);

    return {
      score: Math.round(healthScore),
      topRisks,
      overallHealth: this.getHealthLevel(healthScore),
      timestamp: new Date().toISOString(),
    };
  }

  getHealthLevel(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  // Rule-based fallback predictions (when ML model fails)
  getFallbackPredictions(userData) {
    const risks = [];

    // Diabetes risk
    let diabetesRisk = 10;
    if (userData.bmi > 25) diabetesRisk += 15;
    if (userData.familyHistory?.diabetes) diabetesRisk += 20;
    if (userData.age > 45) diabetesRisk += 10;
    if (userData.junkFoodFrequency > 3) diabetesRisk += 10;
    risks.push({
      name: 'Diabetes',
      risk: Math.min(95, diabetesRisk),
      level: this.getRiskLevel(diabetesRisk / 100),
    });

    // Hypertension risk
    let hypertensionRisk = 10;
    if (userData.bmi > 25) hypertensionRisk += 15;
    if (userData.familyHistory?.hypertension) hypertensionRisk += 20;
    if (userData.stressLevel > 70) hypertensionRisk += 15;
    if (userData.smoking) hypertensionRisk += 10;
    risks.push({
      name: 'Hypertension',
      risk: Math.min(95, hypertensionRisk),
      level: this.getRiskLevel(hypertensionRisk / 100),
    });

    // Stress/Anxiety risk
    let stressRisk = 15;
    if (userData.stressLevel > 70) stressRisk += 25;
    if (userData.sleepDuration < 6) stressRisk += 15;
    if (userData.workType === 'stressful') stressRisk += 15;
    risks.push({
      name: 'Stress/Anxiety',
      risk: Math.min(95, stressRisk),
      level: this.getRiskLevel(stressRisk / 100),
    });

    return risks.sort((a, b) => b.risk - a.risk);
  }
}

export default new DiseasePredictionService();