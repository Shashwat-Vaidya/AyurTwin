import { combineReducers } from '@reduxjs/toolkit';

// Import all slices
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import healthDataReducer from './slices/healthDataSlice';
import alertsReducer from './slices/alertsSlice';
import settingsReducer from './slices/settingsSlice';
import registrationReducer from './slices/registrationSlice';
import deviceReducer from './slices/deviceSlice';
import chatbotReducer from './slices/chatbotSlice';

// Combine all reducers
const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  healthData: healthDataReducer,
  alerts: alertsReducer,
  settings: settingsReducer,
  registration: registrationReducer,
  device: deviceReducer,
  chatbot: chatbotReducer,
});

// Root reducer with reset functionality
const rootReducer = (state, action) => {
  // Reset all state on logout
  if (action.type === 'auth/logout') {
    // Preserve any state you want to keep across logouts
    const { settings } = state || {};
    
    state = {
      ...state,
      auth: undefined,
      user: undefined,
      healthData: undefined,
      alerts: undefined,
      registration: undefined,
      device: undefined,
      chatbot: undefined,
      // Keep settings
      settings: settings,
    };
  }
  
  // Reset specific state on registration complete
  if (action.type === 'registration/resetRegistration') {
    state = {
      ...state,
      registration: undefined,
    };
  }
  
  // Clear all data (for account deletion)
  if (action.type === 'app/clearAllData') {
    state = undefined;
  }
  
  return appReducer(state, action);
};

export default rootReducer;