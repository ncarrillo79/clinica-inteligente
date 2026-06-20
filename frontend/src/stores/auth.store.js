import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null
  },

  actions: {
    async login(email, password) {
      const res = await api.post('/auth/login', { email, password })
      this.token = res.data.data.token
      this.user = res.data.data.user
      localStorage.setItem('token', this.token)
    },

    async register(payload) {
      const res = await api.post('/auth/register', payload)
      this.token = res.data.data.token
      this.user = res.data.data.user
      localStorage.setItem('token', this.token)
    },

    async fetchMe() {
      const res = await api.get('/auth/me')
      this.user = res.data.data
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})
