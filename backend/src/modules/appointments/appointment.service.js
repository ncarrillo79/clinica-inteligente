const { Appointment } = require('./appointment.model')
const { ApiError } = require('../../utils/api-error')
const { getWeatherForecast } = require('../weather/weather.service')

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

  let weather = {
    willRain: false,
    description: 'sem informação',
    temperature: null,
    alert: null
  }

  try {
    const weatherResult = await getWeatherForecast(
      data.city || 'São Paulo',
      data.appointmentDate
    )

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

  const appointment = await Appointment.create({
    patientId: userId,
    doctorId: data.doctorId || null,
    doctorName: data.doctorName,
    specialty: data.specialty,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    notes: data.notes || '',
    weather
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

module.exports = {
  createAppointment,
  getMyAppointments,
  cancelAppointment
}