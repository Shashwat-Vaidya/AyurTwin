import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../utils/constants/colors';

const Card = ({
  children,
  style,
  onPress,
  elevation = true,
  bordered = false,
  rounded = true,
  padding = true,
  gradient = false,
  gradientColors = [colors.primarySaffron, colors.primaryGreen],
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  ...props
}) => {
  
  const cardStyles = [
    styles.card,
    elevation && styles.elevation,
    bordered && { borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    rounded && styles.rounded,
    padding && styles.padding,
    style,
  ];

  if (gradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.7 : 1}
        style={cardStyles}
        {...props}
      >
        <LinearGradient
          colors={gradientColors}
          start={gradientStart}
          end={gradientEnd}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.content}>{children}</View>
      </TouchableOpacity>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={cardStyles}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
};

// Card Header Component
export const CardHeader = ({ title, subtitle, rightIcon, onRightPress, style }) => (
  <View style={[styles.header, style]}>
    <View style={styles.headerLeft}>
      {title && <Text style={styles.headerTitle}>{title}</Text>}
      {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
    </View>
    {rightIcon && (
      <TouchableOpacity onPress={onRightPress}>
        <Ionicons name={rightIcon} size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    )}
  </View>
);

// Card Body Component
export const CardBody = ({ children, style }) => (
  <View style={[styles.body, style]}>{children}</View>
);

// Card Footer Component
export const CardFooter = ({ children, style }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

// Card Image Component
export const CardImage = ({ source, style, height = 200 }) => (
  <Image 
    source={source} 
    style={[styles.image, { height }, style]} 
    resizeMode="cover"
  />
);

// Card Divider Component
export const CardDivider = ({ style }) => (
  <View style={[styles.divider, style]} />
);

// Card Row Component
export const CardRow = ({ left, right, style }) => (
  <View style={[styles.row, style]}>
    <View style={styles.rowLeft}>{left}</View>
    <View style={styles.rowRight}>{right}</View>
  </View>
);

// Metric Card Component
export const MetricCard = ({ icon, value, label, color, onPress }) => (
  <Card onPress={onPress} style={styles.metricCard}>
    <View style={[styles.metricIcon, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </Card>
);

// Stats Card Component
export const StatsCard = ({ title, value, change, icon, color }) => (
  <Card style={styles.statsCard}>
    <View style={styles.statsHeader}>
      <Text style={styles.statsTitle}>{title}</Text>
      <View style={[styles.statsIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
    </View>
    <Text style={styles.statsValue}>{value}</Text>
    {change !== undefined && (
      <View style={styles.statsChange}>
        <Ionicons 
          name={change >= 0 ? 'arrow-up' : 'arrow-down'} 
          size={14} 
          color={change >= 0 ? colors.successGreen : colors.alertRed} 
        />
        <Text style={[
          styles.statsChangeText,
          { color: change >= 0 ? colors.successGreen : colors.alertRed }
        ]}>
          {Math.abs(change)}% from last week
        </Text>
      </View>
    )}
  </Card>
);

// Info Card Component
export const InfoCard = ({ title, message, type = 'info' }) => {
  const getIcon = () => {
    switch(type) {
      case 'success': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'error': return 'alert-circle';
      default: return 'information-circle';
    }
  };

  const getColor = () => {
    switch(type) {
      case 'success': return colors.successGreen;
      case 'warning': return colors.warningYellow;
      case 'error': return colors.alertRed;
      default: return colors.spO2Blue;
    }
  };

  return (
    <Card style={[styles.infoCard, { backgroundColor: `${getColor()}10` }]}>
      <Ionicons name={getIcon()} size={24} color={getColor()} />
      <View style={styles.infoContent}>
        {title && <Text style={styles.infoTitle}>{title}</Text>}
        <Text style={styles.infoMessage}>{message}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  elevation: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  rounded: {
    borderRadius: 20,
  },
  padding: {
    padding: 16,
  },
  content: {
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  body: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  image: {
    width: '100%',
    borderRadius: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLeft: {
    flex: 1,
  },
  rowRight: {
    marginLeft: 12,
  },
  metricCard: {
    alignItems: 'center',
    padding: 12,
    width: 100,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  statsCard: {
    padding: 16,
    flex: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  statsIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statsChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsChangeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 2,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  infoMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export default Card;