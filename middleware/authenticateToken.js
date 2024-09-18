// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../models');

module.exports = async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: 'Токен не предоставлен' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await db.User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    req.user = { userId: user.id, role: user.role };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Недействительный токен' });
  }
};
