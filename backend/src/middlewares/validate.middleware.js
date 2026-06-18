const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/api-error');

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ApiError(422, 'Dados inválidos', errors.array()));
  }

  next();
}

module.exports = { validateRequest };