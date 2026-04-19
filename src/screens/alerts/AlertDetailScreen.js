import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AlertDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { alert } = route.params || {};

  const [isResolved, setIsResolved] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(false);

  // If no alert data, show error
  if (!alert) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color={colors.alertRed} />
        <Text style={styles.errorText}>Alert not found</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        />
      </View>
    );
  }

  // Get severity color
  const getSeverityColor = () => {
    switch(alert.severity) {
      case 'critical': return colors.alertRed;
      case 'high': return colors.alertRed;
      case 'medium': return colors.warningYellow;
      case 'low': return colors.successGreen;
      case 'info': return colors.spO2Blue;
      default: return colors.textTertiary;
    }
  };

  const getSeverityIcon = () => {
    switch(alert.severity) {
      case 'critical': return 'alert-circle';
      case 'high': return 'warning';
      case 'medium': return 'alert';
      case 'low': return 'information-circle';
      case 'info': return 'information-circle';
      default: return 'notifications';
    }
  };

  const getSeverityText = () => {
    switch(alert.severity) {
      case 'critical': return 'CRITICAL';
      case 'high': return 'HIGH';
      case 'medium': return 'MEDIUM';
      case 'low': return 'LOW';
      case 'info': return 'INFO';
      default: return alert.severity?.toUpperCase() || 'INFO';
    }
  };

  const severityColor = getSeverityColor();
  const severityIcon = getSeverityIcon();

  const handleResolve = () => {
    Alert.alert(
      'Resolve Alert',
      'Mark this alert as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          onPress: () => setIsResolved(true),
        },
      ]
    );
  };

  const handleSnooze = () => {
    Alert.alert(
      'Snooze Alert',
      'Choose snooze duration',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '1 hour', onPress: () => setIsSnoozed(true) },
        { text: '4 hours', onPress: () => setIsSnoozed(true) },
        { text: '24 hours', onPress: () => setIsSnoozed(true) },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share this alert with your doctor');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Alert Details</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Severity Banner */}
        <LinearGradient
          colors={[severityColor, `${severityColor}CC`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <Ionicons name={severityIcon} size={40} color="white" />
          <View style={styles.bannerText}>
            <Text style={styles.bannerSeverity}>{getSeverityText()} ALERT</Text>
            <Text style={styles.bannerTime}>{alert.time || 'Just now'}</Text>
          </View>
          {isResolved ? (
            <View style={styles.resolvedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.resolvedText}>Resolved</Text>
            </View>
          ) : isSnoozed ? (
            <View style={styles.snoozedBadge}>
              <Ionicons name="time" size={20} color="white" />
              <Text style={styles.snoozedText}>Snoozed</Text>
            </View>
          ) : null}
        </LinearGradient>

        {/* Alert Title */}
        <Text style={styles.alertTitle}>{alert.title}</Text>
        <Text style={styles.alertMessage}>{alert.message}</Text>

        {/* Status Cards */}
        <View style={styles.statusGrid}>
          <Card style={styles.statusCard}>
            <Text style={styles.statusLabel}>Status</Text>
            <View style={styles.statusValueContainer}>
              <View style={[styles.statusDot, { backgroundColor: severityColor }]} />
              <Text style={[styles.statusValue, { color: severityColor }]}>
                {alert.severity?.toUpperCase() || 'ACTIVE'}
              </Text>
            </View>
          </Card>

          <Card style={styles.statusCard}>
            <Text style={styles.statusLabel}>Type</Text>
            <Text style={styles.statusValue}>{alert.type?.toUpperCase() || 'HEALTH'}</Text>
          </Card>

          <Card style={styles.statusCard}>
            <Text style={styles.statusLabel}>Reported</Text>
            <Text style={styles.statusValue}>{alert.time || 'Just now'}</Text>
          </Card>

          <Card style={styles.statusCard}>
            <Text style={styles.statusLabel}>Source</Text>
            <Text style={styles.statusValue}>AyurTwin Wristband</Text>
          </Card>
        </View>

        {/* Details Section */}
        {alert.details && (
          <Card style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Additional Details</Text>
            <Text style={styles.detailsText}>{alert.details}</Text>
          </Card>
        )}

        {/* Recommendations */}
        {alert.recommendation && (
          <Card style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <Ionicons name="bulb" size={24} color={colors.warningYellow} />
              <Text style={styles.recommendationTitle}>Recommendation</Text>
            </View>
            <Text style={styles.recommendationText}>{alert.recommendation}</Text>
          </Card>
        )}

        {/* Related Metrics */}
        <Text style={styles.sectionTitle}>Related Metrics</Text>
        
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Heart Rate</Text>
            <Text style={styles.metricValue}>72 bpm</Text>
            <View style={styles.metricStatus}>
              <View style={[styles.metricDot, { backgroundColor: colors.successGreen }]} />
              <Text style={styles.metricStatusText}>Normal</Text>
            </View>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Blood Pressure</Text>
            <Text style={styles.metricValue}>120/80</Text>
            <View style={styles.metricStatus}>
              <View style={[styles.metricDot, { backgroundColor: colors.successGreen }]} />
              <Text style={styles.metricStatusText}>Normal</Text>
            </View>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Stress Level</Text>
            <Text style={styles.metricValue}>65</Text>
            <View style={styles.metricStatus}>
              <View style={[styles.metricDot, { backgroundColor: colors.warningYellow }]} />
              <Text style={styles.metricStatusText}>Elevated</Text>
            </View>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Temperature</Text>
            <Text style={styles.metricValue}>36.6°C</Text>
            <View style={styles.metricStatus}>
              <View style={[styles.metricDot, { backgroundColor: colors.successGreen }]} />
              <Text style={styles.metricStatusText}>Normal</Text>
            </View>
          </Card>
        </View>

        {/* Timeline */}
        <Text style={styles.sectionTitle}>Alert Timeline</Text>
        
        <Card style={styles.timelineCard}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, { backgroundColor: severityColor }]} />
              <View style={styles.timelineLine} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Alert Triggered</Text>
              <Text style={styles.timelineTime}>{alert.time || 'Just now'}</Text>
              <Text style={styles.timelineDesc}>Initial alert detected by sensors</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, { backgroundColor: colors.spO2Blue }]} />
              <View style={styles.timelineLine} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>System Analyzed</Text>
              <Text style={styles.timelineTime}>2 minutes later</Text>
              <Text style={styles.timelineDesc}>AI analysis confirmed the alert</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, { backgroundColor: colors.primaryGreen }]} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>You Viewed</Text>
              <Text style={styles.timelineTime}>Now</Text>
              <Text style={styles.timelineDesc}>You opened this alert</Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        {!isResolved && !isSnoozed && (
          <View style={styles.actionContainer}>
            <Button
              title="Resolve"
              onPress={handleResolve}
              style={styles.resolveButton}
              gradient
              icon="checkmark-circle"
            />
            <Button
              title="Snooze"
              onPress={handleSnooze}
              style={styles.snoozeButton}
              outline
              icon="time"
            />
          </View>
        )}

        {isResolved && (
          <Card style={styles.resolvedContainer}>
            <Ionicons name="checkmark-circle" size={30} color={colors.successGreen} />
            <Text style={styles.resolvedContainerText}>Alert marked as resolved</Text>
            <TouchableOpacity onPress={() => setIsResolved(false)}>
              <Text style={styles.undoText}>Undo</Text>
            </TouchableOpacity>
          </Card>
        )}

        {isSnoozed && (
          <Card style={styles.snoozedContainer}>
            <Ionicons name="time" size={30} color={colors.warningYellow} />
            <Text style={styles.snoozedContainerText}>Alert snoozed for 1 hour</Text>
            <TouchableOpacity onPress={() => setIsSnoozed(false)}>
              <Text style={styles.undoText}>Undo</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Contact Support */}
        <TouchableOpacity style={styles.supportLink}>
          <Ionicons name="headset" size={20} color={colors.primarySaffron} />
          <Text style={styles.supportText}>Contact Health Support</Text>
        </TouchableOpacity>

        {/* Footer Note */}
        <Text style={styles.note}>
          If you're experiencing severe symptoms, please seek immediate medical attention.
        </Text>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  shareButton: {
    padding: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 20,
  },
  errorButton: {
    width: 200,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  bannerText: {
    flex: 1,
    marginLeft: 12,
  },
  bannerSeverity: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
  },
  bannerTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    marginTop: 2,
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  resolvedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  },
  snoozedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  snoozedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  },
  alertTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  alertMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusCard: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
  },
  statusLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 8,
  },
  statusValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  detailsCard: {
    padding: 16,
    marginBottom: 16,
  },
  detailsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  detailsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  recommendationCard: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 179, 71, 0.05)',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  recommendationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  metricStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  metricStatusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  timelineCard: {
    padding: 16,
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    width: 30,
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginTop: 4,
    marginBottom: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  timelineTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  timelineDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  resolveButton: {
    flex: 1,
    marginRight: 8,
  },
  snoozeButton: {
    flex: 1,
    marginLeft: 8,
  },
  resolvedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  resolvedContainerText: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.successGreen,
    marginLeft: 12,
  },
  snoozedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
  },
  snoozedContainerText: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.warningYellow,
    marginLeft: 12,
  },
  undoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
  },
  supportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  supportText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.primarySaffron,
    marginLeft: 8,
  },
  note: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AlertDetailScreen;