const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// -------------------------------------------------------------
// Obtener perfil
// -------------------------------------------------------------
router.get('/', authMiddleware, userController.getProfile);


// -------------------------------------------------------------
// Actualizar usuario
// -------------------------------------------------------------
router.patch("/", authMiddleware, userController.updateProfile)

// -------------------------------------------------------------
// Actualizar tarjeta del usuario (solo metadatos no sensibles)
// -------------------------------------------------------------
router.put(
  '/payment-method',
  authMiddleware,
  userController.updatePaymentMethod
);

// -------------------------------------------------------------
// Historial Crediticio (Mock)
// -------------------------------------------------------------

router.get(
  '/credit-history',
  authMiddleware,
  userController.creditHistory
);

module.exports = router;