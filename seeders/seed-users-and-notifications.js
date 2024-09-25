'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    const salt = await bcrypt.genSalt(10);

    // Создаем администратора
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

    // Создаем пользователей с днем рождения через 30 дней
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

    // Создаем пользователей с предстоящим повышением зарплаты
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

    // Создаем остальных сотрудников для тестов
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

    // Вставляем пользователей в базу данных
    await queryInterface.bulkInsert({ tableName: 'Users', schema: 'user_schema' }, users, {});

    // Получаем всех пользователей из базы данных
    const usersFromDb = await queryInterface.sequelize.query(
      `SELECT "id", "firstName", "lastName", "role" FROM "user_schema"."Users";`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const notifications = [];

    // Разделяем администраторов и сотрудников
    const adminUsers = usersFromDb.filter(user => user.role === 'admin');
    const employeeUsers = usersFromDb.filter(user => user.role === 'employee');

    // Создаем уведомления для сотрудников (например, напоминания о дне рождения или повышении зарплаты)
    for (const employee of employeeUsers) {
      // Уведомление о дне рождения
      notifications.push({
        message: `Напоминание: У сотрудника ${employee.firstName} ${employee.lastName} скоро день рождения!`,
        userId: adminUsers[0].id, // Администратор — получатель уведомления
        relatedUserId: employee.id, // Сотрудник — инициатор уведомления
        type: 'birthday_reminder',
        eventDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Уведомление о предстоящем повышении зарплаты
      notifications.push({
        message: `У сотрудника ${employee.firstName} ${employee.lastName} скоро планируется повышение зарплаты.`,
        userId: adminUsers[0].id, // Администратор — получатель уведомления
        relatedUserId: employee.id, // Сотрудник — инициатор уведомления
        type: 'salary_increase_reminder',
        eventDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Создаем общие уведомления для администраторов
    for (const admin of adminUsers) {
      notifications.push({
        message: `Добро пожаловать, ${admin.firstName} ${admin.lastName}!`,
        userId: admin.id, // Администратор — получатель уведомления
        relatedUserId: admin.id, // Администратор — инициатор уведомления
        type: 'welcome',
        eventDate: new Date(),
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Вставляем уведомления в базу данных
    await queryInterface.bulkInsert({ tableName: 'Notifications', schema: 'user_schema' }, notifications, {});

    console.log('Пользователи и уведомления успешно посеяны');
  },

  down: async (queryInterface, Sequelize) => {
    // Удаляем уведомления и пользователей
    await queryInterface.bulkDelete({ tableName: 'Notifications', schema: 'user_schema' }, null, {});
    await queryInterface.bulkDelete({ tableName: 'Users', schema: 'user_schema' }, null, {});
  }
};
