const request = require('supertest')
const mongoose = require('mongoose')
const { app } = require('../app')

const TEST_DB = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clinica-test'

let token

beforeAll(async () => {
  await mongoose.connect(TEST_DB)

  const res = await request(app).post('/api/auth/register').send({
    name: 'Paciente Teste',
    email: 'paciente@teste.com',
    password: 'senha123',
    cpf: '11122233344',
    phone: '11999990000'
  })
  token = res.body.data.token
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

afterEach(async () => {
  const { Appointment } = require('../modules/appointments/appointment.model')
  await Appointment.deleteMany({})
})

const tomorrow = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

const validAppointment = () => ({
  doctorName: 'Dr. Carlos',
  specialty: 'Cardiologia',
  appointmentDate: tomorrow(),
  appointmentTime: '10:00',
  notes: 'Retorno'
})

describe('POST /api/appointments', () => {
  it('deve criar consulta com dados válidos', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(validAppointment())

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.doctorName).toBe('Dr. Carlos')
  })

  it('deve rejeitar consulta sem autenticação', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send(validAppointment())
    expect(res.status).toBe(401)
  })

  it('deve rejeitar data no passado', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validAppointment(), appointmentDate: '2020-01-01' })
    expect(res.status).toBe(422)
  })

  it('deve rejeitar hora em formato inválido', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validAppointment(), appointmentTime: '1000' })
    expect(res.status).toBe(422)
  })

  it('deve rejeitar campos obrigatórios ausentes', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ doctorName: 'Dr. X' })
    expect(res.status).toBe(422)
  })
})

describe('GET /api/appointments/my', () => {
  it('deve retornar consultas do usuário autenticado', async () => {
    await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(validAppointment())

    const res = await request(app)
      .get('/api/appointments/my')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBe(1)
  })

  it('deve rejeitar sem autenticação', async () => {
    const res = await request(app).get('/api/appointments/my')
    expect(res.status).toBe(401)
  })
})

describe('PATCH /api/appointments/:id/cancel', () => {
  it('deve cancelar consulta própria', async () => {
    const create = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(validAppointment())

    const id = create.body.data._id

    const res = await request(app)
      .patch(`/api/appointments/${id}/cancel`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('CANCELLED')
  })

  it('deve rejeitar cancelamento de consulta inexistente', async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const res = await request(app)
      .patch(`/api/appointments/${fakeId}/cancel`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
  })
})
