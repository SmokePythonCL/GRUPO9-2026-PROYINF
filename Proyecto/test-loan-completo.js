// test-loan-completo.js
// Prueba completa desde cero:
// 1. Verifica backend
// 2. Registra usuario
// 3. Inicia sesión
// 4. Crea préstamo real con token
// 5. Verifica 201 e ID tipo L-...
// 6. Intenta crear préstamo sin token
// 7. Verifica 401
// 8. Consulta el préstamo creado por ID

const API_URL = process.env.API_URL || 'http://localhost:4000';

const runId = Date.now();

const TEST_USER = {
    nombre: 'Usuario',
    apellido_paterno: 'Prueba',
    apellido_materno: 'Completa',
    nacimiento: '1999-01-01',
    rut: `FULL-${runId}`,
    email: `test.full.${runId}@example.com`,
    password: 'Password123!',
    telefono: '+56912345678',
    direccion: 'Av. Prueba Completa 123'
};

const LOAN_REQUEST = {
    amount: 500000,
    term: 12
    // Importante: NO se envía dryRun.
    // Así se fuerza la creación real del préstamo.
};

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });

    const text = await response.text();

    let body = null;

    try {
        body = text ? JSON.parse(text) : null;
    } catch {
        body = text;
    }

    return { response, body };
}

async function main() {
    console.log('======================================');
    console.log('PRUEBA COMPLETA FLUJO DE PRÉSTAMOS');
    console.log('======================================');
    console.log(`API_URL: ${API_URL}\n`);

    // 1. Health check
    const health = await request('/api/health');

    assert(
        health.response.ok,
        `Backend no responde. Status: ${health.response.status}. Body: ${JSON.stringify(health.body)}`
    );

    console.log('✅ 1. Backend activo');

    // 2. Registrar usuario
    const register = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(TEST_USER)
    });

    assert(
        register.response.status === 201,
        `Registro falló. Esperado 201, recibido ${register.response.status}. Body: ${JSON.stringify(register.body)}`
    );

    console.log('✅ 2. Usuario registrado correctamente');

    // 3. Login
    const login = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: TEST_USER.email,
            password: TEST_USER.password
        })
    });

    assert(
        login.response.ok,
        `Login falló. Status: ${login.response.status}. Body: ${JSON.stringify(login.body)}`
    );

    const token = login.body?.token;

    assert(
        token,
        `Login no devolvió token. Body: ${JSON.stringify(login.body)}`
    );

    console.log('✅ 3. Login correcto y token recibido');

    // 4. Crear préstamo real con token
    const createLoan = await request('/api/loans', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(LOAN_REQUEST)
    });

    assert(
        createLoan.response.status === 201,
        `Crear préstamo falló. Esperado 201, recibido ${createLoan.response.status}. Body: ${JSON.stringify(createLoan.body)}`
    );

    const loanId = createLoan.body?.id;

    assert(
        loanId,
        `La respuesta del préstamo no trae id. Body: ${JSON.stringify(createLoan.body)}`
    );

    assert(
        /^L-[A-Z0-9]+$/.test(loanId),
        `El id no tiene formato L-... Recibido: ${loanId}`
    );

    console.log(`✅ 4. POST /api/loans con token respondió 201`);
    console.log(`✅ 5. ID válido recibido: ${loanId}`);

    // 5. Crear préstamo sin token
    const noToken = await request('/api/loans', {
        method: 'POST',
        body: JSON.stringify(LOAN_REQUEST)
    });

    assert(
        noToken.response.status === 401,
        `POST /api/loans sin token debería responder 401, pero respondió ${noToken.response.status}. Body: ${JSON.stringify(noToken.body)}`
    );

    console.log('✅ 6. POST /api/loans sin token respondió 401');

    // 6. Consultar préstamo creado
    const getLoan = await request(`/api/loans/${loanId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    assert(
        getLoan.response.status === 200,
        `Consultar préstamo falló. Esperado 200, recibido ${getLoan.response.status}. Body: ${JSON.stringify(getLoan.body)}`
    );

    console.log('✅ 7. GET /api/loans/:id respondió 200');
    console.log('Respuesta de consulta:', getLoan.body);

    console.log('\n======================================');
    console.log('RESULTADO FINAL');
    console.log('Todas las validaciones principales pasaron correctamente.');
    console.log('======================================');
}

main().catch((error) => {
    console.error('\n❌ PRUEBA FALLIDA');
    console.error(error.message);
    process.exit(1);
});