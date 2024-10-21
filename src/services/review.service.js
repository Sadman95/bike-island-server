const Review = require('../models/review.model');

/**
 * review service
 * @class
 */
class ReviewService {
  /**
   *
   * @param {ObjectId} productId - product id
   */
  static getReviewsService = async (productId) => {
    const reviews = await Review.find({ product: productId }).populate({
      path: 'user',
      select: 'firstName avatar'
    });

    return reviews;
  };

  /**
   * create review or post review
   * @typedef {Object} Payload - review payload
   * @property {ObjectId} user - user id
   * @property {ObjectId} product - product id
   * @property {Number} rating - rating
   * @property {string} comment - post
   *
   * @param {Payload} payload
   */
  static createReviewService = async (payload) => {
    const review = new Review(payload);

    return await review.save();
  };

  /**
   * delete own review
   * @param {ObjectId} userId - user id
   * @param {ObjectId} reviewId - review id
   */
  static deleteOwnReviewService = async (userId, reviewId) => {
    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: userId
    });
    return review;
  };
}

module.exports = ReviewService;
