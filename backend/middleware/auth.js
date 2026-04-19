/**
 * Authentication & Authorization Middleware
 * JWT-based auth with role-based access control
 */
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const supabase = require('../config/supabase');

/**
 * Generate JWT token for a user
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      user_type: user.user_type,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Verify JWT token middleware
 * Attaches req.user on success
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

/**
 * Optional auth - attaches user if token present, but doesn't block
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (_) {
      // ignore invalid tokens for optional auth
    }
  }
  next();
};

/**
 * Role-based authorization
 * @param  {...string} roles - Allowed roles (e.g., 'patient', 'family_member', 'doctor')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    if (!roles.includes(req.user.user_type)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
  };
};

/**
 * Family member access check
 * Verifies that a family member has accepted connection to the target patient
 */
const checkFamilyAccess = async (req, res, next) => {
  const requesterId = req.user.id;
  const targetUserId = req.params.userId || req.body.user_id;

  if (!targetUserId) return next();

  // Self access is always allowed
  if (requesterId === targetUserId) return next();

  // Check if family member has accepted connection
  if (req.user.user_type === 'family_member') {
    const { data } = await supabase
      .from('family_connections')
      .select('id')
      .eq('family_member_id', requesterId)
      .eq('patient_id', targetUserId)
      .eq('status', 'accepted')
      .limit(1);

    if (!data || data.length === 0) {
      return res.status(403).json({ success: false, error: 'No approved family connection to this patient' });
    }
  }

  next();
};

module.exports = {
  generateToken,
  authenticate,
  optionalAuth,
  authorize,
  checkFamilyAccess,
};
