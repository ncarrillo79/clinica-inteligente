# Clínica Inteligente

API y SPA para gestión de citas médicas con **scoring de riesgo de no-show** (probabilidad de que un paciente falte a la consulta) basado en historial del paciente, antecedencia de la cita, día/hora y previsión del clima.

> ⚠️ **Sobre el "inteligente":** el módulo de predicción es una **heurística de pesos definidos manualmente** a partir de literatura clínica, **no** un modelo de machine learning entrenado con datos. El código documenta explícitamente cada peso y deja preparado el camino (y los campos de features en el modelo) para sustituirlo por una regresión logística entrenada. Ver `backend/src/modules/prediction/prediction.service.js`.

## Stack

- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT, bcryptjs, express-validator, Helmet, CORS, rate-limiting, Swagger (OpenAPI).
- **Frontend:** Vue 3, Vue Router, Pinia, Axios, Vite.
- **Tests:** Jest + Supertest.
- **Tooling:** ESLint, Prettier.

## Estructura

```
backend/
  src/
    config/        # env, db, swagger
    middlewares/   # auth, authorize (RBAC), validate, error
    modules/       # auth, users, appointments, doctors, address, weather, prediction
    routes/        # router raíz
    utils/         # jwt, api-error, async-handler, sanitize-user
    __tests__/     # tests de integración
frontend/
  src/
    views/ components/ router/ stores/ services/
```

## Requisitos

- Node.js 18+
- MongoDB en local o una URI de Atlas
- (Opcional) API key de OpenWeather para la previsión real del clima

## Puesta en marcha

### Backend

```bash
cd backend
cp src/.env.example .env      # completa los valores
npm install
npm run dev                   # nodemon, http://localhost:3000
```

Documentación interactiva de la API: `http://localhost:3000/docs`

### Frontend

```bash
cd frontend
cp .env.example .env          # ajusta VITE_API_URL si hace falta
npm install
npm run dev                   # Vite, http://localhost:5173
```

## Variables de entorno

### Backend

| Variable | Descripción | Por defecto |
|----------|-------------|-------------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno | `development` |
| `MONGODB_URI` | URI de conexión a MongoDB (**requerida**) | — |
| `JWT_SECRET` | Secreto para firmar JWT (**requerida**) | — |
| `JWT_EXPIRES_IN` | Expiración del token | `1d` |
| `OPENWEATHER_API_KEY` | API key de OpenWeather | — |
| `OPENWEATHER_BASE_URL` | URL base de OpenWeather | — |
| `FRONTEND_URL` | Origen permitido por CORS | `http://localhost:5173` |

### Frontend

| Variable | Descripción | Por defecto |
|----------|-------------|-------------|
| `VITE_API_URL` | URL base de la API backend | `http://localhost:3000/api` |

## Scripts

**Backend:** `npm run dev` · `npm start` · `npm test` · `npm run lint` · `npm run format`
**Frontend:** `npm run dev` · `npm run build` · `npm run preview`

## Tests

```bash
cd backend
npm test        # requiere una instancia de MongoDB de test accesible
```

## Roles y permisos

Tres roles: `PATIENT`, `SECRETARY`, `ADMIN`, aplicados vía middleware `authorize`. El registro público crea siempre usuarios `PATIENT`; los roles elevados se asignan solo desde endpoints protegidos.

## Estado del proyecto

Proyecto en desarrollo / prototipo. **No** apto para producción clínica sin trabajo adicional de cumplimiento (LGPD), auditoría, cifrado en reposo y endurecimiento de seguridad.

## Licencia

ISC

## Autora

Norma J. Carrillo Fajardo
