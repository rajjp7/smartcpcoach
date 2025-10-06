const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// --- REGISTER ---
router.post('/register', async (req, res) => {
  try {
    const { username, password, handle } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      username,
      password: hashedPassword,
      handle,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send token as httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // set to true in production
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send user info (optional, not sensitive)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        handle: user.handle,
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// --- LOGOUT (Optional) ---
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production'
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
