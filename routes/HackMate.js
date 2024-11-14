const express = require('express');
const router = express.Router();
const Mate = require('../models/Mate');  // Import Mate model

// Landing page search
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    const mates = await Mate.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { skills: { $regex: query, $options: 'i' } },
        { shortAchievement: { $regex: query, $options: 'i' } },
      ],
    }).limit(5);
    res.render('index', { mates });
  } catch (error) {
    res.status(500).send('Search failed');
  }
});

// Form for adding a new mate
router.get('/add-form', (req, res) => {
  res.render('addMate');
});

// Handle form submission
router.post('/add', async (req, res) => {
  try {
    const { name, github, email, skills, shortAchievement, bio, linkedin } = req.body;
    const newMate = new Mate({
      name,
      github,
      email,
      skills: skills.split(',').map(skill => skill.trim()),
      shortAchievement,
      bio,
      linkedin,
    });
    await newMate.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Failed to add mate');
  }
});

module.exports = router;
