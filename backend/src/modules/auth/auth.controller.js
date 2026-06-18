const { register, login } = require('./auth.service');
const { sanitizeUser } = require('../../utils/sanitize-user');

async function registerController(req, res) {
  const result = await register(req.body);

  return res.status(201).json({
    success: true,
    message: 'Usuário cadastrado com sucesso',
    data: result
  });
}

async function loginController(req, res) {
  const result = await login(req.body);

  return res.status(200).json({
    success: true,
    message: 'Login realizado com sucesso',
    data: result
  });
}

async function meController(req, res) {
  return res.status(200).json({
    success: true,
    data: sanitizeUser(req.user)
  });
}

module.exports = { registerController, loginController, meController };