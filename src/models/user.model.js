const mongoose = require('mongoose');
const { STACKHOLDERS } = require('../constants');
const { STACKHOLDER } = require('../enums');
const { server, salt_round } = require('../config/env');
const bcrypt = require("bcrypt")

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
  contactNo: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: `${server.baseURL}/images/avatar/demo-Male.png`
  },
  role: { type: String, enum: STACKHOLDERS, default: STACKHOLDER.USER }
});

// pre-save middleware to set avatar
userSchema.pre('save', async function (next) {
  try {
    if (!this.avatar) {
      this.avatar = `${server.baseURL}/images/avatar/demo-${this.gender}.png`
    }

    if (this.isModified('password')) {
      // Only hash if the password has been modified
      this.password = await bcrypt.hash(this.password, salt_round)
    }

    next()
  } catch (err) {
    next(err)
  }
})

const User = mongoose.model('User', userSchema);

module.exports = User;
