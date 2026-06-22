const crypto = require('crypto')
const bcrypt = require('bcryptjs');
const { User } = require('../users/user.model');
const { PasswordReset } = require('./password-reset.model')
const { ApiError } = require('../../utils/api-error');
const { signToken } = require('../../utils/jwt');
const { sanitizeUser } = require('../../utils/sanitize-user');
const { logger } = require('../../config/logger')
const { sendMail } = require('../../config/mailer')
const env = require('../../config/env')

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

  const resetUrl = `${env.frontendUrl}/reset-password?token=${rawToken}`

  await sendMail({
    to: user.email,
    subject: 'Recuperação de senha — Clínica Inteligente',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#0d9488">Clínica Inteligente</h2>
        <p>Olá, <strong>${user.name}</strong>.</p>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
        <p>Clique no botão abaixo para criar uma nova senha. O link expira em <strong>15 minutos</strong>.</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#0d9488;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold">
          Redefinir senha
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">
          Se você não solicitou isso, ignore este email. Sua senha não será alterada.
        </p>
        <p style="color:#6b7280;font-size:13px">Link: ${resetUrl}</p>
      </div>
    `
  })

  logger.info('Password reset email sent', { email: user.email })

  return { message: 'Se o email existir, você receberá as instruções.' }
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