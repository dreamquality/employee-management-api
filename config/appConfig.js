// config/appConfig.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  secretWord: process.env.SECRET_WORD || 'default_secret_word',
};
