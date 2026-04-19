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

import colors from '../../utils/constants/colors';

const RiskPredictionCard = ({ 
  risk, 
  onPress, 
  showDetails = false,
  disease,
  riskPercentage,
  level = 'medium',
  icon,
  color,
}) => {
  const [expanded, setExpanded] = useState(showDetails);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const riskData = risk || {
    name: disease,
    risk: riskPercentage,
    level: level,
    icon: icon,
    color: color,
  };

  const handlePress = () => {
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

    if (onPress) {
      onPress(riskData);
    } else {
      setExpanded(!expanded);
    }
  };

  const getRiskColor = () => {
    if (riskData.color) return riskData.color;
    
    const percentage = riskData.risk || riskData.riskPercentage || 0;
    if (percentage >= 70) return colors.alertRed;
    if (percentage >= 40) return colors.warningYellow;
    if (percentage >= 20) return colors.spO2Blue;
    return colors.successGreen;
  };

  const getRiskLevel = () => {
    if (riskData.level) {
      return riskData.level.charAt(0).toUpperCase() + riskData.level.slice(1) + ' Risk';
    }
    
    const percentage = riskData.risk || riskData.riskPercentage || 0;
    if (percentage >= 70) return 'High Risk';
    if (percentage >= 40) return 'Moderate Risk';
    if (percentage >= 20) return 'Low Risk';
    return 'Very Low Risk';
  };

  const getRiskIcon = () => {
    if (riskData.icon) return riskData.icon;
    
    const percentage = riskData.risk || riskData.riskPercentage || 0;
    if (percentage >= 70) return 'warning';
    if (percentage >= 40) return 'alert';
    return 'information-circle';
  };

  const getRecommendations = () => {
    const name = riskData.name?.toLowerCase() || riskData.disease?.toLowerCase() || '';
    if (name.includes('diabetes')) {
      return 'Monitor blood sugar, maintain healthy diet, exercise regularly';
    }
    if (name.includes('heart')) {
      return 'Regular checkups, healthy diet, stress management';
    }
    if (name.includes('stress') || name.includes('anxiety')) {
      return 'Practice meditation, ensure adequate sleep, take breaks';
    }
    if (name.includes('sleep')) {
      return 'Maintain sleep schedule, avoid screens before bed';
    }
    if (name.includes('hypertension')) {
      return 'Reduce salt intake, monitor blood pressure, regular exercise';
    }
    if (name.includes('asthma')) {
      return 'Avoid triggers, keep inhaler handy, practice breathing exercises';
    }
    if (name.includes('arthritis')) {
      return 'Gentle exercise, maintain healthy weight, joint protection';
    }
    if (name.includes('obesity')) {
      return 'Balanced diet, regular exercise, portion control';
    }
    if (name.includes('digestive')) {
      return 'Eat regular meals, avoid trigger foods, stay hydrated';
    }
    return 'Consult with healthcare provider for personalized advice';
  };

  const riskColor = getRiskColor();
  const riskLevel = getRiskLevel();
  const riskIcon = getRiskIcon();
  const percentage = riskData.risk || riskData.riskPercentage || 0;

  const getFilledDots = () => {
    if (percentage <= 20) return 1;
    if (percentage <= 40) return 2;
    if (percentage <= 60) return 3;
    if (percentage <= 80) return 4;
    return 5;
  };

  const filledDots = getFilledDots();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={styles.container}
      >
        <LinearGradient
          colors={[colors.cardBeige, '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: `${riskColor}20` }]}>
              <Ionicons name={riskIcon} size={24} color={riskColor} />
            </View>
            <Text style={styles.diseaseName} numberOfLines={1}>
              {riskData.name || riskData.disease || 'Health Risk'}
            </Text>
          </View>

          <View style={styles.riskContainer}>
            <Text style={[styles.riskPercentage, { color: riskColor }]}>
              {percentage}%
            </Text>
            <Text style={[styles.riskLevel, { color: riskColor }]}>
              {riskLevel}
            </Text>
          </View>

          <View style={styles.dotContainer}>
            {[1, 2, 3, 4, 5].map((dot) => (
              <View
                key={dot}
                style={[
                  styles.dot,
                  {
                    backgroundColor: dot <= filledDots ? riskColor : colors.disabled,
                    width: dot <= filledDots ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${percentage}%`, backgroundColor: riskColor },
              ]}
            />
          </View>

          {riskData.factors && riskData.factors.length > 0 && (
            <View style={styles.factorsContainer}>
              <Text style={styles.factorsTitle}>Contributing Factors:</Text>
              <View style={styles.factorsList}>
                {riskData.factors.map((factor, index) => (
                  <View key={index} style={styles.factorItem}>
                    <Ionicons name="alert-circle" size={12} color={colors.textTertiary} />
                    <Text style={styles.factorText}>{factor}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {expanded && (
            <View style={styles.expandedContent}>
              <View style={styles.recommendationSection}>
                <Ionicons name="bulb" size={16} color={colors.warningYellow} />
                <Text style={styles.recommendationText}>
                  {riskData.recommendation || getRecommendations()}
                </Text>
              </View>

              <View style={styles.nextSteps}>
                <Text style={styles.nextStepsTitle}>Next Steps:</Text>
                <View style={styles.stepItem}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.primaryGreen} />
                  <Text style={styles.stepText}>Monitor regularly</Text>
                </View>
                <View style={styles.stepItem}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.primaryGreen} />
                  <Text style={styles.stepText}>Consult specialist if persistent</Text>
                </View>
                <View style={styles.stepItem}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.primaryGreen} />
                  <Text style={styles.stepText}>Lifestyle modifications</Text>
                </View>
              </View>

              <View style={styles.actionContainer}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: riskColor }]}
                  onPress={() => console.log('Learn more', riskData.name)}
                >
                  <Text style={styles.actionButtonText}>Learn More</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dismissButton}
                  onPress={() => console.log('Track', riskData.name)}
                >
                  <Text style={styles.dismissText}>Track</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={styles.expandIndicator}
            onPress={() => setExpanded(!expanded)}
          >
            <Text style={styles.expandText}>
              {expanded ? 'Show less' : 'Show details'}
            </Text>
            <Ionicons 
              name={expanded ? 'chevron-up' : 'chevron-down'} 
              size={16} 
              color={colors.textTertiary} 
            />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const HighRiskCard = (props) => (
  <RiskPredictionCard {...props} color={colors.alertRed} />
);

export const ModerateRiskCard = (props) => (
  <RiskPredictionCard {...props} color={colors.warningYellow} />
);

export const LowRiskCard = (props) => (
  <RiskPredictionCard {...props} color={colors.successGreen} />
);

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
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  factorsContainer: {
    marginBottom: 12,
  },
  factorsTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  factorsList: {
    marginLeft: 4,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  factorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginLeft: 6,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  recommendationSection: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  recommendationText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.warningYellow,
    marginLeft: 8,
    lineHeight: 18,
  },
  nextSteps: {
    marginBottom: 16,
  },
  nextStepsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  actionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: 'white',
  },
  dismissButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dismissText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  expandIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  expandText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginRight: 4,
  },
});

export default RiskPredictionCard;