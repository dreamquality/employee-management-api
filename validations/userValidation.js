// validations/userValidation.js
const {  body, query, validationResult } = require('express-validator');

exports.userUpdateValidation = [
  body('firstName').optional().notEmpty().withMessage('Имя не может быть пустым'),
  body('lastName').optional().notEmpty().withMessage('Фамилия не может быть пустой'),
  body('middleName').optional().notEmpty().withMessage('Отчество не может быть пустым'),
  body('birthDate').optional().isDate().withMessage('Некорректная дата рождения'),
  body('phone').optional().notEmpty().withMessage('Телефон не может быть пустым'),
  body('email').optional().isEmail().withMessage('Некорректный email'),
  body('programmingLanguage').optional().notEmpty().withMessage('Язык программирования не может быть пустым'),
  body('country').optional().notEmpty().withMessage('Страна не может быть пустой'),
  body('bankCard').optional().notEmpty().withMessage('Банковская карта не может быть пустой'),
  body('workingHoursPerWeek')
  .optional()
  .custom((value, { req }) => {
    if (req.user.role !== 'admin') {
      throw new Error('Поле "workingHoursPerWeek" можно изменять только администратору');
    }
    return true;
  })
  .isInt({ min: 0 })
  .withMessage('Параметр "workingHoursPerWeek" должен быть положительным целым числом'),
];

exports.userCreateValidation = [
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать не менее 6 символов'),
  body('firstName').notEmpty().withMessage('Имя обязательно'),
  body('lastName').notEmpty().withMessage('Фамилия обязательна'),
  body('workingHoursPerWeek')
  .optional()
  .isInt({ min: 0 })
  .withMessage('Параметр "workingHoursPerWeek" должен быть положительным целым числом'),
  // Добавьте другие проверки по необходимости
];


exports.userListValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Параметр "page" должен быть положительным целым числом'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Параметр "limit" должен быть положительным целым числом'),
  query('firstName').optional().isString(),
  query('lastName').optional().isString(),
  query('sortBy').optional().isIn(['registrationDate', 'programmingLanguage', 'country', 'mentorName', 'englishLevel']),
  query('order').optional().isIn(['ASC', 'DESC']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];