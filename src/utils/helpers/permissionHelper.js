import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as Camera from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';
import * as Contacts from 'expo-contacts';
import * as MediaLibrary from 'expo-media-library';

/**
 * Permission types
 */
export const PERMISSION_TYPES = {
  CAMERA: 'camera',
  PHOTO_LIBRARY: 'photo_library',
  LOCATION: 'location',
  NOTIFICATIONS: 'notifications',
  CALENDAR: 'calendar',
  CONTACTS: 'contacts',
  MEDIA_LIBRARY: 'media_library',
  BLUETOOTH: 'bluetooth',
  HEALTH: 'health',
  MOTION: 'motion',
};

/**
 * Permission statuses
 */
export const PERMISSION_STATUS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  UNDETERMINED: 'undetermined',
  BLOCKED: 'blocked',
  LIMITED: 'limited',
};

/**
 * Request camera permission
 * @returns {Promise<Object>} Permission result
 */
export const requestCameraPermission = async () => {
  try {
    const { status, granted } = await Camera.requestCameraPermissionsAsync();
    return {
      status,
      granted: status === 'granted',
      canAskAgain: status !== 'denied',
    };
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return {
      status: PERMISSION_STATUS.DENIED,
      granted: false,
      canAskAgain: false,
      error: error.message,
    };
  }
};

/**
 * Request photo library permission
 * @returns {Promise<Object>} Permission result
 */
export const requestPhotoLibraryPermission = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return {
      status,
      granted: status === 'granted',
      canAskAgain: status !== 'denied',
    };
  } catch (error) {
    console.error('Error requesting photo library permission:', error);
    return {
      status: PERMISSION_STATUS.DENIED,
      granted: false,
      canAskAgain: false,
      error: error.message,
    };
  }
};

/**
 * Request location permission
 * @param {boolean} foreground - Request foreground only or background as well
 * @returns {Promise<Object>} Permission result
 */
export const requestLocationPermission = async (foreground = true) => {
  try {
    if (foreground) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return {
        status,
        granted: status === 'granted',
        canAskAgain: status !== 'denied',
      };
    } else {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      return {
        status,
        granted: status === 'granted',
        canAskAgain: status !== 'denied',
      };
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return {
      status: PERMISSION_STATUS.DENIED,
      granted: false,
      canAskAgain: false,
      error: error.message,
    };
  }
};

/**
 * Request notifications permission
 * @returns {Promise<Object>} Permission result
 */
export const requestNotificationsPermission = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return {
      status,
      granted: status === 'granted',
      canAskAgain: status !== 'denied',
    };
  } catch (error) {
    console.error('Error requesting notifications permission:', error);
    return {
      status: PERMISSION_STATUS.DENIED,
      granted: false,
      canAskAgain: false,
      error: error.message,
    };
  }
};

/**
 * Request calendar permission
 * @returns {Promise<Object>} Permission result
 */
export const requestCalendarPermission = async () => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return {
      status,
      granted: status === 'granted',
      canAskAgain: status !== 'denied',
    };
  } catch (error) {
    console.error('Error requesting calendar permission:', error);
    return {
      status: PERMISSION_STATUS.DENIED,
      granted: false,
      canAskAgain: false,
      error: error.message,
    };
  }
};

/**
 * Request contacts permission
 * @returns {Promise<Object>} Permission result
 */
export const requestContactsPermission = async () => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    return {
      status,
      granted: status === 'granted',
      canAskAgain: status !== 'denied',
    };
  } catch (error) {
    console.error('Error requesting contacts permission:', error);
    return {
      status: PERMISSION_STATUS.DENIED,
      granted: false,
      canAskAgain: false,
      error: error.message,
    };
  }
};

/**
 * Request media library permission
 * @returns {Promise<Object>} Permission result
 */
export const requestMediaLibraryPermission = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return {
      status,
      granted: status === 'granted',
      canAskAgain: status !== 'denied',
    };
  } catch (error) {
    console.error('Error requesting media library permission:', error);
    return {
      status: PERMISSION_STATUS.DENIED,
      granted: false,
      canAskAgain: false,
      error: error.message,
    };
  }
};

/**
 * Request Android Bluetooth permissions
 * @returns {Promise<Object>} Permission result
 */
export const requestBluetoothPermissions = async () => {
  if (Platform.OS !== 'android') {
    return { status: PERMISSION_STATUS.GRANTED, granted: true };
  }

  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ];

    const results = await PermissionsAndroid.requestMultiple(permissions);
    
    const allGranted = Object.values(results).every(
      result => result === PermissionsAndroid.RESULTS.GRANTED
    );

    return {
      status: allGranted ? PERMISSION_STATUS.GRANTED : PERMISSION_STATUS.DENIED,
      granted: allGranted,
      results,
    };
  } catch (error) {
    console.error('Error requesting bluetooth permissions:', error);
    return {
      status: PERMISSION_STATUS.DENIED,
      granted: false,
      error: error.message,
    };
  }
};

