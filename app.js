// app.js
const express = require('express');
const app = express();
const config = require('./config/appConfig');
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

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Если возникла ошибка парсинга JSON
    console.error('Ошибка парсинга JSON:', err.message);
    return res.status(400).json({
      error: 'Некорректный JSON в запросе',
    });
  }
  next();
});

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
        hireDate: '2020-04-04',
      });
      console.log('Администратор по умолчанию создан: admin@example.com / adminpassword');
    }

    // Запуск планировщика уведомлений
    scheduleNotifications();

    app.listen(config.port, () => {http://localhost:3000/api-docs
      console.log(`Сервер запущен на порту ${config.port}`);
      console.log(`OpenAPI по ссылке http://localhost:${config.port}/api-docs`);
    });
  } catch (err) {
    logger.error('Не удалось запустить приложение:', err);
  }
}).catch((err) => {
  logger.error('Ошибка синхронизации базы данных:', err);
});

module.exports = app;
