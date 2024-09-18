// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: config.db.dialect,
  logging: config.db.logging,
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
