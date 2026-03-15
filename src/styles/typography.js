import { StyleSheet, Platform } from 'react-native';
import colors from '../utils/constants/colors';

/**
 * Typography styles for consistent text rendering
 */
export const typography = StyleSheet.create({
  // Font families
  regular: {
    fontFamily: 'Inter-Regular',
  },
  medium: {
    fontFamily: 'Inter-Medium',
  },
  semiBold: {
    fontFamily: 'Inter-SemiBold',
  },
  bold: {
    fontFamily: 'Inter-Bold',
  },
  light: {
    fontFamily: 'Inter-Light',
  },
  italic: {
    fontFamily: 'Inter-Italic',
  },

  // Font sizes
  xs: {
    fontSize: 10,
    lineHeight: 14,
  },
  sm: {
    fontSize: 12,
    lineHeight: 16,
  },
  base: {
    fontSize: 14,
    lineHeight: 20,
  },
  md: {
    fontSize: 16,
    lineHeight: 22,
  },
  lg: {
    fontSize: 18,
    lineHeight: 24,
  },
  xl: {
    fontSize: 20,
    lineHeight: 28,
  },
  '2xl': {
    fontSize: 24,
    lineHeight: 32,
  },
  '3xl': {
    fontSize: 28,
    lineHeight: 36,
  },
  '4xl': {
    fontSize: 32,
    lineHeight: 40,
  },
  '5xl': {
    fontSize: 36,
    lineHeight: 44,
  },
  '6xl': {
    fontSize: 40,
    lineHeight: 48,
  },

  // Font weights
  weightLight: {
    fontWeight: '300',
  },
  weightNormal: {
    fontWeight: '400',
  },
  weightMedium: {
    fontWeight: '500',
  },
  weightSemiBold: {
    fontWeight: '600',
  },
  weightBold: {
    fontWeight: '700',
  },
  weightExtraBold: {
    fontWeight: '800',
  },

  // Text colors
  textPrimary: {
    color: colors.textPrimary,
  },
  textSecondary: {
    color: colors.textSecondary,
  },
  textTertiary: {
    color: colors.textTertiary,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textBlack: {
    color: '#000000',
  },
  textSuccess: {
    color: colors.successGreen,
  },
  textWarning: {
    color: colors.warningYellow,
  },
  textError: {
    color: colors.alertRed,
  },
  textInfo: {
    color: colors.spO2Blue,
  },

  // Text alignment
  textLeft: {
    textAlign: 'left',
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  textJustify: {
    textAlign: 'justify',
  },

  // Text transformation
  uppercase: {
    textTransform: 'uppercase',
  },
  lowercase: {
    textTransform: 'lowercase',
  },
  capitalize: {
    textTransform: 'capitalize',
  },

  // Text decoration
  underline: {
    textDecorationLine: 'underline',
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  noUnderline: {
    textDecorationLine: 'none',
  },

  // Letter spacing
  trackingTight: {
    letterSpacing: -0.5,
  },
  trackingNormal: {
    letterSpacing: 0,
  },
  trackingWide: {
    letterSpacing: 0.5,
  },
  trackingWider: {
    letterSpacing: 1,
  },
  trackingWidest: {
    letterSpacing: 1.5,
  },

  // Line heights
  leadingNone: {
    lineHeight: 1,
  },
  leadingTight: {
    lineHeight: 1.25,
  },
  leadingSnug: {
    lineHeight: 1.375,
  },
  leadingNormal: {
    lineHeight: 1.5,
  },
  leadingRelaxed: {
    lineHeight: 1.625,
  },
  leadingLoose: {
    lineHeight: 2,
  },

  // Heading styles
  h1: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    lineHeight: 22,
  },

  // Body text styles
  body1: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  body3: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
    lineHeight: 16,
  },

  // Caption styles
  caption: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
    lineHeight: 16,
  },
  caption2: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
    lineHeight: 14,
  },

  // Label styles
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  labelSmall: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.textSecondary,
    lineHeight: 16,
  },

  // Button text styles
  buttonLarge: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  buttonMedium: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  buttonSmall: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    lineHeight: 20,
  },

  // Link styles
  link: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.primarySaffron,
    textDecorationLine: 'underline',
  },
  linkSmall: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.primarySaffron,
    textDecorationLine: 'underline',
  },

  // Numeric styles
  numeric: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
    fontVariant: ['tabular-nums'],
  },
  numericBold: {
    fontFamily: 'Inter-Bold',
    fontVariant: ['tabular-nums'],
  },

  // Price styles
  price: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
  },
  priceSmall: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
  },

  // Quote styles
  quote: {
    fontSize: 16,
    fontFamily: 'Inter-Italic',
    color: colors.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },

  // Error text
  error: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.alertRed,
    lineHeight: 16,
  },

  // Success text
  success: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.successGreen,
    lineHeight: 16,
  },

  // Warning text
  warning: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.warningYellow,
    lineHeight: 16,
  },

  // Info text
  info: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.spO2Blue,
    lineHeight: 16,
  },

  // Badge text
  badge: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },

  // Tooltip text
  tooltip: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: 14,
  },

  // Placeholder text
  placeholder: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
  },

  // Disabled text
  disabled: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.disabled,
  },

  // Highlighted text
  highlight: {
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    color: colors.primarySaffron,
  },
});

/**
 * Create a text style by combining variants
 * @param {Array} variants - Array of style variants
 * @returns {Object} Combined style
 */
export const createTextStyle = (...variants) => {
  return variants.reduce((style, variant) => {
    if (typeof variant === 'string') {
      return { ...style, ...(typography[variant] || {}) };
    }
    return { ...style, ...variant };
  }, {});
};

/**
 * Predefined text component props
 */
export const textProps = {
  h1: { style: typography.h1 },
  h2: { style: typography.h2 },
  h3: { style: typography.h3 },
  h4: { style: typography.h4 },
  h5: { style: typography.h5 },
  h6: { style: typography.h6 },
  body1: { style: typography.body1 },
  body2: { style: typography.body2 },
  body3: { style: typography.body3 },
  caption: { style: typography.caption },
  label: { style: typography.label },
  button: { style: typography.buttonMedium },
  link: { style: typography.link },
  error: { style: typography.error },
  success: { style: typography.success },
  warning: { style: typography.warning },
  info: { style: typography.info },
};

export default typography;