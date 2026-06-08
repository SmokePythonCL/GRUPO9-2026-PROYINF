const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
  signLoan,
  createLoan,
  simulateLoan,
  getLoans,
  getLoanById,
  updateLoanStatus
} = require('../controllers/loanController');

// Firma
router.post(
  '/sign',
  authMiddleware,
  signLoan
);

// Simulación
router.post(
  '/simulate',
  simulateLoan
);

// Crear préstamo
router.post(
  '/',
  authMiddleware,
  createLoan
);

// Historial
router.get(
  '/',
  authMiddleware,
  getLoans
);

// Detalle
router.get(
  '/:id',
  authMiddleware,
  getLoanById
);

// Actualizar estado
router.patch(
  '/:id/status',
  updateLoanStatus
);

module.exports = router;