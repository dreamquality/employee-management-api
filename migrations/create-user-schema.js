// migrations/create-user-schema.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createSchema('public');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropSchema('public');
  },
};
