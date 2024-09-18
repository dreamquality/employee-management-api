// services/notificationService.js

const db = require('../models');
const schedule = require('node-schedule');

exports.scheduleNotifications = () => {
  // Ежедневная проверка
  schedule.scheduleJob('0 0 * * *', async () => {
    const today = new Date();

    // Получаем всех администраторов
    const admins = await db.User.findAll({ where: { role: 'admin' } });

    // Получаем всех сотрудников
    const users = await db.User.findAll({ where: { role: 'employee' } });

    for (const user of users) {
      // Проверка дня рождения
      await checkBirthdayNotifications(user, admins, today);

      // Проверка повышения зарплаты
      await checkSalaryIncreaseNotifications(user, admins, today);
    }
  });
};

// Функция для проверки и отправки уведомлений о дне рождения
async function checkBirthdayNotifications(user, admins, today) {
  const birthDate = new Date(user.birthDate);
  const currentYear = today.getFullYear();

  // День рождения в текущем году
  let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

  // Если день рождения уже прошел в этом году, берем следующий год
  if (nextBirthday < today) {
    nextBirthday.setFullYear(currentYear + 1);
  }

  const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

  // Уведомление за месяц до дня рождения
  if (daysUntilBirthday === 30) {
    await sendNotificationToAdmins(admins, {
      message: `Через месяц день рождения у ${user.firstName} ${user.lastName}`,
      type: 'birthday_reminder',
      eventDate: nextBirthday,
    });
  }

  // Уведомление в день рождения
  if (daysUntilBirthday === 0) {
    await sendNotificationToAdmins(admins, {
      message: `Сегодня день рождения у ${user.firstName} ${user.lastName}`,
      type: 'birthday',
      eventDate: nextBirthday,
    });
  }
}

// Функция для проверки и отправки уведомлений о повышении зарплаты
async function checkSalaryIncreaseNotifications(user, admins, today) {
  const lastIncrease = user.lastSalaryIncreaseDate
    ? new Date(user.lastSalaryIncreaseDate)
    : new Date(user.hireDate);

  const nextIncreaseDate = new Date(lastIncrease);
  nextIncreaseDate.setMonth(nextIncreaseDate.getMonth() + 6);

  const daysUntilNextIncrease = Math.ceil((nextIncreaseDate - today) / (1000 * 60 * 60 * 24));

  // Уведомление за месяц до повышения зарплаты
  if (daysUntilNextIncrease === 30) {
    await sendNotificationToAdmins(admins, {
      message: `Через месяц запланировано повышение зарплаты для сотрудника ${user.firstName} ${user.lastName}.`,
      type: 'salary_increase_reminder',
      eventDate: nextIncreaseDate,
    });
  }

  // Время для повышения зарплаты
  if (daysUntilNextIncrease <= 0 && user.salary < 1500) {
    const newSalary = Math.min(user.salary + 200, 1500);
    await user.update({
      salary: newSalary,
      lastSalaryIncreaseDate: today,
    });

    // Уведомление об автоматическом повышении зарплаты
    await sendNotificationToAdmins(admins, {
      message: `Зарплата сотрудника ${user.firstName} ${user.lastName} была автоматически увеличена до ${newSalary} долларов.`,
      type: 'salary_increased',
      eventDate: today,
    });

    // Уведомление о достижении порога зарплаты
    if (newSalary >= 1400) {
      await sendNotificationToAdmins(admins, {
        message: `Сотрудник ${user.firstName} ${user.lastName} достиг порога зарплаты.`,
        type: 'salary_threshold_reached',
        eventDate: today,
      });
    }
  }
}

// Функция для отправки уведомлений администраторам
async function sendNotificationToAdmins(admins, notificationData) {
  for (const admin of admins) {
    // Проверяем, было ли уже отправлено уведомление данного типа на указанную дату
    const existingNotification = await db.Notification.findOne({
      where: {
        userId: admin.id,
        type: notificationData.type,
        eventDate: notificationData.eventDate,
      },
    });

    if (!existingNotification) {
      await db.Notification.create({
        message: notificationData.message,
        userId: admin.id,
        type: notificationData.type,
        eventDate: notificationData.eventDate,
      });
    }
  }
}
