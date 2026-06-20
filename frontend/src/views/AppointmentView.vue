<template>
  <div class="dashboard">

    <!-- Toast notifications -->
    <transition name="toast-fade">
      <div v-if="successMsg" class="toast toast-success">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 9l2.5 2.5 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        {{ successMsg }}
      </div>
    </transition>

    <transition name="toast-fade">
      <div v-if="errorMsg" class="toast toast-error">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M9 6v3.5M9 11.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        {{ errorMsg }}
      </div>
    </transition>

    <!-- Page header with hero image -->
    <div class="page-hero">
      <img
        src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1600&q=85&auto=format&fit=crop"
        alt="Clínica moderna"
        class="hero-bg"
      />
      <div class="hero-gradient"></div>
      <div class="hero-inner">
        <div class="hero-text">
          <span class="hero-eyebrow">Sistema de Agendamentos</span>
          <h1>Minhas Consultas</h1>
          <p>Agende, acompanhe e cancele suas consultas com alertas climáticos em tempo real.</p>
        </div>

        <div class="hero-stats">
          <div class="stat-card">
            <div class="stat-icon stat-icon-total">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M6 2v3M14 2v3M2 9h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </div>
            <div>
              <strong>{{ appointments.length }}</strong>
              <span>Total</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-icon-scheduled">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M6.5 10l2.5 2.5 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div>
              <strong>{{ scheduledCount }}</strong>
              <span>Agendadas</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-icon-cancelled">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M7 13l6-6M7 7l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </div>
            <div>
              <strong>{{ cancelledCount }}</strong>
              <span>Canceladas</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="content-wrap">

      <!-- WIZARD: NOVA CONSULTA -->
      <section class="section-card">
        <div class="section-head">
          <div class="section-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
          <div>
            <h2>Nova Consulta</h2>
            <p>Escolha a especialidade, o médico, a data e o horário</p>
          </div>
        </div>

        <!-- Step indicator -->
        <div class="wizard-steps">
          <div class="wstep" :class="{ active: wizardStep >= 1, done: wizardStep > 1 }">
            <div class="wstep-dot">
              <svg v-if="wizardStep > 1" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span v-else>1</span>
            </div>
            <span>Especialidade &amp; Médico</span>
          </div>
          <div class="wstep-line" :class="{ done: wizardStep > 1 }"></div>
          <div class="wstep" :class="{ active: wizardStep >= 2, done: wizardStep > 2 }">
            <div class="wstep-dot">
              <svg v-if="wizardStep > 2" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span v-else>2</span>
            </div>
            <span>Data</span>
          </div>
          <div class="wstep-line" :class="{ done: wizardStep > 2 }"></div>
          <div class="wstep" :class="{ active: wizardStep >= 3 }">
            <div class="wstep-dot"><span>3</span></div>
            <span>Horário &amp; Confirmar</span>
          </div>
        </div>

        <!-- STEP 1: Specialty + Doctor list -->
        <div v-if="wizardStep === 1">
          <div class="field" style="max-width:340px; margin-bottom:24px">
            <label>Especialidade</label>
            <div class="input-wrap">
              <svg class="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v3M5 4h6M4 7h8l-1 7H5L4 7z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <select v-model="form.specialty" class="select-field" @change="onSpecialtyChange">
                <option value="" disabled>Selecione a especialidade</option>
                <option>Clínica Geral</option>
                <option>Cardiologia</option>
                <option>Dermatologia</option>
                <option>Endocrinologia</option>
                <option>Fisioterapia</option>
                <option>Gastroenterologia</option>
                <option>Ginecologia</option>
                <option>Neurologia</option>
                <option>Nutrição</option>
                <option>Odontologia</option>
                <option>Oftalmologia</option>
                <option>Ortopedia</option>
                <option>Otorrinolaringologia</option>
                <option>Pediatria</option>
                <option>Psicologia</option>
                <option>Psiquiatria</option>
                <option>Urologia</option>
              </select>
            </div>
          </div>

          <div v-if="loadingDoctors" class="loading-msg">
            <span class="spinner spinner-teal"></span> Buscando médicos...
          </div>

          <div v-else-if="doctors.length > 0">
            <p class="doctors-count">{{ doctors.length }} médico(s) disponível(is) em <strong>{{ form.specialty }}</strong></p>
            <div class="doctors-grid">
              <button
                v-for="doc in doctors"
                :key="doc._id"
                class="doctor-card"
                @click="selectDoctor(doc)"
              >
                <div class="doc-avatar">{{ doc.name.charAt(4) || doc.name.charAt(0) }}</div>
                <div class="doc-info">
                  <strong>{{ doc.name }}</strong>
                  <span class="doc-specialty">{{ doc.specialty }}</span>
                  <div class="doc-days">
                    <span
                      v-for="slot in doc.schedule"
                      :key="slot.dayOfWeek"
                      class="day-chip"
                    >{{ dayLabel(slot.dayOfWeek) }}</span>
                  </div>
                  <span class="doc-hours">{{ formatScheduleSummary(doc.schedule) }}</span>
                </div>
                <div class="doc-arrow">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </button>
            </div>
          </div>

          <div v-else-if="form.specialty" class="no-doctors">
            Nenhum médico cadastrado para esta especialidade.
          </div>
        </div>

        <!-- STEP 2: Calendar -->
        <div v-if="wizardStep === 2">
          <div class="selected-doctor-banner">
            <div class="doc-avatar doc-avatar-sm">{{ selectedDoctor.name.charAt(4) || selectedDoctor.name.charAt(0) }}</div>
            <div>
              <strong>{{ selectedDoctor.name }}</strong>
              <span>{{ selectedDoctor.specialty }}</span>
            </div>
            <button class="btn-back" @click="wizardStep = 1">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Trocar médico
            </button>
          </div>

          <p class="cal-hint">Selecione um dia disponível:</p>
          <div class="cal-weekdays">
            <span v-for="d in ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']" :key="d">{{ d }}</span>
          </div>
          <div class="calendar-grid">
            <div
              v-for="cell in calendarCells"
              :key="cell.key"
              class="cal-cell"
              :class="{
                'cal-empty': !cell.date,
                'cal-available': cell.date && cell.available,
                'cal-unavailable': cell.date && !cell.available,
                'cal-selected': cell.date === form.appointmentDate,
                'cal-today': cell.date === todayStr
              }"
              @click="cell.date && cell.available && selectDate(cell.date)"
            >
              <span v-if="cell.date">{{ cell.day }}</span>
            </div>
          </div>
        </div>

        <!-- STEP 3: Time slots + notes + confirm -->
        <div v-if="wizardStep === 3">
          <div class="selected-doctor-banner">
            <div class="doc-avatar doc-avatar-sm">{{ selectedDoctor.name.charAt(4) || selectedDoctor.name.charAt(0) }}</div>
            <div>
              <strong>{{ selectedDoctor.name }}</strong>
              <span>{{ formatDateBR(form.appointmentDate) }}</span>
            </div>
            <button class="btn-back" @click="wizardStep = 2; form.appointmentTime = ''">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Trocar data
            </button>
          </div>

          <div v-if="loadingSlots" class="loading-msg">
            <span class="spinner spinner-teal"></span> Buscando horários...
          </div>
          <div v-else-if="availableSlots.length === 0" class="no-doctors">
            Não há horários disponíveis para esta data.
          </div>
          <div v-else>
            <p class="cal-hint">Horários disponíveis:</p>
            <div class="slots-grid">
              <button
                v-for="slot in availableSlots"
                :key="slot"
                class="slot-btn"
                :class="{ 'slot-selected': form.appointmentTime === slot }"
                @click="form.appointmentTime = slot"
              >{{ slot }}</button>
            </div>

            <div class="field field-notes" v-if="form.appointmentTime">
              <label>Observações <span class="label-optional">(opcional)</span></label>
              <div class="input-wrap">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 7h9M2 10h7M2 13h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                <input v-model="form.notes" placeholder="Ex: Retorno, jejum necessário, trazer exames..." />
              </div>
            </div>

            <div class="form-actions" v-if="form.appointmentTime">
              <button class="btn-teal" :disabled="loading" @click="createAppointment">
                <span v-if="loading" class="spinner"></span>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                {{ loading ? 'Agendando...' : 'Confirmar Agendamento' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="how-section">
        <div class="how-head">
          <h2>Como Funciona</h2>
          <p>Em 4 passos simples você garante seu atendimento</p>
        </div>
        <div class="steps-row">
          <div class="step-card">
            <div class="step-num">01</div>
            <div class="step-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="9" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M5 25c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </div>
            <h3>Cadastre-se</h3>
            <p>Crie sua conta em minutos com seus dados básicos.</p>
          </div>
          <div class="step-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="step-card">
            <div class="step-num">02</div>
            <div class="step-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="19" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M9 3v4M19 3v4M3 12h22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </div>
            <h3>Agende a Consulta</h3>
            <p>Escolha médico, especialidade, data e horário disponíveis.</p>
          </div>
          <div class="step-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="step-card">
            <div class="step-num">03</div>
            <div class="step-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 4c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S19.52 4 14 4z" stroke="currentColor" stroke-width="1.8"/><path d="M9 15l3.5 3.5L19 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h3>Receba Confirmação</h3>
            <p>Confirmação automática com alerta climático para o dia.</p>
          </div>
          <div class="step-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="step-card">
            <div class="step-num">04</div>
            <div class="step-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 4l2.5 5 5.5.8-4 3.9.9 5.5L14 16.6 9.1 19.2l.9-5.5L6 9.8l5.5-.8L14 4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
            </div>
            <h3>Compareça e Cuide-se</h3>
            <p>Aproveite seu atendimento com organização e tranquilidade.</p>
          </div>
        </div>
      </section>

      <!-- APPOINTMENT LIST -->
      <section class="list-section">
        <div class="list-head">
          <h2>Histórico de Consultas</h2>
          <button class="btn-outline" @click="loadAppointments">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M13 7.5A5.5 5.5 0 112.78 4.5M2 2v3h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Atualizar
          </button>
        </div>

        <!-- Empty state -->
        <div v-if="appointments.length === 0" class="empty-state">
          <img
            src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&q=80&auto=format&fit=crop"
            alt="Sem consultas"
            class="empty-img"
          />
          <h3>Nenhuma consulta ainda</h3>
          <p>Agende sua primeira consulta usando o formulário acima.</p>
        </div>

        <!-- Cards grid -->
        <div v-else class="cards-grid">
          <article
            v-for="item in appointments"
            :key="item._id"
            class="appt-card"
            :class="{ 'appt-cancelled': item.status === 'CANCELLED' }"
          >
            <div class="appt-header">
              <div class="doctor-info">
                <div class="doctor-avatar">{{ item.doctorName.charAt(0) }}</div>
                <div>
                  <h3>{{ item.doctorName }}</h3>
                  <p class="specialty-tag">{{ item.specialty }}</p>
                </div>
              </div>
              <span class="status-pill" :class="item.status === 'CANCELLED' ? 'pill-cancelled' : 'pill-scheduled'">
                {{ item.status === 'CANCELLED' ? 'Cancelada' : 'Agendada' }}
              </span>
            </div>

            <div class="appt-meta">
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M4.5 1.5v2M9.5 1.5v2M1 6h12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                {{ formatDate(item.appointmentDate) }}
              </div>
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.2"/><path d="M7 4.5V7l2 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ item.appointmentTime }}
              </div>
            </div>

            <div v-if="item.notes" class="appt-notes">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 3h10M1.5 6h7M1.5 9h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
              {{ item.notes }}
            </div>

            <!-- Weather box -->
            <div v-if="item.weather && item.weather.description !== 'sem informação'" class="weather-box" :class="{ 'weather-rain': item.weather.willRain }">
              <div class="weather-main">
                <span class="weather-icon">{{ item.weather.willRain ? '🌧' : '☀️' }}</span>
                <div>
                  <p class="weather-desc">{{ item.weather.description }}</p>
                  <p v-if="item.weather.temperature" class="weather-temp">{{ Math.round(item.weather.temperature) }}°C</p>
                </div>
              </div>
              <div v-if="item.weather.alert" class="weather-alert">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5l5.5 9.5H1L6.5 1.5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M6.5 5v2.5M6.5 9v.3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                {{ item.weather.alert }}
              </div>
            </div>

            <div class="appt-footer">
              <button
                v-if="item.status !== 'CANCELLED'"
                class="btn-cancel"
                @click="cancelAppointment(item._id)"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 3l7 7M10 3l-7 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                Cancelar consulta
              </button>
              <span v-else class="cancelled-label">Consulta cancelada</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
