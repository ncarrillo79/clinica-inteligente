const request = require('supertest')
const mongoose = require('mongoose')
const { app } = require('../app')

const TEST_DB = 'mongodb://127.0.0.1:27017/clinica-test'

let patientToken
let adminToken

beforeAll(async () => {
  await mongoose.connect(TEST_DB)

  const patient = await request(app).post('/api/auth/register').send({
    name: 'Paciente',
    email: 'patient@teste.com',
    password: 'senha123',
    cpf: '55544433322',
    phone: '11900000001'
  })
  patientToken = patient.body.data.token

  const admin = await request(app).post('/api/auth/register').send({
    name: 'Admin',
    email: 'admin@teste.com',
    password: 'senha123',
    cpf: '11199988877',
    phone: '11900000002',
    role: 'ADMIN'
  })
  adminToken = admin.body.data.token
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

afterEach(async () => {
  const { Doctor } = require('../modules/doctors/doctor.model')
  await Doctor.deleteMany({})
})

const validDoctor = {
  name: 'Dr. Ana Lima',
  specialty: 'Pediatria',
  crm: '123456-SP'
}

describe('POST /api/doctors', () => {
  it('admin deve conseguir criar médico', async () => {
    const res = await request(app)
      .post('/api/doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validDoctor)

    expect(res.status).toBe(201)
    expect(res.body.data.crm).toBe('123456-SP')
  })

  it('paciente não deve conseguir criar médico', async () => {
    const res = await request(app)
      .post('/api/doctors')
      .set('Authorization', `Bearer ${patientToken}`)
      .send(validDoctor)

    expect(res.status).toBe(403)
  })

  it('deve rejeitar CRM duplicado', async () => {
    await request(app)
      .post('/api/doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validDoctor)

    const res = await request(app)
      .post('/api/doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validDoctor)

    expect(res.status).toBe(409)
  })
})

describe('GET /api/doctors', () => {
  it('deve listar médicos para usuário autenticado', async () => {
    await request(app)
      .post('/api/doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validDoctor)

    const res = await request(app)
      .get('/api/doctors')
      .set('Authorization', `Bearer ${patientToken}`)

    expect(res.status).toBe(200)
    expect(res.body.data.length).toBe(1)
  })
})
