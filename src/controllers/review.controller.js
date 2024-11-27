const httpStatus = require('http-status');
const ApiError = require('../error/ApiError');
const { catchAsyncHandler, queryHelper, pick } = require('../helper');
const {
  getReviewsService,
  createReviewService,
  deleteOwnReviewService,
  getAllReviews,
  getPendingReviewsService
} = require('../services/review.service');
const sendResponse = require('../utils/send-response');
const { ResponseStatus, ORDER_STAT } = require('../enums');
const { PAGINATION, REVIEW_FILTERABLE_FILEDS, REVIEW_SEARCHABLE_FILEDS } = require('../constants');
const { findOrderService } = require('../services/order.service');
const { default: mongoose } = require('mongoose');

/**
 * review controller
 * @class
 */
class ReviewsController {
  /**
   * Get all reviews
   */
  static getReviews = catchAsyncHandler(async (req, res) => {
    const { productId } = req.params;

    const filterableOptions = pick(req.query, REVIEW_FILTERABLE_FILEDS);
    const paginationOptions = pick(req.query, PAGINATION);
    const { url, query, path } = req;
    const totalReviews = await getAllReviews({ product: productId });

    const options = {
      filterableOptions: {
        ...filterableOptions,
        product: new mongoose.Types.ObjectId(productId)
      },
      paginationOptions,
      url,
      query,
      path,
      total: totalReviews.length
    };
    const { pagination, links, ...restOptions } = queryHelper(options);

    const reviews = await getReviewsService(restOptions);
    if (!reviews.length)
      throw new ApiError(httpStatus.NOT_FOUND, 'Reviews not found!');
    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      success: true,
      data: reviews
    });
  });

  /**
   * Get own reviews
   */
  static getOwnReviews = catchAsyncHandler(async (req, res) => {
    req.query.user = new mongoose.Types.ObjectId(req.user.id);
    const filterableOptions = pick(req.query, REVIEW_FILTERABLE_FILEDS);
    const paginationOptions = pick(req.query, PAGINATION);
    const { url, query, path } = req;
    const totalReviews = await getAllReviews({
      user: new mongoose.Types.ObjectId(req.user.id)
    });

    const options = {
      filterableOptions,
      paginationOptions,
      url,
      query,
      path,
      total: totalReviews.length
    };
    const { pagination, links, ...restOptions } = queryHelper(options);

    const reviews = await getReviewsService(restOptions);
    if (!reviews.length)
      throw new ApiError(httpStatus.NOT_FOUND, 'Reviews not found!');
    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      success: true,
      data: reviews
    });
  });

  /**
   * Get products that have been ordered but not reviewed by the user.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static getPendingReviews = catchAsyncHandler(async (req, res) => {
    const pendingReviews = await getPendingReviewsService(req.user.id);
    if(pendingReviews.length == 0) throw new ApiError(
      httpStatus.NOT_FOUND,
      'You don’t have any purchases to review'
    );
    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      data: pendingReviews,
      success: true,
    });
  });

  /**
   * Create a new review
   */
  static createReview = catchAsyncHandler(async (req, res) => {
    const { productId } = req.params;
    const verifiedPurchase = await findOrderService({
      user: req.user.id,
      status: ORDER_STAT.APPROVED,
      items: {
        $elemMatch: {
          product: productId
        }
      }
    });

    if (!verifiedPurchase)
      throw new ApiError(httpStatus.NOT_FOUND, 'No purchase found to review!');

    if (req.files.length) {
      req.body.reviewImages = req.files.map(
        (file) => file.fieldname + '/' + file.filename
      );
    }

    const review = await createReviewService({
      ...req.body,
      user: req.user.id,
      product: productId
    });
    if (!review)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to add review!');
    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Review added!'
    });
  });

  /**
   * delete a own review
   */
  static deleteOwnReview = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const review = await deleteOwnReviewService(req.user.id, id);
    if (!review)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete review!');
    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review deleted!'
    });
  });
}

module.exports = ReviewsController;
