const { Response } = require('express')

/**
 * @summary Response utility function
 * @param {Response} res - Express response
 *
 * @typedef {Object} Data
 * @property {number} statusCode - Response status code
 * @property {boolean} success - Response success
 * @property {string} status - Response status
 * @property {string} message - Response message
 * @property {Object} [meta=null] - Meta info e.g pagination, links etc.
 * @property {Object} [data=null] - Actual data
 * @property {Object} [links=null] - HATEOAS links
 * @property {string} [stack=null] - Error stack
 * @property {Object[]} [errors=[]] - Validation Errors
 * @param {Data} data
 * */
const sendResponse = (res, data) => {
  const { statusCode, ...responseData } = data
  res.status(statusCode).json(responseData)
}

module.exports = sendResponse
