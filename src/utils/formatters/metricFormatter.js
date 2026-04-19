/**
 * Metric formatting utilities
 */

/**
 * Format heart rate
 * @param {number} value - Heart rate value
 * @param {boolean} showUnit - Show unit
 * @returns {string} Formatted heart rate
 */
export const formatHeartRate = (value, showUnit = true) => {
  if (value === null || value === undefined) return '--';
  return showUnit ? `${Math.round(value)} bpm` : `${Math.round(value)}`;
};

/**
 * Format SpO2
 * @param {number} value - SpO2 value
 * @param {boolean} showUnit - Show unit
 * @returns {string} Formatted SpO2
 */
export const formatSpO2 = (value, showUnit = true) => {
  if (value === null || value === undefined) return '--';
  return showUnit ? `${Math.round(value)}%` : `${Math.round(value)}`;
};

/**
 * Format temperature
 * @param {number} value - Temperature value
 * @param {string} unit - Unit ('c' or 'f')
 * @param {boolean} showUnit - Show unit
 * @returns {string} Formatted temperature
 */
export const formatTemperature = (value, unit = 'c', showUnit = true) => {
  if (value === null || value === undefined) return '--';
  const rounded = value.toFixed(1);
  if (!showUnit) return rounded;
  return unit === 'c' ? `${rounded}°C` : `${rounded}°F`;
};

/**
 * Format stress level
 * @param {number} value - Stress value
 * @returns {string} Formatted stress
 */
export const formatStress = (value) => {
  if (value === null || value === undefined) return '--';
  return `${Math.round(value)}`;
};

/**
 * Format steps
 * @param {number} value - Steps value
 * @param {boolean} abbreviate - Abbreviate large numbers
 * @returns {string} Formatted steps
 */
export const formatSteps = (value, abbreviate = true) => {
  if (value === null || value === undefined) return '--';
  
  if (abbreviate) {
    if (value >= 10000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
  }
  return value.toLocaleString();
};

/**
 * Format distance
 * @param {number} value - Distance value
 * @param {string} unit - Unit ('km' or 'mi')
 * @param {boolean} showUnit - Show unit
 * @returns {string} Formatted distance
 */
export const formatDistance = (value, unit = 'km', showUnit = true) => {
  if (value === null || value === undefined) return '--';
  const rounded = value.toFixed(1);
  return showUnit ? `${rounded} ${unit}` : rounded;
};

/**
 * Format calories
 * @param {number} value - Calories value
 * @param {boolean} abbreviate - Abbreviate large numbers
 * @returns {string} Formatted calories
 */
export const formatCalories = (value, abbreviate = true) => {
  if (value === null || value === undefined) return '--';
  
  if (abbreviate && value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toLocaleString();
};

/**
 * Format sleep duration
 * @param {number} hours - Sleep hours
 * @returns {string} Formatted sleep
 */
export const formatSleep = (hours) => {
  if (hours === null || hours === undefined) return '--';
  return `${hours.toFixed(1)}h`;
};

/**
 * Format weight
 * @param {number} value - Weight value
 * @param {string} unit - Unit ('kg' or 'lb')
 * @param {boolean} showUnit - Show unit
 * @returns {string} Formatted weight
 */
export const formatWeight = (value, unit = 'kg', showUnit = true) => {
  if (value === null || value === undefined) return '--';
  const rounded = value.toFixed(1);
  return showUnit ? `${rounded} ${unit}` : rounded;
};

/**
 * Format height
 * @param {number} value - Height value
 * @param {string} unit - Unit ('cm' or 'ft')
 * @param {boolean} showUnit - Show unit
 * @returns {string} Formatted height
 */
export const formatHeight = (value, unit = 'cm', showUnit = true) => {
  if (value === null || value === undefined) return '--';
  
  if (unit === 'ft') {
    const feet = Math.floor(value / 30.48);
    const inches = Math.round((value % 30.48) / 2.54);
    return showUnit ? `${feet}'${inches}"` : `${feet}'${inches}`;
  }
  
  return showUnit ? `${Math.round(value)} cm` : `${Math.round(value)}`;
};

/**
 * Format BMI
 * @param {number} value - BMI value
 * @returns {string} Formatted BMI
 */
export const formatBMI = (value) => {
  if (value === null || value === undefined) return '--';
  return value.toFixed(1);
};

/**
 * Format percentage
 * @param {number} value - Percentage value
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '--';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format blood pressure
 * @param {number} systolic - Systolic value
 * @param {number} diastolic - Diastolic value
 * @returns {string} Formatted blood pressure
 */
export const formatBloodPressure = (systolic, diastolic) => {
  if (!systolic || !diastolic) return '--/--';
  return `${Math.round(systolic)}/${Math.round(diastolic)}`;
};

/**
 * Format respiratory rate
 * @param {number} value - Respiratory rate
 * @returns {string} Formatted respiratory rate
 */
export const formatRespiratoryRate = (value) => {
  if (value === null || value === undefined) return '--';
  return `${Math.round(value)} bpm`;
};

/**
 * Format HRV
 * @param {number} value - HRV value
 * @returns {string} Formatted HRV
 */
export const formatHRV = (value) => {
  if (value === null || value === undefined) return '--';
  return `${Math.round(value)} ms`;
};

/**
 * Format with unit
 * @param {number} value - Value
 * @param {string} unit - Unit
 * @returns {string} Formatted value
 */
export const formatWithUnit = (value, unit) => {
  if (value === null || value === undefined) return '--';
  return `${value} ${unit}`;
};

/**
 * Format large number with K/M/B suffix
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined) return '--';
  
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(decimals)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(decimals)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(decimals)}K`;
  }
  
  return num.toString();
};

export default {
  formatHeartRate,
  formatSpO2,
  formatTemperature,
  formatStress,
  formatSteps,
  formatDistance,
  formatCalories,
  formatSleep,
  formatWeight,
  formatHeight,
  formatBMI,
  formatPercentage,
  formatBloodPressure,
  formatRespiratoryRate,
  formatHRV,
  formatWithUnit,
  formatNumber,
};