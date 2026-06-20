const { Router } = require('express')
const { query } = require('express-validator')
const { asyncHandler } = require('../../utils/async-handler')
const { validateRequest } = require('../../middlewares/validate.middleware')
const { getWeatherController } = require('./weather.controller')

const router = Router()

const weatherValidation = [
  query('city').trim().notEmpty().withMessage('Cidade é obrigatória'),
  query('date')
    .notEmpty()
    .withMessage('Data é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Data deve estar no formato YYYY-MM-DD')
]

router.get('/', weatherValidation, validateRequest, asyncHandler(getWeatherController))

module.exports = router