/**
 * Request multiple permissions at once
 * @param {Array} permissions - Array of permission types
 * @returns {Promise<Object>} Results for each permission
 */
export const requestMultiplePermissions = async (permissions) => {
  const results = {};

  for (const permission of permissions) {
    switch (permission) {
      case PERMISSION_TYPES.CAMERA:
        results[permission] = await requestCameraPermission();
        break;
      case PERMISSION_TYPES.PHOTO_LIBRARY:
        results[permission] = await requestPhotoLibraryPermission();
        break;
      case PERMISSION_TYPES.LOCATION:
        results[permission] = await requestLocationPermission();
        break;
      case PERMISSION_TYPES.NOTIFICATIONS:
        results[permission] = await requestNotificationsPermission();
        break;
      case PERMISSION_TYPES.CALENDAR:
        results[permission] = await requestCalendarPermission();
        break;
      case PERMISSION_TYPES.CONTACTS:
        results[permission] = await requestContactsPermission();
        break;
      case PERMISSION_TYPES.MEDIA_LIBRARY:
        results[permission] = await requestMediaLibraryPermission();
        break;
      case PERMISSION_TYPES.BLUETOOTH:
        results[permission] = await requestBluetoothPermissions();
        break;
      default:
        results[permission] = { status: PERMISSION_STATUS.UNDETERMINED, granted: false };
    }
  }

  return results;
};

/**
 * Check if permission is granted
 * @param {string} permissionType - Type of permission
 * @returns {Promise<boolean>} Whether permission is granted
 */
export const checkPermission = async (permissionType) => {
  try {
    switch (permissionType) {
      case PERMISSION_TYPES.CAMERA:
        const camera = await Camera.getCameraPermissionsAsync();
        return camera.granted;
      
      case PERMISSION_TYPES.PHOTO_LIBRARY:
        const library = await ImagePicker.getMediaLibraryPermissionsAsync();
        return library.granted;
      
      case PERMISSION_TYPES.LOCATION:
        const location = await Location.getForegroundPermissionsAsync();
        return location.granted;
      
      case PERMISSION_TYPES.NOTIFICATIONS:
        const notifications = await Notifications.getPermissionsAsync();
        return notifications.granted;
      
      case PERMISSION_TYPES.CALENDAR:
        const calendar = await Calendar.getCalendarPermissionsAsync();
        return calendar.granted;
      
      case PERMISSION_TYPES.CONTACTS:
        const contacts = await Contacts.getPermissionsAsync();
        return contacts.granted;
      
      case PERMISSION_TYPES.MEDIA_LIBRARY:
        const media = await MediaLibrary.getPermissionsAsync();
        return media.granted;
      
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Open app settings
 */
export const openAppSettings = () => {
  Linking.openSettings();
};

/**
 * Show permission denied alert
 * @param {string} permissionName - Name of the permission
 * @param {Function} onOpenSettings - Callback to open settings
 */
export const showPermissionDeniedAlert = (permissionName, onOpenSettings) => {
  Alert.alert(
    `${permissionName} Permission Required`,
    `AyurTwin needs access to your ${permissionName.toLowerCase()} to provide this feature. Please enable it in settings.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Open Settings', 
        onPress: () => {
          if (onOpenSettings) {
            onOpenSettings();
          } else {
            openAppSettings();
          }
        }
      },
    ]
  );
};

/**
 * Check and request permission with fallback
 * @param {string} permissionType - Type of permission
 * @param {string} permissionName - Display name for alerts
 * @returns {Promise<boolean>} Whether permission was granted
 */
export const ensurePermission = async (permissionType, permissionName) => {
  const isGranted = await checkPermission(permissionType);
  
  if (isGranted) {
    return true;
  }

  let result;
  switch (permissionType) {
    case PERMISSION_TYPES.CAMERA:
      result = await requestCameraPermission();
      break;
    case PERMISSION_TYPES.PHOTO_LIBRARY:
      result = await requestPhotoLibraryPermission();
      break;
    case PERMISSION_TYPES.LOCATION:
      result = await requestLocationPermission();
      break;
    case PERMISSION_TYPES.NOTIFICATIONS:
      result = await requestNotificationsPermission();
      break;
    default:
      result = { granted: false };
  }

  if (!result.granted && !result.canAskAgain) {
    showPermissionDeniedAlert(permissionName);
  }

  return result.granted;
};

export default {
  PERMISSION_TYPES,
  PERMISSION_STATUS,
  requestCameraPermission,
  requestPhotoLibraryPermission,
  requestLocationPermission,
  requestNotificationsPermission,
  requestCalendarPermission,
  requestContactsPermission,
  requestMediaLibraryPermission,
  requestBluetoothPermissions,
  requestMultiplePermissions,
  checkPermission,
  ensurePermission,
  openAppSettings,
  showPermissionDeniedAlert,
};