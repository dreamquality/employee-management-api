// config/config.js

require('dotenv').config();

// Функция для логирования переменных окружения (для отладки)
function logEnvVariables(env) {
  console.log('=== Environment Variables ===');
  console.log(`DB_HOST: ${process.env.DB_HOST}`);
  console.log(`DB_PORT: ${process.env.DB_PORT}`);
  console.log(`DB_NAME: ${process.env.DB_NAME}`);
  console.log(`DB_USER: ${process.env.DB_USER}`);
  console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '******' : 'Not Set'}`);
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '******' : 'Not Set'}`);
  console.log(`SECRET_WORD: ${process.env.SECRET_WORD ? '******' : 'Not Set'}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`PORT: ${process.env.PORT}`);
  console.log('=============================');
}

logEnvVariables(process.env.NODE_ENV);

const config = {
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
        rejectUnauthorized: false, // В некоторых случаях это помогает устранить ошибки сертификата
      },
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
    database: process.env.DB_NAME || 'managment_postgresql', // Используем DB_NAME
    host: process.env.DB_HOST || 'dpg-crnb3el6l47c73acmhq0-a.frankfurt-postgres.render.com', // Используем внешний хост
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    schema: 'user_schema',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

// Логирование текущей конфигурации базы данных
console.log('Current DB Configuration:', config[process.env.NODE_ENV || 'development']);

module.exports = config;
