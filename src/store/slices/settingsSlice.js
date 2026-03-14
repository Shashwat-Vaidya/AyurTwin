import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  notifications: {
    enabled: true,
    alerts: true,
    dailyReminders: true,
    stressAlerts: true,
    doshaAlerts: true,
  },
  units: {
    height: 'cm', // cm or ft
    weight: 'kg', // kg or lbs
    temperature: 'celsius', // celsius or fahrenheit
    distance: 'km', // km or miles
  },
  language: 'en',
  privacy: {
    shareData: false,
    anonymousUsage: true,
  },
  dataSync: {
    autoSync: true,
    syncInterval: 60, // minutes
    lastSync: null,
  },
  isLoading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    updateNotifications: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    toggleNotification: (state, action) => {
      const { key, value } = action.payload;
      state.notifications[key] = value;
    },
    setUnits: (state, action) => {
      state.units = { ...state.units, ...action.payload };
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    updatePrivacy: (state, action) => {
      state.privacy = { ...state.privacy, ...action.payload };
    },
    updateDataSync: (state, action) => {
      state.dataSync = { ...state.dataSync, ...action.payload };
    },
    setLastSync: (state, action) => {
      state.dataSync.lastSync = action.payload;
    },
    resetSettings: () => initialState,
  },
});

export const {
  setTheme,
  toggleTheme,
  updateNotifications,
  toggleNotification,
  setUnits,
  setLanguage,
  updatePrivacy,
  updateDataSync,
  setLastSync,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;