// // migrations/YYYYMMDDHHMMSS-add-type-and-eventdate-to-notifications.js

// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.addColumn(
//       {
//         tableName: 'Notifications',
//         schema: 'user_schema',
//       },
//       'type',
//       {
//         type: Sequelize.STRING,
//         allowNull: false,
//         defaultValue: 'general',
//       }
//     );
//     await queryInterface.addColumn(
//       {
//         tableName: 'Notifications',
//         schema: 'user_schema',
//       },
//       'eventDate',
//       {
//         type: Sequelize.DATE,
//         allowNull: true,
//       }
//     );
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.removeColumn(
//       {
//         tableName: 'Notifications',
//         schema: 'user_schema',
//       },
//       'type'
//     );
//     await queryInterface.removeColumn(
//       {
//         tableName: 'Notifications',
//         schema: 'user_schema',
//       },
//       'eventDate'
//     );
//   },
// };

