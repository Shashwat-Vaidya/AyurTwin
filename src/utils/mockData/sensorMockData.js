/**
 * Mock sensor data for development and testing
 * Provides realistic sensor readings for various scenarios
 */

/**
 * Generate random number within range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} decimals - Number of decimal places
 * @returns {number} Random value
 */
const randomInRange = (min, max, decimals = 1) => {
  const value = min + Math.random() * (max - min);
  return Number(value.toFixed(decimals));
};

/**
 * Generate random trend
 * @returns {string} Trend direction
 */
const getRandomTrend = () => {
  const trends = ['stable', 'up', 'down'];
  return trends[Math.floor(Math.random() * trends.length)];
};

/**
 * Generate random status based on value and thresholds
 * @param {number} value - Sensor value
 * @param {Object} thresholds - Threshold object with min, max, warningMin, warningMax
 * @returns {string} Status string
 */
const getStatus = (value, thresholds) => {
  if (value < thresholds.criticalMin || value > thresholds.criticalMax) return 'critical';
  if (value < thresholds.warningMin || value > thresholds.warningMax) return 'warning';
  return 'normal';
};

/**
 * Heart rate mock data
 * @param {Object} options - Generation options
 * @returns {Object} Heart rate data
 */
export const mockHeartRate = (options = {}) => {
  const {
    min = 60,
    max = 100,
    resting = 70,
    includeHRV = true,
    userId = 'default',
  } = options;

  const value = randomInRange(min, max, 0);
  
  return {
    id: `hr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    value,
    unit: 'bpm',
    min: 58,
    max: 102,
    resting,
    hrv: includeHRV ? randomInRange(20, 60, 0) : null,
    trend: getRandomTrend(),
    status: value < 60 ? 'low' : value > 100 ? 'high' : 'normal',
    quality: value < 50 ? 'poor' : value < 60 ? 'fair' : value < 100 ? 'good' : 'poor',
    timestamp: new Date().toISOString(),
    source: 'sensor',
  };
};

/**
 * SpO2 mock data
 * @param {Object} options - Generation options
 * @returns {Object} SpO2 data
 */
export const mockSpO2 = (options = {}) => {
  const {
    min = 95,
    max = 100,
    userId = 'default',
  } = options;

  const value = randomInRange(min, max, 0);
  
  return {
    id: `spo2_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    value,
    unit: '%',
    min: 92,
    max: 100,
    trend: getRandomTrend(),
    status: value < 90 ? 'critical' : value < 95 ? 'low' : 'normal',
    quality: value < 90 ? 'poor' : value < 95 ? 'fair' : 'excellent',
    timestamp: new Date().toISOString(),
    source: 'sensor',
  };
};

/**
 * Temperature mock data
 * @param {Object} options - Generation options
 * @returns {Object} Temperature data
 */
export const mockTemperature = (options = {}) => {
  const {
    min = 36.1,
    max = 37.2,
    userId = 'default',
  } = options;

  const value = randomInRange(min, max, 1);
  
  return {
    id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    value,
    unit: '°C',
    min: 35.8,
    max: 37.8,
    trend: getRandomTrend(),
    status: value < 36.0 ? 'low' : value > 37.5 ? 'high' : 'normal',
    quality: value < 35.5 ? 'poor' : value < 36.0 ? 'fair' : value < 37.5 ? 'good' : 'fair',
    timestamp: new Date().toISOString(),
    source: 'sensor',
  };
};

/**
 * Stress mock data
 * @param {Object} options - Generation options
 * @returns {Object} Stress data
 */
export const mockStress = (options = {}) => {
  const {
    min = 20,
    max = 80,
    userId = 'default',
  } = options;

  const value = randomInRange(min, max, 0);
  
  return {
    id: `stress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    value,
    unit: '',
    min: 15,
    max: 85,
    trend: getRandomTrend(),
    status: value < 30 ? 'low' : value < 50 ? 'moderate' : value < 70 ? 'high' : 'severe',
    level: value < 30 ? 'Relaxed' : value < 50 ? 'Normal' : value < 70 ? 'Stressed' : 'Severe',
    timestamp: new Date().toISOString(),
    source: 'sensor',
  };
};

/**
 * Sleep mock data
 * @param {Object} options - Generation options
 * @returns {Object} Sleep data
 */
export const mockSleep = (options = {}) => {
  const {
    minDuration = 5,
    maxDuration = 9,
    userId = 'default',
  } = options;

  const duration = randomInRange(minDuration, maxDuration, 1);
  const deep = randomInRange(1, 3, 1);
  const light = duration - deep - randomInRange(1, 2, 1);
  const rem = duration - deep - light;
  
  return {
    id: `sleep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    duration,
    unit: 'hours',
    deep: Math.max(0, deep),
    light: Math.max(0, light),
    rem: Math.max(0, rem),
    awake: randomInRange(0.2, 0.8, 1),
    quality: randomInRange(40, 95, 0),
    efficiency: randomInRange(75, 95, 0),
    timestamp: new Date().toISOString(),
    source: 'sensor',
  };
};

