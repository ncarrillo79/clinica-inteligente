const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  openWeatherBaseUrl: process.env.OPENWEATHER_BASE_URL,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};