const express = require('express');
const { asyncHandler } = require('../../utils/async-handler');
const { validateRequest } = require('../../middlewares/validate.middleware');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const { registerController, loginController, meController } = require('./auth.controller');
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

module.exports = router;
