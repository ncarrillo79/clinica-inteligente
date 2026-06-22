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
const axios = require('axios')
const env = require('../../config/env')
const { ApiError } = require('../../utils/api-error')

// In-memory cache: key = "city:date", TTL = 1 hour
const _cache = new Map()
const CACHE_TTL_MS = 60 * 60 * 1000

function _getCached(key) {
  const entry = _cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) { _cache.delete(key); return null }
  return entry.data
}

function _setCached(key, data) {
  _cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

async function getWeatherForecast(city, date) {
  const cacheKey = `${city}:${date}`
  const cached = _getCached(cacheKey)
  if (cached) return cached

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${env.openWeatherApiKey}&units=metric&lang=pt_br`
    )

    const forecasts = response.data.list
    const target = forecasts.find(item => item.dt_txt.startsWith(date))

    if (!target) {
      throw new ApiError(404, 'Previsão não encontrada')
    }

    const result = {
      temperature: target.main.temp,
      description: target.weather[0].description,
      willRain: target.pop > 0.4,
      rainProbability: target.pop ?? 0
    }

    _setCached(cacheKey, result)
    return result
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(500, 'Erro ao consultar clima')
  }
}

module.exports = { getWeatherForecast }