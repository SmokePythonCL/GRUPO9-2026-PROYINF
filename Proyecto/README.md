# PrestamoCL – Monorepo (Frontend + Backend)

Este proyecto contiene:
- Frontend en Next.js (carpeta `frontend/`), con migración de las páginas HTML a rutas de App Router.
- Backend en Express (`index.js`) con conexión a PostgreSQL.

## Requisitos

- Docker y Docker Compose (recomendado), o bien Node.js 18+ y PostgreSQL si vas a correr localmente sin contenedores.
- `curl` o cualquier cliente HTTP para probar endpoints.

## Quickstart con Docker

Desde la carpeta `Proyecto/`:

```bash
docker compose up --build
```

Servicios expuestos:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Base de datos: PostgreSQL en puerto 5432

Para detener:

```bash
docker compose down -v
```

## Ejecución local (sin Docker)

Asegúrate de tener una base de datos PostgreSQL corriendo y de configurar las variables de entorno (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

Terminal A (Backend):

```bash
npm install
npm start
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

## Estructura relevante

- `frontend/` – Aplicación Next.js
  - `src/app/` – Rutas de la App Router (inicio, como_funciona, beneficios, etc.)
  - `src/lib/api.js` – Cliente Axios hacia la API
- `index.js` – Servidor Express principal
- `db.js` – Conexión a PostgreSQL
- `docker-compose.yml` – Orquestación de frontend, backend y base de datos

## Notas

- Algunas imágenes externas usan `next/image` con `unoptimized` por simplicidad.
- Feather y Vanta se cargan desde CDN; requieren internet para renderizar correctamente.
