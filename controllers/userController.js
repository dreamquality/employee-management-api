// controllers/userController.js
const db = require('../models');

exports.getEmployees = async (req, res, next) => {
  try {
    const attributes = req.user.role === 'admin' ? null : [
      'firstName',
      'lastName',
      'middleName',
      'birthDate',
      'phone',
      'email',
      'programmingLanguage',
      'position',
    ];

    const users = await db.User.findAll({ attributes });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (req.user.userId !== parseInt(userId)) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const allowedFields = [
      'firstName',
      'lastName',
      'middleName',
      'birthDate',
      'phone',
      'email',
      'programmingLanguage',
      'country',
      'bankCard',
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await db.User.findByPk(userId);
    await user.update(updateData);

    // Создаем уведомление для администратора
    const admins = await db.User.findAll({ where: { role: 'admin' } });
    admins.forEach(async (admin) => {
      await db.Notification.create({
        message: `Сотрудник ${user.firstName} ${user.lastName} обновил свои данные: ${Object.keys(updateData).join(', ')}`,
        userId: admin.id,
      });
    });

    res.json({ message: 'Данные обновлены', user });
  } catch (err) {
    next(err);
  }
};

// Методы для администратора по созданию и удалению сотрудников
