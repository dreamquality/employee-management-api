// 'use strict';
// const { faker } = require('@faker-js/faker');
// const bcrypt = require('bcryptjs');

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const users = [];
//     const salt = await bcrypt.genSalt(10);

//     for (let i = 0; i < 50; i++) {
//       const password = await bcrypt.hash('password123', salt);
//       const user = {
//         firstName: faker.person.firstName(),
//         lastName: faker.person.lastName(),
//         middleName: faker.person.middleName(),
//         email: faker.internet.email(),
//         phone: faker.phone.number('+1-###-###-####'),
//         birthDate: faker.date.past(40, '2000-01-01'),
//         programmingLanguage: faker.helpers.arrayElement(['JavaScript', 'Python', 'Java', 'C#', 'Ruby']),
//         country: faker.location.country(),
//         hireDate: faker.date.past(10),  // Поле hireDate
//         salary: faker.number.int({ min: 400, max: 1400 }),
//         lastSalaryIncreaseDate: faker.date.past(1),
//         role: i === 0 ? 'admin' : 'employee',
//         password,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
//       users.push(user);
//     }

//     return queryInterface.bulkInsert('Users', users, {});
//   },

//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('Users', null, {});
//   }
// };
