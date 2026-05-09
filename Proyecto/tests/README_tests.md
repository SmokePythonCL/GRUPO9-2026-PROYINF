## Ejecución

### Ejecución general de todos los tests

`python3 -m unittest discover -v`

## Pruebas

### Vicente: Detalle de Préstamo (HU007)

Prueba: `GET /api/loans/:id`


|Input | Output esperado |Contexto de ejecución|
|-----|---------|-------|
|id válido + Token propio| 200 OK + JSON completo | Consulta exitosa de un préstamo existente perteneciente al usuario.|
|id inexistente|404 Not Found|Búsqueda de un préstamo que no figura en la base de datos|
|id válido + Token ajeno|404/403 Error|Intento de acceso a datos de otro usuario (Validación de privacidad).|
|Sin Token de acceso|401 Unauthorized|Intento de consulta sin autenticación previa.|

<br>

**Estrategia y Justificación:**

La estrategia se basa en clases de equivalencia para validar tanto el flujo de éxito (ID propio) como el manejo de errores (ID inexistente). Se aplica un enfoque de seguridad en valores frontera al testear el acceso con tokens de terceros o nulos, asegurando que el backend filtre correctamente por user_rut y no solo por loan_id_str. Esto garantiza que la información sensible del préstamo solo sea accesible por su propietario legítimo, cumpliendo con los estándares de integridad de la HU007.

**Ejecución específica de la prueba de Detalle**
  
`python3 -m unittest tests/test_loan_detail.py -v`

para guardar log de la ejecucion del test en txt
`python3 -m unittest tests/test_loan_detail.py -v > tests/logs/test_output_vicente.txt`

**Evidencia de Ejecución**

![Resultado Tests HU007](./screenshots/test_loan_detail_result.png)

**Análisis de Resultados:**

Al ejecutar las pruebas, se obtienen 4 éxitos. El objetivo de esta prueba fue (1) asegurarnos que bajo condiciones ideales la consulta de datos de prestamos sea correcta y (2) provocar errores intencionalmente para verificar que las protecciones del sistema actúan correctamente frente a casos erróneos o maliciosos:

1. **Prueba de condición ideal**: 
   - `test_get_loan_detail_success`: Validamos que bajo condiciones ideales (ID propio válido con token), el sistema nos devuelve el código 200 OK y todos los datos del préstamo correspondiente.
2. **Pruebas Negativas y Validaciones**:
   - `test_get_loan_not_found`: Validamos que si consultamos una ID que no existe, el servidor no colapsa internamente, sino que responde de manera controlada con 404 Not Found.
   - `test_get_loan_unauthorized`: Validamos la eficacia del middleware de autenticación. Al omitir el token, la API intercepta la petición y bloquea el acceso en la puerta devolviendo 401 Unauthorized.
   - `test_get_loan_forbidden`: Validamos la privacidad de los datos al nivel de base de datos. Al intentar acceder a un préstamo aportando su ID exacto pero usando un Token ajeno, el servidor nos bloquea de manera segura (con 404 Not Found o 403 Forbidden), impidiendo que robemos información sensible.

**Sobre la Limpieza (tearDownClass):**
En la clase de prueba se implementó el método `tearDownClass()`, cuya responsabilidad teórica es conectarse a la Base de Datos para eliminar todos los datos falsos generados durante la etapa previa (`setUpClass`). Sin embargo, su implementación actual se limita a un print(), debido a que para el estado actual de nuestro MVP, el backend no expone explícitamente un endpoint o lógica para eliminar préstamos (como un `DELETE /api/loans/:id`). Por ello, se simula formalmente la fase para cumplir con el estándar de unittest sin modificar artificialmente o ensuciar las rutas de producción.