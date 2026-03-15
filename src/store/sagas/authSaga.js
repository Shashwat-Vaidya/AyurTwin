import { put, takeLatest, call, delay } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authService from '../../services/api/authService';
import { 
  loginUser, 
  registerUser, 
  verifyBiometric,
  logout,
  setUser,
  setToken,
  setBiometricAvailable,
  setBiometricEnabled,
} from '../slices/authSlice';

function* handleLogin(action) {
  try {
    const { email, password } = action.payload;
    const response = yield call(authService.login, email, password);
    
    yield put(setUser(response.user));
    yield put(setToken(response.token));
    
    // Store tokens
    yield call([AsyncStorage, 'setItem'], '@auth:token', response.token);
    if (response.refreshToken) {
      yield call([AsyncStorage, 'setItem'], '@auth:refreshToken', response.refreshToken);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}

function* handleRegister(action) {
  try {
    const userData = action.payload;
    const response = yield call(authService.register, userData);
    
    yield put(setUser(response.user));
    yield put(setToken(response.token));
    
    // Store tokens
    yield call([AsyncStorage, 'setItem'], '@auth:token', response.token);
    if (response.refreshToken) {
      yield call([AsyncStorage, 'setItem'], '@auth:refreshToken', response.refreshToken);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}

function* handleBiometricVerify() {
  try {
    const response = yield call(authService.loginWithBiometric);
    if (response) {
      yield put(setUser(response.user));
      yield put(setToken(response.token));
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function* handleLogout() {
  try {
    yield call(authService.logout);
    yield call([AsyncStorage, 'removeItem'], '@auth:token');
    yield call([AsyncStorage, 'removeItem'], '@auth:refreshToken');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

function* watchAuth() {
  yield takeLatest(loginUser.type, handleLogin);
  yield takeLatest(registerUser.type, handleRegister);
  yield takeLatest(verifyBiometric.type, handleBiometricVerify);
  yield takeLatest(logout.type, handleLogout);
}

export default function* authSaga() {
  yield watchAuth();
}