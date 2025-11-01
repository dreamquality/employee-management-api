// controllers/projectController.js
const db = require("../models");
const { Op } = require("sequelize");

// Get all projects (with optional filtering for active only)
exports.getProjects = async (req, res, next) => {
  try {
    const { active, page = 1, limit = 100, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    // Filter by active status if specified
    if (active !== undefined) {
      where.active = active === 'true';
    }

    // Search by name if provided
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await db.Project.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['name', 'ASC']],
    });

    // Hide wage field for non-admin users
    const projects = rows.map(project => {
      const projectData = project.toJSON();
      if (req.user.role !== 'admin') {
        delete projectData.wage;
      }
      return projectData;
    });

    res.json({
      projects,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// Get a single project by ID
exports.getProject = async (req, res, next) => {
  try {
    const project = await db.Project.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          as: 'employees',
          attributes: ['id', 'firstName', 'lastName', 'email', 'position'],
          through: { attributes: [] }, // Exclude junction table data
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ error: "Проект не найден" });
    }

    const projectData = project.toJSON();
    
    // Hide wage field for non-admin users
    if (req.user.role !== 'admin') {
      delete projectData.wage;
    }

    res.json(projectData);
  } catch (err) {
    next(err);
  }
};

// Create a new project (admin only)
exports.createProject = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { name, description, wage, active } = req.body;

    // Check if project with same name exists
    const existingProject = await db.Project.findOne({ where: { name } });
    if (existingProject) {
      return res.status(400).json({ error: "Проект с таким именем уже существует" });
    }

    const newProject = await db.Project.create({
      name,
      description,
      wage: wage || 0,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({ message: "Проект успешно создан", project: newProject });
  } catch (err) {
    next(err);
  }
};

// Update a project (admin only)
exports.updateProject = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const projectId = req.params.id;
    const { name, description, wage, active } = req.body;

    const project = await db.Project.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({ error: "Проект не найден" });
    }

    // Check if another project with same name exists
    if (name && name !== project.name) {
      const existingProject = await db.Project.findOne({
        where: { name, id: { [Op.ne]: projectId } },
      });
      if (existingProject) {
        return res.status(400).json({ error: "Проект с таким именем уже существует" });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (wage !== undefined) updateData.wage = wage;
    if (active !== undefined) updateData.active = active;

    await project.update(updateData);
    await project.reload();

    res.json({ message: "Проект обновлен", project });
  } catch (err) {
    next(err);
  }
};

// Delete a project (admin only)
exports.deleteProject = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const projectId = req.params.id;
    const project = await db.Project.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({ error: "Проект не найден" });
    }

    await project.destroy();

    res.json({ message: "Проект успешно удален" });
  } catch (err) {
    next(err);
  }
};

// Assign employees to a project (admin only)
exports.assignEmployees = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const projectId = req.params.id;
    const { employeeIds } = req.body;

    if (!Array.isArray(employeeIds)) {
      return res.status(400).json({ error: "employeeIds должен быть массивом" });
    }

    const project = await db.Project.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({ error: "Проект не найден" });
    }

    // Verify all employees exist
    const employees = await db.User.findAll({
      where: { id: employeeIds },
    });

    if (employees.length !== employeeIds.length) {
      return res.status(400).json({ error: "Некоторые сотрудники не найдены" });
    }

    // Set the employees (this will replace existing associations)
    await project.setEmployees(employeeIds);

    res.json({ message: "Сотрудники назначены на проект" });
  } catch (err) {
    next(err);
  }
};

// Add a single employee to a project (admin only)
exports.addEmployee = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const projectId = req.params.id;
    const { employeeId } = req.body;

    const project = await db.Project.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({ error: "Проект не найден" });
    }

    const employee = await db.User.findByPk(employeeId);
    
    if (!employee) {
      return res.status(404).json({ error: "Сотрудник не найден" });
    }

    await project.addEmployee(employee);

    res.json({ message: "Сотрудник добавлен к проекту" });
  } catch (err) {
    next(err);
  }
};

// Remove an employee from a project (admin only)
exports.removeEmployee = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const projectId = req.params.id;
    const employeeId = req.params.employeeId;

    const project = await db.Project.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({ error: "Проект не найден" });
    }

    const employee = await db.User.findByPk(employeeId);
    
    if (!employee) {
      return res.status(404).json({ error: "Сотрудник не найден" });
    }

    await project.removeEmployee(employee);

    res.json({ message: "Сотрудник удален из проекта" });
  } catch (err) {
    next(err);
  }
};
