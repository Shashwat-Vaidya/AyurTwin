import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 1,
  totalSteps: 8,
  completedSteps: [],
  formData: {
    personalInfo: {},
    lifestyle: {},
    sleepMental: {},
    familyHistory: {},
    symptoms: {},
    ayurvedicInputs: {},
    prakriti: {},
    credentials: {},
  },
  isValid: {
    step1: false,
    step2: true,
    step3: true,
    step4: true,
    step5: true,
    step6: true,
    step7: true,
    step8: false,
  },
  isLoading: false,
  error: null,
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    markStepCompleted: (state, action) => {
      const step = action.payload;
      if (!state.completedSteps.includes(step)) {
        state.completedSteps.push(step);
      }
    },
    updateFormData: (state, action) => {
      const { step, data } = action.payload;
      state.formData[step] = { ...state.formData[step], ...data };
    },
    setStepValidity: (state, action) => {
      const { step, isValid } = action.payload;
      state.isValid[`step${step}`] = isValid;
    },
    resetRegistration: () => initialState,
    setRegistrationLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setRegistrationError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  markStepCompleted,
  updateFormData,
  setStepValidity,
  resetRegistration,
  setRegistrationLoading,
  setRegistrationError,
} = registrationSlice.actions;

export default registrationSlice.reducer;