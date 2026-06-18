const express = require('express');
const { asyncHandler } = require('../../utils/async-handler');
const { getWeatherController } = require('./weather.controller');

const router = express.Router();

router.get('/', asyncHandler(getWeatherController));

module.exports = router;