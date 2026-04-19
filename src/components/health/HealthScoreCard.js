import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressCircle } from '../charts/ProgressCircle';

import colors from '../../utils/constants/colors';

const HealthScoreCard = ({
  score = 75,
  previousScore = 70,
  factors = [],
  recommendations = [],
  onPress,
  showDetails = false,
  size = 'medium',
  style,
}) => {
  
  const getScoreColor = () => {
    if (score >= 80) return colors.successGreen;
    if (score >= 60) return colors.primaryGreen;
    if (score >= 40) return colors.warningYellow;
    return colors.alertRed;
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const getScoreDescription = () => {
    if (score >= 80) {
      return 'Your health metrics are excellent! Keep up the great work.';
    } else if (score >= 60) {
      return 'Good overall health with some areas for improvement.';
    } else if (score >= 40) {
      return 'Your health score indicates room for improvement.';
    } else {
      return 'Attention needed. Consider consulting a healthcare provider.';
    }
  };

  const scoreColor = getScoreColor();
  const scoreLabel = getScoreLabel();
  const change = score - previousScore;
  const changeColor = change > 0 ? colors.successGreen : change < 0 ? colors.alertRed : colors.textTertiary;
  const changeIcon = change > 0 ? 'arrow-up' : change < 0 ? 'arrow-down' : 'remove';

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <LinearGradient
        colors={[scoreColor, `${scoreColor}CC`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Health Score</Text>
          <View style={styles.changeContainer}>
            <Ionicons name={changeIcon} size={14} color="white" />
            <Text style={styles.changeText}>
              {change > 0 ? '+' : ''}{change} pts
            </Text>
          </View>
        </View>

        <View style={styles.scoreContainer}>
          <ProgressCircle
            progress={score}
            size={120}
            strokeWidth={8}
            color="white"
            backgroundColor="rgba(255,255,255,0.2)"
            showPercentage={false}
          >
            <View style={styles.scoreInner}>
              <Text style={styles.scoreValue}>{score}</Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
          </ProgressCircle>

          <View style={styles.scoreInfo}>
            <Text style={styles.scoreLabel}>{scoreLabel}</Text>
            <Text style={styles.scoreDescription}>{getScoreDescription()}</Text>
          </View>
        </View>

        {showDetails && (
          <>
            {/* Factors */}
            {factors.length > 0 && (
              <View style={styles.factorsContainer}>
                <Text style={styles.factorsTitle}>Contributing Factors</Text>
                {factors.map((factor, index) => (
                  <View key={index} style={styles.factorItem}>
                    <View style={[styles.factorDot, { backgroundColor: factor.color || colors.primarySaffron }]} />
                    <Text style={styles.factorLabel}>{factor.label}</Text>
                    <Text style={[styles.factorValue, { color: factor.color || colors.primarySaffron }]}>
                      {factor.value}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <View style={styles.recommendationsContainer}>
                <Text style={styles.recommendationsTitle}>Recommendations</Text>
                {recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Ionicons name="bulb" size={16} color={colors.warningYellow} />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Heart</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>78%</Text>
            <Text style={styles.statLabel}>Sleep</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>92%</Text>
            <Text style={styles.statLabel}>Activity</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>70%</Text>
            <Text style={styles.statLabel}>Stress</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const CompactHealthScore = ({ score, onPress }) => {
  const scoreColor = score >= 80 ? colors.successGreen : score >= 60 ? colors.primaryGreen : score >= 40 ? colors.warningYellow : colors.alertRed;

  return (
    <TouchableOpacity style={styles.compactContainer} onPress={onPress}>
      <LinearGradient
        colors={[scoreColor, `${scoreColor}CC`]}
        style={styles.compactGradient}
      >
        <Text style={styles.compactLabel}>Health Score</Text>
        <Text style={styles.compactScore}>{score}</Text>
        <Text style={styles.compactMax}>/100</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const DetailedHealthScore = ({ score, factors, recommendations }) => {
  const scoreColor = score >= 80 ? colors.successGreen : score >= 60 ? colors.primaryGreen : score >= 40 ? colors.warningYellow : colors.alertRed;

  return (
    <View style={styles.detailedContainer}>
      <View style={styles.detailedHeader}>
        <ProgressCircle
          progress={score}
          size={80}
          strokeWidth={6}
          color={scoreColor}
        >
          <Text style={styles.detailedScore}>{score}</Text>
        </ProgressCircle>
        <View style={styles.detailedInfo}>
          <Text style={styles.detailedTitle}>Overall Health Score</Text>
          <Text style={styles.detailedSubtitle}>
            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Attention'}
          </Text>
        </View>
      </View>

      <View style={styles.detailedFactors}>
        <Text style={styles.detailedFactorsTitle}>Health Metrics</Text>
        {factors.map((factor, index) => (
          <View key={index} style={styles.detailedFactor}>
            <Text style={styles.detailedFactorLabel}>{factor.label}</Text>
            <View style={styles.detailedFactorBar}>
              <View 
                style={[
                  styles.detailedFactorFill,
                  { 
                    width: `${factor.value}%`,
                    backgroundColor: factor.value >= 80 ? colors.successGreen :
                                   factor.value >= 60 ? colors.primaryGreen :
                                   factor.value >= 40 ? colors.warningYellow :
                                   colors.alertRed
                  }
                ]} 
              />
            </View>
            <Text style={styles.detailedFactorValue}>{factor.value}%</Text>
          </View>
        ))}
      </View>

      <View style={styles.detailedRecommendations}>
        <Text style={styles.detailedRecTitle}>Recommendations</Text>
        {recommendations.map((rec, index) => (
          <View key={index} style={styles.detailedRecItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.detailedRecText}>{rec}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: 'white',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: 'white',
    marginLeft: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreInner: {
    alignItems: 'center',
  },
  scoreValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: 'white',
  },
  scoreMax: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.7,
  },
  scoreInfo: {
    flex: 1,
    marginLeft: 16,
  },
  scoreLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
    marginBottom: 4,
  },
  scoreDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: 'white',
    opacity: 0.7,
  },
  factorsContainer: {
    marginBottom: 16,
  },
  factorsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  factorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  factorLabel: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
  },
  factorValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  recommendationsContainer: {
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  recommendationText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    marginLeft: 8,
  },
  compactContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
  },
  compactGradient: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: 'white',
    opacity: 0.8,
    marginBottom: 4,
  },
  compactScore: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
  },
  compactMax: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: 'white',
    opacity: 0.6,
  },
  detailedContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  detailedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailedScore: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.textPrimary,
  },
  detailedInfo: {
    marginLeft: 16,
    flex: 1,
  },
  detailedTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  detailedSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  detailedFactors: {
    marginBottom: 20,
  },
  detailedFactorsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  detailedFactor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailedFactorLabel: {
    width: 80,
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  detailedFactorBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  detailedFactorFill: {
    height: '100%',
    borderRadius: 3,
  },
  detailedFactorValue: {
    width: 35,
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  detailedRecommendations: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 16,
  },
  detailedRecTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  detailedRecItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailedRecText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});

export default HealthScoreCard;