/**
 * Validation rules and constants for form validation
 */

export const VALIDATION_RULES = {
  // User information
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s\-']+$/,
    message: 'Name must contain only letters, spaces, hyphens, and apostrophes',
  },
  
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  
  phone: {
    pattern: /^[6-9]\d{9}$/,
    message: 'Please enter a valid 10-digit Indian mobile number',
    minLength: 10,
    maxLength: 10,
  },
  
  password: {
    minLength: 8,
    maxLength: 50,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
    message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
  },
  
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: 'Username can only contain letters, numbers, and underscores',
  },

  // Physical measurements
  height: {
    min: 50, // cm
    max: 250, // cm
    message: 'Height must be between 50 cm and 250 cm',
  },
  
  weight: {
    min: 2, // kg
    max: 300, // kg
    message: 'Weight must be between 2 kg and 300 kg',
  },
  
  bmi: {
    min: 10,
    max: 60,
    message: 'BMI must be between 10 and 60',
  },
  
  waistCircumference: {
    min: 40, // cm
    max: 200, // cm
    message: 'Waist circumference must be between 40 cm and 200 cm',
  },
  
  hipCircumference: {
    min: 40, // cm
    max: 200, // cm
    message: 'Hip circumference must be between 40 cm and 200 cm',
  },

  // Vital signs
  heartRate: {
    min: 30, // bpm
    max: 220, // bpm
    normalMin: 60,
    normalMax: 100,
    message: 'Heart rate must be between 30 and 220 bpm',
  },
  
  systolicBP: {
    min: 70, // mmHg
    max: 250, // mmHg
    normalMin: 90,
    normalMax: 120,
    message: 'Systolic blood pressure must be between 70 and 250 mmHg',
  },
  
  diastolicBP: {
    min: 40, // mmHg
    max: 150, // mmHg
    normalMin: 60,
    normalMax: 80,
    message: 'Diastolic blood pressure must be between 40 and 150 mmHg',
  },
  
  temperature: {
    min: 32, // °C
    max: 42, // °C
    normalMin: 36.1,
    normalMax: 37.2,
    message: 'Temperature must be between 32°C and 42°C',
  },
  
  spo2: {
    min: 50, // %
    max: 100, // %
    normalMin: 95,
    message: 'SpO2 must be between 50% and 100%',
  },
  
  respiratoryRate: {
    min: 8, // breaths/min
    max: 40, // breaths/min
    normalMin: 12,
    normalMax: 20,
    message: 'Respiratory rate must be between 8 and 40 breaths/min',
  },
  
  hrv: {
    min: 10, // ms
    max: 200, // ms
    message: 'HRV must be between 10 and 200 ms',
  },

  // Lifestyle
  sleepDuration: {
    min: 1, // hours
    max: 16, // hours
    normalMin: 7,
    normalMax: 9,
    message: 'Sleep duration must be between 1 and 16 hours',
  },
  
  waterIntake: {
    min: 0.1, // liters
    max: 10, // liters
    normalMin: 2,
    normalMax: 4,
    message: 'Water intake must be between 0.1 and 10 liters',
  },
  
  exerciseDuration: {
    min: 0, // minutes
    max: 480, // minutes
    normalMin: 30,
    normalMax: 120,
    message: 'Exercise duration must be between 0 and 480 minutes',
  },
  
  steps: {
    min: 0,
    max: 100000,
    normalMin: 5000,
    normalMax: 10000,
    message: 'Steps must be between 0 and 100,000',
  },
  
  calories: {
    min: 0,
    max: 10000,
    normalMin: 1500,
    normalMax: 3500,
    message: 'Calories must be between 0 and 10,000',
  },

  // Mental health
  stressLevel: {
    min: 0,
    max: 100,
    normalMin: 0,
    normalMax: 50,
    message: 'Stress level must be between 0 and 100',
  },
  
  anxietyLevel: {
    min: 0,
    max: 100,
    normalMin: 0,
    normalMax: 50,
    message: 'Anxiety level must be between 0 and 100',
  },
  
  mood: {
    min: 1,
    max: 10,
    message: 'Mood rating must be between 1 and 10',
  },

  // Lab values
  bloodGlucose: {
    min: 20, // mg/dL
    max: 600, // mg/dL
    normalMin: 70,
    normalMax: 140,
    message: 'Blood glucose must be between 20 and 600 mg/dL',
  },
  
  hba1c: {
    min: 3, // %
    max: 15, // %
    normalMin: 4,
    normalMax: 5.6,
    message: 'HbA1c must be between 3% and 15%',
  },
  
  cholesterol: {
    min: 50, // mg/dL
    max: 400, // mg/dL
    normalMin: 125,
    normalMax: 200,
    message: 'Total cholesterol must be between 50 and 400 mg/dL',
  },
  
  hdl: {
    min: 10, // mg/dL
    max: 100, // mg/dL
    normalMin: 40,
    message: 'HDL must be between 10 and 100 mg/dL',
  },
  
  ldl: {
    min: 20, // mg/dL
    max: 300, // mg/dL
    normalMax: 100,
    message: 'LDL must be between 20 and 300 mg/dL',
  },
  
  triglycerides: {
    min: 20, // mg/dL
    max: 1000, // mg/dL
    normalMax: 150,
    message: 'Triglycerides must be between 20 and 1000 mg/dL',
  },

  // Age
  age: {
    min: 0,
    max: 120,
    adultMin: 18,
    message: 'Age must be between 0 and 120 years',
  },
};

