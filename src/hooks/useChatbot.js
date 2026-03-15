import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import websocketService from '../services/sensors/websocketService';
import doshaCalculator from '../services/ai/doshaCalculator';
import recommendationEngine from '../services/ai/recommendationEngine';

export const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [context, setContext] = useState({
    userData: null,
    lastTopic: null,
    sessionStart: new Date(),
  });

  const messageQueue = useRef([]);
  const processingRef = useRef(false);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Load chat history from storage
  const loadChatHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('@chat:history');
      if (history) {
        const parsed = JSON.parse(history);
        setMessages(parsed);
        setUnreadCount(parsed.filter(m => !m.read && m.sender === 'bot').length);
      } else {
        // Add welcome message
        addWelcomeMessage();
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      addWelcomeMessage();
    }
  };

  // Save chat history to storage
  const saveChatHistory = async (newMessages) => {
    try {
      await AsyncStorage.setItem('@chat:history', JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Add welcome message
  const addWelcomeMessage = () => {
    const welcomeMessage = {
      id: Date.now().toString(),
      text: "Hi! I'm AyurBot, your personal health assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toISOString(),
      read: false,
      options: [
        'Tell me about my dosha',
        'Check my health metrics',
        'Get lifestyle tips',
        'Help with device',
      ],
    };
    setMessages([welcomeMessage]);
    saveChatHistory([welcomeMessage]);
  };

  // Send message
  const sendMessage = useCallback(async (text, options = {}) => {
    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      read: true,
      ...options,
    };

    setMessages(prev => {
      const updated = [...prev, userMessage];
      saveChatHistory(updated);
      return updated;
    });

    // Show typing indicator
    setIsTyping(true);

    // Process message
    setTimeout(() => {
      processMessage(text);
    }, 500);
  }, []);

  // Process user message
  const processMessage = useCallback(async (text) => {
    const lowerText = text.toLowerCase();
    let response = '';

    // Determine intent
    if (lowerText.includes('hello') || lowerText.includes('hi')) {
      response = "Hello! How can I assist you with your health today?";
    }
    else if (lowerText.includes('dosha')) {
      response = await handleDoshaQuery(text);
    }
    else if (lowerText.includes('heart') || lowerText.includes('hr')) {
      response = await handleHeartQuery(text);
    }
    else if (lowerText.includes('sleep')) {
      response = await handleSleepQuery(text);
    }
    else if (lowerText.includes('stress')) {
      response = await handleStressQuery(text);
    }
    else if (lowerText.includes('diet') || lowerText.includes('food')) {
      response = await handleDietQuery(text);
    }
    else if (lowerText.includes('exercise') || lowerText.includes('workout')) {
      response = await handleExerciseQuery(text);
    }
    else if (lowerText.includes('device')) {
      response = await handleDeviceQuery(text);
    }
    else if (lowerText.includes('report') || lowerText.includes('summary')) {
      response = await handleReportQuery(text);
    }
    else {
      response = getGenericResponse(text);
    }

    // Send bot response
    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      read: false,
    };

    setIsTyping(false);
    setMessages(prev => {
      const updated = [...prev, botMessage];
      saveChatHistory(updated);
      return updated;
    });
    setUnreadCount(prev => prev + 1);
  }, []);

  // Handle dosha queries
  const handleDoshaQuery = async (text) => {
    const userData = await getUserData();
    if (!userData?.prakriti) {
      return "I don't have your dosha information yet. Would you like to take the Prakriti quiz to determine your dosha?";
    }

    const dosha = userData.prakriti.dominant;
    const description = doshaCalculator.getDoshaDescription(dosha);

    return `Based on your profile, your dominant dosha is ${dosha}. ${description.description}\n\nWould you like to know more about ${dosha} dosha?`;
  };

  // Handle heart rate queries
  const handleHeartQuery = async (text) => {
    const userData = await getUserData();
    const hr = userData?.currentReadings?.heartRate || 72;

    if (hr < 60) {
      return `Your heart rate is ${hr} bpm, which is below the normal range. This could indicate bradycardia. Do you feel dizzy or fatigued?`;
    } else if (hr > 100) {
      return `Your heart rate is ${hr} bpm, which is above the normal range. This could be due to stress, caffeine, or physical activity. Try deep breathing exercises.`;
    } else {
      return `Your heart rate is ${hr} bpm, which is within the normal range (60-100 bpm). Good job!`;
    }
  };

  // Handle sleep queries
  const handleSleepQuery = async (text) => {
    const userData = await getUserData();
    const sleep = userData?.sleep || { duration: 7.2, quality: 70 };

    if (sleep.duration < 7) {
      return `You're averaging ${sleep.duration} hours of sleep, which is below the recommended 7-8 hours. Try to go to bed earlier and maintain a consistent sleep schedule.`;
    } else if (sleep.quality < 70) {
      return `Your sleep quality is ${sleep.quality}%. Even though you're getting enough hours, the quality could be improved. Avoid screens before bed and create a relaxing routine.`;
    } else {
      return `Great job! You're getting ${sleep.duration} hours of quality sleep (${sleep.quality}%). Keep up the good habits!`;
    }
  };

  // Handle stress queries
  const handleStressQuery = async (text) => {
    const userData = await getUserData();
    const stress = userData?.stress || { level: 45 };

    if (stress.level > 70) {
      return `Your stress level is ${stress.level}, which is quite high. I recommend taking a break, doing some deep breathing, or trying a guided meditation.`;
    } else if (stress.level > 50) {
      return `Your stress level is ${stress.level}, which is moderate. Consider taking short breaks throughout the day and practicing mindfulness.`;
    } else {
      return `Your stress level is ${stress.level}, which is in a healthy range. Keep up your stress management techniques!`;
    }
  };

  // Handle diet queries
  const handleDietQuery = async (text) => {
    const userData = await getUserData();
    const recommendations = await recommendationEngine.getDietRecommendations(userData);
    
    if (recommendations.length > 0) {
      const topRec = recommendations[0];
      return `Based on your profile, I recommend: ${topRec.suggestions?.join(', ') || topRec.message}`;
    }
    return "I'd be happy to help with diet recommendations. Could you tell me more about your dietary preferences and goals?";
  };

  // Handle exercise queries
  const handleExerciseQuery = async (text) => {
    const userData = await getUserData();
    const recommendations = await recommendationEngine.getExerciseRecommendations(userData);

    if (recommendations.length > 0) {
      const topRec = recommendations[0];
      return `For your dosha and fitness level, I recommend ${topRec.type} exercises. Try: ${topRec.suggestions?.join(', ')}`;
    }
    return "I can suggest exercises based on your profile. Would you like personalized recommendations?";
  };

  // Handle device queries
  const handleDeviceQuery = (text) => {
    if (text.includes('connect')) {
      return "To connect your device, go to More > Device and tap 'Connect Device'. Make sure Bluetooth is enabled and your device is nearby.";
    } else if (text.includes('battery')) {
      return "You can check your device battery level in More > Device. The battery status will be displayed there.";
    } else if (text.includes('sync')) {
      return "Your device automatically syncs every 15 minutes. You can also manually sync by pulling down on the dashboard.";
    }
    return "I can help with device connection, battery status, and syncing. What specific issue are you having?";
  };

  // Handle report queries
  const handleReportQuery = async (text) => {
    if (text.includes('weekly')) {
      return "Your weekly health report is available in the Reports section. It includes summaries of your heart rate, sleep, activity, and more.";
    } else if (text.includes('monthly')) {
      return "Monthly reports provide a comprehensive overview of your health trends over the past month. Check them out in Reports.";
    }
    return "You can view various health reports in the Reports section, including weekly summaries, monthly trends, and specific metrics.";
  };

  // Generic response
  const getGenericResponse = (text) => {
    const responses = [
      "I understand you're asking about your health. Could you be more specific? You can ask about dosha, heart rate, sleep, stress, diet, or exercise.",
      "I'm here to help with your health questions. Feel free to ask about your health metrics, Ayurveda, lifestyle tips, or device support.",
      "That's a good question! To give you the best answer, could you provide more details about what you'd like to know?",
      "I can help with various health topics. Try asking about your dosha, current health metrics, or getting personalized recommendations.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Get user data (mock for now)
  const getUserData = async () => {
    // This would normally come from Redux store
    return {
      prakriti: { dominant: 'pitta' },
      currentReadings: { heartRate: 72 },
      sleep: { duration: 7.2, quality: 70 },
      stress: { level: 45 },
    };
  };

  // Mark messages as read
  const markAsRead = useCallback(() => {
    setMessages(prev => {
      const updated = prev.map(m => ({ ...m, read: true }));
      saveChatHistory(updated);
      return updated;
    });
    setUnreadCount(0);
  }, []);

  // Clear chat history
  const clearHistory = useCallback(() => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all chat history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([]);
            addWelcomeMessage();
            setUnreadCount(0);
          },
        },
      ]
    );
  }, []);

  // Toggle chat open/closed
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      markAsRead();
    }
  }, [isOpen, markAsRead]);

  // Send quick reply
  const sendQuickReply = useCallback((reply) => {
    sendMessage(reply.text);
  }, [sendMessage]);

  return {
    // State
    messages,
    isTyping,
    isOpen,
    unreadCount,
    context,

    // Methods
    sendMessage,
    sendQuickReply,
    markAsRead,
    clearHistory,
    toggleChat,
  };
};

export default useChatbot;