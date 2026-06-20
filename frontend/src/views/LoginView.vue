<template>
  <div class="page">
    <div class="photo-side">
      <img
        src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1400&q=90&auto=format&fit=crop"
        alt=""
      />
      <div class="photo-overlay">
        <div class="photo-brand">
          <div class="cross">
            <span></span><span></span>
          </div>
          <strong>Clínica Inteligente</strong>
        </div>
        <div class="features-list">
          <div class="feature-item">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 9l2.5 2.5 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Agendamento online 24h por dia</span>
          </div>
          <div class="feature-item">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 9l2.5 2.5 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Alertas climáticos em tempo real</span>
          </div>
          <div class="feature-item">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 9l2.5 2.5 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Histórico completo de consultas</span>
          </div>
          <div class="feature-item">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 9l2.5 2.5 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Dados protegidos pela LGPD</span>
          </div>
        </div>
        <blockquote>
          "Cuidamos da sua saúde com tecnologia e dedicação."
        </blockquote>
      </div>
    </div>

    <div class="form-side">
      <div class="form-box">
        <h1>Entrar</h1>
        <p class="subtitle">Acesse sua conta para gerenciar consultas.</p>

        <div v-if="errorMsg" class="error">{{ errorMsg }}</div>

        <label>Email</label>
        <input v-model="email" type="email" placeholder="voce@email.com" @keyup.enter="login" />

        <label>Senha</label>
        <input v-model="password" type="password" placeholder="••••••••" @keyup.enter="login" />

        <button :disabled="loading" @click="login">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <p class="link-text">Não tem conta? <router-link to="/register">Cadastre-se</router-link></p>

        <div class="lgpd-badge">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l5 2v4c0 3-2.5 5-5 6C4.5 12 2 10 2 7V3l5-2z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M4.5 7l2 2 3-3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Seus dados estão protegidos pela <strong>LGPD</strong></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth.store'

export default {
  name: 'LoginView',
  data() {
    return { email: '', password: '', errorMsg: '', loading: false }
  },
  methods: {
    async login() {
      this.errorMsg = ''
      if (!this.email || !this.password) { this.errorMsg = 'Preencha email e senha.'; return }
      this.loading = true
      try {
        await useAuthStore().login(this.email, this.password)
        this.$router.push('/appointments')
      } catch (e) {
        this.errorMsg = e.response?.data?.message || 'Credenciais inválidas.'
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

/* Photo */
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
}

.photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(2,26,38,0.78) 0%, rgba(13,148,136,0.55) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
  gap: 32px;
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

.features-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.95;
}

.feature-item svg {
  flex-shrink: 0;
  color: #5eead4;
}

blockquote {
  font-size: 18px;
  font-weight: 300;
  line-height: 1.5;
  max-width: 360px;
  font-style: italic;
  opacity: 0.85;
  border-left: 3px solid rgba(255,255,255,0.3);
  padding-left: 16px;
  margin: 0;
}

/* Form */
.form-side {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 48px 32px;
}

.form-box {
  width: 100%;
  max-width: 380px;
}

h1 {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  font-size: 15px;
  margin-bottom: 36px;
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
  height: 48px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 16px;
  font-size: 15px;
  font-family: inherit;
  color: #0f172a;
  background: #fafafa;
  outline: none;
  margin-bottom: 20px;
  transition: border-color 0.15s, box-shadow 0.15s;
}

input:focus {
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
  background: #fff;
}

input::placeholder { color: #9ca3af; }

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
  margin-top: 4px;
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

.lgpd-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 20px;
  font-size: 12px;
  color: #94a3b8;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 9px 14px;
}

.lgpd-badge svg { color: #0d9488; flex-shrink: 0; }
.lgpd-badge strong { color: #374151; }

@media (max-width: 768px) {
  .page { grid-template-columns: 1fr; }
  .photo-side { height: 220px; }
}
</style>