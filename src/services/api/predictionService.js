import apiClient from './apiClient';

class PredictionService {
  async getDiseasePredictions() {
    return apiClient.get('/predictions/diseases');
  }

  async getPersonalizedRisks() {
    return apiClient.get('/predictions/risks');
  }

  async getHealthTrends() {
    return apiClient.get('/predictions/trends');
  }

  async predictDiseaseRisk(disease, data) {
    return apiClient.post(`/predictions/disease/${disease}`, data);
  }

  async getLifestyleRecommendations() {
    return apiClient.get('/predictions/recommendations');
  }

  async getPreventionStrategies() {
    return apiClient.get('/predictions/prevention');
  }

  async getDoshaPrediction() {
    return apiClient.get('/predictions/dosha');
  }

  async getSleepQualityPrediction() {
    return apiClient.get('/predictions/sleep');
  }

  async getStressLevelPrediction() {
    return apiClient.get('/predictions/stress');
  }

  async getActivityPrediction() {
    return apiClient.get('/predictions/activity');
  }

  async getHeartHealthPrediction() {
    return apiClient.get('/predictions/heart');
  }

  async getDiabetesRisk() {
    return apiClient.get('/predictions/diabetes');
  }

  async getHypertensionRisk() {
    return apiClient.get('/predictions/hypertension');
  }

  async getObesityRisk() {
    return apiClient.get('/predictions/obesity');
  }

  async getMentalHealthRisk() {
    return apiClient.get('/predictions/mental-health');
  }

  async getRespiratoryRisk() {
    return apiClient.get('/predictions/respiratory');
  }

  async getArthritisRisk() {
    return apiClient.get('/predictions/arthritis');
  }

  async getDigestiveRisk() {
    return apiClient.get('/predictions/digestive');
  }

  async getCardiovascularRisk() {
    return apiClient.get('/predictions/cardiovascular');
  }

  async getInfectionRisk() {
    return apiClient.get('/predictions/infection');
  }

  async getSeasonalRisks() {
    return apiClient.get('/predictions/seasonal');
  }

  async getRiskFactors() {
    return apiClient.get('/predictions/factors');
  }

  async getPreventiveMeasures() {
    return apiClient.get('/predictions/preventive');
  }

  async getLifestyleImpact() {
    return apiClient.get('/predictions/lifestyle-impact');
  }

  async getGeneticRisks() {
    return apiClient.get('/predictions/genetic');
  }

  async getEnvironmentalRisks() {
    return apiClient.get('/predictions/environmental');
  }
}

export default new PredictionService();