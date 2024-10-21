const httpStatus = require('http-status')
const { decrypt, encrypt } = require('../utils/encrypt-decrypt')
const { sendResponse } = require('../utils/send-response');
const { ResponseStatus } = require('../../src/enums');
const { findUser, userUpdateService } = require('../services/user.service')
const { findOtp, deleteOtp } = require('../services/otp.service');
const DateTime = require('../core/DateTime')
const { getEmailOtpService } = require('../services/auth.service')
const {env} = require('../config/env')
const ApiError = require('../error/ApiError');
const { catchAsyncHandler } = require('../helper');

/**
 * OTP Controller
 * @class
 * */
class OtpController {
  /**
   * Get OTP Controller
   * @method POST
   * @path /get-otp
   * @body {email: string} - Request Body
   */
  static getOtp = catchAsyncHandler(async (req, res) => {
    const { id } = req.user
    const { email } = req.body
    const user = await findUser({ email })
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')

    const isOtpExist = await findOtp({userId: id})
    let userOtp = null

    if (isOtpExist) {
      userOtp = await findOtp({
        userId: id,
        expiresAt: { $gt: new Date() },
      })
    }

    if (userOtp) {
      const dateTime = new DateTime(userOtp.expiresAt)
      const diffTime = dateTime.formatDistanceStrict()
      throw new ApiError(
        httpStatus.NOT_ACCEPTABLE,
        `Please request for new OTP after ${diffTime}`
      )
    }
    const newOtp = await getEmailOtpService(id, email)
    newOtp &&
      res.cookie('hash_otp', newOtp.otp, {
        secure: env === 'production',
        httpOnly: true,
        expires: newOtp.expiresAt,
        sameSite: 'none',
        path: '/',
      })
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      message: 'OTP is sent to email',
      data: {
        otp: newOtp.otp,
        expiresAt: newOtp.expiresAt,
      },
    })
  })
  

  /**
   * Get own OTP Controller
   * @method GET
   * @path /own-otp
   */
  static ownOtp = catchAsyncHandler(async (req, res) => {
    const { id } = req.user
    if (!findUser({_id: id}))
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')

    const userOtp = await findOtp({
      userId: id,
      expiresAt: { $gt: Date.now() },
    })
    if (!userOtp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Please request for a new OTP')
    }

    const decryptedOtp = decrypt(userOtp.otp)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      data: {
        otp: decryptedOtp,
        expiresAt: userOtp.expiresAt,
      },
    })
  })
  

  /**
   * Get OTP Controller
   * @method POST
   * @path /verify-otp
   * @body {otp: string, hash_otp: string} - Request Body
   */
  static verifyOtp = catchAsyncHandler(async (req, res) => {
    const { otp } = req.body
    const { id } = req.user

    const isExist = await findUser({_id: id})
    if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')

    const isOtpExist = await findOtp({ otp: encrypt(otp), userId: isExist._id})

    if (!isOtpExist)
      throw new ApiError(httpStatus.NOT_FOUND, "OTP doesn't exist")

    if (new Date(Date.now()) > isOtpExist.expiresAt)
      throw new ApiError(httpStatus.EXPECTATION_FAILED, 'OTP is expired')

    const isMatchedOtp = otp === decrypt(isOtpExist.otp)
    if (!isMatchedOtp) throw new ApiError(httpStatus.CONFLICT, 'Invalid OTP')

    const updatedUser = await userUpdateService(id, {
      isVerified: true,
    })

    if (!updatedUser)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update user!')

    await deleteOtp({ _id: isOtpExist._id })

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      message: 'Verification successful',
      data: {
        isVerified: true,
      },
    })
  })
}

module.exports = OtpController
