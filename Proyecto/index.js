const express = require('express');
const pool = require('./db'); // Importar la conexión
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta mejorada para guardar mensajes personalizados en la base de datos
app.post('/save', async (req, res) => {
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, content TEXT)');
    const { content } = req.body;
    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'El campo "content" es requerido.' });
    }
    await pool.query('INSERT INTO messages (content) VALUES ($1)', [content]);
    res.json({ message: 'Mensaje guardado en la base de datos', content });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Ruta para obtener todos los mensajes
app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.get('/', (req, res) => {
  res.send('¡Bienvenido! Usa /save para guardar un mensaje y /messages para verlos.');
});

app.listen(port, () => {
  console.log(`App corriendo en http://localhost:${port}`);
});