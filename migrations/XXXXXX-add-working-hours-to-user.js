// migrations/XXXXXXXXXXXXXX-add-working-hours-to-user.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      {
        tableName: 'Users',
        schema: 'user_schema', // Укажите вашу схему, если вы ее используете
      },
      'workingHoursPerWeek',
      {
        type: Sequelize.INTEGER,
        allowNull: true, // Или false, если поле обязательно
        defaultValue: null, // Установите значение по умолчанию, если нужно
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      {
        tableName: 'Users',
        schema: 'user_schema',
      },
      'workingHoursPerWeek'
    );
  },
};
