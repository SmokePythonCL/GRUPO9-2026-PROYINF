import unittest
import requests

""" 
Se hacen dos test con dos cuentas diferentes, una con prestamos(perfil_1)
y una sin prestamos(perfil_2). Test 1 es simplemente obtener el codigo de
estatus al hacer un get en la api api/loans, par ambas paginas se retorna
el valor esperado. Test 2 trata de obtener los campos esperados de un
prestamo, para el perfil_1 debe retornar todos los campos del prestamo y
para perfil_2 la data deberia ser un arreglo vacio [] dado que no existen
prestamos, para ambos se retornan los campos esperados.
"""

class TestHistorialUsuariosAPI(unittest.TestCase):
        
    @classmethod
    def setUpClass(cls):

        cls.baseURL = "http://localhost:4000"

        perfil_1 = {
            "nombre": "prueba1",
            "apellido_paterno": "test",
            "apellido_materno": "test",
            "nacimiento": "2000-01-01",
            "rut": "98765432-1",
            "email": "mail1@mail.com",
            "telefono": "912345678",
            "direccion": "Calle 123",
            "password": "123"
        }
        requests.post(
            cls.baseURL + "/api/auth/register",
            json=perfil_1
        )

        response_1 = requests.post(
            cls.baseURL + "/api/auth/login",
            json={
                "email": "mail1@mail.com",
                "password": "123"
            }
        )

        assert response_1.status_code == 200

        token_1 = response_1.json()["token"]

        cls.header_1 = {
            "Authorization": f"Bearer {token_1}"
        }

        requests.post(
            cls.baseURL + "/api/loans",
            json={
                "amount": 7000000,
                "term": 12
            },
            headers=cls.header_1
        )


        perfil_2 = {
            "nombre": "prueba2",
            "apellido_paterno": "test",
            "apellido_materno": "test",
            "nacimiento": "1999-05-10",
            "rut": "12345678-9",
            "email": "mail2@mail.com",
            "telefono": "987654321",
            "direccion": "Avenida Test",
            "password": "123"
        }

        requests.post(
            cls.baseURL + "/api/auth/register",
            json=perfil_2
        )

        response_2 = requests.post(
            cls.baseURL + "/api/auth/login",
            json={
                "email": "mail2@mail.com",
                "password": "123"
            }
        )
        assert response_2.status_code == 200
        token_2 = response_2.json()["token"]
        cls.header_2 = {
            "Authorization": f"Bearer {token_2}"
        }
        cls.endpoint = cls.baseURL + "/api/loans"
        print("Test preparado.")



    def test_status(self):
        resp1 = requests.get(self.endpoint, headers=self.header_1)
        resp2 = requests.get(self.endpoint, headers=self.header_2)
        self.assertEqual(resp1.status_code, 200)
        self.assertEqual(resp2.status_code, 200)

    def test_fields(self):
        camposEsperados = [
            "id",
            "user_rut",
            "loan_id_str",
            "amount",
            "term",
            "rate",
            "monthly",
            "total",
            "status",
            "application_date",
            "approval_date",
            "start_date",
            "due_date"
        ]

        resp1 = requests.get(self.endpoint, headers=self.header_1)
        data1 = resp1.json()
        prestamo1 = data1[0]

        for i in camposEsperados:
            self.assertIn(i, prestamo1)

        resp2 = requests.get(self.endpoint, headers=self.header_2)
        data2 = resp2.json()
        self.assertEqual(data2,[])

    @classmethod
    def tearDownClass(cls):

        requests.delete(
            cls.baseURL + "/api/loans",
            headers=cls.header_1
        )

        requests.delete(
            cls.baseURL + "/api/user",
            headers=cls.header_1
        )

        requests.delete(
            cls.baseURL + "/api/user",
            headers=cls.header_2
        )

        print("Datos eliminados.")



if __name__ == "__main__":
    unittest.main()