/**
 * Activity mock data
 * @param {Object} options - Generation options
 * @returns {Object} Activity data
 */
export const mockActivity = (options = {}) => {
  const {
    minSteps = 2000,
    maxSteps = 10000,
    userId = 'default',
  } = options;

  const steps = Math.floor(randomInRange(minSteps, maxSteps, 0));
  const calories = Math.floor(steps * 0.04);
  const distance = Number((steps * 0.0008).toFixed(1));
  
  return {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    steps,
    unit: 'steps',
    calories,
    distance,
    distanceUnit: 'km',
    activeMinutes: Math.floor(randomInRange(30, 180, 0)),
    floors: Math.floor(randomInRange(0, 20, 0)),
    timestamp: new Date().toISOString(),
    source: 'sensor',
  };
};

/**
 * Blood pressure mock data
 * @param {Object} options - Generation options
 * @returns {Object} Blood pressure data
 */
export const mockBloodPressure = (options = {}) => {
  const {
    systolicMin = 110,
    systolicMax = 130,
    diastolicMin = 70,
    diastolicMax = 85,
    userId = 'default',
  } = options;

  const systolic = randomInRange(systolicMin, systolicMax, 0);
  const diastolic = randomInRange(diastolicMin, diastolicMax, 0);
  
  return {
    id: `bp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    systolic,
    diastolic,
    unit: 'mmHg',
    map: Math.round((systolic + 2 * diastolic) / 3),
    pulse: systolic - diastolic,
    status: systolic < 120 && diastolic < 80 ? 'normal' : 
            systolic < 130 && diastolic < 80 ? 'elevated' :
            systolic < 140 || diastolic < 90 ? 'stage1' : 'stage2',
    timestamp: new Date().toISOString(),
    source: 'sensor',
  };
};

/**
 * HRV mock data
 * @param {Object} options - Generation options
 * @returns {Object} HRV data
 */
export const mockHRV = (options = {}) => {
  const {
    min = 20,
    max = 60,
    userId = 'default',
  } = options;

  const value = randomInRange(min, max, 0);
  
  return {
    id: `hrv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    value,
    unit: 'ms',
    rmssd: randomInRange(min * 0.8, max * 0.8, 0),
    sdnn: randomInRange(min * 1.2, max * 1.2, 0),
    status: value > 50 ? 'excellent' : value > 40 ? 'good' : value > 30 ? 'fair' : 'poor',
    timestamp: new Date().toISOString(),
    source: 'sensor',
  };
};

/**
 * Respiratory rate mock data
 * @param {Object} options - Generation options
 * @returns {Object} Respiratory rate data
 */
export const mockRespiratoryRate = (options = {}) => {
  const {
    min = 12,
    max = 20,
    userId = 'default',
  } = options;

  const value = randomInRange(min, max, 0);
  
  return {
    id: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    value,
    unit: 'breaths/min',
    status: value < 12 ? 'low' : value > 20 ? 'high' : 'normal',
    timestamp: new Date().toISOString(),
    source: 'sensor',
  };
};

/**
 * Glucose mock data
 * @param {Object} options - Generation options
 * @returns {Object} Glucose data
 */
