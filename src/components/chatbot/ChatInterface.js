import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import QuickReplies from './QuickReplies';

const ChatInterface = ({
  onClose,
  initialMessage = "Hi! I'm AyurBot. How can I help you today?",
  botName = 'AyurBot',
  botAvatar = 'logo-electron',
  userAvatar = 'person-circle-outline',
  onSendMessage,
  onQuickReply,
  customActions,
  showTypingIndicator = true,
  showQuickReplies = true,
  quickReplies = [
    { id: '1', text: 'Tell me about my dosha', icon: 'leaf' },
    { id: '2', text: 'Explain my health metrics', icon: 'heart' },
    { id: '3', text: 'Suggest lifestyle changes', icon: 'fitness' },
    { id: '4', text: 'Help with device', icon: 'hardware-chip' },
  ],
}) => {
  
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: initialMessage,
      sender: 'bot',
      timestamp: new Date(),
      avatar: botAvatar,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      avatar: userAvatar,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Show typing indicator
    if (showTypingIndicator) {
      setIsTyping(true);
    }

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Process message
    try {
      if (onSendMessage) {
        await onSendMessage(userMessage);
      } else {
        // Default response logic
        setTimeout(() => {
          const botResponse = generateBotResponse(userMessage.text);
          const botMessage = {
            id: (Date.now() + 1).toString(),
            text: botResponse.text,
            sender: 'bot',
            timestamp: new Date(),
            avatar: botAvatar,
            quickReplies: botResponse.quickReplies,
          };
          
          setIsTyping(false);
          setMessages(prev => [...prev, botMessage]);
          
          if (botResponse.suggestions) {
            setSuggestions(botResponse.suggestions);
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const generateBotResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return {
        text: "Hello! How can I assist you with your health today?",
        quickReplies: ['Check vitals', 'Dosha info', 'Health tips'],
      };
    } else if (lowerMsg.includes('dosha')) {
      return {
        text: "Your dominant dosha appears to be Pitta. Would you like to learn more about Pitta dosha?",
        quickReplies: ['What is Pitta?', 'Pitta diet', 'Pitta lifestyle'],
      };
    } else if (lowerMsg.includes('heart') || lowerMsg.includes('hr')) {
      return {
        text: "Your heart rate is currently 72 bpm, which is within normal range. Would you like to see your heart rate trends?",
        quickReplies: ['View trends', 'Set alert', 'Learn more'],
      };
    } else if (lowerMsg.includes('sleep')) {
      return {
        text: "You slept for 7.2 hours last night. Sleep quality was good. Need tips for better sleep?",
        quickReplies: ['Sleep tips', 'View sleep data', 'Set bedtime'],
      };
    } else if (lowerMsg.includes('stress')) {
      return {
        text: "Your stress level is currently 45, which is moderate. Try some breathing exercises to relax.",
        quickReplies: ['Breathing exercise', 'Meditation', 'Stress tips'],
      };
    } else {
      return {
        text: "I understand you're asking about your health. Could you be more specific? You can ask about your dosha, heart rate, sleep, stress, or get lifestyle recommendations.",
        quickReplies: ['My dosha', 'Heart rate', 'Sleep', 'Stress'],
      };
    }
  };

  const handleQuickReply = (reply) => {
    const quickReplyMessage = {
      id: Date.now().toString(),
      text: reply.text,
      sender: 'user',
      timestamp: new Date(),
      avatar: userAvatar,
      isQuickReply: true,
    };

    setMessages(prev => [...prev, quickReplyMessage]);
    
    if (onQuickReply) {
      onQuickReply(reply);
    } else {
      // Simulate bot response to quick reply
      setIsTyping(true);
      setTimeout(() => {
        const botResponse = generateBotResponse(reply.text);
        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: botResponse.text,
          sender: 'bot',
          timestamp: new Date(),
          avatar: botAvatar,
          quickReplies: botResponse.quickReplies,
        };
        
        setIsTyping(false);
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  const renderMessage = ({ item, index }) => (
    <MessageBubble
      message={item}
      isLast={index === messages.length - 1}
      onQuickReply={handleQuickReply}
    />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.headerAvatar}>{botAvatar}</Text>
            <View>
              <Text style={styles.headerTitle}>{botName}</Text>
              <Text style={styles.headerStatus}>Online</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}

        {/* Quick Replies */}
        {showQuickReplies && !isTyping && (
          <QuickReplies
            suggestions={quickReplies}
            onSelect={handleQuickReply}
          />
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor={colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? colors.primarySaffron : colors.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export const HealthChatInterface = ({ userId, ...props }) => {
  const [healthContext, setHealthContext] = useState(null);

  useEffect(() => {
    // Load user health context
    loadHealthContext();
  }, []);

  const loadHealthContext = async () => {
    // Simulate loading health data
    setHealthContext({
      dosha: 'Pitta',
      heartRate: 72,
      sleep: 7.2,
      stress: 45,
    });
  };

  const handleSendMessage = async (message) => {
    // Custom logic with health context
    console.log('Health context:', healthContext);
    // Send to AI service with context
  };

  return (
    <ChatInterface
      onSendMessage={handleSendMessage}
      initialMessage={`Hi! I can see you're a ${healthContext?.dosha} dominant person. How can I help you today?`}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
  },
  headerStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  closeButton: {
    padding: 4,
  },
  messagesList: {
    padding: 16,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatInterface;