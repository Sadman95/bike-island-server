const app = require('./app');
const http = require('http');
const httpServer = http.createServer(app);
const connection = require('./db/connection');
const { db, server, env } = require('./config/env');
const { logger } = require('./utils/logger');
const socket = require('./lib/socket');

connection(db.uri, db.name)
  .then(() => {
    if (env !== 'test') {
      httpServer.listen(server.port, async () => {
        console.log('Server is listening to port: ', server.port);
      });
    }
  })
  .then(() => socket(httpServer))
  .catch((e) => logger.error(JSON.stringify(e)));

process.on('SIGTERM', () => {
  logger.http('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    logger.http('HTTP server closed');
  });
});
