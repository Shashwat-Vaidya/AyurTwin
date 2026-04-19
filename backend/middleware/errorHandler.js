/**
 * Global Error Handler Middleware
 */
const { createLogger } = require('../utils/logger');
const log = createLogger('error-handler');

const errorHandler = (err, req, res, _next) => {
  log.error(`${req.method} ${req.path}:`, err.message);

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Token expired' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: err.message });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};

module.exports = errorHandler;
