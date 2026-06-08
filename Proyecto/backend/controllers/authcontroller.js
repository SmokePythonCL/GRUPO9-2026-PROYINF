
// -------------------------------------------------------------
// Login
// -------------------------------------------------------------
exports.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const q = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    const user = q.rows[0];
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ rut: user.rut }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: mapUserResponse(user),
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// -------------------------------------------------------------
// Registro
// -------------------------------------------------------------
exports.post('/api/auth/register', async (req, res) => {
  try {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      nacimiento,
      rut,
      email,
      password,
      telefono,
      direccion
    } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido_paterno || !apellido_materno || !nacimiento || !rut || !email || !password || !telefono || !direccion) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Sanitizar: no loggear contraseña
    console.log('Registro intento:', { nombre, apellido_paterno, apellido_materno, nacimiento, rut, email, telefono, direccion });

    // Chequear duplicados por email y rut
    const dup = await pool.query('SELECT rut FROM users WHERE email=$1 OR rut=$2', [email, rut]);
    if (dup.rows.length > 0) {
      return res.status(409).json({ error: 'Email o RUT ya registrado' });
    }

    // Hash de contraseña
    const password_hash = await bcrypt.hash(password, 10);

    const q = await pool.query(
      `INSERT INTO users (nombre, apellido_paterno, apellido_materno, nacimiento, rut, email, password_hash, telefono, direccion)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING rut, nombre, apellido_paterno, apellido_materno, nacimiento, rut as id, email, telefono, direccion, card_last4, card_brand, card_expiry`,
      [nombre, apellido_paterno, apellido_materno, nacimiento, rut, email, password_hash, telefono, direccion]
    );

    const user = q.rows[0];
    const token = jwt.sign({ rut: user.rut }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user: mapUserResponse(user), token });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});
