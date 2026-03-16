import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const { width } = Dimensions.get('window');

const RiskMeter = ({
  value = 45,
  maxValue = 100,
  size = 200,
  thickness = 20,
  showValue = true,
  showLabel = true,
  label = 'Risk Level',
  thresholds = {
    low: 33,
    medium: 66,
    high: 100,
  },
  colors: customColors,
  animated = true,
  animationDuration = 1000,
  style,
}) => {
  
  const percentage = (value / maxValue) * 100;
  const strokeWidth = thickness;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const getRiskColor = () => {
    if (customColors) {
      if (percentage <= thresholds.low) return customColors.low;
      if (percentage <= thresholds.medium) return customColors.medium;
      return customColors.high;
    }
    
    if (percentage <= thresholds.low) return colors.successGreen;
    if (percentage <= thresholds.medium) return colors.warningYellow;
    return colors.alertRed;
  };

  const getRiskLevel = () => {
    if (percentage <= thresholds.low) return 'Low Risk';
    if (percentage <= thresholds.medium) return 'Moderate Risk';
    return 'High Risk';
  };

  const getRiskDescription = () => {
    if (percentage <= thresholds.low) return 'Your risk level is low. Maintain healthy habits.';
    if (percentage <= thresholds.medium) return 'Moderate risk detected. Monitor your health.';
    return 'High risk! Consult your healthcare provider.';
  };

  const riskColor = getRiskColor();
  const riskLevel = getRiskLevel();
  const strokeDashoffset = circumference * (1 - percentage / 100);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: percentage / 100,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(percentage / 100);
    }
  }, [percentage]);

  const animatedStrokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.meterContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.disabled}
              strokeWidth={strokeWidth}
              fill="none"
            />
            
            {/* Risk Circle */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={riskColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={animatedStrokeDashoffset}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>

        {/* Center Content */}
        <View style={styles.centerContent}>
          {showValue && (
            <>
              <Text style={[styles.value, { color: riskColor }]}>
                {value}
              </Text>
              <Text style={styles.maxValue}>/{maxValue}</Text>
            </>
          )}
        </View>
      </View>

      {/* Risk Level Indicator */}
      <View style={styles.infoContainer}>
        <View style={[styles.levelBadge, { backgroundColor: riskColor }]}>
          <Text style={styles.levelText}>{riskLevel}</Text>
        </View>
        
        {showLabel && (
          <Text style={styles.label}>{label}</Text>
        )}
      </View>

      {/* Risk Description */}
      <Text style={styles.description}>{getRiskDescription()}</Text>

      {/* Threshold Markers */}
      <View style={styles.thresholdsContainer}>
        <View style={styles.thresholdItem}>
          <View style={[styles.thresholdDot, { backgroundColor: colors.successGreen }]} />
          <Text style={styles.thresholdText}>Low (0-{thresholds.low}%)</Text>
        </View>
        <View style={styles.thresholdItem}>
          <View style={[styles.thresholdDot, { backgroundColor: colors.warningYellow }]} />
          <Text style={styles.thresholdText}>Moderate ({thresholds.low}-{thresholds.medium}%)</Text>
        </View>
        <View style={styles.thresholdItem}>
          <View style={[styles.thresholdDot, { backgroundColor: colors.alertRed }]} />
          <Text style={styles.thresholdText}>High ({thresholds.medium}-100%)</Text>
        </View>
      </View>
    </View>
  );
};

export const DiseaseRiskMeter = ({ disease, risk, onPress }) => (
  <TouchableOpacity style={styles.diseaseCard} onPress={onPress}>
    <View style={styles.diseaseHeader}>
      <Text style={styles.diseaseName}>{disease}</Text>
      <RiskMeter
        value={risk}
        size={80}
        thickness={8}
        showValue={false}
        showLabel={false}
        thresholds={{ low: 30, medium: 60, high: 100 }}
      />
    </View>
    <Text style={styles.diseaseRisk}>Risk Level: {risk}%</Text>
    <View style={styles.diseaseFooter}>
      <Ionicons name="information-circle" size={16} color={colors.textTertiary} />
      <Text style={styles.diseaseInfo}>Tap for details</Text>
    </View>
  </TouchableOpacity>
);

export const MultiRiskMeter = ({ risks = [] }) => {
  const total = risks.reduce((sum, risk) => sum + risk.value, 0);
  
  return (
    <View style={styles.multiContainer}>
      {risks.map((risk, index) => {
        const percentage = (risk.value / total) * 100;
        
        return (
          <View key={index} style={styles.multiRiskItem}>
            <View style={styles.multiRiskHeader}>
              <Text style={styles.multiRiskName}>{risk.name}</Text>
              <Text style={[styles.multiRiskValue, { color: risk.color }]}>
                {risk.value}%
              </Text>
            </View>
            <View style={styles.multiRiskBar}>
              <View
                style={[
                  styles.multiRiskFill,
                  {
                    width: `${percentage}%`,
                    backgroundColor: risk.color,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export const HealthScoreMeter = ({ score, maxScore = 100 }) => {
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

  return (
    <LinearGradient
      colors={[getScoreColor(), `${getScoreColor()}CC`]}
      style={styles.scoreContainer}
    >
      <Text style={styles.scoreLabel}>Health Score</Text>
      <Text style={styles.scoreValue}>{score}</Text>
      <Text style={styles.scoreMax}>/{maxScore}</Text>
      <View style={styles.scoreBadge}>
        <Text style={styles.scoreBadgeText}>{getScoreLabel()}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  meterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
  },
  maxValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  levelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  levelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textSecondary,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  thresholdsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    width: '100%',
  },
  thresholdItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  thresholdDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  thresholdText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  diseaseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diseaseHeader: {
    flex: 1,
  },
  diseaseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  diseaseRisk: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  diseaseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  diseaseInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  multiContainer: {
    width: '100%',
    padding: 16,
  },
  multiRiskItem: {
    marginBottom: 12,
  },
  multiRiskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  multiRiskName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  multiRiskValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  multiRiskBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  multiRiskFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreContainer: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  scoreLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 8,
  },
  scoreValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: 'white',
  },
  scoreMax: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: 'white',
    opacity: 0.7,
    marginBottom: 8,
  },
  scoreBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
});

export default RiskMeter;