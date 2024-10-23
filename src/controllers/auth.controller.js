const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const {
  findUser,
  isMatchPassword,
  userUpdateService
} = require('../services/user.service');
const {
  userSignUpService,
  loginService,
  sendPasswordResetLink,
  googleLoginService,
  getEmailOtpService
} = require('../services/auth.service');
const {
  findPasswordResetToken,
  deletePasswordResetToke
} = require('../services/password-reset.service');
const { env, jwtoken, salt_round } = require('../config/env');
const ApiError = require('../error/ApiError');
const sendResponse = require('../utils/send-response');
const { ResponseStatus } = require('../enums');
const { encrypt } = require('../utils/encrypt-decrypt');
const { catchAsyncHandler, jwtHelper } = require('../helper');

class AuthController {
  /**
   * Sign-up Controller
   * @method POST
   * @path /signUp
   * @body {firstName: string, lastName: string, email: string, password: string, confirmPassword: string} - Request Body
   */
  static signUp = catchAsyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const existUser = await findUser({ email });

    if (existUser) {
      throw new ApiError(httpStatus.CONFLICT, 'User already exists');
    }

    const result = await userSignUpService({
      firstName,
      lastName,
      email,
      password
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Sign-up failed!');
    }

    const otp = await getEmailOtpService(result._id, result.email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      status: ResponseStatus.SUCCESS,
      message: 'User created successfully!',
      data: otp,
      links: {
        login: '/auth/verify'
      }
    });
  });

  /**
   * Login Controller
   * @method POST
   * @path /login
   * @body {email: string, password: string} - Request Body
   */
  static login = catchAsyncHandler(async function (req, res) {
    const isExistUser = await findUser({ email: req.body.email });

    if (!isExistUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const isMatchedPassword = await isMatchPassword(
      req.body.password,
      isExistUser.password
    );

    if (!isMatchedPassword) {
      throw new ApiError(httpStatus.CONFLICT, "Password doesn't match");
    }

    if (!isExistUser.isVerified)
      throw new ApiError(httpStatus.BAD_REQUEST, "User isn't verified!");

    const { email, _id, role } = isExistUser;

    const data = {
      email,
      id: _id,
      role
    };

    const { token, refresh_token } = await loginService(data);

    if (!token || !refresh_token)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Login failed!');

    const cookieOptions = {
      httpOnly: true,
      secure: env === 'production',
      maxAge: 1000 * 60 * 60 * 24 * parseInt(jwtoken.refresh_secret_exp)
    };

    if (req.body.rememberMe) {
      res.cookie('refresh_token', encrypt(refresh_token), cookieOptions);
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      data: {
        token
      },
      message: 'Login successful',
      links: {
        home: '/',
        dashboard: '/dashboard'
      }
    });
  });

  /**
   * Refresh Controller
   * @method POST
   * @path /refresh
   * @cookies {refresh_token: string} - Request by cookie
   */
  static refresh = catchAsyncHandler(async (req, res) => {
    const { refresh_token } = req.cookies;

    const verifiedToken = jwtHelper.verifyUserRefreshSecret(refresh_token);
    if (!verifiedToken) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
    }

    const { id } = verifiedToken;

    const isUserExist = await findUser({ _id: id });
    if (!isUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }

    const { email, _id, role } = isUserExist;

    const data = {
      email: email,
      id: _id,
      role
    };

    const newAccessToken = jwtHelper.token(data);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      message: 'Token updated successfully',
      data: {
        token: newAccessToken
      }
    });
  });

  /**
   * Google login Controller
   * @method POST
   * @path /auth/google
   * @body {code: string, rememberMe: bool} - Request Body
   */
  static googleLogin = catchAsyncHandler(async (req, res) => {
    const { code, rememberMe } = req.body;

    const { token, refresh_token } = await googleLoginService({ code });

    const cookieOptions = {
      httpOnly: true,
      secure: env === 'production',
      maxAge: 1000 * 60 * 60 * 24 * parseInt(jwtoken.refresh_secret_exp)
    };

    if (rememberMe) {
      res.cookie('refresh_token', encrypt(refresh_token), cookieOptions);
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      data: {
        token
      },
      message: 'Login successful',
      links: {
        home: '/',
        dashboard: '/dashboard'
      }
    });
  });

  /**
   * Logout Controller
   * @method POST
   * @path /logout
   */
  static logOut = catchAsyncHandler(async (req, res) => {
    const existUser = await findUser({ _id: req.user.id });

    if (!existUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    let accessToken = req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies.refresh_token;

    if (accessToken && req.headers.authorization) {
      accessToken = '';
      res.setHeader('authorization', `Bearer ${accessToken}`);
    }

    if (refreshToken) {
      res.clearCookie('refresh_token');
    }

    req.user = null;

    sendResponse(res, {
      success: true,
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      message: 'Logout successfully',
      links: {
        login: '/auth/login'
      }
    });
  });

  /**
   * Forgot password Controller
   * @method POST
   * @path /forgot-password
   * @body {email: string} - Request Body
   */
  static getForgotPasswordResetLink = catchAsyncHandler(async (req, res) => {
    const { email } = req.body;

    const existUser = await findUser({ email });

    if (!existUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const payload = {
      email,
      username: existUser.firstName,
      userId: existUser._id
    };

    const exist = await findPasswordResetToken({
      userId: existUser._id,
      expiresAt: { $gt: Date.now() }
    });

    if (exist) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'A password token is already in use. Check your email.'
      );
    }

    await sendPasswordResetLink(payload);

    sendResponse(res, {
      success: true,
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      message: 'Check your email to reset your password!'
    });
  });

  /**
   * Change password Controller
   * @method PATCH
   * @path /change-password
   * @body {oldPassword: string, newPassword: string} - Request Body
   */
  static changePassword = catchAsyncHandler(async (req, res) => {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;
    const user = await findUser({ _id: id });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
    }
    const isMatchedPassword = await isMatchPassword(oldPassword, user.password);
    if (!isMatchedPassword) {
      throw new ApiError(httpStatus.CONFLICT, "Old password doesn't match");
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      salt_round
    );

    await userUpdateService(id, {
      password: hashedPassword
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      message: 'Password changed successfully'
    });
  });

  /**
   * Reset password Controller
   * @method POST
   * @path /reset-password
   * @body {password: string, token: string, confirmPassword: string} - Request Body
   */
  static resetPassword = catchAsyncHandler(async (req, res) => {
    const { password, token } = req.body;

    const tokenData = await findPasswordResetToken({
      token
    });

    if (!tokenData || tokenData.expiresAt < Date.now()) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Token is invalid or has expired'
      );
    }

    const existUser = await findUser({ _id: tokenData.userId });

    if (!existUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(password, salt_round);

    const updatedUser = await userUpdateService(tokenData.userId, {
      password: hashedPassword
    });

    if (updatedUser) {
      await deletePasswordResetToke({ userId: updatedUser._id, token });
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      message: 'Password updated successfully',
      links: {
        login: '/auth/login'
      }
    });
  });
}

module.exports = AuthController;
