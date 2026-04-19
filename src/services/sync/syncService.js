import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import apiClient from '../api/apiClient';
import storageService from '../storage/asyncStorage';
import websocketService from '../sensors/websocketService';
import configService from '../config/configService';

class SyncService {
  constructor() {
    this.isSyncing = false;
    this.syncQueue = [];
    this.lastSyncTime = null;
    this.syncInterval = null;
    this.pendingChanges = new Map();
    this.conflicts = [];
    this.listeners = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    await this.loadSyncQueue();
    this.setupNetworkListener();
    this.startAutoSync();
    
    this.initialized = true;
  }

  setupNetworkListener() {
    NetInfo.addEventListener(state => {
      if (state.isConnected && this.syncQueue.length > 0) {
        this.performSync();
      }
    });
  }

  startAutoSync() {
    const interval = configService.getSyncInterval();
    this.syncInterval = setInterval(() => {
      this.performSync();
    }, interval);
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async loadSyncQueue() {
    try {
      const queue = await AsyncStorage.getItem('@sync:queue');
      if (queue) {
        this.syncQueue = JSON.parse(queue);
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
    }
  }

  async saveSyncQueue() {
    try {
      await AsyncStorage.setItem('@sync:queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  async queueForSync(type, data, options = {}) {
    const syncItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date().toISOString(),
      priority: options.priority || 'normal',
      retryCount: 0,
      maxRetries: options.maxRetries || 3,
      ...options,
    };

    this.syncQueue.push(syncItem);
    await this.saveSyncQueue();

    // Try to sync immediately if high priority and connected
    const netInfo = await NetInfo.fetch();
    if (syncItem.priority === 'high' && netInfo.isConnected) {
      this.performSync();
    }

    return syncItem.id;
  }

  async performSync() {
    if (this.isSyncing || this.syncQueue.length === 0) return;

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      this.emit('sync_error', { error: 'No network connection' });
      return;
    }

    this.isSyncing = true;
    this.emit('sync_start', { count: this.syncQueue.length });

    const successful = [];
    const failed = [];

    for (const item of this.syncQueue) {
      try {
        await this.processSyncItem(item);
        successful.push(item.id);
      } catch (error) {
        console.error('Sync failed for item:', item.id, error);
        item.retryCount++;
        
        if (item.retryCount < item.maxRetries) {
          failed.push(item);
        } else {
          this.handleSyncFailure(item, error);
        }
      }
    }

    // Update queue
    this.syncQueue = failed;
    await this.saveSyncQueue();

    this.lastSyncTime = new Date().toISOString();
    await AsyncStorage.setItem('@sync:lastTime', this.lastSyncTime);

    this.isSyncing = false;
    this.emit('sync_complete', {
      successful: successful.length,
      failed: failed.length,
    });

    // Handle conflicts if any
    if (this.conflicts.length > 0) {
      this.emit('sync_conflicts', this.conflicts);
    }
  }

  async processSyncItem(item) {
    switch (item.type) {
      case 'health_data':
        await this.syncHealthData(item.data);
        break;
      case 'user_profile':
        await this.syncUserProfile(item.data);
        break;
      case 'settings':
        await this.syncSettings(item.data);
        break;
      case 'device_data':
        await this.syncDeviceData(item.data);
        break;
      case 'alerts':
        await this.syncAlerts(item.data);
        break;
      case 'goals':
        await this.syncGoals(item.data);
        break;
      case 'reports':
        await this.syncReports(item.data);
        break;
      case 'offline_action':
        await this.syncOfflineAction(item.data);
        break;
      default:
        console.warn('Unknown sync type:', item.type);
    }
  }

  async syncHealthData(data) {
    const response = await apiClient.post('/health/sync', data);
    
    // Handle server-side changes
    if (response.conflicts) {
      this.conflicts.push({
        type: 'health_data',
        local: data,
        remote: response.remote,
        resolution: null,
      });
    }

    return response;
  }

  async syncUserProfile(data) {
    return await apiClient.put('/user/profile', data);
  }

  async syncSettings(data) {
    return await apiClient.put('/user/settings', data);
  }

  async syncDeviceData(data) {
    return await apiClient.post('/device/sync', data);
  }

  async syncAlerts(data) {
    return await apiClient.post('/alerts/sync', data);
  }

  async syncGoals(data) {
    return await apiClient.post('/goals/sync', data);
  }

  async syncReports(data) {
    return await apiClient.post('/reports/sync', data);
  }

  async syncOfflineAction(data) {
    return await apiClient.post(data.endpoint, data.payload);
  }

  handleSyncFailure(item, error) {
    this.emit('sync_item_failed', {
      item,
      error: error.message,
    });

    // Store failed items for later retry
    storageService.addFailedSyncItem(item);
  }

  async resolveConflict(conflictId, resolution) {
    const conflict = this.conflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    if (resolution === 'local') {
      await this.queueForSync(conflict.type, conflict.local, { priority: 'high' });
    } else if (resolution === 'remote') {
      // Apply remote changes locally
      await this.applyRemoteChanges(conflict);
    }

    this.conflicts = this.conflicts.filter(c => c.id !== conflictId);
    this.emit('conflict_resolved', { conflictId, resolution });
  }

  async applyRemoteChanges(conflict) {
    // Apply remote changes to local storage
    switch (conflict.type) {
      case 'health_data':
        await storageService.updateHealthData(conflict.remote);
        break;
      // Handle other types
    }
  }

  async getSyncStatus() {
    const netInfo = await NetInfo.fetch();
    
    return {
      isSyncing: this.isSyncing,
      lastSyncTime: this.lastSyncTime,
      queueSize: this.syncQueue.length,
      isConnected: netInfo.isConnected,
      connectionType: netInfo.type,
      conflictsCount: this.conflicts.length,
    };
  }

  async clearSyncQueue() {
    this.syncQueue = [];
    await this.saveSyncQueue();
  }

  async retryFailedItems() {
    const failed = await storageService.getFailedSyncItems();
    for (const item of failed) {
      await this.queueForSync(item.type, item.data, item.options);
    }
    await storageService.clearFailedSyncItems();
    await this.performSync();
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

  // Real-time sync via WebSocket
  setupRealtimeSync() {
    websocketService.on('sync_request', async (data) => {
      await this.handleRealtimeSync(data);
    });

    websocketService.on('sync_response', (data) => {
      this.handleRealtimeResponse(data);
    });
  }

  async handleRealtimeSync(data) {
    // Handle real-time sync requests from server
    const localData = await this.getLocalData(data.type);
    
    websocketService.send('sync_response', {
      requestId: data.requestId,
      data: localData,
    });
  }

  handleRealtimeResponse(data) {
    this.emit('realtime_sync', data);
  }

  async getLocalData(type) {
    switch (type) {
      case 'health':
        return await storageService.getHealthData();
      case 'profile':
        return await storageService.getUser();
      case 'settings':
        return await storageService.getSettings();
      default:
        return null;
    }
  }

  // Cleanup
  cleanup() {
    this.stopAutoSync();
    this.listeners.clear();
  }
}

export default new SyncService();