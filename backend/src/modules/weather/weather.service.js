/* Dados Mockados para o clima, caso a API do OpenWeather esteja indisponível ou para testes sem consumir a API real. */    

/* 
function getWeather(city) {
  // MOCK (simulação)
  return {
    temperature: 26,
    description: "chuva leve",
    willRain: true
  };
}



module.exports = { getWeather };

*/
// Código real para consultar a API do OpenWeather, caso queira usar a API real. Lembre-se de configurar a chave da API no arquivo env.js.

const axios = require('axios')
const env = require('../../config/env')
const { ApiError } = require('../../utils/api-error')

async function getWeatherForecast(city, date) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${env.openWeatherApiKey}&units=metric&lang=pt_br`
    )

    const forecasts = response.data.list

    const target = forecasts.find(item => item.dt_txt.startsWith(date))

    if (!target) {
      throw new ApiError(404, 'Previsão não encontrada')
    }

    return {
      temperature: target.main.temp,
      description: target.weather[0].description,
      willRain: target.pop > 0.4
    }
  } catch (error) {
    throw new ApiError(500, 'Erro ao consultar clima')
  }
}

module.exports = { getWeatherForecast }