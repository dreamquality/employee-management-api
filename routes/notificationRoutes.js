// routes/notificationRoutes.js
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
 *     summary: Получить список уведомлений текущего пользователя
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Необходима авторизация
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
 *       404:
 *         description: Уведомление не найдено
 */
router.patch('/notifications/:id/mark-as-read', authenticateToken, notificationController.markAsRead);

module.exports = router;
