import { StyleSheet, Platform, Dimensions } from 'react-native';
import { spacing } from './spacing';
import colors from '../utils/constants/colors';

const { width, height } = Dimensions.get('window');

/**
 * Screen dimension utilities
 */
export const screen = {
  width,
  height,
  isSmall: width < 375,
  isMedium: width >= 375 && width < 768,
  isLarge: width >= 768,
  isPortrait: height > width,
  isLandscape: width > height,
};

/**
 * Platform utilities
 */
export const platform = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isWeb: Platform.OS === 'web',
  select: Platform.select,
  version: Platform.Version,
};

/**
 * Responsive sizing utilities
 * @param {number} size - Base size
 * @returns {number} Responsive size
 */
export const responsiveSize = (size) => {
  const scale = width / 375; // Base width for scaling
  return Math.round(size * Math.min(scale, 2));
};

/**
 * Create shadow styles
 * @param {number} elevation - Shadow elevation (0-24)
 * @returns {Object} Shadow style
 */
export const shadow = (elevation = 4) => {
  if (platform.isIOS) {
    const shadowOpacity = 0.0015 * elevation + 0.18;
    const shadowRadius = 0.54 * elevation;
    const shadowOffset = {
      width: 0,
      height: 0.6 * elevation,
    };
    
    return {
      shadowColor: '#000',
      shadowOffset,
      shadowOpacity,
      shadowRadius,
    };
  } else {
    return {
      elevation,
      shadowColor: '#000',
    };
  }
};

/**
 * Create card styles
 * @param {Object} options - Card options
 * @returns {Object} Card style
 */
export const card = (options = {}) => {
  const {
    padding = spacing.md,
    borderRadius = 16,
    elevation = 3,
    backgroundColor = 'white',
    bordered = false,
  } = options;

  return {
    backgroundColor,
    borderRadius,
    padding,
    ...shadow(elevation),
    ...(bordered && { borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' }),
  };
};

/**
 * Create flex layouts
 * @param {Object} options - Flex options
 * @returns {Object} Flex style
 */
export const flex = (options = {}) => {
  const {
    direction = 'row',
    justify = 'flex-start',
    align = 'stretch',
    wrap = 'nowrap',
    gap = 0,
    flex: flexValue,
  } = options;

  return {
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap,
    gap,
    ...(flexValue !== undefined && { flex: flexValue }),
  };
};

/**
 * Create absolute positioning
 * @param {Object} options - Position options
 * @returns {Object} Position style
 */
export const absolute = (options = {}) => {
  const {
    top,
    bottom,
    left,
    right,
    center = false,
    fill = false,
  } = options;

  if (fill) {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  }

  if (center) {
    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -50 }, { translateY: -50 }],
    };
  }

  return {
    position: 'absolute',
    ...(top !== undefined && { top }),
    ...(bottom !== undefined && { bottom }),
    ...(left !== undefined && { left }),
    ...(right !== undefined && { right }),
  };
};

/**
 * Create text styles
 * @param {Object} options - Text options
 * @returns {Object} Text style
 */
export const text = (options = {}) => {
  const {
    size = 14,
    weight = 'normal',
    color = colors.textPrimary,
    align = 'left',
    lineHeight,
    letterSpacing,
    transform,
    decoration,
    fontFamily,
  } = options;

  const fontWeight = {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  }[weight] || weight;

  return {
    fontSize: responsiveSize(size),
    fontWeight,
    color,
    textAlign: align,
    ...(lineHeight && { lineHeight: responsiveSize(lineHeight) }),
    ...(letterSpacing && { letterSpacing }),
    ...(transform && { textTransform: transform }),
    ...(decoration && { textDecorationLine: decoration }),
    ...(fontFamily && { fontFamily }),
  };
};

/**
 * Create border styles
 * @param {Object} options - Border options
 * @returns {Object} Border style
 */
export const border = (options = {}) => {
  const {
    width = 1,
    color = 'rgba(0,0,0,0.05)',
    radius = 0,
    top,
    bottom,
    left,
    right,
  } = options;

  const style = {};

  if (top) {
    style.borderTopWidth = width;
    style.borderTopColor = color;
  } else if (bottom) {
    style.borderBottomWidth = width;
    style.borderBottomColor = color;
  } else if (left) {
    style.borderLeftWidth = width;
    style.borderLeftColor = color;
  } else if (right) {
    style.borderRightWidth = width;
    style.borderRightColor = color;
  } else {
    style.borderWidth = width;
    style.borderColor = color;
  }

  if (radius) {
    style.borderRadius = radius;
  }

  return style;
};

/**
 * Create gradient overlay
 * @param {Object} options - Gradient options
 * @returns {Object} Gradient style
 */
export const gradientOverlay = (options = {}) => {
  const {
    colors = ['transparent', 'rgba(0,0,0,0.5)'],
    start = { x: 0, y: 0 },
    end = { x: 0, y: 1 },
  } = options;

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
};

