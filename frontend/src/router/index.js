import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AppointmentView from '../views/AppointmentView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      showNavbar: false,
      requiresAuth: false
    }
  },
  {
    path: '/appointments',
    name: 'appointments',
    component: AppointmentView,
    meta: {
      showNavbar: true,
      requiresAuth: true
    }
  },
  {
    path: '/my-appointments',
    name: 'myAppointments',
    component: AppointmentView,
    meta: {
      showNavbar: true,
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return { name: 'login' }
  }

  if (to.name === 'login' && token) {
    return { name: 'appointments' }
  }
})

export default router