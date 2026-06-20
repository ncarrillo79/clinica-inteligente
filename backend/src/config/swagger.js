const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clínica Inteligente API',
      version: '1.0.0',
      description: 'API REST para gerenciamento de consultas médicas com alertas climáticos'
    },
    servers: [{ url: '/api', description: 'Servidor local' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            cpf: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['PATIENT', 'SECRETARY', 'ADMIN'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Appointment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            patientId: { type: 'string' },
            doctorName: { type: 'string' },
            specialty: { type: 'string' },
            appointmentDate: { type: 'string', example: '2025-08-15' },
            appointmentTime: { type: 'string', example: '10:00' },
            status: { type: 'string', enum: ['SCHEDULED', 'CANCELLED'] },
            notes: { type: 'string' },
            weather: {
              type: 'object',
              properties: {
                willRain: { type: 'boolean' },
                description: { type: 'string' },
                temperature: { type: 'number' },
                alert: { type: 'string', nullable: true }
              }
            }
          }
        },
        Doctor: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            specialty: { type: 'string' },
            crm: { type: 'string', example: '123456-SP' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            active: { type: 'boolean' },
            schedule: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  dayOfWeek: { type: 'integer', minimum: 0, maximum: 6 },
                  startTime: { type: 'string', example: '08:00' },
                  endTime: { type: 'string', example: '18:00' }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            details: { type: 'array', items: { type: 'object' } }
          }
        }
      }
    }
  },
  apis: ['./src/modules/**/*.routes.js', './src/routes/*.js']
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = { swaggerSpec }
