const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/auth/login');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('token');
    res.redirect('/auth/login');
  }
};

router.get('/register', (req , res)=>{
  res.render('register');
} )
router.get('/login', (req , res)=>{
  res.render('login');
} )


// Registration route
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register', { error: 'Invalid input. Email must be valid and password at least 6 characters.' });
    }

    const { email, password } = req.body;
    let user = await User.findOne({ email });
    
    if (user) {
      return res.render('register', { error: 'User already exists' });
    }

    user = new User({ email, password, isVerified: true });
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect('/profile/setup/1');
  } catch (error) {
    console.error(error);
    res.render('register', { error: 'Registration failed. Please try again.' });
  }
});

// Login route
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.render('login', { error: 'Invalid credentials' });
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.render('login', { error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  
      res.redirect(user.profileComplete ? '/dashboard' : `/profile/setup/${user.currentSetupStep}`);
    } catch (error) {
      console.error(error);
      res.render('login', { error: 'Login failed. Please try again.' });
    }
  });
  

// Logout route
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
