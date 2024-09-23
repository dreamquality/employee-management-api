// models/notification.js
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      message: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      relatedUserId: { type: DataTypes.INTEGER, allowNull: false },
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "general",
      },
      eventDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      schema: "user_schema",
    }
  );

  // Ассоциация с пользователем
  Notification.associate = function(models) {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Notification;
};
