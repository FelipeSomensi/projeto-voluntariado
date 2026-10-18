const path = require('node:path');
const swaggerJsdoc = require('swagger-jsdoc');

const source = path.resolve(__dirname, '..').replace(/\\/g, '/');

const options = {
  failOnErrors: true,

  definition: {
    openapi: '3.0.3',

    info: {
      title: 'API de Voluntariado IFRS',
      version: '1.0.0',
      description:
        'Gerenciamento de voluntários e eventos sociais, com autenticação JWT.',
    },

    servers: [
      {
        url: '/',
        description: 'Servidor da aplicação',
      },
    ],

    tags: [
      { name: 'Autenticação', description: 'Cadastro e login de usuários' },
      { name: 'Eventos', description: 'Eventos sociais de voluntariado' },
      { name: 'Painel', description: 'Área restrita a usuários autenticados' },
    ],
  },

  apis: [`${source}/routes/*.js`, `${source}/docs/*.js`],
};

module.exports = swaggerJsdoc(options);
