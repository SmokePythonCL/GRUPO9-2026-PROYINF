# README de Pruebas

## Prueba A: envío real de solicitud de préstamo con autorización

| Input | Output esperado | Contexto de ejecución |
|---|---|---|
| `GET /api/health` | `200 OK` | Backend Express levantado en `http://localhost:4000` usando Docker Compose. |
| `POST /api/auth/register` con usuario de prueba válido | `201 Created` | Se crea un usuario temporal para ejecutar la prueba. |
| `POST /api/auth/login` con email y password válidos | `200 OK` y token JWT | Se obtiene un token para acceder a rutas protegidas. |
| `POST /api/loans` con `amount=500000`, `term=12`, sin `dryRun` y con header `Authorization: Bearer <token>` | `201 Created` e `id` con formato `L-...` | Valida el envío real de una solicitud de préstamo autenticada. |
| `GET /api/loans/:id` con token válido | `200 OK` y `loan_id_str` igual al ID creado | Valida que el préstamo real fue persistido y puede consultarse. |
| `POST /api/loans` con `amount=500000`, `term=12`, sin `dryRun` y sin token | `401 Unauthorized` | Valida que el backend bloquea solicitudes reales sin autorización. |

## Estrategia de prueba

Se usó partición por clases de equivalencia para comparar dos casos principales: una solicitud real autenticada con token válido y una solicitud real no autenticada sin token. Como valor frontera de autorización se considera el paso de no enviar credenciales a enviar un token válido, verificando que sin token el sistema responda `401 Unauthorized` y con token permita crear el préstamo con `201 Created`.

## Endpoints seleccionados

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/loans`
- `GET /api/loans/:id`

## Comando de ejecución

```bash
python -m unittest discover -v

