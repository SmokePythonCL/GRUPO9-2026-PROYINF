# Frontend (Next.js) – FlashLoan

Aplicación Next.js (App Router) que migra las páginas estáticas del proyecto a React/Next y se integra opcionalmente con una API mock para simular el flujo de préstamos.

## Rutas disponibles

- `/` (Inicio): simulador de préstamo, fondo con Vanta y navegación.
- `/como_funciona`
- `/beneficios`
- `/login`
- `/mi_cuenta`
- `/prestamo_aceptado`
- `/solicitar`: formulario multi‑paso con recogida de datos y archivos (mock).

## Requisitos

- Node.js 18+ y npm
- (Opcional) API mock corriendo en `http://localhost:4000` para funcionalidades de servidor.

## Variables de entorno

- `NEXT_PUBLIC_API_URL`: URL base del backend. Ejemplo: `http://localhost:4000`

Si no se define, el frontend funciona con lógica local (fall‑back) para el simulador en la home. Las páginas que llaman al backend usarán mocks mínimos o mostrarán errores si la API no está disponible.

## Ejecutar en desarrollo

1. Instalar dependencias
   
	```bash
	npm install
	```

2. (Opcional) Exportar la URL del backend si usarás la API mock
   
	```bash
	export NEXT_PUBLIC_API_URL=http://localhost:4000
	```

3. Levantar el servidor de desarrollo
   
	```bash
	npm run dev
	```

La app quedará disponible en http://localhost:3000

## Build y producción

```bash
npm run build
npm start
```

## Integración con API mock

El cliente HTTP está en `src/lib/api.js` (Axios). Si `NEXT_PUBLIC_API_URL` está configurada, se usarán los endpoints:

- `POST /api/loans/simulate`
- `POST /api/loans/submit`
- `POST /api/auth/login`
- `GET /api/user`
- `GET /api/loans/:id/status`

Para ejecutar la API mock localmente, ve al README del proyecto raíz o corre en la raíz:

```bash
npm run mock
```

## Dependencias externas (CDN)

- Feather Icons y Vanta Waves se cargan dinámicamente en cliente vía CDN. Se requiere conexión a internet para verlos; si fallan, la app se degrada sin romper.

## Docker (opcional)

Con Docker Compose desde la carpeta `Proyecto/` puedes levantar frontend y backend juntos.

```bash
docker compose up --build
```

Esto expondrá:
- Frontend: http://localhost:3000
- API mock: http://localhost:4000

## Problemas comunes

- Puerto 4000 ocupado: cambia `PORT` al lanzar la API mock o libera el puerto.
- Imágenes externas: algunas usan `next/image` con `unoptimized`. Si quieres optimización, configura dominios en `next.config.mjs`.
- Lint CSS: puede aparecer una advertencia por `@theme inline` en `globals.css` heredada; no afecta ejecución.
