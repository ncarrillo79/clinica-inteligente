const { app } = require('./app');
const { connectDb } = require('./config/db');
const env = require('./config/env');

async function bootstrap() {
  try {
    await connectDb();

    app.listen(env.port, () => {
      console.log(`🚀 Servidor rodando na porta ${env.port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar aplicação:', error);
    process.exit(1);
  }
}

bootstrap();