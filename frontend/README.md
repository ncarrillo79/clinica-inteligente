# README — Clínica Inteligente

## 1. Visão geral

A **Clínica Inteligente** é uma aplicação web full stack para gestão de consultas médicas, construída com **Vue.js** no frontend e **Node.js + Express + MongoDB** no backend.

O sistema foi pensado para clínicas de pequeno e médio porte que precisam informatizar o atendimento, oferecendo uma base moderna, segura e escalável para:

- autenticação de usuários;
- agendamento de consultas;
- visualização de consultas do paciente;
- cancelamento de consultas;
- consulta automática de endereço por CEP;
- integração com previsão do tempo;
- alertas inteligentes para o dia da consulta.

---

## 2. Objetivo do projeto

O objetivo desta aplicação é entregar uma solução funcional, organizada e pronta para evolução, com foco em:

- **segurança** no acesso aos dados;
- **boa experiência de uso** para pacientes e equipe da clínica;
- **boas práticas de arquitetura**;
- **manutenibilidade** do código;
- **facilidade de publicação e deploy**.

---

## 3. Funcionalidades implementadas

### 3.1 Autenticação

- cadastro de usuário;
- login com email e senha;
- geração de token JWT;
- proteção de rotas no backend;
- proteção de navegação no frontend;
- logout com remoção de token.

### 3.2 Consultas

- criação de consulta;
- listagem das consultas do usuário autenticado;
- prevenção de conflito de horário para o mesmo médico;
- cancelamento de consulta;
- status da consulta (`SCHEDULED` e `CANCELLED`).

### 3.3 Integrações externas

- **ViaCEP** para busca automática de endereço por CEP;
- **OpenWeather** para previsão do tempo com suporte a idioma português;
- fallback para clima indisponível, evitando quebra do sistema.

### 3.4 Inteligência de negócio

- previsão do clima baseada na data da consulta;
- alerta visual quando há chance de chuva;
- persistência dos dados climáticos na própria consulta para auditoria e exibição posterior.

### 3.5 Frontend

- tela de login;
- tela de consultas;
- formulário de criação de consulta;
- listagem das consultas com clima e status;
- botão de cancelamento;
- navbar profissional;
- rotas protegidas com Vue Router.

---

## 4. Tecnologias utilizadas

### Frontend

- Vue 3
- Vite
- Vue Router
- Axios
- CSS puro

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Axios
- Helmet
- CORS
- Morgan
- Express Rate Limit

### APIs externas

- ViaCEP
- OpenWeather

---

## 5. Arquitetura adotada

O projeto foi estruturado com separação clara entre frontend e backend:

```bash
clinica-inteligente/
├── backend/
└── frontend/
```

Essa divisão melhora organização, manutenção, escalabilidade e futura publicação independente de cada camada.

### 5.1 Backend em módulos

O backend foi organizado por módulos de negócio:

```bash
backend/src/
├── config/
├── middlewares/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── appointments/
│   ├── address/
│   └── weather/
├── routes/
└── utils/
```

#### Motivos dessa arquitetura

- **config**: centraliza variáveis de ambiente e conexão com banco;
- **middlewares**: reutiliza autenticação, tratamento de erros e validações;
- **modules**: separa regras por domínio funcional;
- **routes**: concentra o ponto de entrada das rotas da API;
- **utils**: abstrai helpers reutilizáveis.

Essa abordagem facilita manutenção e crescimento do projeto, evitando arquivos gigantes e regras espalhadas.

### 5.2 Frontend por views e components

O frontend foi organizado com foco em navegação e reaproveitamento:

```bash
frontend/src/
├── components/
├── router/
├── views/
└── main.js
```

#### Motivos dessa arquitetura

- **views** representam páginas do sistema;
- **components** representam blocos reutilizáveis, como navbar;
- **router** centraliza regras de navegação e proteção;
- **main.js** registra a aplicação e integra o roteador.

---

## 6. Justificativa das principais decisões técnicas

### 6.1 Por que Vue.js?

Vue foi escolhido por ser produtivo, simples de evoluir e ideal para interfaces reativas de porte pequeno e médio. Também oferece excelente separação entre template, lógica e estilo.

### 6.2 Por que Vite?

Vite foi utilizado por oferecer ambiente de desenvolvimento rápido, HMR eficiente e experiência moderna para projetos Vue.

### 6.3 Por que Vue Router?

O projeto possui navegação entre páginas e rotas protegidas. Vue Router resolve isso de forma limpa, permitindo meta fields e guards globais.

### 6.4 Por que Axios?

Axios foi adotado para comunicação com a API, facilitando GET, POST e PATCH, além de permitir configuração global de headers e token JWT.

### 6.5 Por que Node.js + Express?

Express fornece uma base enxuta, flexível e muito adequada para APIs REST, com rotas, middlewares e integração simples com autenticação e banco de dados.

### 6.6 Por que MongoDB + Mongoose?

MongoDB oferece flexibilidade para dados semi-estruturados, e Mongoose organiza esses dados com schemas e modelos, o que ajuda bastante na consistência do projeto.

### 6.7 Por que JWT?

JWT foi escolhido para autenticação por ser leve, amplamente utilizado e fácil de integrar ao frontend e backend.

---

## 7. Fluxo funcional da aplicação

### 7.1 Login

1. O usuário acessa `/login`.
2. Informa email e senha.
3. O frontend envia para `POST /api/auth/login`.
4. O backend valida credenciais e devolve um token JWT.
5. O token é salvo no `localStorage`.
6. O usuário é redirecionado para `/appointments`.

