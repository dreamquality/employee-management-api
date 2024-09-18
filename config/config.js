// config/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  secretWord: process.env.SECRET_WORD || 'default_secret_word',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'employee_db',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    dialect: 'postgres',
    logging: false,
  },
};
