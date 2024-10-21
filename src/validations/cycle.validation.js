const { body, param } = require("express-validator");

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


module.exports = {
  createCycleValidation,
  updateCycleValidation,
};