import axios from 'axios'
import { useNotificationStore } from '../stores/notification.store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // Show global toast only for unexpected server errors (5xx) or network failures
    if (!status || status >= 500) {
      try {
        const notify = useNotificationStore()
        notify.error('Erro inesperado no servidor. Tente novamente em instantes.')
      } catch {
        // Pinia may not be initialized during early app boot
      }
    }

    return Promise.reject(error)
  }
)

export default api
