// routes/userRoutes.js
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
 *     summary: Получить список пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', authenticateToken, userController.getEmployees);

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