/**
 * Create responsive styles based on screen size
 * @param {Object} styles - Style object with responsive keys
 * @returns {Object} Responsive styles
 */
export const responsive = (styles) => {
  const result = {};

  for (const key in styles) {
    if (typeof styles[key] === 'object') {
      if (screen.isSmall && styles[key].small) {
        result[key] = styles[key].small;
      } else if (screen.isMedium && styles[key].medium) {
        result[key] = styles[key].medium;
      } else if (screen.isLarge && styles[key].large) {
        result[key] = styles[key].large;
      } else {
        result[key] = styles[key].default || styles[key];
      }
    } else {
      result[key] = styles[key];
    }
  }

  return result;
};

/**
 * Create hit slop for touch targets
 * @param {number} size - Hit slop size
 * @returns {Object} Hit slop object
 */
export const hitSlop = (size = 10) => ({
  top: size,
  bottom: size,
  left: size,
  right: size,
});

/**
 * Create safe area insets style
 * @param {Object} insets - Safe area insets
 * @returns {Object} Safe area style
 */
export const safeArea = (insets) => ({
  paddingTop: insets.top,
  paddingBottom: insets.bottom,
  paddingLeft: insets.left,
  paddingRight: insets.right,
});

/**
 * Create aspect ratio style
 * @param {number} ratio - Aspect ratio (width/height)
 * @returns {Object} Aspect ratio style
 */
export const aspectRatio = (ratio) => ({
  aspectRatio: ratio,
});

/**
 * Create circle style
 * @param {number} size - Circle size
 * @returns {Object} Circle style
 */
export const circle = (size) => ({
  width: size,
  height: size,
  borderRadius: size / 2,
});

/**
 * Predefined mixins for common use cases
 */
export const mixins = {
  // Layout mixins
  row: flex({ direction: 'row' }),
  column: flex({ direction: 'column' }),
  center: flex({ justify: 'center', align: 'center' }),
  rowCenter: flex({ direction: 'row', justify: 'center', align: 'center' }),
  columnCenter: flex({ direction: 'column', justify: 'center', align: 'center' }),
  spaceBetween: flex({ justify: 'space-between' }),
  spaceAround: flex({ justify: 'space-around' }),
  spaceEvenly: flex({ justify: 'space-evenly' }),
  wrap: flex({ wrap: 'wrap' }),
  
  // Positioning mixins
  absoluteFill: absolute({ fill: true }),
  absoluteCenter: absolute({ center: true }),
  
  // Card mixins
  card: card(),
  cardSmall: card({ padding: spacing.sm, elevation: 2 }),
  cardLarge: card({ padding: spacing.lg, elevation: 4 }),
  cardBordered: card({ bordered: true, elevation: 0 }),
  
  // Shadow mixins
  shadowSm: shadow(2),
  shadowMd: shadow(4),
  shadowLg: shadow(8),
  shadowXl: shadow(12),
  
  // Border mixins
  borderBottom: border({ bottom: true }),
  borderTop: border({ top: true }),
  borderLeft: border({ left: true }),
  borderRight: border({ right: true }),
  borderAll: border({}),
  rounded: border({ radius: 8 }),
  roundedLg: border({ radius: 16 }),
  roundedXl: border({ radius: 24 }),
  roundedFull: border({ radius: 999 }),
  
  // Text mixins
  textXs: text({ size: 12 }),
  textSm: text({ size: 14 }),
  textMd: text({ size: 16 }),
  textLg: text({ size: 18 }),
  textXl: text({ size: 20 }),
  text2xl: text({ size: 24 }),
  text3xl: text({ size: 28 }),
  text4xl: text({ size: 32 }),
  
  textLight: text({ weight: 'light' }),
  textRegular: text({ weight: 'normal' }),
  textMedium: text({ weight: 'medium' }),
  textSemiBold: text({ weight: 'semiBold' }),
  textBold: text({ weight: 'bold' }),
  textExtraBold: text({ weight: 'extraBold' }),
  
  textPrimary: text({ color: colors.textPrimary }),
  textSecondary: text({ color: colors.textSecondary }),
  textTertiary: text({ color: colors.textTertiary }),
  textSuccess: text({ color: colors.successGreen }),
  textWarning: text({ color: colors.warningYellow }),
  textError: text({ color: colors.alertRed }),
  textInfo: text({ color: colors.spO2Blue }),
  
  textCenter: text({ align: 'center' }),
  textRight: text({ align: 'right' }),
  textUppercase: text({ transform: 'uppercase' }),
  textCapitalize: text({ transform: 'capitalize' }),
  textUnderline: text({ decoration: 'underline' }),
  textLineThrough: text({ decoration: 'line-through' }),
};

export default {
  screen,
  platform,
  responsiveSize,
  shadow,
  card,
  flex,
  absolute,
  text,
  border,
  gradientOverlay,
  responsive,
  hitSlop,
  safeArea,
  aspectRatio,
  circle,
  mixins,
};