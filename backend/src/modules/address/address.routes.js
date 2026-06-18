const express = require('express');
const { asyncHandler } = require('../../utils/async-handler');
const { getCepController } = require('./address.controller');

const router = express.Router();

router.get('/cep/:cep', asyncHandler(getCepController));

module.exports = router;