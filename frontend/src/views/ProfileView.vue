<template>
  <div class="profile-page">

    <!-- Hero header -->
    <div class="profile-hero">
      <img
        src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1400&q=85&auto=format&fit=crop"
        alt="Clínica"
        class="hero-bg"
      />
      <div class="hero-overlay"></div>

      <div class="hero-inner">
        <button class="btn-back" @click="$router.push('/appointments')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 13L5 8l5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Voltar
        </button>

        <div v-if="user" class="profile-identity">
          <div class="big-avatar">{{ initials }}</div>
          <div class="identity-text">
            <h1>{{ user.name }}</h1>
            <div class="identity-row">
              <span class="role-pill" :class="`role-${user.role?.toLowerCase()}`">{{ roleLabel(user.role) }}</span>
              <span class="identity-since">Membro desde {{ formatDate(user.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="content-wrap">

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando perfil...</p>
      </div>

      <div v-else-if="user" class="profile-grid">

        <!-- Personal info card -->
        <div class="info-card">
          <div class="card-title">
            <div class="title-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M2 17c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </div>
            <h2>Dados Pessoais</h2>
          </div>

          <div class="info-list">
            <div class="info-row">
              <div class="info-label">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" stroke-width="1.2"/><path d="M1.5 13c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                Nome completo
              </div>
              <div class="info-value">{{ user.name }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 3h12v8H1V3zm0 0l6 5 6-5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
                Email
              </div>
              <div class="info-value">{{ user.email }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M4 6h6M4 9h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                CPF
              </div>
              <div class="info-value">{{ formatCpf(user.cpf) }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 2h2.5l1.5 3.5-1.8 1.3c.9 1.8 2.2 3 3.9 3.9l1.3-1.8 3.5 1.5V13a1 1 0 01-1 1C5.5 14 0 8.5 0 3a1 1 0 011-1z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
                Telefone
              </div>
              <div class="info-value">{{ formatPhone(user.phone) }}</div>
            </div>
          </div>
        </div>

        <!-- Account card -->
        <div class="info-card">
          <div class="card-title">
            <div class="title-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L2 5.5V9c0 4 3 7.5 7 8 4-0.5 7-4 7-8V5.5L9 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 9l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h2>Conta</h2>
          </div>

          <div class="info-list">
            <div class="info-row">
              <div class="info-label">Tipo de acesso</div>
              <div class="info-value">
                <span class="role-pill" :class="`role-${user.role?.toLowerCase()}`">{{ roleLabel(user.role) }}</span>
              </div>
            </div>

            <div class="info-row">
              <div class="info-label">Membro desde</div>
              <div class="info-value">{{ formatDate(user.createdAt) }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Status</div>
              <div class="info-value">
                <span class="status-active">
                  <span class="status-dot"></span>
                  Conta ativa
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Address card (full width if exists) -->
        <div v-if="user.address?.cep" class="info-card address-card">
          <div class="card-title">
            <div class="title-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C6.24 2 4 4.24 4 7c0 4 5 9 5 9s5-5 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            </div>
            <h2>Endereço</h2>
          </div>

          <div class="address-grid">
            <div class="info-row">
              <div class="info-label">CEP</div>
              <div class="info-value">{{ user.address.cep }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Logradouro</div>
              <div class="info-value">{{ user.address.street }}<span v-if="user.address.number">, {{ user.address.number }}</span></div>
            </div>
            <div class="info-row">
              <div class="info-label">Bairro</div>
              <div class="info-value">{{ user.address.district }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Cidade / UF</div>
              <div class="info-value">{{ user.address.city }} — {{ user.address.state }}</div>
            </div>
          </div>
        </div>

      </div>

      <div v-if="errorMsg" class="error-msg">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        {{ errorMsg }}
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'ProfileView',
  data() {
    return {
      user: null,
      loading: true,
      errorMsg: ''
    }
  },
  computed: {
    initials() {
      if (!this.user?.name) return '?'
      return this.user.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('')
    }
  },
  methods: {
    formatCpf(cpf) {
      if (!cpf) return '-'
      const c = cpf.replace(/\D/g, '')
      return c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    },
    formatPhone(phone) {
      if (!phone) return '-'
      const p = phone.replace(/\D/g, '')
      if (p.length === 11) return p.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      return p.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    },
    formatDate(iso) {
      if (!iso) return '-'
      return new Date(iso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    },
    roleLabel(role) {
      const map = { PATIENT: 'Paciente', SECRETARY: 'Secretária', ADMIN: 'Administrador' }
      return map[role] || role
    },
    async loadProfile() {
      try {
        const res = await api.get('/auth/me')
        this.user = res.data.data
      } catch {
        this.errorMsg = 'Erro ao carregar perfil. Tente novamente.'
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.loadProfile()
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8fafc;
}

/* HERO */
.profile-hero {
  position: relative;
  height: 260px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(13,148,136,0.93) 0%, rgba(19,78,74,0.88) 60%, rgba(13,148,136,0.7) 100%);
}

.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 32px 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.18s;
  width: fit-content;
}

.btn-back:hover { background: rgba(255,255,255,0.25); }

.profile-identity {
  display: flex;
  align-items: flex-end;
  gap: 20px;
}

.big-avatar {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(255,255,255,0.25);
  border: 3px solid rgba(255,255,255,0.4);
  font-size: 30px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(8px);
}

.identity-text h1 {
  font-size: 30px;
  font-weight: 800;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

.identity-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.identity-since {
  font-size: 13px;
  opacity: 0.8;
}

/* CONTENT */
.content-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 32px 60px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 60px 0;
  color: #64748b;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #0d9488;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.address-card { grid-column: 1 / -1; }

/* INFO CARD */
.info-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(15,23,42,0.05);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.title-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0d9488, #0f766e);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(13,148,136,0.28);
}

.card-title h2 {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
}

.info-list { display: flex; flex-direction: column; gap: 0; }

.info-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;
  align-items: center;
  padding: 13px 0;
  border-bottom: 1px solid #f1f5f9;
}

.info-row:last-child { border-bottom: none; }

.info-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
}

.info-value {
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
}

.address-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.address-grid .info-row { border-right: 1px solid #f1f5f9; padding: 13px 16px 13px 0; }
.address-grid .info-row:nth-child(even) { border-right: none; padding-left: 16px; }

/* ROLE PILL */
.role-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.role-patient { background: #dcfce7; color: #15803d; }
.role-secretary { background: #fef9c3; color: #854d0e; }
.role-admin { background: #fce7f3; color: #9d174d; }

/* STATUS */
.status-active {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #15803d;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 14px;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .profile-grid { grid-template-columns: 1fr; }
  .address-card { grid-column: 1; }
  .address-grid { grid-template-columns: 1fr; }
  .address-grid .info-row { border-right: none; padding: 12px 0; }
  .content-wrap { padding: 20px 16px 48px; }
  .profile-identity { flex-direction: column; align-items: flex-start; gap: 12px; }
  .identity-text h1 { font-size: 22px; }
}
</style>