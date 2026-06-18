const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const routes = require('./routes')
const { errorMiddleware } = require('./middlewares/error.middleware')
const env = require('./config/env')

const app = express()

app.use(helmet())
app.use(cors({ origin: env.frontendUrl }))
app.use(express.json())
app.use(morgan('dev'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
})

app.use(limiter)
app.use('/api', routes)
app.use(errorMiddleware)

module.exports = { app }