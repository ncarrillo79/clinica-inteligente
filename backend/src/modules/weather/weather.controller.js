const { getWeatherForecast } = require('./weather.service')

async function getWeatherController(req, res) {
  const { city, date } = req.query

  const weather = await getWeatherForecast(city, date)

  return res.json({
    success: true,
    data: weather
  })
}

module.exports = { getWeatherController }
