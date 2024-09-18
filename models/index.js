// models/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config')[env]; // Получаем конфигурацию для текущего окружения

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  schema: config.schema, // Используем схему из конфигурации
  logging: config.logging,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, DataTypes);
db.Notification = require('./notification')(sequelize, DataTypes);

// Установление связей
db.User.hasMany(db.Notification, { as: 'notifications', foreignKey: 'userId' });
db.Notification.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

module.exports = db;
