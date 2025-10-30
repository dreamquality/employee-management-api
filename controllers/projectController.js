// controllers/projectController.js
const db = require("../models");
const { Op } = require("sequelize");

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await db.Project.findAll({
      attributes: ['id', 'name', 'description'],
      order: [['name', 'ASC']],
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера", details: error.message });
  }
};

// Search projects by name (for autocomplete/hints)
exports.searchProjects = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Параметр query обязателен" });
    }

    const projects = await db.Project.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`,
        },
      },
      attributes: ['id', 'name', 'description'],
      order: [['name', 'ASC']],
      limit: 10, // Limit results for autocomplete
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера", details: error.message });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await db.Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Проект не найден" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера", details: error.message });
  }
};

// Create a new project (admin only)
exports.createProject = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { name, description } = req.body;

    // Check if project with this name already exists
    const existingProject = await db.Project.findOne({ where: { name } });
    if (existingProject) {
      return res.status(400).json({ error: "Проект с таким именем уже существует" });
    }

    const newProject = await db.Project.create({
      name,
      description,
    });

    res.status(201).json({ project: newProject });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера", details: error.message });
  }
};

// Update a project (admin only)
exports.updateProject = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { name, description } = req.body;
    if (typeof name === "undefined" && typeof description === "undefined") {
      return res.status(400).json({ error: "Необходимо указать хотя бы одно поле для обновления (name или description)" });
    }
    const project = await db.Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Проект не найден" });
    }

    // Check if another project with this name already exists
    if (name && name !== project.name) {
      const existingProject = await db.Project.findOne({
        where: {
          name,
          id: { [Op.ne]: req.params.id },
        },
      });

      if (existingProject) {
        return res.status(400).json({ error: "Проект с таким именем уже существует" });
      }
    }

    await project.update(Object.fromEntries(Object.entries({ name, description }).filter(([_, v]) => v !== undefined)));

    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера", details: error.message });
  }
};

// Delete a project (admin only)
exports.deleteProject = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const project = await db.Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Проект не найден" });
    }

    await project.destroy();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера", details: error.message });
  }
};
