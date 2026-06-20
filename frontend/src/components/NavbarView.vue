<template>
  <header class="navbar">
    <div class="inner">
      <div class="brand" @click="$router.push('/appointments')">
        <div class="cross"><span></span><span></span></div>
        <strong>Clínica Inteligente</strong>
      </div>

      <nav>
        <RouterLink to="/appointments" class="link">Consultas</RouterLink>
        <RouterLink to="/profile" class="link">Perfil</RouterLink>
      </nav>

      <button class="logout" @click="logout">Sair</button>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from '../stores/auth.store'

export default {
  name: 'NavbarView',
  methods: {
    logout() {
      useAuthStore().logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #f1f5f9;
}

.inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.cross {
  width: 30px;
  height: 30px;
  background: #0d9488;
  border-radius: 7px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cross span {
  position: absolute;
  background: white;
  border-radius: 2px;
}

.cross span:first-child { width: 13px; height: 2.5px; }
.cross span:last-child { width: 2.5px; height: 13px; }

.brand strong {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

nav {
  display: flex;
  gap: 4px;
}

.link {
  text-decoration: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  transition: color 0.15s, background 0.15s;
}

.link:hover { color: #0f172a; background: #f8fafc; }
.link.router-link-active { color: #0d9488; background: #f0fdfa; font-weight: 600; }

.logout {
  background: none;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.logout:hover { border-color: #fca5a5; color: #dc2626; background: #fef2f2; }
</style>