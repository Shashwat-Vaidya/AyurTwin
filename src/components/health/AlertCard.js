import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../utils/constants/colors';

const AlertCard = ({
  title,
  message,
  severity = 'info', // 'info', 'warning', 'critical', 'success'
  timestamp,
  icon,
  onPress,
  isRead = false,
  actionable = false,
  actionText = 'View',
  onAction,
}) => {
  // Define severity styles
  const severityConfig = {
    critical: {
      borderColor: colors.alertRed,
      backgroundColor: `${colors.alertRed}10`,
      icon: 'alert-circle',
      iconColor: colors.alertRed,
    },
    warning: {
      borderColor: colors.warningYellow,
      backgroundColor: `${colors.warningYellow}10`,
      icon: 'warning',
      iconColor: colors.warningYellow,
    },
    info: {
      borderColor: colors.spO2Blue,
      backgroundColor: `${colors.spO2Blue}10`,
      icon: 'information-circle',
      iconColor: colors.spO2Blue,
    },
    success: {
      borderColor: colors.successGreen,
      backgroundColor: `${colors.successGreen}10`,
      icon: 'checkmark-circle',
      iconColor: colors.successGreen,
    },
  };

  const config = severityConfig[severity] || severityConfig.info;

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderLeftColor: config.borderColor, backgroundColor: config.backgroundColor },
        isRead && styles.readContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left side icon */}
      <View style={[styles.iconContainer, { backgroundColor: config.iconColor + '20' }]}>
        <Ionicons name={icon || config.icon} size={24} color={config.iconColor} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {!isRead && <View style={[styles.unreadDot, { backgroundColor: config.iconColor }]} />}
        </View>
        <Text style={styles.message} numberOfLines={2}>{message}</Text>
        <View style={styles.footerRow}>
          <Text style={styles.timestamp}>{formatTime(timestamp)}</Text>
          {actionable && (
            <TouchableOpacity onPress={onAction} style={styles.actionButton}>
              <Text style={[styles.actionText, { color: config.iconColor }]}>{actionText}</Text>
              <Ionicons name="chevron-forward" size={16} color={config.iconColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  readContainer: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginRight: 4,
  },
});

export default AlertCard;