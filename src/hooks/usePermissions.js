import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Camera from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Calendar from 'expo-calendar';
import * as Contacts from 'expo-contacts';
import * as MediaLibrary from 'expo-media-library';
import * as Bluetooth from 'expo-bluetooth';

import permissionHelper from '../utils/helpers/permissionHelper';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState({
    camera: { status: 'undetermined', granted: false },
    photoLibrary: { status: 'undetermined', granted: false },
    location: { status: 'undetermined', granted: false },
    notifications: { status: 'undetermined', granted: false },
    calendar: { status: 'undetermined', granted: false },
    contacts: { status: 'undetermined', granted: false },
    mediaLibrary: { status: 'undetermined', granted: false },
    bluetooth: { status: 'undetermined', granted: false },
    motion: { status: 'undetermined', granted: false },
  });

  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAllPermissions();
  }, []);

  const checkAllPermissions = async () => {
    const newPermissions = { ...permissions };

    // Camera
    const camera = await Camera.getCameraPermissionsAsync();
    newPermissions.camera = {
      status: camera.status,
      granted: camera.granted,
    };

    // Photo Library
    const photoLibrary = await ImagePicker.getMediaLibraryPermissionsAsync();
    newPermissions.photoLibrary = {
      status: photoLibrary.status,
      granted: photoLibrary.granted,
    };

    // Location
    const location = await Location.getForegroundPermissionsAsync();
    newPermissions.location = {
      status: location.status,
      granted: location.granted,
    };

    // Notifications
    const notifications = await Notifications.getPermissionsAsync();
    newPermissions.notifications = {
      status: notifications.status,
      granted: notifications.granted,
    };

    // Calendar
    const calendar = await Calendar.getCalendarPermissionsAsync();
    newPermissions.calendar = {
      status: calendar.status,
      granted: calendar.granted,
    };

    // Contacts
    const contacts = await Contacts.getPermissionsAsync();
    newPermissions.contacts = {
      status: contacts.status,
      granted: contacts.granted,
    };

    // Media Library
    const mediaLibrary = await MediaLibrary.getPermissionsAsync();
    newPermissions.mediaLibrary = {
      status: mediaLibrary.status,
      granted: mediaLibrary.granted,
    };

    // Bluetooth (Android only)
    if (Platform.OS === 'android') {
      // Check Bluetooth permissions
      // This is simplified - actual implementation would use Bluetooth module
    }

    setPermissions(newPermissions);
  };

  const requestPermission = useCallback(async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    setError(null);

    try {
      let result;
      switch (type) {
        case 'camera':
          result = await permissionHelper.requestCameraPermission();
          break;
        case 'photoLibrary':
          result = await permissionHelper.requestPhotoLibraryPermission();
          break;
        case 'location':
          result = await permissionHelper.requestLocationPermission(true);
          break;
        case 'notifications':
          result = await permissionHelper.requestNotificationsPermission();
          break;
        case 'calendar':
          result = await permissionHelper.requestCalendarPermission();
          break;
        case 'contacts':
          result = await permissionHelper.requestContactsPermission();
          break;
        case 'mediaLibrary':
          result = await permissionHelper.requestMediaLibraryPermission();
          break;
        case 'bluetooth':
          result = await permissionHelper.requestBluetoothPermissions();
          break;
        default:
          throw new Error(`Unknown permission type: ${type}`);
      }

      setPermissions(prev => ({
        ...prev,
        [type]: {
          status: result.status,
          granted: result.granted,
        },
      }));

      setLoading(prev => ({ ...prev, [type]: false }));
      return result.granted;
    } catch (err) {
      setError(err.message);
      setLoading(prev => ({ ...prev, [type]: false }));
      return false;
    }
  }, []);

  const requestMultiplePermissions = useCallback(async (types) => {
    const results = {};
    for (const type of types) {
      results[type] = await requestPermission(type);
    }
    return results;
  }, [requestPermission]);

  const checkPermission = useCallback(async (type) => {
    switch (type) {
      case 'camera':
        return await Camera.getCameraPermissionsAsync();
      case 'photoLibrary':
        return await ImagePicker.getMediaLibraryPermissionsAsync();
      case 'location':
        return await Location.getForegroundPermissionsAsync();
      case 'notifications':
        return await Notifications.getPermissionsAsync();
      case 'calendar':
        return await Calendar.getCalendarPermissionsAsync();
      case 'contacts':
        return await Contacts.getPermissionsAsync();
      case 'mediaLibrary':
        return await MediaLibrary.getPermissionsAsync();
      default:
        return { status: 'undetermined', granted: false };
    }
  }, []);

  const ensurePermission = useCallback(async (type, permissionName) => {
    const current = permissions[type];
    
    if (current.granted) {
      return true;
    }

    const granted = await requestPermission(type);
    
    if (!granted) {
      permissionHelper.showPermissionDeniedAlert(permissionName || type);
    }

    return granted;
  }, [permissions, requestPermission]);

  const getPermissionStatus = useCallback((type) => {
    return permissions[type]?.status || 'undetermined';
  }, [permissions]);

  const isPermissionGranted = useCallback((type) => {
    return permissions[type]?.granted || false;
  }, [permissions]);

  const areAllPermissionsGranted = useCallback((types) => {
    return types.every(type => permissions[type]?.granted);
  }, [permissions]);

  const getMissingPermissions = useCallback((types) => {
    return types.filter(type => !permissions[type]?.granted);
  }, [permissions]);

  const openSettings = useCallback(() => {
    permissionHelper.openAppSettings();
  }, []);

  const resetPermissions = useCallback(() => {
    setPermissions({
      camera: { status: 'undetermined', granted: false },
      photoLibrary: { status: 'undetermined', granted: false },
      location: { status: 'undetermined', granted: false },
      notifications: { status: 'undetermined', granted: false },
      calendar: { status: 'undetermined', granted: false },
      contacts: { status: 'undetermined', granted: false },
      mediaLibrary: { status: 'undetermined', granted: false },
      bluetooth: { status: 'undetermined', granted: false },
      motion: { status: 'undetermined', granted: false },
    });
  }, []);

  return {
    // State
    permissions,
    loading,
    error,

    // Methods
    requestPermission,
    requestMultiplePermissions,
    checkPermission,
    ensurePermission,
    getPermissionStatus,
    isPermissionGranted,
    areAllPermissionsGranted,
    getMissingPermissions,
    openSettings,
    resetPermissions,
    refreshPermissions: checkAllPermissions,
  };
};

export default usePermissions;