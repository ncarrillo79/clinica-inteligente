const express = require('express');
const { asyncHandler } = require('../../utils/async-handler');
const { validateRequest } = require('../../middlewares/validate.middleware');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const { registerController, loginController, meController } = require('./auth.controller');
const { registerValidation, loginValidation } = require('./auth.validation');

const router = express.Router();

router.post('/register', registerValidation, validateRequest, asyncHandler(registerController));
router.post('/login', loginValidation, validateRequest, asyncHandler(loginController));
router.get('/me', authMiddleware, asyncHandler(meController));

module.exports = router;