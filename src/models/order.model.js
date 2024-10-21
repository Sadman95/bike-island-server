const mongoose = require('mongoose');
const { ORDER_STATUS } = require('../constants');
const { ORDER_STAT } = require('../enums');

/**
 * Order schema definition for MongoDB using Mongoose.
 * @typedef {Object} Order
 * @property {string} user - Reference to user
 * @property {string} totalAmount - Total amount of a order
 * @property {number} status - Order status
 */
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cycle',
        required: true
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ORDER_STATUS,
    default: ORDER_STAT.PENDING
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