/**
 * Validation messages for common scenarios
 */
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  password: 'Password must be at least 8 characters',
  passwordMatch: 'Passwords do not match',
  minLength: (field, length) => `${field} must be at least ${length} characters`,
  maxLength: (field, length) => `${field} must not exceed ${length} characters`,
  min: (field, value) => `${field} must be at least ${value}`,
  max: (field, value) => `${field} must not exceed ${value}`,
  between: (field, min, max) => `${field} must be between ${min} and ${max}`,
  pattern: (field) => `Please enter a valid ${field}`,
  futureDate: 'Date cannot be in the future',
  pastDate: 'Date cannot be in the past',
  invalidDate: 'Please enter a valid date',
  ageRestriction: (age) => `You must be at least ${age} years old`,
};

/**
 * Regular expression patterns for validation
 */
export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  username: /^[a-zA-Z0-9_]+$/,
  name: /^[a-zA-Z\s\-']+$/,
  password: {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*(),.?":{}|<>]/,
  },
  bloodGroup: /^(A|B|AB|O)[+-]$/,
  pincode: /^\d{6}$/,
  aadhar: /^\d{12}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
};

/**
 * Health thresholds for alerts and warnings
 */
export const HEALTH_THRESHOLDS = {
  heartRate: {
    low: 50,
    high: 100,
    criticalLow: 40,
    criticalHigh: 120,
  },
  spo2: {
    low: 95,
    criticalLow: 90,
  },
  temperature: {
    low: 36.0,
    high: 37.5,
    criticalLow: 35.0,
    criticalHigh: 38.5,
  },
  bloodPressure: {
    systolic: {
      low: 90,
      high: 140,
      criticalHigh: 180,
    },
    diastolic: {
      low: 60,
      high: 90,
      criticalHigh: 110,
    },
  },
  stress: {
    moderate: 50,
    high: 70,
    severe: 85,
  },
  glucose: {
    low: 70,
    high: 140,
    criticalLow: 54,
    criticalHigh: 250,
  },
  bmi: {
    underweight: 18.5,
    normal: 25,
    overweight: 30,
    obese: 35,
  },
};

/**
 * Validation function factory
 */
export const createValidator = (rules) => {
  return (value) => {
    if (rules.required && !value) {
      return { isValid: false, error: VALIDATION_MESSAGES.required };
    }

    if (value) {
      if (rules.minLength && value.length < rules.minLength) {
        return { 
          isValid: false, 
          error: VALIDATION_MESSAGES.minLength('Field', rules.minLength) 
        };
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return { 
          isValid: false, 
          error: VALIDATION_MESSAGES.maxLength('Field', rules.maxLength) 
        };
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return { 
          isValid: false, 
          error: rules.message || VALIDATION_MESSAGES.pattern('field') 
        };
      }

      if (rules.min !== undefined && value < rules.min) {
        return { 
          isValid: false, 
          error: VALIDATION_MESSAGES.min('Value', rules.min) 
        };
      }

      if (rules.max !== undefined && value > rules.max) {
        return { 
          isValid: false, 
          error: VALIDATION_MESSAGES.max('Value', rules.max) 
        };
      }
    }

    return { isValid: true, error: null };
  };
};

/**
 * Pre-configured validators for common fields
 */
export const validators = {
  email: createValidator({ required: true, pattern: REGEX_PATTERNS.email }),
  phone: createValidator({ required: true, pattern: REGEX_PATTERNS.phone, minLength: 10, maxLength: 10 }),
  name: createValidator({ required: true, pattern: REGEX_PATTERNS.name, minLength: 2, maxLength: 50 }),
  username: createValidator({ required: true, pattern: REGEX_PATTERNS.username, minLength: 3, maxLength: 20 }),
  password: createValidator({ required: true, minLength: 8, maxLength: 50 }),
  age: createValidator({ required: true, min: 0, max: 120 }),
  height: createValidator({ required: true, min: 50, max: 250 }),
  weight: createValidator({ required: true, min: 2, max: 300 }),
  heartRate: createValidator({ required: true, min: 30, max: 220 }),
  spo2: createValidator({ required: true, min: 50, max: 100 }),
  temperature: createValidator({ required: true, min: 32, max: 42 }),
  sleepDuration: createValidator({ required: true, min: 1, max: 16 }),
  stressLevel: createValidator({ required: true, min: 0, max: 100 }),
};

export default {
  VALIDATION_RULES,
  VALIDATION_MESSAGES,
  REGEX_PATTERNS,
  HEALTH_THRESHOLDS,
  createValidator,
  validators,
};