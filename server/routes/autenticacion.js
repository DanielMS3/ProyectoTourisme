const express = require('express');
const router = express.Router();
const authController = require('../controllers/controlador_autenticacion');

// Ruta para registro de usuarios normal
router.post('/register', authController.register);

module.exports = router;
