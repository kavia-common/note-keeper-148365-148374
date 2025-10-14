const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Note Keeper API',
      version: '1.0.0',
      description: 'REST API for creating, listing, updating, and deleting notes.',
    },
    tags: [
      { name: 'Notes', description: 'CRUD operations for notes' }
    ],
  },
  // Scan all route files, including notes routes
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
