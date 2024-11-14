const express = require('express');
const router = express.Router();

// Sample data for demo purposes
const sampleUsers = [
  {
    name: 'Alice Johnson',
    skills: ['JavaScript', 'Node.js', 'React'],
    bio: 'Full-stack developer interested in building scalable applications.',
    github: 'https://github.com/alicejohnson',
    linkedin: 'https://linkedin.com/in/alicejohnson',
    email: 'alice.johnson@example.com'
  },
  {
    name: 'Bob Smith',
    skills: ['Python', 'Data Science', 'Machine Learning'],
    bio: 'Data scientist passionate about AI and big data.',
    github: 'https://github.com/bobsmith',
    linkedin: 'https://linkedin.com/in/bobsmith',
    email: 'bob.smith@example.com'
  },
  {
    name: 'Charlie Williams',
    skills: ['Java', 'Spring Boot', 'Microservices'],
    bio: 'Backend engineer focusing on microservices architecture.',
    github: 'https://github.com/charliewilliams',
    linkedin: 'https://linkedin.com/in/charliewilliams',
    email: 'charlie.williams@example.com'
  },
  {
    name: 'Ravi Kumar',
    skills: ['JavaScript', 'Angular', 'Node.js'],
    bio: 'Frontend developer with a passion for creating interactive web applications.',
    github: 'https://github.com/ravikumar',
    linkedin: 'https://linkedin.com/in/ravikumar',
    email: 'ravi.kumar@example.com'
  },
  {
    name: 'Priya Sharma',
    skills: ['Python', 'Django', 'Data Analysis'],
    bio: 'Data analyst with experience in web development and data visualization.',
    github: 'https://github.com/priyasharma',
    linkedin: 'https://linkedin.com/in/priyasharma',
    email: 'priya.sharma@example.com'
  }
];

// Route to get all users
router.get('/users', (req, res) => {
  res.json(sampleUsers);
});

// Route to add a new user
router.post('/users', (req, res) => {
  const { name, skills, bio, github, linkedin, email } = req.body;
  const newUser = { name, skills, bio, github, linkedin, email };
  sampleUsers.push(newUser);
  res.status(201).json(newUser);
});

router.get('/add-user', (req, res) => {
  res.render('add-user');
});

// Search route
router.post('/search', (req, res) => {
  const { query } = req.body;

  // Simple keyword-based search (matches skills, name, and bio)
  const results = sampleUsers.filter(user => {
    const combinedFields = `${user.name} ${user.skills.join(' ')} ${user.bio}`;
    return combinedFields.toLowerCase().includes(query.toLowerCase());
  });

  // Return the search results
  res.json({ users: results });
});

module.exports = router;
