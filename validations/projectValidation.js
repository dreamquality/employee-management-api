// validations/projectValidation.js
const { body, query } = require('express-validator');

exports.projectCreateValidation = [
  body('name')
    .notEmpty().withMessage('Имя проекта обязательно')
    .isLength({ min: 2, max: 100 }).withMessage('Имя проекта должно быть от 2 до 100 символов')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Описание не должно превышать 500 символов')
    .trim(),
];

exports.projectUpdateValidation = [
  body('name')
    .optional({ checkFalsy: true })
    .notEmpty().withMessage('Имя проекта не может быть пустым')
    .isLength({ min: 2, max: 100 }).withMessage('Имя проекта должно быть от 2 до 100 символов')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Описание не должно превышать 500 символов')
    .trim(),
];

exports.projectSearchValidation = [
  query('query')
    .notEmpty().withMessage('Параметр query обязателен')
    .isLength({ min: 1, max: 100 }).withMessage('Параметр query должен быть от 1 до 100 символов')
    .trim(),
];
