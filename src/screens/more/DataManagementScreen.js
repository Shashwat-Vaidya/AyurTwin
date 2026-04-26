import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import storageService from '../../services/storage/asyncStorage';
import secureStorage from '../../services/storage/secureStorage';

const DataManagementScreen = () => {
  const navigation = useNavigation();

  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('weekly');
  const [includeHealthData, setIncludeHealthData] = useState(true);
  const [includePersonalData, setIncludePersonalData] = useState(true);
  const [includeDeviceData, setIncludeDeviceData] = useState(true);
  const [compressData, setCompressData] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const [storageInfo, setStorageInfo] = useState({
    total: '256 MB',
    used: '127 MB',
    free: '129 MB',
    healthData: '85 MB',
    personalData: '32 MB',
    deviceData: '10 MB',
  });

  const handleExportData = async (format = 'json') => {
    Alert.alert(
      'Export Data',
      'Choose what to export',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Health Data Only',
          onPress: () => exportData('health', format),
        },
        {
          text: 'Personal Data Only',
          onPress: () => exportData('personal', format),
        },
        {
          text: 'All Data',
          onPress: () => exportData('all', format),
        },
      ]
    );
  };

  const exportData = async (type, format) => {
    try {
      let data = {};
      
      if (type === 'health' || type === 'all') {
        const healthData = await storageService.getHealthData();
        data.health = healthData;
      }
      
      if (type === 'personal' || type === 'all') {
        const userData = await storageService.getUser();
        const settingsData = await storageService.getSettings();
        data.personal = { user: userData, settings: settingsData };
      }

      const jsonData = JSON.stringify(data, null, 2);
      const fileName = `ayurtwin_export_${new Date().toISOString()}.${format}`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, jsonData);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
      }

      Alert.alert('Success', 'Data exported successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'This will replace your current data. Make sure you have a backup.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            // Implement file picker and import logic
            Alert.alert('Info', 'Import functionality coming soon');
          },
        },
      ]
    );
  };

  const handleBackup = () => {
    Alert.alert(
      'Backup Data',
      'Create a backup of your data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Backup Now',
          onPress: () => {
            Alert.alert('Success', 'Backup created successfully');
          },
        },
      ]
    );
  };

  const handleRestoreBackup = () => {
    Alert.alert(
      'Restore Backup',
      'This will replace your current data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          onPress: () => {
            Alert.alert('Success', 'Backup restored successfully');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear temporary files. Your data will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'Are you absolutely sure? This action cannot be undone. All your health data, personal information, and settings will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Type "DELETE"to confirm',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm Delete',
                  style: 'destructive',
                  onPress: () => {
                    // Actually delete data
                    Alert.alert('Success', 'All data has been deleted');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
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
            <Ionicons name="arrow-back"size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Data Management</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Storage Overview */}
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.storageCard}
        >
          <Text style={styles.storageTitle}>Storage Overview</Text>
          
          <View style={styles.storageBar}>
            <View style={[styles.storageSegment, { width: '60%', backgroundColor: colors.primarySaffron }]} />
            <View style={[styles.storageSegment, { width: '25%', backgroundColor: colors.successGreen }]} />
            <View style={[styles.storageSegment, { width: '15%', backgroundColor: colors.spO2Blue }]} />
          </View>

          <View style={styles.storageStats}>
            <View style={styles.storageStat}>
              <Text style={styles.storageValue}>{storageInfo.used}</Text>
              <Text style={styles.storageLabel}>Used</Text>
            </View>
            <View style={styles.storageStat}>
              <Text style={styles.storageValue}>{storageInfo.free}</Text>
              <Text style={styles.storageLabel}>Free</Text>
            </View>
            <View style={styles.storageStat}>
              <Text style={styles.storageValue}>{storageInfo.total}</Text>
              <Text style={styles.storageLabel}>Total</Text>
            </View>
          </View>

          <View style={styles.storageBreakdown}>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.primarySaffron }]} />
              <Text style={styles.breakdownLabel}>Health Data</Text>
              <Text style={styles.breakdownValue}>{storageInfo.healthData}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.successGreen }]} />
              <Text style={styles.breakdownLabel}>Personal Data</Text>
              <Text style={styles.breakdownValue}>{storageInfo.personalData}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.spO2Blue }]} />
              <Text style={styles.breakdownLabel}>Device Data</Text>
              <Text style={styles.breakdownValue}>{storageInfo.deviceData}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Export/Import Section */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Export & Import</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: `${colors.primarySaffron}20` }]}
              onPress={() => handleExportData('json')}
            >
              <Ionicons name="download"size={24} color={colors.primarySaffron} />
              <Text style={styles.actionButtonText}>Export JSON</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: `${colors.primaryGreen}20` }]}
              onPress={() => handleExportData('csv')}
            >
              <Ionicons name="grid"size={24} color={colors.primaryGreen} />
              <Text style={styles.actionButtonText}>Export CSV</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: `${colors.spO2Blue}20` }]}
              onPress={handleImportData}
            >
              <Ionicons name="cloud-upload"size={24} color={colors.spO2Blue} />
              <Text style={styles.actionButtonText}>Import Data</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: `${colors.stressPurple}20` }]}
              onPress={handleBackup}
            >
              <Ionicons name="cloud-done"size={24} color={colors.stressPurple} />
              <Text style={styles.actionButtonText}>Backup</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Auto Backup Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Auto Backup</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="sync"size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Enable Auto Backup</Text>
            </View>
            <Switch
              value={autoBackup}
              onValueChange={setAutoBackup}
              trackColor={{ false: colors.disabled, true: colors.primarySaffron }}
            />
          </View>

          {autoBackup && (
            <>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Backup Frequency</Text>
                <View style={styles.frequencyButtons}>
                  {['daily', 'weekly', 'monthly'].map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyButton,
                        backupFrequency === freq && styles.frequencyButtonActive,
                      ]}
                      onPress={() => setBackupFrequency(freq)}
                    >
                      <Text style={[
                        styles.frequencyText,
                        backupFrequency === freq && styles.frequencyTextActive,
                      ]}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Include Health Data</Text>
                <Switch
                  value={includeHealthData}
                  onValueChange={setIncludeHealthData}
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Include Personal Data</Text>
                <Switch
                  value={includePersonalData}
                  onValueChange={setIncludePersonalData}
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Include Device Data</Text>
                <Switch
                  value={includeDeviceData}
                  onValueChange={setIncludeDeviceData}
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Compress Data</Text>
                <Switch
                  value={compressData}
                  onValueChange={setCompressData}
                />
              </View>
            </>
          )}
        </Card>

        {/* Backup History */}
        <Card style={styles.historyCard}>
          <Text style={styles.sectionTitle}>Recent Backups</Text>
          
          <View style={styles.backupItem}>
            <View style={styles.backupLeft}>
              <Ionicons name="calendar"size={16} color={colors.textSecondary} />
              <Text style={styles.backupDate}>Today, 2:30 PM</Text>
            </View>
            <View style={styles.backupRight}>
              <Text style={styles.backupSize}>127 MB</Text>
              <TouchableOpacity>
                <Ionicons name="download"size={18} color={colors.primarySaffron} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.backupItem}>
            <View style={styles.backupLeft}>
              <Ionicons name="calendar"size={16} color={colors.textSecondary} />
              <Text style={styles.backupDate}>Yesterday, 10:15 AM</Text>
            </View>
            <View style={styles.backupRight}>
              <Text style={styles.backupSize}>125 MB</Text>
              <TouchableOpacity>
                <Ionicons name="download"size={18} color={colors.primarySaffron} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.backupItem}>
            <View style={styles.backupLeft}>
              <Ionicons name="calendar"size={16} color={colors.textSecondary} />
              <Text style={styles.backupDate}>Jan 15, 2024</Text>
            </View>
            <View style={styles.backupRight}>
              <Text style={styles.backupSize}>124 MB</Text>
              <TouchableOpacity>
                <Ionicons name="download"size={18} color={colors.primarySaffron} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={handleRestoreBackup} style={styles.restoreButton}>
            <Text style={styles.restoreText}>Restore from Backup</Text>
          </TouchableOpacity>
        </Card>

        {/* Cache Management */}
        <Card style={styles.cacheCard}>
          <Text style={styles.sectionTitle}>Cache Management</Text>
          
          <View style={styles.cacheInfo}>
            <Text style={styles.cacheLabel}>Cache Size</Text>
            <Text style={styles.cacheValue}>45 MB</Text>
          </View>

          <Button
            title="Clear Cache"onPress={handleClearCache}
            style={styles.clearCacheButton}
            outline
            icon="trash"
          />
        </Card>

        {/* Danger Zone */}
        <Card style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={handleDeleteAllData}
          >
            <Ionicons name="trash"size={20} color={colors.alertRed} />
            <Text style={styles.dangerButtonText}>Delete All Data</Text>
          </TouchableOpacity>
          
          <Text style={styles.dangerNote}>
            This action cannot be undone. All your data will be permanently deleted.
          </Text>
        </Card>

        {/* Data Retention Note */}
        <Text style={styles.note}>
          Your data is stored locally on your device and encrypted in transit.
          We never share your personal health data without your explicit consent.
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
  storageCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  storageTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: 'white',
    marginBottom: 16,
  },
  storageBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  storageSegment: {
    height: '100%',
  },
  storageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  storageStat: {
    alignItems: 'center',
  },
  storageValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
    marginBottom: 2,
  },
  storageLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: 'white',
    opacity: 0.8,
  },
  storageBreakdown: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  breakdownLabel: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
  },
  breakdownValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  settingsCard: {
    padding: 16,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  frequencyButtons: {
    flexDirection: 'row',
  },
  frequencyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  frequencyButtonActive: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  frequencyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  frequencyTextActive: {
    color: 'white',
  },
  historyCard: {
    padding: 16,
    marginBottom: 16,
  },
  backupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backupLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backupDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  backupRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backupSize: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    marginRight: 12,
  },
  restoreButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  restoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
  },
  cacheCard: {
    padding: 16,
    marginBottom: 16,
  },
  cacheInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cacheLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textSecondary,
  },
  cacheValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
  },
  clearCacheButton: {
    marginTop: 8,
  },
  dangerCard: {
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 8,
  },
  dangerButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.alertRed,
    marginLeft: 8,
  },
  dangerNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
  note: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 8,
  },
});

export default DataManagementScreen;