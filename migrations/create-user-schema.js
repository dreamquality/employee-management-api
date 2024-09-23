// migrations/create-user-schema.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createSchema('user_schema');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropSchema('user_schema');
  },
};
