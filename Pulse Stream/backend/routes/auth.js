const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation rules
const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('username').trim().notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
];

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// POST /api/auth - Handle both login and registration
router.post('/', async (req, res) => {
  try {
    const { username, password, name, confirmPassword } = req.body;

    // Determine if this is a login or registration based on the presence of name field
    const isRegistration = !!name;

    if (isRegistration) {
      // Registration logic
      await Promise.all(registerValidation.map(validation => validation.run(req)));
    } else {
      // Login logic
      await Promise.all(loginValidation.map(validation => validation.run(req)));
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (isRegistration) {
      // Handle Registration
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({
          message: 'Username already exists'
        });
      }

      const newUser = await User.create({
        name: name.trim(),
        username: username.toLowerCase().trim(),
        password
      });

      await newUser.updateLastLogin();

      const token = generateToken(newUser.id);

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: newUser.getSafeUserData()
      });
    } else {
      // Handle Login
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({
          message: 'Invalid username or password'
        });
      }

      if (!user.is_active) {
        return res.status(401).json({
          message: 'Account is deactivated'
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Invalid username or password'
        });
      }

      await user.updateLastLogin();

      const token = generateToken(user.id);

      res.status(200).json({
        message: 'Login successful',
        token,
        user: user.getSafeUserData()
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/register - Explicit registration endpoint
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, username, password } = req.body;

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        message: 'Username already exists'
      });
    }

    const newUser = await User.create({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      password
    });

    await newUser.updateLastLogin();

    const token = generateToken(newUser.id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: newUser.getSafeUserData()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/login - Explicit login endpoint
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid username or password'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        message: 'Account is deactivated'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid username or password'
      });
    }

    await user.updateLastLogin();

    const token = generateToken(user.id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: user.getSafeUserData()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

module.exports = router;
