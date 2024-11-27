const router = require('express').Router();
const {
  signUpValidation,
  loginValidation,
  refreshValidation,
  googleLoginValidation,
  resetPasswordLinkValidation,
  validateToken,
  resetPasswordValidation,
  changePasswordValidation
} = require('../validations/auth.validation');
const {
  getOtpValidation,
  verifyOtpValidation,
  getOwnOtpValidation
} = require('../validations/otp.validation');
const authController = require('../controllers/auth.controller');
const otpController = require('../controllers/otp.controller');
const validateRequest = require('../middlewares/validate-request');
const tokenDecriptor = require('../middlewares/token-decriptor');

/**
 * ===========
 * Auth routes
 * ===========
 */

router
  .post('/signup', validateRequest(signUpValidation), authController.signUp)
  .post('/login', validateRequest(loginValidation), authController.login)
  .post(
    '/refresh',
    tokenDecriptor,
    validateRequest(refreshValidation),
    authController.refresh
  )
  .post(
    '/google',
    validateRequest(googleLoginValidation),
    authController.googleLogin
  )
  .post('/get-otp', validateRequest(getOtpValidation), otpController.getOtp)
  .post('/own-otp', validateRequest(getOwnOtpValidation), otpController.ownOtp)
  .post(
    '/verify-otp',
    validateRequest(verifyOtpValidation),
    otpController.verifyOtp
  )
  .patch(
    '/change-password',
    validateRequest(validateToken),
    validateRequest(changePasswordValidation),
    authController.changePassword
  )
  .post('/logout', validateRequest(validateToken), authController.logOut)
  .post(
    '/forgot-password',
    validateRequest(resetPasswordLinkValidation),
    authController.getForgotPasswordResetLink
  )
  .post(
    '/reset-password',
    validateRequest(resetPasswordValidation),
    authController.resetPassword
  );

module.exports = router;
