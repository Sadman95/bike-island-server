const swaggerJsdoc = require('swagger-jsdoc');
const { server, api } = require('./env');

/**
 * Swagger configuration options
 * @constant swaggerOptions
 */
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: api.title,
      version: api.version,
      description: 'API documentation for Bike Island Server'
    },
    servers: [
      {
        url: server.baseURL,
        description: 'Development server'
      },
      {
        url: server.ciBaseUrl,
        description: 'CI server'
      }
    ]
  },
  apis: [
    'src/routes/*.js', // Your route files where API endpoints are defined
    'src/docs/*.js' // Additional Swagger definitions (like the one above)
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
