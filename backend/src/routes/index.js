const express = require('express')
const authRoutes = require('../modules/auth/auth.routes')
const appointmentRoutes = require('../modules/appointments/appointment.routes')
const addressRoutes = require('../modules/address/address.routes')
const weatherRoutes = require('../modules/weather/weather.routes')
const doctorRoutes = require('../modules/doctors/doctor.routes')

const router = express.Router()

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API online'
  })
})

router.use('/auth', authRoutes)
router.use('/appointments', appointmentRoutes)
router.use('/address', addressRoutes)
router.use('/weather', weatherRoutes)
router.use('/doctors', doctorRoutes)

module.exports = router