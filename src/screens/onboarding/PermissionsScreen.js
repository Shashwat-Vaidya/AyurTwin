import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Camera from 'expo-camera';
import * as Calendar from 'expo-calendar';
import * as Contacts from 'expo-contacts';
import * as Bluetooth from 'expo-bluetooth';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Button from '../../components/common/Button';
import permissionHelper from '../../utils/helpers/permissionHelper';

const PermissionsScreen = () => {
  const navigation = useNavigation();
  const [permissions, setPermissions] = useState({
    notifications: { status: 'undetermined', granted: false },
    location: { status: 'undetermined', granted: false },
    camera: { status: 'undetermined', granted: false },
    bluetooth: { status: 'undetermined', granted: false },
    calendar: { status: 'undetermined', granted: false },
    contacts: { status: 'undetermined', granted: false },
  });
  const [loading, setLoading] = useState({});

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const notificationStatus = await Notifications.getPermissionsAsync();
    const locationStatus = await Location.getForegroundPermissionsAsync();
    const cameraStatus = await Camera.getCameraPermissionsAsync();
    const calendarStatus = await Calendar.getCalendarPermissionsAsync();
    const contactsStatus = await Contacts.getPermissionsAsync();

    setPermissions({
      notifications: {
        status: notificationStatus.status,
        granted: notificationStatus.granted,
      },
      location: {
        status: locationStatus.status,
        granted: locationStatus.granted,
      },
      camera: {
        status: cameraStatus.status,
        granted: cameraStatus.granted,
      },
      bluetooth: permissions.bluetooth,
      calendar: {
        status: calendarStatus.status,
        granted: calendarStatus.granted,
      },
      contacts: {
        status: contactsStatus.status,
        granted: contactsStatus.granted,
      },
    });
  };

  const requestPermission = async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));

    try {
      let result;
      switch (type) {
        case 'notifications':
          result = await permissionHelper.requestNotificationsPermission();
          break;
        case 'location':
          result = await permissionHelper.requestLocationPermission(true);
          break;
        case 'camera':
          result = await permissionHelper.requestCameraPermission();
          break;
        case 'bluetooth':
          result = await permissionHelper.requestBluetoothPermissions();
          break;
        case 'calendar':
          result = await permissionHelper.requestCalendarPermission();
          break;
        case 'contacts':
          result = await permissionHelper.requestContactsPermission();
          break;
      }

      setPermissions(prev => ({
        ...prev,
        [type]: {
          status: result.status,
          granted: result.granted,
        },
      }));

      if (!result.granted && !result.canAskAgain) {
        Alert.alert(
          'Permission Required',
          `Please enable ${type} permissions in settings to use this feature.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: permissionHelper.openAppSettings },
          ]
        );
      }
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleContinue = () => {
    const grantedPermissions = Object.values(permissions).filter(p => p.granted).length;
    if (grantedPermissions === 0) {
      Alert.alert(
        'Permissions Required',
        'Some features may not work properly without permissions. You can enable them later in settings.',
        [
          { text: 'Continue Anyway', onPress: () => navigation.navigate(ROUTES.AUTH) },
          { text: 'Review Permissions', style: 'cancel' },
        ]
      );
    } else {
      navigation.navigate(ROUTES.AUTH);
    }
  };

  const renderPermissionItem = (type, icon, title, description) => {
    const permission = permissions[type];
    const isLoading = loading[type];

    return (
      <View style={styles.permissionItem}>
        <View style={[styles.permissionIcon, { backgroundColor: `${colors.primarySaffron}20` }]}>
          <Ionicons name={icon} size={24} color={colors.primarySaffron} />
        </View>
        
        <View style={styles.permissionInfo}>
          <Text style={styles.permissionTitle}>{title}</Text>
          <Text style={styles.permissionDescription}>{description}</Text>
        </View>

        {permission?.granted ? (
          <View style={styles.grantedBadge}>
            <Ionicons name="checkmark-circle" size={24} color={colors.successGreen} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => requestPermission(type)}
            disabled={isLoading}
          >
            <Text style={styles.requestButtonText}>
              {isLoading ? 'Requesting...' : 'Allow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primarySaffron, colors.primaryGreen]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Ionicons name="shield-checkmark" size={60} color="white" />
        <Text style={styles.headerTitle}>Permissions</Text>
        <Text style={styles.headerSubtitle}>
          Allow these permissions to get the most out of AyurTwin
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {renderPermissionItem(
          'notifications',
          'notifications',
          'Notifications',
          'Get health alerts, reminders, and updates'
        )}

        {renderPermissionItem(
          'location',
          'location',
          'Location',
          'For activity tracking and location-based recommendations'
        )}

        {renderPermissionItem(
          'camera',
          'camera',
          'Camera',
          'Scan QR codes and take profile pictures'
        )}

        {renderPermissionItem(
          'bluetooth',
          'bluetooth',
          'Bluetooth',
          'Connect with your AyurTwin wearable device'
        )}

        {renderPermissionItem(
          'calendar',
          'calendar',
          'Calendar',
          'Schedule health reminders and appointments'
        )}

        {renderPermissionItem(
          'contacts',
          'contacts',
          'Contacts',
          'Share health reports with emergency contacts'
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.note}>
          You can always change these permissions later in settings
        </Text>
        <Button
          title="Continue"
          onPress={handleContinue}
          gradient
          style={styles.continueButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  header: {
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  permissionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  permissionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    lineHeight: 18,
  },
  grantedBadge: {
    padding: 4,
  },
  requestButton: {
    backgroundColor: colors.primarySaffron,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  requestButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  note: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  continueButton: {
    width: '100%',
  },
});

export default PermissionsScreen;