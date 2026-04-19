import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const Divider = ({
  orientation = 'horizontal', // 'horizontal', 'vertical'
  thickness = 1,
  color = 'rgba(0,0,0,0.05)',
  gradient = false,
  gradientColors = [colors.primarySaffron, colors.primaryGreen],
  gradientDirection = 'leftToRight', // 'leftToRight', 'rightToLeft', 'topToBottom', 'bottomToTop'
  style,
  marginVertical,
  marginHorizontal,
  width = '100%',
  height,
  label,
  labelPosition = 'center', // 'left', 'center', 'right'
  labelStyle,
  labelColor = colors.textTertiary,
}) => {
  
  const getGradientStartEnd = () => {
    switch(gradientDirection) {
      case 'leftToRight':
        return { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };
      case 'rightToLeft':
        return { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } };
      case 'topToBottom':
        return { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
      case 'bottomToTop':
        return { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } };
      default:
        return { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };
    }
  };

  const gradientProps = getGradientStartEnd();

  const dividerStyles = [
    orientation === 'horizontal' ? styles.horizontal : styles.vertical,
    {
      [orientation === 'horizontal' ? 'height' : 'width']: thickness,
      backgroundColor: gradient ? 'transparent' : color,
    },
    marginVertical && { marginVertical },
    marginHorizontal && { marginHorizontal },
    orientation === 'horizontal' && width && { width },
    orientation === 'vertical' && height && { height },
    style,
  ];

  if (label) {
    return (
      <View style={[styles.labelContainer, { marginVertical }]}>
        <View style={[
          styles.line,
          { 
            flex: labelPosition === 'left' ? 0.2 : labelPosition === 'right' ? 0.8 : 0.5,
            height: thickness,
            backgroundColor: color,
          }
        ]} />
        
        <Text style={[
          styles.label,
          { color: labelColor },
          labelStyle,
        ]}>
          {label}
        </Text>
        
        <View style={[
          styles.line,
          { 
            flex: labelPosition === 'left' ? 0.8 : labelPosition === 'right' ? 0.2 : 0.5,
            height: thickness,
            backgroundColor: color,
          }
        ]} />
      </View>
    );
  }

  if (gradient) {
    return (
      <LinearGradient
        colors={gradientColors}
        {...gradientProps}
        style={dividerStyles}
      />
    );
  }

  return <View style={dividerStyles} />;
};

export const HorizontalDivider = (props) => (
  <Divider orientation="horizontal" {...props} />
);

export const VerticalDivider = (props) => (
  <Divider orientation="vertical" {...props} />
);

export const DashedDivider = ({
  thickness = 1,
  color = 'rgba(0,0,0,0.05)',
  dashLength = 8,
  gapLength = 4,
  style,
}) => {
  return (
    <View style={[styles.dashedContainer, style]}>
      {Array.from({ length: 50 }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dash,
            {
              width: dashLength,
              height: thickness,
              backgroundColor: color,
              marginRight: gapLength,
            },
          ]}
        />
      ))}
    </View>
  );
};

export const DottedDivider = ({
  thickness = 4,
  color = 'rgba(0,0,0,0.05)',
  dotSize = 4,
  gapLength = 4,
  style,
}) => {
  return (
    <View style={[styles.dottedContainer, style]}>
      {Array.from({ length: 30 }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: color,
              marginRight: gapLength,
            },
          ]}
        />
      ))}
    </View>
  );
};

export const GradientDivider = ({
  thickness = 2,
  colors = [colors.primarySaffron, colors.primaryGreen],
  style,
}) => (
  <LinearGradient
    colors={colors}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[styles.gradientDivider, { height: thickness }, style]}
  />
);

export const SectionDivider = ({ title, style }) => (
  <View style={[styles.sectionDivider, style]}>
    <Text style={styles.sectionDividerText}>{title}</Text>
  </View>
);

export const TimelineDivider = ({ time, style }) => (
  <View style={[styles.timelineDivider, style]}>
    <View style={styles.timelineLeft}>
      <View style={styles.timelineDot} />
      <View style={styles.timelineLine} />
    </View>
    <Text style={styles.timelineTime}>{time}</Text>
  </View>
);

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  dashedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  dash: {
    height: 1,
  },
  dottedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  gradientDivider: {
    width: '100%',
  },
  sectionDivider: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  sectionDividerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timelineDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  timelineLeft: {
    width: 30,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primarySaffron,
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    top: 10,
    width: 2,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  timelineTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});

export default Divider;