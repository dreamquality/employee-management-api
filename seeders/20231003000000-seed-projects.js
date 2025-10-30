// seeders/20231003000000-seed-projects.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const projects = [
      {
        name: 'Project Alpha',
        description: 'First major project',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Project Beta',
        description: 'Second phase project',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Project Gamma',
        description: 'Third initiative',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Project Delta',
        description: 'Fourth wave project',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Project Epsilon',
        description: 'Fifth generation system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Projects', projects, {
      schema: 'public',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Projects', null, {
      schema: 'public',
    });
  },
};
