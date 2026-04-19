/**
 * Mock alert data for development and testing
 */

/**
 * Generate a mock alert
 * @param {Object} overrides - Override default values
 * @returns {Object} Mock alert
 */
export const generateMockAlert = (overrides = {}) => {
  const types = ['heart', 'stress', 'dosha', 'risk', 'device', 'sleep', 'activity', 'spo2', 'temperature'];
  const severities = ['critical', 'high', 'medium', 'low', 'info'];
  const statuses = ['active', 'resolved', 'snoozed', 'dismissed'];
  
  const type = overrides.type || types[Math.floor(Math.random() * types.length)];
  const severity = overrides.severity || severities[Math.floor(Math.random() * severities.length)];
  const status = overrides.status || statuses[Math.floor(Math.random() * 3)]; // Bias towards active

  const alertTemplates = {
    heart: {
      low: { title: 'Mild Heart Rate Variation', message: 'Slight variation detected in heart rate pattern.' },
      medium: { title: 'Irregular Heart Rate Detected', message: 'Multiple irregular heart rate readings detected.' },
      high: { title: 'Significant Heart Rate Irregularity', message: 'Consistent irregular heart rate pattern detected.' },
      critical: { title: 'Critical: Arrhythmia Detected', message: 'Serious heart rhythm irregularity detected. Please seek medical attention.' },
    },
    stress: {
      low: { title: 'Slight Stress Increase', message: 'Your stress levels are slightly elevated.' },
      medium: { title: 'Elevated Stress Levels', message: 'Stress levels have been elevated for 2 hours.' },
      high: { title: 'High Stress Detected', message: 'Stress levels are significantly elevated.' },
      critical: { title: 'Severe Stress Alert', message: 'Critical stress levels detected. Please practice relaxation techniques.' },
    },
    dosha: {
      low: { title: 'Minor Dosha Shift', message: 'Slight imbalance in your dosha balance detected.' },
      medium: { title: 'Dosha Imbalance Detected', message: 'Your dosha balance has shifted significantly.' },
      high: { title: 'Significant Dosha Imbalance', message: 'Major dosha imbalance detected. Check recommendations.' },
      critical: { title: 'Critical Dosha Imbalance', message: 'Severe dosha imbalance requires immediate attention.' },
    },
    sleep: {
      low: { title: 'Sleep Quality Slightly Low', message: 'Your sleep quality was slightly below optimal.' },
      medium: { title: 'Poor Sleep Quality', message: 'Sleep quality was significantly below optimal.' },
      high: { title: 'Severe Sleep Disruption', message: 'Multiple sleep disruptions detected.' },
      critical: { title: 'Critical Sleep Deprivation', message: 'Severe sleep deprivation detected.' },
    },
    device: {
      low: { title: 'Device Status Update', message: 'Your device status has been updated.' },
      medium: { title: 'Device Connection Issue', message: 'Intermittent connection detected with your device.' },
      high: { title: 'Device Malfunction', message: 'Your device may be malfunctioning. Please check.' },
      critical: { title: 'Device Failure', message: 'Critical device error detected. Please restart.' },
    },
    spo2: {
      low: { title: 'Slightly Low SpO₂', message: 'Blood oxygen levels slightly below normal.' },
      medium: { title: 'Low SpO₂ Detected', message: 'Blood oxygen levels are below normal range.' },
      high: { title: 'Significantly Low SpO₂', message: 'Blood oxygen levels critically low.' },
      critical: { title: 'Critical: Severe Hypoxia', message: 'Dangerously low blood oxygen. Seek immediate medical attention.' },
    },
  };

  const template = alertTemplates[type]?.[severity] || {
    title: `${type} ${severity} Alert`,
    message: `A ${severity} severity ${type} alert has been triggered.`,
  };

  const now = new Date();
  const timeOffset = Math.floor(Math.random() * 24 * 60 * 60 * 1000); // Random time in last 24h
  const timestamp = new Date(now.getTime() - timeOffset).toISOString();

  return {
    id: overrides.id || `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    severity,
    status,
    title: overrides.title || template.title,
    message: overrides.message || template.message,
    details: overrides.details || `This is a detailed description of the ${severity} ${type} alert. It provides more information about what triggered this alert and what actions you should take.`,
    recommendation: overrides.recommendation || getRecommendation(type, severity),
    timestamp: overrides.timestamp || timestamp,
    read: overrides.read !== undefined ? overrides.read : Math.random() > 0.5,
    actionable: overrides.actionable !== undefined ? overrides.actionable : severity !== 'info',
    actionText: overrides.actionText || getActionText(type, severity),
    ...overrides,
  };
};

/**
 * Get recommendation based on alert type and severity
 * @param {string} type - Alert type
 * @param {string} severity - Alert severity
 * @returns {string} Recommendation
 */
const getRecommendation = (type, severity) => {
  const recommendations = {
    heart: {
      low: 'Monitor your heart rate and rest if feeling unwell.',
      medium: 'Rest and avoid strenuous activity. Monitor closely.',
      high: 'Consult with your healthcare provider about these readings.',
      critical: 'Seek immediate medical attention.',
    },
    stress: {
      low: 'Practice deep breathing exercises.',
      medium: 'Take a break and practice relaxation techniques.',
      high: 'Consider meditation or speaking with a counselor.',
      critical: 'Seek professional help immediately.',
    },
    dosha: {
      low: 'Minor adjustments to diet and routine may help.',
      medium: 'Follow dosha-balancing recommendations in the app.',
      high: 'Significant lifestyle changes may be needed.',
      critical: 'Consult with an Ayurvedic practitioner.',
    },
    sleep: {
      low: 'Try to maintain a consistent sleep schedule.',
      medium: 'Improve sleep hygiene and bedtime routine.',
      high: 'Consider consulting a sleep specialist.',
      critical: 'Seek medical attention for sleep issues.',
    },
    device: {
      low: 'Ensure your device is properly connected.',
      medium: 'Try restarting your device and app.',
      high: 'Contact support for device troubleshooting.',
      critical: 'Device may need replacement. Contact support.',
    },
    spo2: {
      low: 'Practice deep breathing exercises.',
      medium: 'Rest and monitor your oxygen levels.',
      high: 'Seek medical attention if levels don\'t improve.',
      critical: 'EMERGENCY: Seek immediate medical attention.',
    },
  };

  return recommendations[type]?.[severity] || 'Monitor your health and consult a doctor if symptoms persist.';
};

/**
 * Get action text based on alert type and severity
 * @param {string} type - Alert type
 * @param {string} severity - Alert severity
 * @returns {string} Action text
 */
const getActionText = (type, severity) => {
  if (severity === 'critical') return 'Emergency';
  if (type === 'device') return 'Troubleshoot';
  if (type === 'dosha') return 'View Tips';
  if (type === 'stress') return 'Relax Now';
  if (type === 'heart') return 'Check Vitals';
  return 'View Details';
};

/**
 * Generate multiple mock alerts
 * @param {number} count - Number of alerts to generate
 * @param {Object} options - Generation options
 * @returns {Array} Array of mock alerts
 */
export const generateMockAlerts = (count = 10, options = {}) => {
  const alerts = [];
  for (let i = 0; i < count; i++) {
    alerts.push(generateMockAlert({
      id: `alert_${i + 1}`,
      ...options,
    }));
  }
  return alerts;
};

/**
 * Generate mock alerts by severity
 * @returns {Object} Alerts grouped by severity
 */
export const generateAlertsBySeverity = () => {
  return {
    critical: generateMockAlerts(2, { severity: 'critical', status: 'active' }),
    high: generateMockAlerts(3, { severity: 'high', status: 'active' }),
    medium: generateMockAlerts(4, { severity: 'medium', status: 'active' }),
    low: generateMockAlerts(3, { severity: 'low', status: 'active' }),
    info: generateMockAlerts(2, { severity: 'info', status: 'active' }),
    resolved: generateMockAlerts(8, { status: 'resolved' }),
  };
};

/**
 * Mock alerts for different scenarios
 */
export const MOCK_ALERTS = {
  // Critical health alerts
  criticalHeart: generateMockAlert({
    id: 'alert_critical_heart',
    type: 'heart',
    severity: 'critical',
    title: 'Critical: Severe Arrhythmia Detected',
    message: 'Dangerous heart rhythm pattern detected. Seek immediate medical attention.',
    details: 'Multiple irregular heartbeats detected over the past 30 minutes. This pattern is consistent with serious arrhythmia.',
    recommendation: 'Call emergency services immediately or have someone drive you to the nearest emergency room.',
    actionable: true,
    actionText: 'Call Emergency',
  }),

  criticalSpo2: generateMockAlert({
    id: 'alert_critical_spo2',
    type: 'spo2',
    severity: 'critical',
    title: 'Critical: Severe Hypoxia',
    message: 'Blood oxygen levels critically low (82%). Seek immediate medical attention.',
    details: 'Your SpO2 has been below 85% for 15 minutes. This is a medical emergency.',
    recommendation: 'Call emergency services immediately. If you have respiratory issues, use your emergency inhaler.',
    actionable: true,
    actionText: 'Call Emergency',
  }),

  // High severity alerts
  highStress: generateMockAlert({
    id: 'alert_high_stress',
    type: 'stress',
    severity: 'high',
    title: 'Severe Stress Episode',
    message: 'Prolonged high stress levels detected. Take immediate action to reduce stress.',
    details: 'Your stress levels have been above 80 for 3 hours. This can have serious health implications.',
    recommendation: 'Practice deep breathing exercises, take a break from work, and consider speaking with a mental health professional.',
    actionable: true,
    actionText: 'Relax Now',
  }),

  highBloodPressure: generateMockAlert({
    id: 'alert_high_bp',
    type: 'heart',
    severity: 'high',
    title: 'Dangerously High Blood Pressure',
    message: 'Blood pressure reading of 180/110 mmHg detected.',
    details: 'Your blood pressure is at hypertensive crisis levels. This requires immediate attention.',
    recommendation: 'Sit down, rest, and take your blood pressure again in 5 minutes. If it remains high, seek medical attention.',
    actionable: true,
    actionText: 'Monitor',
  }),

  // Medium severity alerts
  mediumDosha: generateMockAlert({
    id: 'alert_medium_dosha',
    type: 'dosha',
    severity: 'medium',
    title: 'Pitta Dosha Imbalance',
    message: 'Significant Pitta imbalance detected based on your readings.',
    details: 'Your Pitta dosha has increased by 25% over baseline. This may cause acidity, inflammation, and irritability.',
    recommendation: 'Avoid spicy foods, stay cool, and practice calming activities. Check diet recommendations in the app.',
    actionable: true,
    actionText: 'View Tips',
  }),

  mediumSleep: generateMockAlert({
    id: 'alert_medium_sleep',
    type: 'sleep',
    severity: 'medium',
    title: 'Poor Sleep Quality',
    message: 'Sleep efficiency below 70% for 3 consecutive nights.',
    details: 'Your sleep quality has been consistently poor. This can affect your overall health and well-being.',
    recommendation: 'Maintain a consistent sleep schedule, avoid screens before bed, and create a relaxing bedtime routine.',
    actionable: true,
    actionText: 'Sleep Tips',
  }),

  // Low severity alerts
  lowHeartRate: generateMockAlert({
    id: 'alert_low_heart',
    type: 'heart',
    severity: 'low',
    title: 'Low Resting Heart Rate',
    message: 'Your resting heart rate is 48 bpm, below normal range.',
    details: 'While athletes often have low heart rates, yours is lower than typical for your activity level.',
    recommendation: 'Monitor for symptoms like dizziness or fatigue. If you experience symptoms, consult your doctor.',
    actionable: false,
  }),

  lowActivity: generateMockAlert({
    id: 'alert_low_activity',
    type: 'activity',
    severity: 'low',
    title: 'Low Activity Day',
    message: 'You\'ve taken only 2,500 steps today.',
    details: 'Your activity level is significantly lower than your usual average.',
    recommendation: 'Try to take a short walk to increase your step count and improve circulation.',
    actionable: true,
    actionText: 'View Tips',
  }),

  // Info alerts
  infoDevice: generateMockAlert({
    id: 'alert_info_device',
    type: 'device',
    severity: 'info',
    title: 'Device Firmware Update Available',
    message: 'New firmware version 2.2.0 is available for your device.',
    details: 'This update includes performance improvements and bug fixes.',
    recommendation: 'Connect your device to charger and ensure Bluetooth is enabled before updating.',
    actionable: true,
    actionText: 'Update',
  }),

  infoReport: generateMockAlert({
    id: 'alert_info_report',
    type: 'system',
    severity: 'info',
    title: 'Weekly Health Report Ready',
    message: 'Your weekly health summary is now available.',
    details: 'View your heart rate, sleep, activity, and stress trends for the past week.',
    recommendation: 'Check your report to see your progress and areas for improvement.',
    actionable: true,
    actionText: 'View Report',
  }),

  // Device alerts
  deviceLowBattery: generateMockAlert({
    id: 'alert_device_battery',
    type: 'device',
    severity: 'medium',
    title: 'Low Battery',
    message: 'Your device battery is below 15%. Please charge soon.',
    details: 'Device will continue to monitor but may disconnect if battery dies.',
    recommendation: 'Charge your device to ensure continuous monitoring.',
    actionable: true,
    actionText: 'Charge Now',
  }),

  deviceDisconnected: generateMockAlert({
    id: 'alert_device_disconnect',
    type: 'device',
    severity: 'high',
    title: 'Device Disconnected',
    message: 'Your AyurTwin device has been disconnected for 30 minutes.',
    details: 'The device may be out of range or turned off.',
    recommendation: 'Bring your device closer to your phone and ensure Bluetooth is enabled.',
    actionable: true,
    actionText: 'Reconnect',
  }),
};

/**
 * Mock alert history
 */
export const MOCK_ALERT_HISTORY = {
  today: generateMockAlerts(3, { status: 'resolved', timestamp: new Date().toISOString() }),
  yesterday: generateMockAlerts(5, { 
    status: 'resolved', 
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() 
  }),
  lastWeek: generateMockAlerts(8, { 
    status: 'resolved', 
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() 
  }),
  lastMonth: generateMockAlerts(15, { 
    status: 'resolved', 
    timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() 
  }),
};

export default {
  generateMockAlert,
  generateMockAlerts,
  generateAlertsBySeverity,
  MOCK_ALERTS,
  MOCK_ALERT_HISTORY,
};