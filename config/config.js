// config/config.js

require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'your_db_user',
    password: process.env.DB_PASSWORD || 'your_db_password',
    database: process.env.DB_NAME || 'employee_db',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    schema: 'user_schema', // Если вы используете схему
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // В некоторых случаях это помогает устранить ошибки сертификата
      }
    },
  },
  test: {
    username: process.env.DB_USER || 'your_db_user',
    password: process.env.DB_PASSWORD || 'your_db_password',
    database: process.env.DB_NAME_TEST || 'employee_db_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    schema: 'user_schema',
  },
  production: {
    username: process.env.DB_USER || 'your_db_user',
    password: process.env.DB_PASSWORD || 'your_db_password',
    database: process.env.DB_NAME_PROD || 'employee_db_prod',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    schema: 'user_schema',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
  },
};
