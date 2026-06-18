<template>
  <header class="navbar">
    <div class="navbar-shell">
      <div class="brand" @click="goAppointments">
        <div class="brand-icon">🏥</div>
        <div class="brand-text">
          <strong>Clínica Inteligente</strong>
          <span>Agendamentos e clima</span>
        </div>
      </div>

      <nav class="nav-links">
        <RouterLink to="/appointments" class="nav-link">Consultas</RouterLink>
        <RouterLink to="/my-appointments" class="nav-link">Minhas Consultas</RouterLink>
      </nav>

      <div class="nav-actions">
        <button class="btn btn-secondary" @click="goAppointments">
          Ir para agenda
        </button>
        <button class="btn btn-danger" @click="logout">
          Voltar para login
        </button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'NavbarView',
  methods: {
    goAppointments() {
      this.$router.push('/appointments')
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
}

.navbar-shell {
  max-width: 1180px;
  margin: 0 auto;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  min-width: 220px;
}

.brand-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2563eb, #38bdf8);
  color: white;
  font-size: 20px;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.22);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-text strong {
  font-size: 15px;
  color: #0f172a;
}

.brand-text span {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-link {
  text-decoration: none;
  color: #334155;
  font-weight: 700;
  font-size: 14px;
  padding: 10px 14px;
  border-radius: 12px;
  transition: 0.2s ease;
}

.nav-link:hover {
  background: #eff6ff;
  color: #1d4ed8;
}

.nav-link.router-link-active {
  background: #dbeafe;
  color: #1d4ed8;
}

.nav-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
  min-width: 220px;
}

.btn {
  height: 40px;
  border: none;
  border-radius: 12px;
  padding: 0 14px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-secondary {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-secondary:hover {
  background: #cbd5e1;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

@media (max-width: 960px) {
  .navbar-shell {
    flex-direction: column;
    align-items: stretch;
  }

  .brand,
  .nav-actions {
    min-width: 100%;
  }

  .nav-links {
    justify-content: flex-start;
  }

  .nav-actions {
    justify-content: stretch;
  }

  .btn {
    width: 100%;
  }
}
</style>