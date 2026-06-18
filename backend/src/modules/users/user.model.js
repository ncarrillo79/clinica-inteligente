const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    cep: { type: String },
    street: { type: String },
    number: { type: String },
    complement: { type: String },
    district: { type: String },
    city: { type: String },
    state: { type: String }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ['PATIENT', 'SECRETARY', 'ADMIN'],
      default: 'PATIENT'
    },
    address: addressSchema
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = { User };