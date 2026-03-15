import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_BASE_URL = 'https://api.ayurtwin.com/v1';
const API_TIMEOUT = 30000;

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Platform': Platform.OS,
        'X-App-Version': '1.0.0',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('@auth:token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        const originalRequest = error.config;

        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = await AsyncStorage.getItem('@auth:refreshToken');
            const response = await this.client.post('/auth/refresh', {
              refresh_token: refreshToken,
            });
            
            if (response.data.token) {
              await AsyncStorage.setItem('@auth:token', response.data.token);
              this.client.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Redirect to login
            await AsyncStorage.multiRemove(['@auth:token', '@auth:refreshToken']);
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        status: error.response.status,
        message: error.response.data?.message || 'Server error occurred',
        errors: error.response.data?.errors || {},
      };
    } else if (error.request) {
      // Request made but no response
      return {
        status: 0,
        message: 'Network error. Please check your connection.',
        errors: {},
      };
    } else {
      // Something else happened
      return {
        status: -1,
        message: error.message || 'An unexpected error occurred',
        errors: {},
      };
    }
  }

  // HTTP methods
  async get(url, params = {}) {
    return this.client.get(url, { params });
  }

  async post(url, data = {}) {
    return this.client.post(url, data);
  }

  async put(url, data = {}) {
    return this.client.put(url, data);
  }

  async patch(url, data = {}) {
    return this.client.patch(url, data);
  }

  async delete(url) {
    return this.client.delete(url);
  }

  async upload(url, file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress?.(percentCompleted);
      },
    });
  }

  async download(url, onProgress) {
    return this.client.get(url, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress?.(percentCompleted);
      },
    });
  }
}

export default new ApiClient();