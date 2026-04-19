import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import websocketService from '../../services/sensors/websocketService';

// Async thunks
export const sendMessage = createAsyncThunk(
  'chatbot/sendMessage',
  async ({ message, context }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const response = await new Promise((resolve) => {
        // Simulate API call - replace with actual chatbot API
        setTimeout(() => {
          const botResponse = generateBotResponse(message, state);
          resolve(botResponse);
        }, 1000);
      });
      return { userMessage: message, botResponse, context };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadChatHistory = createAsyncThunk(
  'chatbot/loadChatHistory',
  async (_, { rejectWithValue }) => {
    try {
      const history = await AsyncStorage.getItem('@chat:history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearChatHistory = createAsyncThunk(
  'chatbot/clearChatHistory',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem('@chat:history');
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to generate bot responses
const generateBotResponse = (message, state) => {
  const lowerMsg = message.toLowerCase();
  const { user } = state.user;
  const { currentReadings, doshaBalance } = state.healthData;
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return {
      text: `Hello ${user?.personalInfo?.fullName?.split(' ')[0] || 'there'}! How can I help you today?`,
      suggestions: ['My health', 'Dosha info', 'Recommendations'],
    };
  }
  
  if (lowerMsg.includes('dosha')) {
    const dosha = doshaBalance?.dominant || 'balanced';
    return {
      text: `Your dominant dosha is ${dosha}. Would you like to learn more about ${dosha} dosha or get balancing tips?`,
      suggestions: [`About ${dosha}`, 'Balancing tips', 'Diet advice'],
    };
  }
  
  if (lowerMsg.includes('heart') || lowerMsg.includes('hr')) {
    const hr = currentReadings?.heartRate || 72;
    const status = hr < 60 ? 'low' : hr > 100 ? 'high' : 'normal';
    return {
      text: `Your current heart rate is ${hr} bpm, which is ${status}. Would you like to see your heart rate trends?`,
      suggestions: ['View trends', 'Set alert', 'Normal range'],
    };
  }
  
  if (lowerMsg.includes('sleep')) {
    const sleep = currentReadings?.sleep || 7.2;
    return {
      text: `You slept for ${sleep} hours last night. Sleep quality was good. Need tips for better sleep?`,
      suggestions: ['Sleep tips', 'View sleep data', 'Set bedtime'],
    };
  }
  
  if (lowerMsg.includes('stress')) {
    const stress = currentReadings?.stress || 45;
    const level = stress < 30 ? 'low' : stress < 50 ? 'moderate' : stress < 70 ? 'high' : 'severe';
    return {
      text: `Your stress level is ${stress} (${level}). Try some breathing exercises to relax.`,
      suggestions: ['Breathing exercise', 'Meditation', 'Stress tips'],
    };
  }
  
  if (lowerMsg.includes('diet') || lowerMsg.includes('food')) {
    return {
      text: 'I can help with diet recommendations based on your dosha and health goals. What would you like to know?',
      suggestions: ['Dosha diet', 'Meal ideas', 'Foods to avoid'],
    };
  }
  
  if (lowerMsg.includes('exercise') || lowerMsg.includes('workout')) {
    return {
      text: 'Exercise suggestions based on your fitness level and dosha are available. What type of exercise interests you?',
      suggestions: ['Dosha exercise', 'Beginner workout', 'Strength training'],
    };
  }
  
  if (lowerMsg.includes('device')) {
    return {
      text: 'I can help with device connection, battery status, and syncing. What issue are you having?',
      suggestions: ['Connect device', 'Battery status', 'Sync data'],
    };
  }
  
  if (lowerMsg.includes('report') || lowerMsg.includes('summary')) {
    return {
      text: 'Your health reports are available. Would you like to see your weekly summary or monthly trends?',
      suggestions: ['Weekly report', 'Monthly trends', 'Export data'],
    };
  }
  
  return {
    text: 'I understand you\'re asking about your health. Could you be more specific? You can ask about your dosha, heart rate, sleep, stress, diet, exercise, or device.',
    suggestions: ['My dosha', 'Heart rate', 'Sleep', 'Stress', 'Diet', 'Exercise'],
  };
};

const initialState = {
  messages: [],
  isTyping: false,
  isOpen: false,
  unreadCount: 0,
  context: {
    sessionId: null,
    lastTopic: null,
    userData: null,
  },
  suggestions: [],
  isLoading: false,
  error: null,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
      
      if (action.payload.sender === 'bot' && !state.isOpen) {
        state.unreadCount += 1;
      }
      
      // Update context with last topic
      if (action.payload.topic) {
        state.context.lastTopic = action.payload.topic;
      }
      
      // Limit messages to 100
      if (state.messages.length > 100) {
        state.messages = state.messages.slice(-100);
      }
    },
    
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
      if (state.isOpen) {
        state.unreadCount = 0;
      }
    },
    
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
    
    markAsRead: (state) => {
      state.unreadCount = 0;
    },
    
    setContext: (state, action) => {
      state.context = { ...state.context, ...action.payload };
    },
    
    clearContext: (state) => {
      state.context = {
        sessionId: state.context.sessionId,
        lastTopic: null,
        userData: null,
      };
    },
    
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.unreadCount = action.payload.filter(m => m.sender === 'bot' && !m.read).length;
    },
    
    clearMessages: (state) => {
      state.messages = [];
      state.unreadCount = 0;
    },
    
    setChatbotLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setChatbotError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isTyping = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isTyping = false;
        state.isLoading = false;
        
        // Add user message
        state.messages.push({
          id: Date.now().toString(),
          text: action.payload.userMessage,
          sender: 'user',
          timestamp: new Date().toISOString(),
          read: true,
        });
        
        // Add bot response
        state.messages.push({
          id: (Date.now() + 1).toString(),
          text: action.payload.botResponse.text,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          read: state.isOpen,
          suggestions: action.payload.botResponse.suggestions,
        });
        
        if (!state.isOpen) {
          state.unreadCount += 1;
        }
        
        // Update context
        state.context.lastTopic = action.payload.context;
        state.suggestions = action.payload.botResponse.suggestions || [];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isTyping = false;
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Load chat history
      .addCase(loadChatHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadChatHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
        state.unreadCount = action.payload.filter(m => m.sender === 'bot' && !m.read).length;
      })
      .addCase(loadChatHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Clear chat history
      .addCase(clearChatHistory.fulfilled, (state) => {
        state.messages = [];
        state.unreadCount = 0;
        state.context.lastTopic = null;
      });
  },
});

// Selectors
export const selectAllMessages = (state) => state.chatbot.messages;
export const selectLastMessage = (state) => 
  state.chatbot.messages[state.chatbot.messages.length - 1];
export const selectUnreadCount = (state) => state.chatbot.unreadCount;
export const selectIsTyping = (state) => state.chatbot.isTyping;
export const selectIsOpen = (state) => state.chatbot.isOpen;
export const selectSuggestions = (state) => state.chatbot.suggestions;
export const selectContext = (state) => state.chatbot.context;
export const selectMessagesBySender = (state, sender) => 
  state.chatbot.messages.filter(m => m.sender === sender);
export const selectRecentMessages = (state, count = 10) => 
  state.chatbot.messages.slice(-count);

export const {
  addMessage,
  setTyping,
  toggleChat,
  setSuggestions,
  clearSuggestions,
  markAsRead,
  setContext,
  clearContext,
  setMessages,
  clearMessages,
  setChatbotLoading,
  setChatbotError,
  clearError,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;