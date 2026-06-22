const {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  recordOutcome
} = require('./appointment.service')

async function createAppointmentController(req, res) {
  const appointment = await createAppointment(req.body, req.user._id)

  return res.status(201).json({
    success: true,
    message: 'Consulta agendada com sucesso',
    data: appointment
  })
}

async function getMyAppointmentsController(req, res) {
  const { page, limit } = req.query
  const result = await getMyAppointments(req.user._id, {
    page: page ? Math.max(1, parseInt(page, 10)) : 1,
    limit: limit ? Math.min(50, parseInt(limit, 10)) : 10
  })

  return res.status(200).json({ success: true, ...result })
}

async function cancelAppointmentController(req, res) {
  const appointment = await cancelAppointment(req.params.id, req.user._id)

  return res.status(200).json({
    success: true,
    message: 'Consulta cancelada com sucesso',
    data: appointment
  })
}

async function recordOutcomeController(req, res) {
  const appointment = await recordOutcome(req.params.id, req.body.outcome)

  return res.status(200).json({
    success: true,
    message: `Desfecho registrado: ${req.body.outcome}`,
    data: appointment
  })
}

module.exports = {
  createAppointmentController,
  getMyAppointmentsController,
  cancelAppointmentController,
  recordOutcomeController
}