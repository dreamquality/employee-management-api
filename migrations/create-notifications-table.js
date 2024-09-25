// migrations/XXXXXXXXXXXXXX-create-notifications-table.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users',
            schema: 'user_schema'
          },
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      relatedUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users',
            schema: 'user_schema'
          },
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      type: {
        type: Sequelize.ENUM('birthday_reminder', 'salary_increase_reminder', 'welcome'),
        allowNull: false
      },
      eventDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      schema: 'user_schema' // Указываем схему
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Notifications', { schema: 'user_schema' });
  }
};