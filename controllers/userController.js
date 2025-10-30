// controllers/userController.js
const db = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// Получить пользователя по ID
exports.getEmploye = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

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
    const validSortFields = [
      "registrationDate",
      "programmingLanguage",
      "country",
      "mentorName",
      "englishLevel",
      "position",
    ];
    const sortField = validSortFields.includes(sortBy)
      ? sortBy
      : "registrationDate";
    const sortOrder = order === "DESC" ? "DESC" : "ASC";

    // Выбор полей для отображения
    const attributes =
      req.user.role === "admin"
        ? null
        : [
            "firstName",
            "lastName",
            "middleName",
            "birthDate",
            "phone",
            "email",
            "programmingLanguage",
            "position",
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

    // Проверяем, что пользователь имеет права для редактирования (если это не администратор, он может редактировать только себя)
    if (req.user.userId !== parseInt(userId) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    // Поля, которые могут быть обновлены обычными сотрудниками
    const employeeAllowedFields = [
      "firstName",
      "lastName",
      "middleName",
      "birthDate",
      "phone",
      "email",
      "programmingLanguage",
      "country",
      "bankCard",
      "linkedinLink",
      "githubLink",
    ];

    // Поля, которые могут быть обновлены только администратором
    const adminOnlyFields = [
      "hireDate",
      "adminNote",
      "currentProject",
      "englishLevel",
      "vacationDates",
      "mentorName",
      "position",
      "salary",
      "role",
      "password",
      "workingHoursPerWeek",
    ];

    const updateData = {};

    // Если пользователь - администратор, разрешаем обновление всех полей
    if (req.user.role === "admin") {
      const allFields = [...adminOnlyFields, ...employeeAllowedFields];
      allFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });
    } else {
      // Для обычных сотрудников разрешаем только определенные поля
      employeeAllowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      // Проверяем, что сотрудник не пытается обновить запрещенные поля
      for (const field of adminOnlyFields) {
        if (req.body[field] !== undefined) {
          return res.status(403).json({
            error: `Только администратор может обновлять поле ${field}`,
          });
        }
      }
    }

    // Проверка на наличие другого пользователя с таким же email
    if (updateData.email) {
      const existingUser = await db.User.findOne({
        where: { email: updateData.email, id: { [Op.ne]: userId } },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Пользователь с таким email уже существует" });
      }
    }

    if (updateData.vacationDates && !Array.isArray(updateData.vacationDates)) {
      updateData.vacationDates = [updateData.vacationDates];
    }

    // Хеширование пароля, если он обновляется
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Обновление данных пользователя
    const user = await db.User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    
    await user.update(updateData);

    // Создаем уведомление для администратора, если данные обновляет не администратор
    if (req.user.role !== "admin") {
      const admins = await db.User.findAll({ where: { role: "admin" } });
      for (const admin of admins) {
        await db.Notification.create({
          message: `Сотрудник ${user.firstName} ${
            user.lastName
          } обновил свои данные: ${Object.keys(updateData).join(", ")}`,
          userId: admin.id, // Администратор — получатель уведомления
          relatedUserId: user.id, // Сотрудник — инициатор уведомления
          type: "user_update",
          eventDate: new Date(), // Текущая дата
        });
      }
    }

    res.json({ message: "Данные обновлены", user });
  } catch (err) {
    next(err);
  }
};

// Метод для администратора по созданию сотрудника
exports.createEmployee = async (req, res, next) => {
  try {
    // Проверка роли пользователя
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
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
      bankCard,
      linkedinLink,
      hireDate,
      adminNote,
      currentProject,
      englishLevel,
      githubLink,
      vacationDates,
      mentorName,
      position,
      salary,
      role,
      workingHoursPerWeek,
      // Добавьте другие поля по необходимости
    } = req.body;

    // Проверка на существование пользователя с таким email
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Пользователь с таким email уже существует" });
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
      bankCard,
      linkedinLink,
      hireDate,
      adminNote,
      currentProject,
      englishLevel,
      githubLink,
      vacationDates,
      mentorName,
      position,
      salary,
      role: role || 'employee',
      workingHoursPerWeek,
      // Добавьте другие поля по необходимости
    });

    res
      .status(201)
      .json({ message: "Сотрудник успешно создан", user: newUser });
  } catch (err) {
    next(err);
  }
};

// Метод для администратора по удалению сотрудника
exports.deleteEmployee = async (req, res, next) => {
  try {
    // Проверка роли пользователя
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const userId = req.params.id;

    // Предотвращение удаления самого себя
    if (req.user.userId === parseInt(userId)) {
      return res.status(400).json({ error: "Нельзя удалить самого себя" });
    }

    // Проверка, что пользователь существует и является сотрудником
    const user = await db.User.findOne({
      where: { id: userId, role: "employee" },
    });
    if (!user) {
      return res.status(404).json({ error: "Сотрудник не найден" });
    }

    // Удаление сотрудника

    await user.destroy();

    // Не надо создавать уведомление для администратора о удалении сотрудника

    res.json({ message: "Сотрудник успешно удален" });
  } catch (err) {
    next(err);
  }
};
