import { Platform } from 'react-native';
import * as Location from 'expo-location';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

class LocationHelper {
  constructor() {
    this.currentLocation = null;
    this.locationWatcher = null;
    this.isWatching = false;
    this.listeners = new Map();
  }

  /**
   * Request location permissions
   * @param {boolean} background - Request background permission
   * @returns {Promise<boolean>} Permission granted
   */
  async requestPermissions(background = false) {
    try {
      if (Platform.OS === 'ios') {
        const permission = background 
          ? PERMISSIONS.IOS.LOCATION_ALWAYS 
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        
        const status = await request(permission);
        return status === RESULTS.GRANTED;
      } else {
        const fineStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (background) {
          const backgroundStatus = await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
          return fineStatus === RESULTS.GRANTED && backgroundStatus === RESULTS.GRANTED;
        }
        return fineStatus === RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Check location permissions
   * @returns {Promise<Object>} Permission status
   */
  async checkPermissions() {
    try {
      if (Platform.OS === 'ios') {
        const whenInUse = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        const always = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
        
        return {
          whenInUse: whenInUse === RESULTS.GRANTED,
          always: always === RESULTS.GRANTED,
        };
      } else {
        const fine = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        const coarse = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
        const background = await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
        
        return {
          fine: fine === RESULTS.GRANTED,
          coarse: coarse === RESULTS.GRANTED,
          background: background === RESULTS.GRANTED,
        };
      }
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return {};
    }
  }

  /**
   * Get current location
   * @param {Object} options - Location options
   * @returns {Promise<Object>} Location object
   */
  async getCurrentLocation(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 10000,
    };

    const opts = { ...defaultOptions, ...options };

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          resolve,
          reject,
          opts
        );
      });

      this.currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp,
      };

      return this.currentLocation;
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  /**
   * Start watching location
   * @param {Function} onLocation - Location update callback
   * @param {Function} onError - Error callback
   * @param {Object} options - Watch options
   */
  async watchLocation(onLocation, onError, options = {}) {
    if (this.isWatching) {
      this.stopWatching();
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      distanceFilter: 10,
      interval: 5000,
      fastestInterval: 2000,
    };

    const opts = { ...defaultOptions, ...options };

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      this.locationWatcher = Geolocation.watchPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          };
          this.currentLocation = location;
          onLocation?.(location);
          this.emit('location_update', location);
        },
        (error) => {
          onError?.(error);
          this.emit('location_error', error);
        },
        opts
      );

      this.isWatching = true;
    } catch (error) {
      console.error('Error starting location watch:', error);
      throw error;
    }
  }

  /**
   * Stop watching location
   */
  stopWatching() {
    if (this.locationWatcher !== null) {
      Geolocation.clearWatch(this.locationWatcher);
      this.locationWatcher = null;
      this.isWatching = false;
    }
  }

  /**
   * Get address from coordinates
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {Promise<Object>} Address object
   */
  async getAddressFromCoordinates(latitude, longitude) {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses.length > 0) {
        return addresses[0];
      }
      return null;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  }

  /**
   * Get coordinates from address
   * @param {string} address - Address string
   * @returns {Promise<Object>} Coordinates
   */
  async getCoordinatesFromAddress(address) {
    try {
      const geocoded = await Location.geocodeAsync(address);
      if (geocoded.length > 0) {
        return geocoded[0];
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   * @param {number} lat1 - Latitude 1
   * @param {number} lon1 - Longitude 1
   * @param {number} lat2 - Latitude 2
   * @param {number} lon2 - Longitude 2
   * @param {string} unit - Unit (km, mi, m)
   * @returns {number} Distance
   */
  calculateDistance(lat1, lon1, lat2, lon2, unit = 'km') {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;

    // Convert to requested unit
    switch (unit) {
      case 'mi':
        distance *= 0.621371;
        break;
      case 'm':
        distance *= 1000;
        break;
    }

    return distance;
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees - Degrees
   * @returns {number} Radians
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculate bearing between two points
   * @param {number} lat1 - Latitude 1
   * @param {number} lon1 - Longitude 1
   * @param {number} lat2 - Latitude 2
   * @param {number} lon2 - Longitude 2
   * @returns {number} Bearing in degrees
   */
  calculateBearing(lat1, lon1, lat2, lon2) {
    const φ1 = this.toRadians(lat1);
    const φ2 = this.toRadians(lat2);
    const Δλ = this.toRadians(lon2 - lon1);

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);

    return (this.toDegrees(θ) + 360) % 360;
  }

  /**
   * Convert radians to degrees
   * @param {number} radians - Radians
   * @returns {number} Degrees
   */
  toDegrees(radians) {
    return radians * (180 / Math.PI);
  }

  /**
   * Check if location services are enabled
   * @returns {Promise<boolean>} Enabled status
   */
  async isLocationEnabled() {
    return await Location.hasServicesEnabledAsync();
  }

  /**
   * Get location accuracy
   * @returns {Promise<string>} Accuracy level
   */
  async getLocationAccuracy() {
    const provider = await Location.getProviderStatusAsync();
    
    if (provider.gpsAvailable) return 'high';
    if (provider.networkAvailable) return 'medium';
    return 'low';
  }

  /**
   * Get last known location
   * @returns {Promise<Object>} Last location
   */
  async getLastKnownLocation() {
    return this.currentLocation;
  }

  // Event handling
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event).filter(cb => cb !== callback);
      this.listeners.set(event, listeners);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.stopWatching();
    this.listeners.clear();
  }
}

export default new LocationHelper();