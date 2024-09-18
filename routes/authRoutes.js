// routes/authRoutes.js
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Маршруты аутентификации
 */

 /**
  * @swagger
  * /register:
  *   post:
  *     summary: Регистрация нового пользователя
  *     tags: [Auth]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Register'
  *     responses:
  *       201:
  *         description: Пользователь успешно зарегистрирован
  *       400:
  *         description: Неверные данные
  */
 router.post('/register', registerValidation, validateInput, authController.register);

 /**
  * @swagger
  * /login:
  *   post:
  *     summary: Вход пользователя
  *     tags: [Auth]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Login'
  *     responses:
  *       200:
  *         description: Успешный вход
  *       400:
  *         description: Неверные учетные данные
  */
router.post('/login', loginValidation, validateInput, authController.login);

module.exports = router;
