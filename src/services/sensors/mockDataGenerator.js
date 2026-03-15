/**
 * Mock Data Generator for Sensor Readings
 * Provides realistic mock data for development and testing
 */

// Helper function to generate random number within range
const randomInRange = (min, max, decimals = 1) => {
  const value = min + Math.random() * (max - min);
  return Number(value.toFixed(decimals));
};

// Helper function to generate random trend
const getRandomTrend = () => {
  const trends = ['stable', 'up', 'down'];
  return trends[Math.floor(Math.random() * trends.length)];
};

/**
 * Generate mock heart rate data
 * @param {Object} options - Configuration options
 * @returns {Object} Heart rate data
 */
export const generateHeartRate = (options = {}) => {
  const {
    min = 60,
    max = 100,
    resting = 70,
    includeHRV = true,
  } = options;

  const value = randomInRange(min, max, 0);
  
  return {
    value,
    unit: 'bpm',
    min: 58,
    max: 102,
    resting,
    hrv: includeHRV ? randomInRange(20, 60, 0) : null,
    trend: getRandomTrend(),
    status: value < 60 ? 'low' : value > 100 ? 'high' : 'normal',
    timestamp: new Date().toISOString(),
  };
};

/**
 * Generate mock SpO2 data
 * @param {Object} options - Configuration options
 * @returns {Object} SpO2 data
 */
export const generateSpO2 = (options = {}) => {
  const {
    min = 95,
    max = 100,
  } = options;

  const value = randomInRange(min, max, 0);
  
  return {
    value,
    unit: '%',
    min: 92,
    max: 100,
    trend: getRandomTrend(),
    status: value < 90 ? 'critical' : value < 95 ? 'low' : 'normal',
    timestamp: new Date().toISOString(),
  };
};

/**
 * Generate mock temperature data
 * @param {Object} options - Configuration options
 * @returns {Object} Temperature data
 */
export const generateTemperature = (options = {}) => {
  const {
    min = 36.1,
    max = 37.2,
  } = options;

  const value = randomInRange(min, max, 1);
  
  return {
    value,
    unit: '°C',
    min: 35.8,
    max: 37.8,
    trend: getRandomTrend(),
    status: value < 36.0 ? 'low' : value > 37.5 ? 'high' : 'normal',
    timestamp: new Date().toISOString(),
  };
};

/**
 * Generate mock stress data
 * @param {Object} options - Configuration options
 * @returns {Object} Stress data
 */
export const generateStress = (options = {}) => {
  const {
    min = 20,
    max = 80,
  } = options;

  const value = randomInRange(min, max, 0);
  
  return {
    value,
    unit: '',
    min: 15,
    max: 85,
    trend: getRandomTrend(),
    status: value < 30 ? 'low' : value < 50 ? 'moderate' : value < 70 ? 'high' : 'severe',
    level: value < 30 ? 'Relaxed' : value < 50 ? 'Normal' : value < 70 ? 'Stressed' : 'Severe',
    timestamp: new Date().toISOString(),
  };
};

/**
 * Generate mock sleep data
 * @param {Object} options - Configuration options
 * @returns {Object} Sleep data
 */
