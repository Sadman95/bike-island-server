const { body, param, query } = require("express-validator");

// create cycle validation
const createCycleValidation = [
  body('productTitle')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Product title is required')
    .isString()
    .withMessage('Product title should be string')
    .escape(),
  body('productDesc')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Product description is required')
    .isString()
    .withMessage('Product description should be string')
    .escape(),
  body('productPrice')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Product price is required')
    .isNumeric()
    .withMessage('Product price should be number'),
  body('brand')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Product brand is required')
    .isString()
    .withMessage('Product brand should be string')
    .escape(),
  body('type')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Product type is required')
    .isString()
    .withMessage('Product type should be string')
    .escape()
];

// update cycle validation
const updateCycleValidation = [
  param('id')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Id must be string')
    .isMongoId()
    .withMessage('Id must be mongo db id'),
  body('productTitle')
    .optional()
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Product title is required')
    .isString()
    .withMessage('Product title should be string')
    .escape(),
  body('productDesc')
    .optional()
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Product description is required')
    .isString()
    .withMessage('Product description should be string')
    .escape(),
  body('productImg')
    .optional()
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Product image is required')
    .isString()
    .withMessage('Product image should be string'),
  body('productPrice')
    .optional()
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Product price is required')
    .isNumeric()
    .withMessage('Product price should be number'),
  body('brand')
    .optional()
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Product brand is required')
    .isString()
    .withMessage('Product brand should be string')
    .escape(),
  body('type')
    .optional()
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Product type is required')
    .isString()
    .withMessage('Product type should be string')
    .escape()
];


// get cycles validation
const getCyclesValidation = [
  query('searchTerm')
    .optional()
    .isString()
    .withMessage('Search term must be a string'),

  query('type')
    .optional()
    .isString()
    .withMessage('Type must be a string'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number')
    .custom((value, { req }) => {
      if (
        req.query.minPrice &&
        parseFloat(value) < parseFloat(req.query.minPrice)
      ) {
        throw new Error(
          'Maximum price must be greater than or equal to minimum price'
        );
      }
      return true;
    }),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limit must be a positive integer')
    .toInt()
];



module.exports = {
  createCycleValidation,
  updateCycleValidation,
  getCyclesValidation
};