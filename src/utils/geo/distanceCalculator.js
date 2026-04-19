/**
 * Distance calculation utilities for geographic coordinates
 */

/**
 * Earth's radius in different units
 */
export const EARTH_RADIUS = {
  km: 6371,
  m: 6371000,
  mi: 3959,
  ft: 20902230,
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export const toDegrees = (radians) => {
  return radians * (180 / Math.PI);
};

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @param {string} unit - Unit of measurement ('km', 'm', 'mi', 'ft')
 * @returns {number} Distance in specified unit
 */
export const haversineDistance = (lat1, lon1, lat2, lon2, unit = 'km') => {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return EARTH_RADIUS[unit] * c;
};

/**
 * Calculate distance between two points using Vincenty formula (more accurate)
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @param {string} unit - Unit of measurement
 * @returns {number} Distance in specified unit
 */
export const vincentyDistance = (lat1, lon1, lat2, lon2, unit = 'km') => {
  const a = EARTH_RADIUS.km * 1000; // Semi-major axis in meters
  const f = 1 / 298.257223563; // Flattening
  const b = (1 - f) * a; // Semi-minor axis

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const λ1 = toRadians(lon1);
  const λ2 = toRadians(lon2);

  const L = λ2 - λ1;
  const tanU1 = (1 - f) * Math.tan(φ1);
  const tanU2 = (1 - f) * Math.tan(φ2);
  const U1 = Math.atan(tanU1);
  const U2 = Math.atan(tanU2);
  const sinU1 = Math.sin(U1);
  const cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2);
  const cosU2 = Math.cos(U2);

  let λ = L;
  let λPrev;
  let iterLimit = 100;
  let cosSqα, sinσ, cos2σM, cosσ, σ;

  do {
    const sinλ = Math.sin(λ);
    const cosλ = Math.cos(λ);
    const sinSqσ = (cosU2 * sinλ) ** 2 +
                   (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) ** 2;
    sinσ = Math.sqrt(sinSqσ);
    cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
    σ = Math.atan2(sinσ, cosσ);
    const sinα = cosU1 * cosU2 * sinλ / sinσ;
    cosSqα = 1 - sinα ** 2;
    cos2σM = cosσ - 2 * sinU1 * sinU2 / cosSqα;
    const C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα));
    λPrev = λ;
    λ = L + (1 - C) * f * sinα *
         (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM ** 2)));
  } while (Math.abs(λ - λPrev) > 1e-12 && --iterLimit > 0);

  if (iterLimit === 0) {
    return haversineDistance(lat1, lon1, lat2, lon2, unit);
  }

  const uSq = cosSqα * (a ** 2 - b ** 2) / (b ** 2);
  const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  const Δσ = B * sinσ * (cos2σM + B / 4 * (cosσ * (-1 + 2 * cos2σM ** 2) -
         B / 6 * cos2σM * (-3 + 4 * sinσ ** 2) * (-3 + 4 * cos2σM ** 2)));

  const s = b * A * (σ - Δσ);

  // Convert to requested unit
  switch (unit) {
    case 'km':
      return s / 1000;
    case 'mi':
      return s / 1609.344;
    case 'ft':
      return s * 3.28084;
    case 'm':
      return s;
    default:
      return s;
  }
};

/**
 * Calculate the midpoint between two points
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {Object} Midpoint coordinates
 */
export const calculateMidpoint = (lat1, lon1, lat2, lon2) => {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const λ1 = toRadians(lon1);
  const λ2 = toRadians(lon2);

  const Bx = Math.cos(φ2) * Math.cos(λ2 - λ1);
  const By = Math.cos(φ2) * Math.sin(λ2 - λ1);
  
  const φ3 = Math.atan2(
    Math.sin(φ1) + Math.sin(φ2),
    Math.sqrt((Math.cos(φ1) + Bx) ** 2 + By ** 2)
  );
  const λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);

  return {
    latitude: toDegrees(φ3),
    longitude: toDegrees(λ3),
  };
};

/**
 * Calculate the bearing from point 1 to point 2
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Bearing in degrees (0-360)
 */
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δλ = toRadians(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  
  const θ = Math.atan2(y, x);
  return (toDegrees(θ) + 360) % 360;
};

/**
 * Calculate destination point given start point, bearing, and distance
 * @param {number} lat - Start latitude
 * @param {number} lon - Start longitude
 * @param {number} bearing - Bearing in degrees
 * @param {number} distance - Distance in km
 * @returns {Object} Destination coordinates
 */
