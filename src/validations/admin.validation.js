const { param, body } = require('express-validator');
const { STACKHOLDERS } = require('../constants');

// update role validation
const updateRoleValidation = [
  param('id')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Id must be string')
    .isMongoId()
    .withMessage('Id must be mongo db id'),

  body('role')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Role must be a string')
    .isIn(STACKHOLDERS)
    .withMessage('Invalid role')
];

module.exports = {
  updateRoleValidation
};
