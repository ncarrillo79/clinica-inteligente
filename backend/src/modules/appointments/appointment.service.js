const { Appointment } = require('./appointment.model')
const { ApiError } = require('../../utils/api-error')
const { getWeatherForecast } = require('../weather/weather.service')
const { computeNoShowRisk } = require('../prediction/prediction.service')

async function createAppointment(data, userId) {
  const conflictQuery = {
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    status: 'SCHEDULED'
  }
  if (data.doctorId) {
    conflictQuery.doctorId = data.doctorId
  } else {
    conflictQuery.doctorName = data.doctorName
  }

  const existing = await Appointment.findOne(conflictQuery)
  if (existing) {
    throw new ApiError(400, 'Horário já está ocupado')
  }

  // --- Temporal features ---
  const [year, month, day] = data.appointmentDate.split('-').map(Number)
  const apptDateObj = new Date(year, month - 1, day)
  const dayOfWeek = apptDateObj.getDay()
  const appointmentHour = parseInt(data.appointmentTime.split(':')[0], 10)
  const todayMidnight = new Date()
  todayMidnight.setHours(0, 0, 0, 0)
  const leadTimeDays = Math.round((apptDateObj - todayMidnight) / 86400000)

  // --- Patient history snapshot (before inserting the new appointment) ---
  const [patientPriorNoShows, patientTotalAppointments] = await Promise.all([
    Appointment.countDocuments({ patientId: userId, status: 'NO_SHOW' }),
    Appointment.countDocuments({ patientId: userId })
  ])

  // --- Weather ---
  let weather = {
    willRain: false,
    description: 'sem informação',
    temperature: null,
    alert: null
  }
  let weatherRainProbability = null

  try {
    const weatherResult = await getWeatherForecast(
      data.city || 'São Paulo',
      data.appointmentDate
    )

    weatherRainProbability = weatherResult.rainProbability ?? null
    weather = {
      willRain: weatherResult.willRain,
      description: weatherResult.description,
      temperature: weatherResult.temperature,
      alert: weatherResult.willRain
        ? '⚠️ Há chance de chuva no dia da consulta'
        : null
    }
  } catch (error) {
    weather = {
      willRain: false,
      description: 'clima indisponível',
      temperature: null,
      alert: null
    }
  }

  const { noShowRisk, riskLevel } = computeNoShowRisk({
    patientPriorNoShows,
    patientTotalAppointments,
    leadTimeDays,
    weatherRainProbability,
    dayOfWeek,
    appointmentHour
  })

  const appointment = await Appointment.create({
    patientId: userId,
    doctorId: data.doctorId || null,
    doctorName: data.doctorName,
    specialty: data.specialty,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    notes: data.notes || '',
    weather,
    dayOfWeek,
    appointmentHour,
    leadTimeDays,
    weatherRainProbability,
    patientPriorNoShows,
    patientTotalAppointments,
    noShowRisk,
    riskLevel
  })

  return appointment
}

async function getMyAppointments(userId) {
  return Appointment.find({ patientId: userId }).sort({ createdAt: -1 })
}

async function cancelAppointment(id, userId) {
  const appointment = await Appointment.findOne({
    _id: id,
    patientId: userId
  })

  if (!appointment) {
    throw new ApiError(404, 'Consulta não encontrada')
  }

  appointment.status = 'CANCELLED'
  await appointment.save()

  return appointment
}

async function recordOutcome(appointmentId, outcome) {
  const appointment = await Appointment.findById(appointmentId)

  if (!appointment) {
    throw new ApiError(404, 'Consulta não encontrada')
  }

  if (appointment.status !== 'SCHEDULED') {
    throw new ApiError(400, `Consulta não pode ter desfecho registrado: status atual é ${appointment.status}`)
  }

  appointment.status = outcome
  appointment.outcomeRecordedAt = new Date()
  await appointment.save()

  // Quando o paciente falta, atualiza o contador nas consultas futuras dele
  if (outcome === 'NO_SHOW') {
    await Appointment.updateMany(
      { patientId: appointment.patientId, status: 'SCHEDULED' },
      { $inc: { patientPriorNoShows: 1 } }
    )
  }

  return appointment
}

module.exports = {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  recordOutcome
}