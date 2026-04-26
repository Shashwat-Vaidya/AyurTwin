import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G } from 'react-native-svg';

import colors from '../../utils/constants/colors';

const DoshaMeter = ({
  vata = 33,
  pitta = 33,
  kapha = 34,
  size = 200,
  showLabels = true,
  showValues = true,
  showLegend = true,
  animated = true,
  style,
}) => {
  
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  
  // Normalize to ensure total is 100
  const total = vata + pitta + kapha;
  const vataNorm = (vata / total) * 100;
  const pittaNorm = (pitta / total) * 100;
  const kaphaNorm = (kapha / total) * 100;

  // Calculate stroke dashoffset based on percentage
  const radius = size * 0.35;
  const circumference = 2 * Math.PI * radius;

  const getDominantDosha = () => {
    const max = Math.max(vataNorm, pittaNorm, kaphaNorm);
    if (max === vataNorm) return 'Vata';
    if (max === pittaNorm) return 'Pitta';
    return 'Kapha';
  };

  const getDoshaColor = (dosha) => {
    switch(dosha) {
      case 'vata':
      case 'Vata':
        return colors.vata;
      case 'pitta':
      case 'Pitta':
        return colors.pitta;
      case 'kapha':
      case 'Kapha':
        return colors.kapha;
      default:
        return colors.primarySaffron;
    }
  };

  const getDoshaIcon = (dosha) => {
    switch(dosha) {
      case 'vata':
      case 'Vata':
        return 'cloud-outline';
      case 'pitta':
      case 'Pitta':
        return 'flame-outline';
      case 'kapha':
      case 'Kapha':
        return 'water-outline';
      default:
        return 'leaf-outline';
    }
  };

  const getDoshaDescription = (dosha) => {
    switch(dosha) {
      case 'vata':
      case 'Vata':
        return 'Creative, energetic, variable';
      case 'pitta':
      case 'Pitta':
        return 'Intense, focused, warm';
      case 'kapha':
      case 'Kapha':
        return 'Calm, stable, nurturing';
      default:
        return 'Balanced';
    }
  };

  const dominantDosha = getDominantDosha();
  const dominantColor = getDoshaColor(dominantDosha);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.meterContainer, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background Circle */}
          <G rotation="-90"origin={`${size / 2}, ${size / 2}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(0,0,0,0.05)"strokeWidth={15}
              fill="none"
            />
            
            {/* Vata Segment */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.vata}
              strokeWidth={15}
              strokeDasharray={`${circumference * vataNorm / 100} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"fill="none"
            />
            
            {/* Pitta Segment */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.pitta}
              strokeWidth={15}
              strokeDasharray={`${circumference * pittaNorm / 100} ${circumference}`}
              strokeDashoffset={-circumference * vataNorm / 100}
              strokeLinecap="round"fill="none"
            />
            
            {/* Kapha Segment */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.kapha}
              strokeWidth={15}
              strokeDasharray={`${circumference * kaphaNorm / 100} ${circumference}`}
              strokeDashoffset={-circumference * (vataNorm + pittaNorm) / 100}
              strokeLinecap="round"fill="none"
            />
          </G>
        </Svg>

        {/* Center Content */}
        <View style={styles.centerContent}>
          <Ionicons name={getDoshaIcon(dominantDosha)} size={size * 0.18} color={dominantColor} />
          <Text style={[styles.dominantText, { fontSize: size * 0.08, color: dominantColor }]}>
            {dominantDosha}
          </Text>
          {showValues && (
            <Text style={[styles.percentageText, { fontSize: size * 0.06 }]}>
              {Math.round(vataNorm)}% / {Math.round(pittaNorm)}% / {Math.round(kaphaNorm)}%
            </Text>
          )}
        </View>
      </View>

      {showLabels && (
        <Text style={styles.description}>
          {getDoshaDescription(dominantDosha)}
        </Text>
      )}

      {showLegend && (
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.vata }]} />
            <Text style={styles.legendLabel}>Vata</Text>
            <Text style={styles.legendValue}>{Math.round(vataNorm)}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.pitta }]} />
            <Text style={styles.legendLabel}>Pitta</Text>
            <Text style={styles.legendValue}>{Math.round(pittaNorm)}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.kapha }]} />
            <Text style={styles.legendLabel}>Kapha</Text>
            <Text style={styles.legendValue}>{Math.round(kaphaNorm)}%</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export const DoshaBalanceCard = ({ doshaData, onPress }) => {
  const { vata, pitta, kapha, dominant } = doshaData;

  const getDoshaColor = (dosha) => {
    switch(dosha) {
      case 'vata': return colors.vata;
      case 'pitta': return colors.pitta;
      case 'kapha': return colors.kapha;
      default: return colors.primarySaffron;
    }
  };

  const dominantColor = getDoshaColor(dominant);

  return (
    <TouchableOpacity style={styles.balanceCard} onPress={onPress}>
      <LinearGradient
        colors={[dominantColor, `${dominantColor}CC`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceGradient}
      >
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceTitle}>Dosha Balance</Text>
          <View style={styles.balanceBadge}>
            <Text style={styles.balanceBadgeText}>{dominant.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.balanceBars}>
          <View style={styles.barItem}>
            <Text style={styles.barLabel}>Vata</Text>
            <View style={styles.barContainer}>
              <View style={[styles.barFill, { width: `${vata}%`, backgroundColor: colors.vata }]} />
            </View>
            <Text style={styles.barValue}>{vata}%</Text>
          </View>

          <View style={styles.barItem}>
            <Text style={styles.barLabel}>Pitta</Text>
            <View style={styles.barContainer}>
              <View style={[styles.barFill, { width: `${pitta}%`, backgroundColor: colors.pitta }]} />
            </View>
            <Text style={styles.barValue}>{pitta}%</Text>
          </View>

          <View style={styles.barItem}>
            <Text style={styles.barLabel}>Kapha</Text>
            <View style={styles.barContainer}>
              <View style={[styles.barFill, { width: `${kapha}%`, backgroundColor: colors.kapha }]} />
            </View>
            <Text style={styles.barValue}>{kapha}%</Text>
          </View>
        </View>

        <Text style={styles.balanceTip}>
          Tap to learn more about your dosha balance
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const DoshaComparisonMeter = ({ current, baseline }) => {
  const getChange = (currentVal, baselineVal) => {
    const diff = currentVal - baselineVal;
    return {
      value: diff,
      color: Math.abs(diff) > 15 ? colors.alertRed : Math.abs(diff) > 8 ? colors.warningYellow : colors.successGreen,
      icon: diff > 0 ? 'arrow-up' : diff < 0 ? 'arrow-down' : 'remove',
    };
  };

  const vataChange = getChange(current.vata, baseline.vata);
  const pittaChange = getChange(current.pitta, baseline.pitta);
  const kaphaChange = getChange(current.kapha, baseline.kapha);

  return (
    <View style={styles.comparisonContainer}>
      <Text style={styles.comparisonTitle}>vs Baseline</Text>
      
      <View style={styles.comparisonRow}>
        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonLabel}>Vata</Text>
          <View style={[styles.comparisonBadge, { backgroundColor: `${vataChange.color}20` }]}>
            <Ionicons name={vataChange.icon} size={12} color={vataChange.color} />
            <Text style={[styles.comparisonValue, { color: vataChange.color }]}>
              {vataChange.value > 0 ? '+' : ''}{vataChange.value}%
            </Text>
          </View>
        </View>

        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonLabel}>Pitta</Text>
          <View style={[styles.comparisonBadge, { backgroundColor: `${pittaChange.color}20` }]}>
            <Ionicons name={pittaChange.icon} size={12} color={pittaChange.color} />
            <Text style={[styles.comparisonValue, { color: pittaChange.color }]}>
              {pittaChange.value > 0 ? '+' : ''}{pittaChange.value}%
            </Text>
          </View>
        </View>

        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonLabel}>Kapha</Text>
          <View style={[styles.comparisonBadge, { backgroundColor: `${kaphaChange.color}20` }]}>
            <Ionicons name={kaphaChange.icon} size={12} color={kaphaChange.color} />
            <Text style={[styles.comparisonValue, { color: kaphaChange.color }]}>
              {kaphaChange.value > 0 ? '+' : ''}{kaphaChange.value}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  meterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  dominantEmoji: {
    marginBottom: 4,
  },
  dominantText: {
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  percentageText: {
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  legendItem: {
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  legendLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  legendValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: colors.textPrimary,
  },
  balanceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  balanceGradient: {
    padding: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  balanceBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  balanceBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: 'white',
  },
  balanceBars: {
    marginBottom: 12,
  },
  barItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  barLabel: {
    width: 50,
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'white',
  },
  barContainer: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  barValue: {
    width: 35,
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'white',
    textAlign: 'right',
  },
  balanceTip: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
  },
  comparisonContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  comparisonTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  comparisonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  comparisonValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    marginLeft: 2,
  },
});

export default DoshaMeter;