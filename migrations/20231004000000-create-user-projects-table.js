'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserProjects', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      projectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      isPrimary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      assignedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint to prevent duplicate assignments
    await queryInterface.addConstraint('UserProjects', {
      fields: ['userId', 'projectId'],
      type: 'unique',
      name: 'unique_user_project'
    });

    // Create indexes for better query performance
    await queryInterface.addIndex('UserProjects', ['userId']);
    await queryInterface.addIndex('UserProjects', ['projectId']);
    await queryInterface.addIndex('UserProjects', ['userId', 'isPrimary']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserProjects');
  }
};
