const expressWinston = require('express-winston')
const { logger } = require('../utils/logger')

const expressWinstonLogger = level => {
  return expressWinston.logger({
    level: level || 'info',
    winstonInstance: logger,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.responseTime}}',
    expressFormat: true,
    colorize: false,
  })
}
const expressInfoLogger = expressWinstonLogger('info')
const expressErrorLogger = expressWinstonLogger('error')

module.exports = { expressInfoLogger, expressErrorLogger }
