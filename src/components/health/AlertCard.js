import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const AlertCard = ({ alert, onPress, onAction, compact = false }) => {
  const [expanded, setExpanded] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) {
      onPress(alert);
    } else {
      setExpanded(!expanded);
    }
  };

  const getSeverityColor = () => {
    switch(alert?.severity) {
      case 'critical': return colors.alertRed;
      case 'high': return colors.alertRed;
      case 'medium': return colors.warningYellow;
      case 'low': return colors.successGreen;
      case 'info': return colors.spO2Blue;
      default: return alert?.color || colors.textTertiary;
    }
  };

  const getSeverityIcon = () => {
    switch(alert?.severity) {
      case 'critical': return 'alert-circle';
      case 'high': return 'warning';
      case 'medium': return 'alert';
      case 'low': return 'information-circle';
      case 'info': return 'information-circle';
      default: return 'notifications';
    }
  };

  const getTypeIcon = () => {
    switch(alert?.type) {
      case 'heart': return 'heart';
      case 'stress': return 'flash';
      case 'dosha': return 'leaf';
      case 'risk': return 'warning';
      case 'device': return 'hardware-chip';
      case 'sleep': return 'moon';
      case 'activity': return 'walk';
      default: return alert?.icon || 'notifications';
    }
  };

  const severityColor = getSeverityColor();
  const severityIcon = getSeverityIcon();
  const typeIcon = getTypeIcon();

  const formatTime = (time) => {
    if (!time) return '';
    return time;
  };

  if (compact) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={[styles.compactContainer, { borderLeftColor: severityColor }]}
      >
        <View style={[styles.compactIcon, { backgroundColor: `${severityColor}20` }]}>
          <Ionicons name={typeIcon} size={20} color={severityColor} />
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{alert?.title}</Text>
          <Text style={styles.compactTime}>{formatTime(alert?.time)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={[
          styles.container,
          { borderLeftColor: severityColor, borderLeftWidth: 4 }
        ]}
      >
        <LinearGradient
          colors={['white', '#FAFAFA']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${severityColor}20` }]}>
                <Ionicons name={typeIcon} size={24} color={severityColor} />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{alert?.title}</Text>
                <View style={styles.metaContainer}>
                  <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.time}>{formatTime(alert?.time)}</Text>
                  <View style={[styles.severityBadge, { backgroundColor: `${severityColor}20` }]}>
                    <Ionicons name={severityIcon} size={10} color={severityColor} />
                    <Text style={[styles.severityText, { color: severityColor }]}>
                      {alert?.severity?.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
              <Ionicons 
                name={expanded ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.message}>{alert?.message}</Text>

          {expanded && (
            <View style={styles.expandedContent}>
              {alert?.details && (
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsTitle}>Details:</Text>
                  <Text style={styles.detailsText}>{alert.details}</Text>
                </View>
              )}

              {alert?.recommendation && (
                <View style={styles.recommendationSection}>
                  <Ionicons name="bulb" size={16} color={colors.warningYellow} />
                  <Text style={styles.recommendationText}>{alert.recommendation}</Text>
                </View>
              )}

              {alert?.actionable && (
                <View style={styles.actionContainer}>
                  {alert?.actionText && (
                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: severityColor }]}
                      onPress={() => onAction && onAction(alert)}
                    >
                      <Text style={styles.actionButtonText}>{alert.actionText}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={styles.dismissButton}
                    onPress={() => console.log('Dismiss', alert?.id)}
                  >
                    <Text style={styles.dismissText}>Dismiss</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {!alert?.actionable && (
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => console.log('Mark as read', alert?.id)}>
                <Text style={styles.markReadText}>Mark as read</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const CriticalAlert = (props) => (
  <AlertCard {...props} severity="critical" color={colors.alertRed} />
);

export const WarningAlert = (props) => (
  <AlertCard {...props} severity="high" color={colors.warningYellow} />
);

export const InfoAlert = (props) => (
  <AlertCard {...props} severity="info" color={colors.spO2Blue} />
);

export const SuccessAlert = (props) => (
  <AlertCard {...props} severity="low" color={colors.successGreen} />
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginLeft: 4,
    marginRight: 8,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  severityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 8,
    marginLeft: 2,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  detailsSection: {
    marginBottom: 12,
  },
  detailsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  detailsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  recommendationSection: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  recommendationText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.warningYellow,
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  actionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: 'white',
  },
  dismissButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dismissText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  markReadText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.primarySaffron,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  compactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  compactContent: {
    flex: 1,
  },
  compactTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  compactTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
});

export default AlertCard;