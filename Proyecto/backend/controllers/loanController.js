const pool = require('../db');
const { simulateLoan } = require('../utils/loanUtils');

// -------------------------------------------------------------
// Firma con Clave Unica (Mock)
// -------------------------------------------------------------
exports.signLoan = (req, res) => {
  setTimeout(() => {
    res.json({
      success: true,
      message: 'Firma realizada correctamente'
    });
  }, 2000);
};

// -------------------------------------------------------------
// Crear préstamo o simulación
// -------------------------------------------------------------
exports.createLoan = async (req, res) => {
  try {
    const userRut = req.user.rut;
    const { amount, term } = req.body || {};

    const sim = simulateLoan(amount, term);

    const loanIdStr =
      'L-' +
      Math.random()
        .toString(36)
        .slice(2, 10)
        .toUpperCase();

    const now = new Date();

    const approvalDate = new Date(
      now.getTime() + 1000 * 60 * 60 * 24
    );

    const startDate = new Date(
      approvalDate.getTime() + 1000 * 60 * 60 * 24 * 2
    );

    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + sim.term);

    const q = await pool.query(
      `INSERT INTO loans
      (
        user_rut,
        loan_id_str,
        amount,
        term,
        rate,
        monthly,
        total,
        status,
        application_date,
        approval_date,
        start_date,
        due_date
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        userRut,
        loanIdStr,
        sim.amount,
        sim.term,
        sim.rate,
        sim.monthly,
        sim.total,
        'activo',
        now,
        approvalDate,
        startDate,
        dueDate
      ]
    );

    res.status(201).json({
      id: q.rows[0].loan_id_str,
      status: q.rows[0].status,
      summary: q.rows[0]
    });

  } catch (err) {
    console.error('SUBMIT LOAN ERROR:', err);

    res.status(500).json({
      error: 'Error interno'
    });
  }
};

// -------------------------------------------------------------
// Simulación
// -------------------------------------------------------------
exports.simulateLoan = (req, res) => {
  const { amount, term } = req.body || {};

  const result = simulateLoan(amount, term);

  res.json(result);
};

// -------------------------------------------------------------
// Historial préstamos
// -------------------------------------------------------------
exports.getLoans = async (req, res) => {
  try {
    const userRut = req.user.rut;

    const q = await pool.query(
      `SELECT *
       FROM loans
       WHERE user_rut = $1
       AND application_date >= NOW() - INTERVAL '1 year'
       ORDER BY application_date DESC`,
      [userRut]
    );

    res.json(q.rows);

  } catch (err) {
    console.error('GET LOANS HISTORY ERROR:', err);

    res.status(500).json({
      error: 'Error interno'
    });
  }
};

// -------------------------------------------------------------
// Detalle préstamo
// -------------------------------------------------------------
exports.getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRut = req.user.rut;

    const q = await pool.query(
      `SELECT *
       FROM loans
       WHERE loan_id_str = $1
       AND user_rut = $2`,
      [id, userRut]
    );

    if (q.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found'
      });
    }

    res.json(q.rows[0]);

  } catch (err) {
    console.error('GET LOAN DETAILS ERROR:', err);

    res.status(500).json({
      error: 'Error interno'
    });
  }
};

// -------------------------------------------------------------
// Actualizar estado
// -------------------------------------------------------------
exports.updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Estado es requerido'
      });
    }

    const q = await pool.query(
      `UPDATE loans
       SET status = $1,
           comments = $2
       WHERE loan_id_str = $3
       RETURNING *`,
      [
        status,
        comments || null,
        id
      ]
    );

    if (q.rows.length === 0) {
      return res.status(404).json({
        error: 'Préstamo no encontrado'
      });
    }

    res.json(q.rows[0]);

  } catch (err) {
    console.error('UPDATE LOAN STATUS ERROR:', err);

    res.status(500).json({
      error: 'Error interno'
    });
  }
};