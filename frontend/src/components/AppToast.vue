<template>
  <transition name="toast-slide">
    <div
      v-if="store.visible"
      class="toast"
      :class="`toast-${store.type}`"
      role="alert"
      @click="store.dismiss()"
    >
      <svg v-if="store.type === 'success'" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.5"/>
        <path d="M5.5 9l2.5 2.5 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else-if="store.type === 'error'" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.5"/>
        <path d="M9 5.5v4M9 11.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.5"/>
        <path d="M9 8v5M9 6v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>{{ store.message }}</span>
    </div>
  </transition>
</template>

<script>
import { useNotificationStore } from '../stores/notification.store'

export default {
  name: 'AppToast',
  setup() {
    return { store: useNotificationStore() }
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(15,23,42,0.16);
  max-width: 380px;
  cursor: pointer;
  user-select: none;
}

.toast-success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.toast-error   { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
.toast-info    { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

.toast-slide-enter-active,
.toast-slide-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-slide-enter-from,
.toast-slide-leave-to { opacity: 0; transform: translateY(-10px) translateX(10px); }
</style>