export const generateSleep = (options = {}) => {
  const {
    minDuration = 5,
    maxDuration = 9,
  } = options;

  const duration = randomInRange(minDuration, maxDuration, 1);
  const deep = randomInRange(1, 3, 1);
  const light = duration - deep - randomInRange(1, 2, 1);
  const rem = duration - deep - light;
  
  return {
    duration,
    unit: 'hours',
    deep,
    light,
    rem,
    awake: randomInRange(0.2, 0.8, 1),
    quality: randomInRange(40, 95, 0),
    efficiency: randomInRange(75, 95, 0),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Generate mock activity data
 * @param {Object} options - Configuration options
 * @returns {Object} Activity data
 */
export const generateActivity = (options = {}) => {
  const {
    minSteps = 2000,
    maxSteps = 10000,
  } = options;

  const steps = Math.floor(randomInRange(minSteps, maxSteps, 0));
  const calories = Math.floor(steps * 0.04); // Rough estimate: 40 cal per 1000 steps
  const distance = Number((steps * 0.0008).toFixed(1)); // Rough estimate: 0.8m per step
  
  return {
    steps,
    unit: 'steps',
    calories,
    distance,
    distanceUnit: 'km',
    activeMinutes: Math.floor(randomInRange(30, 180, 0)),
    floors: Math.floor(randomInRange(0, 20, 0)),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Generate mock HRV data
 * @param {Object} options - Configuration options
 * @returns {Object} HRV data
 */
export const generateHRV = (options = {}) => {
  const {
    min = 20,
    max = 60,
  } = options;

  const value = randomInRange(min, max, 0);
  
  return {
    value,
    unit: 'ms',
    status: value > 40 ? 'good' : value > 30 ? 'fair' : 'poor',
    rmssd: randomInRange(20, 50, 0),
    sdnn: randomInRange(30, 70, 0),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Generate complete current sensor data
 * @returns {Object} All current sensor readings
 */
export const generateCurrentReadings = () => {
  return {
    timestamp: new Date().toISOString(),
    heartRate: generateHeartRate(),
    spo2: generateSpO2(),
    temperature: generateTemperature(),
    stress: generateStress(),
    sleep: generateSleep(),
    activity: generateActivity(),
    hrv: generateHRV(),
  };
};

/**
 * Generate historical data for charts
 * @param {string} type - Type of data ('heart', 'stress', 'sleep', etc.)
 * @param {string} period - Period ('day', 'week', 'month', 'year')
 * @param {number} points - Number of data points
 * @returns {Array} Historical data array
 */
export const generateHistoricalData = (type, period = 'day', points = null) => {
  let numPoints = points;
  let interval;
  
  switch(period) {
    case 'day':
      numPoints = numPoints || 24;
      interval = 60 * 60 * 1000; // 1 hour
      break;
    case 'week':
      numPoints = numPoints || 7;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case 'month':
      numPoints = numPoints || 30;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case 'year':
      numPoints = numPoints || 12;
      interval = 30 * 24 * 60 * 60 * 1000; // ~1 month
      break;
    default:
      numPoints = numPoints || 24;
      interval = 60 * 60 * 1000;
  }
  
  const data = [];
  const now = new Date();
  
  for (let i = numPoints; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * interval);
    
    let value;
    let unit;
    
    switch(type) {
      case 'heart':
        value = randomInRange(60, 100, 0);
        unit = 'bpm';
        break;
      case 'spo2':
        value = randomInRange(95, 100, 0);
        unit = '%';
        break;
      case 'temperature':
        value = randomInRange(36.1, 37.2, 1);
        unit = '°C';
        break;
      case 'stress':
        value = randomInRange(20, 80, 0);
        unit = '';
        break;
      case 'sleep':
        value = randomInRange(5, 9, 1);
        unit = 'hours';
        break;
      case 'activity':
        value = Math.floor(randomInRange(2000, 10000, 0));
        unit = 'steps';
        break;
      case 'hrv':
        value = randomInRange(20, 60, 0);
        unit = 'ms';
        break;
      default:
        value = randomInRange(0, 100, 0);
        unit = '';
    }
    
    data.push({
      timestamp: timestamp.toISOString(),
      value,
      unit,
    });
  }
  
  return data;
};

/**
 * Generate disease risk predictions
 * @returns {Array} Disease risks with percentages
 */
export const generateDiseaseRisks = () => {
  const diseases = [
    { name: 'Diabetes', baseRisk: 30, factors: ['Family history', 'Diet', 'Activity level'] },
    { name: 'Hypertension', baseRisk: 35, factors: ['Stress', 'Salt intake', 'Age'] },
    { name: 'Stress/Anxiety', baseRisk: 45, factors: ['Work pressure', 'Sleep', 'Lifestyle'] },
    { name: 'Sleep Disorder', baseRisk: 25, factors: ['Irregular schedule', 'Screen time', 'Stress'] },
    { name: 'Asthma', baseRisk: 15, factors: ['Allergies', 'Family history', 'Environment'] },
    { name: 'Arthritis', baseRisk: 20, factors: ['Age', 'Joint stress', 'Family history'] },
    { name: 'Obesity', baseRisk: 28, factors: ['Diet', 'Activity level', 'Metabolism'] },
    { name: 'Digestive Disorder', baseRisk: 32, factors: ['Diet', 'Stress', 'Eating habits'] },
    { name: 'Heart Disease', baseRisk: 25, factors: ['Blood pressure', 'Cholesterol', 'Lifestyle'] },
    { name: 'Fever/Infection', baseRisk: 18, factors: ['Season', 'Immunity', 'Exposure'] },
  ];
  
  return diseases.map(disease => {
    // Add some randomness to the risk
    const risk = Math.min(95, Math.max(5, disease.baseRisk + randomInRange(-10, 10, 0)));
    
    let level;
    if (risk >= 70) level = 'high';
    else if (risk >= 40) level = 'medium';
    else if (risk >= 20) level = 'low';
    else level = 'very low';
    
    return {
      ...disease,
      risk,
      level,
      icon: getDiseaseIcon(disease.name),
      color: getDiseaseColor(level),
    };
  });
};

/**
 * Get icon for disease
 * @param {string} disease - Disease name
 * @returns {string} Icon name
 */
const getDiseaseIcon = (disease) => {
  const icons = {
    'Diabetes': 'water',
    'Hypertension': 'speedometer',
    'Stress/Anxiety': 'flash',
    'Sleep Disorder': 'moon',
    'Asthma': 'medkit',
    'Arthritis': 'bone',
    'Obesity': 'body',
    'Digestive Disorder': 'restaurant',
    'Heart Disease': 'heart',
    'Fever/Infection': 'thermometer',
  };
  
  return icons[disease] || 'warning';
};

/**
 * Get color for risk level
 * @param {string} level - Risk level
 * @returns {string} Color code
 */
const getDiseaseColor = (level) => {
  switch(level) {
    case 'high': return '#FF5A5F';
    case 'medium': return '#FFB347';
    case 'low': return '#4A90E2';
    case 'very low': return '#4CAF50';
    default: return '#8D9BA5';
  }
};

/**
 * Generate alerts
 * @param {number} count - Number of alerts to generate
 * @returns {Array} Alert objects
 */
export const generateAlerts = (count = 5) => {
  const types = ['heart', 'stress', 'dosha', 'risk', 'device', 'sleep', 'activity'];
  const severities = ['low', 'medium', 'high', 'critical'];
  const alerts = [];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    alerts.push({
      id: `alert-${Date.now()}-${i}`,
      type,
      severity,
      title: getAlertTitle(type, severity),
      message: getAlertMessage(type, severity),
      time: getRandomTimeAgo(),
      actionable: Math.random() > 0.5,
      actionText: severity === 'critical' ? 'Contact Doctor' : 'View Details',
      read: Math.random() > 0.3,
      timestamp: new Date().toISOString(),
    });
  }
  
  return alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Get alert title based on type and severity
 */
const getAlertTitle = (type, severity) => {
  const titles = {
    heart: {
      low: 'Mild Heart Rate Variation',
      medium: 'Irregular Heart Rate Detected',
      high: 'Significant Heart Rate Irregularity',
      critical: 'Critical: Arrhythmia Detected',
    },
    stress: {
      low: 'Slight Stress Increase',
      medium: 'Elevated Stress Levels',
      high: 'High Stress Detected',
      critical: 'Severe Stress Alert',
    },
    sleep: {
      low: 'Sleep Quality Slightly Low',
      medium: 'Poor Sleep Quality',
      high: 'Severe Sleep Disruption',
      critical: 'Critical Sleep Deprivation',
    },
    dosha: {
      low: 'Minor Dosha Shift',
      medium: 'Dosha Imbalance Detected',
      high: 'Significant Dosha Imbalance',
      critical: 'Critical Dosha Imbalance',
    },
    device: {
      low: 'Device Status',
      medium: 'Device Issue Detected',
      high: 'Device Malfunction',
      critical: 'Device Failure',
    },
  };
  
  return titles[type]?.[severity] || `${type} Alert`;
};

/**
 * Get alert message based on type and severity
 */
const getAlertMessage = (type, severity) => {
  const messages = {
    heart: 'Heart rate pattern shows irregularities. Please rest and monitor.',
    stress: 'Stress levels are elevated. Try deep breathing exercises.',
    sleep: 'Sleep quality is below optimal levels. Consider adjusting bedtime routine.',
    dosha: 'Your dosha balance has shifted. Check recommendations for rebalancing.',
    device: 'Please check your device connection and battery level.',
    risk: 'Health risk assessment has been updated based on recent data.',
    activity: 'Your activity levels have changed significantly.',
  };
  
  return messages[type] || 'Please check your health metrics.';
};

/**
 * Generate random time ago string
 * @returns {string} Time ago
 */
const getRandomTimeAgo = () => {
  const minutes = Math.floor(Math.random() * 120) + 1;
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  return `${minutes} min ago`;
};

/**
 * Generate mock user data
 * @returns {Object} User profile data
 */
export const generateUserData = () => {
  const names = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sarah Williams'];
  const name = names[Math.floor(Math.random() * names.length)];
  
  return {
    id: `user-${Date.now()}`,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    age: randomInRange(25, 65, 0),
    gender: Math.random() > 0.5 ? 'male' : 'female',
    height: randomInRange(160, 185, 0),
    weight: randomInRange(60, 85, 0),
    bloodGroup: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
  };
};

/**
 * Generate dosha balance
 * @returns {Object} Dosha percentages
 */
export const generateDoshaBalance = () => {
  let vata = randomInRange(20, 50, 0);
  let pitta = randomInRange(20, 50, 0);
  let kapha = 100 - vata - pitta;
  
  // Adjust to ensure sum is 100
  if (kapha < 0) {
    vata = Math.floor(vata * 0.8);
    pitta = Math.floor(pitta * 0.8);
    kapha = 100 - vata - pitta;
  }
  
  let dominant;
  const max = Math.max(vata, pitta, kapha);
  if (max === vata) dominant = 'vata';
  else if (max === pitta) dominant = 'pitta';
  else dominant = 'kapha';
  
  return {
    vata,
    pitta,
    kapha,
    dominant,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Generate complete dashboard data
 * @returns {Object} All data for dashboard
 */
export const generateDashboardData = () => {
  return {
    current: generateCurrentReadings(),
    historical: {
      heart: generateHistoricalData('heart', 'week', 7),
      stress: generateHistoricalData('stress', 'week', 7),
      sleep: generateHistoricalData('sleep', 'week', 7),
      activity: generateHistoricalData('activity', 'week', 7),
    },
    risks: generateDiseaseRisks(),
    alerts: generateAlerts(3),
    dosha: generateDoshaBalance(),
    user: generateUserData(),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Get metric history for specific period
 * @param {string} metric - Metric name
 * @param {string} period - Time period
 * @returns {Array} Historical data
 */
export const getMetricHistory = (metric, period = 'week') => {
  return generateHistoricalData(metric, period);
};

/**
 * Get disease risk predictions
 * @returns {Array} Disease risks
 */
export const getDiseaseRisks = () => {
  return generateDiseaseRisks();
};

/**
 * Get recent alerts
 * @param {number} limit - Number of alerts
 * @returns {Array} Recent alerts
 */
export const getRecentAlerts = (limit = 5) => {
  return generateAlerts(limit);
};

/**
 * Get dosha balance
 * @returns {Object} Dosha balance
 */
export const getDoshaBalance = () => {
  return generateDoshaBalance();
};

/**
 * Mock data generator object with all functions
 */
export default {
  generateHeartRate,
  generateSpO2,
  generateTemperature,
  generateStress,
  generateSleep,
  generateActivity,
  generateHRV,
  generateCurrentReadings,
  generateHistoricalData,
  generateDiseaseRisks,
  generateAlerts,
  generateUserData,
  generateDoshaBalance,
  generateDashboardData,
  getMetricHistory,
  getDiseaseRisks,
  getRecentAlerts,
  getDoshaBalance,
};