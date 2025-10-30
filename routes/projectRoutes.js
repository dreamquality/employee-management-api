// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middleware/authenticateToken');
const validateInput = require('../middleware/validateInput');
const {
  projectCreateValidation,
  projectUpdateValidation,
  projectSearchValidation,
} = require('../validations/projectValidation');

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management routes
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     description: Returns a list of all projects. Available to all authenticated users.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       401:
 *         description: Authorization required
 */
router.get('/projects', authenticateToken, projectController.getAllProjects);

/**
 * @swagger
 * /projects/search:
 *   get:
 *     summary: Search projects by name
 *     description: Search for projects by name pattern. Returns up to 10 matching results for autocomplete/hints.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search query string
 *         example: Alpha
 *     responses:
 *       200:
 *         description: List of matching projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid query parameter
 *       401:
 *         description: Authorization required
 */
router.get(
  '/projects/search',
  authenticateToken,
  projectSearchValidation,
  validateInput,
  projectController.searchProjects
);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       401:
 *         description: Authorization required
 */
router.get('/projects/:id', authenticateToken, projectController.getProjectById);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project (admin only)
 *     description: Admin-only endpoint to create new projects.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Project Zeta
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: A new exciting project
 *     responses:
 *       201:
 *         description: Project successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Проект успешно создан
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid data or project already exists
 *       403:
 *         description: Access denied (not admin)
 *       401:
 *         description: Authorization required
 */
router.post(
  '/projects',
  authenticateToken,
  projectCreateValidation,
  validateInput,
  projectController.createProject
);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update a project (admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Project Alpha Updated
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Проект обновлен
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid data
 *       403:
 *         description: Access denied (not admin)
 *       404:
 *         description: Project not found
 *       401:
 *         description: Authorization required
 */
router.put(
  '/projects/:id',
  authenticateToken,
  projectUpdateValidation,
  validateInput,
  projectController.updateProject
);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project (admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project successfully deleted
 *       403:
 *         description: Access denied (not admin)
 *       404:
 *         description: Project not found
 *       401:
 *         description: Authorization required
 */
router.delete('/projects/:id', authenticateToken, projectController.deleteProject);

module.exports = router;
