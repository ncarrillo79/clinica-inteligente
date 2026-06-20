const { body } = require('express-validator')

const createAppointmentValidation = [
  body('doctorName')
    .trim()
    .notEmpty()
    .withMessage('Nome do médico é obrigatório'),

  body('specialty')
    .trim()
    .notEmpty()
    .withMessage('Especialidade é obrigatória'),

  body('appointmentDate')
    .notEmpty()
    .withMessage('Data é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Data deve estar no formato YYYY-MM-DD')
    .custom((value) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const date = new Date(`${value}T00:00:00`)
      if (isNaN(date.getTime())) throw new Error('Data inválida')
      if (date < today) throw new Error('A data da consulta deve ser no futuro')
      return true
    }),

  body('appointmentTime')
    .notEmpty()
    .withMessage('Hora é obrigatória')
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('Hora deve estar no formato HH:mm')
    .custom((value) => {
      const [h, m] = value.split(':').map(Number)
      if (h < 0 || h > 23 || m < 0 || m > 59) {
        throw new Error('Hora inválida')
      }
      return true
    }),

  body('notes').optional().trim()
]

module.exports = { createAppointmentValidation }
