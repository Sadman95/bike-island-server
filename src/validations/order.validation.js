const { body } = require('express-validator');
const { ORDER_STATUS } = require('../constants');
const { ORDER_STAT } = require('../enums');

const createOrderValidation = [
  // Validate user ID
  body('user')
    .exists({ checkFalsy: true })
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid User ID'),

  // Validate items array
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items should be an array with at least one item'),

  // Validate each item object in the items array
  body('items.*.product')
    .exists({ checkFalsy: true })
    .withMessage('Product ID is required for each item')
    .isMongoId()
    .withMessage('Invalid Product ID'),

  body('items.*.quantity')
    .exists({ checkFalsy: true })
    .withMessage('Quantity is required for each item')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),

  body('items.*.price')
    .exists({ checkFalsy: true })
    .withMessage('Price is required for each item')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),

  // Validate total amount
  body('totalAmount')
    .isFloat({ gt: 0 })
    .withMessage('Total amount must be a positive number'),

  // Validate order status
  body('status')
    .isIn(ORDER_STATUS)
    .default(ORDER_STAT.PENDING)
    .withMessage('Invalid order status')
];

module.exports = {
  createOrderValidation
};
