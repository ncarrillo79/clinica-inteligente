require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const mongoose = require('mongoose')
const { Doctor } = require('../modules/doctors/doctor.model')

// dayOfWeek: 0=Dom 1=Seg 2=Ter 3=Qua 4=Qui 5=Sex 6=Sab
const doctors = [
  // ── Cardiologia ─────────────────────────────────────────
  {
    name: 'Dr. Ricardo Alves',
    specialty: 'Cardiologia',
    crm: '12345-SP',
    email: 'ricardo.alves@clinica.com',
    schedule: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '13:00' },
      { dayOfWeek: 3, startTime: '08:00', endTime: '13:00' },
      { dayOfWeek: 5, startTime: '08:00', endTime: '12:00' }
    ]
  },
  {
    name: 'Dra. Fernanda Costa',
    specialty: 'Cardiologia',
    crm: '23456-SP',
    email: 'fernanda.costa@clinica.com',
    schedule: [
      { dayOfWeek: 2, startTime: '09:00', endTime: '12:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '12:00' }
    ]
  },
  {
    name: 'Dr. Marcos Souza',
    specialty: 'Cardiologia',
    crm: '34567-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '14:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '14:00', endTime: '18:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '12:00' }
    ]
  },

  // ── Dermatologia ────────────────────────────────────────
  {
    name: 'Dra. Ana Paula Lima',
    specialty: 'Dermatologia',
    crm: '45678-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '07:00', endTime: '12:00' },
      { dayOfWeek: 3, startTime: '07:00', endTime: '12:00' },
      { dayOfWeek: 5, startTime: '07:00', endTime: '11:00' }
    ]
  },
  {
    name: 'Dr. Bruno Ferreira',
    specialty: 'Dermatologia',
    crm: '56789-SP',
    schedule: [
      { dayOfWeek: 2, startTime: '09:00', endTime: '14:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '14:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '12:00' }
    ]
  },

  // ── Ortopedia ───────────────────────────────────────────
  {
    name: 'Dr. Carlos Mendes',
    specialty: 'Ortopedia',
    crm: '67890-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 3, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 5, startTime: '08:00', endTime: '12:00' }
    ]
  },
  {
    name: 'Dra. Juliana Torres',
    specialty: 'Ortopedia',
    crm: '78901-SP',
    schedule: [
      { dayOfWeek: 2, startTime: '13:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '13:00', endTime: '17:00' }
    ]
  },
  {
    name: 'Dr. Pedro Oliveira',
    specialty: 'Ortopedia',
    crm: '89012-SP',
    schedule: [
      { dayOfWeek: 3, startTime: '07:00', endTime: '11:00' },
      { dayOfWeek: 5, startTime: '07:00', endTime: '11:00' },
      { dayOfWeek: 6, startTime: '07:00', endTime: '10:30' }
    ]
  },

  // ── Pediatria ───────────────────────────────────────────
  {
    name: 'Dra. Mariana Santos',
    specialty: 'Pediatria',
    crm: '90123-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 2, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 3, startTime: '08:00', endTime: '12:00' }
    ]
  },
  {
    name: 'Dr. Lucas Pereira',
    specialty: 'Pediatria',
    crm: '01234-SP',
    schedule: [
      { dayOfWeek: 4, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '11:00' }
    ]
  },

  // ── Ginecologia ─────────────────────────────────────────
  {
    name: 'Dra. Cristina Rocha',
    specialty: 'Ginecologia',
    crm: '11111-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '07:00', endTime: '11:00' },
      { dayOfWeek: 3, startTime: '07:00', endTime: '11:00' },
      { dayOfWeek: 5, startTime: '07:00', endTime: '11:00' }
    ]
  },
  {
    name: 'Dra. Patrícia Neves',
    specialty: 'Ginecologia',
    crm: '22222-SP',
    schedule: [
      { dayOfWeek: 2, startTime: '10:00', endTime: '14:00' },
      { dayOfWeek: 4, startTime: '10:00', endTime: '14:00' },
      { dayOfWeek: 6, startTime: '09:00', endTime: '12:00' }
    ]
  },

  // ── Clínica Geral ───────────────────────────────────────
  {
    name: 'Dr. Eduardo Lima',
    specialty: 'Clínica Geral',
    crm: '33333-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '07:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '07:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '07:00', endTime: '12:00' },
      { dayOfWeek: 4, startTime: '07:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '07:00', endTime: '17:00' }
    ]
  },
  {
    name: 'Dra. Sofia Martins',
    specialty: 'Clínica Geral',
    crm: '44444-SP',
    schedule: [
      { dayOfWeek: 2, startTime: '08:00', endTime: '16:00' },
      { dayOfWeek: 3, startTime: '13:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '08:00', endTime: '16:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '12:00' }
    ]
  },

  // ── Neurologia ──────────────────────────────────────────
  {
    name: 'Dr. Henrique Dias',
    specialty: 'Neurologia',
    crm: '55555-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '12:00' }
    ]
  },
  {
    name: 'Dra. Renata Campos',
    specialty: 'Neurologia',
    crm: '66666-SP',
    schedule: [
      { dayOfWeek: 2, startTime: '14:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '14:00', endTime: '18:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '11:00' }
    ]
  },

  // ── Psiquiatria ─────────────────────────────────────────
  {
    name: 'Dra. Amanda Vieira',
    specialty: 'Psiquiatria',
    crm: '77777-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 2, startTime: '13:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '08:00', endTime: '12:00' }
    ]
  },
  {
    name: 'Dr. Thiago Barbosa',
    specialty: 'Psiquiatria',
    crm: '77778-SP',
    schedule: [
      { dayOfWeek: 3, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '11:00' }
    ]
  },

  // ── Oftalmologia ────────────────────────────────────────
  {
    name: 'Dr. Rafael Lopes',
    specialty: 'Oftalmologia',
    crm: '88888-SP',
    schedule: [
      { dayOfWeek: 2, startTime: '07:30', endTime: '11:30' },
      { dayOfWeek: 4, startTime: '07:30', endTime: '11:30' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '11:00' }
    ]
  },
  {
    name: 'Dra. Isabela Gomes',
    specialty: 'Oftalmologia',
    crm: '88889-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '13:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '13:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '13:00', endTime: '16:00' }
    ]
  },

  // ── Endocrinologia ──────────────────────────────────────
  {
    name: 'Dra. Gabriela Moura',
    specialty: 'Endocrinologia',
    crm: '99999-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '14:00' },
      { dayOfWeek: 3, startTime: '10:00', endTime: '14:00' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '13:00' }
    ]
  },
  {
    name: 'Dr. Fábio Rezende',
    specialty: 'Endocrinologia',
    crm: '99998-SP',
    schedule: [
      { dayOfWeek: 2, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 4, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '11:00' }
    ]
  },

  // ── Gastroenterologia ───────────────────────────────────
  {
    name: 'Dr. André Machado',
    specialty: 'Gastroenterologia',
    crm: '11112-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 3, startTime: '14:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '08:00', endTime: '12:00' }
    ]
  },

  // ── Urologia ────────────────────────────────────────────
  {
    name: 'Dr. Sérgio Pinto',
    specialty: 'Urologia',
    crm: '11113-SP',
    schedule: [
      { dayOfWeek: 2, startTime: '07:00', endTime: '11:00' },
      { dayOfWeek: 4, startTime: '07:00', endTime: '11:00' },
      { dayOfWeek: 6, startTime: '07:00', endTime: '10:00' }
    ]
  },

  // ── Otorrinolaringologia ─────────────────────────────────
  {
    name: 'Dra. Camila Araújo',
    specialty: 'Otorrinolaringologia',
    crm: '11114-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '12:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '12:00' }
    ]
  },

  // ── Psicologia ──────────────────────────────────────────
  {
    name: 'Dra. Luciana Freitas',
    specialty: 'Psicologia',
    crm: '11115-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '18:00' },
      { dayOfWeek: 2, startTime: '08:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '08:00', endTime: '18:00' }
    ]
  },
  {
    name: 'Dr. Vinícius Castro',
    specialty: 'Psicologia',
    crm: '11116-SP',
    schedule: [
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 6, startTime: '09:00', endTime: '13:00' }
    ]
  },

  // ── Fisioterapia ────────────────────────────────────────
  {
    name: 'Dra. Natália Correia',
    specialty: 'Fisioterapia',
    crm: '11117-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '07:00', endTime: '11:00' },
      { dayOfWeek: 2, startTime: '07:00', endTime: '11:00' },
      { dayOfWeek: 3, startTime: '07:00', endTime: '11:00' },
      { dayOfWeek: 4, startTime: '07:00', endTime: '11:00' },
      { dayOfWeek: 5, startTime: '07:00', endTime: '11:00' }
    ]
  },
  {
    name: 'Dr. Rodrigo Teixeira',
    specialty: 'Fisioterapia',
    crm: '11118-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '13:00', endTime: '18:00' },
      { dayOfWeek: 2, startTime: '13:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '13:00', endTime: '18:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '12:00' }
    ]
  },

  // ── Nutrição ────────────────────────────────────────────
  {
    name: 'Dra. Beatriz Fonseca',
    specialty: 'Nutrição',
    crm: '11119-SP',
    schedule: [
      { dayOfWeek: 2, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '12:00' }
    ]
  },

  // ── Odontologia ─────────────────────────────────────────
  {
    name: 'Dr. Paulo Henrique',
    specialty: 'Odontologia',
    crm: '11120-SP',
    schedule: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '08:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 4, startTime: '08:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '08:00', endTime: '17:00' }
    ]
  },
  {
    name: 'Dra. Larissa Melo',
    specialty: 'Odontologia',
    crm: '11121-SP',
    schedule: [
      { dayOfWeek: 2, startTime: '07:00', endTime: '12:00' },
      { dayOfWeek: 4, startTime: '07:00', endTime: '12:00' },
      { dayOfWeek: 6, startTime: '07:00', endTime: '11:00' }
    ]
  }
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Conectado ao MongoDB')

  let inserted = 0
  let skipped = 0

  for (const doc of doctors) {
    const exists = await Doctor.findOne({ crm: doc.crm })
    if (exists) {
      skipped++
      continue
    }
    await Doctor.create(doc)
    inserted++
    console.log(`  + ${doc.name} (${doc.specialty})`)
  }

  console.log(`\nConcluído: ${inserted} inseridos, ${skipped} já existiam.`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
