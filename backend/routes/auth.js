const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ✅ Register route - will be accessible at POST /register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, role, ...otherFields } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      role,
      contact: otherFields.contact || null,
      country: otherFields.country || null,
      state: otherFields.state || null,
      district: otherFields.district || null,
      taluk: otherFields.taluk || null,
      address: otherFields.address || null,
      pincode: otherFields.pincode || null,
      account_no: otherFields.account_no || null,
      account_holder_name: otherFields.account_holder_name || null,
      bank_name: otherFields.bank_name || null,
      branch_name: otherFields.branch_name || null,
      ifsc_code: otherFields.ifsc_code || null
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: user.id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

// ✅ Login route - will be accessible at POST /login
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const user = await User.findOne({ where: { username, role } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      access_token: token,
      user: {
        id: user.id,
        name: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
});

// ✅ Get Profile - will be accessible at GET /profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch profile', 
      error: error.message 
    });
  }
});

// ✅ Update Profile - will be accessible at PUT /profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { password, id, createdAt, updatedAt, ...updateData } = req.body;
    
    await User.update(updateData, { where: { id: req.user.id } });
    
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update profile', 
      error: error.message 
    });
  }
});

// ✅ Change Password - will be accessible at PUT /change_password
router.put('/change_password', authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    const user = await User.findByPk(req.user.id);
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: req.user.id } });
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to change password', 
      error: error.message 
    });
  }
});

module.exports = router;
