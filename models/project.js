// models/project.js
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      schema: "public",
      tableName: "Projects",
      timestamps: true,
    }
  );

  Project.associate = function(models) {
    // Many-to-many relationship with Users through UserProjects
    Project.belongsToMany(models.User, {
      through: models.UserProject,
      as: 'users',
      foreignKey: 'projectId',
      otherKey: 'userId'
    });
  };

  return Project;
};
