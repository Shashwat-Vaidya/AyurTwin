import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AlertSettingsScreen = () => {
  const navigation = useNavigation();

  // Alert settings state
  const [settings, setSettings] = useState({
    // Health alerts
    heartRateAlerts: true,
    heartRateThreshold: {
      low: 50,
      high: 120,
    },
    spo2Alerts: true,
    spo2Threshold: 94,
    temperatureAlerts: true,
    temperatureThreshold: {
      low: 36.0,
      high: 37.5,
    },
    stressAlerts: true,
    stressThreshold: 70,
    
    // General settings
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
    criticalAlertsOnly: false,
    quietHours: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    
    // Dosha alerts
    doshaAlerts: true,
    doshaImbalanceThreshold: 20, // percentage change
    
    // Risk alerts
    riskAlerts: true,
    riskThreshold: 40, // percentage
    
    // Device alerts
    deviceAlerts: true,
    lowBatteryAlerts: true,
    connectionAlerts: true,
  });

  const [showThresholds, setShowThresholds] = useState({
    heart: false,
    temperature: false,
    stress: false,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    Alert.alert('Success', 'Alert settings saved successfully');
    navigation.goBack();
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all alert settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // Reset to defaults
            setSettings({
              heartRateAlerts: true,
              heartRateThreshold: { low: 50, high: 120 },
              spo2Alerts: true,
              spo2Threshold: 94,
              temperatureAlerts: true,
              temperatureThreshold: { low: 36.0, high: 37.5 },
              stressAlerts: true,
              stressThreshold: 70,
              pushNotifications: true,
              emailNotifications: false,
              smsNotifications: false,
              criticalAlertsOnly: false,
              quietHours: false,
              quietHoursStart: '22:00',
              quietHoursEnd: '07:00',
              doshaAlerts: true,
              doshaImbalanceThreshold: 20,
              riskAlerts: true,
              riskThreshold: 40,
              deviceAlerts: true,
              lowBatteryAlerts: true,
              connectionAlerts: true,
            });
            Alert.alert('Success', 'Settings reset to default');
          }
        }
      ]
    );
  };

  const renderSectionHeader = (title, icon, color = colors.primarySaffron) => (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderToggle = (label, key, description, icon) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        {icon && <Ionicons name={icon} size={20} color={colors.textSecondary} style={styles.settingIcon} />}
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>{label}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
      </View>
      <Switch
        value={settings[key]}
        onValueChange={() => handleToggle(key)}
        trackColor={{ false: colors.disabled, true: colors.primarySaffron }}
        thumbColor={settings[key] ? 'white' : '#f4f3f4'}
      />
    </View>
  );

  const renderThresholdItem = (label, value, unit, onPress) => (
    <TouchableOpacity style={styles.thresholdItem} onPress={onPress}>
      <Text style={styles.thresholdLabel}>{label}</Text>
      <View style={styles.thresholdValueContainer}>
        <Text style={styles.thresholdValue}>{value}</Text>
        <Text style={styles.thresholdUnit}>{unit}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>Alert Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Notification Channels */}
        <Card style={styles.section}>
          {renderSectionHeader('Notification Channels', 'notifications-outline', colors.spO2Blue)}
          
          {renderToggle('Push Notifications', 'pushNotifications', 'Receive alerts on your device', 'phone-portrait-outline')}
          {renderToggle('Email Notifications', 'emailNotifications', 'Send alerts to your email', 'mail-outline')}
          {renderToggle('SMS Notifications', 'smsNotifications', 'Get text messages for critical alerts', 'chatbubble-outline')}
        </Card>

        {/* Health Alerts */}
        <Card style={styles.section}>
          {renderSectionHeader('Health Alerts', 'fitness-outline', colors.heartRate)}
          
          {renderToggle('Heart Rate Alerts', 'heartRateAlerts', 'Get notified for abnormal heart rate', 'heart-outline')}
          
          {settings.heartRateAlerts && (
            <View style={styles.subSettings}>
              {renderThresholdItem(
                'Low Threshold',
                settings.heartRateThreshold.low,
                'bpm',
                () => {}
              )}
              {renderThresholdItem(
                'High Threshold',
                settings.heartRateThreshold.high,
                'bpm',
                () => {}
              )}
            </View>
          )}

          {renderToggle('SpO₂ Alerts', 'spo2Alerts', 'Alert when oxygen drops', 'fitness-outline')}
          
          {settings.spo2Alerts && (
            <View style={styles.subSettings}>
              {renderThresholdItem(
                'Minimum SpO₂',
                settings.spo2Threshold,
                '%',
                () => {}
              )}
            </View>
          )}

          {renderToggle('Temperature Alerts', 'temperatureAlerts', 'Monitor body temperature', 'thermometer-outline')}
          
          {settings.temperatureAlerts && (
            <View style={styles.subSettings}>
              {renderThresholdItem(
                'Low Threshold',
                settings.temperatureThreshold.low,
                '°C',
                () => {}
              )}
              {renderThresholdItem(
                'High Threshold',
                settings.temperatureThreshold.high,
                '°C',
                () => {}
              )}
            </View>
          )}

          {renderToggle('Stress Alerts', 'stressAlerts', 'Alert on high stress levels', 'flash-outline')}
          
          {settings.stressAlerts && (
            <View style={styles.subSettings}>
              {renderThresholdItem(
                'Stress Threshold',
                settings.stressThreshold,
                '/100',
                () => {}
              )}
            </View>
          )}
        </Card>

        {/* Ayurvedic Alerts */}
        <Card style={styles.section}>
          {renderSectionHeader('Ayurvedic Alerts', 'leaf-outline', colors.primaryGreen)}
          
          {renderToggle('Dosha Imbalance Alerts', 'doshaAlerts', 'Get notified of dosha changes', 'leaf-outline')}
          
          {settings.doshaAlerts && (
            <View style={styles.subSettings}>
              {renderThresholdItem(
                'Imbalance Threshold',
                `${settings.doshaImbalanceThreshold}%`,
                'change',
                () => {}
              )}
            </View>
          )}
        </Card>

        {/* Risk Prediction Alerts */}
        <Card style={styles.section}>
          {renderSectionHeader('Risk Alerts', 'warning-outline', colors.warningYellow)}
          
          {renderToggle('Risk Prediction Alerts', 'riskAlerts', 'Alert on increased disease risk', 'warning-outline')}
          
          {settings.riskAlerts && (
            <View style={styles.subSettings}>
              {renderThresholdItem(
                'Risk Threshold',
                `${settings.riskThreshold}%`,
                'probability',
                () => {}
              )}
            </View>
          )}
        </Card>

        {/* Device Alerts */}
        <Card style={styles.section}>
          {renderSectionHeader('Device Alerts', 'hardware-chip-outline', colors.spO2Blue)}
          
          {renderToggle('Device Alerts', 'deviceAlerts', 'Hardware and connection alerts', 'hardware-chip-outline')}
          
          {settings.deviceAlerts && (
            <View style={styles.subSettings}>
              {renderToggle('Low Battery Alerts', 'lowBatteryAlerts', 'Alert when battery is low', 'battery-dead-outline')}
              {renderToggle('Connection Alerts', 'connectionAlerts', 'Alert on device disconnect', 'bluetooth-outline')}
            </View>
          )}
        </Card>

        {/* Advanced Settings */}
        <Card style={styles.section}>
          {renderSectionHeader('Advanced', 'settings-outline', colors.textSecondary)}
          
          {renderToggle('Critical Alerts Only', 'criticalAlertsOnly', 'Only receive critical alerts', 'alert-circle-outline')}
          
          {renderToggle('Quiet Hours', 'quietHours', 'Mute non-critical alerts', 'moon-outline')}
          
          {settings.quietHours && (
            <View style={styles.quietHoursContainer}>
              <TouchableOpacity style={styles.quietTimeButton}>
                <Text style={styles.quietTimeLabel}>Start</Text>
                <Text style={styles.quietTimeValue}>{settings.quietHoursStart}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quietTimeButton}>
                <Text style={styles.quietTimeLabel}>End</Text>
                <Text style={styles.quietTimeValue}>{settings.quietHoursEnd}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Save Settings"
            onPress={handleSave}
            style={styles.saveButton}
            gradient
          />
          <Button
            title="Reset"
            onPress={handleReset}
            style={styles.resetButton}
            outline
          />
        </View>

        {/* Test Alert Button */}
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => Alert.alert('Test Alert', 'This is a test notification')}
        >
          <Ionicons name="notifications" size={20} color={colors.primarySaffron} />
          <Text style={styles.testButtonText}>Send Test Alert</Text>
        </TouchableOpacity>

        {/* Info Note */}
        <Text style={styles.note}>
          Critical alerts cannot be disabled for your safety. These include severe 
          health warnings and device disconnection alerts.
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
  section: {
    marginBottom: 20,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
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
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  subSettings: {
    marginLeft: 32,
    marginTop: 4,
    marginBottom: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255, 153, 51, 0.2)',
  },
  thresholdItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  thresholdLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  thresholdValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thresholdValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginRight: 4,
  },
  thresholdUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginRight: 8,
  },
  quietHoursContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  quietTimeButton: {
    alignItems: 'center',
    padding: 10,
  },
  quietTimeLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  quietTimeValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.primarySaffron,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
  },
  resetButton: {
    flex: 1,
    marginLeft: 8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    borderRadius: 30,
    marginBottom: 16,
  },
  testButtonText: {
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

export default AlertSettingsScreen;