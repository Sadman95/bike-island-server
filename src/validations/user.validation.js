const { server } = require("../config/env");
const {param, body} = require("express-validator")

// update user validation
const updateUserValidation = [
  param('id')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Id must be string')
    .isMongoId()
    .withMessage('Id must be mongo db id'),
    
  body('firstName')
    .optional()
    .isString()
    .withMessage('First name must be a string')
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long'),

  body('lastName')
    .optional()
    .isString()
    .withMessage('Last name must be a string')
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters long'),


  body('contactNo')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid contact number'),

  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
    .default(`${server.baseURL}/images/avatar/demo-Male.png`)
];

module.exports = {
    updateUserValidation
}

