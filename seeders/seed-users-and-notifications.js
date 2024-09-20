'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    const salt = await bcrypt.genSalt(10);

    // Пользователь с днем рождения через 30 дней
    const birthdayUser = {
      firstName: 'John',
      lastName: 'Doe',
      middleName: faker.person.middleName(),
      email: faker.internet.email(),
      phone: faker.phone.number('+1-###-###-####'),
      birthDate: new Date(new Date().setDate(new Date().getDate() + 30)), // День рождения через 30 дней
      programmingLanguage: 'JavaScript',
      country: 'USA',
      hireDate: faker.date.past(2),
      salary: 1000,
      lastSalaryIncreaseDate: faker.date.past(1),
      role: 'employee',
      password: await bcrypt.hash('password123', salt),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(birthdayUser);

    // Пользователь с повышением зарплаты через 30 дней
    const salaryIncreaseUser = {
      firstName: 'Jane',
      lastName: 'Smith',
      middleName: faker.person.middleName(),
      email: faker.internet.email(),
      phone: faker.phone.number('+1-###-###-####'),
      birthDate: faker.date.past(40, '2000-01-01'),
      programmingLanguage: 'Python',
      country: 'Canada',
      hireDate: faker.date.past(1),
      salary: 1200,
      lastSalaryIncreaseDate: new Date(new Date().setMonth(new Date().getMonth() - 5)), // Повышение через 30 дней
      role: 'employee',
      password: await bcrypt.hash('password123', salt),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(salaryIncreaseUser);

    // Обычные сотрудники для других тестов
    for (let i = 0; i < 10; i++) {
      const password = await bcrypt.hash('password123', salt);
      const user = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        middleName: faker.person.middleName(),
        email: faker.internet.email(),
        phone: faker.phone.number('+1-###-###-####'),
        birthDate: faker.date.past(40, '2000-01-01'),
        programmingLanguage: faker.helpers.arrayElement(['JavaScript', 'Python', 'Java', 'C#', 'Ruby']),
        country: faker.location.country(),
        hireDate: faker.date.past(10),
        salary: faker.number.int({ min: 400, max: 1400 }),
        lastSalaryIncreaseDate: faker.date.past(1),
        role: 'employee',
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(user);
    }

    // Создаем пользователя-администратора
    const adminUser = {
      firstName: 'Admin',
      lastName: 'User',
      middleName: faker.person.middleName(),
      email: 'admin@example.com',
      phone: faker.phone.number('+1-###-###-####'),
      birthDate: faker.date.past(40, '2000-01-01'),
      programmingLanguage: 'N/A',
      country: 'USA',
      hireDate: faker.date.past(2),
      salary: 1500,
      lastSalaryIncreaseDate: faker.date.past(1),
      role: 'admin',
      password: await bcrypt.hash('adminpassword', salt),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(adminUser);

    // Вставляем пользователей в базу данных
    await queryInterface.bulkInsert({ tableName: 'Users', schema: 'user_schema' }, users, {});

    // После вставки пользователей создаем уведомления
    const usersFromDb = await queryInterface.sequelize.query(
      `SELECT "id", "firstName", "lastName" FROM "user_schema"."Users";`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const notifications = [];

    for (const user of usersFromDb) {
      const notification = {
        message: `Уведомление для ${user.firstName} ${user.lastName}: ${faker.lorem.sentence()}`,
        userId: user.id,
        relatedUserId: user.id, // Поле relatedUserId заполняется ID пользователя, к которому относится уведомление
        type: faker.helpers.arrayElement(['birthday_reminder', 'salary_increase_reminder', 'general']),
        eventDate: faker.date.future(),
        isRead: faker.datatype.boolean(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      notifications.push(notification);
    }

    // Вставляем данные в таблицу Notifications
    await queryInterface.bulkInsert({ tableName: 'Notifications', schema: 'user_schema' }, notifications, {});

    console.log('Пользователи и уведомления успешно посеяны');
  },

  down: async (queryInterface, Sequelize) => {
    // Удаляем уведомления и пользователей
    await queryInterface.bulkDelete({ tableName: 'Notifications', schema: 'user_schema' }, null, {});
    await queryInterface.bulkDelete({ tableName: 'Users', schema: 'user_schema' }, null, {});
  }
};
