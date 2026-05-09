const baseUrl = 'http://localhost:4000';

async function runTests() {
  console.log("=== Iniciando pruebas de API para Préstamos ===");
  
  // 1. Probar que POST /api/loans sin token responde 401
  console.log("\n1. Probando POST /api/loans sin token...");
  const noTokenRes = await fetch(`${baseUrl}/api/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 1000000, term: 12 })
  });
  
  if (noTokenRes.status === 401) {
    console.log("✅ Éxito: El servidor respondió con 401 No autorizado al no enviar token.");
  } else {
    console.error(`❌ Fallo: Se esperaba 401 pero se recibió ${noTokenRes.status}`);
  }

  // 2. Preparar el contexto (Iniciar sesión)
  console.log("\n2. Preparando usuario e iniciando sesión...");
  
  // Como no sabemos la contraseña de los usuarios existentes (está hasheada),
  // registramos un usuario temporal para hacer la prueba de forma segura y reproducible.
  const randStr = Math.random().toString(36).substring(7);
  const testEmail = `test_${randStr}@example.com`;
  const testPassword = 'password123';
  const testRut = `${Math.floor(Math.random() * 20000000 + 5000000)}-K`; // RUT falso
  
  await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: 'Test',
      apellido_paterno: 'User',
      apellido_materno: 'Test',
      nacimiento: '1990-01-01',
      rut: testRut,
      email: testEmail,
      password: testPassword,
      telefono: '123456789',
      direccion: 'Calle Falsa 123'
    })
  });

  // Hacemos el inicio de sesión real (POST /api/auth/login)
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword })
  });

  if (loginRes.status !== 200) {
    console.error("❌ Fallo: No se pudo iniciar sesión. Verifica que el backend esté corriendo.");
    return;
  }
  
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log("✅ Éxito: Inicio de sesión correcto. Token JWT obtenido.");

  // 3. Enviar POST /api/loans (sin dryRun) y comprobar 201 y formato del id
  console.log("\n3. Probando POST /api/loans con token válido...");
  const loanRes = await fetch(`${baseUrl}/api/loans`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    // Al omitir dryRun (o enviar dryRun: false), se hace la solicitud real y requiere autorización
    body: JSON.stringify({ amount: 1500000, term: 24 })
  });

  if (loanRes.status === 201) {
    const loanData = await loanRes.json();
    console.log("✅ Éxito: El servidor respondió con 201 Creado.");
    
    if (loanData.id && loanData.id.startsWith('L-')) {
      console.log(`✅ Éxito: El ID devuelto tiene el formato correcto (${loanData.id}).`);
      console.log("Resumen de la respuesta:", loanData);
    } else {
      console.error(`❌ Fallo: El ID devuelto no tiene el formato esperado (L-...). Recibido: ${loanData.id}`);
    }
  } else {
    const errText = await loanRes.text();
    console.error(`❌ Fallo: Se esperaba 201 pero se recibió ${loanRes.status}. Detalles: ${errText}`);
  }
  
  console.log("\n=== Pruebas finalizadas ===");
}

runTests().catch(console.error);
