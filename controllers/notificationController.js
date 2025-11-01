const db = require('../models');

exports.getNotifications = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { type, sortBy, order } = req.query;
    
    const sortField = sortBy === 'type' ? 'type' : 'createdAt';
    const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';

    const where = {};
    if (type) {
      where.type = type;
    }

    const { count, rows } = await db.Notification.findAndCountAll({
      where: { userId: req.user.userId, ...where },
      order: [[sortField, sortOrder]],
      limit,
      offset,
    });

    res.json({
      notifications: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    next(err);
  }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const count = await db.Notification.count({
      where: { 
        userId: req.user.userId,
        isRead: false
      }
    });

    res.json({ unreadCount: count });
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
