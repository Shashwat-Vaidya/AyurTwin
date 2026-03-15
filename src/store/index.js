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
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'settings', 'registration'], // Only persist these
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  settings: settingsReducer,
  healthData: healthDataReducer,
  alerts: alertsReducer,
  registration: registrationReducer,
  device: deviceReducer,
  chatbot: chatbotReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);