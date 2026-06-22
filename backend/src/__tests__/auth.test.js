const request = require('supertest')
const mongoose = require('mongoose')
const { app } = require('../app')

const TEST_DB = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clinica-test'

beforeAll(async () => {
  await mongoose.connect(TEST_DB)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

describe('POST /api/auth/register', () => {
  const validUser = {
    name: 'Maria Silva',
    email: 'maria@teste.com',
    password: 'senha123',
    cpf: '12345678901',
    phone: '11999999999'
  }

  it('deve registrar um novo usuário com sucesso', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser)
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('token')
    expect(res.body.data.user).not.toHaveProperty('passwordHash')
  })

  it('deve rejeitar email duplicado', async () => {
    await request(app).post('/api/auth/register').send(validUser)
    const res = await request(app).post('/api/auth/register').send(validUser)
    expect(res.status).toBe(409)
    expect(res.body.message).toMatch(/email/i)
  })

  it('deve rejeitar registro sem email', async () => {
    const { email, ...noEmail } = validUser
    const res = await request(app).post('/api/auth/register').send(noEmail)
    expect(res.status).toBe(422)
  })

  it('deve rejeitar senha com menos de 6 caracteres', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: '123' })
    expect(res.status).toBe(422)
  })
})

describe('POST /api/auth/login', () => {
  const user = {
    name: 'João Teste',
    email: 'joao@teste.com',
    password: 'senha456',
    cpf: '98765432100',
    phone: '11888888888'
  }

  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(user)
  })

  it('deve fazer login com credenciais válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password })
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('token')
  })

  it('deve rejeitar senha incorreta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'errada' })
    expect(res.status).toBe(401)
  })

  it('deve rejeitar email não cadastrado', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'naoexiste@teste.com', password: 'qualquer' })
    expect(res.status).toBe(401)
  })
})
