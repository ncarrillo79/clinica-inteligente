const {
  createAppointment,
  getMyAppointments,
  cancelAppointment
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
  const appointments = await getMyAppointments(req.user._id)

  return res.status(200).json({
    success: true,
    data: appointments
  })
}

async function cancelAppointmentController(req, res) {
  const appointment = await cancelAppointment(req.params.id, req.user._id)

  return res.status(200).json({
    success: true,
    message: 'Consulta cancelada com sucesso',
    data: appointment
  })
}

module.exports = {
  createAppointmentController,
  getMyAppointmentsController,
  cancelAppointmentController
}