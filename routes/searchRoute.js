const express = require('express');
const router = express.Router();
const AIMatcher = require('../utils/aiMatcher');
const User = require('../models/User');

router.get('/search', async (req, res) => {
    res.render('search', { results: null });
});

router.post('/search', async (req, res) => {
    try {
        const { query } = req.body;
        const allUsers = await User.find({ 
            profileComplete: true,
            _id: { $ne: req.user._id } // Exclude current user
        });

        const matches = AIMatcher.findMatches(query, allUsers);
        res.render('search', { results: matches });
    } catch (error) {
        res.render('search', { 
            results: null, 
            error: 'Search failed. Please try again.' 
        });
    }
});

module.exports = router;
