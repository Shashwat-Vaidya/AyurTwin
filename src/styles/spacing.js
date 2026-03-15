import { StyleSheet } from 'react-native';

/**
 * Base spacing unit (in pixels)
 */
export const BASE_UNIT = 4;

/**
 * Spacing scale based on 4px grid
 */
export const spacing = {
  /**
   * 0px - No spacing
   */
  none: 0,
  
  /**
   * 2px - Extra extra small
   */
  xxs: BASE_UNIT * 0.5, // 2px
  
  /**
   * 4px - Extra small
   */
  xs: BASE_UNIT, // 4px
  
  /**
   * 8px - Small
   */
  sm: BASE_UNIT * 2, // 8px
  
  /**
   * 12px - Medium small
   */
  msm: BASE_UNIT * 3, // 12px
  
  /**
   * 16px - Medium
   */
  md: BASE_UNIT * 4, // 16px
  
  /**
   * 20px - Medium large
   */
  mlg: BASE_UNIT * 5, // 20px
  
  /**
   * 24px - Large
   */
  lg: BASE_UNIT * 6, // 24px
  
  /**
   * 32px - Extra large
   */
  xl: BASE_UNIT * 8, // 32px
  
  /**
   * 40px - Extra extra large
   */
  xxl: BASE_UNIT * 10, // 40px
  
  /**
   * 48px - Huge
   */
  '3xl': BASE_UNIT * 12, // 48px
  
  /**
   * 56px - Extra huge
   */
  '4xl': BASE_UNIT * 14, // 56px
  
  /**
   * 64px - Massive
   */
  '5xl': BASE_UNIT * 16, // 64px
  
  /**
   * 80px - Extra massive
   */
  '6xl': BASE_UNIT * 20, // 80px
  
  /**
   * 96px - Gigantic
   */
  '7xl': BASE_UNIT * 24, // 96px
  
  /**
   * 120px - Enormous
   */
  '8xl': BASE_UNIT * 30, // 120px
};

/**
 * Padding and margin utility styles
 */
