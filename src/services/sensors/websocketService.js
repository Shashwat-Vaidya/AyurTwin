import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SOCKET_URL = 'wss://api.ayurtwin.com';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.pendingSubscriptions = new Set();
    this.heartbeatInterval = null;
    this.messageQueue = [];
  }

  async connect() {
    if (this.socket?.connected) {
      return;
    }

    const token = await AsyncStorage.getItem('@auth:token');
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        token,
        platform: Platform.OS,
        version: '1.0.0',
      },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      timeout: 10000,
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connected = true;
      this.reconnectAttempts = 0;
      this.emit('connected');
      this.processMessageQueue();
      this.startHeartbeat();
      this.resubscribe();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.connected = false;
      this.emit('disconnected', reason);
      this.stopHeartbeat();
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    });

    this.socket.on('reconnect_attempt', (attempt) => {
      console.log('WebSocket reconnect attempt:', attempt);
      this.reconnectAttempts = attempt;
      this.emit('reconnecting', attempt);
    });

    this.socket.on('reconnect_failed', () => {
      console.log('WebSocket reconnect failed');
      this.emit('reconnect_failed');
    });

    this.socket.on('pong', () => {
      console.log('WebSocket pong received');
    });

    // Handle incoming messages
    this.socket.on('health_data', (data) => {
      this.emit('health_data', data);
    });

    this.socket.on('alert', (data) => {
      this.emit('alert', data);
    });

    this.socket.on('notification', (data) => {
      this.emit('notification', data);
    });

    this.socket.on('device_status', (data) => {
      this.emit('device_status', data);
    });

    this.socket.on('dosha_update', (data) => {
      this.emit('dosha_update', data);
    });

    this.socket.on('risk_update', (data) => {
      this.emit('risk_update', data);
    });

    this.socket.on('recommendation', (data) => {
      this.emit('recommendation', data);
    });

    // Handle subscriptions
    this.socket.on('subscribed', (data) => {
      this.emit('subscribed', data);
      this.pendingSubscriptions.delete(data.channel);
    });

    this.socket.on('unsubscribed', (data) => {
      this.emit('unsubscribed', data);
    });

    this.socket.on('subscription_error', (data) => {
      console.error('Subscription error:', data);
      this.emit('subscription_error', data);
    });
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.connected) {
        this.socket.emit('ping', { timestamp: Date.now() });
      }
    }, 30000); // Send ping every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  async processMessageQueue() {
    while (this.messageQueue.length > 0 && this.connected) {
      const { event, data } = this.messageQueue.shift();
      this.socket.emit(event, data);
    }
  }

  async resubscribe() {
    for (const channel of this.pendingSubscriptions) {
      this.subscribe(channel);
    }
  }

  // Subscription methods
  subscribe(channel, callback) {
    if (!this.connected) {
      this.pendingSubscriptions.add(channel);
      return;
    }

    this.socket.emit('subscribe', { channel });
    if (callback) {
      this.on(channel, callback);
    }
  }

  unsubscribe(channel) {
    if (this.connected) {
      this.socket.emit('unsubscribe', { channel });
    }
    this.pendingSubscriptions.delete(channel);
    this.removeAllListeners(channel);
  }

  // Event emission
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Event listeners
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

  removeAllListeners(event) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  // Send methods
  send(event, data) {
    if (!this.connected) {
      this.messageQueue.push({ event, data });
      return;
    }

    this.socket.emit(event, data);
  }

  // Health data methods
  requestHealthData(params) {
    this.send('request_health_data', params);
  }

  sendHealthData(data) {
    this.send('health_data', data);
  }

  // Alert methods
  acknowledgeAlert(alertId) {
    this.send('acknowledge_alert', { alertId });
  }

  // Device methods
  updateDeviceStatus(status) {
    this.send('device_status', status);
  }

  // User methods
  updatePresence(status) {
    this.send('presence', { status, timestamp: Date.now() });
  }

  // Connection status
  isConnected() {
    return this.connected;
  }

  // Disconnect
  disconnect() {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
    this.removeAllListeners();
    this.messageQueue = [];
    this.pendingSubscriptions.clear();
  }

  // Reconnect
  reconnect() {
    this.disconnect();
    this.connect();
  }

  // Get connection state
  getState() {
    return {
      connected: this.connected,
      reconnectAttempts: this.reconnectAttempts,
      pendingSubscriptions: Array.from(this.pendingSubscriptions),
      queueLength: this.messageQueue.length,
    };
  }
}

// Create singleton instance
const websocketService = new WebSocketService();
export default websocketService;