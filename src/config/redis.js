const { createClient } = require('redis');
const { logger } = require('../utils/logger');

/**
 * @constant redisClient
 * @description Redis client configuration
 */
const redisClient = createClient();

redisClient.on('error', (err) => {
  // logger.error('Redis Client Error', err);
});

module.exports = redisClient;
