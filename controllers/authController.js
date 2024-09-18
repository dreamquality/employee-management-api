// controllers/authController.js
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/appConfig');

exports.register = async (req, res, next) => {
  try {
    const { email, password, role, secretWord } = req.body;

    if (role === 'admin') {
      // Проверка секретного слова
      if (secretWord !== config.secretWord) {
        return res.status(403).json({ error: 'Неверное секретное слово для регистрации администратора' });
      }
    }

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован', userId: user.id });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Неверные учетные данные' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Неверные учетные данные' });
    }

    user.lastLoginDate = new Date();
    await user.save();

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, { expiresIn: '8h' });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};
