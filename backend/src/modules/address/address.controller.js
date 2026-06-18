const { getAddressByCep } = require('./address.service');

async function getCepController(req, res) {
  const { cep } = req.params;

  const address = await getAddressByCep(cep);

  return res.json({
    success: true,
    data: address
  });
}

module.exports = { getCepController };