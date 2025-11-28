const express = require('express');
const cors = require('cors');
const pool = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [/^http:\/\/localhost:\d+$/],
  credentials: true,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Preparar carpeta uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const mime = file.mimetype || '';
    if (mime.startsWith('image/') || mime === 'application/pdf') return cb(null, true);
    cb(new Error('Formato no permitido'));
  }
});

// -------------------------------------------------------------
// 🔥 Crear columnas automáticamente (incluye telefono)
// -------------------------------------------------------------
async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      nacimiento DATE NOT NULL,
      rut TEXT UNIQUE NOT NULL,
      apellido_paterno TEXT NOT NULL,
      apellido_materno TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      telefono TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS telefono TEXT DEFAULT ''`);
}

initSchema().catch(e => console.error("Error creando tablas:", e));


// -------------------------------------------------------------
// Middleware token
// -------------------------------------------------------------
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// -------------------------------------------------------------
// Login
// -------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const q = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    const user = q.rows[0];
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, rut: user.rut }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido_paterno: user.apellido_paterno,
        apellido_materno: user.apellido_materno,
        nacimiento: user.nacimiento,
        rut: user.rut,
        email: user.email,
        telefono: user.telefono
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Obtener perfil
// -------------------------------------------------------------
app.get('/api/user', authMiddleware, async (req, res) => {
  const q = await pool.query(
    "SELECT id, nombre, apellido_paterno, apellido_materno, nacimiento, rut, email, telefono FROM users WHERE id=$1",
    [req.user.id]
  );
  res.json(q.rows[0]);
});

// -------------------------------------------------------------
// Actualizar usuario
// -------------------------------------------------------------
app.put('/api/user/update', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      nacimiento,
      email,
      telefono
    } = req.body;

    const fields = [];
    const values = [];

    function addField(fieldName, fieldValue) {
      if (fieldValue !== undefined) {
        fields.push(`${fieldName} = $${fields.length + 1}`);
        values.push(fieldValue);
      }
    }

    addField("nombre", nombre);
    addField("apellido_paterno", apellido_paterno);
    addField("apellido_materno", apellido_materno);
    addField("nacimiento", nacimiento);
    addField("email", email);
    addField("telefono", telefono);

    if (fields.length === 0)
      return res.status(400).json({ error: "No hay datos para actualizar." });

    // Validar email repetido solo si se intenta cambiar
    if (email !== undefined) {
      const exist = await pool.query(
        "SELECT id FROM users WHERE email=$1 AND id<>$2",
        [email, userId]
      );

      if (exist.rows.length > 0)
        return res.status(409).json({ error: "Email ya registrado por otro usuario." });
    }

    // Construcción del UPDATE dinámico
    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${fields.length + 1}
      RETURNING id, nombre, apellido_paterno, apellido_materno, nacimiento, rut, email, telefono
    `;

    values.push(userId);

    const updated = await pool.query(query, values);

    res.json(updated.rows[0]);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

app.listen(port, () => console.log(`Backend en http://localhost:${port}`));