### 7.2 Criação de consulta

1. O usuário preenche o formulário.
2. O frontend envia `POST /api/appointments` com Bearer Token.
3. O backend valida conflito de horário.
4. O backend consulta clima por data.
5. O backend salva a consulta com clima e status.
6. O frontend recarrega a lista.

### 7.3 Cancelamento de consulta

1. O usuário clica em **Cancelar**.
2. O frontend envia `PATCH /api/appointments/:id/cancel`.
3. O backend altera o status para `CANCELLED`.
4. O frontend recarrega a lista.

---

## 8. Estrutura atual do projeto

## 8.1 Backend

```bash
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   ├── users/
│   │   │   └── user.model.js
│   │   ├── appointments/
│   │   │   ├── appointment.controller.js
│   │   │   ├── appointment.model.js
│   │   │   ├── appointment.routes.js
│   │   │   └── appointment.service.js
│   │   ├── address/
│   │   │   ├── address.controller.js
│   │   │   ├── address.routes.js
│   │   │   └── address.service.js
│   │   └── weather/
│   │       ├── weather.routes.js
│   │       ├── weather.controller.js
│   │       └── weather.service.js
│   ├── routes/
│   │   └── index.js
│   └── utils/
│       ├── api-error.js
│       ├── async-handler.js
│       ├── jwt.js
│       └── sanitize-user.js
├── .env
├── .env.example
└── package.json
```

## 8.2 Frontend

```bash
frontend/
├── src/
│   ├── components/
│   │   └── NavbarView.vue
│   ├── router/
│   │   └── index.js
│   ├── views/
│   │   ├── LoginView.vue
│   │   └── AppointmentView.vue
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js
```

---

## 9. Pré-requisitos

Antes de rodar o projeto, você precisa ter instalado:

- Node.js
- npm
- MongoDB local ou MongoDB Compass
- VS Code (recomendado)

---

## 10. Como rodar o projeto localmente

# 10.1 Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` baseado no `.env.example`.

Exemplo:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/clinica-inteligente
JWT_SECRET=uma_chave_bem_segura
JWT_EXPIRES_IN=1d
OPENWEATHER_API_KEY=sua_chave_aqui
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
FRONTEND_URL=http://localhost:5173
```

Rode o servidor:

```bash
npm run dev
```

Se estiver tudo certo, você verá algo parecido com:

```bash
✅ MongoDB conectado
🚀 Servidor rodando na porta 3000
```

Teste básico no navegador:

```bash
http://localhost:3000/api/health
```

---

# 10.2 Frontend

Em outro terminal:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Rode o frontend:

```bash
npm run dev
```

Abra no navegador:

```bash
http://localhost:5173
```

---

## 11. Rotas principais da API

### Auth

```bash
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Address

```bash
GET /api/address/cep/:cep
```

### Weather

```bash
GET /api/weather?city=São Paulo
```

### Appointments

```bash
POST  /api/appointments
GET   /api/appointments/my
PATCH /api/appointments/:id/cancel
```

---

## 12. Como testar o sistema

### Passo 1 — Registrar usuário

Via frontend ou Thunder Client:

```bash
POST /api/auth/register
```

### Passo 2 — Fazer login

```bash
POST /api/auth/login
```

O token retornado será salvo no frontend.

### Passo 3 — Criar consulta

No frontend, acesse `/appointments` e preencha o formulário.

### Passo 4 — Ver consultas

As consultas serão carregadas automaticamente.

### Passo 5 — Cancelar consulta

Clique no botão **Cancelar** da consulta desejada.

---

## 13. Segurança implementada

- autenticação por JWT;
- rotas protegidas no backend;
- rotas protegidas no frontend;
- middleware de validação de autenticação;
- Helmet para hardening básico de headers HTTP;
- CORS configurado;
- rate limiting no backend.

---

## 14. Diferenciais do projeto

- separação clara de responsabilidades;
- backend modular;
- frontend com navegação protegida;
- integração com APIs externas;
- suporte a clima e alertas inteligentes;
- persistência de previsões por consulta;
- experiência visual moderna.

---

## 15. Melhorias futuras recomendadas

### Backend

- painel administrativo com listagem global de consultas;
- edição de consultas;
- confirmação de presença;
- perfis de usuário diferenciados (`PATIENT`, `SECRETARY`, `ADMIN`);
- validações mais robustas com DTOs.

### Frontend

- tela de registro de usuário;
- dashboard administrativo;
- filtros por status;
- máscaras de entrada (CPF, telefone, data);
- feedback visual com toasts;
- loading states;
- design system com componentes reutilizáveis.

### DevOps / Produção

- deploy do frontend no Vercel;
- deploy do backend no Render/Railway;
- MongoDB Atlas para produção;
- CI/CD;
- logs estruturados;
- monitoramento e observabilidade.

---

## 16. Conclusão

A **Clínica Inteligente** foi construída com foco em clareza arquitetural, segurança e experiência de uso. O projeto já entrega valor real como MVP funcional e também está preparado para evoluir para um produto mais robusto.

Mais do que um exercício técnico, esta aplicação representa uma base concreta para um sistema comercial de agendamento médico com inteligência contextual.

---

## 17. Autor

Projeto desenvolvido como solução full stack com foco em boas práticas de arquitetura, clean code, segurança e escalabilidade.
