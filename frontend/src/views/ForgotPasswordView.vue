<template>
  <div class="page">
    <div class="box">
      <div class="logo">
        <div class="cross"><span></span><span></span></div>
        <strong>Clínica Inteligente</strong>
      </div>

      <template v-if="!sent">
        <h1>Esqueci minha senha</h1>
        <p class="subtitle">Digite seu email e enviaremos um link para redefinir sua senha.</p>

        <label>Email</label>
        <input v-model="email" type="email" placeholder="voce@email.com" :class="{ 'input-error': error }" @keyup.enter="submit" />
        <span v-if="error" class="field-err">{{ error }}</span>

        <button :disabled="loading" @click="submit">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'Enviando...' : 'Enviar link de recuperação' }}
        </button>
      </template>

      <template v-else>
        <div class="success-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="#0d9488" stroke-width="2"/>
            <path d="M14 24l7 7 13-13" stroke="#0d9488" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1>Email enviado!</h1>
        <p class="subtitle">Verifique sua caixa de entrada em <strong>{{ email }}</strong> e clique no link para redefinir sua senha. O link expira em 15 minutos.</p>
        <p class="subtitle">Não encontrou? Verifique a pasta de spam.</p>
      </template>

      <p class="link-text"><router-link to="/login">← Voltar ao login</router-link></p>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'ForgotPasswordView',
  data() {
    return { email: '', error: '', loading: false, sent: false }
  },
  methods: {
    async submit() {
      this.error = ''
      if (!this.email.trim()) { this.error = 'Email é obrigatório'; return }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) { this.error = 'Email inválido'; return }
      this.loading = true
      try {
        await api.post('/auth/forgot-password', { email: this.email })
        this.sent = true
      } catch {
        this.error = 'Erro ao enviar email. Tente novamente.'
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
.link-text { text-align: center; font-size: 14px; color: #6b7280; }
.link-text a { color: #0d9488; font-weight: 600; text-decoration: none; }
.link-text a:hover { text-decoration: underline; }
.success-icon { text-align: center; margin-bottom: 20px; }
</style>
