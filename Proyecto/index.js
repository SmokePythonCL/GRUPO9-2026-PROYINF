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

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como Postman o curl)
    if (!origin) return callback(null, true);
    
    // Validar si el origen es localhost o 127.0.0.1 en cualquier puerto
    const allowedOrigins = [/^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/];
    const isAllowed = allowedOrigins.some((regex) => regex.test(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("CORS bloqueado para el origen:", origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Los demás middlewares van después
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// Health Check
// -------------------------------------------------------------
app.get('/api/health', (req, res) => res.json({ ok: true }));

// -------------------------------------------------------------
// 🔥 Crear columnas automáticamente (incluye telefono)
// -------------------------------------------------------------
async function initSchema() {
  await pool.query(`DROP TABLE IF EXISTS loans CASCADE;`);
  await pool.query(`DROP TABLE IF EXISTS user_documents CASCADE;`);
  await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      rut TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      nacimiento DATE NOT NULL,
      apellido_paterno TEXT NOT NULL,
      apellido_materno TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      telefono TEXT DEFAULT '',
      direccion TEXT DEFAULT '',
      card_last4 TEXT,
      card_brand TEXT,
      card_expiry TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_documents (
      id SERIAL PRIMARY KEY,
      user_rut TEXT NOT NULL REFERENCES users(rut) ON DELETE CASCADE,
      doc_type TEXT NOT NULL,
      file_path TEXT NOT NULL,
      tipo TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS loans (
      id SERIAL PRIMARY KEY,
      user_rut TEXT NOT NULL REFERENCES users(rut) ON DELETE CASCADE,
      loan_id_str TEXT UNIQUE NOT NULL,
      amount NUMERIC NOT NULL,
      term INTEGER NOT NULL,
      rate NUMERIC NOT NULL,
      monthly NUMERIC NOT NULL,
      total NUMERIC NOT NULL,
      status TEXT NOT NULL,
      application_date TIMESTAMP DEFAULT NOW(),
      approval_date TIMESTAMP,
      start_date TIMESTAMP,
      due_date TIMESTAMP
    );
  `);

  // seed omitido
}



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

function mapUserResponse(row) {
  if (!row) return row;

  return {
    id: row.rut,
    nombre: row.nombre,
    apellido_paterno: row.apellido_paterno,
    apellido_materno: row.apellido_materno,
    nacimiento: row.nacimiento,
    rut: row.rut,
    email: row.email,
    telefono: row.telefono,
    direccion: row.direccion,
    paymentMethod: row.card_last4
      ? {
          last4: row.card_last4,
          brand: row.card_brand || undefined,
          expiry: row.card_expiry || undefined
        }
      : null
  };
}

function detectCardBrand(cardNumber) {
  if (/^4/.test(cardNumber)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(cardNumber)) return 'mastercard';
  if (/^3[47]/.test(cardNumber)) return 'amex';
  if (/^6(?:011|5)/.test(cardNumber)) return 'discover';
  return 'unknown';
}

function isLuhnValid(cardNumber) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i -= 1) {
    let digit = Number(cardNumber[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
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
// Obtener perfil
// -------------------------------------------------------------
app.get('/api/user', authMiddleware, async (req, res) => {
  const q = await pool.query(
    "SELECT rut, nombre, apellido_paterno, apellido_materno, nacimiento, rut, email, telefono, direccion, card_last4, card_brand, card_expiry FROM users WHERE rut=$1",
    [req.user.rut]
  );
  res.json(mapUserResponse(q.rows[0]));
});

// -------------------------------------------------------------
// Actualizar usuario
// -------------------------------------------------------------
app.patch('/api/user', authMiddleware, async (req, res) => {
  try {
    const userRut = req.user.rut;

    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      nacimiento,
      email,
      telefono,
      direccion
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
    addField("direccion", direccion);

    if (fields.length === 0)
      return res.status(400).json({ error: "No hay datos para actualizar." });

    // Validar email repetido solo si se intenta cambiar
    if (email !== undefined) {
      const exist = await pool.query(
        "SELECT rut FROM users WHERE email=$1 AND rut<>$2",
        [email, userRut]
      );

      if (exist.rows.length > 0)
        return res.status(409).json({ error: "Email ya registrado por otro usuario." });
    }

    // Construcción del UPDATE dinámico
    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE rut = $${fields.length + 1}
      RETURNING rut, nombre, apellido_paterno, apellido_materno, nacimiento, rut as id, email, telefono, direccion, card_last4, card_brand, card_expiry
    `;

    values.push(userRut);

    const updated = await pool.query(query, values);

    res.json(mapUserResponse(updated.rows[0]));

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// -------------------------------------------------------------
// Actualizar tarjeta del usuario (solo metadatos no sensibles)
// -------------------------------------------------------------
app.put('/api/user/payment-method', authMiddleware, async (req, res) => {
  try {
    const userRut = req.user.rut;
    const { cardNumber, expiry, cvv } = req.body || {};

    const digits = String(cardNumber || '').replace(/\D/g, '');
    const safeExpiry = String(expiry || '').trim();
    const safeCvv = String(cvv || '').replace(/\D/g, '');

    if (digits.length < 12 || digits.length > 19 || !isLuhnValid(digits)) {
      return res.status(400).json({ error: 'Número de tarjeta inválido.' });
    }

    if (!/^\d{2}\/\d{2}$/.test(safeExpiry)) {
      return res.status(400).json({ error: 'Fecha de expiración inválida. Usa MM/AA.' });
    }

    const month = Number(safeExpiry.slice(0, 2));
    if (month < 1 || month > 12) {
      return res.status(400).json({ error: 'Mes de expiración inválido.' });
    }

    if (safeCvv.length < 3 || safeCvv.length > 4) {
      return res.status(400).json({ error: 'CVV inválido.' });
    }

    const last4 = digits.slice(-4);
    const brand = detectCardBrand(digits);

    const q = await pool.query(
      `UPDATE users
       SET card_last4=$1, card_brand=$2, card_expiry=$3
       WHERE rut=$4
       RETURNING card_last4, card_brand, card_expiry`,
      [last4, brand, safeExpiry, userRut]
    );

    res.json({
      ok: true,
      paymentMethod: {
        last4: q.rows[0].card_last4,
        brand: q.rows[0].card_brand,
        expiry: q.rows[0].card_expiry
      }
    });
  } catch (err) {
    console.error('UPDATE PAYMENT METHOD ERROR:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// -------------------------------------------------------------
// Registro
// -------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
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

// -------------------------------------------------------------
// Subida de documentos del usuario
// -------------------------------------------------------------
app.post('/api/me/documents', authMiddleware, upload.fields([
  // Nombres usados por el frontend
  { name: 'carnet_frontal', maxCount: 1 },
  { name: 'carnet_trasera', maxCount: 1 },
  { name: 'comprobante_domicilio', maxCount: 1 }
]), async (req, res) => {
  try {
    const userRut = req.user.rut;
    const saved = [];

    function saveDoc(fieldName, tipo) {
      const f = (req.files && req.files[fieldName] && req.files[fieldName][0]) || null;
      if (f) saved.push({ tipo, file_path: `/uploads/${path.basename(f.path)}` });
    }

    saveDoc('carnet_frontal', 'carnet_frontal');
    saveDoc('carnet_trasera', 'carnet_trasera');
    saveDoc('comprobante_domicilio', 'comprobante_domicilio');

    if (saved.length === 0) {
      return res.status(400).json({ error: 'No se enviaron archivos' });
    }

    for (const s of saved) {
      await pool.query(
        `INSERT INTO user_documents (user_rut, doc_type, tipo, file_path) VALUES ($1,$2,$3,$4)`,
        [userRut, s.tipo, s.tipo, s.file_path]
      );
    }

    res.status(201).json({ ok: true, documents: saved });
  } catch (err) {
    console.error('UPLOAD DOCS ERROR:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Listar documentos del usuario
app.get('/api/me/documents', authMiddleware, async (req, res) => {
  try {
    const userRut = req.user.rut;
    const q = await pool.query(
      `SELECT id, tipo, file_path, created_at FROM user_documents WHERE user_rut=$1 ORDER BY created_at DESC`,
      [userRut]
    );
    res.json(q.rows);
  } catch (err) {
    console.error('LIST DOCS ERROR:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// -------------------------------------------------------------
// Firma con Clave Unica (Mock)
// -------------------------------------------------------------
app.post('/api/loans/sign', authMiddleware, (req, res) => {
  setTimeout(() => {
    res.json({ success: true, message: 'Firma realizada correctamente' });
  }, 2000);
});

// -------------------------------------------------------------
// Gestión de Préstamos e Historial
// -------------------------------------------------------------

function simulateLoan(amount, term, rate = 0.012) {
  amount = Number(amount) || 0;
  term = Number(term) || 1;
  const monthly = (amount * rate) / (1 - Math.pow(1 + rate, -term));
  const total = monthly * term;
  return {
    amount,
    term,
    rate,
    monthly: Math.round(monthly),
    total: Math.round(total),
  };
}

app.post('/api/loans', (req, res, next) => {
  const { dryRun } = req.body || {};
  if (dryRun) {
    const { amount, term } = req.body || {};
    const result = simulateLoan(amount, term);
    return res.json(result);
  }
  authMiddleware(req, res, next);
}, async (req, res) => {
  try {
    const userRut = req.user.rut;
    const { amount, term } = req.body || {};
    const sim = simulateLoan(amount, term);
    const loanIdStr = 'L-' + Math.random().toString(36).slice(2, 10).toUpperCase();

    const now = new Date();
    const approvalDate = new Date(now.getTime() + 1000 * 60 * 60 * 24); 
    const startDate = new Date(approvalDate.getTime() + 1000 * 60 * 60 * 24 * 2); 
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + sim.term);

    const q = await pool.query(
      `INSERT INTO loans (user_rut, loan_id_str, amount, term, rate, monthly, total, status, application_date, approval_date, start_date, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [userRut, loanIdStr, sim.amount, sim.term, sim.rate, sim.monthly, sim.total, 'activo', now, approvalDate, startDate, dueDate]
    );

    res.status(201).json({ id: q.rows[0].loan_id_str, status: q.rows[0].status, summary: q.rows[0] });
  } catch (err) {
    console.error('SUBMIT LOAN ERROR:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

app.get('/api/loans', authMiddleware, async (req, res) => {
  try {
    const userRut = req.user.rut;
    const q = await pool.query(
      `SELECT * FROM loans 
       WHERE user_rut = $1 AND application_date >= NOW() - INTERVAL '1 year'
       ORDER BY application_date DESC`,
      [userRut]
    );
    res.json(q.rows);
  } catch (err) {
    console.error('GET LOANS HISTORY ERROR:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

app.get('/api/loans/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userRut = req.user.rut;
    const q = await pool.query(
      `SELECT * FROM loans WHERE loan_id_str = $1 AND user_rut = $2`,
      [id, userRut]
    );
    if (q.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(q.rows[0]);
  } catch (err) {
    console.error('GET LOAN DETAILS ERROR:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});


// -------------------------------------------------------------
// Historial Crediticio (Mock)
// -------------------------------------------------------------
app.get('/api/user/credit-history', authMiddleware, (req, res) => {
  // Parsing numbers out of rut to seed
  const numSeed = parseInt(req.user.rut.replace(/\D/g, '')) || 12345;
  const seed = (numSeed * 97) % 600;
  const score = 300 + seed;
  let risk = 'ALTO';
  let recommendedAmount = 1000000;
  
  if (score >= 700) {
    risk = 'BAJO';
    recommendedAmount = 7000000;
  } else if (score >= 500) {
    risk = 'MEDIO';
    recommendedAmount = 3500000;
  }
  
  res.json({
    score,
    risk,
    recommendedAmount,
    debts: (numSeed * 12345) % 1000000,
    reportDate: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// Función para iniciar el servidor con reintentos para la DB
// -------------------------------------------------------------
async function startServer() {
  let retries = 5;
  while (retries) {
    try {
      // Intenta inicializar el esquema
      await initSchema();
      console.log("✅ Base de datos conectada y tablas listas.");
      
      // Solo inicia el servidor Express si la DB está lista
      app.listen(port, () => {
        console.log(`🚀 Backend corriendo en http://localhost:${port}`);
      });
      return; // Éxito, salimos de la función
    } catch (err) {
      retries -= 1;
      console.error(`❌ Error conectando a la DB. Reintentos restantes: ${retries}`);
      console.error(err.message);
      
      if (retries === 0) {
        console.error("No se pudo conectar a la base de datos después de varios intentos. Saliendo...");
        process.exit(1);
      }
      
      // Espera 5 segundos antes de reintentar
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

// Ejecutar la función de inicio
startServer();
