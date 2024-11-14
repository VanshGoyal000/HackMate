const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path if needed

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
};

// Route to display user profile
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Assuming req.user is populated
    if (!user) return res.status(404).send("User not found");
    res.render('profile', { user });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Route to update user profile
router.post('/update', ensureAuthenticated, async (req, res) => {
  const { name, bio, email } = req.body; // Adjust fields as needed

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");

    // Update user details
    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.email = email || user.email;

    await user.save();
    res.redirect('/profile'); // Redirect to profile page after update
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
