// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    code: String,
    expiresAt: Date,
  },
  profileComplete: {
    type: Boolean,
    default: false,
  },
  currentSetupStep: {
    type: Number,
    default: 1,
  },
  profile: {
    name: String,
    avatar: String,
    bio: String,
    linkedin: String,
    github: String,
    bestAchievement: String,
    projects: [{
      title: String,
      description: String,
      techStack: [String],
      link: String,
    }],
    skills: [String],
    interests: [String],
    lookingFor: [String],
    mindset: String,
    availability: {
      type: String,
      enum: ['Available', 'Busy', 'Open to opportunities'],
      default: 'Available',
    },
    preferredRoles: [String],
  },
  // For AI matching
  matchingScore: {
    type: Map,
    of: Number,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', userSchema);