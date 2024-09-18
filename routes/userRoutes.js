// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');
const validateInput = require('../middleware/validateInput');
const { userUpdateValidation } = require('../validations/userValidation');
const { userListValidation } = require('../middleware/validateQuery');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Маршруты пользователей
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список пользователей с пагинацией, поиском и сортировкой
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество пользователей на странице
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: Поиск по имени
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Поиск по фамилии
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [registrationDate, programmingLanguage, country, mentorName, englishLevel]
 *           default: registrationDate
 *         description: Поле для сортировки
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: Порядок сортировки
 *     responses:
 *       200:
 *         description: Список пользователей с пагинацией
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 *                   description: Общее количество пользователей
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
router.get('/users', authenticateToken, userListValidation, userController.getEmployees);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Обновить профиль пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID пользователя
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Профиль обновлен
 */
router.put('/users/:id', authenticateToken, userUpdateValidation, validateInput, userController.updateProfile);

module.exports = router;