export const mockGlucose = (options = {}) => {
  const {
    type = 'fasting',
    userId = 'default',
  } = options;

  let value;
  if (type === 'fasting') {
    value = randomInRange(70, 100, 0);
  } else if (type === 'postPrandial') {
    value = randomInRange(100, 140, 0);
  } else {
    value = randomInRange(70, 140, 0);
  }
  
  return {
    id: `glucose_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    value,
    unit: 'mg/dL',
    type,
    status: value < 70 ? 'low' : value < 100 ? 'normal' : value < 126 ? 'prediabetes' : 'diabetes',
    timestamp: new Date().toISOString(),
    source: 'sensor',
  };
};

/**
 * Generate complete current sensor readings
 * @param {string} userId - User ID
 * @returns {Object} All current sensor readings
 */
export const mockAllSensors = (userId = 'default') => {
  return {
    timestamp: new Date().toISOString(),
    userId,
    heartRate: mockHeartRate({ userId }),
    spo2: mockSpO2({ userId }),
    temperature: mockTemperature({ userId }),
    stress: mockStress({ userId }),
    sleep: mockSleep({ userId }),
    activity: mockActivity({ userId }),
    bloodPressure: mockBloodPressure({ userId }),
    hrv: mockHRV({ userId }),
    respiratoryRate: mockRespiratoryRate({ userId }),
    glucose: mockGlucose({ userId }),
  };
};

/**
 * Generate historical sensor data for charts
 * @param {string} sensorType - Type of sensor
 * @param {number} hours - Number of hours of data
 * @param {string} userId - User ID
 * @returns {Array} Historical data array
 */
export const mockHistoricalData = (sensorType, hours = 24, userId = 'default') => {
  const data = [];
  const now = Date.now();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000).toISOString();
    
    let reading;
    switch(sensorType) {
      case 'heartRate':
        reading = mockHeartRate({ userId, min: 60, max: 100 });
        break;
      case 'spo2':
        reading = mockSpO2({ userId });
        break;
      case 'temperature':
        reading = mockTemperature({ userId });
        break;
      case 'stress':
        reading = mockStress({ userId });
        break;
      case 'activity':
        reading = mockActivity({ userId, minSteps: 0, maxSteps: 1000 });
        break;
      default:
        reading = { value: randomInRange(0, 100, 0) };
    }
    
    data.push({
      ...reading,
      timestamp,
    });
  }
  
  return data;
};

/**
 * Generate mock sensor data for different scenarios
 */
export const MOCK_SCENARIOS = {
  // Healthy individual
  healthy: {
    heartRate: { value: 72, status: 'normal' },
    spo2: { value: 98, status: 'normal' },
    temperature: { value: 36.6, status: 'normal' },
    stress: { value: 35, status: 'moderate' },
    sleep: { duration: 7.5, quality: 85 },
    activity: { steps: 8000, calories: 320 },
  },
  
  // Stressed individual
  stressed: {
    heartRate: { value: 95, status: 'elevated' },
    spo2: { value: 97, status: 'normal' },
    temperature: { value: 36.8, status: 'normal' },
    stress: { value: 75, status: 'high' },
    sleep: { duration: 5.5, quality: 45 },
    activity: { steps: 3000, calories: 120 },
  },
  
  // Athlete
  athlete: {
    heartRate: { value: 52, status: 'low' },
    spo2: { value: 99, status: 'normal' },
    temperature: { value: 36.2, status: 'normal' },
    stress: { value: 25, status: 'low' },
    sleep: { duration: 8.2, quality: 95 },
    activity: { steps: 15000, calories: 600 },
  },
  
  // Sick individual
  sick: {
    heartRate: { value: 105, status: 'high' },
    spo2: { value: 94, status: 'low' },
    temperature: { value: 38.2, status: 'high' },
    stress: { value: 65, status: 'moderate' },
    sleep: { duration: 8.5, quality: 60 },
    activity: { steps: 500, calories: 20 },
  },
  
  // Elderly
  elderly: {
    heartRate: { value: 68, status: 'normal' },
    spo2: { value: 96, status: 'normal' },
    temperature: { value: 36.4, status: 'normal' },
    stress: { value: 30, status: 'low' },
    sleep: { duration: 6.5, quality: 70 },
    activity: { steps: 3500, calories: 140 },
  },
};

/**
 * Generate mock sensor data for a specific scenario
 * @param {string} scenario - Scenario name
 * @param {string} userId - User ID
 * @returns {Object} Sensor data for scenario
 */
export const mockScenario = (scenario = 'healthy', userId = 'default') => {
  const scenarioData = MOCK_SCENARIOS[scenario] || MOCK_SCENARIOS.healthy;
  
  return {
    timestamp: new Date().toISOString(),
    userId,
    heartRate: mockHeartRate({ 
      userId, 
      min: scenarioData.heartRate.value - 5,
      max: scenarioData.heartRate.value + 5,
    }),
    spo2: mockSpO2({ 
      userId,
      min: scenarioData.spo2.value - 1,
      max: scenarioData.spo2.value,
    }),
    temperature: mockTemperature({ 
      userId,
      min: scenarioData.temperature.value - 0.2,
      max: scenarioData.temperature.value + 0.2,
    }),
    stress: mockStress({ 
      userId,
      min: scenarioData.stress.value - 10,
      max: scenarioData.stress.value + 10,
    }),
    sleep: mockSleep({ 
      userId,
      minDuration: scenarioData.sleep.duration - 0.5,
      maxDuration: scenarioData.sleep.duration + 0.5,
    }),
    activity: mockActivity({ 
      userId,
      minSteps: scenarioData.activity.steps - 500,
      maxSteps: scenarioData.activity.steps + 500,
    }),
  };
};

export default {
  mockHeartRate,
  mockSpO2,
  mockTemperature,
  mockStress,
  mockSleep,
  mockActivity,
  mockBloodPressure,
  mockHRV,
  mockRespiratoryRate,
  mockGlucose,
  mockAllSensors,
  mockHistoricalData,
  mockScenario,
  MOCK_SCENARIOS,
};