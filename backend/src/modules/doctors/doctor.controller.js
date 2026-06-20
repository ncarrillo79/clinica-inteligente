const {
  listDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deactivateDoctor,
  getAvailableSlots
} = require('./doctor.service')

async function listDoctorsController(req, res) {
  const { specialty, active } = req.query
  const doctors = await listDoctors({
    specialty,
    active: active === 'false' ? false : true
  })
  return res.status(200).json({ success: true, data: doctors })
}

async function getDoctorController(req, res) {
  const doctor = await getDoctorById(req.params.id)
  return res.status(200).json({ success: true, data: doctor })
}

async function createDoctorController(req, res) {
  const doctor = await createDoctor(req.body)
  return res.status(201).json({
    success: true,
    message: 'Médico cadastrado com sucesso',
    data: doctor
  })
}

async function updateDoctorController(req, res) {
  const doctor = await updateDoctor(req.params.id, req.body)
  return res.status(200).json({
    success: true,
    message: 'Médico atualizado com sucesso',
    data: doctor
  })
}

async function deactivateDoctorController(req, res) {
  await deactivateDoctor(req.params.id)
  return res.status(200).json({
    success: true,
    message: 'Médico desativado com sucesso'
  })
}

async function getDoctorSlotsController(req, res) {
  const { date } = req.query
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ success: false, message: 'Parâmetro date inválido (YYYY-MM-DD)' })
  }
  const result = await getAvailableSlots(req.params.id, date)
  return res.status(200).json({ success: true, data: result })
}

module.exports = {
  listDoctorsController,
  getDoctorController,
  createDoctorController,
  updateDoctorController,
  deactivateDoctorController,
  getDoctorSlotsController
}
