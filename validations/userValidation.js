// validations/userValidation.js
const { body } = require('express-validator');

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
];
