const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null
    },
    doctorName: {
      type: String,
      required: true
    },
    specialty: {
      type: String,
      required: true
    },
    appointmentDate: {
      type: String,
      required: true
    },
    appointmentTime: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'CANCELLED'],
      default: 'SCHEDULED'
    },
    notes: {
      type: String,
      default: ''
    },
    weather: {
      willRain: Boolean,
      description: String,
      temperature: Number,
      alert: String
    }
  },
  { timestamps: true }
)

AppointmentSchema.index({ patientId: 1, createdAt: -1 })
AppointmentSchema.index({ doctorId: 1, appointmentDate: 1, appointmentTime: 1 })
AppointmentSchema.index({ doctorName: 1, appointmentDate: 1, appointmentTime: 1 })
AppointmentSchema.index({ status: 1 })

const Appointment = mongoose.model('Appointment', AppointmentSchema)

module.exports = { Appointment }