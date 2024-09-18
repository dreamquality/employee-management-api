// controllers/userController.js
const db = require('../models');

exports.getEmployees = async (req, res, next) => {
    try {
      // Получение параметров запроса
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const { firstName, lastName, sortBy, order } = req.query;
  
      const offset = (page - 1) * limit;
  
      // Фильтрация по имени и фамилии
      const where = {};
      if (firstName) {
        where.firstName = { [Op.iLike]: `%${firstName}%` };
      }
      if (lastName) {
        where.lastName = { [Op.iLike]: `%${lastName}%` };
      }
  
      // Сортировка
      const validSortFields = ['registrationDate', 'programmingLanguage', 'country', 'mentorName', 'englishLevel'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'registrationDate';
      const sortOrder = order === 'DESC' ? 'DESC' : 'ASC';
  
      // Выбор полей для отображения
      const attributes = req.user.role === 'admin' ? null : [
        'firstName',
        'lastName',
        'middleName',
        'birthDate',
        'phone',
        'email',
        'programmingLanguage',
        'position',
        // Добавьте другие поля, которые сотрудник может видеть
      ];
  
      // Получение данных из базы данных
      const { count, rows } = await db.User.findAndCountAll({
        where,
        attributes,
        order: [[sortField, sortOrder]],
        limit,
        offset,
      });
  
      res.json({
        users: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      });
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
