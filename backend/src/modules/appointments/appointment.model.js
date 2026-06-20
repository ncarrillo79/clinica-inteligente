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
      enum: ['SCHEDULED', 'CANCELLED', 'ATTENDED', 'NO_SHOW'],
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
    },

    // --- ML no-show feature fields ---
    outcomeRecordedAt: { type: Date, default: null },

    // Temporal features (derived from appointmentDate/Time at creation)
    dayOfWeek: { type: Number, min: 0, max: 6, default: null },
    appointmentHour: { type: Number, min: 0, max: 23, default: null },
    leadTimeDays: { type: Number, default: null },

    // Weather feature (raw pop from OpenWeather)
    weatherRainProbability: { type: Number, min: 0, max: 1, default: null },

    // Patient history features (snapshot at creation time)
    patientPriorNoShows: { type: Number, default: 0 },
    patientTotalAppointments: { type: Number, default: 0 },

    // Risk score (filled later by prediction pipeline)
    noShowRisk: { type: Number, default: null },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', null], default: null }
  },
  { timestamps: true }
)

AppointmentSchema.index({ patientId: 1, createdAt: -1 })
AppointmentSchema.index({ doctorId: 1, appointmentDate: 1, appointmentTime: 1 })
AppointmentSchema.index({ doctorName: 1, appointmentDate: 1, appointmentTime: 1 })
AppointmentSchema.index({ status: 1 })

const Appointment = mongoose.model('Appointment', AppointmentSchema)

module.exports = { Appointment }