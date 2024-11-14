const mongoose = require('mongoose');

// Define Mate Schema
const MateSchema = new mongoose.Schema({
  name: String,
  github: String,
  email: String,
  skills: [String],
  shortAchievement: String,
  bio: String,
  linkedin: String,
});

// Export Mate model
module.exports = mongoose.model('Mate', MateSchema);
