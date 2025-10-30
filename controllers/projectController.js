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
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

// Search projects by name (for autocomplete/hints)
exports.searchProjects = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Параметр query обязателен" });
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
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await db.Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Проект не найден" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
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

    res.status(201).json({ message: "Проект успешно создан", project: newProject });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
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

    await project.update({ name, description });

    res.json({ message: "Проект обновлен", project });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
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

    res.json({ message: "Проект успешно удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};
