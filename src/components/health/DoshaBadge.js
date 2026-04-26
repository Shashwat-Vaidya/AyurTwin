import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const DoshaBadge = ({
  dosha,
  size = 'medium',
  showIcon = true,
  showLabel = true,
  onPress,
  style,
}) => {
  
  const doshaConfig = {
    vata: {
      name: 'Vata',
      color: colors.vata,
      lightColor: `${colors.vata}20`,
      icon: 'leaf',
      emoji: '',
      description: 'Air & Space - Creative, energetic',
    },
    pitta: {
      name: 'Pitta',
      color: colors.pitta,
      lightColor: `${colors.pitta}20`,
      icon: 'flame',
      emoji: '',
      description: 'Fire & Water - Intense, focused',
    },
    kapha: {
      name: 'Kapha',
      color: colors.kapha,
      lightColor: `${colors.kapha}20`,
      icon: 'water',
      emoji: '',
      description: 'Water & Earth - Calm, stable',
    },
  };

  const getSizeStyles = () => {
    switch(size) {
      case 'small':
        return {
          container: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
          icon: 12,
          fontSize: 10,
          emojiSize: 12,
        };
      case 'large':
        return {
          container: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25 },
          icon: 20,
          fontSize: 16,
          emojiSize: 20,
        };
      default:
        return {
          container: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
          icon: 16,
          fontSize: 14,
          emojiSize: 16,
        };
    }
  };

  const config = doshaConfig[dosha] || doshaConfig.vata;
  const sizeStyles = getSizeStyles();

  const BadgeContent = () => (
    <View style={[
      styles.container,
      sizeStyles.container,
      { backgroundColor: config.lightColor },
      style,
    ]}>
      {showIcon && (
        <Ionicons name={config.icon} size={sizeStyles.icon} color={config.color} style={{ marginRight: 4 }} />
      )}
      {showLabel && (
        <Text style={[styles.label, { fontSize: sizeStyles.fontSize, color: config.color }]}>
          {config.name}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <BadgeContent />
      </TouchableOpacity>
    );
  }

  return <BadgeContent />;
};

export const VataBadge = (props) => <DoshaBadge dosha="vata" {...props} />;
export const PittaBadge = (props) => <DoshaBadge dosha="pitta" {...props} />;
export const KaphaBadge = (props) => <DoshaBadge dosha="kapha" {...props} />;

export const DoshaStack = ({ doshas, limit = 3, size = 'small' }) => {
  const displayDoshas = doshas.slice(0, limit);
  const remaining = doshas.length - limit;

  return (
    <View style={styles.stackContainer}>
      {displayDoshas.map((dosha, index) => (
        <View key={index} style={[styles.stackItem, { marginLeft: index > 0 ? -8 : 0 }]}>
          <DoshaBadge dosha={dosha} size={size} showLabel={false} />
        </View>
      ))}
      {remaining > 0 && (
        <View style={[styles.stackItem, { marginLeft: -8 }]}>
          <View style={[styles.remainingBadge, { backgroundColor: colors.textTertiary }]}>
            <Text style={styles.remainingText}>+{remaining}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  emoji: {
    marginRight: 2,
  },
  stackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackItem: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  remainingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: 'white',
  },
});

export default DoshaBadge;