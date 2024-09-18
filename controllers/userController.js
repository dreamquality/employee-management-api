// controllers/userController.js
const db = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

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
      'workingHoursPerWeek'
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
    if (req.user.role !== 'admin') {
      const admins = await db.User.findAll({ where: { role: 'admin' } });
      for (const admin of admins) {
        await db.Notification.create({
          message: `Сотрудник ${user.firstName} ${user.lastName} обновил свои данные: ${Object.keys(updateData).join(', ')}`,
          userId: admin.id,
          type: 'user_update', // Добавляем поле type
        });
      }
    }

    res.json({ message: 'Данные обновлены', user });
  } catch (err) {
    next(err);
  }
};

// Метод для администратора по созданию сотрудника
exports.createEmployee = async (req, res, next) => {
  try {
    // Проверка роли пользователя
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    // Извлечение данных из тела запроса
    const {
      email,
      password,
      firstName,
      lastName,
      middleName,
      birthDate,
      phone,
      programmingLanguage,
      country,
      position,
      workingHoursPerWeek,
      role
      // Добавьте другие поля по необходимости
    } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Поле role является обязательным' });
    }
    // Проверка на существование пользователя с таким email
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового сотрудника
    const newUser = await db.User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      middleName,
      birthDate,
      phone,
      programmingLanguage,
      country,
      position,
      workingHoursPerWeek,
      role
      // Добавьте другие поля по необходимости
    });

    res.status(201).json({ message: 'Сотрудник успешно создан', user: newUser });
  } catch (err) {
    next(err);
  }
};

// Метод для администратора по удалению сотрудника
exports.deleteEmployee = async (req, res, next) => {
  try {
    // Проверка роли пользователя
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const userId = req.params.id;

    // Проверка, что пользователь существует и является сотрудником
    const user = await db.User.findOne({ where: { id: userId, role: 'employee' } });
    if (!user) {
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }

    // Удаление сотрудника
    await user.destroy();

    res.json({ message: 'Сотрудник успешно удален' });
  } catch (err) {
    next(err);
  }
};
