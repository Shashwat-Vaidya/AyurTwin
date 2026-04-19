/**
 * Simple logger utility
 */
const createLogger = (name) => {
  const prefix = `[${new Date().toISOString()}] [${name}]`;
  return {
    info: (...args) => console.log(prefix, 'INFO', ...args),
    warn: (...args) => console.warn(prefix, 'WARN', ...args),
    error: (...args) => console.error(prefix, 'ERROR', ...args),
    debug: (...args) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(prefix, 'DEBUG', ...args);
      }
    },
  };
};

module.exports = { createLogger };
