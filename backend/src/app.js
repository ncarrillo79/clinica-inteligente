const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const swaggerUi = require('swagger-ui-express')
const routes = require('./routes')
const { errorMiddleware } = require('./middlewares/error.middleware')
const { swaggerSpec } = require('./config/swagger')
const env = require('./config/env')
const { logger } = require('./config/logger')

const app = express()

app.use(helmet())
app.use(cors({ origin: env.frontendUrl }))
app.use(express.json())
app.use(
  morgan('tiny', {
    stream: { write: (msg) => logger.http(msg.trim()) }
  })
)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
})

app.use(limiter)
app.use('/api', routes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(errorMiddleware)

module.exports = { app }