// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/notifications', authenticateToken, notificationController.getNotifications);
router.post('/notifications/:id/read', authenticateToken, notificationController.markAsRead);

module.exports = router;
