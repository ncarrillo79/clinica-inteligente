const { body } = require('express-validator')

const createDoctorValidation = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('specialty').trim().notEmpty().withMessage('Especialidade é obrigatória'),
  body('crm')
    .trim()
    .notEmpty()
    .withMessage('CRM é obrigatório')
    .matches(/^\d{4,6}(-[A-Z]{2})?$/)
    .withMessage('CRM inválido (ex: 123456-SP)'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('phone').optional().trim(),
  body('schedule').optional().isArray().withMessage('Agenda deve ser um array'),
  body('schedule.*.dayOfWeek')
    .isInt({ min: 0, max: 6 })
    .withMessage('Dia da semana deve ser 0 (domingo) a 6 (sábado)'),
  body('schedule.*.startTime')
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('Horário de início inválido (HH:mm)'),
  body('schedule.*.endTime')
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('Horário de término inválido (HH:mm)')
]

const updateDoctorValidation = [
  body('name').optional().trim().notEmpty().withMessage('Nome não pode ser vazio'),
  body('specialty').optional().trim().notEmpty(),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('phone').optional().trim(),
  body('schedule').optional().isArray(),
  body('schedule.*.dayOfWeek').optional().isInt({ min: 0, max: 6 }),
  body('schedule.*.startTime').optional().matches(/^\d{2}:\d{2}$/),
  body('schedule.*.endTime').optional().matches(/^\d{2}:\d{2}$/)
]

module.exports = { createDoctorValidation, updateDoctorValidation }
