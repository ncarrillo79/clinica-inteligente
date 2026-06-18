const { Router } = require('express')
const router = Router()

const {
  createAppointmentController,
  getMyAppointmentsController,
  cancelAppointmentController
} = require('./appointment.controller')

const { authMiddleware } = require('../../middlewares/auth.middleware')

router.post('/', authMiddleware, createAppointmentController)
router.get('/my', authMiddleware, getMyAppointmentsController)
router.patch('/:id/cancel', authMiddleware, cancelAppointmentController)

module.exports = router