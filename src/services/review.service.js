const { default: mongoose } = require('mongoose');
const Review = require('../models/review.model');
const Order = require('../models/order.model');
const { ORDER_STAT } = require('../enums');

/**
 * review service
 * @class
 */
class ReviewService {
  /**
   *
   * @typedef {Object} Options
   * @property {Record<string, any>} filterConditions
   * @property {Record<string, any>} sortConditions
   * @property {number} skip
   * @property {number} limit
   * @param {ObjectId} productId - product id
   * @param {Options} options
   */
  static getReviewsService = async (options) => {
    const { filterConditions, sortConditions, skip, limit } = options;

    const reviews = await Review.aggregate([
      {
        $match: {
          ...filterConditions
        }
      },
      { $sort: sortConditions },
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          product: 1,
          rating: 1,
          comment: 1,
          reviewImages: 1,
          createdAt: 1,
          likes: 1,
          user: {
            id: '$userInfo._id',
            firstName: '$userInfo.firstName',
            avatar: '$userInfo.avatar'
          }
        }
      }
    ]);

    return reviews;
  };

  /**
   *
   *
   */
  static async getAllReviews(filter = {}, options = {}, sort = {}, limit = 0) {
    return await Review.find(filter, options).sort(sort).limit(limit).lean();
  }

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
   * Fetch products from orders that the user has not reviewed yet.
   * @param {string} userId - User's ID
   * @returns {Promise<Array>} - Array of products pending review
   */
  static getPendingReviewsService = async (userId) => {
    const approvedOrders = await Order.find({
      user: userId,
      status: ORDER_STAT.APPROVED
    }).populate('items.product');

    const userReviews = await Review.find({ user: userId }).select('product');

    const reviewedProductIds = userReviews.map((review) =>
      review.product.toString()
    );

    const productsToReview = approvedOrders.flatMap((order) =>
      order.items
        .filter(
          (item) => !reviewedProductIds.includes(item.product._id.toString())
        )
        .map((item) => ({
          productId: item.product._id,
          productTitle: item.product.productTitle,
          productImg: item.product.productImg,
          purchaseDate: order.createdAt 
        }))
    );


    return productsToReview;
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

  /**
   * update review
   * @param {ObjectId} reviewId - review id
   */
  static updateReviewService = async (reviewId, payload) => {
    const update = { ...payload };
    if (payload.likes !== undefined) {
      update.$inc = { state: payload.likes };
    }

    const review = await Review.findByIdAndUpdate(reviewId, update, {
      new: true
    });
    return review;
  };
}

module.exports = ReviewService;
