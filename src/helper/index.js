const cors = require('cors');
const fs = require("fs")
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const bodyParser = require("body-parser")
const { auth } = require('express-openid-connect');
const { auth0, jwtoken } = require('../config/env');
const jwt = require("jsonwebtoken");
const generateQueryString = require('../utils/generate-querystring');
const path = require("path");
const { logger } = require('../utils/logger');


/**
 * @class
 */
class Helper {
  /**
   * @summary Apply middleware helper
   * @param {import('express').Application} app
   */
  static applyMiddleware(app) {
    app.use(cors());
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());
    }

  /**
 * catch async handler
 * @param {RequestHandler} fn
 * */
static catchAsyncHandler (fn) {

  return async (
    req,
    res,
    next
  )=> {
    try {
      await fn(req, res)
    } catch (error) {
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
      next(error)
    }
  }
}

    /**
     * 
     * @returns {import('express').RequestHandler}
     */
    static jwtOAuth() {
        const jwtCheck = auth({
          issuerBaseURL: auth0.issuerBaseURL,
          baseURL: auth0.baseURL,
          clientID: auth0.clientID,
          secret: auth0.secret,
          authRequired: false,
          auth0Logout: true
        });

        return jwtCheck;
  }


  /**
 * Picks specified keys from an object.
 *
 * @template T
 * @param {T} obj - The source object to pick keys from.
 * @param {Array<keyof T>} keys - The keys to pick from the object.
 * @returns {Partial<T>} - An object containing only the picked keys and their values.
 */
static pick = (obj, keys) => {
  
  const finalObj = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }

  return finalObj;
  };


  /**
 * @typedef {Object} PaginationOptions
 * @property {number} [page=1] - The current page number (defaults to 1)
 * @property {number} [limit=10] - The number of items per page (defaults to 10)
 * @property {string} [sortBy='createdAt'] - The field to sort by (defaults to 'createdAt')
 * @property {SortOrder} [sortOrder='desc'] - The order to sort by (defaults to 'desc')
 *
 * @typedef {Object} PaginationData
 * @extends PaginationOptions
 * @property {number} skip - The number of items to skip (calculated as (page - 1) * limit)
 *
 * @param {PaginationOptions} options - The pagination options
 * @returns {PaginationData} The pagination data including skip, page, limit, sortBy, and sortOrder
 */
static calculatePagination = options => {
  const page = options.page || 1
  const limit = options.limit || 10
  const skip = (page - 1) * limit
  const sortBy = options.sortBy || 'createdAt'
  const sortOrder = options.sortOrder || 'desc'

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder: sortOrder == 'desc' ? -1 : 1,
  }
}
  
  /**
 * @summary Query helper function
 *
 * @typedef {Object} PaginationOptions
 * @property {number} [page=1] - The current page number (defaults to 1)
 * @property {number} [limit=10] - The number of items per page (defaults to 10)
 * @property {string} [sortBy='createdAt'] - The field to sort by (defaults to 'createdAt')
 * @property {SortOrder} [sortOrder='desc'] - The order to sort by (defaults to 'desc')
 *
 * @typedef {Object} Result
 * @extends {Partial<PaginationOptions>}
 * @property {Object} filterConditions
 * @property {Record<string, string>} sortConditions
 *
 * @typedef {Object} Options
 * @property {Object} filterableOptions
 * @property {PaginationOptions} paginationOptions
 * @property {string[]} searchableFields
 * @property {string} url
 * @property {Record<string, any>} query
 * @property {string} path
 * @property {number} total - Total docs count
 *
 * @param {Options} options
 *
 * @returns {Result}
 * */
static queryHelper = options => {
  const {
    filterableOptions,
    paginationOptions,
    searchableFields,
    url,
    query,
    path,
    total,
  } = options
  const { searchTerm, ...filtersData } = filterableOptions
  const { minPrice, maxPrice } = query;
  let { page, limit, skip, sortBy, sortOrder } =
    this.calculatePagination(paginationOptions)
  
  page = Number(page)

  const andConditions = []

  /** @type {Record<string, string>} */
  const sortConditions = {}

  if (searchTerm) {
    andConditions.push({
      $or: searchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }
    if (minPrice) {
      filtersData.productPrice = {
        ...filtersData.productPrice,
        $gte: parseFloat(minPrice)
      };
    }
    if (maxPrice) {
      filtersData.productPrice = {
        ...filtersData.productPrice,
        $lte: parseFloat(maxPrice)
      };
    }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }


  const filterConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  /*pagination & links*/
  const totalPages = Math.ceil(total / limit)

  const pagination = {
    current: page,
    totalPages
  }

  if (page - 1 > 0) pagination.prev = page - 1
  if (page < totalPages) pagination.next = page + 1


  const links = {
    self: url,
  }

  if (pagination.prev) {
    const queryString = generateQueryString({ ...query, page: pagination.prev })
    links.prev = `${path}?${queryString}`
  }

  if (pagination.next) {
    const queryString = generateQueryString({ ...query, page: pagination.next })
    links.next = `${path}?${queryString}`
  }

  return {
    filterConditions,
    sortConditions,
    pagination,
    links,
    skip,
    limit,
  }
}
  

  static jwtHelper = {
    /**
   * @summary Get token
   *
   * @typedef {Object} Data
   * @property {string} email
   * @property {string} id
   * @property {Array<String>} roles
   *
   * @param {Data} data
   * @return {string}
   * */
    token : (data) => {
      return jwt.sign(data, jwtoken.secret, {
        expiresIn: jwtoken.secret_exp
      });
    },

  /**
   * @summary Get refresh token
   *
   * @typedef {Object} Data
   * @property {string} email
   * @property {string} id
   * @property {Array<String>} roles
   *
   * @param {Data} data
   * @return {string}
   * */
  refresh_token : (data) =>
      jwt.sign(data, jwtoken.refresh_secret, {
        expiresIn: jwtoken.refresh_secret_exp,
      }),

  /**
   * @summary Get data from token
   *
   * @typedef {Object} Data
   * @property {string} email
   * @property {string} id
   * @property {Array<String>} roles
   *
   * @param {string} token
   * @return {Data}
   * */
   verifyUserSecret : (token) => {
      return jwt.verify(token, jwtoken.secret)
    },

  /**
   * @summary Get data from refresh token
   *
   * @typedef {Object} Data
   * @property {string} email
   * @property {string} id
   * @property {Array<String>} roles
   *
   * @param {string} token
   * @return {Data}
   * */
  verifyUserRefreshSecret : (token) => jwt.verify(token, jwtoken.refresh_secret),
  }

}

module.exports = Helper