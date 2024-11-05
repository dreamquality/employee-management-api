// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateInput = require('../middleware/validateInput');
const { registerValidation, loginValidation } = require('../validations/authValidation');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid data
 */
router.post('/register', registerValidation, validateInput, authController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', loginValidation, validateInput, authController.login);

module.exports = router;
