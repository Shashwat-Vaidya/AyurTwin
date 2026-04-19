import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import {
  updateNotifications,
  setUnits,
  setLanguage,
  updatePrivacy,
  updateDataSync,
  setLastSync,
} from '../../store/slices/settingsSlice';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);

  // Local state for switches to provide immediate feedback
  const [notifications, setNotifications] = useState(settings.notifications);
  const [units, setUnitsLocal] = useState(settings.units);
  const [language, setLanguageLocal] = useState(settings.language);
  const [privacy, setPrivacyLocal] = useState(settings.privacy);
  const [dataSync, setDataSyncLocal] = useState(settings.dataSync);

  // Handle notification toggle with permission check
  const handleNotificationToggle = async (key, value) => {
    if (key === 'enabled' && value) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings to receive alerts.',
            [{ text: 'OK' }]
          );
          return;
        }
      }
    }
    setNotifications((prev) => ({ ...prev, [key]: value }));
    dispatch(updateNotifications({ [key]: value }));
  };

  // Handle unit change
  const handleUnitChange = (type, value) => {
    setUnitsLocal((prev) => ({ ...prev, [type]: value }));
    dispatch(setUnits({ [type]: value }));
  };

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguageLocal(lang);
    dispatch(setLanguage(lang));
    // Here you would also trigger i18n change if implemented
  };

  // Handle privacy toggle
  const handlePrivacyToggle = (key, value) => {
    setPrivacyLocal((prev) => ({ ...prev, [key]: value }));
    dispatch(updatePrivacy({ [key]: value }));
  };

  // Handle data sync toggle
  const handleDataSyncToggle = (key, value) => {
    setDataSyncLocal((prev) => ({ ...prev, [key]: value }));
    dispatch(updateDataSync({ [key]: value }));
  };

  // Simulate manual sync
  const handleManualSync = () => {
    Alert.alert('Sync', 'Syncing your data...', [{ text: 'OK' }]);
    dispatch(setLastSync(new Date().toISOString()));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Notifications Section */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={notifications.enabled}
            onValueChange={(val) => handleNotificationToggle('enabled', val)}
            trackColor={{ false: colors.disabled, true: colors.primaryGreen }}
            thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
          />
        </View>
        {notifications.enabled && (
          <>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Health Alerts</Text>
              <Switch
                value={notifications.alerts}
                onValueChange={(val) => handleNotificationToggle('alerts', val)}
                trackColor={{ false: colors.disabled, true: colors.primaryGreen }}
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Daily Reminders</Text>
              <Switch
                value={notifications.dailyReminders}
                onValueChange={(val) => handleNotificationToggle('dailyReminders', val)}
                trackColor={{ false: colors.disabled, true: colors.primaryGreen }}
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Stress Alerts</Text>
              <Switch
                value={notifications.stressAlerts}
                onValueChange={(val) => handleNotificationToggle('stressAlerts', val)}
                trackColor={{ false: colors.disabled, true: colors.primaryGreen }}
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Dosha Alerts</Text>
              <Switch
                value={notifications.doshaAlerts}
                onValueChange={(val) => handleNotificationToggle('doshaAlerts', val)}
                trackColor={{ false: colors.disabled, true: colors.primaryGreen }}
              />
            </View>
          </>
        )}
      </Card>

      {/* Units Section */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Units</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Height</Text>
          <View style={styles.unitOptions}>
            <TouchableOpacity
              style={[styles.unitOption, units.height === 'cm' && styles.unitOptionActive]}
              onPress={() => handleUnitChange('height', 'cm')}
            >
              <Text style={[styles.unitOptionText, units.height === 'cm' && styles.unitOptionTextActive]}>cm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitOption, units.height === 'ft' && styles.unitOptionActive]}
              onPress={() => handleUnitChange('height', 'ft')}
            >
              <Text style={[styles.unitOptionText, units.height === 'ft' && styles.unitOptionTextActive]}>ft/in</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Weight</Text>
          <View style={styles.unitOptions}>
            <TouchableOpacity
              style={[styles.unitOption, units.weight === 'kg' && styles.unitOptionActive]}
              onPress={() => handleUnitChange('weight', 'kg')}
            >
              <Text style={[styles.unitOptionText, units.weight === 'kg' && styles.unitOptionTextActive]}>kg</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitOption, units.weight === 'lbs' && styles.unitOptionActive]}
              onPress={() => handleUnitChange('weight', 'lbs')}
            >
              <Text style={[styles.unitOptionText, units.weight === 'lbs' && styles.unitOptionTextActive]}>lbs</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Temperature</Text>
          <View style={styles.unitOptions}>
            <TouchableOpacity
              style={[styles.unitOption, units.temperature === 'celsius' && styles.unitOptionActive]}
              onPress={() => handleUnitChange('temperature', 'celsius')}
            >
              <Text style={[styles.unitOptionText, units.temperature === 'celsius' && styles.unitOptionTextActive]}>°C</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitOption, units.temperature === 'fahrenheit' && styles.unitOptionActive]}
              onPress={() => handleUnitChange('temperature', 'fahrenheit')}
            >
              <Text style={[styles.unitOptionText, units.temperature === 'fahrenheit' && styles.unitOptionTextActive]}>°F</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Distance</Text>
          <View style={styles.unitOptions}>
            <TouchableOpacity
              style={[styles.unitOption, units.distance === 'km' && styles.unitOptionActive]}
              onPress={() => handleUnitChange('distance', 'km')}
            >
              <Text style={[styles.unitOptionText, units.distance === 'km' && styles.unitOptionTextActive]}>km</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitOption, units.distance === 'miles' && styles.unitOptionActive]}
              onPress={() => handleUnitChange('distance', 'miles')}
            >
              <Text style={[styles.unitOptionText, units.distance === 'miles' && styles.unitOptionTextActive]}>miles</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {/* Language Section */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Language</Text>
        <TouchableOpacity
          style={[styles.languageOption, language === 'en' && styles.languageOptionActive]}
          onPress={() => handleLanguageChange('en')}
        >
          <Text style={[styles.languageText, language === 'en' && styles.languageTextActive]}>English</Text>
          {language === 'en' && <Ionicons name="checkmark" size={20} color={colors.primaryGreen} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.languageOption, language === 'hi' && styles.languageOptionActive]}
          onPress={() => handleLanguageChange('hi')}
        >
          <Text style={[styles.languageText, language === 'hi' && styles.languageTextActive]}>हिन्दी (Hindi)</Text>
          {language === 'hi' && <Ionicons name="checkmark" size={20} color={colors.primaryGreen} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.languageOption, language === 'ta' && styles.languageOptionActive]}
          onPress={() => handleLanguageChange('ta')}
        >
          <Text style={[styles.languageText, language === 'ta' && styles.languageTextActive]}>தமிழ் (Tamil)</Text>
          {language === 'ta' && <Ionicons name="checkmark" size={20} color={colors.primaryGreen} />}
        </TouchableOpacity>
      </Card>

      {/* Privacy Section */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Share Anonymous Data</Text>
          <Switch
            value={privacy.shareData}
            onValueChange={(val) => handlePrivacyToggle('shareData', val)}
            trackColor={{ false: colors.disabled, true: colors.primaryGreen }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Usage Analytics</Text>
          <Switch
            value={privacy.anonymousUsage}
            onValueChange={(val) => handlePrivacyToggle('anonymousUsage', val)}
            trackColor={{ false: colors.disabled, true: colors.primaryGreen }}
          />
        </View>
      </Card>

      {/* Data Sync Section */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Data Sync</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Auto Sync</Text>
          <Switch
            value={dataSync.autoSync}
            onValueChange={(val) => handleDataSyncToggle('autoSync', val)}
            trackColor={{ false: colors.disabled, true: colors.primaryGreen }}
          />
        </View>
        {dataSync.autoSync && (
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Sync Interval (minutes)</Text>
            <View style={styles.intervalSelector}>
              {[30, 60, 120].map((interval) => (
                <TouchableOpacity
                  key={interval}
                  style={[
                    styles.intervalOption,
                    dataSync.syncInterval === interval && styles.intervalOptionActive,
                  ]}
                  onPress={() => handleDataSyncToggle('syncInterval', interval)}
                >
                  <Text
                    style={[
                      styles.intervalText,
                      dataSync.syncInterval === interval && styles.intervalTextActive,
                    ]}
                  >
                    {interval}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Last Sync</Text>
          <Text style={styles.lastSyncValue}>
            {dataSync.lastSync ? new Date(dataSync.lastSync).toLocaleString() : 'Never'}
          </Text>
        </View>
        <TouchableOpacity style={styles.syncButton} onPress={handleManualSync}>
          <Ionicons name="sync" size={20} color={colors.primarySaffron} />
          <Text style={styles.syncButtonText}>Sync Now</Text>
        </TouchableOpacity>
      </Card>

      {/* App Info */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>App Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Build</Text>
          <Text style={styles.infoValue}>2025.03.14</Text>
        </View>
      </Card>

      {/* Danger Zone */}
      <Card style={[styles.sectionCard, styles.dangerCard]}>
        <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() =>
            Alert.alert(
              'Reset All Settings',
              'Are you sure? This will reset all preferences to default.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Reset',
                  style: 'destructive',
                  onPress: () => {
                    // Dispatch reset action (you'll need to add this to settings slice)
                    // For now, just show message
                    Alert.alert('Settings reset to default');
                  },
                },
              ]
            )
          }
        >
          <Ionicons name="refresh" size={20} color={colors.alertRed} />
          <Text style={styles.dangerButtonText}>Reset All Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() =>
            Alert.alert(
              'Clear All Data',
              'This will delete all locally stored data. Your account will remain.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: () => {} },
              ]
            )
          }
        >
          <Ionicons name="trash" size={20} color={colors.alertRed} />
          <Text style={styles.dangerButtonText}>Clear Local Data</Text>
        </TouchableOpacity>
      </Card>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  unitOptions: {
    flexDirection: 'row',
  },
  unitOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    marginLeft: 8,
  },
  unitOptionActive: {
    backgroundColor: colors.primarySaffron,
  },
  unitOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  unitOptionTextActive: {
    color: 'white',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  languageOptionActive: {
    borderColor: colors.primaryGreen,
    backgroundColor: `${colors.primaryGreen}10`,
  },
  languageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textPrimary,
  },
  languageTextActive: {
    color: colors.primaryGreen,
    fontFamily: 'Inter-SemiBold',
  },
  intervalSelector: {
    flexDirection: 'row',
  },
  intervalOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    marginLeft: 8,
  },
  intervalOptionActive: {
    backgroundColor: colors.primaryGreen,
  },
  intervalText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  intervalTextActive: {
    color: 'white',
  },
  lastSyncValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textPrimary,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: `${colors.primarySaffron}10`,
    borderRadius: 20,
    marginTop: 12,
  },
  syncButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.primarySaffron,
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  dangerCard: {
    borderColor: colors.alertRed,
    borderWidth: 1,
  },
  dangerTitle: {
    color: colors.alertRed,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,90,95,0.2)',
  },
  dangerButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.alertRed,
    marginLeft: 12,
  },
  bottomPadding: {
    height: 30,
  },
});

export default SettingsScreen;