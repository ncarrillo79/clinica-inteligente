const mongoose = require('mongoose')

const scheduleSlotSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  { _id: false }
)

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    crm: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    schedule: [scheduleSlotSchema],
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
)

doctorSchema.index({ specialty: 1 })
doctorSchema.index({ active: 1 })

const Doctor = mongoose.model('Doctor', doctorSchema)

module.exports = { Doctor }
