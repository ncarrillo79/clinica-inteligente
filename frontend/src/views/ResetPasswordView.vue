<template>
  <div class="page">
    <div class="box">
      <div class="logo">
        <div class="cross"><span></span><span></span></div>
        <strong>Clínica Inteligente</strong>
      </div>

      <template v-if="!done">
        <h1>Nova senha</h1>
        <p class="subtitle">Digite sua nova senha abaixo.</p>

        <div v-if="errorMsg" class="error">{{ errorMsg }}</div>

        <label>Nova senha</label>
        <input v-model="password" type="password" placeholder="Mínimo 6 caracteres" :class="{ 'input-error': errors.password }" />
        <span v-if="errors.password" class="field-err">{{ errors.password }}</span>

        <label>Confirmar senha</label>
        <input v-model="confirm" type="password" placeholder="Repita a senha" :class="{ 'input-error': errors.confirm }" @keyup.enter="submit" />
        <span v-if="errors.confirm" class="field-err">{{ errors.confirm }}</span>

        <button :disabled="loading" @click="submit">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'Salvando...' : 'Redefinir senha' }}
        </button>
      </template>

      <template v-else>
        <div class="success-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="#0d9488" stroke-width="2"/>
            <path d="M14 24l7 7 13-13" stroke="#0d9488" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1>Senha redefinida!</h1>
        <p class="subtitle">Sua senha foi alterada com sucesso. Faça login com sua nova senha.</p>
        <router-link to="/login" class="btn-login">Ir para o login</router-link>
      </template>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'ResetPasswordView',
  data() {
    return { password: '', confirm: '', errors: {}, errorMsg: '', loading: false, done: false }
  },
  methods: {
    validate() {
      const e = {}
      if (!this.password) e.password = 'Senha é obrigatória'
      else if (this.password.length < 6) e.password = 'Mínimo 6 caracteres'
      if (!this.confirm) e.confirm = 'Confirme a senha'
      else if (this.password !== this.confirm) e.confirm = 'As senhas não coincidem'
      this.errors = e
      return Object.keys(e).length === 0
    },
    async submit() {
      this.errorMsg = ''
      if (!this.validate()) return
      const token = this.$route.query.token
      if (!token) { this.errorMsg = 'Link inválido. Solicite um novo.'; return }
      this.loading = true
      try {
        await api.post('/auth/reset-password', { token, password: this.password })
        this.done = true
      } catch (e) {
        this.errorMsg = e.response?.data?.message || 'Link expirado. Solicite um novo.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; }
.box { background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); padding: 48px 40px; width: 100%; max-width: 420px; }
.logo { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 32px; }
.cross { width: 32px; height: 32px; background: #0d9488; border-radius: 8px; position: relative; display: flex; align-items: center; justify-content: center; }
.cross span { position: absolute; background: white; border-radius: 2px; }
.cross span:first-child { width: 14px; height: 3px; }
.cross span:last-child { width: 3px; height: 14px; }
h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
.subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; line-height: 1.6; }
.error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 8px; padding: 11px 14px; font-size: 14px; margin-bottom: 20px; }
label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
input { display: block; width: 100%; height: 48px; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 0 16px; font-size: 15px; font-family: inherit; color: #0f172a; background: #fafafa; outline: none; margin-bottom: 20px; box-sizing: border-box; transition: border-color 0.15s; }
input:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); background: #fff; }
input.input-error { border-color: #dc2626; background: #fff8f8; }
.field-err { display: block; font-size: 12px; color: #dc2626; margin-top: -14px; margin-bottom: 14px; }
button { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 50px; background: #0d9488; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; font-family: inherit; cursor: pointer; margin-bottom: 24px; transition: background 0.15s; }
button:hover:not(:disabled) { background: #0f766e; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
.spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.btn-login { display: block; text-align: center; width: 100%; height: 50px; line-height: 50px; background: #0d9488; color: white; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; box-sizing: border-box; }
.btn-login:hover { background: #0f766e; }
.success-icon { text-align: center; margin-bottom: 20px; }
</style>
