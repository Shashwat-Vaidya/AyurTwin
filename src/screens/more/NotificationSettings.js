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
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const NotificationSettings = () => {
  const navigation = useNavigation();

  const [settings, setSettings] = useState({
    // Push notifications
    pushEnabled: true,
    
    // Health alerts
    heartRateAlerts: true,
    heartRateThreshold: { low: 50, high: 120 },
    
    spo2Alerts: true,
    spo2Threshold: 94,
    
    temperatureAlerts: true,
    temperatureThreshold: { low: 36.0, high: 37.5 },
    
    stressAlerts: true,
    stressThreshold: 70,
    
    // Ayurvedic alerts
    doshaAlerts: true,
    doshaImbalanceThreshold: 20,
    
    // Risk alerts
    riskAlerts: true,
    riskThreshold: 40,
    
    // Device alerts
    deviceAlerts: true,
    lowBatteryAlerts: true,
    connectionAlerts: true,
    
    // Reminders
    dailyReminders: true,
    reminderTime: '08:00',
    medicationReminders: false,
    hydrationReminders: true,
    activityReminders: true,
    
    // Sound & vibration
    soundEnabled: true,
    vibrationEnabled: true,
    criticalSoundEnabled: true,
    
    // Quiet hours
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    
    // Email notifications
    emailReports: false,
    weeklySummary: true,
    monthlyReport: true,
    
    // Do not disturb
    doNotDisturb: false,
    dndStart: '23:00',
    dndEnd: '06:00',
  });

  const [expandedSection, setExpandedSection] = useState(null);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    Alert.alert('Success', 'Notification settings saved successfully');
    navigation.goBack();
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all notification settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Reset logic here
            Alert.alert('Success', 'Settings reset to default');
          },
        },
      ]
    );
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderSectionHeader = (title, icon, color = colors.primarySaffron, section) => (
    <TouchableOpacity 
      style={styles.sectionHeader}
      onPress={() => toggleSection(section)}
    >
      <View style={styles.sectionHeaderLeft}>
        <View style={[styles.sectionIcon, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Ionicons 
        name={expandedSection === section ? 'chevron-up' : 'chevron-down'} 
        size={20} 
        color={colors.textSecondary} 
      />
    </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Notification Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Master Toggle */}
        <Card style={styles.masterCard}>
          <View style={styles.masterToggle}>
            <View>
              <Text style={styles.masterTitle}>Push Notifications</Text>
              <Text style={styles.masterDescription}>Enable or disable all notifications</Text>
            </View>
            <Switch
              value={settings.pushEnabled}
              onValueChange={() => handleToggle('pushEnabled')}
              trackColor={{ false: colors.disabled, true: colors.primarySaffron }}
              thumbColor={settings.pushEnabled ? 'white' : '#f4f3f4'}
            />
          </View>
        </Card>

        {settings.pushEnabled && (
          <>
            {/* Health Alerts Section */}
            <Card style={styles.sectionCard}>
              {renderSectionHeader('Health Alerts', 'fitness-outline', colors.heartRate, 'health')}
              
              {expandedSection === 'health' && (
                <View style={styles.sectionContent}>
                  {renderToggle('Heart Rate Alerts', 'heartRateAlerts', 'Notify when heart rate is abnormal', 'heart-outline')}
                  {renderToggle('SpO₂ Alerts', 'spo2Alerts', 'Alert when oxygen drops below threshold', 'fitness-outline')}
                  {renderToggle('Temperature Alerts', 'temperatureAlerts', 'Monitor body temperature changes', 'thermometer-outline')}
                  {renderToggle('Stress Alerts', 'stressAlerts', 'Alert on high stress levels', 'flash-outline')}
                </View>
              )}
            </Card>

            {/* Ayurvedic Alerts Section */}
            <Card style={styles.sectionCard}>
              {renderSectionHeader('Ayurvedic Alerts', 'leaf-outline', colors.primaryGreen, 'ayurvedic')}
              
              {expandedSection === 'ayurvedic' && (
                <View style={styles.sectionContent}>
                  {renderToggle('Dosha Imbalance Alerts', 'doshaAlerts', 'Get notified of dosha changes', 'leaf-outline')}
                  {renderToggle('Risk Prediction Alerts', 'riskAlerts', 'Alert on increased disease risk', 'warning-outline')}
                </View>
              )}
            </Card>

            {/* Device Alerts Section */}
            <Card style={styles.sectionCard}>
              {renderSectionHeader('Device Alerts', 'hardware-chip-outline', colors.spO2Blue, 'device')}
              
              {expandedSection === 'device' && (
                <View style={styles.sectionContent}>
                  {renderToggle('Device Alerts', 'deviceAlerts', 'Hardware and connection alerts', 'hardware-chip-outline')}
                  {renderToggle('Low Battery Alerts', 'lowBatteryAlerts', 'Alert when battery is low', 'battery-dead-outline')}
                  {renderToggle('Connection Alerts', 'connectionAlerts', 'Alert on device disconnect', 'bluetooth-outline')}
                </View>
              )}
            </Card>

            {/* Reminders Section */}
            <Card style={styles.sectionCard}>
              {renderSectionHeader('Reminders', 'timer-outline', colors.warningYellow, 'reminders')}
              
              {expandedSection === 'reminders' && (
                <View style={styles.sectionContent}>
                  {renderToggle('Daily Reminders', 'dailyReminders', 'General health reminders', 'calendar-outline')}
                  
                  {settings.dailyReminders && (
                    <TouchableOpacity style={styles.timeSetting}>
                      <Text style={styles.timeLabel}>Reminder Time</Text>
                      <Text style={styles.timeValue}>{settings.reminderTime}</Text>
                    </TouchableOpacity>
                  )}
                  
                  {renderToggle('Hydration Reminders', 'hydrationReminders', 'Remember to drink water', 'water-outline')}
                  {renderToggle('Activity Reminders', 'activityReminders', 'Move reminder after inactivity', 'walk-outline')}
                  {renderToggle('Medication Reminders', 'medicationReminders', 'Take medication on time', 'medical-outline')}
                </View>
              )}
            </Card>

            {/* Sound & Vibration Section */}
            <Card style={styles.sectionCard}>
              {renderSectionHeader('Sound & Vibration', 'volume-high-outline', colors.stressPurple, 'sound')}
              
              {expandedSection === 'sound' && (
                <View style={styles.sectionContent}>
                  {renderToggle('Sound Enabled', 'soundEnabled', 'Play sound for notifications', 'volume-high-outline')}
                  {renderToggle('Vibration Enabled', 'vibrationEnabled', 'Vibrate on notifications', 'phone-portrait-outline')}
                  {renderToggle('Critical Alert Sound', 'criticalSoundEnabled', 'Special sound for critical alerts', 'alert-circle-outline')}
                </View>
              )}
            </Card>

            {/* Quiet Hours Section */}
            <Card style={styles.sectionCard}>
              {renderSectionHeader('Quiet Hours', 'moon-outline', colors.sleepIndigo, 'quiet')}
              
              {expandedSection === 'quiet' && (
                <View style={styles.sectionContent}>
                  {renderToggle('Quiet Hours', 'quietHoursEnabled', 'Mute non-critical notifications', 'moon-outline')}
                  
                  {settings.quietHoursEnabled && (
                    <>
                      <TouchableOpacity style={styles.timeSetting}>
                        <Text style={styles.timeLabel}>Start Time</Text>
                        <Text style={styles.timeValue}>{settings.quietHoursStart}</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={styles.timeSetting}>
                        <Text style={styles.timeLabel}>End Time</Text>
                        <Text style={styles.timeValue}>{settings.quietHoursEnd}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </Card>

            {/* Email Notifications Section */}
            <Card style={styles.sectionCard}>
              {renderSectionHeader('Email Reports', 'mail-outline', colors.primaryGreen, 'email')}
              
              {expandedSection === 'email' && (
                <View style={styles.sectionContent}>
                  {renderToggle('Email Reports', 'emailReports', 'Receive reports via email', 'mail-outline')}
                  
                  {settings.emailReports && (
                    <>
                      {renderToggle('Weekly Summary', 'weeklySummary', 'Weekly health summary', 'calendar-outline')}
                      {renderToggle('Monthly Report', 'monthlyReport', 'Detailed monthly report', 'document-text-outline')}
                    </>
                  )}
                </View>
              )}
            </Card>

            {/* Do Not Disturb Section */}
            <Card style={styles.sectionCard}>
              {renderSectionHeader('Do Not Disturb', 'ban-outline', colors.alertRed, 'dnd')}
              
              {expandedSection === 'dnd' && (
                <View style={styles.sectionContent}>
                  {renderToggle('Do Not Disturb', 'doNotDisturb', 'Block all notifications', 'ban-outline')}
                  
                  {settings.doNotDisturb && (
                    <>
                      <TouchableOpacity style={styles.timeSetting}>
                        <Text style={styles.timeLabel}>Start Time</Text>
                        <Text style={styles.timeValue}>{settings.dndStart}</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={styles.timeSetting}>
                        <Text style={styles.timeLabel}>End Time</Text>
                        <Text style={styles.timeValue}>{settings.dndEnd}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </Card>
          </>
        )}

        {/* Critical Alerts Note */}
        <Card style={styles.noteCard}>
          <Ionicons name="information-circle" size={20} color={colors.spO2Blue} />
          <Text style={styles.noteText}>
            Critical health alerts cannot be disabled for your safety. These include severe 
            health warnings and urgent device notifications.
          </Text>
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

        {/* Test Notification */}
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => Alert.alert('Test Notification', 'This is a test notification')}
        >
          <Ionicons name="notifications" size={20} color={colors.primarySaffron} />
          <Text style={styles.testButtonText}>Send Test Notification</Text>
        </TouchableOpacity>
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
  masterCard: {
    padding: 16,
    marginBottom: 16,
  },
  masterToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masterTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  masterDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
  },
  sectionCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
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
  timeSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginLeft: 32,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  timeLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  timeValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.primarySaffron,
  },
  noteCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
  },
  noteText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  testButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.primarySaffron,
    marginLeft: 8,
  },
});

export default NotificationSettings;