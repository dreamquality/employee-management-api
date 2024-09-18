// migrations/YYYYMMDDHHMMSS-create-users.js

module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        role: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'employee',
        },
        // ... другие поля
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Users');
    },
  };
  