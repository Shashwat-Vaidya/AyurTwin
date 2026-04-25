/**
 * JWT auth middleware - role-aware (patient | family).
 */
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

function sign(user) {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

function authenticate(req, res, next) {
    const h = req.headers.authorization;
    if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: 'auth required' });
    try {
        req.user = jwt.verify(h.slice(7), JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'invalid or expired token' });
    }
}

function optional(req, _res, next) {
    const h = req.headers.authorization;
    if (h && h.startsWith('Bearer ')) {
        try { req.user = jwt.verify(h.slice(7), JWT_SECRET); } catch { /* ignore */ }
    }
    next();
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'auth required' });
        if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'forbidden' });
        next();
    };
}

module.exports = { sign, authenticate, optional, requireRole };
