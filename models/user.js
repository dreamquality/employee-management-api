// models/user.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      middleName: { type: DataTypes.STRING, allowNull: false },
      birthDate: { type: DataTypes.DATEONLY, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      programmingLanguage: { type: DataTypes.STRING, allowNull: false },
      country: { type: DataTypes.STRING },
      bankCard: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('employee', 'admin'), defaultValue: 'employee' },
      registrationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      lastLoginDate: { type: DataTypes.DATE },
      // Поля только для администратора
      salary: { type: DataTypes.FLOAT, defaultValue: 400 },
      lastSalaryIncreaseDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      position: { type: DataTypes.STRING },
      mentorName: { type: DataTypes.STRING },
      vacationDates: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
      githubLink: { type: DataTypes.STRING },
      linkedinLink: { type: DataTypes.STRING },
      adminNote: { type: DataTypes.TEXT },
      currentProject: { type: DataTypes.STRING },
      englishLevel: { type: DataTypes.STRING },
    });
  
    return User;
  };
  