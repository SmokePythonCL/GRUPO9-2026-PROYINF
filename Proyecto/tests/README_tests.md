## Ejecución

### Ejecución general de todos los tests

`python3 -m unittest discover -v`

## Pruebas

### Matías: Correctitud en cálculo de monto y total (HU001)

Prueba: `POST /api/loans/`

|Input | Output esperado |Contexto de ejecución|
|-----|---------|-------|
|amount: 1000000, term: 12| 89975 | Simulación exitosa de la cuota monthly en base a inputs dados.|
|amount: 500000, term: 36| 17186 | Simulación exitosa de la cuota monthly en base a inputs dados.|
|amount: 5000000, term: 24| 5784240 | Simulación exitosa del monto total en base a inputs dados.|
|amount: 3000000, term: 18| 3353544 | Simulación exitosa del monto total en base a inputs dados.|
|amount: -1000000, term: 12| Error | Simulación fallida de la cuota monthly dado que un amount negativo no debería ser admitido. |
|amount: 1000000, term: 0| 1012000 | Simulación exitosa del monto total con un term igual a cero, el cual en backend es pasado a term=1.|

<br>

**Estrategia y Justificación:**

La estrategia es validar que los valores calculados por los métodos de la aplicación, y consultados mediante la API, sean coherentes a los inputs con que se realizan las consultas. Para ello, se calcula localmente (en el archivo de los tests) el monto esperado y luego se consulta a la API con los mismos inputs, esperando que sean iguales. Se realiza prueba con casos frontera de valores negativos y cero para analizar el manejo que la API realiza con estos valores. Siempre usando clases de equivalencia.

**Ejecución específica de la prueba de Detalle**
  
`python3 -m unittest tests/test_calculo_monto.py -v`

Para guardar log de la ejecucion del test en txt, desde carpeta tests/:
`python3 -m unittest test_calculo_monto.py -v > logs/test_output_matias.txt`

**Evidencia de Ejecución**

![Resultado Tests HU001](./screenshots/tests-matias.png)

**Análisis de Resultados:**

Para las pruebas "test_correctitud_calculo_monthly" y "test_correctitud_calculo_total", los resultados fueron coherentes con lo esperado, lo cual indica que las cuotas y total de la simulación de préstamo son calculados correctamente y que la API también los entrega correctamente.
Para "test_manejo_amounts_invalidos", hubo una prueba fallida a la hora de intentar un amount negativo, pues se esperaba que la aplicación arrojara un error dado que no es posible calcular cuotas a partir de montos negativos, pero en su lugar los calculó de igual manera, lo cual es un comportamiento que se debe corregir. Para el caso en que term=0, la prueba fue exitosa pues se maneja correctamente y se retorna un valor coherente para cuando queremos pedir un préstamo con plazo=0.

1. **Prueba con valores normales**: 
   - `test_correctitud_calculo_monthly`: Validamos si la cuota monthly es calculada y retornada correctamente por la API.
   - `test_correctitud_calculo_total`: Validamos si el total es calculado y retornado correctamente por la API.
2. **Pruebas con valores negativo y cero**:
   - `test_manejo_amounts_invalidos`: Validamos si el cálculo de monthly y total es correcto y coherente si es que tenemos un input negativo y cero, respectivamente.
