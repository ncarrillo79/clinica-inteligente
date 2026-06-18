const axios = require('axios');
const { ApiError } = require('../../utils/api-error');

async function getAddressByCep(cep) {
  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    throw new ApiError(400, 'CEP inválido');
  }

  try {
    const response = await axios.get(
      `https://viacep.com.br/ws/${cleanCep}/json/`
    );

    if (response.data.erro) {
      throw new ApiError(404, 'CEP não encontrado');
    }

    return {
      cep: response.data.cep,
      street: response.data.logradouro,
      district: response.data.bairro,
      city: response.data.localidade,
      state: response.data.uf
    };
  } catch (error) {
    throw new ApiError(500, 'Erro ao consultar CEP');
  }
}

module.exports = { getAddressByCep };