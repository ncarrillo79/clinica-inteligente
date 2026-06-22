const mongoose = require('mongoose')

const passwordResetSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true }
})

// Auto-delete expired tokens
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema)

module.exports = { PasswordReset }
