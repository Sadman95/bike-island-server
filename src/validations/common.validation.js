const { param, body } = require('express-validator');

// id parama validation
const idParamValidation = [
  param('id')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Id must be string')
    .isMongoId()
    .withMessage('Id must be mongo db id')
];

const bulkItemsIdValidation = [
  body('ids')
    .isArray()
    .withMessage('Must be array of unique ids')
    .bail()
    .isArray({ min: 1 })
    .withMessage('Must contain at least one item')
];

module.exports = {
  idParamValidation,
  bulkItemsIdValidation
};
