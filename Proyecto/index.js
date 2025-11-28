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

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

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
    cb(new Error('Formato no permitido'));
  }
});

// Middleware para validar token
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Login
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
        email: user.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener perfil
app.get('/api/user', authMiddleware, async (req, res) => {
  const q = await pool.query(
    "SELECT id, nombre, apellido_paterno, apellido_materno, nacimiento, rut, email FROM users WHERE id=$1",
    [req.user.id]
  );
  res.json(q.rows[0]);
});

// Actualizar usuario
app.put('/api/user/update', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, email } = req.body;

    if (!nombre || !email)
      return res.status(400).json({ error: "Nombre y email son obligatorios." });

    // Validar email repetido
    const exist = await pool.query(
      "SELECT id FROM users WHERE email=$1 AND id<>$2",
      [email, userId]
    );

    if (exist.rows.length > 0)
      return res.status(409).json({ error: "Email ya registrado por otro usuario." });

    // Actualizar SOLO nombre y email (lo demás se preserva)
    const updated = await pool.query(
      `UPDATE users
       SET nombre=$1,
           email=$2
       WHERE id=$3
       RETURNING id, nombre, apellido_paterno, apellido_materno, nacimiento, rut, email`,
      [nombre, email, userId]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

app.listen(port, () => console.log(`Backend en http://localhost:${port}`));
