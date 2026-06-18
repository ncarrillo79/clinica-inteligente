const { getWeather } = require('./weather.service');

async function getWeatherController(req, res) {
  const { city } = req.query;

  const weather = await getWeather(city);

  return res.json({
    success: true,
    data: weather
  });
}

module.exports = { getWeatherController };