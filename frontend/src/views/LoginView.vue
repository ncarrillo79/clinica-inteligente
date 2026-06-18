<template>
  <div class="login-page">
    <div class="login-shell">
      <div class="brand-side">
        <p class="eyebrow">Sistema de Clínica</p>
        <h1>Bem-vinda</h1>
        <p class="brand-text">
          Faça login para acessar suas consultas, visualizar alertas climáticos
          e gerenciar seu atendimento de forma simples e segura.
        </p>

        <div class="feature-list">
          <div class="feature-card">
            <span>🔐</span>
            <div>
              <strong>Acesso seguro</strong>
              <p>Autenticação com token JWT integrada ao backend.</p>
            </div>
          </div>

          <div class="feature-card">
            <span>📅</span>
            <div>
              <strong>Agendamentos</strong>
              <p>Crie e acompanhe suas consultas em tempo real.</p>
            </div>
          </div>

          <div class="feature-card">
            <span>🌦</span>
            <div>
              <strong>Clima inteligente</strong>
              <p>Receba alertas climáticos no dia da consulta.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="login-card">
        <div class="card-header">
          <h2>Entrar</h2>
          <p>Use seu email e senha para acessar o sistema.</p>
        </div>

        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="voce@email.com" />
        </div>

        <div class="field">
          <label>Senha</label>
          <input v-model="password" type="password" placeholder="********" />
        </div>

        <button class="btn btn-primary" @click="login">
          Entrar no sistema
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginView',

  data() {
    return {
      email: '',
      password: ''
    }
  },

  methods: {
    async login() {
      try {
        const res = await axios.post('http://localhost:3000/api/auth/login', {
          email: this.email,
          password: this.password
        })

        localStorage.setItem('token', res.data.data.token)
        this.$router.push('/appointments')
      } catch (error) {
        console.error(error)
        alert('Erro no login')
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f3f7fb 0%, #eef3f9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-shell {
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  align-items: stretch;
}

.brand-side {
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #38bdf8 100%);
  color: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 18px 40px rgba(37, 99, 235, 0.25);
}

.eyebrow {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.9;
}

.brand-side h1 {
  margin: 0;
  font-size: 40px;
  line-height: 1.1;
}

.brand-text {
  margin-top: 14px;
  font-size: 16px;
  line-height: 1.7;
  max-width: 520px;
  color: rgba(255, 255, 255, 0.92);
}

.feature-list {
  margin-top: 28px;
  display: grid;
  gap: 14px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 16px;
  padding: 16px;
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  align-items: start;
}

.feature-card span {
  font-size: 22px;
  line-height: 1;
}

.feature-card strong {
  display: block;
  margin-bottom: 4px;
}

.feature-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  font-size: 14px;
  line-height: 1.5;
}

.login-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 34px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.10);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-header h2 {
  margin: 0 0 8px;
  font-size: 30px;
  color: #0f172a;
}

.card-header p {
  margin: 0 0 22px;
  color: #64748b;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

label {
  font-size: 14px;
  font-weight: 700;
  color: #334155;
}

input {
  height: 48px;
  border-radius: 14px;
  border: 1px solid #cbd5e1;
  padding: 0 14px;
  font-size: 15px;
  outline: none;
  transition: 0.2s ease;
  background: #fff;
}

input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.btn {
  height: 48px;
  border: none;
  border-radius: 14px;
  padding: 0 18px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
  margin-top: 6px;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
}

@media (max-width: 900px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .brand-side,
  .login-card {
    padding: 28px;
  }

  .brand-side h1 {
    font-size: 32px;
  }
}
</style>