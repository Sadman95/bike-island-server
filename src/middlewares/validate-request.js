const { matchedData } = require('express-validator');
const httpStatus = require('http-status');
const fs = require("fs");
const path = require("path")
const { logger } = require('../utils/logger');

const validateRequest = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        const error = new Error();
        error.statusCode = httpStatus.BAD_REQUEST;
        error.name = 'ValidationError';
        error.message = 'Something went wrong! Try again later.';
        error.errorMessages = result.array().map(e => ({...e, message: e.msg}));
        if (req.file) {
          const filePath = path.join(
            __dirname,
            '..',
            '..',
            'public',
            req.file.fieldname,
            req.file.filename
          );
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              logger.log('Error while deleting the file:', unlinkErr);
            }
          });
        }
        next(error);
      }
    }

    const bearerToken = matchedData(req).authorization;

    if (bearerToken) {
      req.headers['authorization'] = bearerToken;
      return next();
    }


    next();
  };
};

module.exports = validateRequest;
