/**
 * Auth Routes - Registration, Login, JWT
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { generateToken } = require('../middleware/auth');
const db = require('../services/db');
const { createLogger } = require('../utils/logger');

const log = createLogger('auth');

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const userData = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const isFamily = userData.user_type === 'family_member';

    const insertData = isFamily
      ? {
          username: userData.username,
          email: userData.email,
          password_hash: passwordHash,
          user_type: 'family_member',
          first_name: userData.first_name,
          last_name: userData.last_name,
          age: userData.age,
          relationship: userData.relationship,
        }
      : {
          username: userData.username,
          email: userData.email,
          password_hash: passwordHash,
          user_type: 'patient',
          first_name: userData.first_name,
          middle_name: userData.middle_name,
          last_name: userData.last_name,
          phone: userData.phone,
          date_of_birth: userData.date_of_birth,
          age: userData.age,
          gender: userData.gender,
          blood_group: userData.blood_group,
          height_cm: userData.height_cm,
          weight_kg: userData.weight_kg,
          bmi: userData.bmi,
          bmi_category: userData.bmi_category,
        };

    const { data, error } = await db.createUser(insertData);
    if (error) return res.status(400).json({ success: false, error: error.message });

    // Initialize leaderboard entry for patients
    if (!isFamily) {
      await db.upsertLeaderboard({ user_id: data.id, total_score: 50 });
    }

    const token = generateToken(data);
    log.info(`User registered: ${data.username} (${data.user_type})`);

    res.status(201).json({ success: true, data, token });
  } catch (err) {
    log.error('Registration error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email/username and password required' });
    }

    // Try to find user by email or username
    let user;
    const { data: byEmail } = await db.getUserByEmail(email);
    if (byEmail) {
      user = byEmail;
    } else {
      const { data: byUsername } = await db.getUserByUsername(email);
      if (byUsername) user = byUsername;
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Verify password - support both hashed and plain text (legacy)
    let isMatch = false;
    if (user.password_hash.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    } else {
      // Legacy plain text password support
      isMatch = user.password_hash === password;
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Update last login
    await db.updateUser(user.id, { last_login: new Date().toISOString() });

    const token = generateToken(user);
    log.info(`User logged in: ${user.username}`);

    res.json({ success: true, data: user, token });
  } catch (err) {
    log.error('Login error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
