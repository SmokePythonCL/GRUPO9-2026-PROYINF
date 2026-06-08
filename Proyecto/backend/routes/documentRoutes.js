const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/multer');

const {
  documentUpload,
  documentList
} = require('../controllers/documentController');

router.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'carnet_frontal', maxCount: 1 },
    { name: 'carnet_trasera', maxCount: 1 },
    { name: 'comprobante_domicilio', maxCount: 1 }
  ]),
  documentUpload
);

router.get(
  '/',
  authMiddleware,
  documentList
);

module.exports = router;