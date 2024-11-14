// routes/authRoute.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config()

const User = require('../models/User.js');
const transporter = require('../config/nodemailer');

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Middleware for protected routes
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send("Token required for access");

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("Invalid or expired token");
  }
};

router.get('/register' , async (req , res)=> {
  res.render('register');
})
router.get('/login' , async (req , res)=> {
  res.render('login');
})
router.get('/verify-otp' , async (req , res)=> {
  res.render('verify-otp');
})


// Route to Register User and Send OTP with validation
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).send("User already exists.");

      const otpCode = generateOTP();
      const otpExpiry = Date.now() + 10 * 60 * 1000;

      user = new User({
        email,
        password,
        otp: { code: otpCode, expiresAt: otpExpiry },
      });

      await user.save();

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otpCode}. It will expire in 10 minutes.`,
      });

      res.status(200).send('OTP sent to your email');
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

// Route to Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    const isOtpValid = user.otp.code === otp && user.otp.expiresAt > Date.now();
    if (!isOtpValid) return res.status(400).send("Invalid or expired OTP");

    user.isVerified = true;
    user.otp = {};
    await user.save();

    res.status(200).send("Account verified successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Route to Login with JWT
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').not().isEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send("User not found");
      if (!user.isVerified) return res.status(403).send("Please verify your email");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).send("Invalid credentials");

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

// Protected route example
router.get('/protected', verifyToken, (req, res) => {
  res.send(`Hello, ${req.user.email}. This is a protected route.`);
});

module.exports = router;
