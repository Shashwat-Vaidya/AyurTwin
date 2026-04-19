import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentReadings: {
    heartRate: 72,
    hrv: 45,
    spo2: 98,
    temperature: 36.6,
    stress: 45,
    activity: 5234,
    sleep: 7.2,
    steps: 5234,
    calories: 1850,
  },
  historicalData: {
    heartRate: [],
    hrv: [],
    spo2: [],
    temperature: [],
    stress: [],
    activity: [],
    sleep: [],
    steps: [],
  },
  trends: {
    heartRate: { min: 58, max: 82, avg: 71 },
    stress: { min: 30, max: 65, avg: 48 },
    sleep: { min: 6, max: 8.5, avg: 7.2 },
  },
  diseaseRisks: [
    { name: 'Diabetes', risk: 80, level: 'high' },
    { name: 'Hypertension', risk: 60, level: 'medium' },
    { name: 'Heart Disease', risk: 40, level: 'low' },
    { name: 'Stress/Anxiety', risk: 35, level: 'low' },
    { name: 'Sleep Disorder', risk: 25, level: 'low' },
    { name: 'Asthma', risk: 15, level: 'very low' },
    { name: 'Arthritis', risk: 20, level: 'low' },
    { name: 'Obesity', risk: 30, level: 'low' },
    { name: 'Digestive Disorder', risk: 45, level: 'medium' },
    { name: 'Fever/Infection', risk: 10, level: 'very low' },
  ],
  doshaBalance: {
    vata: 45,
    pitta: 35,
    kapha: 20,
  },
  isLoading: false,
  error: null,
  lastUpdated: new Date().toISOString(),
};

const healthDataSlice = createSlice({
  name: 'healthData',
  initialState,
  reducers: {
    updateCurrentReadings: (state, action) => {
      state.currentReadings = { ...state.currentReadings, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    updateHeartRate: (state, action) => {
      state.currentReadings.heartRate = action.payload;
    },
    updateSpO2: (state, action) => {
      state.currentReadings.spo2 = action.payload;
    },
    updateTemperature: (state, action) => {
      state.currentReadings.temperature = action.payload;
    },
    updateStress: (state, action) => {
      state.currentReadings.stress = action.payload;
    },
    updateActivity: (state, action) => {
      state.currentReadings.activity = action.payload;
      state.currentReadings.steps = action.payload;
    },
    addHistoricalData: (state, action) => {
      const { type, data } = action.payload;
      if (state.historicalData[type]) {
        state.historicalData[type].push({
          ...data,
          timestamp: new Date().toISOString(),
        });
        
        // Keep only last 100 entries
        if (state.historicalData[type].length > 100) {
          state.historicalData[type] = state.historicalData[type].slice(-100);
        }
      }
    },
    updateTrends: (state, action) => {
      state.trends = { ...state.trends, ...action.payload };
    },
    updateDiseaseRisks: (state, action) => {
      state.diseaseRisks = action.payload;
    },
    updateDoshaBalance: (state, action) => {
      state.doshaBalance = { ...state.doshaBalance, ...action.payload };
    },
    setHealthDataLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setHealthDataError: (state, action) => {
      state.error = action.payload;
    },
    resetHealthData: () => initialState,
  },
});

export const {
  updateCurrentReadings,
  updateHeartRate,
  updateSpO2,
  updateTemperature,
  updateStress,
  updateActivity,
  addHistoricalData,
  updateTrends,
  updateDiseaseRisks,
  updateDoshaBalance,
  setHealthDataLoading,
  setHealthDataError,
  resetHealthData,
} = healthDataSlice.actions;

export default healthDataSlice.reducer;