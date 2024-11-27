const mongoose = require('mongoose');

/**
 * Review schema definition for MongoDB using Mongoose.
 * @typedef {Object} Review
 * @property {string} product - The reference to the product or cycle
 * @property {string} user - The reference to the user
 * @property {number} rating - The rating between 1 to 5
 * @property {string} comment - The comment of a review
 * @property {Date} createdAt - Review post time
 */
const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cycle',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  likes: {
    type: Number,
    required: true,
    default: 0
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500
  },
  reviewImages: {
    type: [String],
    max: 5
  },

}, {
  timestamps: true
});

// Add indexes for performance
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
