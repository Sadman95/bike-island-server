const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteOwnReview, getOwnReviews, getPendingReviews } = require('../controllers/review.controller');
const validateRequest = require('../middlewares/validate-request');
const { createReviewValidation, deleteOwnReviewValidation } = require('../validations/review.validation');
const { authenticate, authenticate_roles } = require('../middlewares/validate-user');
const upload = require('../middlewares/upload');
const { STACKHOLDER } = require('../enums');

/**
 * =============
 * Review routes
 * =============
 */


router

  .get('/', authenticate, authenticate_roles(STACKHOLDER.USER), getOwnReviews)
  .get(
    '/pending',
    authenticate,
    authenticate_roles(STACKHOLDER.USER),
    getPendingReviews
  )
  .get('/:productId', getReviews)
  .post(
    '/:productId',
    authenticate,
    upload.array('reviewImages', 5),
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
