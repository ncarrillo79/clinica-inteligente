const bcrypt = require('bcryptjs');
const { User } = require('../users/user.model');
const { ApiError } = require('../../utils/api-error');
const { signToken } = require('../../utils/jwt');
const { sanitizeUser } = require('../../utils/sanitize-user');

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

module.exports = { register, login };