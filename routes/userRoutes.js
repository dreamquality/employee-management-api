// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');
const validateInput = require('../middleware/validateInput');
const { userUpdateValidation, userCreateValidation, userListValidation } = require('../validations/userValidation');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User routes
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new employee (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: Employee successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid data or user already exists
 *       403:
 *         description: Access denied
 */
router.post('/users', authenticateToken, userCreateValidation, validateInput, userController.createEmployee);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete an employee (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee successfully deleted
 *       403:
 *         description: Access denied
 *       404:
 *         description: Employee not found
 */
router.delete('/users/:id', authenticateToken, userController.deleteEmployee);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users with pagination, search, and sorting
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: Search by first name
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Search by last name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [registrationDate, programmingLanguage, country, mentorName, englishLevel, position]
 *           default: registrationDate
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of users with pagination
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
 *                   description: Total number of users
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Authorization required
 *       403:
 *         description: Access denied
 */
router.get('/users', authenticateToken, userListValidation, userController.getEmployees);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
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
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid data
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
router.put('/users/:id', authenticateToken, userUpdateValidation, validateInput, userController.updateProfile);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get an employee by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Employee not found
 */
router.get('/users/:id', authenticateToken, userController.getEmploye);

module.exports = router;
