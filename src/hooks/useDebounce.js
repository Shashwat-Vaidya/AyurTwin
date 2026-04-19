import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook to debounce a value
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook to debounce a function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const useDebouncedCallback = (fn, delay = 500) => {
  const timeoutRef = useRef(null);

  const debouncedFn = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [fn, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFn;
};

/**
 * Hook to throttle a function
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Throttle limit in milliseconds
 * @returns {Function} Throttled function
 */
export const useThrottledCallback = (fn, limit = 500) => {
  const lastRun = useRef(null);
  const timeoutRef = useRef(null);

  const throttledFn = useCallback((...args) => {
    const now = Date.now();

    if (lastRun.current && now < lastRun.current + limit) {
      // Schedule for later
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastRun.current = Date.now();
        fn(...args);
      }, limit);
    } else {
      // Run now
      lastRun.current = now;
      fn(...args);
    }
  }, [fn, limit]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledFn;
};

/**
 * Hook to debounce form input changes
 * @param {Object} initialValues - Initial form values
 * @param {Function} onChange - Change handler
 * @param {number} delay - Debounce delay
 * @returns {Object} Form state and handlers
 */
export const useDebouncedForm = (initialValues = {}, onChange, delay = 500) => {
  const [values, setValues] = useState(initialValues);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const debouncedValues = useDebounce(values, delay);

  useEffect(() => {
    if (JSON.stringify(debouncedValues) !== JSON.stringify(initialValues)) {
      setIsDebouncing(false);
      onChange?.(debouncedValues);
    }
  }, [debouncedValues, onChange, initialValues]);

  const handleChange = useCallback((name, value) => {
    setIsDebouncing(true);
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleMultipleChange = useCallback((newValues) => {
    setIsDebouncing(true);
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setIsDebouncing(false);
  }, [initialValues]);

  return {
    values,
    setValues,
    handleChange,
    handleMultipleChange,
    reset,
    isDebouncing,
  };
};

/**
 * Hook to debounce search queries
 * @param {number} delay - Debounce delay
 * @returns {Object} Search state and handlers
 */
export const useDebouncedSearch = (delay = 500) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
    }
  }, [searchTerm]);

  useEffect(() => {
    setIsSearching(false);
  }, [debouncedSearchTerm]);

  const handleSearch = useCallback((text) => {
    setSearchTerm(text);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setIsSearching(false);
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    handleSearch,
    clearSearch,
  };
};

/**
 * Hook to debounce API calls
 * @param {Function} apiCall - API call function
 * @param {number} delay - Debounce delay
 * @returns {Object} Call state and function
 */
export const useDebouncedApi = (apiCall, delay = 500) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const timeoutRef = useRef(null);

  const debouncedCall = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoading(true);
    setError(null);

    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await apiCall(...args);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message || 'API call failed');
        setData(null);
      } finally {
        setLoading(false);
      }
    }, delay);
  }, [apiCall, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    call: debouncedCall,
  };
};

/**
 * Hook to create a debounced version of any function
 * @returns {Object} Debounce utilities
 */
export const useDebounceUtils = () => {
  const timeouts = useRef({});

  const debounce = useCallback((key, fn, delay = 500) => {
    if (timeouts.current[key]) {
      clearTimeout(timeouts.current[key]);
    }

    timeouts.current[key] = setTimeout(() => {
      fn();
      delete timeouts.current[key];
    }, delay);
  }, []);

  const cancel = useCallback((key) => {
    if (timeouts.current[key]) {
      clearTimeout(timeouts.current[key]);
      delete timeouts.current[key];
    }
  }, []);

  const cancelAll = useCallback(() => {
    Object.values(timeouts.current).forEach(clearTimeout);
    timeouts.current = {};
  }, []);

  const isPending = useCallback((key) => {
    return !!timeouts.current[key];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cancelAll;
  }, [cancelAll]);

  return {
    debounce,
    cancel,
    cancelAll,
    isPending,
  };
};

/**
 * Hook to debounce window resize (useful for web)
 * @param {number} delay - Debounce delay
 * @returns {Object} Window dimensions
 */
export const useDebouncedWindowSize = (delay = 250) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const debouncedSetSize = useDebouncedCallback((width, height) => {
    setWindowSize({ width, height });
  }, delay);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      debouncedSetSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [debouncedSetSize]);

  return windowSize;
};

export default useDebounce;