import apiClient from './apiClient';

class UserService {
  async getProfile() {
    return apiClient.get('/user/profile');
  }

  async updateProfile(profileData) {
    return apiClient.put('/user/profile', profileData);
  }

  async updateAvatar(file) {
    return apiClient.upload('/user/avatar', file);
  }

  async getSettings() {
    return apiClient.get('/user/settings');
  }

  async updateSettings(settings) {
    return apiClient.put('/user/settings', settings);
  }

  async getNotifications() {
    return apiClient.get('/user/notifications');
  }

  async markNotificationRead(notificationId) {
    return apiClient.post(`/user/notifications/${notificationId}/read`);
  }

  async markAllNotificationsRead() {
    return apiClient.post('/user/notifications/read-all');
  }

  async deleteNotification(notificationId) {
    return apiClient.delete(`/user/notifications/${notificationId}`);
  }

  async getHealthProfile() {
    return apiClient.get('/user/health-profile');
  }

  async updateHealthProfile(profileData) {
    return apiClient.put('/user/health-profile', profileData);
  }

  async getFamilyHistory() {
    return apiClient.get('/user/family-history');
  }

  async updateFamilyHistory(historyData) {
    return apiClient.put('/user/family-history', historyData);
  }

  async getLifestyle() {
    return apiClient.get('/user/lifestyle');
  }

  async updateLifestyle(lifestyleData) {
    return apiClient.put('/user/lifestyle', lifestyleData);
  }

  async getPrakriti() {
    return apiClient.get('/user/prakriti');
  }

  async updatePrakriti(prakritiData) {
    return apiClient.put('/user/prakriti', prakritiData);
  }

  async deleteAccount() {
    return apiClient.delete('/user/account');
  }

  async exportData() {
    return apiClient.get('/user/export-data');
  }

  async getPrivacySettings() {
    return apiClient.get('/user/privacy');
  }

  async updatePrivacySettings(settings) {
    return apiClient.put('/user/privacy', settings);
  }

  async getConnectedDevices() {
    return apiClient.get('/user/devices');
  }

  async disconnectDevice(deviceId) {
    return apiClient.delete(`/user/devices/${deviceId}`);
  }

  async getActivityLogs() {
    return apiClient.get('/user/activity-logs');
  }

  async getLoginHistory() {
    return apiClient.get('/user/login-history');
  }
}

export default new UserService();