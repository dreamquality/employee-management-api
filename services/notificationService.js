// services/notificationService.js
const db = require('../models');
const schedule = require('node-schedule');

exports.scheduleNotifications = () => {
  // Ежедневная проверка дней рождения
  schedule.scheduleJob('0 0 * * *', async () => {
    const today = new Date();
    const users = await db.User.findAll();
    users.forEach(async (user) => {
      const birthDate = new Date(user.birthDate);
      if (
        birthDate.getDate() === today.getDate() &&
        birthDate.getMonth() === today.getMonth()
      ) {
        const admins = await db.User.findAll({ where: { role: 'admin' } });
        admins.forEach(async (admin) => {
          await db.Notification.create({
            message: `Сегодня день рождения у ${user.firstName} ${user.lastName}`,
            userId: admin.id,
          });
        });
      }
    });
  });

  // Ежедневная проверка для повышения зарплаты
  schedule.scheduleJob('0 0 * * *', async () => {
    const users = await db.User.findAll({ where: { role: 'employee' } });
    users.forEach(async (user) => {
      const lastIncrease = new Date(user.lastSalaryIncreaseDate);
      const now = new Date();
      const monthsDiff =
        (now.getFullYear() - lastIncrease.getFullYear()) * 12 +
        now.getMonth() -
        lastIncrease.getMonth();

      if (monthsDiff >= 6 && user.salary < 1500) {
        const newSalary = Math.min(user.salary + 200, 1500);
        await user.update({
          salary: newSalary,
          lastSalaryIncreaseDate: now,
        });

        const admins = await db.User.findAll({ where: { role: 'admin' } });
        admins.forEach(async (admin) => {
          await db.Notification.create({
            message: `Зарплата сотрудника ${user.firstName} ${user.lastName} была автоматически увеличена до ${newSalary} долларов.`,
            userId: admin.id,
          });

          if (newSalary >= 1400) {
            await db.Notification.create({
              message: `Сотрудник ${user.firstName} ${user.lastName} достиг порога зарплаты.`,
              userId: admin.id,
            });
          }
        });
      }
    });
  });
};
