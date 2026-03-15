import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import apiClient from '../api/apiClient';
import storageService from '../storage/asyncStorage';

class OfflineQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 seconds
    this.listeners = new Map();
    this.persistKey = '@offline:queue';
  }

  async initialize() {
    await this.loadQueue();
    this.setupNetworkListener();
    this.startProcessing();
  }

  async loadQueue() {
    try {
      const saved = await AsyncStorage.getItem(this.persistKey);
      if (saved) {
        this.queue = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }

  async saveQueue() {
    try {
      await AsyncStorage.setItem(this.persistKey, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }

  setupNetworkListener() {
    NetInfo.addEventListener(state => {
      if (state.isConnected && this.queue.length > 0) {
        this.processQueue();
      }
    });
  }

  async enqueue(action) {
    const queueItem = {
      id: this.generateId(),
      type: action.type,
      payload: action.payload,
      endpoint: action.endpoint,
      method: action.method || 'POST',
      timestamp: Date.now(),
      retryCount: 0,
      priority: action.priority || 'normal',
      dependencies: action.dependencies || [],
    };

    // Check for dependencies
    if (queueItem.dependencies.length > 0) {
      const hasDependencies = queueItem.dependencies.every(depId =>
        this.queue.some(item => item.id === depId && item.completed)
      );
      
      if (!hasDependencies) {
        queueItem.status = 'blocked';
      }
    }

    queueItem.status = 'pending';
    this.queue.push(queueItem);
    await this.saveQueue();

    this.emit('enqueued', queueItem);

    // Try to process immediately if online
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      this.processQueue();
    }

    return queueItem.id;
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) return;

    this.processing = true;
    this.emit('processing_start', { count: this.queue.length });

    // Sort by priority
    const sorted = [...this.queue].sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    for (const item of sorted) {
      if (item.status === 'completed' || item.status === 'failed') continue;
      if (item.status === 'blocked') continue;

      try {
        await this.processItem(item);
        item.status = 'completed';
        item.completedAt = Date.now();
        this.emit('item_completed', item);
      } catch (error) {
        item.retryCount++;
        item.lastError = error.message;

        if (item.retryCount >= this.maxRetries) {
          item.status = 'failed';
          this.emit('item_failed', { item, error });
        } else {
          item.status = 'pending';
          // Schedule retry
          setTimeout(() => {
            this.processQueue();
          }, this.retryDelay * item.retryCount);
        }
      }

      // Update dependent items
      this.updateDependencies(item.id);
    }

    // Clean up completed items
    this.queue = this.queue.filter(item => item.status !== 'completed');
    await this.saveQueue();

    this.processing = false;
    this.emit('processing_complete', { remaining: this.queue.length });

    // Process again if there are more items
    if (this.queue.length > 0) {
      this.processQueue();
    }
  }

  async processItem(item) {
    item.status = 'processing';
    this.emit('item_processing', item);

    let response;
    switch (item.method) {
      case 'GET':
        response = await apiClient.get(item.endpoint, item.payload);
        break;
      case 'POST':
        response = await apiClient.post(item.endpoint, item.payload);
        break;
      case 'PUT':
        response = await apiClient.put(item.endpoint, item.payload);
        break;
      case 'PATCH':
        response = await apiClient.patch(item.endpoint, item.payload);
        break;
      case 'DELETE':
        response = await apiClient.delete(item.endpoint);
        break;
      default:
        response = await apiClient.post(item.endpoint, item.payload);
    }

    return response;
  }

  updateDependencies(completedId) {
    this.queue.forEach(item => {
      if (item.dependencies.includes(completedId)) {
        const allDepsCompleted = item.dependencies.every(depId =>
          this.queue.some(i => i.id === depId && i.status === 'completed')
        );
        
        if (allDepsCompleted) {
          item.status = 'pending';
        }
      }
    });
  }

  async clearQueue() {
    this.queue = [];
    await this.saveQueue();
    this.emit('queue_cleared');
  }

  async retryFailed() {
    this.queue.forEach(item => {
      if (item.status === 'failed') {
        item.status = 'pending';
        item.retryCount = 0;
      }
    });
    await this.saveQueue();
    this.processQueue();
  }

  getQueueStatus() {
    return {
      total: this.queue.length,
      pending: this.queue.filter(i => i.status === 'pending').length,
      processing: this.queue.filter(i => i.status === 'processing').length,
      completed: this.queue.filter(i => i.status === 'completed').length,
      failed: this.queue.filter(i => i.status === 'failed').length,
      blocked: this.queue.filter(i => i.status === 'blocked').length,
      byPriority: {
        high: this.queue.filter(i => i.priority === 'high').length,
        normal: this.queue.filter(i => i.priority === 'normal').length,
        low: this.queue.filter(i => i.priority === 'low').length,
      },
    };
  }

  generateId() {
    return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Event handling
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event).filter(cb => cb !== callback);
      this.listeners.set(event, listeners);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Helper methods for common actions
  async queueHealthReading(reading) {
    return this.enqueue({
      type: 'health_reading',
      endpoint: '/health/readings',
      method: 'POST',
      payload: reading,
      priority: 'normal',
    });
  }

  async queueAlertAcknowledge(alertId) {
    return this.enqueue({
      type: 'alert_acknowledge',
      endpoint: `/alerts/${alertId}/acknowledge`,
      method: 'POST',
      payload: { alertId },
      priority: 'high',
    });
  }

  async queueProfileUpdate(profileData) {
    return this.enqueue({
      type: 'profile_update',
      endpoint: '/user/profile',
      method: 'PUT',
      payload: profileData,
      priority: 'normal',
    });
  }

  async queueSettingsUpdate(settings) {
    return this.enqueue({
      type: 'settings_update',
      endpoint: '/user/settings',
      method: 'PUT',
      payload: settings,
      priority: 'normal',
    });
  }

  async queueGoalUpdate(goalId, updates) {
    return this.enqueue({
      type: 'goal_update',
      endpoint: `/goals/${goalId}`,
      method: 'PUT',
      payload: updates,
      priority: 'low',
    });
  }

  async queueBatch(actions) {
    const ids = [];
    for (const action of actions) {
      const id = await this.enqueue(action);
      ids.push(id);
    }
    return ids;
  }
}

export default new OfflineQueue();