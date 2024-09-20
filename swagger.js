// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Employee Management API',
      version: '1.0.0',
      description: 'API для управления информацией о сотрудниках',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          Register: {
            type: 'object',
            required: ['email', 'password', 'firstName', 'lastName', 'middleName', 'birthDate', 'phone', 'programmingLanguage'],
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', format: 'password' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              middleName: { type: 'string' },
              birthDate: { type: 'string', format: 'date' },
              phone: { type: 'string' },
              programmingLanguage: { type: 'string' },
              role: { type: 'string', enum: ['employee', 'admin'] },
              secretWord: { type: 'string', description: 'Требуется только для регистрации администратора' },
            },
          },
          Login: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', format: 'password' },
            },
          },
          User:{
            type: 'object',
            properties: {
              id: { type: 'integer' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              middleName: { type: 'string' },
              birthDate: { type: 'string', format: 'date' },
              phone: { type: 'string' },
              email: { type: 'string', format: 'email' },
              programmingLanguage: { type: 'string' },
              country: { type: 'string' },
              mentorName: { type: 'string' },
              englishLevel: { type: 'string' },
              registrationDate: { type: 'string', format: 'date-time' },
              registrationDate: { type: 'string', format: 'date-time' },
              // Добавьте другие поля по необходимости
          }
        },
          UserUpdate: {
            type: 'object',
            properties: {
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              middleName: { type: 'string' },
              birthDate: { type: 'string', format: 'date' },
              phone: { type: 'string' },
              email: { type: 'string', format: 'email' },
              programmingLanguage: { type: 'string' },
              country: { type: 'string' },
              bankCard: { type: 'string' },
            },
          },
          UserCreate: {
            type: 'object',
            properties: {
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              middleName: { type: 'string' },
              birthDate: { type: 'string', format: 'date' },
              phone: { type: 'string' },
              email: { type: 'string', format: 'email' },
              programmingLanguage: { type: 'string' },
              country: { type: 'string' },
              bankCard: { type: 'string' },
            },
          },
          Notification: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                description: 'Уникальный идентификатор уведомления',
              },
              message: {
                type: 'string',
                description: 'Текст уведомления',
              },
              userId: {
                type: 'integer',
                description: 'ID пользователя, которому предназначено уведомление',
              },
              relatedUserId: {
                type: 'integer',
                description: 'ID пользователя, про которого уведомление',
              },
              isRead: {
                type: 'boolean',
                description: 'Статус прочтения уведомления',
                default: false,
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Дата и время создания уведомления',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Дата и время последнего обновления уведомления',
              },
            },
          },
        },
      },      
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'], // Путь к файлам с аннотациями Swagger
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
