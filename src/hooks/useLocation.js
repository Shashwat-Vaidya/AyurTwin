import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

import permissionHelper from '../utils/helpers/permissionHelper';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);

  useEffect(() => {
    checkPermission();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setPermissionStatus(status);
  };

  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const result = await permissionHelper.requestLocationPermission(true);
      setPermissionStatus(result.status);
      return result.granted;
    } catch (error) {
      setErrorMsg('Failed to request location permission');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const hasPermission = permissionStatus === 'granted' || await requestPermission();
      
      if (!hasPermission) {
        setErrorMsg('Location permission denied');
        setIsLoading(false);
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
      
      // Get address from coordinates
      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      setAddress(addressResult);
      setIsLoading(false);
      return currentLocation;
    } catch (error) {
      setErrorMsg('Error getting location');
      setIsLoading(false);
      return null;
    }
  }, [permissionStatus]);

  const startWatchingLocation = useCallback(async (callback) => {
    try {
      const hasPermission = permissionStatus === 'granted' || await requestPermission();
      
      if (!hasPermission) {
        setErrorMsg('Location permission denied');
        return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation);
          callback?.(newLocation);
        }
      );

      setLocationSubscription(subscription);
    } catch (error) {
      setErrorMsg('Error starting location watch');
    }
  }, [permissionStatus]);

  const stopWatchingLocation = useCallback(() => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  }, [locationSubscription]);

  const getLocationAddress = useCallback(async (latitude, longitude) => {
    try {
      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      return addressResult;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  }, []);

  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  }, []);

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  const openLocationSettings = useCallback(() => {
    Alert.alert(
      'Location Required',
      'Please enable location services to use this feature.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: permissionHelper.openAppSettings },
      ]
    );
  }, []);

  const getCurrentSpeed = useCallback(() => {
    if (location?.coords?.speed) {
      return location.coords.speed; // in m/s
    }
    return null;
  }, [location]);

  const getCurrentAltitude = useCallback(() => {
    if (location?.coords?.altitude) {
      return location.coords.altitude; // in meters
    }
    return null;
  }, [location]);

  const getCurrentHeading = useCallback(() => {
    if (location?.coords?.heading) {
      return location.coords.heading; // in degrees
    }
    return null;
  }, [location]);

  const getLocationAccuracy = useCallback(() => {
    if (location?.coords?.accuracy) {
      return location.coords.accuracy; // in meters
    }
    return null;
  }, [location]);

  return {
    // State
    location,
    address,
    errorMsg,
    isLoading,
    permissionStatus,
    isWatching: !!locationSubscription,

    // Methods
    getCurrentLocation,
    startWatchingLocation,
    stopWatchingLocation,
    requestPermission,
    getLocationAddress,
    calculateDistance,
    openLocationSettings,
    getCurrentSpeed,
    getCurrentAltitude,
    getCurrentHeading,
    getLocationAccuracy,
  };
};

export default useLocation;