import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const { width } = Dimensions.get('window');

const QuickReplies = ({
  suggestions = [],
  onSelect,
  maxSuggestions = 8,
  columns = 1,
  showIcons = true,
  showClose = true,
  onClose,
  backgroundColor = 'white',
  textColor = colors.textPrimary,
  activeColor = colors.primarySaffron,
  style,
  itemStyle,
  textStyle,
}) => {
  
  const [selectedId, setSelectedId] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = (suggestion) => {
    setSelectedId(suggestion.id);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onSelect?.(suggestion);
  };

  const renderSuggestion = (suggestion) => (
    <TouchableOpacity
      key={suggestion.id}
      style={[
        styles.suggestionItem,
        {
          backgroundColor: selectedId === suggestion.id ? activeColor : backgroundColor,
          borderColor: activeColor,
        },
        columns === 1 ? styles.fullWidth : styles.halfWidth,
        itemStyle,
      ]}
      onPress={() => handlePress(suggestion)}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.suggestionContent,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {showIcons && suggestion.icon && (
          <Ionicons
            name={suggestion.icon}
            size={20}
            color={selectedId === suggestion.id ? 'white' : activeColor}
            style={styles.suggestionIcon}
          />
        )}
        <Text
          style={[
            styles.suggestionText,
            { color: selectedId === suggestion.id ? 'white' : textColor },
            textStyle,
          ]}
          numberOfLines={2}
        >
          {suggestion.text}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );

  const displayedSuggestions = suggestions.slice(0, maxSuggestions);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Quick Replies</Text>
        {showClose && onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {columns === 1 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          <View style={styles.row}>
            {displayedSuggestions.map(renderSuggestion)}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.grid}>
          {displayedSuggestions.map(renderSuggestion)}
        </View>
      )}
    </View>
  );
};

export const ChatQuickReplies = ({ onSelect, onClose }) => {
  const suggestions = [
    { id: '1', text: 'Tell me about my dosha', icon: 'leaf' },
    { id: '2', text: 'Check my heart rate', icon: 'heart' },
    { id: '3', text: 'Sleep analysis', icon: 'moon' },
    { id: '4', text: 'Stress relief tips', icon: 'flash' },
    { id: '5', text: 'Diet recommendations', icon: 'restaurant' },
    { id: '6', text: 'Exercise suggestions', icon: 'fitness' },
  ];

  return (
    <QuickReplies
      suggestions={suggestions}
      onSelect={onSelect}
      onClose={onClose}
      columns={2}
    />
  );
};

export const HealthQuickReplies = ({ onSelect, dosha }) => {
  const getDoshaSuggestions = () => {
    switch(dosha) {
      case 'vata':
        return [
          { id: 'v1', text: 'Grounding foods', icon: 'restaurant' },
          { id: 'v2', text: 'Warm oil massage', icon: 'body' },
          { id: 'v3', text: 'Regular routine', icon: 'time' },
        ];
      case 'pitta':
        return [
          { id: 'p1', text: 'Cooling foods', icon: 'restaurant' },
          { id: 'p2', text: 'Avoid midday sun', icon: 'sunny' },
          { id: 'p3', text: 'Moderate exercise', icon: 'fitness' },
        ];
      case 'kapha':
        return [
          { id: 'k1', text: 'Light diet', icon: 'restaurant' },
          { id: 'k2', text: 'Vigorous exercise', icon: 'fitness' },
          { id: 'k3', text: 'Early rising', icon: 'sunny' },
        ];
      default:
        return [
          { id: '1', text: 'Dosha quiz', icon: 'leaf' },
          { id: '2', text: 'Balancing tips', icon: 'leaf' },
        ];
    }
  };

  return (
    <QuickReplies
      suggestions={getDoshaSuggestions()}
      onSelect={onSelect}
      columns={1}
    />
  );
};

export const MetricQuickReplies = ({ onSelect }) => {
  const suggestions = [
    { id: '1', text: 'Heart rate trends', icon: 'heart', metric: 'heart' },
    { id: '2', text: 'Sleep quality', icon: 'moon', metric: 'sleep' },
    { id: '3', text: 'Stress levels', icon: 'flash', metric: 'stress' },
    { id: '4', text: 'Activity stats', icon: 'walk', metric: 'activity' },
    { id: '5', text: 'Blood oxygen', icon: 'fitness', metric: 'spo2' },
    { id: '6', text: 'Temperature', icon: 'thermometer', metric: 'temp' },
  ];

  return (
    <QuickReplies
      suggestions={suggestions}
      onSelect={onSelect}
      columns={2}
    />
  );
};

export const AyurvedaQuickReplies = ({ onSelect }) => {
  const suggestions = [
    { id: '1', text: 'What is Ayurveda?', icon: 'leaf' },
    { id: '2', text: 'The three doshas', icon: 'body' },
    { id: '3', text: 'Dinacharya (daily routine)', icon: 'sunny' },
    { id: '4', text: 'Ritucharya (seasonal)', icon: 'calendar' },
    { id: '5', text: 'Ayurvedic herbs', icon: 'leaf' },
    { id: '6', text: 'Panchakarma', icon: 'water' },
  ];

  return (
    <QuickReplies
      suggestions={suggestions}
      onSelect={onSelect}
      columns={2}
    />
  );
};

export const EmergencyQuickReplies = ({ onSelect }) => {
  const suggestions = [
    { id: '1', text: 'Contact emergency', icon: 'alert-circle', color: colors.alertRed },
    { id: '2', text: 'Find nearest hospital', icon: 'location', color: colors.alertRed },
    { id: '3', text: 'Call doctor', icon: 'call', color: colors.warningYellow },
    { id: '4', text: 'Share location', icon: 'share', color: colors.warningYellow },
  ];

  return (
    <QuickReplies
      suggestions={suggestions}
      onSelect={onSelect}
      columns={2}
      activeColor={colors.alertRed}
    />
  );
};

export const FeedbackQuickReplies = ({ onSelect }) => {
  const suggestions = [
    { id: '1', text: '👍 Helpful', icon: 'thumbs-up' },
    { id: '2', text: '👎 Not helpful', icon: 'thumbs-down' },
    { id: '3', text: '⭐ More info', icon: 'star' },
    { id: '4', text: '📞 Contact support', icon: 'headset' },
  ];

  return (
    <QuickReplies
      suggestions={suggestions}
      onSelect={onSelect}
      columns={2}
      showIcons={true}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  suggestionItem: {
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 4,
    marginVertical: 4,
    overflow: 'hidden',
  },
  fullWidth: {
    width: 'auto',
    minWidth: 100,
  },
  halfWidth: {
    width: (width - 48) / 2,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  suggestionIcon: {
    marginRight: 6,
  },
  suggestionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    flex: 1,
  },
});

export default QuickReplies;