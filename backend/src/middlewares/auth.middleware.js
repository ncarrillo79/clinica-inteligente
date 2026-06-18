const { verifyToken } = require('../utils/jwt')
const { ApiError } = require('../utils/api-error')
const { User } = require('../modules/users/user.model')

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Token não informado'))
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verifyToken(token)
    const user = await User.findById(decoded.sub)

    if (!user) {
      return next(new ApiError(401, 'Usuário não encontrado'))
    }

    req.user = user
    next()
  } catch (error) {
    return next(new ApiError(401, 'Token inválido ou expirado'))
  }
}

module.exports = { authMiddleware }