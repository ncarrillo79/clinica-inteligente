<template>
  <div class="page">
    <div class="page-shell">
      <header class="page-header">
        <div>
          <p class="eyebrow">Sistema de Clínica</p>
          <h1>Minhas Consultas</h1>
          <p class="subtitle">
            Agende, acompanhe e cancele suas consultas com alerta climático.
          </p>
        </div>

        <div class="header-actions">
          <button class="btn btn-secondary" @click="goToLogin">
            Trocar usuário
          </button>
          <button class="btn btn-danger" @click="logout">
            Voltar para login
          </button>
        </div>
      </header>

      <section class="card form-card">
        <div class="card-header">
          <h2>Nova Consulta</h2>
          <p>Preencha os dados abaixo para agendar um novo atendimento.</p>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Doctor</label>
            <input v-model="form.doctorName" placeholder="Ex: Dr. João" />
          </div>

          <div class="field">
            <label>Especialidade</label>
            <input v-model="form.specialty" placeholder="Ex: Clínico Geral" />
          </div>

          <div class="field">
            <label>Data</label>
            <input v-model="form.appointmentDate" type="date" />
          </div>

          <div class="field">
            <label>Hora</label>
            <input v-model="form.appointmentTime" type="time" />
          </div>

          <div class="field field-full">
            <label>Observações</label>
            <input v-model="form.notes" placeholder="Ex: Retorno, jejum, exames..." />
          </div>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" @click="createAppointment">
            Agendar Consulta
          </button>
        </div>
      </section>

      <section class="list-section">
        <div class="list-header">
          <h2>Consultas cadastradas</h2>
          <button class="btn btn-secondary" @click="loadAppointments">
            Atualizar lista
          </button>
        </div>

        <div v-if="appointments.length === 0" class="empty-state">
          <p>Nenhuma consulta encontrada.</p>
          <span>Crie sua primeira consulta no formulário acima.</span>
        </div>

        <div v-else class="cards-grid">
          <article class="appointment-card" v-for="item in appointments" :key="item._id">
            <div class="appointment-top">
              <div>
                <h3>{{ item.doctorName }}</h3>
                <p class="specialty">{{ item.specialty }}</p>
              </div>

              <span
                :class="[
                  'status-badge',
                  item.status === 'CANCELLED' ? 'status-cancelled' : 'status-scheduled'
                ]"
              >
                {{ item.status }}
              </span>
            </div>

            <div class="appointment-info">
              <p><strong>Data:</strong> {{ item.appointmentDate }}</p>
              <p><strong>Hora:</strong> {{ item.appointmentTime }}</p>
            </div>

            <div v-if="item.notes" class="notes-box">
              <strong>Observações:</strong>
              <span>{{ item.notes }}</span>
            </div>

            <div v-if="item.weather" class="weather-box">
              <p class="weather-line">
                🌤 {{ item.weather.description }} - {{ item.weather.temperature }}°C
              </p>

              <p v-if="item.weather.willRain" class="rain-text">
                ☔ Vai chover
              </p>

              <p v-if="item.weather.alert" class="alert-text">
                ⚠️ {{ item.weather.alert }}
              </p>
            </div>

            <div class="card-actions">
              <button
                v-if="item.status !== 'CANCELLED'"
                class="btn btn-danger"
                @click="cancelAppointment(item._id)"
              >
                Cancelar
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AppointmentView',

  data() {
    return {
      appointments: [],
      form: {
        doctorName: '',
        specialty: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: ''
      }
    }
  },

  methods: {
    async loadAppointments() {
      try {
        const token = localStorage.getItem('token')

        const res = await axios.get(
          'http://localhost:3000/api/appointments/my',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        this.appointments = res.data.data
      } catch (error) {
        console.error('Erro ao carregar consultas:', error)
        alert('Erro ao carregar consultas')
      }
    },

    async createAppointment() {
      try {
        const token = localStorage.getItem('token')

        await axios.post(
          'http://localhost:3000/api/appointments',
          this.form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        alert('Consulta criada com sucesso')

        this.form = {
          doctorName: '',
          specialty: '',
          appointmentDate: '',
          appointmentTime: '',
          notes: ''
        }

        await this.loadAppointments()
      } catch (error) {
        console.error(error)
        alert('Erro ao criar consulta')
      }
    },

    async cancelAppointment(id) {
      try {
        const token = localStorage.getItem('token')

        await axios.patch(
          `http://localhost:3000/api/appointments/${id}/cancel`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        alert('Consulta cancelada com sucesso')
        await this.loadAppointments()
      } catch (error) {
        console.error(error)
        alert('Erro ao cancelar consulta')
      }
    },

    goToLogin() {
      this.$router.push('/login')
    },

    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  },

  mounted() {
    this.loadAppointments()
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f3f7fb 0%, #eef3f9 100%);
  padding: 32px 16px;
}

.page-shell {
  max-width: 1080px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #2563eb;
}

h1 {
  margin: 0;
  font-size: 34px;
  color: #0f172a;
}

.subtitle {
  margin-top: 8px;
  color: #64748b;
  max-width: 650px;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.card {
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;
}

.form-card {
  margin-bottom: 28px;
}

.card-header h2,
.list-header h2 {
  margin: 0 0 8px;
  color: #0f172a;
}

.card-header p {
  margin: 0;
  color: #64748b;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-full {
  grid-column: 1 / -1;
}

label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

input {
  height: 46px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  padding: 0 14px;
  font-size: 15px;
  outline: none;
  transition: 0.2s ease;
  background: #fff;
}

input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.list-section {
  margin-top: 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.empty-state {
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 18px;
  padding: 32px;
  text-align: center;
  color: #475569;
}

.empty-state p {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
}

.empty-state span {
  color: #64748b;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.appointment-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;
}

.appointment-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.appointment-top h3 {
  margin: 0;
  color: #0f172a;
  font-size: 22px;
}

.specialty {
  margin: 4px 0 0;
  color: #64748b;
}

.appointment-info {
  display: grid;
  gap: 6px;
  margin-bottom: 14px;
  color: #334155;
}

.notes-box,
.weather-box {
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 14px;
}

.notes-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #334155;
}

.weather-box {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.weather-line {
  margin: 0 0 8px;
  color: #1e3a8a;
  font-weight: 600;
}

.rain-text {
  margin: 0 0 6px;
  color: #0f766e;
  font-weight: 700;
}

.alert-text {
  margin: 0;
  color: #b45309;
  font-weight: 700;
}

.card-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.status-scheduled {
  background: #dcfce7;
  color: #166534;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.btn {
  height: 42px;
  border: none;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}

.btn-primary:hover {
  background: #1d4ed8;
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
  color: #fff;
}

.btn-danger:hover {
  background: #dc2626;
}

@media (max-width: 860px) {
  .page-header,
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }

  .cards-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions,
  .card-actions {
    justify-content: stretch;
  }

  .btn {
    width: 100%;
  }
}
</style>