function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    phone: user.phone,
    role: user.role,
    address: user.address,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

module.exports = { sanitizeUser };