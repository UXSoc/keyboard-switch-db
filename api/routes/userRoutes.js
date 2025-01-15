const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET || 'asdfe45we45w345wegw345werjktjwertkj';

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.error('Error during registration:', e);
    res.status(400).json(e);
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc || !bcrypt.compareSync(password, userDoc.password)) {
    return res.status(400).json('Invalid credentials');
  }

  jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
    if (err) throw err;
    res.cookie('token', token, { httpOnly: true }).json({ id: userDoc._id, username });
  });
});

// Profile
router.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) return res.status(401).json('Unauthorized');
    res.json(info);
  });
});

// Logout
router.post('/logout', (req, res) => {
  res.cookie('token', '').json('Logged out');
});

module.exports = router;
