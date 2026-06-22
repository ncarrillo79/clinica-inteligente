const { app } = require('./app');
const { connectDb } = require('./config/db');
const env = require('./config/env');
const { logger } = require('./config/logger');

async function bootstrap() {
  try {
    await connectDb();

    app.listen(env.port, () => {
      logger.info(`Servidor rodando na porta ${env.port}`, { env: env.nodeEnv });
    });
  } catch (error) {
    logger.error('Erro ao iniciar aplicação', { error });
    process.exit(1);
  }
}

bootstrap();