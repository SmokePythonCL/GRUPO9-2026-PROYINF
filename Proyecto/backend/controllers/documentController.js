

// -------------------------------------------------------------
// Subida de documentos del usuario
// -------------------------------------------------------------
const pool = require('../db');
const path = require('path');

exports.documentUpload = async (req, res) => {
  try {
    const userRut = req.user.rut;
    const saved = [];

    function saveDoc(fieldName, tipo) {
      const f = req.files?.[fieldName]?.[0];

      if (f) {
        saved.push({
          tipo,
          file_path: `/uploads/${path.basename(f.path)}`
        });
      }
    }

    saveDoc('carnet_frontal', 'carnet_frontal');
    saveDoc('carnet_trasera', 'carnet_trasera');
    saveDoc('comprobante_domicilio', 'comprobante_domicilio');

    if (saved.length === 0) {
      return res.status(400).json({
        error: 'No se enviaron archivos'
      });
    }

    for (const s of saved) {
      await pool.query(
        `INSERT INTO user_documents
         (user_rut, doc_type, tipo, file_path)
         VALUES ($1,$2,$3,$4)`,
        [userRut, s.tipo, s.tipo, s.file_path]
      );
    }

    res.status(201).json({
      ok: true,
      documents: saved
    });

  } catch (err) {
    console.error('UPLOAD DOCS ERROR:', err);
    res.status(500).json({
      error: 'Error interno'
    });
  }
};

// Listar documentos del usuario
exports.documentList = async (req, res) => {
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
};