const { body, param } = require('express-validator');

const createReviewValidation = [
  param('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid Product ID'),
  // Validate user ID
  body('user')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid User ID'),

  // Validate rating
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  // Validate comment
  body('comment')
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters long')
];


const deleteOwnReviewValidation = [
  // Validate review ID
  param('id')
    .notEmpty()
    .withMessage('Review ID is required')
    .isMongoId()
    .withMessage('Invalid review ID'),
];

module.exports = {
  createReviewValidation,
  deleteOwnReviewValidation
};
