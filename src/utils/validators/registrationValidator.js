import { z } from 'zod';

// Personal Info Schema (Step 1)
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Full name can only contain letters and spaces'),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(50, 'Email must be less than 50 characters'),
  
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional()
    .or(z.literal('')),
  
  dateOfBirth: z
    .string()
    .refine((dob) => {
      if (!dob) return true;
      const date = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 18 && age <= 120;
    }, 'You must be at least 18 years old'),
  
  gender: z
    .enum(['Male', 'Female', 'Other'], {
      errorMap: () => ({ message: 'Please select a gender' }),
    })
    .optional(),
  
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
      errorMap: () => ({ message: 'Please select a blood group' }),
    })
    .optional(),
  
  height: z
    .number()
    .min(100, 'Height must be at least 100 cm')
    .max(250, 'Height must be less than 250 cm')
    .optional(),
  
  weight: z
    .number()
    .min(30, 'Weight must be at least 30 kg')
    .max(300, 'Weight must be less than 300 kg')
    .optional(),
});

// Lifestyle Schema (Step 2)
export const lifestyleSchema = z.object({
  physicalActivity: z
    .enum(['Low', 'Moderate', 'High'], {
      errorMap: () => ({ message: 'Please select activity level' }),
    })
    .optional(),
  
  workType: z
    .enum(['Sitting', 'Active', 'Mixed'], {
      errorMap: () => ({ message: 'Please select work type' }),
    })
    .optional(),
  
  dietType: z
    .enum(['Vegetarian', 'Non-Vegetarian', 'Mixed'], {
      errorMap: () => ({ message: 'Please select diet type' }),
    })
    .optional(),
  
  smoking: z.boolean().default(false),
  alcohol: z.boolean().default(false),
  
  waterIntake: z
    .number()
    .min(0.5, 'Water intake must be at least 0.5 L')
    .max(10, 'Water intake must be less than 10 L')
    .default(2),
  
  junkFoodFrequency: z
    .number()
    .min(0, 'Frequency must be at least 0')
    .max(7, 'Frequency must be less than 7')
    .default(0),
  
  exerciseDuration: z
    .number()
    .min(0, 'Duration must be at least 0 hours')
    .max(24, 'Duration must be less than 24 hours')
    .default(0),
});

// Sleep & Mental Health Schema (Step 3)
export const sleepMentalSchema = z.object({
  sleepDuration: z
    .number()
    .min(0, 'Sleep duration must be at least 0 hours')
    .max(24, 'Sleep duration must be less than 24 hours')
    .default(7),
  
  sleepTime: z.string().optional(),
  wakeTime: z.string().optional(),
  
  daytimeSleepiness: z
    .number()
    .min(1, 'Value must be between 1 and 10')
    .max(10, 'Value must be between 1 and 10')
    .default(5),
  
  stressLevel: z
    .number()
    .min(1, 'Value must be between 1 and 10')
    .max(10, 'Value must be between 1 and 10')
    .default(5),
  
  anxietyLevel: z
    .number()
    .min(1, 'Value must be between 1 and 10')
    .max(10, 'Value must be between 1 and 10')
    .default(5),
});

// Family History Schema (Step 4)
export const familyHistorySchema = z.object({
  diabetes: z.boolean().default(false),
  heartDisease: z.boolean().default(false),
  hypertension: z.boolean().default(false),
  asthma: z.boolean().default(false),
  arthritis: z.boolean().default(false),
});

// Symptoms Schema (Step 5)
export const symptomsSchema = z.object({
  frequentThirst: z.boolean().default(false),
  frequentUrination: z.boolean().default(false),
  jointPain: z.boolean().default(false),
  breathingDifficulty: z.boolean().default(false),
  digestiveIssues: z.boolean().default(false),
  
  fatigueLevel: z
    .number()
    .min(1, 'Value must be between 1 and 10')
    .max(10, 'Value must be between 1 and 10')
    .default(5),
});

// Ayurvedic Inputs Schema (Step 6)
export const ayurvedicInputsSchema = z.object({
  digestionStrength: z
    .number()
    .min(1, 'Value must be between 1 and 10')
    .max(10, 'Value must be between 1 and 10')
    .default(5),
  
  appetiteLevel: z
    .number()
    .min(1, 'Value must be between 1 and 10')
    .max(10, 'Value must be between 1 and 10')
    .default(5),
  
  sweatingLevel: z
    .number()
    .min(1, 'Value must be between 1 and 10')
    .max(10, 'Value must be between 1 and 10')
    .default(5),
  
  temperaturePreference: z
    .enum(['Cold', 'Normal', 'Hot'], {
      errorMap: () => ({ message: 'Please select preference' }),
    })
    .optional(),
  
  stressResponse: z
    .enum(['Calm', 'Irritable', 'Anxious'], {
      errorMap: () => ({ message: 'Please select response style' }),
    })
    .optional(),
});

// Prakriti Schema (Step 7)
export const prakritiSchema = z.object({
  type: z
    .enum(
      ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Tri-Dosha'],
      {
        errorMap: () => ({ message: 'Please select your Prakriti type' }),
      }
    )
    .optional(),
  
  vata: z.number().min(0).max(100).default(33.33),
  pitta: z.number().min(0).max(100).default(33.33),
  kapha: z.number().min(0).max(100).default(33.33),
});

// Credentials Schema (Step 8)
export const credentialsSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .regex(/^[a-zA-Z0-9_]*$/, 'Username can only contain letters, numbers, and underscores'),
    
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Combined registration schema (all steps)
export const registrationSchema = z.object({
  personalInfo: personalInfoSchema,
  lifestyle: lifestyleSchema,
  sleepMental: sleepMentalSchema,
  familyHistory: familyHistorySchema,
  symptoms: symptomsSchema,
  ayurvedicInputs: ayurvedicInputsSchema,
  prakriti: prakritiSchema,
  credentials: credentialsSchema,
});

// Validation functions for each step
export const validateStep = (step, data) => {
  const schemas = {
    1: personalInfoSchema,
    2: lifestyleSchema,
    3: sleepMentalSchema,
    4: familyHistorySchema,
    5: symptomsSchema,
    6: ayurvedicInputsSchema,
    7: prakritiSchema,
    8: credentialsSchema,
  };

  try {
    schemas[step].parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};