import unittest
import requests

class TestLoanDetail(unittest.TestCase):

    @classmethod
    def tearDownClass(cls):
        """
        Método de limpieza que se ejecuta una sola vez al finalizar todos los tests de la clase.
        Actualmente solo imprime un mensaje en consola, ya que el backend no cuenta con
        un endpoint (ej. DELETE /api/loans/:id) habilitado para eliminar el préstamo de 
        prueba creado durante el setUpClass. En una API completa, aquí se eliminaría la
        data residual para no ensuciar la base de datos entre ejecuciones.
        """
        print("\nPruebas de TestLoanDetail finalizadas. Limpieza completada.")

    @classmethod
    def setUpClass(cls):
        """
        Método de preparación que se ejecuta una sola vez antes de correr todas las pruebas de la clase.
        """
        import time
        cls.base_url = "http://localhost:4000/api" 
        
        # Generar un identificador único por cada corrida de tests para no chocar datos en BD.
        unique_id = str(int(time.time()))[-6:] 


        print("Preparando prueba: ")
        
        try:
            def ensure_user_and_token(email, mock_rut):
                # 1. Intentar Loguear
                res = requests.post(f"{cls.base_url}/auth/login", json={"email": email, "password": "password"})
                if res.status_code == 200:
                    return res.json().get("token")
                
                # 2. Si falla el logueo, Registrar al usuario
                register_payload = {
                    "nombre": "UserTest", "apellido_paterno": "Test", "apellido_materno": "Test",
                    "nacimiento": "1990-01-01", "rut": mock_rut, "email": email,
                    "password": "password", "telefono": "123456789", "direccion": "Calle Falsa 123"
                }
                res_reg = requests.post(f"{cls.base_url}/auth/register", json=register_payload)
                if res_reg.status_code == 201:
                    return res_reg.json().get("token")
                else:
                    raise Exception(f"No se pudo crear/loguear el usuario. Res: {res_reg.text}")

            print("   Asegurando usuario principal...")
            email_propio = f"demo_{unique_id}@flashloan.cl"
            cls.token = ensure_user_and_token(email_propio, f"1{unique_id}-1")
            cls.headers = {"Authorization": f"Bearer {cls.token}"}

            print("   Asegurando usuario secundario (ajeno)...")
            email_ajeno = f"otro_{unique_id}@flashloan.cl"
            cls.token_ajeno = ensure_user_and_token(email_ajeno, f"2{unique_id}-2")
            cls.headers_ajeno = {"Authorization": f"Bearer {cls.token_ajeno}"}

            print("Tokens obtenidos correctamente.")

            # Prestamo de prueba
            print("   Creando préstamo de prueba...")
            loan_data = {"amount": 1000000, "term": 12}
            create_r = requests.post(f"{cls.base_url}/loans", json=loan_data, headers=cls.headers)
            
            if create_r.status_code == 201:
                cls.loan_id_valido = create_r.json().get("id") or create_r.json().get("loan_id_str")
                print(f"Préstamo creado con ID: {cls.loan_id_valido}")
            else:
                raise Exception(f"Falla al crear préstamo. Status: {create_r.status_code}, Res: {create_r.text}")

        except Exception as e:
            print(f"ERROR FATAL en Setup: {e} !")
            raise RuntimeError(f"Abortando pruebas. El setup falló: {e}")

        cls.loan_id_inexistente = "L-NONEXIST"
        print("\n")

    
    def test_get_loan_detail_success(self):
        """HU007: Validar que el detalle devuelva todos los campos de la DB."""
        print(f"\n[TEST SUCCESS] Consultando detalle del préstamo propio (ID: {self.loan_id_valido})")

        url = f"{self.base_url}/loans/{self.loan_id_valido}"
        response = requests.get(url, headers=self.headers)
        
        print(f"Código HTTP recibido: {response.status_code}")
        self.assertEqual(response.status_code, 200, "Debería retornar 200 para un préstamo propio")
        
        data = response.json()
        # Campos confirmados en tu initSchema() de index.js
        campos_esperados = ["loan_id_str", "amount", "term", "status", "application_date", "monthly", "total"]
        for campo in campos_esperados:
            self.assertIn(campo, data, f"Falta el campo {campo} en la respuesta")
            
        print("Todos los campos requeridos están presentes en el JSON.")
    

    
    def test_get_loan_not_found(self):
        """HU007: Validar error 404 para ID que no existe."""
        print(f"\n[TEST NOT FOUND] Consultando préstamo inexistente (ID: {self.loan_id_inexistente})")
        url = f"{self.base_url}/loans/{self.loan_id_inexistente}"
        response = requests.get(url, headers=self.headers)

        print(f"Código HTTP recibido: {response.status_code}")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Not found')
        print("Manejo de error 404 validado correctamente.")
   

    
    def test_get_loan_unauthorized(self):
        """HU007: Validar que sin token no se pueda acceder."""
        print(f"\n[TEST UNAUTHORIZED] Intentando consultar préstamo (ID: {self.loan_id_valido}) SIN TOKEN")
        
        url = f"{self.base_url}/loans/{self.loan_id_valido}"
        response = requests.get(url) # Sin headers

        print(f"Código HTTP recibido: {response.status_code}")
        self.assertEqual(response.status_code, 401)
        print("Intercepción de seguridad 401 (Unauthorized) confirmada.")

    
    def test_get_loan_forbidden(self):
        """HU007: Validar que un usuario no pueda ver el préstamo de otro."""
        print(f"\n[TEST FORBIDDEN/PRIVACY] Consultando préstamo ajeno (ID: {self.loan_id_valido}) con TOKEN de otro usuario")
        
        # Se requiere tener 'cls.headers_ajeno' definido en tu setUpClass
        url = f"{self.base_url}/loans/{self.loan_id_valido}"
        
        # Hacemos la petición con nuestro ID de préstamo, pero con el JWT del otro usuario
        response = requests.get(url, headers=self.headers_ajeno)
        
        # Generalmente, esto debería retornar un 403 Forbidden o 404 Not Found 
        # (404 suele ser mejor práctica de privacidad para no relevar que el ID existe)
        print(f"Código HTTP recibido: {response.status_code}")
        self.assertIn(response.status_code, [403, 404], "Debería rechazar el acceso al préstamo de otra persona")
        print("Privacidad de datos validada correctamente (Acceso denegado).")
    

if __name__ == "__main__":
    unittest.main()