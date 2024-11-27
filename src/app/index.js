const express = require('express');
const {
  notFoundErrorHandler,
  globalErrorHandler,
} = require('../middlewares/error-handler');
const rootRouter = require('../routes/index');
const httpStatus = require('http-status');
const ApiError = require('../error/ApiError');
const {
  expressInfoLogger,
  expressErrorLogger,
} = require('../middlewares/winston-express');
const { applyMiddleware, catchAsyncHandler } = require('../helper');
const healthCheck = require('../middlewares/health-check');
const redisClient = require('../config/redis');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/swagger');

const app = express();
applyMiddleware(app);

redisClient.connect().catch((err) => {
  logger.error('Failed to connect to Redis:', err);
});



// winston express info logger
app.use(expressInfoLogger);

// swagger
app.use('/api/v2/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// access routers
app
  .use('/api/v2/health', healthCheck)
  .use('/api/v2', rootRouter)
  .use(
    '/*',
    catchAsyncHandler(async (_req, _res) => {
      throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
    }),
  );

// winston express error logger
app.use(expressErrorLogger);

//error handlers
app.use(notFoundErrorHandler);
app.use(globalErrorHandler);

module.exports = app;
