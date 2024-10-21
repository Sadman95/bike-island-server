const mongoose = require('mongoose');

/**
 * Cycle schema definition for MongoDB using Mongoose.
 * @typedef {Object} Cycle
 * @property {string} name - The name of the cycle
 * @property {string} type - The type of the cycle (e.g., mountain, hybrid)
 * @property {number} price - The price of the cycle
 */
const cycleSchema = new mongoose.Schema({
  productTitle: { type: String, required: true },
  productDesc: { type: String },
  brand: { type: String, required: true },
  // brand: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Brand',
  //   required: true
  // },
  type: { type: String, required: true },
  productImg: { type: String, required: true },
  productPrice: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CycleModel = mongoose.model('Cycle', cycleSchema);

module.exports = CycleModel;
