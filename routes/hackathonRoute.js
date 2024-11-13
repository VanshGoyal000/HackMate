const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('hackathons', { user: req.user }));

router.post('/new', (req, res) => {
  const { name, description, contact } = req.body;
  // Save hackathon post to database (sample placeholder)
  res.redirect('/hackathons');
});

module.exports = router;
