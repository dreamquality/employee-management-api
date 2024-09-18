// validations/authValidation.js
const { body } = require('express-validator');

exports.registerValidation = [
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
  body('firstName').notEmpty().withMessage('Имя обязательно'),
  body('lastName').notEmpty().withMessage('Фамилия обязательна'),
  body('middleName').notEmpty().withMessage('Отчество обязательно'),
  body('birthDate').isDate().withMessage('Некорректная дата рождения'),
  body('phone').notEmpty().withMessage('Телефон обязателен'),
  body('programmingLanguage').notEmpty().withMessage('Язык программирования обязателен'),
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').notEmpty().withMessage('Пароль обязателен'),
];

exports.adminRegisterValidation = [
  ...this.registerValidation,
  body('secretWord')
    .custom((value) => value === process.env.SECRET_WORD)
    .withMessage('Неверное секретное слово'),
];
