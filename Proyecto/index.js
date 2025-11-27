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

// Preparar carpeta de uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const mime = file.mimetype || '';
    if (mime.startsWith('image/') || mime === 'application/pdf') {
      return cb(null, true);
    }
    cb(new Error('Formato no permitido. Solo imagen o PDF'));
  }
});

// Inicialización de tablas
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
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  // Asegurar columnas en entornos ya existentes
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS apellido_paterno TEXT NOT NULL DEFAULT ''`);
  await pool.query(`ALTER TABLE users ALTER COLUMN apellido_paterno DROP DEFAULT`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS apellido_materno TEXT NOT NULL DEFAULT ''`);
  await pool.query(`ALTER TABLE users ALTER COLUMN apellido_materno DROP DEFAULT`);
  await pool.query(`ALTER TABLE users ALTER COLUMN email SET NOT NULL`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_documents (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      doc_type TEXT NOT NULL,
      file_path TEXT NOT NULL,
      uploaded_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

initSchema().catch(err => {
  console.error('Error creando tablas', err);
});

app.get('/api/health', async (req, res) => {
  try {
    const r = await pool.query("SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name='users' ORDER BY ordinal_position");
    res.json({ ok: true, users_columns: r.rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Registro
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('POST /api/auth/register body:', req.body);
    const { nombre, apellido_paterno, apellido_materno, nacimiento, rut, password, email } = req.body;
    if (!nombre || !apellido_paterno || !apellido_materno || !nacimiento || !rut || !password || !email) {
      return res.status(400).json({ error: 'Faltan campos: nombre, apellidos, nacimiento, rut, email y contraseña' });
    }
    // Validaciones básicas
    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(nacimiento)) {
      return res.status(400).json({ error: 'Fecha de nacimiento debe ser YYYY-MM-DD' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (nombre, apellido_paterno, apellido_materno, nacimiento, rut, email, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, nombre, apellido_paterno, apellido_materno, nacimiento, rut, email',
      [nombre, apellido_paterno, apellido_materno, nacimiento, rut, email, hash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, rut: user.rut }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'RUT o email ya registrado' });
    }
    console.error('Error en registro:', err);
    res.status(500).json({ error: err.message || 'Error interno' });
  }
});

// Login por RUT o email
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Debe ingresar email y contraseña' });
    }
    const result = await pool.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Contraseña incorrecta' });
    const token = jwt.sign({ id: user.id, rut: user.rut }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      user: { id: user.id, nombre: user.nombre, apellido_paterno: user.apellido_paterno, apellido_materno: user.apellido_materno, nacimiento: user.nacimiento, rut: user.rut, email: user.email },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Error interno' });
  }
});

// Perfil del usuario
app.get('/api/user', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, apellido_paterno, apellido_materno, nacimiento, rut, email FROM users WHERE id = $1', [req.user.id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Subida de documentos: carnet frontal, trasera, comprobante
app.post('/api/user/documents', authMiddleware, upload.fields([
  { name: 'carnet_frontal', maxCount: 1 },
  { name: 'carnet_trasera', maxCount: 1 },
  { name: 'comprobante_domicilio', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files || {};
    const entries = [];
    for (const [key, arr] of Object.entries(files)) {
      const file = arr[0];
      entries.push([req.user.id, key, `/uploads/${file.filename}`]);
    }
    if (entries.length === 0) return res.status(400).json({ error: 'Sin archivos' });
    const valuesSql = entries.map((_, i) => `($${i*3+1}, $${i*3+2}, $${i*3+3})`).join(',');
    const flat = entries.flat();
    await pool.query(`INSERT INTO user_documents (user_id, doc_type, file_path) VALUES ${valuesSql}`, flat);
    res.json({ ok: true, uploaded: entries.map(e => ({ doc_type: e[1], file_path: e[2] })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Listar documentos del usuario
app.get('/api/user/documents', authMiddleware, async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT doc_type, file_path, uploaded_at FROM user_documents WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [req.user.id]
    );
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Ruta de prueba que guarda un mensaje en la base de datos
app.get('/', (req, res) => {
  res.send('API backend activa');
});

app.listen(port, () => {
  console.log(`Backend corriendo en http://localhost:${port}`);
});