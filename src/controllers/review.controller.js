const httpStatus = require('http-status');
const ApiError = require('../error/ApiError');
const { catchAsyncHandler } = require('../helper');
const { getReviewsService, createReviewService, deleteOwnReviewService } = require('../services/review.service');
const sendResponse = require('../utils/send-response');
const { ResponseStatus } = require('../enums');

/**
 * review controller
 * @class
 */
class ReviewsController {
  /**
   * Get all reviews
   */
  static getReviews = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const reviews = await getReviewsService(id);
    if (!reviews.length) throw new ApiError(httpStatus.NOT_FOUND, "Reviews not found!")
    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      success: true,
      data: reviews
    })
  });

  /**
   * Create a new review
   */
  static createReview = catchAsyncHandler(async (req, res) => {
    const {productId} = req.params
    const review = await createReviewService({
      ...req.body,
      product: productId
    });
    if (!review) throw new ApiError(httpStatus.BAD_REQUEST, "Failed to add review!")
    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Review added!'
    })
  })

  /**
   * delete a own review
   */
  static deleteOwnReview = catchAsyncHandler(async (req, res) => {
    const {id} = req.params
    const review = await deleteOwnReviewService(req.user.id, id)
    if (!review) throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete review!")
    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review deleted!'
    })
  })
}

module.exports = ReviewsController;
