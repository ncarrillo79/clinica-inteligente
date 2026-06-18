const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
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

const Appointment = mongoose.model('Appointment', AppointmentSchema)

module.exports = { Appointment }