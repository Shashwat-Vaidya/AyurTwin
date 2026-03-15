import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';
import AlertCard from './AlertCard';

const AlertSection = ({
  title,
  alerts = [],
  onViewAll,
  onAlertPress,
  maxAlerts = 3,
  showViewAll = true,
  showCount = true,
  variant = 'default', // 'default', 'compact', 'expanded'
  emptyStateMessage = 'No alerts at this time',
  emptyStateIcon = 'checkmark-circle',
  backgroundColor = colors.backgroundWhite,
  style,
  headerStyle,
}) => {
  
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'critical', label: 'Critical', icon: 'alert-circle', color: colors.alertRed },
    { id: 'warning', label: 'Warnings', icon: 'warning', color: colors.warningYellow },
    { id: 'info', label: 'Info', icon: 'information-circle', color: colors.spO2Blue },
  ];

  const getFilteredAlerts = () => {
    if (selectedCategory === 'all') return alerts;
    return alerts.filter(alert => alert.severity === selectedCategory);
  };

  const getDisplayAlerts = () => {
    const filtered = getFilteredAlerts();
    if (expanded || variant === 'expanded') return filtered;
    return filtered.slice(0, maxAlerts);
  };

  const getAlertCountBySeverity = (severity) => {
    return alerts.filter(alert => alert.severity === severity).length;
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return colors.alertRed;
      case 'high': return colors.alertRed;
      case 'medium': return colors.warningYellow;
      case 'low': return colors.successGreen;
      case 'info': return colors.spO2Blue;
      default: return colors.textTertiary;
    }
  };

  const renderCategoryTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryScroll}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryTab,
            selectedCategory === category.id && styles.categoryTabActive,
            selectedCategory === category.id && category.color && { borderColor: category.color },
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Ionicons
            name={category.icon}
            size={16}
            color={selectedCategory === category.id ? category.color : colors.textSecondary}
          />
          <Text style={[
            styles.categoryText,
            selectedCategory === category.id && { color: category.color }
          ]}>
            {category.label}
          </Text>
          {showCount && (
            <View style={[
              styles.categoryCount,
              { backgroundColor: selectedCategory === category.id ? category.color : colors.textTertiary }
            ]}>
              <Text style={styles.categoryCountText}>
                {category.id === 'all' ? alerts.length : getAlertCountBySeverity(category.id)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name={emptyStateIcon} size={48} color={colors.successGreen} />
      <Text style={styles.emptyStateText}>{emptyStateMessage}</Text>
    </View>
  );

  const displayAlerts = getDisplayAlerts();
  const hasAlerts = displayAlerts.length > 0;
  const totalCount = alerts.length;
  const displayedCount = displayAlerts.length;

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {/* Header */}
      <View style={[styles.header, headerStyle]}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{title}</Text>
          {showCount && totalCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{totalCount}</Text>
            </View>
          )}
        </View>
        
        {showViewAll && totalCount > maxAlerts && !expanded && variant !== 'expanded' && (
          <TouchableOpacity onPress={onViewAll || (() => setExpanded(true))}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Tabs */}
      {alerts.length > 0 && renderCategoryTabs()}

      {/* Alerts List */}
      <View style={styles.alertsContainer}>
        {hasAlerts ? (
          displayAlerts.map((alert, index) => (
            <AlertCard
              key={alert.id || index}
              alert={alert}
              onPress={onAlertPress}
              compact={variant === 'compact'}
            />
          ))
        ) : (
          renderEmptyState()
        )}
      </View>

      {/* Show Less Button */}
      {expanded && totalCount > maxAlerts && (
        <TouchableOpacity
          style={styles.showLessButton}
          onPress={() => setExpanded(false)}
        >
          <Text style={styles.showLessText}>Show Less</Text>
          <Ionicons name="chevron-up" size={16} color={colors.primarySaffron} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export const CriticalAlertsSection = ({ alerts, onAlertPress, ...props }) => {
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
  
  return (
    <AlertSection
      title="Critical Alerts"
      alerts={criticalAlerts}
      onAlertPress={onAlertPress}
      variant="expanded"
      emptyStateIcon="shield-checkmark"
      emptyStateMessage="No critical alerts"
      backgroundColor={colors.alertRed + '05'}
      {...props}
    />
  );
};

export const WarningAlertsSection = ({ alerts, onAlertPress, ...props }) => {
  const warningAlerts = alerts.filter(a => a.severity === 'medium' || a.severity === 'warning');
  
  return (
    <AlertSection
      title="Warnings"
      alerts={warningAlerts}
      onAlertPress={onAlertPress}
      emptyStateIcon="checkmark-circle"
      emptyStateMessage="No warnings"
      {...props}
    />
  );
};

export const InfoAlertsSection = ({ alerts, onAlertPress, ...props }) => {
  const infoAlerts = alerts.filter(a => a.severity === 'info' || a.severity === 'low');
  
  return (
    <AlertSection
      title="Information"
      alerts={infoAlerts}
      onAlertPress={onAlertPress}
      emptyStateIcon="information-circle"
      emptyStateMessage="No new information"
      {...props}
    />
  );
};

export const DoshaAlertsSection = ({ alerts, onAlertPress, ...props }) => {
  const doshaAlerts = alerts.filter(a => a.type === 'dosha');
  
  return (
    <AlertSection
      title="Dosha Balance"
      alerts={doshaAlerts}
      onAlertPress={onAlertPress}
      emptyStateIcon="leaf"
      emptyStateMessage="Your doshas are balanced"
      {...props}
    />
  );
};

export const DeviceAlertsSection = ({ alerts, onAlertPress, ...props }) => {
  const deviceAlerts = alerts.filter(a => a.type === 'device');
  
  return (
    <AlertSection
      title="Device Alerts"
      alerts={deviceAlerts}
      onAlertPress={onAlertPress}
      emptyStateIcon="hardware-chip"
      emptyStateMessage="All devices working normally"
      {...props}
    />
  );
};

export const RiskAlertsSection = ({ alerts, onAlertPress, ...props }) => {
  const riskAlerts = alerts.filter(a => a.type === 'risk');
  
  return (
    <AlertSection
      title="Risk Predictions"
      alerts={riskAlerts}
      onAlertPress={onAlertPress}
      emptyStateIcon="analytics"
      emptyStateMessage="No new risk predictions"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  countBadge: {
    backgroundColor: colors.primarySaffron,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  countText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: 'white',
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
  },
  categoryScroll: {
    flexGrow: 0,
    marginBottom: 12,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  categoryTabActive: {
    backgroundColor: 'white',
    borderWidth: 2,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
    marginRight: 4,
  },
  categoryCount: {
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  categoryCountText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: 'white',
  },
  alertsContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  showLessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  showLessText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
    marginRight: 4,
  },
});

export default AlertSection;