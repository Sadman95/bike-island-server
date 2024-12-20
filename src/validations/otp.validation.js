const { body } = require('express-validator')


const getOwnOtpValidation = [
  
  body('uid')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid ID')
]

const getOtpValidation = [
  
  body('email')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Provide a valid email')
    .escape(),
]

const verifyOtpValidation = [
  body('otp')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('OTP is required')
    .escape()
    .isString()
    .withMessage('OTP must be a string')
    .isLength(6)
    .withMessage('Must be a 6 digit OTP')
    .matches(/^[0-9]{1,6}$/)
    .withMessage('Must be a 6 digit OTP'),

  body('email')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Provide a valid email')
    .escape()
];

module.exports = {
  verifyOtpValidation,
  getOtpValidation,
  getOwnOtpValidation
};
