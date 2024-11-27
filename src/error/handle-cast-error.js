const httpStatus = require('http-status')

/**
 * @summary Cast error handler
 * @param {mongoose.Error.CastError} err
 *
 * @typedef {Object} GenericErrorMessage
 * @property {string} path
 * @property {string} message
 *
 * @typedef {Object} ErrorResponse
 * @property {number} statusCode
 * @property {string} message
 * @property {GenericErrorMessage[]} errorMessages
 *
 * @returns {ErrorResponse}
 */
const handleCastError = err => {
  const errors = [
    {
      path: err.path,
      message: 'Invalid Id',
    },
  ]
  const statusCode = httpStatus.BAD_REQUEST

  return {
    statusCode,
    message: 'Cast error',
    errorMessages: errors,
  }
}

module.exports = handleCastError
