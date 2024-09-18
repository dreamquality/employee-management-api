// utils/logger.js
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

module.exports = logger;
