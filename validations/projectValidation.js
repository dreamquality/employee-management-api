// validations/projectValidation.js
const { body } = require('express-validator');

exports.projectValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Название проекта обязательно')
    .isLength({ min: 2, max: 100 })
    .withMessage('Название проекта должно быть от 2 до 100 символов'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Описание проекта обязательно')
    .isLength({ min: 10 })
    .withMessage('Описание проекта должно быть не менее 10 символов'),
  body('wage')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Ставка должна быть положительным числом'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Поле active должно быть булевым значением'),
];

exports.projectUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Название проекта не может быть пустым')
    .isLength({ min: 2, max: 100 })
    .withMessage('Название проекта должно быть от 2 до 100 символов'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Описание проекта не может быть пустым')
    .isLength({ min: 10 })
    .withMessage('Описание проекта должно быть не менее 10 символов'),
  body('wage')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Ставка должна быть положительным числом'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Поле active должно быть булевым значением'),
];
