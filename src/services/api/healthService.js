import apiClient from './apiClient';

class HealthService {
  async getCurrentReadings() {
    return apiClient.get('/health/current');
  }

  async getHistoricalData(type, period) {
    return apiClient.get('/health/historical', {
      params: { type, period },
    });
  }

  async getHeartRateData(range = 'day') {
    return apiClient.get('/health/heart-rate', { params: { range } });
  }

  async getSpO2Data(range = 'day') {
    return apiClient.get('/health/spo2', { params: { range } });
  }

  async getTemperatureData(range = 'day') {
    return apiClient.get('/health/temperature', { params: { range } });
  }

  async getStressData(range = 'day') {
    return apiClient.get('/health/stress', { params: { range } });
  }

  async getSleepData(range = 'week') {
    return apiClient.get('/health/sleep', { params: { range } });
  }

  async getActivityData(range = 'week') {
    return apiClient.get('/health/activity', { params: { range } });
  }

  async getDiseaseRisks() {
    return apiClient.get('/health/risks');
  }

  async getAlerts() {
    return apiClient.get('/health/alerts');
  }

  async resolveAlert(alertId) {
    return apiClient.post(`/health/alerts/${alertId}/resolve`);
  }

  async snoozeAlert(alertId, duration) {
    return apiClient.post(`/health/alerts/${alertId}/snooze`, { duration });
  }

  async getAlertHistory() {
    return apiClient.get('/health/alerts/history');
  }

  async getDailySummary(date) {
    return apiClient.get('/health/daily-summary', { params: { date } });
  }

  async getWeeklySummary() {
    return apiClient.get('/health/weekly-summary');
  }

  async getMonthlySummary() {
    return apiClient.get('/health/monthly-summary');
  }

  async getYearlySummary() {
    return apiClient.get('/health/yearly-summary');
  }

  async getHealthScore() {
    return apiClient.get('/health/score');
  }

  async getDoshaBalance() {
    return apiClient.get('/health/dosha');
  }

  async updateDoshaBalance(doshaData) {
    return apiClient.post('/health/dosha', doshaData);
  }

  async getRecommendations() {
    return apiClient.get('/health/recommendations');
  }

  async getLifestyleTips() {
    return apiClient.get('/health/lifestyle-tips');
  }

  async getDietSuggestions() {
    return apiClient.get('/health/diet-suggestions');
  }

  async getExerciseSuggestions() {
    return apiClient.get('/health/exercise-suggestions');
  }

  async getMeditationGuides() {
    return apiClient.get('/health/meditation');
  }

  async syncDeviceData(deviceData) {
    return apiClient.post('/health/sync', deviceData);
  }

  async exportHealthData(format = 'json', dateRange) {
    return apiClient.get('/health/export', {
      params: { format, ...dateRange },
      responseType: 'blob',
    });
  }
}

export default new HealthService();