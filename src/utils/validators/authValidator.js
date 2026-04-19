import * as z from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(100, 'Email must not exceed 100 characters')
  .toLowerCase()
  .trim();

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(50, 'Password must not exceed 50 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Username validation schema
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must not exceed 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
  .regex(/^[a-zA-Z]/, 'Username must start with a letter')
  .trim();

/**
 * Phone number validation schema (Indian format)
 */
export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be 10 digits')
  .max(10, 'Phone number must be 10 digits')
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number');

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

/**
 * Registration form validation schema
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  username: usernameSchema.optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/**
 * Change password validation schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});

/**
 * Biometric login validation schema
 */
export const biometricSchema = z.object({
  userId: z.string().optional(),
  deviceId: z.string().optional(),
});

/**
 * Two-factor authentication validation schema
 */
export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

/**
 * Session validation schema
 */
export const sessionSchema = z.object({
  token: z.string().min(1, 'Session token is required'),
  refreshToken: z.string().optional(),
});

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export const validateEmail = (email) => {
  try {
    emailSchema.parse(email);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  try {
    passwordSchema.parse(password);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} Validation result
 */
export const validateUsername = (username) => {
  try {
    usernameSchema.parse(username);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result
 */
export const validatePhone = (phone) => {
  try {
    phoneSchema.parse(phone);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.errors[0].message };
  }
};

/**
 * Check if passwords match
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {Object} Validation result
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords don't match" };
  }
  return { isValid: true, error: null };
};

/**
 * Calculate password strength
 * @param {string} password - Password to check
 * @returns {Object} Password strength result
 */
export const checkPasswordStrength = (password) => {
  let score = 0;
  const feedback = [];

  if (!password) {
    return { score: 0, strength: 'weak', feedback: ['Enter a password'], color: '#FF5A5F' };
  }

  // Length check
  if (password.length >= 8) {
    score += 25;
  } else {
    feedback.push('Use at least 8 characters');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 25;
  } else {
    feedback.push('Add uppercase letters');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 25;
  } else {
    feedback.push('Add lowercase letters');
  }

  // Number check
  if (/[0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Add numbers');
  }

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 10;
  } else {
    feedback.push('Add special characters');
  }

  // Determine strength
  let strength;
  let color;

  if (score >= 80) {
    strength = 'strong';
    color = '#4CAF50';
  } else if (score >= 60) {
    strength = 'good';
    color = '#4A90E2';
  } else if (score >= 40) {
    strength = 'fair';
    color = '#FFB347';
  } else {
    strength = 'weak';
    color = '#FF5A5F';
  }

  return {
    score,
    strength,
    feedback,
    color,
  };
};

/**
 * Validate login form
 * @param {Object} data - Login form data
 * @returns {Object} Validation result
 */
export const validateLogin = (data) => {
  try {
    loginSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { isValid: false, errors };
  }
};

/**
 * Validate registration form
 * @param {Object} data - Registration form data
 * @returns {Object} Validation result
 */
export const validateRegister = (data) => {
  try {
    registerSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { isValid: false, errors };
  }
};

/**
 * Validate forgot password form
 * @param {Object} data - Forgot password form data
 * @returns {Object} Validation result
 */
export const validateForgotPassword = (data) => {
  try {
    forgotPasswordSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { isValid: false, errors };
  }
};

/**
 * Validate reset password form
 * @param {Object} data - Reset password form data
 * @returns {Object} Validation result
 */
export const validateResetPassword = (data) => {
  try {
    resetPasswordSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { isValid: false, errors };
  }
};

/**
 * Validate change password form
 * @param {Object} data - Change password form data
 * @returns {Object} Validation result
 */
export const validateChangePassword = (data) => {
  try {
    changePasswordSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { isValid: false, errors };
  }
};

/**
 * Common validation messages
 */
export const VALIDATION_MESSAGES = {
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 8 characters',
    uppercase: 'Must contain an uppercase letter',
    lowercase: 'Must contain a lowercase letter',
    number: 'Must contain a number',
    special: 'Must contain a special character',
  },
  username: {
    required: 'Username is required',
    minLength: 'Username must be at least 3 characters',
    maxLength: 'Username must not exceed 20 characters',
    invalid: 'Username can only contain letters, numbers, and underscores',
    startWithLetter: 'Username must start with a letter',
  },
  phone: {
    required: 'Phone number is required',
    invalid: 'Please enter a valid 10-digit phone number',
  },
  terms: {
    required: 'You must agree to the terms and conditions',
  },
};

export default {
  emailSchema,
  passwordSchema,
  usernameSchema,
  phoneSchema,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  biometricSchema,
  twoFactorSchema,
  sessionSchema,
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
  validatePasswordMatch,
  checkPasswordStrength,
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  VALIDATION_MESSAGES,
};