export const spacingStyles = StyleSheet.create({
  // Padding - All sides
  p0: { padding: spacing.none },
  pXxs: { padding: spacing.xxs },
  pXs: { padding: spacing.xs },
  pSm: { padding: spacing.sm },
  pMsm: { padding: spacing.msm },
  pMd: { padding: spacing.md },
  pMlg: { padding: spacing.mlg },
  pLg: { padding: spacing.lg },
  pXl: { padding: spacing.xl },
  pXxl: { padding: spacing.xxl },
  p3xl: { padding: spacing['3xl'] },
  p4xl: { padding: spacing['4xl'] },
  p5xl: { padding: spacing['5xl'] },

  // Padding - Horizontal
  ph0: { paddingHorizontal: spacing.none },
  phXxs: { paddingHorizontal: spacing.xxs },
  phXs: { paddingHorizontal: spacing.xs },
  phSm: { paddingHorizontal: spacing.sm },
  phMsm: { paddingHorizontal: spacing.msm },
  phMd: { paddingHorizontal: spacing.md },
  phMlg: { paddingHorizontal: spacing.mlg },
  phLg: { paddingHorizontal: spacing.lg },
  phXl: { paddingHorizontal: spacing.xl },
  phXxl: { paddingHorizontal: spacing.xxl },
  ph3xl: { paddingHorizontal: spacing['3xl'] },
  ph4xl: { paddingHorizontal: spacing['4xl'] },
  ph5xl: { paddingHorizontal: spacing['5xl'] },

  // Padding - Vertical
  pv0: { paddingVertical: spacing.none },
  pvXxs: { paddingVertical: spacing.xxs },
  pvXs: { paddingVertical: spacing.xs },
  pvSm: { paddingVertical: spacing.sm },
  pvMsm: { paddingVertical: spacing.msm },
  pvMd: { paddingVertical: spacing.md },
  pvMlg: { paddingVertical: spacing.mlg },
  pvLg: { paddingVertical: spacing.lg },
  pvXl: { paddingVertical: spacing.xl },
  pvXxl: { paddingVertical: spacing.xxl },
  pv3xl: { paddingVertical: spacing['3xl'] },
  pv4xl: { paddingVertical: spacing['4xl'] },
  pv5xl: { paddingVertical: spacing['5xl'] },

  // Padding - Top
  pt0: { paddingTop: spacing.none },
  ptXxs: { paddingTop: spacing.xxs },
  ptXs: { paddingTop: spacing.xs },
  ptSm: { paddingTop: spacing.sm },
  ptMsm: { paddingTop: spacing.msm },
  ptMd: { paddingTop: spacing.md },
  ptMlg: { paddingTop: spacing.mlg },
  ptLg: { paddingTop: spacing.lg },
  ptXl: { paddingTop: spacing.xl },
  ptXxl: { paddingTop: spacing.xxl },
  pt3xl: { paddingTop: spacing['3xl'] },
  pt4xl: { paddingTop: spacing['4xl'] },
  pt5xl: { paddingTop: spacing['5xl'] },

  // Padding - Bottom
  pb0: { paddingBottom: spacing.none },
  pbXxs: { paddingBottom: spacing.xxs },
  pbXs: { paddingBottom: spacing.xs },
  pbSm: { paddingBottom: spacing.sm },
  pbMsm: { paddingBottom: spacing.msm },
  pbMd: { paddingBottom: spacing.md },
  pbMlg: { paddingBottom: spacing.mlg },
  pbLg: { paddingBottom: spacing.lg },
  pbXl: { paddingBottom: spacing.xl },
  pbXxl: { paddingBottom: spacing.xxl },
  pb3xl: { paddingBottom: spacing['3xl'] },
  pb4xl: { paddingBottom: spacing['4xl'] },
  pb5xl: { paddingBottom: spacing['5xl'] },

  // Padding - Left
  pl0: { paddingLeft: spacing.none },
  plXxs: { paddingLeft: spacing.xxs },
  plXs: { paddingLeft: spacing.xs },
  plSm: { paddingLeft: spacing.sm },
  plMsm: { paddingLeft: spacing.msm },
  plMd: { paddingLeft: spacing.md },
  plMlg: { paddingLeft: spacing.mlg },
  plLg: { paddingLeft: spacing.lg },
  plXl: { paddingLeft: spacing.xl },
  plXxl: { paddingLeft: spacing.xxl },
  pl3xl: { paddingLeft: spacing['3xl'] },
  pl4xl: { paddingLeft: spacing['4xl'] },
  pl5xl: { paddingLeft: spacing['5xl'] },

  // Padding - Right
  pr0: { paddingRight: spacing.none },
  prXxs: { paddingRight: spacing.xxs },
  prXs: { paddingRight: spacing.xs },
  prSm: { paddingRight: spacing.sm },
  prMsm: { paddingRight: spacing.msm },
  prMd: { paddingRight: spacing.md },
  prMlg: { paddingRight: spacing.mlg },
  prLg: { paddingRight: spacing.lg },
  prXl: { paddingRight: spacing.xl },
  prXxl: { paddingRight: spacing.xxl },
  pr3xl: { paddingRight: spacing['3xl'] },
  pr4xl: { paddingRight: spacing['4xl'] },
  pr5xl: { paddingRight: spacing['5xl'] },

  // Margin - All sides
  m0: { margin: spacing.none },
  mXxs: { margin: spacing.xxs },
  mXs: { margin: spacing.xs },
  mSm: { margin: spacing.sm },
  mMsm: { margin: spacing.msm },
  mMd: { margin: spacing.md },
  mMlg: { margin: spacing.mlg },
  mLg: { margin: spacing.lg },
  mXl: { margin: spacing.xl },
  mXxl: { margin: spacing.xxl },
  m3xl: { margin: spacing['3xl'] },
  m4xl: { margin: spacing['4xl'] },
  m5xl: { margin: spacing['5xl'] },

  // Margin - Horizontal
  mh0: { marginHorizontal: spacing.none },
  mhXxs: { marginHorizontal: spacing.xxs },
  mhXs: { marginHorizontal: spacing.xs },
  mhSm: { marginHorizontal: spacing.sm },
  mhMsm: { marginHorizontal: spacing.msm },
  mhMd: { marginHorizontal: spacing.md },
  mhMlg: { marginHorizontal: spacing.mlg },
  mhLg: { marginHorizontal: spacing.lg },
  mhXl: { marginHorizontal: spacing.xl },
  mhXxl: { marginHorizontal: spacing.xxl },
  mh3xl: { marginHorizontal: spacing['3xl'] },
  mh4xl: { marginHorizontal: spacing['4xl'] },
  mh5xl: { marginHorizontal: spacing['5xl'] },

  // Margin - Vertical
  mv0: { marginVertical: spacing.none },
  mvXxs: { marginVertical: spacing.xxs },
  mvXs: { marginVertical: spacing.xs },
  mvSm: { marginVertical: spacing.sm },
  mvMsm: { marginVertical: spacing.msm },
  mvMd: { marginVertical: spacing.md },
  mvMlg: { marginVertical: spacing.mlg },
  mvLg: { marginVertical: spacing.lg },
  mvXl: { marginVertical: spacing.xl },
  mvXxl: { marginVertical: spacing.xxl },
  mv3xl: { marginVertical: spacing['3xl'] },
  mv4xl: { marginVertical: spacing['4xl'] },
  mv5xl: { marginVertical: spacing['5xl'] },

  // Margin - Top
  mt0: { marginTop: spacing.none },
  mtXxs: { marginTop: spacing.xxs },
  mtXs: { marginTop: spacing.xs },
  mtSm: { marginTop: spacing.sm },
  mtMsm: { marginTop: spacing.msm },
  mtMd: { marginTop: spacing.md },
  mtMlg: { marginTop: spacing.mlg },
  mtLg: { marginTop: spacing.lg },
  mtXl: { marginTop: spacing.xl },
  mtXxl: { marginTop: spacing.xxl },
  mt3xl: { marginTop: spacing['3xl'] },
  mt4xl: { marginTop: spacing['4xl'] },
  mt5xl: { marginTop: spacing['5xl'] },

  // Margin - Bottom
  mb0: { marginBottom: spacing.none },
  mbXxs: { marginBottom: spacing.xxs },
  mbXs: { marginBottom: spacing.xs },
  mbSm: { marginBottom: spacing.sm },
  mbMsm: { marginBottom: spacing.msm },
  mbMd: { marginBottom: spacing.md },
  mbMlg: { marginBottom: spacing.mlg },
  mbLg: { marginBottom: spacing.lg },
  mbXl: { marginBottom: spacing.xl },
  mbXxl: { marginBottom: spacing.xxl },
  mb3xl: { marginBottom: spacing['3xl'] },
  mb4xl: { marginBottom: spacing['4xl'] },
  mb5xl: { marginBottom: spacing['5xl'] },

  // Margin - Left
  ml0: { marginLeft: spacing.none },
  mlXxs: { marginLeft: spacing.xxs },
  mlXs: { marginLeft: spacing.xs },
  mlSm: { marginLeft: spacing.sm },
  mlMsm: { marginLeft: spacing.msm },
  mlMd: { marginLeft: spacing.md },
  mlMlg: { marginLeft: spacing.mlg },
  mlLg: { marginLeft: spacing.lg },
  mlXl: { marginLeft: spacing.xl },
  mlXxl: { marginLeft: spacing.xxl },
  ml3xl: { marginLeft: spacing['3xl'] },
  ml4xl: { marginLeft: spacing['4xl'] },
  ml5xl: { marginLeft: spacing['5xl'] },

  // Margin - Right
  mr0: { marginRight: spacing.none },
  mrXxs: { marginRight: spacing.xxs },
  mrXs: { marginRight: spacing.xs },
  mrSm: { marginRight: spacing.sm },
  mrMsm: { marginRight: spacing.msm },
  mrMd: { marginRight: spacing.md },
  mrMlg: { marginRight: spacing.mlg },
  mrLg: { marginRight: spacing.lg },
  mrXl: { marginRight: spacing.xl },
  mrXxl: { marginRight: spacing.xxl },
  mr3xl: { marginRight: spacing['3xl'] },
  mr4xl: { marginRight: spacing['4xl'] },
  mr5xl: { marginRight: spacing['5xl'] },
});