export const calculateDestination = (lat, lon, bearing, distance) => {
  const φ1 = toRadians(lat);
  const λ1 = toRadians(lon);
  const θ = toRadians(bearing);
  const δ = distance / EARTH_RADIUS.km;

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(δ) +
    Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
  );
  
  const λ2 = λ1 + Math.atan2(
    Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
    Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
  );

  return {
    latitude: toDegrees(φ2),
    longitude: toDegrees(λ2),
  };
};

/**
 * Calculate the area of a polygon given its vertices
 * @param {Array} points - Array of {latitude, longitude} points
 * @returns {number} Area in square kilometers
 */
export const calculatePolygonArea = (points) => {
  if (points.length < 3) return 0;

  let area = 0;
  const R = EARTH_RADIUS.km;

  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    
    const φi = toRadians(points[i].latitude);
    const φj = toRadians(points[j].latitude);
    const λi = toRadians(points[i].longitude);
    const λj = toRadians(points[j].longitude);

    area += (λj - λi) * (2 + Math.sin(φi) + Math.sin(φj));
  }

  area = Math.abs(area * R * R / 2);
  return area;
};

/**
 * Check if a point is inside a polygon
 * @param {number} lat - Point latitude
 * @param {number} lon - Point longitude
 * @param {Array} polygon - Array of {latitude, longitude} points
 * @returns {boolean} True if point is inside polygon
 */
export const isPointInPolygon = (lat, lon, polygon) => {
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const φi = polygon[i].latitude;
    const φj = polygon[j].latitude;
    const λi = polygon[i].longitude;
    const λj = polygon[j].longitude;

    if (((φi > lat) !== (φj > lat)) &&
        (lon < (λj - λi) * (lat - φi) / (φj - φi) + λi)) {
      inside = !inside;
    }
  }

  return inside;
};

/**
 * Calculate the bounding box of a set of points
 * @param {Array} points - Array of {latitude, longitude} points
 * @returns {Object} Bounding box with min/max lat/lon
 */
export const calculateBoundingBox = (points) => {
  if (points.length === 0) return null;

  let minLat = points[0].latitude;
  let maxLat = points[0].latitude;
  let minLon = points[0].longitude;
  let maxLon = points[0].longitude;

  for (const point of points) {
    minLat = Math.min(minLat, point.latitude);
    maxLat = Math.max(maxLat, point.latitude);
    minLon = Math.min(minLon, point.longitude);
    maxLon = Math.max(maxLon, point.longitude);
  }

  return {
    minLat,
    maxLat,
    minLon,
    maxLon,
  };
};

/**
 * Calculate the center point of a bounding box
 * @param {Object} bbox - Bounding box with min/max lat/lon
 * @returns {Object} Center coordinates
 */
export const calculateBoundingBoxCenter = (bbox) => {
  return {
    latitude: (bbox.minLat + bbox.maxLat) / 2,
    longitude: (bbox.minLon + bbox.maxLon) / 2,
  };
};

/**
 * Calculate the distance along a path
 * @param {Array} path - Array of {latitude, longitude} points
 * @param {string} unit - Unit of measurement
 * @returns {number} Total path distance
 */
export const calculatePathDistance = (path, unit = 'km') => {
  let total = 0;
  
  for (let i = 0; i < path.length - 1; i++) {
    total += haversineDistance(
      path[i].latitude,
      path[i].longitude,
      path[i + 1].latitude,
      path[i + 1].longitude,
      unit
    );
  }

  return total;
};

/**
 * Format distance for display
 * @param {number} distance - Distance value
 * @param {string} unit - Unit (km, m, mi, ft)
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted distance
 */
export const formatDistance = (distance, unit = 'km', decimals = 1) => {
  if (distance < 0.1 && unit === 'km') {
    return `${Math.round(distance * 1000)} m`;
  }
  
  const value = distance.toFixed(decimals);
  const unitMap = {
    km: 'km',
    m: 'm',
    mi: 'mi',
    ft: 'ft',
  };
  
  return `${value} ${unitMap[unit] || unit}`;
};

export default {
  haversineDistance,
  vincentyDistance,
  calculateMidpoint,
  calculateBearing,
  calculateDestination,
  calculatePolygonArea,
  isPointInPolygon,
  calculateBoundingBox,
  calculateBoundingBoxCenter,
  calculatePathDistance,
  formatDistance,
  EARTH_RADIUS,
};