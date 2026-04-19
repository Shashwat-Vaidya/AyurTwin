import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import healthService from '../../services/api/healthService';
import storageService from '../../services/storage/asyncStorage';

// Async thunks
export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await healthService.getAlerts();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAlertHistory = createAsyncThunk(
  'alerts/fetchAlertHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await healthService.getAlertHistory();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resolveAlert = createAsyncThunk(
  'alerts/resolveAlert',
  async (alertId, { rejectWithValue, dispatch }) => {
    try {
      const response = await healthService.resolveAlert(alertId);
      dispatch(removeAlert(alertId));
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const snoozeAlert = createAsyncThunk(
  'alerts/snoozeAlert',
  async ({ alertId, duration }, { rejectWithValue }) => {
    try {
      const response = await healthService.snoozeAlert(alertId, duration);
      return { alertId, duration, ...response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  alerts: [],
  alertHistory: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  lastFetched: null,
  filters: {
    severity: null,
    type: null,
    dateRange: null,
  },
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action) => {
      const newAlert = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload,
      };
      state.alerts.unshift(newAlert);
      state.unreadCount += 1;
      
      // Sort alerts by timestamp
      state.alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // Limit alerts to 100
      if (state.alerts.length > 100) {
        const removed = state.alerts.pop();
        if (!removed.read) {
          state.unreadCount -= 1;
        }
      }
    },
    
    updateAlert: (state, action) => {
      const index = state.alerts.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        const wasUnread = !state.alerts[index].read;
        state.alerts[index] = { ...state.alerts[index], ...action.payload };
        
        // Update unread count if read status changed
        if (wasUnread && action.payload.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        } else if (!wasUnread && action.payload.read === false) {
          state.unreadCount += 1;
        }
      }
    },
    
    removeAlert: (state, action) => {
      const index = state.alerts.findIndex(a => a.id === action.payload);
      if (index !== -1) {
        if (!state.alerts[index].read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.alerts.splice(index, 1);
      }
    },
    
    markAsRead: (state, action) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert && !alert.read) {
        alert.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    markAllAsRead: (state) => {
      state.alerts.forEach(alert => {
        alert.read = true;
      });
      state.unreadCount = 0;
    },
    
    clearAllAlerts: (state) => {
      state.alerts = [];
      state.unreadCount = 0;
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    setAlerts: (state, action) => {
      state.alerts = action.payload;
      state.unreadCount = action.payload.filter(a => !a.read).length;
    },
    
    setAlertLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setAlertError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch alerts
      .addCase(fetchAlerts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alerts = action.payload;
        state.unreadCount = action.payload.filter(a => !a.read).length;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch alert history
      .addCase(fetchAlertHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAlertHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alertHistory = action.payload;
      })
      .addCase(fetchAlertHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Resolve alert
      .addCase(resolveAlert.fulfilled, (state, action) => {
        // Alert is removed in the action itself
      })
      .addCase(resolveAlert.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Snooze alert
      .addCase(snoozeAlert.fulfilled, (state, action) => {
        const alert = state.alerts.find(a => a.id === action.payload.alertId);
        if (alert) {
          alert.snoozed = true;
          alert.snoozeUntil = Date.now() + action.payload.duration;
        }
      })
      .addCase(snoozeAlert.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllAlerts = (state) => state.alerts.alerts;
export const selectUnreadCount = (state) => state.alerts.unreadCount;
export const selectAlertById = (state, alertId) => 
  state.alerts.alerts.find(a => a.id === alertId);
export const selectCriticalAlerts = (state) => 
  state.alerts.alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
export const selectUnreadAlerts = (state) => 
  state.alerts.alerts.filter(a => !a.read);
export const selectAlertsByType = (state, type) => 
  state.alerts.alerts.filter(a => a.type === type);
export const selectAlertsBySeverity = (state, severity) => 
  state.alerts.alerts.filter(a => a.severity === severity);
export const selectFilteredAlerts = (state) => {
  const { alerts, filters } = state.alerts;
  return alerts.filter(alert => {
    if (filters.severity && alert.severity !== filters.severity) return false;
    if (filters.type && alert.type !== filters.type) return false;
    if (filters.dateRange) {
      const alertDate = new Date(alert.timestamp);
      const now = new Date();
      if (filters.dateRange === 'today') {
        return alertDate.toDateString() === now.toDateString();
      }
      if (filters.dateRange === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return alertDate >= weekAgo;
      }
      if (filters.dateRange === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return alertDate >= monthAgo;
      }
    }
    return true;
  });
};

export const {
  addAlert,
  updateAlert,
  removeAlert,
  markAsRead,
  markAllAsRead,
  clearAllAlerts,
  setFilters,
  clearFilters,
  setAlerts,
  setAlertLoading,
  setAlertError,
  clearError,
} = alertsSlice.actions;

export default alertsSlice.reducer;