/**
 * Gap utilities for flex layouts
 */
export const gapStyles = StyleSheet.create({
  gap0: { gap: spacing.none },
  gapXxs: { gap: spacing.xxs },
  gapXs: { gap: spacing.xs },
  gapSm: { gap: spacing.sm },
  gapMsm: { gap: spacing.msm },
  gapMd: { gap: spacing.md },
  gapMlg: { gap: spacing.mlg },
  gapLg: { gap: spacing.lg },
  gapXl: { gap: spacing.xl },
  gapXxl: { gap: spacing.xxl },
  gap3xl: { gap: spacing['3xl'] },

  gapRow0: { rowGap: spacing.none },
  gapRowXxs: { rowGap: spacing.xxs },
  gapRowXs: { rowGap: spacing.xs },
  gapRowSm: { rowGap: spacing.sm },
  gapRowMd: { rowGap: spacing.md },
  gapRowLg: { rowGap: spacing.lg },
  gapRowXl: { rowGap: spacing.xl },

  gapCol0: { columnGap: spacing.none },
  gapColXxs: { columnGap: spacing.xxs },
  gapColXs: { columnGap: spacing.xs },
  gapColSm: { columnGap: spacing.sm },
  gapColMd: { columnGap: spacing.md },
  gapColLg: { columnGap: spacing.lg },
  gapColXl: { columnGap: spacing.xl },
});

