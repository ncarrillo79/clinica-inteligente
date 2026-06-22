<template>
  <div class="page">
    <div class="photo-side">
      <img
        src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1400&q=90&auto=format&fit=crop"
        alt=""
      />
      <div class="photo-overlay">
        <div class="photo-brand">
          <div class="cross"><span></span><span></span></div>
          <strong>Clínica Inteligente</strong>
        </div>
        <blockquote>
          "Sua saúde começa com uma boa decisão."
        </blockquote>
      </div>
    </div>

    <div class="form-side">
      <div class="form-box">
        <h1>Criar conta</h1>
        <p class="subtitle">Preencha seus dados para começar.</p>

        <div v-if="errorMsg" class="error">{{ errorMsg }}</div>

        <label>Nome completo</label>
        <input v-model="form.name" type="text" placeholder="Seu nome" :class="{ 'input-error': errors.name }" />
        <span v-if="errors.name" class="field-err">{{ errors.name }}</span>

        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="voce@email.com" :class="{ 'input-error': errors.email }" />
        <span v-if="errors.email" class="field-err">{{ errors.email }}</span>

        <label>Senha</label>
        <input v-model="form.password" type="password" placeholder="Mínimo 6 caracteres" :class="{ 'input-error': errors.password }" />
        <span v-if="errors.password" class="field-err">{{ errors.password }}</span>

        <div class="row">
          <div>
            <label>CPF</label>
            <input v-model="form.cpf" type="text" placeholder="000.000.000-00" maxlength="14" :class="{ 'input-error': errors.cpf }" @input="maskCpf" />
            <span v-if="errors.cpf" class="field-err">{{ errors.cpf }}</span>
          </div>
          <div>
            <label>Telefone</label>
            <input v-model="form.phone" type="text" placeholder="(00) 00000-0000" maxlength="15" :class="{ 'input-error': errors.phone }" @input="maskPhone" />
            <span v-if="errors.phone" class="field-err">{{ errors.phone }}</span>
          </div>
        </div>

        <button :disabled="loading" @click="register">
          {{ loading ? 'Cadastrando...' : 'Criar conta' }}
        </button>

        <p class="link-text">Já tem conta? <router-link to="/login">Entrar</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'RegisterView',
  data() {
    return {
      form: { name: '', email: '', password: '', cpf: '', phone: '' },
      errors: {},
      errorMsg: '',
      loading: false
    }
  },
  methods: {
    maskCpf() {
      let v = this.form.cpf.replace(/\D/g, '')
      if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
      else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3')
      else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, '$1.$2')
      this.form.cpf = v
    },
    maskPhone() {
      let v = this.form.phone.replace(/\D/g, '')
      if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
      else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
      else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2')
      this.form.phone = v
    },
    validate() {
      const e = {}
      if (!this.form.name.trim()) e.name = 'Obrigatório'
      if (!this.form.email.trim()) e.email = 'Obrigatório'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) e.email = 'Email inválido'
      if (!this.form.password) e.password = 'Obrigatório'
      else if (this.form.password.length < 6) e.password = 'Mínimo 6 caracteres'
      if (!this.form.cpf.trim()) e.cpf = 'Obrigatório'
      if (!this.form.phone.trim()) e.phone = 'Obrigatório'
      this.errors = e
      return Object.keys(e).length === 0
    },
    async register() {
      this.errorMsg = ''
      if (!this.validate()) return
      this.loading = true
      try {
        const payload = { ...this.form, cpf: this.form.cpf.replace(/\D/g, ''), phone: this.form.phone.replace(/\D/g, '') }
        const res = await api.post('/auth/register', payload)
        localStorage.setItem('token', res.data.data.token)
        this.$router.push('/appointments')
      } catch (error) {
        const details = error.response?.data?.details
        if (details?.length) {
          details.forEach((d) => { const f = d.path?.[0] || d.param; if (f) this.errors[f] = d.msg })
        } else {
          this.errorMsg = error.response?.data?.message || 'Erro ao cadastrar.'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

.photo-side {
  position: relative;
  overflow: hidden;
}

.photo-side img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
  color: white;
}

.photo-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 700;
}

.cross {
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cross span {
  position: absolute;
  background: #0d9488;
  border-radius: 2px;
}

.cross span:first-child { width: 14px; height: 3px; }
.cross span:last-child { width: 3px; height: 14px; }

blockquote {
  font-size: 22px;
  font-weight: 300;
  line-height: 1.5;
  max-width: 360px;
  font-style: italic;
  opacity: 0.95;
}

.form-side {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 48px 32px;
  overflow-y: auto;
}

.form-box {
  width: 100%;
  max-width: 400px;
}

h1 {
  font-size: 30px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  font-size: 15px;
  margin-bottom: 32px;
}

.error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 11px 14px;
  font-size: 14px;
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

input {
  display: block;
  width: 100%;
  height: 46px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 16px;
  font-size: 15px;
  font-family: inherit;
  color: #0f172a;
  background: #fafafa;
  outline: none;
  margin-bottom: 6px;
  transition: border-color 0.15s, box-shadow 0.15s;
}

input:focus {
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
  background: #fff;
}

input.input-error {
  border-color: #dc2626;
  background: #fff8f8;
}

input.input-error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
}

input::placeholder { color: #9ca3af; }

.field-err {
  display: block;
  font-size: 12px;
  color: #dc2626;
  margin-bottom: 14px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

button {
  display: block;
  width: 100%;
  height: 50px;
  background: #0d9488;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  margin-top: 16px;
  margin-bottom: 24px;
  transition: background 0.15s, transform 0.1s;
}

button:hover:not(:disabled) { background: #0f766e; transform: translateY(-1px); }
button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.link-text {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.link-text a { color: #0d9488; font-weight: 600; text-decoration: none; }
.link-text a:hover { text-decoration: underline; }

@media (max-width: 768px) {
  .page { grid-template-columns: 1fr; }
  .photo-side { height: 200px; }
  .row { grid-template-columns: 1fr; }
}
</style>