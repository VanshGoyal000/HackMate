const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  avatar: String,
  skills: [String],
  bio: String,
  github: String,
  linkedin: String
});

module.exports = mongoose.model('User', userSchema);
