import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import colors from '../../utils/constants/colors';
import ChatInterface from './ChatInterface';

const { width, height } = Dimensions.get('window');

const ChatbotFloating = ({
  position = 'bottom-right',
  offset = 20,
  size = 60,
  gradientColors = [colors.primarySaffron, '#FFB347'],
  onPress,
  onClose,
  initialMessage = "Hi! I'm AyurBot. How can I help you today?",
  botName = 'AyurBot',
  botAvatar = '',
}) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const badgeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (unreadCount > 0) {
      startBadgeAnimation();
    }
  }, [unreadCount]);

  const startBadgeAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(badgeScale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(badgeScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
    onPress?.();
  };

  const closeChat = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
      onClose?.();
    });
  };

  const getPositionStyle = () => {
    switch(position) {
      case 'bottom-left':
        return { bottom: offset, left: offset };
      case 'top-right':
        return { top: offset, right: offset };
      case 'top-left':
        return { top: offset, left: offset };
      default:
        return { bottom: offset, right: offset };
    }
  };

  const getChatPosition = () => {
    switch(position) {
      case 'bottom-left':
        return { bottom: size + offset + 10, left: offset };
      case 'bottom-right':
        return { bottom: size + offset + 10, right: offset };
      case 'top-left':
        return { top: size + offset + 10, left: offset };
      case 'top-right':
        return { top: size + offset + 10, right: offset };
      default:
        return { bottom: size + offset + 10, right: offset };
    }
  };

  return (
    <View style={[styles.container, getPositionStyle()]}>
      {/* Chat Interface */}
      <Animated.View
        style={[
          styles.chatContainer,
          getChatPosition(),
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
              {
                scale: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
            opacity: slideAnim,
          },
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <BlurView intensity={80} tint="light"style={styles.blurContainer}>
          <ChatInterface
            onClose={closeChat}
            initialMessage={initialMessage}
            botName={botName}
            botAvatar={botAvatar}
          />
        </BlurView>
      </Animated.View>

      {/* Floating Button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={toggleChat}
          activeOpacity={0.8}
          style={styles.touchable}
        >
          <LinearGradient
            colors={gradientColors}
            style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}
          >
            {isOpen ? (
              <Ionicons name="close"size={size * 0.5} color="white" />
            ) : (
              <>
                <Ionicons name="chatbubble"size={size * 0.5} color="white" />
                {unreadCount > 0 && (
                  <Animated.View
                    style={[
                      styles.badge,
                      {
                        transform: [{ scale: badgeScale }],
                      },
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </Animated.View>
                )}
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export const ChatbotIcon = ({ onPress, size = 50, color = colors.primarySaffron }) => (
  <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
    <LinearGradient
      colors={[color, `${color}CC`]}
      style={[styles.icon, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <Ionicons name="chatbubble"size={size * 0.5} color="white" />
    </LinearGradient>
  </TouchableOpacity>
);

export const ChatbotMinimized = ({ onPress, lastMessage }) => (
  <TouchableOpacity style={styles.minimizedContainer} onPress={onPress}>
    <LinearGradient
      colors={[colors.primarySaffron, colors.primaryGreen]}
      style={styles.minimizedIcon}
    >
      <Ionicons name="chatbubble"size={24} color="white" />
    </LinearGradient>
    <View style={styles.minimizedContent}>
      <Text style={styles.minimizedTitle}>AyurBot</Text>
      <Text style={styles.minimizedMessage} numberOfLines={1}>
        {lastMessage || "How can I help you?"}
      </Text>
    </View>
    <Ionicons name="chevron-up"size={20} color={colors.textSecondary} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  buttonContainer: {
    position: 'absolute',
    zIndex: 1001,
  },
  touchable: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.alertRed,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: 'white',
  },
  chatContainer: {
    position: 'absolute',
    width: width * 0.9,
    maxWidth: 350,
    height: height * 0.7,
    maxHeight: 500,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  iconContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  minimizedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  minimizedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  minimizedContent: {
    flex: 1,
  },
  minimizedTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  minimizedMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
});

export default ChatbotFloating;