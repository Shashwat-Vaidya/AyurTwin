import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Import reducers
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import settingsReducer from './slices/settingsSlice';
import healthDataReducer from './slices/healthDataSlice';
import alertsReducer from './slices/alertsSlice';
import registrationReducer from './slices/registrationSlice';
import deviceReducer from './slices/deviceSlice';
import chatbotReducer from './slices/chatbotSlice';

// Persist configuration
const rootPersistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: ['healthData', 'alerts', 'chatbot'], // These will not be persisted
};

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['user', 'isAuthenticated', 'token'],
};

const settingsPersistConfig = {
  key: 'settings',
  storage: AsyncStorage,
  whitelist: ['theme', 'notifications', 'units', 'language'],
};

const registrationPersistConfig = {
  key: 'registration',
  storage: AsyncStorage,
  whitelist: ['formData', 'currentStep'],
};

// Combine all reducers
const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: userReducer,
  settings: persistReducer(settingsPersistConfig, settingsReducer),
  healthData: healthDataReducer,
  alerts: alertsReducer,
  registration: persistReducer(registrationPersistConfig, registrationReducer),
  device: deviceReducer,
  chatbot: chatbotReducer,
});

// Root reducer with reset functionality
const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    // Clear persisted state on logout
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);