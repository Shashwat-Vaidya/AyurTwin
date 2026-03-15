/**
 * Number formatting utilities
 */

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatWithCommas = (num) => {
  if (num === null || num === undefined) return '--';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format number to fixed decimals
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number
 */
export const formatToFixed = (num, decimals = 2) => {
  if (num === null || num === undefined) return '--';
  return num.toFixed(decimals);
};

/**
 * Format percentage
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export const formatToPercentage = (num, decimals = 0) => {
  if (num === null || num === undefined) return '--%';
  return `${(num * 100).toFixed(decimals)}%`;
};

/**
 * Format currency
 * @param {number} num - Number to format
 * @param {string} currency - Currency symbol
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted currency
 */
export const formatCurrency = (num, currency = '$', decimals = 2) => {
  if (num === null || num === undefined) return `${currency}--`;
  return `${currency}${num.toFixed(decimals)}`;
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '--';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Format to ordinal (1st, 2nd, 3rd, etc.)
 * @param {number} num - Number to format
 * @returns {string} Ordinal string
 */
export const formatOrdinal = (num) => {
  if (num === null || num === undefined) return '--';
  
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return `${num}st`;
  }
  if (j === 2 && k !== 12) {
    return `${num}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${num}rd`;
  }
  return `${num}th`;
};

/**
 * Format to Roman numerals
 * @param {number} num - Number to format (1-3999)
 * @returns {string} Roman numeral
 */
export const formatToRoman = (num) => {
  if (num < 1 || num > 3999) return num.toString();
  
  const romanNumerals = [
    ['M', 1000],
    ['CM', 900],
    ['D', 500],
    ['CD', 400],
    ['C', 100],
    ['XC', 90],
    ['L', 50],
    ['XL', 40],
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1]
  ];
  
  let result = '';
  let remaining = num;
  
  for (const [letter, value] of romanNumerals) {
    while (remaining >= value) {
      result += letter;
      remaining -= value;
    }
  }
  
  return result;
};

/**
 * Round to nearest value
 * @param {number} num - Number to round
 * @param {number} nearest - Nearest value to round to
 * @returns {number} Rounded number
 */
export const roundToNearest = (num, nearest) => {
  return Math.round(num / nearest) * nearest;
};

/**
 * Clamp number between min and max
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Map number from one range to another
 * @param {number} num - Number to map
 * @param {number} inMin - Input range min
 * @param {number} inMax - Input range max
 * @param {number} outMin - Output range min
 * @param {number} outMax - Output range max
 * @returns {number} Mapped number
 */
export const mapRange = (num, inMin, inMax, outMin, outMax) => {
  return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Check if number is within range
 * @param {number} num - Number to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if in range
 */
export const isInRange = (num, min, max) => {
  return num >= min && num <= max;
};

/**
 * Get random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export const randomBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * Get random integer between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export const randomIntBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Calculate average of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Average
 */
export const average = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
};

/**
 * Calculate median of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Median
 */
export const median = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
};

/**
 * Calculate mode of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number[]} Mode(s)
 */
export const mode = (numbers) => {
  if (!numbers || numbers.length === 0) return [];
  
  const frequency = {};
  let maxFreq = 0;
  
  numbers.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) maxFreq = frequency[num];
  });
  
  return Object.keys(frequency)
    .filter(num => frequency[num] === maxFreq)
    .map(Number);
};

export default {
  formatWithCommas,
  formatToFixed,
  formatToPercentage,
  formatCurrency,
  formatFileSize,
  formatOrdinal,
  formatToRoman,
  roundToNearest,
  clamp,
  mapRange,
  isInRange,
  randomBetween,
  randomIntBetween,
  average,
  median,
  mode,
};