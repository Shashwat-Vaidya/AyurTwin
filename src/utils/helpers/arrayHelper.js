/**
 * Array helper utilities for common array operations
 */

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string|Function} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Sort array by key
 * @param {Array} array - Array to sort
 * @param {string|Function} key - Key to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export const sortBy = (array, key, order = 'asc') => {
  const sorted = [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
};

/**
 * Filter unique values
 * @param {Array} array - Array to filter
 * @param {string|Function} key - Key to check uniqueness
 * @returns {Array} Array with unique values
 */
export const uniqueBy = (array, key) => {
  const seen = new Set();
  return array.filter(item => {
    const value = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * Chunk array into smaller arrays
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} Array of chunks
 */
export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Shuffle array randomly
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get intersection of arrays
 * @param {...Array} arrays - Arrays to intersect
 * @returns {Array} Intersection of arrays
 */
export const intersection = (...arrays) => {
  if (arrays.length === 0) return [];
  return arrays.reduce((result, array) => {
    return result.filter(item => array.includes(item));
  });
};

/**
 * Get union of arrays
 * @param {...Array} arrays - Arrays to union
 * @returns {Array} Union of arrays
 */
export const union = (...arrays) => {
  return [...new Set(arrays.flat())];
};

/**
 * Get difference of arrays
 * @param {Array} array - Base array
 * @param {Array} ...exclude - Arrays to exclude
 * @returns {Array} Difference of arrays
 */
export const difference = (array, ...exclude) => {
  const excludeSet = new Set(exclude.flat());
  return array.filter(item => !excludeSet.has(item));
};

/**
 * Remove duplicates from array
 * @param {Array} array - Array to process
 * @returns {Array} Array without duplicates
 */
export const unique = (array) => {
  return [...new Set(array)];
};

/**
 * Flatten nested array
 * @param {Array} array - Nested array
 * @param {number} depth - Depth to flatten
 * @returns {Array} Flattened array
 */
export const flatten = (array, depth = Infinity) => {
  return array.flat(depth);
};

/**
 * Zip multiple arrays together
 * @param {...Array} arrays - Arrays to zip
 * @returns {Array} Zipped array
 */
export const zip = (...arrays) => {
  const maxLength = Math.max(...arrays.map(arr => arr.length));
  return Array.from({ length: maxLength }, (_, i) => 
    arrays.map(arr => arr[i])
  );
};

/**
 * Count occurrences in array
 * @param {Array} array - Array to count
 * @param {string|Function} key - Key to count by
 * @returns {Object} Count object
 */
export const countBy = (array, key) => {
  return array.reduce((result, item) => {
    const value = typeof key === 'function' ? key(item) : item[key];
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});
};

/**
 * Get min value by key
 * @param {Array} array - Array to search
 * @param {string|Function} key - Key to compare
 * @returns {*} Min value
 */
export const minBy = (array, key) => {
  if (array.length === 0) return undefined;
  return array.reduce((min, item) => {
    const minVal = typeof key === 'function' ? key(min) : min[key];
    const itemVal = typeof key === 'function' ? key(item) : item[key];
    return itemVal < minVal ? item : min;
  });
};

/**
 * Get max value by key
 * @param {Array} array - Array to search
 * @param {string|Function} key - Key to compare
 * @returns {*} Max value
 */
export const maxBy = (array, key) => {
  if (array.length === 0) return undefined;
  return array.reduce((max, item) => {
    const maxVal = typeof key === 'function' ? key(max) : max[key];
    const itemVal = typeof key === 'function' ? key(item) : item[key];
    return itemVal > maxVal ? item : max;
  });
};

/**
 * Sum values by key
 * @param {Array} array - Array to sum
 * @param {string|Function} key - Key to sum
 * @returns {number} Sum of values
 */
export const sumBy = (array, key) => {
  return array.reduce((sum, item) => {
    const value = typeof key === 'function' ? key(item) : item[key];
    return sum + (value || 0);
  }, 0);
};

/**
 * Average values by key
 * @param {Array} array - Array to average
 * @param {string|Function} key - Key to average
 * @returns {number} Average of values
 */
export const averageBy = (array, key) => {
  if (array.length === 0) return 0;
  const sum = sumBy(array, key);
  return sum / array.length;
};

/**
 * Partition array by predicate
 * @param {Array} array - Array to partition
 * @param {Function} predicate - Partition function
 * @returns {Array} Array of two arrays
 */
export const partition = (array, predicate) => {
  return array.reduce(
    (result, item) => {
      result[predicate(item) ? 0 : 1].push(item);
      return result;
    },
    [[], []]
  );
};

/**
 * Remove falsy values from array
 * @param {Array} array - Array to compact
 * @returns {Array} Compacted array
 */
export const compact = (array) => {
  return array.filter(Boolean);
};

/**
 * Get random item from array
 * @param {Array} array - Array to pick from
 * @returns {*} Random item
 */
export const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Get multiple random items from array
 * @param {Array} array - Array to pick from
 * @param {number} count - Number of items
 * @returns {Array} Random items
 */
export const sampleSize = (array, count) => {
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
};

/**
 * Move item in array
 * @param {Array} array - Array to modify
 * @param {number} from - From index
 * @param {number} to - To index
 * @returns {Array} New array
 */
export const move = (array, from, to) => {
  const copy = [...array];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};

/**
 * Replace item in array
 * @param {Array} array - Array to modify
 * @param {number} index - Index to replace
 * @param {*} item - New item
 * @returns {Array} New array
 */
export const replace = (array, index, item) => {
  const copy = [...array];
  copy[index] = item;
  return copy;
};

/**
 * Remove item from array
 * @param {Array} array - Array to modify
 * @param {number|Function} condition - Index or predicate
 * @returns {Array} New array
 */
export const remove = (array, condition) => {
  if (typeof condition === 'number') {
    return array.filter((_, i) => i !== condition);
  }
  return array.filter((item, i) => !condition(item, i));
};

/**
 * Find last item matching predicate
 * @param {Array} array - Array to search
 * @param {Function} predicate - Search function
 * @returns {*} Last matching item
 */
export const findLast = (array, predicate) => {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) {
      return array[i];
    }
  }
  return undefined;
};

/**
 * Get index of last item matching predicate
 * @param {Array} array - Array to search
 * @param {Function} predicate - Search function
 * @returns {number} Last matching index
 */
export const findLastIndex = (array, predicate) => {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }
  return -1;
};

/**
 * Toggle item in array (add if not present, remove if present)
 * @param {Array} array - Array to modify
 * @param {*} item - Item to toggle
 * @returns {Array} New array
 */
export const toggle = (array, item) => {
  if (array.includes(item)) {
    return array.filter(i => i !== item);
  }
  return [...array, item];
};

/**
 * Intersperse separator between items
 * @param {Array} array - Array to intersperse
 * @param {*} separator - Separator to insert
 * @returns {Array} New array
 */
export const intersperse = (array, separator) => {
  return array.reduce((result, item, i) => {
    if (i > 0) result.push(separator);
    result.push(item);
    return result;
  }, []);
};

export default {
  groupBy,
  sortBy,
  uniqueBy,
  chunk,
  shuffle,
  intersection,
  union,
  difference,
  unique,
  flatten,
  zip,
  countBy,
  minBy,
  maxBy,
  sumBy,
  averageBy,
  partition,
  compact,
  sample,
  sampleSize,
  move,
  replace,
  remove,
  findLast,
  findLastIndex,
  toggle,
  intersperse,
};