const { Doctor } = require('./doctor.model')
const { Appointment } = require('../appointments/appointment.model')
const { ApiError } = require('../../utils/api-error')

function generateSlots(startTime, endTime, slotMinutes = 30) {
  const slots = []
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  let current = sh * 60 + sm
  const end = eh * 60 + em
  while (current < end) {
    const h = String(Math.floor(current / 60)).padStart(2, '0')
    const m = String(current % 60).padStart(2, '0')
    slots.push(`${h}:${m}`)
    current += slotMinutes
  }
  return slots
}

async function listDoctors({ specialty, active = true } = {}) {
  const filter = { active }
  if (specialty) filter.specialty = new RegExp(specialty, 'i')
  return Doctor.find(filter).sort({ name: 1 })
}

async function getDoctorById(id) {
  const doctor = await Doctor.findById(id)
  if (!doctor) throw new ApiError(404, 'Médico não encontrado')
  return doctor
}

async function createDoctor(data) {
  const existing = await Doctor.findOne({ crm: data.crm })
  if (existing) throw new ApiError(409, 'CRM já cadastrado')

  return Doctor.create(data)
}

async function updateDoctor(id, data) {
  const doctor = await Doctor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  })
  if (!doctor) throw new ApiError(404, 'Médico não encontrado')
  return doctor
}

async function deactivateDoctor(id) {
  const doctor = await Doctor.findByIdAndUpdate(
    id,
    { active: false },
    { new: true }
  )
  if (!doctor) throw new ApiError(404, 'Médico não encontrado')
  return doctor
}

async function getAvailableSlots(doctorId, date) {
  const doctor = await Doctor.findById(doctorId)
  if (!doctor || !doctor.active) throw new ApiError(404, 'Médico não encontrado')

  const [y, m, d] = date.split('-').map(Number)
  const dayOfWeek = new Date(y, m - 1, d).getDay()

  const daySchedule = doctor.schedule.find((s) => s.dayOfWeek === dayOfWeek)
  if (!daySchedule) return { doctor, slots: [] }

  const allSlots = generateSlots(daySchedule.startTime, daySchedule.endTime)

  const booked = await Appointment.find({
    doctorId,
    appointmentDate: date,
    status: 'SCHEDULED'
  }).select('appointmentTime -_id')

  const bookedSet = new Set(booked.map((a) => a.appointmentTime))
  const slots = allSlots.filter((s) => !bookedSet.has(s))

  return { doctor, slots, startTime: daySchedule.startTime, endTime: daySchedule.endTime }
}

module.exports = {
  listDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deactivateDoctor,
  getAvailableSlots
}
