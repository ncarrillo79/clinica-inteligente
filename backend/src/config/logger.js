const { createLogger, format, transports, addColors } = require('winston')
const env = require('./env')

const isProd = env.nodeEnv === 'production'

// Add http level between info and verbose
addColors({ http: 'magenta' })

const logger = createLogger({
  levels: { error: 0, warn: 1, info: 2, http: 3, debug: 4 },
  level: isProd ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    isProd
      ? format.json()
      : format.combine(
          format.colorize(),
          format.printf(({ timestamp, level, message, ...meta }) => {
            const extras = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
            return `${timestamp} [${level}]: ${message}${extras}`
          })
        )
  ),
  transports: [new transports.Console()]
})

module.exports = { logger }
