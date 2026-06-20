const { ApiError } = require('../utils/api-error')

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Não autenticado'))
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Acesso restrito a: ${roles.join(', ')}`)
      )
    }

    next()
  }
}

module.exports = { authorize }
