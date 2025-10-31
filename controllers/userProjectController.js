const db = require('../models');

// Get all projects for a specific user
exports.getUserProjects = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userProjects = await db.UserProject.findAll({
      where: { userId },
      include: [{
        model: db.Project,
        as: 'project',
        attributes: ['id', 'name', 'description']
      }],
      order: [['assignedAt', 'DESC']]
    });

    res.json({ projects: userProjects });
  } catch (err) {
    next(err);
  }
};

// Assign projects to a user (replaces all existing assignments)
exports.setUserProjects = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { projectIds, primaryProjectId } = req.body;

    if (!Array.isArray(projectIds)) {
      return res.status(400).json({ error: 'projectIds must be an array' });
    }

    // Verify user exists
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify all projects exist
    const projects = await db.Project.findAll({
      where: { id: projectIds }
    });

    if (projects.length !== projectIds.length) {
      return res.status(400).json({ error: 'One or more project IDs are invalid' });
    }

    // Verify primary project is in the list
    if (primaryProjectId && !projectIds.includes(primaryProjectId)) {
      return res.status(400).json({ error: 'Primary project must be in the project list' });
    }

    // Remove all existing assignments
    await db.UserProject.destroy({ where: { userId } });

    // Create new assignments
    const assignments = projectIds.map((projectId, index) => ({
      userId,
      projectId,
      isPrimary: projectId === primaryProjectId,
      assignedAt: new Date()
    }));

    await db.UserProject.bulkCreate(assignments);

    // Fetch and return updated assignments
    const userProjects = await db.UserProject.findAll({
      where: { userId },
      include: [{
        model: db.Project,
        as: 'project',
        attributes: ['id', 'name', 'description']
      }],
      order: [['isPrimary', 'DESC'], ['assignedAt', 'DESC']]
    });

    res.json({ projects: userProjects });
  } catch (err) {
    next(err);
  }
};

// Add a single project to user
exports.addUserProject = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { projectId, isPrimary } = req.body;

    // Verify user exists
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify project exists
    const project = await db.Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if already assigned
    const existing = await db.UserProject.findOne({
      where: { userId, projectId }
    });

    if (existing) {
      return res.status(400).json({ error: 'Project already assigned to user' });
    }

    // If setting as primary, unset other primary projects
    if (isPrimary) {
      await db.UserProject.update(
        { isPrimary: false },
        { where: { userId, isPrimary: true } }
      );
    }

    // Create assignment
    const assignment = await db.UserProject.create({
      userId,
      projectId,
      isPrimary: isPrimary || false
    });

    const userProject = await db.UserProject.findByPk(assignment.id, {
      include: [{
        model: db.Project,
        as: 'project',
        attributes: ['id', 'name', 'description']
      }]
    });

    res.json({ project: userProject });
  } catch (err) {
    next(err);
  }
};

// Remove a project from user
exports.removeUserProject = async (req, res, next) => {
  try {
    const { userId, projectId } = req.params;

    const assignment = await db.UserProject.findOne({
      where: { userId, projectId }
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Project assignment not found' });
    }

    await assignment.destroy();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Set primary project for user
exports.setPrimaryProject = async (req, res, next) => {
  try {
    const { userId, projectId } = req.params;

    // Verify assignment exists
    const assignment = await db.UserProject.findOne({
      where: { userId, projectId }
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Project assignment not found' });
    }

    // Unset all primary flags for this user
    await db.UserProject.update(
      { isPrimary: false },
      { where: { userId, isPrimary: true } }
    );

    // Set this project as primary
    await assignment.update({ isPrimary: true });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
