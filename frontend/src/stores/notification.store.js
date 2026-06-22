import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    message: '',
    type: 'error', // 'error' | 'success' | 'info'
    visible: false,
    _timer: null
  }),

  actions: {
    show(message, type = 'error', durationMs = 4000) {
      if (this._timer) clearTimeout(this._timer)
      this.message = message
      this.type = type
      this.visible = true
      this._timer = setTimeout(() => { this.visible = false }, durationMs)
    },
    success(message) { this.show(message, 'success') },
    error(message)   { this.show(message, 'error') },
    info(message)    { this.show(message, 'info') },
    dismiss()        { this.visible = false }
  }
})
