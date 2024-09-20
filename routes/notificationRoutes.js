const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticateToken = require('../middleware/authenticateToken');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Маршруты уведомлений
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Получить список уведомлений текущего пользователя с пагинацией
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Тип уведомления для фильтрации
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, type]
 *         description: Поле для сортировки уведомлений
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Порядок сортировки (ASC для возрастания, DESC для убывания)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы для пагинации
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество уведомлений на странице
 *     responses:
 *       200:
 *         description: Список уведомлений
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Необходима авторизация
 *       403:
 *         description: Доступ запрещен
 */
router.get('/notifications', authenticateToken, notificationController.getNotifications);

/**
 * @swagger
 * /notifications/{id}/mark-as-read:
 *   patch:
 *     summary: Отметить уведомление как прочитанное
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID уведомления
 *     responses:
 *       200:
 *         description: Уведомление успешно обновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Необходима авторизация
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Уведомление не найдено
 */
router.patch('/notifications/:id/mark-as-read', authenticateToken, notificationController.markAsRead);

module.exports = router;
