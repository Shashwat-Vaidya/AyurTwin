import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken, getAuthToken, getMe } from '../services/api';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  registrationData: {},
  registrationStep: 0,
  userType: 'patient',
  prakritiResult: null,
  monitoringPatient: null,    // when a family member views a patient dashboard
  theme: 'light',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, isLoading: false };
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    case 'SET_USER_TYPE': return { ...state, userType: action.payload };
    case 'SET_REGISTRATION_DATA':
      return { ...state, registrationData: { ...state.registrationData, ...action.payload } };
    case 'SET_REGISTRATION_STEP': return { ...state, registrationStep: action.payload };
    case 'RESET_REGISTRATION': return { ...state, registrationData: {}, registrationStep: 0 };
    case 'SET_PRAKRITI_RESULT': return { ...state, prakritiResult: action.payload };
    case 'SET_MONITORING_PATIENT': return { ...state, monitoringPatient: action.payload };
    case 'SET_THEME': return { ...state, theme: action.payload };
    case 'LOGOUT': return { ...initialState, isLoading: false, theme: state.theme };
    default: return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      const token = await getAuthToken();
      const stored = await AsyncStorage.getItem('ayurtwin_user');
      if (token && stored) {
        // quick remote refresh; if fails (expired), clear
        const res = await getMe();
        if (res.success) {
          dispatch({ type: 'SET_USER', payload: res.data.user });
          await AsyncStorage.setItem('ayurtwin_user', JSON.stringify(res.data.user));
          return;
        }
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (user, token) => {
    await setAuthToken(token);
    await AsyncStorage.setItem('ayurtwin_user', JSON.stringify(user));
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = async () => {
    await setAuthToken(null);
    await AsyncStorage.removeItem('ayurtwin_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateRegistration = (data) => dispatch({ type: 'SET_REGISTRATION_DATA', payload: data });

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout, updateRegistration }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
