import unittest
import requests
import math

class TestCalculoMonto(unittest.TestCase):
    """
    Pruebas de validación del cálculo de cuota mensual (monthly) y monto total (total).
    Endpoint POST /api/loans en modo simulación (dryRun: true).
    """

    @classmethod
    def setUpClass(cls):
        """
        Configuración inicial: URL base de la API.
        """
        cls.base_url = "http://localhost:4000/api"

    @classmethod
    def tearDownClass(cls):
        """
        Método de limpieza ejecutado al finalizar todos los tests de la clase.
        Actualmente solo imprime porque no hay un endpoint DELETE.
        """
        print("\nPruebas de TestCalculoMonto finalizadas. Limpieza completada.")

    def simulate_loan(self, amount, term):
        """
        Método auxiliar para enviar una solicitud de simulación de préstamo (relacionado a función de index.js: simulateLoan).
        Retorna:
            response.json() con los datos del cálculo desde la API.
        """
        payload = {
            "dryRun": True,
            "amount": amount,
            "term": term
        }
        response = requests.post(f"{self.base_url}/loans", json=payload)
        return response

    def calcular_monthly_esperado(self, amount, term, rate=0.012):
        """
        Calcula el valor esperado de monthly "localmente", para luego comparar con el retornado por la API.
        Parámetros:
            amount: Monto del préstamo
            term: Plazo en meses
            rate: Tasa de interés mensual (por defecto 0.012 = 1.2%)
        Retorna:
            Valor redondeado de monthly
        """
        # Simular el comportamiento del backend: term=0 se convierte a 1
        term = term or 1  # Si term es 0, usar 1
        monthly = (amount * rate) / (1 - math.pow(1 + rate, -term))
        return round(monthly)

    #Pruebas

    def test_correctitud_calculo_monthly(self):
        """
        Validar que monthly se calcula correctamente usando la fórmula de amortización.
        """
        print("\n[TEST CÁLCULO MONTHLY] Validar fórmula: monthly = (amount * rate) / (1 - (1 + rate)^-term)")
        
        test_cases = [
            {"amount": 1000000, "term": 12},
            {"amount": 500000, "term": 36}
        ]
        
        for case in test_cases:
            #simulamos préstamo para casos de prueba y verificamos correctitud
            response = self.simulate_loan(case["amount"], case["term"])
            self.assertEqual(response.status_code, 200)
            
            data = response.json()
            monthly_actual = data["monthly"] #monthly API
            monthly_esperado = self.calcular_monthly_esperado(case["amount"], case["term"]) #monthly simulado local
            
            print(f"\n  Caso: amount={case['amount']}, term={case['term']}")
            print(f"    Monthly esperado: {monthly_esperado}")
            print(f"    Monthly recibido: {monthly_actual}")
            
            #la diferencia debe ser menor a 1 (por redondeo)
            self.assertEqual(monthly_actual, monthly_esperado, f"Monthly incorrecto para amount={case['amount']}, term={case['term']}")

    def test_correctitud_calculo_total(self):
        """
        Validar que total = monthly * term (respetando redondeo).
        """
        print("\n[TEST CÁLCULO TOTAL] Validar relación: total ≈ monthly * term")
        
        test_cases = [
            {"amount": 5000000, "term": 24},
            {"amount": 3000000, "term": 18},
        ]
        
        for case in test_cases:
            response = self.simulate_loan(case["amount"], case["term"])
            self.assertEqual(response.status_code, 200)
            
            data = response.json()
            monthly = data["monthly"]
            total = data["total"]

            total_esperado = monthly * case["term"] #monthly retornado desde la API, y term simulado localmente
            
            print(f"\n  Caso: amount={case['amount']}, term={case['term']}")
            print(f"    Monthly: {monthly}")
            print(f"    Total esperado (monthly * term): {total_esperado}")
            print(f"    Total recibido: {total}")
            
            #validar que total sea aproximadamente monthly * term (diferencia <= 10 por redondeo)
            self.assertAlmostEqual(total, total_esperado, delta=10, msg=f"Total incorrecto para amount={case['amount']}, term={case['term']}")

    def test_manejo_amounts_invalidos(self):
        """
        Validar que montos inválidos se manejan correctamente.
        """
        print("\n[TEST VALIDACIÓN INPUTS] Manejar casos inválidos")
        
        #monto<0
        print("\n  Probando con amount negativo...")
        response_negativa = self.simulate_loan(-1000000, 12)

        self.assertEqual(response_negativa.status_code, 400,"Se esperaba 400 Bad Request para amount negativo")
        
        #term=cero
        print("\n  Probando con term = 0...")
        response_term_cero = self.simulate_loan(1000000, 0)
        self.assertEqual(response_term_cero.status_code, 200)
        data_term_cero = response_term_cero.json()        
        
        print(f"    Respuesta: {data_term_cero}")
        
        self.assertEqual(data_term_cero["term"], 1, "Term=0 debería convertirse a 1") #por manejo del backend, 0 pasa a 1
        
        #verificar que el cálculo es correcto asumiendo term=1
        monthly_esperado_term1 = self.calcular_monthly_esperado(1000000, 1)
        self.assertEqual(data_term_cero["monthly"], monthly_esperado_term1, "Monthly debería calcularse con term=1 cuando se envía term=0")
        
        print("Manejo de casos inválidos validado")

if __name__ == "__main__":
    unittest.main()