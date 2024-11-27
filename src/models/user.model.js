const mongoose = require('mongoose');
const { STACKHOLDER } = require('../enums');
const { salt_round } = require('../config/env');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isTeamMember: {
    type: Boolean,
    default: false
  },
  contactNo: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: `avatar/dummy-avatar.png`
  },
  role: { type: String, default: STACKHOLDER.USER },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// pre-save middleware to set avatar
userSchema.pre('save', async function (next) {
  try {
    if (!this.avatar) {
      this.avatar = `avatar/dummy-avatar.png`;
    }

    if (this.isModified('password')) {
      // Only hash if the password has been modified
      this.password = await bcrypt.hash(this.password, salt_round);
    }

    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
