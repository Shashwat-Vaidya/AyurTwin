import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../utils/constants/colors';

const RiskPredictionCard = ({
  disease,
  riskPercentage,
  level = 'medium', // 'low', 'medium', 'high', 'very low', 'very high'
  icon,
  color,
  onPress,
  showDetails = false,
}) => {
  // Define level colors
  const levelColors = {
    'very low': colors.successGreen,
    low: colors.primaryGreen,
    medium: colors.warningYellow,
    high: colors.tempOrange,
    'very high': colors.alertRed,
  };

  // Get color based on level or provided color
  const barColor = color || levelColors[level] || colors.primarySaffron;

  // Get level text color
  const getLevelColor = () => {
    switch (level) {
      case 'very low':
      case 'low':
        return colors.successGreen;
      case 'medium':
        return colors.warningYellow;
      case 'high':
        return colors.tempOrange;
      case 'very high':
        return colors.alertRed;
      default:
        return colors.textSecondary;
    }
  };

  // Determine number of filled dots (out of 5)
  const getFilledDots = () => {
    if (riskPercentage <= 20) return 1;
    if (riskPercentage <= 40) return 2;
    if (riskPercentage <= 60) return 3;
    if (riskPercentage <= 80) return 4;
    return 5;
  };

  const filledDots = getFilledDots();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[colors.cardBeige, '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Disease name and icon */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${barColor}20` }]}>
            <Ionicons name={icon || 'alert-circle'} size={24} color={barColor} />
          </View>
          <Text style={styles.diseaseName}>{disease}</Text>
        </View>

        {/* Risk percentage and level */}
        <View style={styles.riskContainer}>
          <Text style={[styles.riskPercentage, { color: barColor }]}>
            {riskPercentage}%
          </Text>
          <Text style={[styles.riskLevel, { color: getLevelColor() }]}>
            {level.charAt(0).toUpperCase() + level.slice(1)} Risk
          </Text>
        </View>

        {/* Dot visualization (●●●●○) */}
        <View style={styles.dotContainer}>
          {[1, 2, 3, 4, 5].map((dot) => (
            <View
              key={dot}
              style={[
                styles.dot,
                {
                  backgroundColor: dot <= filledDots ? barColor : colors.disabled,
                  width: dot <= filledDots ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Progress bar alternative */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${riskPercentage}%`, backgroundColor: barColor },
            ]}
          />
        </View>

        {/* Details button (optional) */}
        {showDetails && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
              <Text style={[styles.detailsText, { color: barColor }]}>View Details</Text>
              <Ionicons name="arrow-forward" size={16} color={barColor} />
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  gradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  diseaseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  riskPercentage: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
  },
  riskLevel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.disabled,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginRight: 4,
  },
});

export default RiskPredictionCard;