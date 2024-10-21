const httpStatus = require('http-status');
const { Request, Response, NextFunction } = require('express');
const ApiError = require('../error/ApiError');
const { jwtHelper } = require('../helper');
const { findUser } = require('../services/user.service');

/**
 * Authenticate middleware
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access!');
    }

    const decodedToken = jwtHelper.verifyUserSecret(token);
    if (!decodedToken) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Token is invalidated!');
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate roles middleware
 * @param {...string} roles - List of allowed roles
 */
const authenticate_roles = (...roles) => {
  return async (req, res, next) => {
    try {
      // Ensure the user is authenticated first
      if (!req.user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access!');
      }

      // Check if the user role matches one of the allowed roles
      if (
        !roles
          .map((role) => role.toLowerCase())
          .includes(req.user.role.toLowerCase())
      ) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Access denied!');
      }

      next(); // Proceed if user has the required role
    } catch (error) {
      next(error);
    }
  };
};

/**
 * isVerified middleware
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const isVerified = (req, res, next) => {
  authenticate(
    (req,
    res,
    async () => {
      try {
        if (!req.user) {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access!');
        }

        const existUser = await findUser({ _id: req.user.id });

        if (!existUser || !existUser.isVerified) {
          throw new ApiError(
            httpStatus.NOT_ACCEPTABLE,
            'User is not verified!'
          );
        }
        next();
      } catch (error) {
        next(error);
      }
    })
  );
};

module.exports = {
  authenticate,
  authenticate_roles,
  isVerified
};
