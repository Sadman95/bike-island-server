const { body, cookie, header } = require('express-validator');
const httpStatus = require('http-status');
const ApiError = require('../error/ApiError');
const { jwtHelper } = require('../helper');

// Sign up validation
const signUpValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('First name is required')
    .isString()
    .withMessage('First name should be string')
    .escape(),
  body('lastName')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Last name is required')
    .isString()
    .withMessage('Last name should be string')
    .escape(),
  body('email')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Provide a valid email')
    .escape(),
  body('password')
    .trim()
    .notEmpty()
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password should be string')
    .isLength({ min: 5 })
    .withMessage('Password should be at least 5 characters')
    .escape(),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .escape()
    .exists()
    .withMessage('Confirm password is required')
    .isString()
    .withMessage('Confirm password should be string')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Confirm password must match with password',
        );
      }
      return true;
    }),
];

// Login validation
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Provide a valid email')
    .escape(),
  body('password')
    .trim()
    .notEmpty()
    .escape()
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password should be string')
    .isLength({ min: 5 })
    .withMessage('Password should be at least 5 characters'),
  body('rememberMe').optional().isBoolean().trim().escape(),
];

// Refresh token validation
const refreshValidation = [
  cookie('refresh_token')
    .trim()
    .escape()
    .notEmpty()
    .exists()
    .withMessage('Refersh token is required')
    .isJWT()
    .withMessage('Invalid token!'),
];

// Google login validation
const googleLoginValidation = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Auth-code is required')
    .isString()
    .withMessage('Auth-code must be a string'),
  body('rememberMe').optional().isBoolean().trim().escape(),
];

// Get reset-password link validation
const resetPasswordLinkValidation = [
  body('email')
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage('Email is required')
    .escape()
    .isEmail()
    .withMessage('Provide a valid email'),
];


// Change password validation
const changePasswordValidation = [
  body('oldPassword')
    .trim()
    .notEmpty()
    .escape()
    .exists()
    .withMessage('Old password is required')
    .isString()
    .withMessage('Old password should be string')
    .isLength({ min: 5 })
    .withMessage('Old password should be at least 5 characters'),
  body('newPassword')
    .trim()
    .notEmpty()
    .escape()
    .exists()
    .withMessage('New password is required')
    .isString()
    .withMessage('New password should be string')
    .custom((value, { req }) => {
      if (value == req.body.oldPassword) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "New password mustn't match with old password",
        );
      }
      return true;
    }),
];

// Reset-password validation
const resetPasswordValidation = [
  body('token')
    .trim()
    .notEmpty()
    .exists()
    .withMessage('Token is required')
    .isString()
    .withMessage('Toekn should be string')
    .escape()
    .isHexadecimal()
    .withMessage('Token must be in hexadecimal format'),
  body('password')
    .trim()
    .notEmpty()
    .escape()
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password should be string')
    .isLength({ min: 5 })
    .withMessage('Password should be at least 5 characters'),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .escape()
    .exists()
    .withMessage('Confirm assword is required')
    .isString()
    .withMessage('Confirm password should be string')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Confirm password must match with password',
        );
      }
      return true;
    }),
];

// Token validation
const validateToken = [
  header('authorization')
    .exists({ checkFalsy: true })
    .withMessage('Missing Authorization Header')
    .bail()
    .contains('Bearer')
    .withMessage('Authorization Token is not Bearer')
    .bail()
    .custom((value, { req }) => {
      if (!value.startsWith('Bearer ')) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token format');
      }

      const token = value.split(' ')[1];

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access!');
      }

      let decodedToken = null;

      if (req.cookies['refresh_token']) {
        decodedToken = jwtHelper.verifyUserRefreshSecret(
          req.cookies['refresh_token'],
        );
      } else decodedToken = jwtHelper.verifyUserSecret(token);

      if (!decodedToken) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Token is invalidated!');
      }

      req.user = decodedToken;
      return true; // Return true if everything is fine
    }),
];

module.exports = {
  signUpValidation,
  loginValidation,
  refreshValidation,
  googleLoginValidation,
  resetPasswordLinkValidation,
  changePasswordValidation,
  validateToken,
  resetPasswordValidation,
};
