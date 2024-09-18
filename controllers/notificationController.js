// controllers/notificationController.js
const db = require('../models');

exports.getNotifications = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const notifications = await db.Notification.findAll({
      where: { userId: req.user.userId },
      order: [['createdAt', 'DESC']],
    });

    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const { id } = req.params;

    const notification = await db.Notification.findOne({
      where: { id, userId: req.user.userId },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Уведомление не найдено' });
    }

    await notification.update({ isRead: true });

    res.json({ message: 'Уведомление отмечено как прочитанное' });
  } catch (err) {
    next(err);
  }
};
