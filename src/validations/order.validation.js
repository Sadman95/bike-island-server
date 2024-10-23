const { body } = require('express-validator');
const { ORDER_STATUS } = require('../constants');
const { ORDER_STAT } = require('../enums');

const createOrderValidation = [
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
    .withMessage('Invalid order status'),

  // Validate address JSON object
  body('address').isObject().withMessage('Address must be a JSON object'),

  // Validate fields in address object
  body('address.street').notEmpty().withMessage('Street is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').optional(), // State is optional
  body('address.postalCode').notEmpty().withMessage('Postal Code is required'),
  body('address.country').notEmpty().withMessage('Country is required')
];

module.exports = {
  createOrderValidation
};
