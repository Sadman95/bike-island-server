const { request: Request } = require('express')

/**
 * @summary convert req.file to url
 * @param {Request} req
 * @returns {string}
 */
const fileToUrl = req => {
  return (
    req.protocol +
    '://' +
    req.get('host') +
    req.file.destination.replace('public/', '') +
    req.file.filename
  )
}

module.exports = fileToUrl
