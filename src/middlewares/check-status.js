const httpStatus = require('http-status')
const { USER_STATUS } = require('../app/modules/user/user.enum')
const ApiError = require('../error/ApiError')

const checkStatus = async (req, _res, next) => {
  const { status } = req.user
  if (status == USER_STATUS.PENDING)
    throw new ApiError(
      httpStatus.NOT_ACCEPTABLE,
      'Please set-up your valid twilio informtion'
    )
  else if (status == USER_STATUS.DEACTIVE)
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Your account is deactivated! Kindly contact support.'
    )
  else next()
}

module.exports = checkStatus
