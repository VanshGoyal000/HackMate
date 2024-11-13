// app.js
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/authRoute');
const profileRoutes = require('./routes/profileRoute');
const hackathonRoutes = require('./routes/hackathonRoute');
const dotenv = require('dotenv');
const { connectDb } = require('./config/db');

dotenv.config();
require('./config/passport-setup');  // Google OAuth setup

const app = express();
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'some secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
connectDb();
// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/hackathons', hackathonRoutes);

app.get('/', (req, res) => res.render('index.ejs'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
