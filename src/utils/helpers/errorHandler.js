import { Alert } from 'react-native';

/**
 * Error types for classification
 */
export const ERROR_TYPES = {
  NETWORK: 'network',
  AUTH: 'authentication',
  VALIDATION: 'validation',
  SERVER: 'server',
  DEVICE: 'device',
  PERMISSION: 'permission',
  UNKNOWN: 'unknown',
};

/**
 * Error messages for common scenarios
 */
export const ERROR_MESSAGES = {
  NETWORK: 'Network connection error. Please check your internet connection.',
  SERVER: 'Server error. Please try again later.',
  AUTH: 'Authentication failed. Please sign in again.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  VALIDATION: 'Please check your input and try again.',
  PERMISSION: 'Permission denied. Please enable required permissions.',
  DEVICE: 'Device error. Please check your device connection.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
  TIMEOUT: 'Request timed out. Please try again.',
  NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'Data conflict. Please refresh and try again.',
  OFFLINE: 'You are offline. Please check your connection.',
};

/**
 * Parse error and extract useful information
 * @param {any} error - Error object
 * @returns {Object} Parsed error
 */
export const parseError = (error) => {
  const parsed = {
    original: error,
    message: ERROR_MESSAGES.UNKNOWN,
    type: ERROR_TYPES.UNKNOWN,
    status: null,
    data: null,
    stack: null,
  };

  if (!error) return parsed;

  // Network errors
  if (error.message?.includes('Network') || error.code === 'ECONNABORTED') {
    parsed.type = ERROR_TYPES.NETWORK;
    parsed.message = ERROR_MESSAGES.NETWORK;
  }
  
  // Timeout errors
  else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    parsed.type = ERROR_TYPES.NETWORK;
    parsed.message = ERROR_MESSAGES.TIMEOUT;
  }

  // API response errors
  else if (error.response) {
    parsed.status = error.response.status;
    parsed.data = error.response.data;

    switch (error.response.status) {
      case 400:
        parsed.type = ERROR_TYPES.VALIDATION;
        parsed.message = error.response.data?.message || ERROR_MESSAGES.VALIDATION;
        break;
      case 401:
      case 403:
        parsed.type = ERROR_TYPES.AUTH;
        parsed.message = error.response.data?.message || ERROR_MESSAGES.AUTH;
        break;
      case 404:
        parsed.message = ERROR_MESSAGES.NOT_FOUND;
        break;
      case 409:
        parsed.message = ERROR_MESSAGES.CONFLICT;
        break;
      case 500:
      case 502:
      case 503:
        parsed.type = ERROR_TYPES.SERVER;
        parsed.message = ERROR_MESSAGES.SERVER;
        break;
      default:
        parsed.message = error.response.data?.message || ERROR_MESSAGES.UNKNOWN;
    }
  }

  // Request made but no response
  else if (error.request) {
    parsed.type = ERROR_TYPES.NETWORK;
    parsed.message = ERROR_MESSAGES.NETWORK;
  }

  // Axios error
  else if (error.isAxiosError) {
    parsed.type = ERROR_TYPES.NETWORK;
    parsed.message = error.message || ERROR_MESSAGES.NETWORK;
  }

  // Standard Error object
  else if (error instanceof Error) {
    parsed.message = error.message;
    parsed.stack = error.stack;

    if (error.name === 'ValidationError') {
      parsed.type = ERROR_TYPES.VALIDATION;
    }
  }

  // String error
  else if (typeof error === 'string') {
    parsed.message = error;
  }

  return parsed;
};

/**
 * Handle error with appropriate action
 * @param {any} error - Error to handle
 * @param {Object} options - Handling options
 */
export const handleError = (error, options = {}) => {
  const {
    showAlert = true,
    logToConsole = true,
    alertTitle = 'Error',
    onRetry,
    onDismiss,
    customMessages = {},
  } = options;

  const parsed = parseError(error);

  if (logToConsole) {
    console.error('Error:', {
      type: parsed.type,
      message: parsed.message,
      original: parsed.original,
      status: parsed.status,
      stack: parsed.stack,
    });
  }

  // Use custom message if provided for this type
  const message = customMessages[parsed.type] || parsed.message;

  if (showAlert) {
    const buttons = [];

    if (onRetry && parsed.type === ERROR_TYPES.NETWORK) {
      buttons.push({
        text: 'Retry',
        onPress: onRetry,
      });
    }

    if (parsed.type === ERROR_TYPES.AUTH) {
      buttons.push({
        text: 'Sign In',
        onPress: onRetry,
      });
    }

    if (parsed.type === ERROR_TYPES.PERMISSION) {
      buttons.push({
        text: 'Open Settings',
        onPress: onRetry,
      });
    }

    buttons.push({
      text: 'OK',
      onPress: onDismiss,
    });

    Alert.alert(alertTitle, message, buttons);
  }

  return parsed;
};

