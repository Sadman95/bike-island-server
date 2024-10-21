const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteOwnReview } = require('../controllers/review.controller');
const validateRequest = require('../middlewares/validate-request');
const { createReviewValidation, deleteOwnReviewValidation } = require('../validations/review.validation');
const { authenticate } = require('../middlewares/validate-user');

/**
 * =============
 * Review routes
 * =============
 */


router
  .get('/', getReviews)
  .post(
    '/:productId',
    authenticate,
    validateRequest(createReviewValidation),
    createReview
  )
  .delete(
    '/:id',
    authenticate,
    validateRequest(deleteOwnReviewValidation),
    deleteOwnReview
  );

module.exports = router;
