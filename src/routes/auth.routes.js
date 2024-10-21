const router = require('express').Router()
const {
  signUpValidation,
  loginValidation,
  refreshValidation,
  googleLoginValidation,
  resetPasswordLinkValidation,
  validateToken,
  resetPasswordValidation,
} = require('../validations/auth.validation')
const {
  getOtpValidation,
  verifyOtpValidation,
} = require('../validations/otp.validation')
const authController = require('../controllers/auth.controller')
const { getOtp, ownOtp, verifyOtp } = require('../controllers/otp.controller')
const validateRequest = require('../middlewares/validate-request')


/**
 * ===========
 * Auth routes
 * ===========
 */


router
  .post('/signup', validateRequest(signUpValidation), authController.signUp)
  .post('/login', validateRequest(loginValidation), authController.login)
  .post('/refresh', validateRequest(refreshValidation), authController.refresh)
  .post(
    '/google',
    validateRequest(googleLoginValidation),
    authController.googleLogin
  )
  .post(
    '/get-otp',
    validateRequest(validateToken),
    validateRequest(getOtpValidation),
    getOtp
  )
  .get('/own-otp', validateRequest(validateToken), ownOtp)
  .post(
    '/verify-otp',
    validateRequest(validateToken),
    validateRequest(verifyOtpValidation),
    verifyOtp
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

module.exports = router
