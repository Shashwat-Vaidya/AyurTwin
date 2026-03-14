import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // API call would go here
      // const response = await authService.login(email, password);
      
      // Mock response for now
      const mockResponse = {
        user: {
          id: '1',
          email: email,
          name: 'John Doe',
        },
        token: 'mock-jwt-token',
      };
      
      return mockResponse;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // API call would go here
      // const response = await authService.register(userData);
      
      // Mock response
      const mockResponse = {
        user: {
          id: '1',
          email: userData.email,
          name: userData.fullName,
        },
        token: 'mock-jwt-token',
      };
      
      return mockResponse;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyBiometric = createAsyncThunk(
  'auth/verifyBiometric',
  async (_, { rejectWithValue }) => {
    try {
      // Biometric verification logic
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to sign in',
      });
      
      if (success) {
        return { success: true };
      } else {
        return rejectWithValue('Biometric authentication failed');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  biometricAvailable: false,
  biometricEnabled: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setBiometricAvailable: (state, action) => {
      state.biometricAvailable = action.payload;
    },
    setBiometricEnabled: (state, action) => {
      state.biometricEnabled = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Biometric cases
      .addCase(verifyBiometric.fulfilled, (state) => {
        // Handle biometric success if needed
      })
      .addCase(verifyBiometric.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setUser,
  setToken,
  logout,
  setBiometricAvailable,
  setBiometricEnabled,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;