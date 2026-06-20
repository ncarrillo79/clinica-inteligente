const { Router } = require('express')
const router = Router()

const {
  listDoctorsController,
  getDoctorController,
  getDoctorSlotsController,
  createDoctorController,
  updateDoctorController,
  deactivateDoctorController
} = require('./doctor.controller')

const { authMiddleware } = require('../../middlewares/auth.middleware')
const { authorize } = require('../../middlewares/authorize.middleware')
const { validateRequest } = require('../../middlewares/validate.middleware')
const { asyncHandler } = require('../../utils/async-handler')
const {
  createDoctorValidation,
  updateDoctorValidation
} = require('./doctor.validation')

/**
 * @openapi
 * /doctors:
 *   get:
 *     tags: [Doctors]
 *     summary: Listar médicos ativos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: specialty
 *         schema: { type: string }
 *         description: Filtrar por especialidade
 *     responses:
 *       200:
 *         description: Lista de médicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 */
router.get('/', authMiddleware, asyncHandler(listDoctorsController))

/**
 * @openapi
 * /doctors/{id}:
 *   get:
 *     tags: [Doctors]
 *     summary: Buscar médico por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Dados do médico
 *       404:
 *         description: Médico não encontrado
 */
router.get('/:id/slots', authMiddleware, asyncHandler(getDoctorSlotsController))

router.get('/:id', authMiddleware, asyncHandler(getDoctorController))

/**
 * @openapi
 * /doctors:
 *   post:
 *     tags: [Doctors]
 *     summary: Cadastrar médico (ADMIN ou SECRETARY)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, specialty, crm]
 *             properties:
 *               name: { type: string }
 *               specialty: { type: string }
 *               crm: { type: string, example: "123456-SP" }
 *               email: { type: string, format: email }
 *               phone: { type: string }
 *     responses:
 *       201:
 *         description: Médico cadastrado com sucesso
 *       403:
 *         description: Sem permissão
 *       409:
 *         description: CRM já cadastrado
 */
router.post(
  '/',
  authMiddleware,
  authorize('ADMIN', 'SECRETARY'),
  createDoctorValidation,
  validateRequest,
  asyncHandler(createDoctorController)
)

/**
 * @openapi
 * /doctors/{id}:
 *   patch:
 *     tags: [Doctors]
 *     summary: Atualizar médico (ADMIN ou SECRETARY)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Médico atualizado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Médico não encontrado
 */
router.patch(
  '/:id',
  authMiddleware,
  authorize('ADMIN', 'SECRETARY'),
  updateDoctorValidation,
  validateRequest,
  asyncHandler(updateDoctorController)
)

/**
 * @openapi
 * /doctors/{id}:
 *   delete:
 *     tags: [Doctors]
 *     summary: Desativar médico (somente ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Médico desativado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Médico não encontrado
 */
router.delete(
  '/:id',
  authMiddleware,
  authorize('ADMIN'),
  asyncHandler(deactivateDoctorController)
)

module.exports = router