/**
 * Spacing scale array for mapping
 */
export const spacingScale = [
  spacing.none,
  spacing.xxs,
  spacing.xs,
  spacing.sm,
  spacing.msm,
  spacing.md,
  spacing.mlg,
  spacing.lg,
  spacing.xl,
  spacing.xxl,
  spacing['3xl'],
  spacing['4xl'],
  spacing['5xl'],
];

/**
 * Get spacing value by index
 * @param {number} index - Index in spacing scale
 * @returns {number} Spacing value
 */
export const getSpacing = (index) => {
  return spacingScale[index] || spacing.md;
};

/**
 * Create spacing object for custom values
 * @param {Object} values - Spacing values
 * @returns {Object} Spacing style object
 */
export const createSpacing = (values) => {
  const style = {};
  
  if (values.all !== undefined) {
    style.padding = values.all;
    style.margin = values.all;
  }
  
  if (values.padding !== undefined) {
    if (typeof values.padding === 'number') {
      style.padding = values.padding;
    } else {
      if (values.padding.horizontal) style.paddingHorizontal = values.padding.horizontal;
      if (values.padding.vertical) style.paddingVertical = values.padding.vertical;
      if (values.padding.top) style.paddingTop = values.padding.top;
      if (values.padding.bottom) style.paddingBottom = values.padding.bottom;
      if (values.padding.left) style.paddingLeft = values.padding.left;
      if (values.padding.right) style.paddingRight = values.padding.right;
    }
  }
  
  if (values.margin !== undefined) {
    if (typeof values.margin === 'number') {
      style.margin = values.margin;
    } else {
      if (values.margin.horizontal) style.marginHorizontal = values.margin.horizontal;
      if (values.margin.vertical) style.marginVertical = values.margin.vertical;
      if (values.margin.top) style.marginTop = values.margin.top;
      if (values.margin.bottom) style.marginBottom = values.margin.bottom;
      if (values.margin.left) style.marginLeft = values.margin.left;
      if (values.margin.right) style.marginRight = values.margin.right;
    }
  }
  
  return style;
};

export default {
  BASE_UNIT,
  spacing,
  spacingStyles,
  gapStyles,
  spacingScale,
  getSpacing,
  createSpacing,
};