import { useAuthStore } from '../stores/auth.store'

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function toLocalDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default {
  name: 'AppointmentView',

  data() {
    const today = toLocalDateStr(new Date())
    return {
      appointments: [],
      successMsg: '',
      errorMsg: '',
      loading: false,
      // wizard
      wizardStep: 1,
      doctors: [],
      loadingDoctors: false,
      selectedDoctor: null,
      calendarCells: [],
      availableSlots: [],
      loadingSlots: false,
      todayStr: today,
      form: {
        specialty: '',
        doctorId: null,
        doctorName: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: ''
      }
    }
  },

  computed: {
    scheduledCount() {
      return this.appointments.filter((a) => a.status === 'SCHEDULED').length
    },
    cancelledCount() {
      return this.appointments.filter((a) => a.status === 'CANCELLED').length
    }
  },

  methods: {
    showSuccess(msg) {
      this.successMsg = msg
      this.errorMsg = ''
      setTimeout(() => { this.successMsg = '' }, 3500)
    },
    showError(msg) {
      this.errorMsg = msg
      this.successMsg = ''
      setTimeout(() => { this.errorMsg = '' }, 4000)
    },
    formatDate(iso) {
      if (!iso) return '-'
      const [y, m, d] = iso.split('-')
      return `${d}/${m}/${y}`
    },
    formatDateBR(iso) {
      return this.formatDate(iso)
    },
    dayLabel(dow) {
      return DAY_LABELS[dow]
    },
    formatScheduleSummary(schedule) {
      if (!schedule?.length) return ''
      const hours = schedule.map((s) => `${s.startTime}–${s.endTime}`)
      const unique = [...new Set(hours)]
      return unique.join(' / ')
    },

    async loadAppointments() {
      try {
        const res = await api.get('/appointments/my')
        this.appointments = res.data.data
      } catch {
        this.showError('Erro ao carregar consultas.')
      }
    },

    async onSpecialtyChange() {
      this.doctors = []
      this.selectedDoctor = null
      this.wizardStep = 1
      if (!this.form.specialty) return
      this.loadingDoctors = true
      try {
        const res = await api.get('/doctors', { params: { specialty: this.form.specialty } })
        this.doctors = res.data.data
      } catch {
        this.showError('Erro ao buscar médicos.')
      } finally {
        this.loadingDoctors = false
      }
    },

    selectDoctor(doc) {
      this.selectedDoctor = doc
      this.form.doctorId = doc._id
      this.form.doctorName = doc.name
      this.form.appointmentDate = ''
      this.form.appointmentTime = ''
      this.buildCalendar(doc)
      this.wizardStep = 2
    },

    buildCalendar(doc) {
      const availableDOW = new Set(doc.schedule.map((s) => s.dayOfWeek))
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Show current month + next month (60 days window)
      const startDate = new Date(today)
      const cells = []

      // Pad to Sunday
      const firstDOW = startDate.getDay()
      for (let i = 0; i < firstDOW; i++) cells.push({ key: `e${i}`, date: null })

      for (let i = 0; i < 42; i++) {
        const d = new Date(startDate)
        d.setDate(startDate.getDate() + i)
        const dateStr = toLocalDateStr(d)
        cells.push({
          key: dateStr,
          date: dateStr,
          day: d.getDate(),
          available: availableDOW.has(d.getDay()) && d >= today
        })
      }
      this.calendarCells = cells
    },

    async selectDate(dateStr) {
      this.form.appointmentDate = dateStr
      this.form.appointmentTime = ''
      this.availableSlots = []
      this.loadingSlots = true
      this.wizardStep = 3
      try {
        const res = await api.get(`/doctors/${this.selectedDoctor._id}/slots`, {
          params: { date: dateStr }
        })
        this.availableSlots = res.data.data.slots
      } catch {
        this.showError('Erro ao buscar horários disponíveis.')
      } finally {
        this.loadingSlots = false
      }
    },

    async createAppointment() {
      if (!this.form.appointmentTime) {
        this.showError('Selecione um horário.')
        return
      }
      this.loading = true
      try {
        await api.post('/appointments', {
          doctorId: this.form.doctorId,
          doctorName: this.form.doctorName,
          specialty: this.form.specialty,
          appointmentDate: this.form.appointmentDate,
          appointmentTime: this.form.appointmentTime,
          notes: this.form.notes
        })
        this.showSuccess('Consulta agendada com sucesso!')
        // reset wizard
        this.wizardStep = 1
        this.doctors = []
        this.selectedDoctor = null
        this.availableSlots = []
        this.form = {
          specialty: '',
          doctorId: null,
          doctorName: '',
          appointmentDate: '',
          appointmentTime: '',
          notes: ''
        }
        await this.loadAppointments()
      } catch (error) {
        const details = error.response?.data?.details
        const msg = details?.length
          ? details.map((d) => d.msg).join(' | ')
          : error.response?.data?.message || 'Erro ao criar consulta.'
        this.showError(msg)
      } finally {
        this.loading = false
      }
    },

    async cancelAppointment(id) {
      try {
        await api.patch(`/appointments/${id}/cancel`, {})
        this.showSuccess('Consulta cancelada com sucesso.')
        await this.loadAppointments()
      } catch {
        this.showError('Erro ao cancelar consulta.')
      }
    },

    logout() {
      const auth = useAuthStore()
      auth.logout()
      this.$router.push('/login')
    }
  },

  mounted() {
    this.loadAppointments()
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f8fafc;
}

/* TOAST */
.toast {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(15,23,42,0.15);
  max-width: 360px;
}

.toast-success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.toast-error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(-10px) translateX(10px); }

