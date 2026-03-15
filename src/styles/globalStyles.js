import { StyleSheet, Platform } from 'react-native';
import colors from '../utils/constants/colors';

/**
 * Global styles used throughout the app
 */
export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  // Row layouts
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rowEvenly: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // Column layouts
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnBetween: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  // Grid layouts
  grid2: {
    width: '48%',
    marginHorizontal: '1%',
  },
  grid3: {
    width: '31.33%',
    marginHorizontal: '1%',
  },
  grid4: {
    width: '23%',
    marginHorizontal: '1%',
  },

  // Card styles
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },

  // Section styles
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
  },

  // Divider styles
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
  dividerLight: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
    marginVertical: 8,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 8,
  },

  // Text styles
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textPrimary,
  },
  textLight: {
    fontFamily: 'Inter-Light',
    fontSize: 14,
    color: colors.textSecondary,
  },
  textBold: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  textSemiBold: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  textMedium: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
  },
  textSmall: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  textXSmall: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  textCapitalize: {
    textTransform: 'capitalize',
  },

  // Heading styles
  h1: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  h2: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  h3: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  h4: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  h5: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  h6: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: 2,
  },

  // Spacing utilities
  m0: { margin: 0 },
  m4: { margin: 4 },
  m8: { margin: 8 },
  m12: { margin: 12 },
  m16: { margin: 16 },
  m20: { margin: 20 },
  m24: { margin: 24 },
  
  mt0: { marginTop: 0 },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },
  mt20: { marginTop: 20 },
  mt24: { marginTop: 24 },
  
  mb0: { marginBottom: 0 },
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mb20: { marginBottom: 20 },
  mb24: { marginBottom: 24 },
  
  ml0: { marginLeft: 0 },
  ml4: { marginLeft: 4 },
  ml8: { marginLeft: 8 },
  ml12: { marginLeft: 12 },
  ml16: { marginLeft: 16 },
  
  mr0: { marginRight: 0 },
  mr4: { marginRight: 4 },
  mr8: { marginRight: 8 },
  mr12: { marginRight: 12 },
  mr16: { marginRight: 16 },
  
  mx0: { marginHorizontal: 0 },
  mx4: { marginHorizontal: 4 },
  mx8: { marginHorizontal: 8 },
  mx12: { marginHorizontal: 12 },
  mx16: { marginHorizontal: 16 },
  
  my0: { marginVertical: 0 },
  my4: { marginVertical: 4 },
  my8: { marginVertical: 8 },
  my12: { marginVertical: 12 },
  my16: { marginVertical: 16 },
  
  p0: { padding: 0 },
  p4: { padding: 4 },
  p8: { padding: 8 },
  p12: { padding: 12 },
  p16: { padding: 16 },
  p20: { padding: 20 },
  p24: { padding: 24 },
  
  pt0: { paddingTop: 0 },
  pt4: { paddingTop: 4 },
  pt8: { paddingTop: 8 },
  pt12: { paddingTop: 12 },
  pt16: { paddingTop: 16 },
  pt20: { paddingTop: 20 },
  
  pb0: { paddingBottom: 0 },
  pb4: { paddingBottom: 4 },
  pb8: { paddingBottom: 8 },
  pb12: { paddingBottom: 12 },
  pb16: { paddingBottom: 16 },
  pb20: { paddingBottom: 20 },
  
  pl0: { paddingLeft: 0 },
  pl4: { paddingLeft: 4 },
  pl8: { paddingLeft: 8 },
  pl12: { paddingLeft: 12 },
  pl16: { paddingLeft: 16 },
  
  pr0: { paddingRight: 0 },
  pr4: { paddingRight: 4 },
  pr8: { paddingRight: 8 },
  pr12: { paddingRight: 12 },
  pr16: { paddingRight: 16 },
  
  px0: { paddingHorizontal: 0 },
  px4: { paddingHorizontal: 4 },
  px8: { paddingHorizontal: 8 },
  px12: { paddingHorizontal: 12 },
  px16: { paddingHorizontal: 16 },
  px20: { paddingHorizontal: 20 },
  
  py0: { paddingVertical: 0 },
  py4: { paddingVertical: 4 },
  py8: { paddingVertical: 8 },
  py12: { paddingVertical: 12 },
  py16: { paddingVertical: 16 },
  py20: { paddingVertical: 20 },

  // Border utilities
  border: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.05)',
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.05)',
  },
  rounded: {
    borderRadius: 8,
  },
  roundedLg: {
    borderRadius: 16,
  },
  roundedXl: {
    borderRadius: 24,
  },
  roundedFull: {
    borderRadius: 999,
  },

  // Shadow utilities
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  // Flex utilities
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  flexGrow1: { flexGrow: 1 },
  flexGrow0: { flexGrow: 0 },
  alignStart: { alignItems: 'flex-start' },
  alignCenter: { alignItems: 'center' },
  alignEnd: { alignItems: 'flex-end' },
  alignStretch: { alignItems: 'stretch' },
  justifyStart: { justifyContent: 'flex-start' },
  justifyCenter: { justifyContent: 'center' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyAround: { justifyContent: 'space-around' },
  justifyEvenly: { justifyContent: 'space-evenly' },
  selfStart: { alignSelf: 'flex-start' },
  selfCenter: { alignSelf: 'center' },
  selfEnd: { alignSelf: 'flex-end' },
  selfStretch: { alignSelf: 'stretch' },

  // Position utilities
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  top0: { top: 0 },
  left0: { left: 0 },
  right0: { right: 0 },
  bottom0: { bottom: 0 },

  // Z-index utilities
  z0: { zIndex: 0 },
  z10: { zIndex: 10 },
  z20: { zIndex: 20 },
  z30: { zIndex: 30 },
  z40: { zIndex: 40 },
  z50: { zIndex: 50 },

  // Overflow utilities
  overflowHidden: { overflow: 'hidden' },
  overflowVisible: { overflow: 'visible' },
  overflowScroll: { overflow: 'scroll' },

  // Opacity utilities
  opacity0: { opacity: 0 },
  opacity25: { opacity: 0.25 },
  opacity50: { opacity: 0.5 },
  opacity75: { opacity: 0.75 },
  opacity100: { opacity: 1 },
});

/**
 * Create responsive styles based on screen size
 * @param {Object} baseStyles - Base styles
 * @param {Object} responsiveStyles - Responsive style overrides
 * @returns {Object} Combined styles
 */
export const createResponsiveStyles = (baseStyles, responsiveStyles) => {
  return StyleSheet.create({
    ...baseStyles,
    ...responsiveStyles,
  });
};

export default globalStyles;