// 'use strict';
// const { faker } = require('@faker-js/faker');

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Получаем всех пользователей (в том числе админов) для генерации уведомлений
//     const users = await queryInterface.sequelize.query(
//       `SELECT id, firstName, lastName FROM "Users";`,
//       { type: queryInterface.sequelize.QueryTypes.SELECT }
//     );

//     const notifications = [];

//     for (const user of users) {
//       const notification = {
//         message: `Уведомление для ${user.firstName} ${user.lastName}: ${faker.lorem.sentence()}`,
//         userId: user.id,
//         type: faker.helpers.arrayElement(['birthday_reminder', 'salary_increase_reminder', 'general']),
//         eventDate: faker.date.future(),  // Оставляем будущие даты
//         isRead: faker.datatype.boolean(), // Используем faker.datatype.boolean() для случайного true/false
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
//       notifications.push(notification);
//     }

//     return queryInterface.bulkInsert('Notifications', notifications, {});
//   },

//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('Notifications', null, {});
//   }
// };
