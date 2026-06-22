const express = require('express');
const { body } = require('express-validator');
const { asyncHandler } = require('../../utils/async-handler');
const { validateRequest } = require('../../middlewares/validate.middleware');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const {
  registerController,
  loginController,
  meController,
  forgotPasswordController,
  resetPasswordController
} = require('./auth.controller');
const { registerValidation, loginValidation } = require('./auth.validation');

const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, cpf, phone]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               cpf: { type: string }
 *               phone: { type: string }
 *               role: { type: string, enum: [PATIENT, SECRETARY, ADMIN] }
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       409:
 *         description: Email ou CPF já cadastrado
 *       422:
 *         description: Dados inválidos
 */
router.post('/register', registerValidation, validateRequest, asyncHandler(registerController));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', loginValidation, validateRequest, asyncHandler(loginController));

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Retorna dados do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autenticado
 */
router.get('/me', authMiddleware, asyncHandler(meController));

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Solicitar redefinição de senha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Instruções enviadas (resposta idêntica independente do email existir)
 */
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Email inválido')],
  validateRequest,
  asyncHandler(forgotPasswordController)
);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Confirmar nova senha com token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token: { type: string }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token é obrigatório'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
  ],
  validateRequest,
  asyncHandler(resetPasswordController)
);

module.exports = router;
