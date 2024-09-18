// migrations/YYYYMMDDHHMMSS-add-hire-date-to-users.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      {
        tableName: 'Users',
        schema: 'user_schema',
      },
      'hireDate',
      {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      {
        tableName: 'Users',
        schema: 'user_schema',
      },
      'hireDate'
    );
  },
};
