# PrestamoCL – Monorepo (Frontend + Mock API)

Este proyecto contiene:
- Frontend en Next.js (carpeta `frontend/`), con migración de las páginas HTML a rutas de App Router.
- Un backend de prueba (mock API) en Express (`mock-api.js`) para simular flujos sin datos reales.

## Requisitos

- Docker y Docker Compose (recomendado), o bien Node.js 18+ si vas a correr localmente sin contenedores.
- `curl` o cualquier cliente HTTP para probar endpoints.

## Quickstart con Docker

Desde la carpeta `Proyecto/`:

```bash
docker compose up --build
```

Servicios expuestos:
- Frontend: http://localhost:3000
- API mock: http://localhost:4000

Para detener:

```bash
docker compose down -v
```

## Ejecución local (sin Docker)

Terminal A (API mock):

```bash
npm install
npm run mock
```

Terminal B (Frontend):

```bash
cd frontend
npm install
export NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev
```

Frontend en http://localhost:3000

Más detalles en `frontend/README.md`.

## API Mock – Endpoints

Base URL: `http://localhost:4000`

- Health
  - GET `/api/health`

- Auth (mock)
  - POST `/api/auth/login`
    - Body: `{ "email": "demo@flashloan.cl", "password": "cualquiera" }`
    - Respuesta: `{ token, user }`

- Simular préstamo
  - POST `/api/loans/simulate`
    - Body: `{ "amount": 1000000, "term": 24 }`
    - Respuesta: `{ amount, term, rate, monthly, total }`

- Enviar solicitud de préstamo
  - POST `/api/loans/submit`
    - Body: `{ amount, term, applicant: { ... }, documents: { ... } }`
    - Respuesta: `{ id, status, eta, summary }`

- Estado de solicitud
  - GET `/api/loans/:id/status`
    - Respuesta: `{ id, status, eta, monthly, total }`

- Usuario demo
  - GET `/api/user`
    - Respuesta: `{ id, name, email }`

### Ejemplos rápidos (curl)

```bash
# Health
curl http://localhost:4000/api/health

# Simular
curl -X POST http://localhost:4000/api/loans/simulate \
  -H 'Content-Type: application/json' \
  -d '{"amount": 1000000, "term": 24}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@flashloan.cl","password":"x"}'
```

## Estructura relevante

- `frontend/` – Aplicación Next.js
  - `src/app/` – Rutas de la App Router (inicio, como_funciona, beneficios, etc.)
  - `src/lib/api.js` – Cliente Axios hacia la API mock
- `mock-api.js` – Servidor Express con endpoints de prueba
- `docker-compose.yml` – Orquestación de frontend y backend mock

## Notas

- La API mock guarda datos en memoria (se reinician al reiniciar el proceso).
- Algunas imágenes externas usan `next/image` con `unoptimized` por simplicidad.
- Feather y Vanta se cargan desde CDN; requieren internet para renderizar correctamente.
