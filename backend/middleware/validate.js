/**
 * Request Validation Middleware
 */

/**
 * Validate required body fields
 * @param {string[]} fields - Required field names
 */
const requireFields = (...fields) => {
  return (req, res, next) => {
    const missing = fields.filter((f) => req.body[f] === undefined || req.body[f] === null || req.body[f] === '');
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missing.join(', ')}`,
      });
    }
    next();
  };
};

/**
 * Validate UUID format for params
 */
const validateUUID = (paramName = 'userId') => {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!value) return next();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      return res.status(400).json({ success: false, error: `Invalid ${paramName} format` });
    }
    next();
  };
};

/**
 * Sanitize string inputs to prevent injection
 */
const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
};

module.exports = { requireFields, validateUUID, sanitizeBody };
