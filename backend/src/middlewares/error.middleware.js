const { logger } = require('../config/logger')

function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.path} → ${statusCode}`, {
      message: err.message,
      stack: err.stack
    })
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    details: err.details || null
  })
}

module.exports = { errorMiddleware }