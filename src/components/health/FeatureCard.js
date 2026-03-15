import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const FeatureCard = ({
  title,
  description,
  icon,
  image,
  color = colors.primarySaffron,
  onPress,
  size = 'medium', // 'small', 'medium', 'large'
  variant = 'default', // 'default', 'gradient', 'outline', 'compact'
  badge,
  badgeColor,
  footer,
  progress,
  progressValue,
  metrics = [],
  style,
  titleStyle,
  descriptionStyle,
  iconStyle,
}) => {
  
  const getSizeStyles = () => {
    switch(size) {
      case 'small':
        return {
          padding: 12,
          iconSize: 24,
          titleSize: 14,
          descriptionSize: 11,
          spacing: 8,
        };
      case 'large':
        return {
          padding: 24,
          iconSize: 48,
          titleSize: 20,
          descriptionSize: 14,
          spacing: 16,
        };
      default:
        return {
          padding: 16,
          iconSize: 32,
          titleSize: 16,
          descriptionSize: 12,
          spacing: 12,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getVariantStyle = () => {
    switch(variant) {
      case 'gradient':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: color + '40',
        };
      case 'compact':
        return {
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
          padding: sizeStyles.padding / 2,
        };
      default:
        return {
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
        };
    }
  };

  const renderIcon = () => {
    if (image) {
      return (
        <Image source={image} style={[styles.image, { width: sizeStyles.iconSize, height: sizeStyles.iconSize }]} />
      );
    }

    if (typeof icon === 'string') {
      return (
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons
            name={icon}
            size={sizeStyles.iconSize}
            color={color}
            style={iconStyle}
          />
        </View>
      );
    }

    return icon;
  };

  const renderBadge = () => {
    if (!badge) return null;

    return (
      <View style={[styles.badge, { backgroundColor: badgeColor || color }]}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    );
  };

  const renderProgress = () => {
    if (!progress) return null;

    return (
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: `${color}20` }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
        {progressValue && (
          <Text style={[styles.progressValue, { color }]}>{progressValue}</Text>
        )}
      </View>
    );
  };

  const renderMetrics = () => {
    if (!metrics.length) return null;

    return (
      <View style={styles.metricsContainer}>
        {metrics.map((metric, index) => (
          <View key={index} style={styles.metricItem}>
            <Text style={[styles.metricLabel, { fontSize: sizeStyles.descriptionSize }]}>
              {metric.label}
            </Text>
            <Text style={[styles.metricValue, { fontSize: sizeStyles.titleSize, color: metric.color || color }]}>
              {metric.value}
              {metric.unit && <Text style={styles.metricUnit}> {metric.unit}</Text>}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const CardContent = () => (
    <>
      {renderBadge()}
      
      <View style={[styles.content, { gap: sizeStyles.spacing }]}>
        <View style={styles.header}>
          {renderIcon()}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { fontSize: sizeStyles.titleSize }, titleStyle]}>
              {title}
            </Text>
            {description && (
              <Text style={[styles.description, { fontSize: sizeStyles.descriptionSize }, descriptionStyle]}>
                {description}
              </Text>
            )}
          </View>
        </View>

        {renderMetrics()}
        {renderProgress()}
        
        {footer && (
          <View style={styles.footer}>
            {typeof footer === 'string' ? (
              <Text style={[styles.footerText, { fontSize: sizeStyles.descriptionSize }]}>
                {footer}
              </Text>
            ) : (
              footer
            )}
          </View>
        )}
      </View>
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        style={[styles.container, { overflow: 'hidden' }, style]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <LinearGradient
          colors={[color, `${color}CC`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
        />
        <View style={[styles.gradientContent, { padding: sizeStyles.padding }]}>
          <CardContent />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getVariantStyle(),
        { padding: sizeStyles.padding },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <CardContent />
    </TouchableOpacity>
  );
};

export const AIPredictionCard = ({ risk, onPress }) => (
  <FeatureCard
    title="AI Disease Prediction"
    description="Based on your health data"
    icon="analytics"
    color={colors.primarySaffron}
    onPress={onPress}
    metrics={[
      { label: 'Diabetes', value: risk?.diabetes || 80, unit: '%', color: colors.alertRed },
      { label: 'Hypertension', value: risk?.hypertension || 60, unit: '%', color: colors.warningYellow },
      { label: 'Heart Disease', value: risk?.heart || 40, unit: '%', color: colors.successGreen },
    ]}
    footer="View detailed predictions"
  />
);

export const DoshaBalanceCard = ({ dosha, onPress }) => {
  const doshaColors = {
    vata: '#7B6E8F',
    pitta: '#FF6B6B',
    kapha: '#6BA6A6',
  };

  return (
    <FeatureCard
      title="Dosha Balance"
      description="Your Ayurvedic constitution"
      icon="leaf"
      color={doshaColors[dosha?.dominant] || colors.primaryGreen}
      onPress={onPress}
      metrics={[
        { label: 'Vata', value: dosha?.vata || 45, unit: '%', color: doshaColors.vata },
        { label: 'Pitta', value: dosha?.pitta || 35, unit: '%', color: doshaColors.pitta },
        { label: 'Kapha', value: dosha?.kapha || 20, unit: '%', color: doshaColors.kapha },
      ]}
      badge={dosha?.dominant?.toUpperCase()}
      badgeColor={doshaColors[dosha?.dominant]}
    />
  );
};

export const LifestyleGuidanceCard = ({ onPress }) => (
  <FeatureCard
    title="Lifestyle Guidance"
    description="Personalized recommendations"
    icon="fitness"
    color={colors.primaryGreen}
    onPress={onPress}
    metrics={[
      { label: 'Exercise', value: '30 min', color: colors.primaryGreen },
      { label: 'Water', value: '2.5L', color: colors.spO2Blue },
      { label: 'Sleep', value: '7.2h', color: colors.sleepIndigo },
    ]}
    footer="View daily routine"
  />
);

export const SensorMonitoringCard = ({ onPress }) => (
  <FeatureCard
    title="Real-time Monitoring"
    description="Continuous sensor tracking"
    icon="pulse"
    color={colors.heartRate}
    onPress={onPress}
    progress={85}
    progressValue="85% accuracy"
    footer="Last synced 2 min ago"
    variant="gradient"
  />
);

export const WeeklyReportCard = ({ report, onPress }) => (
  <FeatureCard
    title="Weekly Health Report"
    description={report?.date || 'Mar 10 - Mar 16, 2024'}
    icon="document-text"
    color={colors.spO2Blue}
    onPress={onPress}
    metrics={[
      { label: 'Avg HR', value: report?.avgHR || 72, unit: 'bpm' },
      { label: 'Avg Sleep', value: report?.avgSleep || 7.2, unit: 'h' },
      { label: 'Total Steps', value: report?.totalSteps || 48.2, unit: 'k' },
    ]}
    badge="NEW"
    size="small"
  />
);

export const AchievementCard = ({ achievement, onPress }) => (
  <FeatureCard
    title={achievement?.title || 'New Achievement'}
    description={achievement?.description || 'You reached a new milestone'}
    icon={achievement?.icon || 'trophy'}
    color={achievement?.color || colors.warningYellow}
    onPress={onPress}
    badge={achievement?.badge || 'EARNED'}
    variant="outline"
    size="small"
  />
);

export const ReminderCard = ({ reminder, onPress }) => (
  <FeatureCard
    title={reminder?.title || 'Health Reminder'}
    description={reminder?.time || '8:00 AM'}
    icon={reminder?.icon || 'alarm'}
    color={reminder?.color || colors.primarySaffron}
    onPress={onPress}
    footer={reminder?.message || 'Time for your daily check-in'}
    variant="compact"
  />
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  gradientContent: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  image: {
    resizeMode: 'contain',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  description: {
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: 'white',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: 'Inter-Bold',
  },
  metricUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'right',
  },
  footer: {
    marginTop: 8,
  },
  footerText: {
    fontFamily: 'Inter-Medium',
    color: colors.primarySaffron,
  },
});

export default FeatureCard;