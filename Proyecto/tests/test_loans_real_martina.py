import unittest
import requests
import time


API_URL = "http://localhost:4000"


class TestLoansRealMartina(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.run_id = int(time.time() * 1000)

        cls.user = {
            "nombre": "Usuario",
            "apellido_paterno": "Prueba",
            "apellido_materno": "Martina",
            "nacimiento": "1999-01-01",
            "rut": f"TEST-{cls.run_id}",
            "email": f"test.loans.{cls.run_id}@example.com",
            "password": "Password123!",
            "telefono": "+56912345678",
            "direccion": "Av. Prueba 123"
        }

        cls.loan_request = {
            "amount": 500000,
            "term": 12
        }

        health_response = requests.get(
            f"{API_URL}/api/health",
            timeout=10
        )

        assert health_response.status_code == 200, (
            f"El backend no está activo. "
            f"Status: {health_response.status_code}, Body: {health_response.text}"
        )

        register_response = requests.post(
            f"{API_URL}/api/auth/register",
            json=cls.user,
            timeout=10
        )

        assert register_response.status_code == 201, (
            f"Falló el registro del usuario. "
            f"Status: {register_response.status_code}, Body: {register_response.text}"
        )

        login_response = requests.post(
            f"{API_URL}/api/auth/login",
            json={
                "email": cls.user["email"],
                "password": cls.user["password"]
            },
            timeout=10
        )

        assert login_response.status_code == 200, (
            f"Falló el login. "
            f"Status: {login_response.status_code}, Body: {login_response.text}"
        )

        login_body = login_response.json()
        cls.token = login_body.get("token")

        assert cls.token is not None, "El login no devolvió token"

    def test_post_loans_with_token_returns_201_and_public_id(self):
        response = requests.post(
            f"{API_URL}/api/loans",
            json=self.loan_request,
            headers={
                "Authorization": f"Bearer {self.token}"
            },
            timeout=10
        )

        self.assertEqual(
            response.status_code,
            201,
            f"Se esperaba 201 Created, pero se obtuvo {response.status_code}. Body: {response.text}"
        )

        body = response.json()
        loan_id = body.get("id")

        self.assertIsNotNone(
            loan_id,
            f"La respuesta no incluye id. Body: {body}"
        )

        self.assertRegex(
            loan_id,
            r"^L-[A-Z0-9]+$",
            f"El id no cumple formato L-... Recibido: {loan_id}"
        )

        get_response = requests.get(
            f"{API_URL}/api/loans/{loan_id}",
            headers={
                "Authorization": f"Bearer {self.token}"
            },
            timeout=10
        )

        self.assertEqual(
            get_response.status_code,
            200,
            f"Se esperaba 200 al consultar el préstamo creado. "
            f"Status: {get_response.status_code}, Body: {get_response.text}"
        )

        get_body = get_response.json()

        self.assertEqual(
            get_body.get("loan_id_str"),
            loan_id,
            f"El loan_id_str consultado no coincide. Esperado: {loan_id}, Body: {get_body}"
        )

    def test_post_loans_without_token_returns_401(self):
        response = requests.post(
            f"{API_URL}/api/loans",
            json=self.loan_request,
            timeout=10
        )

        self.assertEqual(
            response.status_code,
            401,
            f"Sin token se esperaba 401 Unauthorized, pero se obtuvo {response.status_code}. Body: {response.text}"
        )


if __name__ == "__main__":
    unittest.main()