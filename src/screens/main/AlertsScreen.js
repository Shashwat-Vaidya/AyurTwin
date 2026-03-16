import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import AlertCard from '../../components/health/AlertCard';

const { width } = Dimensions.get('window');

const AlertsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { alerts } = useSelector((state) => state.alerts);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Local state
  const [expandedSections, setExpandedSections] = useState({
    active: true,
    stress: true,
    dosha: true,
    risk: true,
    device: true,
    history: false,
  });

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Sample alerts data
  const activeAlerts = [
    {
      id: '1',
      type: 'critical',
      title: 'Critical: Irregular Heart Rhythm',
      message: 'Multiple arrhythmia episodes detected in the last hour. Please rest and monitor.',
      time: '10 min ago',
      severity: 'critical',
      icon: 'heart',
      color: colors.alertRed,
      actionable: true,
      actionText: 'Contact Doctor',
    },
    {
      id: '2',
      type: 'warning',
      title: 'High Blood Pressure',
      message: 'Systolic reading above 140. Take medication if prescribed.',
      time: '25 min ago',
      severity: 'high',
      icon: 'speedometer',
      color: colors.alertRed,
    },
  ];

  const stressAlerts = [
    {
      id: '3',
      type: 'stress',
      title: 'Elevated Stress Levels',
      message: 'Stress levels have been high for 3 consecutive hours.',
      time: '1 hour ago',
      severity: 'high',
      icon: 'flash',
      color: colors.stressPurple,
      actionable: true,
      actionText: 'Try Meditation',
    },
    {
      id: '4',
      type: 'stress',
      title: 'Anxiety Spike Detected',
      message: 'Sudden increase in anxiety markers. Deep breathing recommended.',
      time: '2 hours ago',
      severity: 'medium',
      icon: 'heart-dislike',
      color: colors.stressPurple,
    },
  ];

  const doshaAlerts = [
    {
      id: '5',
      type: 'dosha',
      title: 'Pitta Imbalance',
      message: 'Pitta dosha elevated. Avoid spicy food and stay cool.',
      time: '3 hours ago',
      severity: 'medium',
      icon: 'flame',
      color: '#FF6B6B',
      actionable: true,
      actionText: 'View Tips',
    },
    {
      id: '6',
      type: 'dosha',
      title: 'Vata Aggravation',
      message: 'Vata increasing. Maintain routine and stay warm.',
      time: '5 hours ago',
      severity: 'low',
      icon: 'wind',
      color: '#7B6E8F',
    },
  ];

  const riskAlerts = [
    {
      id: '7',
      type: 'risk',
      title: 'Diabetes Risk Increasing',
      message: 'Based on recent glucose patterns, diabetes risk has increased to 75%.',
      time: '1 day ago',
      severity: 'high',
      icon: 'water',
      color: colors.warningYellow,
      actionable: true,
      actionText: 'Review Diet',
    },
    {
      id: '8',
      type: 'risk',
      title: 'Heart Disease Risk Alert',
      message: 'Family history + current metrics indicate elevated risk.',
      time: '2 days ago',
      severity: 'medium',
      icon: 'heart',
      color: colors.warningYellow,
    },
  ];

  const deviceAlerts = [
    {
      id: '9',
      type: 'device',
      title: 'Low Battery',
      message: 'Wristband battery at 15%. Please charge soon.',
      time: '30 min ago',
      severity: 'info',
      icon: 'battery-dead',
      color: colors.spO2Blue,
      actionable: true,
      actionText: 'Charge Now',
    },
    {
      id: '10',
      type: 'device',
      title: 'Connection Lost',
      message: 'Device disconnected. Reconnect to continue monitoring.',
      time: '1 hour ago',
      severity: 'warning',
      icon: 'bluetooth',
      color: colors.spO2Blue,
      actionable: true,
      actionText: 'Reconnect',
    },
  ];

  const alertHistory = [
    {
      id: '11',
      type: 'history',
      title: 'Sleep Alert',
      message: 'Low sleep quality detected',
      time: '2 days ago',
      severity: 'low',
      icon: 'moon',
      color: colors.sleepIndigo,
    },
    {
      id: '12',
      type: 'history',
      title: 'Activity Reminder',
      message: 'You were inactive for 2 hours',
      time: '3 days ago',
      severity: 'info',
      icon: 'walk',
      color: colors.textTertiary,
    },
    {
      id: '13',
      type: 'history',
      title: 'Hydration Alert',
      message: 'Water intake below target',
      time: '4 days ago',
      severity: 'info',
      icon: 'water',
      color: colors.textTertiary,
    },
  ];

  const getAlertCount = (alertsArray) => {
    return alertsArray.length;
  };

  const getSectionIcon = (section, isExpanded) => {
    if (section === 'active') return 'alert-circle';
    if (section === 'stress') return 'flash';
    if (section === 'dosha') return 'leaf';
    if (section === 'risk') return 'warning';
    if (section === 'device') return 'hardware-chip';
    return 'time';
  };

  const getSectionColor = (section) => {
    if (section === 'active') return colors.alertRed;
    if (section === 'stress') return colors.stressPurple;
    if (section === 'dosha') return colors.warningYellow;
    if (section === 'risk') return colors.warningYellow;
    if (section === 'device') return colors.spO2Blue;
    return colors.textTertiary;
  };

  const getSectionTitle = (section) => {
    if (section === 'active') return 'Active Health Alerts';
    if (section === 'stress') return 'Stress Alerts';
    if (section === 'dosha') return 'Dosha Imbalance Alerts';
    if (section === 'risk') return 'Risk Pattern Alerts';
    if (section === 'device') return 'Device Alerts';
    return 'Alert History';
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.headerTitle}>Alerts</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Summary Cards */}
        <Animated.View 
          style={[
            styles.summaryContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>8</Text>
            <Text style={styles.summaryLabel}>Active Alerts</Text>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardCritical]}>
            <Text style={styles.summaryNumberWhite}>2</Text>
            <Text style={styles.summaryLabelWhite}>Critical</Text>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardWarning]}>
            <Text style={styles.summaryNumberWhite}>4</Text>
            <Text style={styles.summaryLabelWhite}>Warnings</Text>
          </View>
        </Animated.View>

        {/* Active Health Alerts Section (Red Border) */}
        <Animated.View 
          style={[
            styles.section,
            styles.activeSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('active')}
          >
            <View style={styles.sectionTitleContainer}>
              <View style={[styles.sectionIcon, { backgroundColor: `${colors.alertRed}20` }]}>
                <Ionicons name="alert-circle" size={20} color={colors.alertRed} />
              </View>
              <Text style={styles.sectionTitle}>Active Health Alerts</Text>
              <View style={[styles.badge, { backgroundColor: colors.alertRed }]}>
                <Text style={styles.badgeText}>{getAlertCount(activeAlerts)}</Text>
              </View>
            </View>
            <Ionicons 
              name={expandedSections.active ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>

          {expandedSections.active && (
            <View style={styles.sectionContent}>
              {activeAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </View>
          )}
        </Animated.View>

        {/* Stress Alerts Section (Orange Border) */}
        <Animated.View 
          style={[
            styles.section,
            styles.stressSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('stress')}
          >
            <View style={styles.sectionTitleContainer}>
              <View style={[styles.sectionIcon, { backgroundColor: `${colors.stressPurple}20` }]}>
                <Ionicons name="flash" size={20} color={colors.stressPurple} />
              </View>
              <Text style={styles.sectionTitle}>Stress Alerts</Text>
              <View style={[styles.badge, { backgroundColor: colors.stressPurple }]}>
                <Text style={styles.badgeText}>{getAlertCount(stressAlerts)}</Text>
              </View>
            </View>
            <Ionicons 
              name={expandedSections.stress ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>

          {expandedSections.stress && (
            <View style={styles.sectionContent}>
              {stressAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </View>
          )}
        </Animated.View>

        {/* Dosha Imbalance Alerts Section (Orange Border) */}
        <Animated.View 
          style={[
            styles.section,
            styles.doshaSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('dosha')}
          >
            <View style={styles.sectionTitleContainer}>
              <View style={[styles.sectionIcon, { backgroundColor: `${colors.warningYellow}20` }]}>
                <Ionicons name="leaf" size={20} color={colors.warningYellow} />
              </View>
              <Text style={styles.sectionTitle}>Dosha Imbalance Alerts</Text>
              <View style={[styles.badge, { backgroundColor: colors.warningYellow }]}>
                <Text style={styles.badgeText}>{getAlertCount(doshaAlerts)}</Text>
              </View>
            </View>
            <Ionicons 
              name={expandedSections.dosha ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>

          {expandedSections.dosha && (
            <View style={styles.sectionContent}>
              {doshaAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </View>
          )}
        </Animated.View>

        {/* Risk Pattern Alerts Section (Orange Border) */}
        <Animated.View 
          style={[
            styles.section,
            styles.riskSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('risk')}
          >
            <View style={styles.sectionTitleContainer}>
              <View style={[styles.sectionIcon, { backgroundColor: `${colors.warningYellow}20` }]}>
                <Ionicons name="warning" size={20} color={colors.warningYellow} />
              </View>
              <Text style={styles.sectionTitle}>Risk Pattern Alerts</Text>
              <View style={[styles.badge, { backgroundColor: colors.warningYellow }]}>
                <Text style={styles.badgeText}>{getAlertCount(riskAlerts)}</Text>
              </View>
            </View>
            <Ionicons 
              name={expandedSections.risk ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>

          {expandedSections.risk && (
            <View style={styles.sectionContent}>
              {riskAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </View>
          )}
        </Animated.View>

        {/* Device Alerts Section (Blue Border) */}
        <Animated.View 
          style={[
            styles.section,
            styles.deviceSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('device')}
          >
            <View style={styles.sectionTitleContainer}>
              <View style={[styles.sectionIcon, { backgroundColor: `${colors.spO2Blue}20` }]}>
                <Ionicons name="hardware-chip" size={20} color={colors.spO2Blue} />
              </View>
              <Text style={styles.sectionTitle}>Device Alerts</Text>
              <View style={[styles.badge, { backgroundColor: colors.spO2Blue }]}>
                <Text style={styles.badgeText}>{getAlertCount(deviceAlerts)}</Text>
              </View>
            </View>
            <Ionicons 
              name={expandedSections.device ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>

          {expandedSections.device && (
            <View style={styles.sectionContent}>
              {deviceAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </View>
          )}
        </Animated.View>

        {/* Alert History Section (Gray, Expandable) */}
        <Animated.View 
          style={[
            styles.section,
            styles.historySection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('history')}
          >
            <View style={styles.sectionTitleContainer}>
              <View style={[styles.sectionIcon, { backgroundColor: `${colors.textTertiary}20` }]}>
                <Ionicons name="time" size={20} color={colors.textTertiary} />
              </View>
              <Text style={styles.sectionTitle}>Alert History</Text>
              <View style={[styles.badge, { backgroundColor: colors.textTertiary }]}>
                <Text style={styles.badgeText}>{getAlertCount(alertHistory)}</Text>
              </View>
            </View>
            <Ionicons 
              name={expandedSections.history ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>

          {expandedSections.history && (
            <View style={styles.sectionContent}>
              {alertHistory.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
              
              {/* Load More Button */}
              <TouchableOpacity style={styles.loadMoreButton}>
                <Text style={styles.loadMoreText}>Load More History</Text>
                <Ionicons name="arrow-down" size={16} color={colors.primarySaffron} />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Alert Settings Quick Link */}
        <Animated.View 
          style={[
            styles.settingsLink,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity style={styles.settingsLinkButton}>
            <Ionicons name="notifications-outline" size={20} color={colors.primarySaffron} />
            <Text style={styles.settingsLinkText}>Configure Alert Preferences</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primarySaffron} />
          </TouchableOpacity>
        </Animated.View>

        {/* Empty State (if no alerts) */}
        {activeAlerts.length === 0 && stressAlerts.length === 0 && doshaAlerts.length === 0 && (
          <Animated.View 
            style={[
              styles.emptyState,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Ionicons name="checkmark-circle" size={60} color={colors.successGreen} />
            <Text style={styles.emptyStateTitle}>All Systems Balanced</Text>
            <Text style={styles.emptyStateText}>
              No active alerts. Your health metrics are within normal ranges.
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.textPrimary,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryCardCritical: {
    backgroundColor: colors.alertRed,
  },
  summaryCardWarning: {
    backgroundColor: colors.warningYellow,
  },
  summaryNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  summaryNumberWhite: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'white',
    marginBottom: 4,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  summaryLabelWhite: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  activeSection: {
    borderLeftWidth: 4,
    borderLeftColor: colors.alertRed,
  },
  stressSection: {
    borderLeftWidth: 4,
    borderLeftColor: colors.stressPurple,
  },
  doshaSection: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warningYellow,
  },
  riskSection: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warningYellow,
  },
  deviceSection: {
    borderLeftWidth: 4,
    borderLeftColor: colors.spO2Blue,
  },
  historySection: {
    borderLeftWidth: 4,
    borderLeftColor: colors.textTertiary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'white',
  },
  sectionContent: {
    marginTop: 16,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  loadMoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
    marginRight: 4,
  },
  settingsLink: {
    marginTop: 8,
    marginBottom: 16,
  },
  settingsLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  settingsLinkText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.primarySaffron,
    marginHorizontal: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AlertsScreen;