const express = require('express');
const router = express.Router();
const userProjectController = require('../controllers/userProjectController');
const authenticateToken = require('../middleware/authenticateToken');

/**
 * @swagger
 * tags:
 *   name: User Projects
 *   description: User project assignment routes
 */

/**
 * @swagger
 * /users/{userId}/projects:
 *   get:
 *     summary: Get all projects assigned to a user
 *     tags: [User Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user projects
 *       404:
 *         description: User not found
 */
router.get('/users/:userId/projects', authenticateToken, userProjectController.getUserProjects);

/**
 * @swagger
 * /users/{userId}/projects:
 *   put:
 *     summary: Set projects for a user (replaces all existing assignments)
 *     tags: [User Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               primaryProjectId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Projects updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.put('/users/:userId/projects', authenticateToken, userProjectController.setUserProjects);

/**
 * @swagger
 * /users/{userId}/projects:
 *   post:
 *     summary: Add a single project to user
 *     tags: [User Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: integer
 *               isPrimary:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Project added successfully
 *       400:
 *         description: Invalid input or project already assigned
 *       404:
 *         description: User or project not found
 */
router.post('/users/:userId/projects', authenticateToken, userProjectController.addUserProject);

/**
 * @swagger
 * /users/{userId}/projects/{projectId}:
 *   delete:
 *     summary: Remove a project from user
 *     tags: [User Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project removed successfully
 *       404:
 *         description: Project assignment not found
 */
router.delete('/users/:userId/projects/:projectId', authenticateToken, userProjectController.removeUserProject);

/**
 * @swagger
 * /users/{userId}/projects/{projectId}/set-primary:
 *   patch:
 *     summary: Set a project as primary for user
 *     tags: [User Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Primary project set successfully
 *       404:
 *         description: Project assignment not found
 */
router.patch('/users/:userId/projects/:projectId/set-primary', authenticateToken, userProjectController.setPrimaryProject);

module.exports = router;
