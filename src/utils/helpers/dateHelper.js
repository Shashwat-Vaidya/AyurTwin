/**
 * Date helper utilities for common date operations
 */

/**
 * Format date to ISO string without time
 * @param {Date|string} date - Date to format
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export const toISODate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();
  const weekday = d.getDay();

  const replacements = {
    'YYYY': year,
    'YY': year.toString().slice(-2),
    'MMMM': fullMonths[month],
    'MMM': months[month],
    'MM': (month + 1).toString().padStart(2, '0'),
    'M': (month + 1).toString(),
    'DD': day.toString().padStart(2, '0'),
    'D': day.toString(),
    'dddd': fullDays[weekday],
    'ddd': days[weekday],
    'HH': hour.toString().padStart(2, '0'),
    'H': hour.toString(),
    'hh': (hour % 12 || 12).toString().padStart(2, '0'),
    'h': (hour % 12 || 12).toString(),
    'mm': minute.toString().padStart(2, '0'),
    'm': minute.toString(),
    'ss': second.toString().padStart(2, '0'),
    's': second.toString(),
    'A': hour >= 12 ? 'PM' : 'AM',
    'a': hour >= 12 ? 'pm' : 'am',
  };

  return format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|HH|H|hh|h|mm|m|ss|s|A|a/g, 
    match => replacements[match] || match);
};

/**
 * Get relative time string
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time (e.g., "2 hours ago")
 */
export const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) {
    return diffSec <= 5 ? 'just now' : `${diffSec} seconds ago`;
  }
  if (diffMin < 60) {
    return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
  }
  if (diffHour < 24) {
    return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
  }
  if (diffDay < 7) {
    return diffDay === 1 ? 'yesterday' : `${diffDay} days ago`;
  }
  if (diffWeek < 4) {
    return diffWeek === 1 ? 'last week' : `${diffWeek} weeks ago`;
  }
  if (diffMonth < 12) {
    return diffMonth === 1 ? 'last month' : `${diffMonth} months ago`;
  }
  return diffYear === 1 ? 'last year' : `${diffYear} years ago`;
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if today
 */
export const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

/**
 * Check if date is yesterday
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if yesterday
 */
export const isYesterday = (date) => {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
};

/**
 * Check if date is tomorrow
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if tomorrow
 */
export const isTomorrow = (date) => {
  const d = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return d.toDateString() === tomorrow.toDateString();
};

/**
 * Check if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if in past
 */
export const isPast = (date) => {
  return new Date(date) < new Date();
};

/**
 * Check if date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if in future
 */
export const isFuture = (date) => {
  return new Date(date) > new Date();
};

/**
 * Get start of day
 * @param {Date|string} date - Date
 * @returns {Date} Start of day (00:00:00)
 */
export const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 * @param {Date|string} date - Date
 * @returns {Date} End of day (23:59:59.999)
 */
export const endOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of week (Monday)
 * @param {Date|string} date - Date
 * @returns {Date} Start of week
 */
export const startOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

/**
 * Get end of week (Sunday)
 * @param {Date|string} date - Date
 * @returns {Date} End of week
 */
export const endOfWeek = (date = new Date()) => {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  return endOfDay(d);
};

/**
 * Get start of month
 * @param {Date|string} date - Date
 * @returns {Date} Start of month
 */
export const startOfMonth = (date = new Date()) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

/**
 * Get end of month
 * @param {Date|string} date - Date
 * @returns {Date} End of month
 */
export const endOfMonth = (date = new Date()) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
};

/**
 * Get start of year
 * @param {Date|string} date - Date
 * @returns {Date} Start of year
 */
export const startOfYear = (date = new Date()) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), 0, 1);
};

/**
 * Get end of year
 * @param {Date|string} date - Date
 * @returns {Date} End of year
 */
export const endOfYear = (date = new Date()) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
};

/**
 * Add days to date
 * @param {Date|string} date - Base date
 * @param {number} days - Days to add
 * @returns {Date} New date
 */
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Add months to date
 * @param {Date|string} date - Base date
 * @param {number} months - Months to add
 * @returns {Date} New date
 */
export const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

/**
 * Add years to date
 * @param {Date|string} date - Base date
 * @param {number} years - Years to add
 * @returns {Date} New date
 */
export const addYears = (date, years) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
};

/**
 * Get difference in days between two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Days difference
 */
export const diffDays = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get difference in hours between two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Hours difference
 */
export const diffHours = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60));
};

/**
 * Get difference in minutes between two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Minutes difference
 */
export const diffMinutes = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60));
};

/**
 * Check if date is between two dates
 * @param {Date|string} date - Date to check
 * @param {Date|string} start - Start date
 * @param {Date|string} end - End date
 * @returns {boolean} True if between
 */
export const isBetween = (date, start, end) => {
  const d = new Date(date);
  return d >= new Date(start) && d <= new Date(end);
};

/**
 * Get age from date of birth
 * @param {Date|string} dob - Date of birth
 * @returns {number} Age in years
 */
export const getAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Get date range for period
 * @param {string} period - Period type (day, week, month, year)
 * @returns {Object} Start and end dates
 */
export const getDateRange = (period = 'week') => {
  const now = new Date();
  let start, end;

  switch (period) {
    case 'day':
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    case 'week':
      start = startOfWeek(now);
      end = endOfWeek(now);
      break;
    case 'month':
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    case 'year':
      start = startOfYear(now);
      end = endOfYear(now);
      break;
    default:
      start = startOfWeek(now);
      end = endOfWeek(now);
  }

  return { start, end };
};

/**
 * Get array of dates between range
 * @param {Date|string} start - Start date
 * @param {Date|string} end - End date
 * @returns {Date[]} Array of dates
 */
export const getDatesBetween = (start, end) => {
  const dates = [];
  const current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

/**
 * Check if date is weekend
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if weekend
 */
export const isWeekend = (date) => {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
};

/**
 * Check if date is weekday
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if weekday
 */
export const isWeekday = (date) => {
  return !isWeekend(date);
};

export default {
  toISODate,
  formatDate,
  timeAgo,
  isToday,
  isYesterday,
  isTomorrow,
  isPast,
  isFuture,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addMonths,
  addYears,
  diffDays,
  diffHours,
  diffMinutes,
  isBetween,
  getAge,
  getDateRange,
  getDatesBetween,
  isWeekend,
  isWeekday,
};