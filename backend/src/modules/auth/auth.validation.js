const { body } = require('express-validator');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('cpf').trim().notEmpty().withMessage('CPF é obrigatório'),
  body('phone').trim().notEmpty().withMessage('Telefone é obrigatório'),
  body('role').optional().isIn(['PATIENT', 'SECRETARY', 'ADMIN'])
];

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
];

module.exports = { registerValidation, loginValidation };