/* HERO */
.page-hero {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(13,148,136,0.92) 0%, rgba(19,78,74,0.88) 60%, rgba(13,148,136,0.7) 100%);
}

.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 32px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  color: white;
}

.hero-eyebrow {
  display: block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.8;
  margin-bottom: 10px;
}

.hero-text h1 {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}

.hero-text p {
  font-size: 15px;
  opacity: 0.85;
  max-width: 480px;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.stat-card {
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 120px;
  backdrop-filter: blur(8px);
}

.stat-card strong { display: block; font-size: 28px; font-weight: 800; line-height: 1; }
.stat-card span { font-size: 11px; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.06em; }

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-total { background: rgba(255,255,255,0.2); }
.stat-icon-scheduled { background: rgba(134,239,172,0.25); }
.stat-icon-cancelled { background: rgba(252,165,165,0.25); }

/* CONTENT */
.content-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 32px 60px;
}

/* SECTION CARD */
.section-card {
  background: white;
  border-radius: 20px;
  padding: 28px 28px 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 16px rgba(15,23,42,0.06);
  margin-bottom: 28px;
}

.section-head {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 24px;
}

.section-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0d9488, #0f766e);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(13,148,136,0.3);
}

.section-head h2 {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.section-head p { font-size: 14px; color: #64748b; }

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.field { display: flex; flex-direction: column; gap: 7px; }

.field-full { grid-column: 1 / -1; }

label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.label-optional { font-weight: 400; color: #94a3b8; font-size: 12px; }

.input-wrap { position: relative; }

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

input {
  width: 100%;
  height: 44px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 14px 0 38px;
  font-size: 14px;
  font-family: inherit;
  color: #0f172a;
  background: #fafafa;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

input::placeholder { color: #94a3b8; }

input:focus {
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
  background: white;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.btn-teal {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 24px;
  background: linear-gradient(135deg, #0d9488, #0f766e);
  color: white;
  border: none;
  border-radius: 11px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(13,148,136,0.3);
}

.btn-teal:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(13,148,136,0.38);
}

.btn-teal:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* LIST SECTION */
.list-section { margin-top: 8px; }

.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.list-head h2 {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.btn-outline {
  display: flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 16px;
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  color: #64748b;
  cursor: pointer;
  transition: all 0.18s;
}

.btn-outline:hover {
  border-color: #0d9488;
  color: #0d9488;
  background: #f0fdfa;
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 48px 24px;
  background: white;
  border-radius: 20px;
  border: 1.5px dashed #e2e8f0;
}

.empty-img {
  width: 180px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  opacity: 0.6;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 8px;
}

.empty-state p { color: #94a3b8; font-size: 14px; }

/* CARDS GRID */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.appt-card {
  background: white;
  border-radius: 18px;
  padding: 22px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(15,23,42,0.05);
  transition: box-shadow 0.2s, transform 0.2s;
}

.appt-card:hover {
  box-shadow: 0 8px 28px rgba(15,23,42,0.10);
  transform: translateY(-2px);
}

.appt-cancelled {
  opacity: 0.6;
}

.appt-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doctor-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0d9488, #0f766e);
  color: white;
  font-size: 18px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doctor-info h3 {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 3px;
}

.specialty-tag {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.status-pill {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
}

.pill-scheduled { background: #dcfce7; color: #15803d; }
.pill-cancelled { background: #fee2e2; color: #b91c1c; }

.appt-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.appt-notes {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 13px;
  color: #64748b;
  background: #f8fafc;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
  line-height: 1.5;
}

/* WEATHER BOX */
.weather-box {
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.weather-rain {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.weather-icon { font-size: 22px; line-height: 1; }

.weather-desc {
  font-size: 13px;
  font-weight: 600;
  color: #1e40af;
  text-transform: capitalize;
}

.weather-temp {
  font-size: 12px;
  color: #3b82f6;
  font-weight: 500;
  margin-top: 2px;
}

.weather-alert {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #b45309;
  background: #fef3c7;
  border-radius: 8px;
  padding: 6px 10px;
}

/* FOOTER ACTIONS */
.appt-footer {
  margin-top: 4px;
  display: flex;
  justify-content: flex-end;
}

.btn-cancel {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 7px 14px;
  cursor: pointer;
  transition: all 0.18s;
}

.btn-cancel:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

.cancelled-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  font-style: italic;
}

/* WIZARD STEPS */
.wizard-steps {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 28px;
}

.wstep {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
}

.wstep.active { color: #0d9488; }
.wstep.done { color: #15803d; }

.wstep-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.2s;
}

.wstep.active .wstep-dot {
  border-color: #0d9488;
  background: #0d9488;
  color: white;
}

.wstep.done .wstep-dot {
  border-color: #22c55e;
  background: #22c55e;
  color: white;
}

.wstep-line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  margin: 0 8px;
  transition: background 0.2s;
}

.wstep-line.done { background: #22c55e; }

/* DOCTOR CARDS */
.doctors-count {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 14px;
}

.doctors-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.doctor-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: all 0.18s;
  width: 100%;
}

.doctor-card:hover {
  border-color: #0d9488;
  background: #f0fdfa;
  box-shadow: 0 4px 16px rgba(13,148,136,0.1);
}

.doc-avatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0d9488, #0f766e);
  color: white;
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-transform: uppercase;
}

.doc-avatar-sm {
  width: 40px;
  height: 40px;
  font-size: 16px;
  border-radius: 10px;
}

.doc-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-info strong {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.doc-specialty {
  font-size: 12px;
  color: #0d9488;
  font-weight: 600;
}

.doc-days {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.day-chip {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 999px;
}

.doc-hours {
  font-size: 11px;
  color: #64748b;
}

.doc-arrow { color: #94a3b8; flex-shrink: 0; }

.no-doctors {
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
  padding: 24px;
}

.loading-msg {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #64748b;
  padding: 16px 0;
}

/* SELECTED DOCTOR BANNER */
.selected-doctor-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 20px;
}

.selected-doctor-banner > div:nth-child(2) {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.selected-doctor-banner strong {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.selected-doctor-banner span {
  font-size: 12px;
  color: #0d9488;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-family: inherit;
  flex-shrink: 0;
  transition: all 0.15s;
}

.btn-back:hover { border-color: #0d9488; color: #0d9488; }

/* CALENDAR */
.cal-hint {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 10px;
  font-weight: 500;
}

.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 6px;
}

.cal-weekdays span {
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 4px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.cal-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
}

.cal-empty { background: transparent; }

.cal-available {
  background: #f0fdfa;
  color: #0d9488;
  border: 1.5px solid #99f6e4;
  cursor: pointer;
}

.cal-available:hover {
  background: #0d9488;
  color: white;
  border-color: #0d9488;
  transform: scale(1.08);
}

.cal-unavailable {
  background: #f8fafc;
  color: #cbd5e1;
  border: 1px solid #f1f5f9;
  cursor: not-allowed;
}

.cal-selected {
  background: #0d9488 !important;
  color: white !important;
  border-color: #0d9488 !important;
  box-shadow: 0 4px 12px rgba(13,148,136,0.35);
}

.cal-today .cal-cell { font-weight: 800; }

/* TIME SLOTS */
.slots-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.slot-btn {
  height: 38px;
  padding: 0 16px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}

.slot-btn:hover {
  border-color: #0d9488;
  color: #0d9488;
  background: #f0fdfa;
}

.slot-selected {
  background: #0d9488 !important;
  border-color: #0d9488 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(13,148,136,0.3);
}

.field-notes { margin-top: 4px; margin-bottom: 20px; }

.spinner-teal {
  border-color: rgba(13,148,136,0.25);
  border-top-color: #0d9488;
}

/* SELECT FIELD */
.select-field {
  width: 100%;
  height: 44px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 14px 0 38px;
  font-size: 14px;
  font-family: inherit;
  color: #0f172a;
  background: #fafafa;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.select-field:focus {
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
  background: white;
}

/* HOW IT WORKS */
.how-section {
  background: white;
  border-radius: 20px;
  padding: 32px 28px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 16px rgba(15,23,42,0.06);
  margin-bottom: 28px;
}

.how-head {
  text-align: center;
  margin-bottom: 32px;
}

.how-head h2 {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
  margin-bottom: 6px;
}

.how-head p {
  font-size: 14px;
  color: #64748b;
}

.steps-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-card {
  flex: 1;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px 18px;
  text-align: center;
  transition: box-shadow 0.2s, transform 0.2s;
}

.step-card:hover {
  box-shadow: 0 6px 24px rgba(13,148,136,0.12);
  transform: translateY(-2px);
  border-color: #99f6e4;
}

.step-num {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #0d9488;
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  border-radius: 999px;
  display: inline-block;
  padding: 3px 10px;
  margin-bottom: 14px;
}

.step-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f0fdfa, #ccfbf1);
  color: #0d9488;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
}

.step-card h3 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.step-card p {
  font-size: 13px;
  color: #64748b;
  line-height: 1.55;
}

.step-arrow {
  color: #cbd5e1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

@media (max-width: 900px) {
  .steps-row { flex-direction: column; }
  .step-arrow { transform: rotate(90deg); }
}

@media (max-width: 1024px) {
  .form-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-stats { display: none; }
}

@media (max-width: 640px) {
  .content-wrap { padding: 20px 16px 48px; }
  .form-grid { grid-template-columns: 1fr; }
  .cards-grid { grid-template-columns: 1fr; }
  .hero-text h1 { font-size: 28px; }
  .section-card { padding: 20px 16px; }
}
</style>
