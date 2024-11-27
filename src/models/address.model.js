const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  line1: {
    type: String,
    required: true
  },
  line2: {
    type: String,
    required: true
  },
  postal_code: {
    type: String,
    required: true
  },
  state: {
    type: String
  },

  createdAt: { type: Date, default: Date.now }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
