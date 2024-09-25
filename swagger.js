// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const publicUrl = process.env.PUBLIC_URL || 'http://localhost:3000';

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
        url: `${publicUrl}`,
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
        User: {
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
            country: { type: 'string', nullable: true },
            bankCard: { type: 'string', nullable: true },
            registrationDate: { type: 'string', format: 'date-time', nullable: true },
            lastLoginDate: { type: 'string', format: 'date-time', nullable: true },
            salary: { type: 'integer' },
            lastSalaryIncreaseDate: { type: 'string', format: 'date-time' },
            position: { type: 'string', nullable: true },
            mentorName: { type: 'string', nullable: true },
            vacationDates: { 
              type: 'array',
              items: { type: 'string', format: 'date' },
              nullable: true 
            },
            githubLink: { type: 'string', format: 'uri', nullable: true },
            linkedinLink: { type: 'string', format: 'uri', nullable: true },
            adminNote: { type: 'string', nullable: true },
            currentProject: { type: 'string', nullable: true },
            englishLevel: { type: 'string', nullable: true },
            workingHoursPerWeek: { type: 'integer', nullable: true },
            role: { type: 'string', enum: ['employee', 'admin'] },
            password: { type: 'string', format: 'password' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
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
            country: { type: 'string', nullable: true },
            bankCard: { type: 'string', nullable: true },
            registrationDate: { type: 'string', format: 'date-time', nullable: true },
            lastLoginDate: { type: 'string', format: 'date-time', nullable: true },
            salary: { type: 'integer' },
            lastSalaryIncreaseDate: { type: 'string', format: 'date-time' },
            position: { type: 'string', nullable: true },
            mentorName: { type: 'string', nullable: true },
            vacationDates: { 
              type: 'array',
              items: { type: 'string', format: 'date' },
              nullable: true 
            },
            githubLink: { type: 'string', format: 'uri', nullable: true },
            linkedinLink: { type: 'string', format: 'uri', nullable: true },
            adminNote: { type: 'string', nullable: true },
            currentProject: { type: 'string', nullable: true },
            englishLevel: { type: 'string', nullable: true },
            workingHoursPerWeek: { type: 'integer', nullable: true },
          },
        },
        UserCreate: {
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
            country: { type: 'string', nullable: true },
            bankCard: { type: 'string', nullable: true },
            registrationDate: { type: 'string', format: 'date-time', nullable: true },
            lastLoginDate: { type: 'string', format: 'date-time', nullable: true },
            salary: { type: 'integer' },
            lastSalaryIncreaseDate: { type: 'string', format: 'date-time' },
            position: { type: 'string', nullable: true },
            mentorName: { type: 'string', nullable: true },
            vacationDates: { 
              type: 'array',
              items: { type: 'string', format: 'date' },
              nullable: true 
            },
            githubLink: { type: 'string', format: 'uri', nullable: true },
            linkedinLink: { type: 'string', format: 'uri', nullable: true },
            adminNote: { type: 'string', nullable: true },
            currentProject: { type: 'string', nullable: true },
            englishLevel: { type: 'string', nullable: true },
            workingHoursPerWeek: { type: 'integer', nullable: true },
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
            type: {
              type: 'string',
              enum: ['birthday_reminder', 'salary_increase_reminder', 'welcome'],
              description: 'Тип уведомления',
            },
            eventDate: {
              type: 'string',
              format: 'date',
              description: 'Дата события, связанного с уведомлением',
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
