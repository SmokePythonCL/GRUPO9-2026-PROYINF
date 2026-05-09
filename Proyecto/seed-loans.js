const pool = require('./db');

async function seedLoans() {
  console.log("Iniciando sembrado de préstamos falsos...");
  try {
    const usersRes = await pool.query(`SELECT rut FROM users LIMIT 5`);
    if (usersRes.rows.length === 0) {
      console.log("No hay usuarios en la base de datos para asignarles préstamos.");
      process.exit(0);
    }

    let seededCount = 0;
    for (const u of usersRes.rows) {
      await pool.query(`
        INSERT INTO loans (user_rut, loan_id_str, amount, term, rate, monthly, total, status, comments, application_date, approval_date, start_date, due_date)
        VALUES 
        ($1, 'L-' || SUBSTRING(MD5(RANDOM()::text), 1, 6), 1000000, 12, 0.012, 90000, 1080000, 'activo', NULL, NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 month 28 days', NOW() - INTERVAL '1 month 25 days', NOW() + INTERVAL '10 months'),
        ($1, 'L-' || SUBSTRING(MD5(RANDOM()::text), 1, 6), 500000, 6, 0.012, 85000, 510000, 'pagado', NULL, NOW() - INTERVAL '8 months', NOW() - INTERVAL '8 months', NOW() - INTERVAL '8 months', NOW() - INTERVAL '2 months'),
        ($1, 'L-' || SUBSTRING(MD5(RANDOM()::text), 1, 6), 2000000, 24, 0.012, 95000, 2280000, 'rechazado', 'Su historial crediticio muestra un nivel de riesgo alto para el monto solicitado.', NOW() - INTERVAL '5 months', NULL, NULL, NULL),
        ($1, 'L-' || SUBSTRING(MD5(RANDOM()::text), 1, 6), 150000, 3, 0.012, 51000, 153000, 'cancelado', NULL, NOW() - INTERVAL '10 months', NULL, NULL, NULL)
      `, [u.rut]);
      seededCount += 4;
    }
    console.log(`¡Éxito! Se generaron ${seededCount} préstamos de prueba.`);
    process.exit(0);
  } catch (err) {
    console.error("Error al sembrar préstamos:", err);
    process.exit(1);
  }
}

seedLoans();
