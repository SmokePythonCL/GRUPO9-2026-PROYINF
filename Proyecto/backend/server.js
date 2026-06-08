const express = require('express');
const path = require('path');

const corsConfig = require('./config/cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

app.use(corsConfig);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads',
    express.static(path.join(__dirname, 'uploads'))
);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/me/documents', documentRoutes);

app.get('/api/health', (req, res) =>
    res.json({ ok: true })
);


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
      comments TEXT,
      application_date TIMESTAMP DEFAULT NOW(),
      approval_date TIMESTAMP,
      start_date TIMESTAMP,
      due_date TIMESTAMP
    );
  `);

  // seed omitido
}

// -------------------------------------------------------------
// Función para iniciar el servidor con reintentos para la DB
// -------------------------------------------------------------
async function startServer() {
  let retries = 5;
  while (retries) {
    try {
      // Intenta inicializar el esquema
      await initSchema();
      console.log("Base de datos conectada y tablas listas.");
      
      // Solo inicia el servidor Express si la DB está lista
      app.listen(port, () => {
        console.log(`Backend corriendo en http://localhost:${port}`);
      });
      return; // Éxito, salimos de la función
    } catch (err) {
      retries -= 1;
      console.error(`Error conectando a la DB. Reintentos restantes: ${retries}`);
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
