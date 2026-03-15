import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * API configuration based on environment
 */
export const API_CONFIG = {
  // Base URLs
  baseUrl: __DEV__ 
    ? 'http://localhost:3000' 
    : 'https://api.ayurtwin.com',
  
  apiUrl: __DEV__ 
    ? 'http://localhost:3000/api' 
    : 'https://api.ayurtwin.com/v1',
  
  wsUrl: __DEV__ 
    ? 'ws://localhost:3000' 
    : 'wss://api.ayurtwin.com',
  
  // Timeouts (in milliseconds)
  timeout: 30000,
  connectionTimeout: 10000,
  
  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000,
  retryStatusCodes: [408, 429, 500, 502, 503, 504],
  
  // Headers
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Platform': Platform.OS,
    'X-Platform-Version': Platform.Version,
    'X-App-Version': Constants.manifest?.version || '1.0.0',
  },
};

/**
 * API endpoints grouped by feature
 */
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    verify: '/auth/verify',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
    biometric: '/auth/biometric',
  },
  
  // User management
  user: {
    profile: '/user/profile',
    settings: '/user/settings',
    preferences: '/user/preferences',
    avatar: '/user/avatar',
    notifications: '/user/notifications',
    devices: '/user/devices',
    privacy: '/user/privacy',
    delete: '/user/delete',
    export: '/user/export',
  },
  
  // Health data
  health: {
    current: '/health/current',
    readings: '/health/readings',
    historical: '/health/historical',
    heartRate: '/health/heart-rate',
    spo2: '/health/spo2',
    temperature: '/health/temperature',
    stress: '/health/stress',
    sleep: '/health/sleep',
    activity: '/health/activity',
    bloodPressure: '/health/blood-pressure',
    hrv: '/health/hrv',
    glucose: '/health/glucose',
    respiratory: '/health/respiratory',
    summary: '/health/summary',
    trends: '/health/trends',
  },
  
  // Alerts
  alerts: {
    list: '/alerts',
    history: '/alerts/history',
    acknowledge: '/alerts/:id/acknowledge',
    resolve: '/alerts/:id/resolve',
    snooze: '/alerts/:id/snooze',
    settings: '/alerts/settings',
  },
  
  // Predictions
  predictions: {
    diseases: '/predictions/diseases',
    risks: '/predictions/risks',
    factors: '/predictions/factors',
    recommendations: '/predictions/recommendations',
    trends: '/predictions/trends',
  },
  
  // Dosha
  dosha: {
    current: '/dosha/current',
    history: '/dosha/history',
    quiz: '/dosha/quiz',
    recommendations: '/dosha/recommendations',
  },
  
  // Goals
  goals: {
    list: '/goals',
    create: '/goals',
    update: '/goals/:id',
    delete: '/goals/:id',
    progress: '/goals/:id/progress',
  },
  
  // Reports
  reports: {
    daily: '/reports/daily',
    weekly: '/reports/weekly',
    monthly: '/reports/monthly',
    custom: '/reports/custom',
    download: '/reports/download',
  },
  
  // Lifestyle
  lifestyle: {
    diet: '/lifestyle/diet',
    exercise: '/lifestyle/exercise',
    meditation: '/lifestyle/meditation',
    water: '/lifestyle/water',
    mood: '/lifestyle/mood',
    journal: '/lifestyle/journal',
    recipes: '/lifestyle/recipes',
  },
  
  // Device
  device: {
    connect: '/device/connect',
    disconnect: '/device/disconnect',
    status: '/device/status',
    sync: '/device/sync',
    calibrate: '/device/calibrate',
    update: '/device/update',
    info: '/device/info',
  },
  
  // Education
  education: {
    articles: '/education/articles',
    article: '/education/articles/:id',
    videos: '/education/videos',
    categories: '/education/categories',
    search: '/education/search',
    bookmark: '/education/bookmark',
  },
  
  // Subscription
  subscription: {
    plans: '/subscription/plans',
    current: '/subscription/current',
    purchase: '/subscription/purchase',
    cancel: '/subscription/cancel',
    restore: '/subscription/restore',
  },
  
  // Analytics
  analytics: {
    events: '/analytics/events',
    session: '/analytics/session',
    properties: '/analytics/properties',
  },
};

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * API error messages
 */
export const API_ERRORS = {
  [HTTP_STATUS.BAD_REQUEST]: 'Bad request. Please check your input.',
  [HTTP_STATUS.UNAUTHORIZED]: 'Unauthorized. Please login again.',
  [HTTP_STATUS.FORBIDDEN]: 'Access denied. You don\'t have permission.',
  [HTTP_STATUS.NOT_FOUND]: 'Resource not found.',
  [HTTP_STATUS.CONFLICT]: 'Data conflict. Please refresh.',
  [HTTP_STATUS.UNPROCESSABLE_ENTITY]: 'Validation failed.',
  [HTTP_STATUS.TOO_MANY_REQUESTS]: 'Too many requests. Please try again later.',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Server error. Please try again later.',
  [HTTP_STATUS.BAD_GATEWAY]: 'Bad gateway. Please try again.',
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: 'Service unavailable. Please try again later.',
  [HTTP_STATUS.GATEWAY_TIMEOUT]: 'Gateway timeout. Please try again.',
  default: 'An unexpected error occurred.',
};

/**
 * API response codes
 */
export const RESPONSE_CODES = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE: 'DUPLICATE',
  RATE_LIMIT: 'RATE_LIMIT',
  SERVER_ERROR: 'SERVER_ERROR',
};

/**
 * API request methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
};

/**
 * Content types
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml',
  PDF: 'application/pdf',
  ZIP: 'application/zip',
};

/**
 * API versioning
 */
export const API_VERSIONS = {
  V1: 'v1',
  V2: 'v2',
  LATEST: 'v1',
};

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT = {
  maxRequests: 100,
  timeWindow: 60000, // 1 minute
  retryAfter: 60000, // 1 minute
};

/**
 * Cache configuration for API responses
 */
export const API_CACHE = {
  enabled: true,
  ttl: {
    health: 300000,      // 5 minutes
    user: 600000,        // 10 minutes
    static: 86400000,    // 24 hours
  },
  maxSize: 50,           // Maximum cached items
};

/**
 * Request queue configuration
 */
export const REQUEST_QUEUE = {
  enabled: true,
  maxConcurrent: 3,
  retryOnFail: true,
  maxRetries: 3,
};

/**
 * Environment-specific API URLs
 */
export const ENV_API_URLS = {
  development: {
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3000/api',
    wsUrl: 'ws://localhost:3000',
  },
  staging: {
    baseUrl: 'https://staging-api.ayurtwin.com',
    apiUrl: 'https://staging-api.ayurtwin.com/v1',
    wsUrl: 'wss://staging-api.ayurtwin.com',
  },
  production: {
    baseUrl: 'https://api.ayurtwin.com',
    apiUrl: 'https://api.ayurtwin.com/v1',
    wsUrl: 'wss://api.ayurtwin.com',
  },
};

export default {
  API_CONFIG,
  API_ENDPOINTS,
  HTTP_STATUS,
  API_ERRORS,
  RESPONSE_CODES,
  HTTP_METHODS,
  CONTENT_TYPES,
  API_VERSIONS,
  RATE_LIMIT,
  API_CACHE,
  REQUEST_QUEUE,
  ENV_API_URLS,
};