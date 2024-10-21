const crypto = require('crypto');
const axios = require('axios');
const qs = require('qs');
const httpStatus = require('http-status');
const { mail_config, google, client_url } = require('../config/env');
const generateOTP = require('../utils/generate-otp');
const generateOTPTemplate = require('../utils/generate-otp-template');
const User = require('../models/user.model');
const OTP = require('../models/otp.model');
const generateEmailTransporter = require('../utils/generate-email-transporter');
const { jwtHelper } = require('../helper');
const template = require('../utils/template');
const PasswordReset = require('../models/password-reset.model');
const { findUser } = require('./user.service');
const ApiError = require('../error/ApiError');

/**
 * @class
 */
class AuthService {
  /**
 * @summary User Sign-up service
 * @typedef {Object} Payload
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} password
 * @param {Payload} payload
 *
 * @returns {Promise<Document>}
 * */
static async userSignUpService (payload) {
  const newUser = new User({
    ...payload,
  });

  const savedUser = await newUser.save();

  return savedUser;
};

/**
 * @summary User Sign-in service
 * @typedef {Object} Payload
 * @property {string} email
 * @property {string} id
 * @param {Payload} payload
 *
 * @typedef {Object} Result
 * @property {string} token
 * @property {string} refresh_token
 *
 * @return {Result}
 */
static async loginService (payload) {
  const token = jwtHelper.token(payload);
  const refresh_token = jwtHelper.refresh_token(payload);

  return {
    token,
    refresh_token,
  };
};

/**
 * @summary User Sign-in with google
 * @typedef {Object} Payload
 * @property {string} code
 * @param {Payload} payload
 *
 * @typedef {Object} Result
 * @property {string} token
 *
 * @return {Result}
 */
static async googleLoginService (payload) {
  const { code } = payload;
  // Request for access token
  const response = await axios.post(
    'https://oauth2.googleapis.com/token',
    qs.stringify({
      code,
      client_id: google.client_id,
      client_secret: google.client_secret,
      redirect_uri: client_url,
      grant_type: 'authorization_code',
    }),
  );

  const { access_token } = response.data;
  // Get user info using the access token
  const userInfoResponse = await axios.get(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  const existUser = await findUser({ email: userInfoResponse.data.email });

  if (!existUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'No user found. Please try again after registration',
    );
  }

  const tokenData = {
    id: existUser._id,
    email: existUser.email,
    role: existUser.role,
  };

  const token = jwtHelper.token(tokenData);
  const refresh_token = jwtHelper.refresh_token(tokenData);

  return {
    token,
    refresh_token,
  };
};

/** get email otp service
 * @param {string} userId - Logged in user id
 * @param {string} email - Logged in user email
 * */
static async getEmailOtpService (userId, email) {
  const { otp, encryptedOtp } = generateOTP();
  //mail options
  const mailOptions = {
    from: mail_config.user,
    to: email,
    subject: 'Verify your email',
    html: generateOTPTemplate(otp),
  };

  const newOtpVerification = new OTP({
    userId,
    otp: encryptedOtp,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600000,
  });

  const transport = generateEmailTransporter(
    mail_config.user,
    mail_config.password,
  );
  let savedOtp = null;
  await transport.sendMail(mailOptions).then(async () => {
    savedOtp = await newOtpVerification.save();
  });

  return savedOtp;
};

/** send password reset link
 * @typedef {Object} Payload
 * @property {string} email - user email
 * @property {string} username - user name
 * @property {string} userId - user Id
 * @param {Payload} payload
 * */
static async sendPasswordResetLink (payload) {
  const { email, username, userId } = payload;

  const token = crypto.randomBytes(32).toString('hex');

  //mail options
  const mailOptions = {
    from: mail_config.user,
    to: email,
    subject: 'Reset your password',
    html: template(`
      <h1>Hi ${username},</h1>
                        <p>You recently requested to reset your password. Use the button below to reset it. <strong>This password reset is only valid for the next 24 hours.</strong></p>
                        <!-- Action -->
                        <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td align="center">
                              <!-- Border based button
           https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
                              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                  <td align="center">
                                    <a href="${client_url}/auth/reset-password?token=${token}"  class="f-fallback button button--green" target="_blank">Reset your password</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        
      `),
  };

  const transport = generateEmailTransporter(
    mail_config.user,
    mail_config.password
  );

  const newPasswordResetData = new PasswordReset({
    userId,
    token,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 3600000,
  });

  let savedPasswordReset = null;

  await transport.sendMail(mailOptions).then(async () => {
    savedPasswordReset = await newPasswordResetData.save();
  });

  return savedPasswordReset;
};


}

module.exports = AuthService;
