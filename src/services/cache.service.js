const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.error('Redis Client Error', err));

class CacheService {
  static async get(key) {
    return new Promise((resolve, reject) => {
      client.get(key, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  static async set(key, value, expirationInSeconds = 3600) {
    return client.setex(key, expirationInSeconds, value);
  }
}

module.exports = CacheService;
