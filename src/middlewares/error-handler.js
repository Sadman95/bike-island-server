// error.js (middlewares)
const httpStatus = require('http-status');
const fs = require('node:fs');
const { ResponseStatus } = require('../enums');
const handleValidation = require('../error/handle-validation');
const handleCastError = require('../error/handle-cast-error');
const ApiError = require('../error/ApiError');
const { logger } = require('../utils/logger');
const sendResponse = require('../utils/send-response');
const { env } = require('../config/env');

const notFoundErrorHandler = (req, res, next) => {
  const error = new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  next(error);
};

const globalErrorHandler = (error, req, res, next) => {
  if (!error) next();
  if (req.file) {
    const filePath = `public/images/avatar/${req.file.filename}`;
    fs.existsSync(filePath) &&
      fs.unlink(filePath, (error) => {
        if (error) {
          throw new ApiError(httpStatus.BAD_REQUEST, "File isn't deleted");
        }
      });
  }

  if (req.files) {
    const files = {
      data: req.files,
      [Symbol.iterator]: function () {
        let index = 0;
        const data = this.data;
        return {
          next: function () {
            return index < data.length
              ? { value: data[index++], done: false }
              : { done: true };
          }
        };
      }
    };

    for (const file of files) {
      file && fs.unlinkSync(file.path);
    }
  }

  let simplifiedError;
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error!';
  /**
   * @typedef {Object} GenericErrorMessage
   * @property {string} path
   * @property {string} message
   */
  /** @type {GenericErrorMessage[]} */
  let errorMessages = [];

  error.statusCode = error.statusCode ?? statusCode;
  error.errorMessages = error.errorMessages ?? [];
  error.message = error.message ?? message;

  if (error.name == 'ValidationError') {
    simplifiedError = handleValidation(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error.name === 'CastError') {
    simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = error.message
      ? [
          {
            path: '',
            message: error?.message
          }
        ]
      : [];
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = error.message
      ? [
          {
            path: '',
            message: error.message
          }
        ]
      : [];
  } else {
    simplifiedError.statusCode = statusCode;
    simplifiedError.message = message;
  }

  const responseBody = {
    correlationId: req.headers['x-correlation-id'],
    success: false,
    statusCode,
    message,
    errorMessages,
    status: ResponseStatus.FAILED,
    stack: env === 'development' ? error.stack : {}
  };

  sendResponse(res, responseBody);

  logger.error(JSON.stringify(responseBody));
};

module.exports = {
  notFoundErrorHandler,
  globalErrorHandler
};
