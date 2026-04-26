import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Markdown from 'react-native-markdown-display';

import colors from '../../utils/constants/colors';
import QuickReplies from './QuickReplies';

const MessageBubble = ({
  message,
  isLast = false,
  onQuickReply,
  showTimestamp = true,
  showAvatar = true,
  showActions = true,
  onAction,
  onFeedback,
}) => {
  
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const isBot = message.sender === 'bot';
  const isUser = message.sender === 'user';

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handlePress = () => {
    if (message.expandable) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      setExpanded(!expanded);
    }
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    onFeedback?.(message.id, type);
  };

  const handleAction = (action) => {
    onAction?.(message.id, action);
  };

  const renderText = () => {
    if (message.type === 'markdown') {
      return (
        <Markdown style={markdownStyles}>
          {message.text}
        </Markdown>
      );
    }

    return (
      <Text style={[
        styles.messageText,
        isBot && styles.botMessageText,
        isUser && styles.userMessageText,
      ]}>
        {message.text}
      </Text>
    );
  };

  const renderActions = () => {
    if (!showActions || !message.actions) return null;

    return (
      <View style={styles.actionsContainer}>
        {message.actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionButton,
              { backgroundColor: action.color || colors.primarySaffron },
            ]}
            onPress={() => handleAction(action)}
          >
            {action.icon && (
              <Ionicons name={action.icon} size={16} color="white"style={styles.actionIcon} />
            )}
            <Text style={styles.actionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderFeedback = () => {
    if (!isBot || feedback) return null;

    return (
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackLabel}>Was this helpful?</Text>
        <View style={styles.feedbackButtons}>
          <TouchableOpacity
            style={[styles.feedbackButton, feedback === 'yes' && styles.feedbackButtonActive]}
            onPress={() => handleFeedback('yes')}
          >
            <Ionicons name="thumbs-up"size={16} color={feedback === 'yes' ? colors.successGreen : colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.feedbackButton, feedback === 'no' && styles.feedbackButtonActive]}
            onPress={() => handleFeedback('no')}
          >
            <Ionicons name="thumbs-down"size={16} color={feedback === 'no' ? colors.alertRed : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderQuickReplies = () => {
    if (!message.quickReplies || message.quickReplies.length === 0) return null;

    return (
      <QuickReplies
        suggestions={message.quickReplies.map(text => ({ id: text, text }))}
        onSelect={onQuickReply}
      />
    );
  };

  const renderMetadata = () => {
    if (!message.metadata) return null;

    return (
      <View style={styles.metadataContainer}>
        {message.metadata.map((item, index) => (
          <View key={index} style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>{item.label}:</Text>
            <Text style={styles.metadataValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderExpandedContent = () => {
    if (!expanded || !message.expandedContent) return null;

    return (
      <View style={styles.expandedContent}>
        <Text style={styles.expandedText}>{message.expandedContent}</Text>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        isBot && styles.botContainer,
        isUser && styles.userContainer,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {/* Avatar */}
      {showAvatar && isBot && (
        <View style={styles.avatarContainer}>
          <Ionicons name={message.avatar || 'logo-electron'} size={20} color={colors.primaryGreen} />
        </View>
      )}

      {/* Message Content */}
      <View style={[styles.bubbleContainer, isBot && styles.botBubbleContainer]}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={message.expandable ? 0.7 : 1}
          style={[
            styles.bubble,
            isBot && styles.botBubble,
            isUser && styles.userBubble,
            message.type === 'system' && styles.systemBubble,
            expanded && styles.bubbleExpanded,
          ]}
        >
          {renderText()}
          {renderMetadata()}
          {renderExpandedContent()}
        </TouchableOpacity>

        {/* Actions */}
        {renderActions()}

        {/* Quick Replies */}
        {renderQuickReplies()}

        {/* Feedback */}
        {renderFeedback()}

        {/* Timestamp */}
        {showTimestamp && (
          <Text style={[
            styles.timestamp,
            isBot && styles.botTimestamp,
            isUser && styles.userTimestamp,
          ]}>
            {formatTime(message.timestamp)}
          </Text>
        )}
      </View>

      {/* User Avatar */}
      {showAvatar && isUser && (
        <View style={styles.avatarContainer}>
          <Ionicons name={message.avatar || 'person-circle-outline'} size={20} color={colors.primarySaffron} />
        </View>
      )}
    </Animated.View>
  );
};

export const BotMessage = (props) => (
  <MessageBubble {...props} sender="bot" />
);

export const UserMessage = (props) => (
  <MessageBubble {...props} sender="user" />
);

export const SystemMessage = ({ text, ...props }) => (
  <MessageBubble
    {...props}
    message={{ text, sender: 'system', type: 'system' }}
  />
);

export const ImageMessage = ({ image, caption, ...props }) => (
  <MessageBubble
    {...props}
    message={{
      ...props.message,
      type: 'image',
      image,
      caption,
    }}
  />
);

const markdownStyles = {
  body: {
    color: colors.textPrimary,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
  },
  strong: {
    fontFamily: 'Inter-Bold',
  },
  em: {
    fontStyle: 'italic',
  },
  link: {
    color: colors.primarySaffron,
    textDecorationLine: 'underline',
  },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  botContainer: {
    justifyContent: 'flex-start',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatar: {
    fontSize: 18,
  },
  bubbleContainer: {
    flex: 1,
    maxWidth: '70%',
  },
  botBubbleContainer: {
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  botBubble: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: colors.primarySaffron,
    borderTopRightRadius: 4,
    alignSelf: 'flex-end',
  },
  systemBubble: {
    backgroundColor: colors.textSecondary + '20',
    alignSelf: 'center',
    maxWidth: '90%',
  },
  bubbleExpanded: {
    backgroundColor: '#F0F0F0',
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 20,
  },
  botMessageText: {
    color: colors.textPrimary,
  },
  userMessageText: {
    color: 'white',
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 4,
    marginHorizontal: 4,
  },
  botTimestamp: {
    textAlign: 'left',
  },
  userTimestamp: {
    textAlign: 'right',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  actionIcon: {
    marginRight: 4,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  feedbackLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    marginRight: 8,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackButtonActive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  metadataContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  metadataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metadataLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  metadataValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.textPrimary,
  },
  expandedContent: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  expandedText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default MessageBubble;