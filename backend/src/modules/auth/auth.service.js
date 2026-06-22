const crypto = require('crypto')
const bcrypt = require('bcryptjs');
const { User } = require('../users/user.model');
const { PasswordReset } = require('./password-reset.model')
const { ApiError } = require('../../utils/api-error');
const { signToken } = require('../../utils/jwt');
const { sanitizeUser } = require('../../utils/sanitize-user');
const { logger } = require('../../config/logger')

async function register(data) {
  const existingEmail = await User.findOne({ email: data.email });
  if (existingEmail) throw new ApiError(409, 'Email já cadastrado');

  const existingCpf = await User.findOne({ cpf: data.cpf });
  if (existingCpf) throw new ApiError(409, 'CPF já cadastrado');

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash,
    cpf: data.cpf,
    phone: data.phone,
    role: data.role || 'PATIENT',
    address: data.address || {}
  });

  const token = signToken({ sub: user._id, role: user.role });

  return {
    user: sanitizeUser(user),
    token
  };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Credenciais inválidas');

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) throw new ApiError(401, 'Credenciais inválidas');

  const token = signToken({ sub: user._id, role: user.role });

  return {
    user: sanitizeUser(user),
    token
  };
}

async function requestPasswordReset(email) {
  const user = await User.findOne({ email })
  // Always respond OK to avoid user enumeration
  if (!user) return { message: 'Se o email existir, você receberá as instruções.' }

  await PasswordReset.deleteMany({ userId: user._id })

  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

  await PasswordReset.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  })

  // In production send email here. In development log the token.
  logger.info('Password reset token (dev only)', { email, token: rawToken })

  return { message: 'Se o email existir, você receberá as instruções.', _devToken: rawToken }
}

async function confirmPasswordReset(token, newPassword) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const record = await PasswordReset.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() }
  })

  if (!record) throw new ApiError(400, 'Token inválido ou expirado')

  const passwordHash = await bcrypt.hash(newPassword, 10)
  await User.findByIdAndUpdate(record.userId, { passwordHash })
  await PasswordReset.deleteMany({ userId: record.userId })

  return { message: 'Senha redefinida com sucesso' }
}

module.exports = { register, login, requestPasswordReset, confirmPasswordReset };