const { Router } = require('express')
const router = Router()

const {
  createAppointmentController,
  getMyAppointmentsController,
  cancelAppointmentController
} = require('./appointment.controller')

const { authMiddleware } = require('../../middlewares/auth.middleware')
const { validateRequest } = require('../../middlewares/validate.middleware')
const { asyncHandler } = require('../../utils/async-handler')
const { createAppointmentValidation } = require('./appointment.validation')

/**
 * @openapi
 * /appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Criar nova consulta
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorName, specialty, appointmentDate, appointmentTime]
 *             properties:
 *               doctorName: { type: string }
 *               specialty: { type: string }
 *               appointmentDate: { type: string, example: "2025-08-15" }
 *               appointmentTime: { type: string, example: "10:00" }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Consulta agendada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Horário já ocupado
 *       401:
 *         description: Não autenticado
 *       422:
 *         description: Dados inválidos
 */
router.post(
  '/',
  authMiddleware,
  createAppointmentValidation,
  validateRequest,
  asyncHandler(createAppointmentController)
)

/**
 * @openapi
 * /appointments/my:
 *   get:
 *     tags: [Appointments]
 *     summary: Listar minhas consultas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de consultas do usuário
 *       401:
 *         description: Não autenticado
 */
router.get('/my', authMiddleware, asyncHandler(getMyAppointmentsController))

/**
 * @openapi
 * /appointments/{id}/cancel:
 *   patch:
 *     tags: [Appointments]
 *     summary: Cancelar consulta
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Consulta cancelada com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Consulta não encontrada
 */
router.patch(
  '/:id/cancel',
  authMiddleware,
  asyncHandler(cancelAppointmentController)
)

module.exports = router
