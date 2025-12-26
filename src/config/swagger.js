const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Voice World API',
      version: '1.0.0',
      description: 'API documentation for Voice World project',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },

  apis: [path.join(__dirname, '../api/*.js')], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
