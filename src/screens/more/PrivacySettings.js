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

const PrivacySettings = () => {
  const navigation = useNavigation();

  const [settings, setSettings] = useState({
    // Data sharing
    shareData: false,
    shareAnonymous: true,
    shareForResearch: false,
    
    // Data collection
    collectLocation: true,
    collectActivity: true,
    collectHealthMetrics: true,
    collectDeviceInfo: true,
    
    // Data retention
    autoDeleteData: false,
    dataRetentionPeriod: '1 year',
    
    // Marketing
    receivePromotions: false,
    receiveNewsletter: true,
    
    // Analytics
    sendCrashReports: true,
    sendAnalytics: true,
    
    // Third party
    allowThirdParty: false,
    
    // Biometric
    biometricLogin: true,
    
    // Two factor
    twoFactorAuth: false,
    
    // Data export
    dataExportFormat: 'JSON',
  });

  const [expandedSection, setExpandedSection] = useState(null);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    Alert.alert('Success', 'Privacy settings saved successfully');
    navigation.goBack();
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all privacy settings to default?',
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

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Choose export format',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'JSON', onPress: () => Alert.alert('Export', 'Data exported as JSON') },
        { text: 'CSV', onPress: () => Alert.alert('Export', 'Data exported as CSV') },
        { text: 'PDF', onPress: () => Alert.alert('Export', 'Data exported as PDF') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => Alert.alert('Account Deleted', 'Your account has been deleted'),
        },
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert('Download', 'Your data download has started');
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all health history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive' },
      ]
    );
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
          <Text style={styles.headerTitle}>Privacy Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Privacy Summary Card */}
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <Ionicons name="shield-checkmark" size={40} color="white" />
          <Text style={styles.summaryTitle}>Your Privacy Matters</Text>
          <Text style={styles.summaryText}>
            We take your privacy seriously. Your health data is encrypted and never shared without your consent.
          </Text>
        </LinearGradient>

        {/* Data Sharing Section */}
        <Card style={styles.sectionCard}>
          {renderSectionHeader('Data Sharing', 'share-outline', colors.primaryGreen, 'sharing')}
          
          {expandedSection === 'sharing' && (
            <View style={styles.sectionContent}>
              {renderToggle('Share Data with AyurTwin', 'shareData', 'Help improve our services', 'share-outline')}
              {renderToggle('Share Anonymous Data', 'shareAnonymous', 'Data cannot be traced to you', 'incognito-outline')}
              {renderToggle('Share for Research', 'shareForResearch', 'Contribute to health research', 'flask-outline')}
            </View>
          )}
        </Card>

        {/* Data Collection Section */}
        <Card style={styles.sectionCard}>
          {renderSectionHeader('Data Collection', 'analytics-outline', colors.spO2Blue, 'collection')}
          
          {expandedSection === 'collection' && (
            <View style={styles.sectionContent}>
              {renderToggle('Location Data', 'collectLocation', 'For activity tracking', 'location-outline')}
              {renderToggle('Activity Data', 'collectActivity', 'Steps and movement', 'walk-outline')}
              {renderToggle('Health Metrics', 'collectHealthMetrics', 'Heart rate, SpO₂, etc.', 'fitness-outline')}
              {renderToggle('Device Information', 'collectDeviceInfo', 'Model, OS version', 'hardware-chip-outline')}
            </View>
          )}
        </Card>

        {/* Data Retention Section */}
        <Card style={styles.sectionCard}>
          {renderSectionHeader('Data Retention', 'time-outline', colors.warningYellow, 'retention')}
          
          {expandedSection === 'retention' && (
            <View style={styles.sectionContent}>
              {renderToggle('Auto-delete Old Data', 'autoDeleteData', 'Automatically remove old records', 'trash-outline')}
              
              <TouchableOpacity style={styles.optionItem}>
                <Text style={styles.optionLabel}>Retention Period</Text>
                <View style={styles.optionValue}>
                  <Text style={styles.optionText}>{settings.dataRetentionPeriod}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Marketing Preferences Section */}
        <Card style={styles.sectionCard}>
          {renderSectionHeader('Marketing', 'megaphone-outline', colors.heartRate, 'marketing')}
          
          {expandedSection === 'marketing' && (
            <View style={styles.sectionContent}>
              {renderToggle('Promotional Emails', 'receivePromotions', 'Offers and updates', 'mail-outline')}
              {renderToggle('Newsletter', 'receiveNewsletter', 'Health tips and articles', 'newspaper-outline')}
            </View>
          )}
        </Card>

        {/* Analytics Section */}
        <Card style={styles.sectionCard}>
          {renderSectionHeader('Analytics', 'bar-chart-outline', colors.stressPurple, 'analytics')}
          
          {expandedSection === 'analytics' && (
            <View style={styles.sectionContent}>
              {renderToggle('Crash Reports', 'sendCrashReports', 'Help us fix issues', 'bug-outline')}
              {renderToggle('Usage Analytics', 'sendAnalytics', 'Improve user experience', 'analytics-outline')}
            </View>
          )}
        </Card>

        {/* Security Section */}
        <Card style={styles.sectionCard}>
          {renderSectionHeader('Security', 'lock-closed-outline', colors.primarySaffron, 'security')}
          
          {expandedSection === 'security' && (
            <View style={styles.sectionContent}>
              {renderToggle('Biometric Login', 'biometricLogin', 'Use fingerprint or face ID', 'finger-print-outline')}
              {renderToggle('Two-Factor Auth', 'twoFactorAuth', 'Extra security layer', 'shield-checkmark-outline')}
              
              <TouchableOpacity style={styles.optionItem}>
                <Text style={styles.optionLabel}>Change Password</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Data Management Section */}
        <Card style={styles.sectionCard}>
          {renderSectionHeader('Data Management', 'document-text-outline', colors.primaryGreen, 'data')}
          
          {expandedSection === 'data' && (
            <View style={styles.sectionContent}>
              <TouchableOpacity style={styles.optionItem} onPress={handleExportData}>
                <Text style={styles.optionLabel}>Export My Data</Text>
                <View style={styles.optionValue}>
                  <Text style={styles.optionText}>{settings.dataExportFormat}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionItem} onPress={handleDownloadData}>
                <Text style={styles.optionLabel}>Download Data</Text>
                <Ionicons name="download-outline" size={20} color={colors.primarySaffron} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionItem} onPress={handleClearHistory}>
                <Text style={styles.optionLabel}>Clear Health History</Text>
                <Ionicons name="trash-outline" size={20} color={colors.alertRed} />
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Third Party Section */}
        <Card style={styles.sectionCard}>
          {renderSectionHeader('Third Party', 'apps-outline', colors.textSecondary, 'third')}
          
          {expandedSection === 'third' && (
            <View style={styles.sectionContent}>
              {renderToggle('Allow Third Party', 'allowThirdParty', 'Connect with other apps', 'apps-outline')}
              
              <TouchableOpacity style={styles.optionItem}>
                <Text style={styles.optionLabel}>Connected Apps</Text>
                <View style={styles.optionValue}>
                  <Text style={styles.optionText}>0</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Privacy Policy Links */}
        <Card style={styles.linksCard}>
          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="document-text" size={20} color={colors.primarySaffron} />
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="document-text" size={20} color={colors.primarySaffron} />
            <Text style={styles.linkText}>Terms of Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="document-text" size={20} color={colors.primarySaffron} />
            <Text style={styles.linkText}>Data Processing Agreement</Text>
          </TouchableOpacity>
        </Card>

        {/* Danger Zone */}
        <Card style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          
          <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAccount}>
            <Ionicons name="trash" size={20} color={colors.alertRed} />
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
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

        {/* Last Updated */}
        <Text style={styles.lastUpdated}>
          Privacy settings last updated: March 15, 2024
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
  summaryCard: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
    marginTop: 12,
    marginBottom: 8,
  },
  summaryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
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
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  optionLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
  },
  optionValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 4,
  },
  linksCard: {
    padding: 16,
    marginBottom: 16,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  linkText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  dangerCard: {
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.alertRed,
    backgroundColor: 'rgba(255, 90, 95, 0.05)',
  },
  dangerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.alertRed,
    marginBottom: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.alertRed,
    borderRadius: 8,
  },
  dangerButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.alertRed,
    marginLeft: 8,
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
  lastUpdated: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});

export default PrivacySettings;