/**
 * Create user-friendly error message
 * @param {Object} parsedError - Parsed error
 * @returns {string} User-friendly message
 */
export const getUserFriendlyMessage = (parsedError) => {
  switch (parsedError.type) {
    case ERROR_TYPES.NETWORK:
      return 'Unable to connect. Please check your internet connection and try again.';
    
    case ERROR_TYPES.AUTH:
      return 'Your session has expired. Please sign in again to continue.';
    
    case ERROR_TYPES.VALIDATION:
      if (parsedError.data?.errors) {
        const errors = Object.values(parsedError.data.errors).flat();
        return errors.join('\n');
      }
      return 'Please check your input and try again.';
    
    case ERROR_TYPES.SERVER:
      return 'We\'re having trouble connecting to our servers. Please try again later.';
    
    case ERROR_TYPES.DEVICE:
      return 'There was a problem with your device. Please check the connection.';
    
    case ERROR_TYPES.PERMISSION:
      return 'This feature requires additional permissions. Please enable them in settings.';
    
    default:
      return parsedError.message || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Log error to monitoring service
 * @param {Object} error - Error to log
 * @param {Object} context - Additional context
 */
export const logErrorToService = (error, context = {}) => {
  // This would integrate with services like Sentry, Crashlytics, etc.
  const parsed = parseError(error);
  
  const errorData = {
    type: parsed.type,
    message: parsed.message,
    stack: parsed.stack,
    status: parsed.status,
    timestamp: new Date().toISOString(),
    context,
    user: context.userId,
    screen: context.screen,
    action: context.action,
  };

  // Log to console in development
  if (__DEV__) {
    console.log('Error logged to service:', errorData);
  }

  // TODO: Send to actual error monitoring service
  // Sentry.captureException(error, { extra: context });
  // Crashlytics().recordError(error);
};

/**
 * Handle API error specifically
 * @param {any} error - API error
 * @param {Object} options - Options
 * @returns {Object} Handled error
 */
export const handleApiError = (error, options = {}) => {
  const parsed = parseError(error);

  // Handle specific status codes
  if (parsed.status === 401) {
    // Trigger logout
    // authService.logout();
  }

  if (parsed.status === 403) {
    // Handle forbidden
  }

  if (parsed.status === 429) {
    // Rate limiting
    parsed.message = 'Too many requests. Please wait a moment and try again.';
  }

  return handleError(parsed, options);
};

/**
 * Create validation error object
 * @param {Object} errors - Validation errors
 * @returns {Object} Formatted validation error
 */
export const createValidationError = (errors) => {
  return {
    type: ERROR_TYPES.VALIDATION,
    message: 'Validation failed',
    data: { errors },
    toString() {
      return Object.values(errors).join('\n');
    },
  };
};

/**
 * Check if error is network related
 * @param {any} error - Error to check
 * @returns {boolean} Whether error is network related
 */
export const isNetworkError = (error) => {
  const parsed = parseError(error);
  return parsed.type === ERROR_TYPES.NETWORK;
};

/**
 * Check if error is authentication related
 * @param {any} error - Error to check
 * @returns {boolean} Whether error is auth related
 */
export const isAuthError = (error) => {
  const parsed = parseError(error);
  return parsed.type === ERROR_TYPES.AUTH || parsed.status === 401;
};

/**
 * Get error stack trace
 * @param {any} error - Error object
 * @returns {string} Stack trace
 */
export const getStackTrace = (error) => {
  if (error instanceof Error) {
    return error.stack;
  }
  return new Error().stack;
};

export default {
  ERROR_TYPES,
  ERROR_MESSAGES,
  parseError,
  handleError,
  handleApiError,
  getUserFriendlyMessage,
  logErrorToService,
  createValidationError,
  isNetworkError,
  isAuthError,
  getStackTrace,
};