// models/notification.js
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      message: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    });
  
    Notification.associate = (models) => {
      Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };
  
    return Notification;
  };
  