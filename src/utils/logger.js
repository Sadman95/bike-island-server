const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log directory
const logDir = path.join(__dirname, '../../logs');

// Create a new instance of DailyRotateFile for daily log rotation
const dailyRotateTransport = new DailyRotateFile({
  filename: `${logDir}/application-%DATE%.log`, // Log file naming format
  datePattern: 'YYYY-MM-DD', // Rotate daily
  maxSize: '20m', // Maximum log file size
  maxFiles: '14d', // Keep logs for 14 days
  zippedArchive: true // Compress old log files
});

/**
 * Logger configuration using Winston with daily rotation for logs
 * @constant logger
 */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    dailyRotateTransport, // Add daily rotate transport
    new winston.transports.File({
      filename: `${logDir}/error.log`,
      level: 'error'
    })
  ]
});

module.exports = { logger };
