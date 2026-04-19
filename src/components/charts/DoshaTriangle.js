import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Polygon, Circle, Text as SvgText, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../utils/constants/colors';

const { width } = Dimensions.get('window');

const DoshaTriangle = ({
  vata = 33.33,
  pitta = 33.33,
  kapha = 33.33,
  size = width * 0.7,
  showLabels = true,
  showLegend = true,
  animate = true,
}) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (animate) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
    }
  }, [animate]);

  // Triangle vertices (equilateral triangle)
  const height = size * 0.866; // sqrt(3)/2 * size
  const points = [
    { x: size / 2, y: 0 }, // Top (Vata)
    { x: 0, y: height }, // Bottom left (Pitta)
    { x: size, y: height }, // Bottom right (Kapha)
  ];

  // Calculate dosha marker position based on percentages
  const calculateMarkerPosition = () => {
    // Convert percentages to weights (0-1)
    const wVata = vata / 100;
    const wPitta = pitta / 100;
    const wKapha = kapha / 100;

    // Barycentric coordinates to Cartesian
    const x = (wVata * points[0].x + wPitta * points[1].x + wKapha * points[2].x) / (wVata + wPitta + wKapha);
    const y = (wVata * points[0].y + wPitta * points[1].y + wKapha * points[2].y) / (wVata + wPitta + wKapha);

    return { x, y };
  };

  const markerPos = calculateMarkerPosition();

  // Determine dominant dosha
  const getDominantDosha = () => {
    const max = Math.max(vata, pitta, kapha);
    if (vata === max && vata > 40) return 'Vata';
    if (pitta === max && pitta > 40) return 'Pitta';
    if (kapha === max && kapha > 40) return 'Kapha';
    if (vata > 30 && pitta > 30 && kapha > 30) return 'Tri-Dosha';
    if (vata > 35 && pitta > 35) return 'Vata-Pitta';
    if (pitta > 35 && kapha > 35) return 'Pitta-Kapha';
    if (vata > 35 && kapha > 35) return 'Vata-Kapha';
    return 'Balanced';
  };

  const dominantDosha = getDominantDosha();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={[colors.cardBeige, '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { padding: size * 0.1 }]}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Ionicons name="leaf" size={24} color={colors.primaryGreen} />
          <Text style={styles.title}>Dosha Balance</Text>
        </View>

        {/* Triangle SVG */}
        <View style={[styles.svgContainer, { width: size, height: height }]}>
          <Svg width={size} height={height} viewBox={`0 0 ${size} ${height}`}>
            {/* Triangle outline */}
            <Polygon
              points={`${points[0].x},${points[0].y} ${points[1].x},${points[1].y} ${points[2].x},${points[2].y}`}
              fill="none"
              stroke={colors.border}
              strokeWidth="2"
            />

            {/* Gradient fills for each corner */}
            <Polygon
              points={`${points[0].x},${points[0].y} ${points[1].x},${points[1].y} ${markerPos.x},${markerPos.y}`}
              fill={`${colors.vata}20`}
              stroke="none"
            />
            <Polygon
              points={`${points[1].x},${points[1].y} ${points[2].x},${points[2].y} ${markerPos.x},${markerPos.y}`}
              fill={`${colors.pitta}20`}
              stroke="none"
            />
            <Polygon
              points={`${points[2].x},${points[2].y} ${points[0].x},${points[0].y} ${markerPos.x},${markerPos.y}`}
              fill={`${colors.kapha}20`}
              stroke="none"
            />

            {/* Corner labels */}
            {showLabels && (
              <>
                <SvgText
                  x={points[0].x}
                  y={points[0].y - 10}
                  fill={colors.vata}
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Vata
                </SvgText>
                <SvgText
                  x={points[1].x - 10}
                  y={points[1].y - 10}
                  fill={colors.pitta}
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="end"
                >
                  Pitta
                </SvgText>
                <SvgText
                  x={points[2].x + 10}
                  y={points[2].y - 10}
                  fill={colors.kapha}
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="start"
                >
                  Kapha
                </SvgText>
              </>
            )}

            {/* Grid lines */}
            <Line
              x1={points[0].x}
              y1={points[0].y}
              x2={(points[1].x + points[2].x) / 2}
              y2={points[1].y}
              stroke={colors.border}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <Line
              x1={points[1].x}
              y1={points[1].y}
              x2={(points[0].x + points[2].x) / 2}
              y2={points[0].y + (points[2].y - points[0].y) / 2}
              stroke={colors.border}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <Line
              x1={points[2].x}
              y1={points[2].y}
              x2={(points[0].x + points[1].x) / 2}
              y2={points[0].y + (points[1].y - points[0].y) / 2}
              stroke={colors.border}
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* Current balance marker */}
            <Circle
              cx={markerPos.x}
              cy={markerPos.y}
              r="8"
              fill="white"
              stroke={colors.primarySaffron}
              strokeWidth="3"
            />
            <Circle
              cx={markerPos.x}
              cy={markerPos.y}
              r="4"
              fill={colors.primarySaffron}
            />
          </Svg>
        </View>

        {/* Percentage bars */}
        <View style={styles.percentagesContainer}>
          <View style={styles.percentageItem}>
            <View style={[styles.percentageBar, { backgroundColor: colors.vata, width: `${vata}%` }]} />
            <Text style={styles.percentageText}>Vata: {Math.round(vata)}%</Text>
          </View>
          <View style={styles.percentageItem}>
            <View style={[styles.percentageBar, { backgroundColor: colors.pitta, width: `${pitta}%` }]} />
            <Text style={styles.percentageText}>Pitta: {Math.round(pitta)}%</Text>
          </View>
          <View style={styles.percentageItem}>
            <View style={[styles.percentageBar, { backgroundColor: colors.kapha, width: `${kapha}%` }]} />
            <Text style={styles.percentageText}>Kapha: {Math.round(kapha)}%</Text>
          </View>
        </View>

        {/* Dominant dosha info */}
        {showLegend && (
          <View style={styles.legendContainer}>
            <Text style={styles.legendLabel}>Dominant:</Text>
            <View
              style={[
                styles.doshaBadge,
                {
                  backgroundColor:
                    dominantDosha.includes('Vata') ? `${colors.vata}20` :
                    dominantDosha.includes('Pitta') ? `${colors.pitta}20` :
                    dominantDosha.includes('Kapha') ? `${colors.kapha}20` :
                    `${colors.primaryGreen}20`,
                },
              ]}
            >
              <Text
                style={[
                  styles.doshaText,
                  {
                    color:
                      dominantDosha.includes('Vata') ? colors.vata :
                      dominantDosha.includes('Pitta') ? colors.pitta :
                      dominantDosha.includes('Kapha') ? colors.kapha :
                      colors.primaryGreen,
                  },
                ]}
              >
                {dominantDosha}
              </Text>
            </View>
          </View>
        )}

        {/* Info text */}
        <Text style={styles.infoText}>
          Your current dosha balance determines disease tendencies, ideal diet, and lifestyle recommendations.
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  card: {
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  percentagesContainer: {
    width: '100%',
    marginTop: 16,
  },
  percentageItem: {
    marginBottom: 8,
  },
  percentageBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 2,
  },
  percentageText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    width: '100%',
  },
  legendLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  doshaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  doshaText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});

export default DoshaTriangle;