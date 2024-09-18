// app.js
const express = require('express');
const app = express();
const config = require('./config/config');
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middleware/errorHandler');
const { scheduleNotifications } = require('./services/notificationService');
const bcrypt = require('bcryptjs');
const logger = require('./utils/logger');
const { swaggerUi, swaggerSpec } = require('./swagger');
const morgan = require('morgan');

// Middleware
app.use(express.json());

// Логирование HTTP-запросов
app.use(morgan('combined'));

// Swagger документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Маршруты
app.use(authRoutes);
app.use(userRoutes);
app.use(notificationRoutes);

// Обработчик ошибок
app.use(errorHandler);

// Синхронизация базы данных и запуск сервера
db.sequelize.sync({ force: false }).then(async () => {
  try {
    // Создание администратора по умолчанию, если его нет
    const existingAdmin = await db.User.findOne({ where: { role: 'admin' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('adminpassword', 10);
      await db.User.create({
        firstName: 'Default',
        lastName: 'Admin',
        middleName: 'User',
        birthDate: '1970-01-01',
        phone: '+0000000000',
        email: 'admin@example.com',
        programmingLanguage: 'N/A',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Администратор по умолчанию создан: admin@example.com / adminpassword');
    }

    // Запуск планировщика уведомлений
    scheduleNotifications();

    app.listen(config.port, () => {
      console.log(`Сервер запущен на порту ${config.port}`);
    });
  } catch (err) {
    logger.error('Не удалось запустить приложение:', err);
  }
}).catch((err) => {
  logger.error('Ошибка синхронизации базы данных:', err);
});

module.exports = app;
