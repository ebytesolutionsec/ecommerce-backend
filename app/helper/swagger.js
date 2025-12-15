import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Node.js',
      version: '1.0.0',
      description: 'Documentación de mi API',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
      },
    ],
  },
  apis: ['./app/routers/**/*.js'], // 🔥 RUTA CORRECTA
};

export default swaggerJSDoc(options);