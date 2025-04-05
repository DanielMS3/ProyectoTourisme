const express = require('express');
const { registrarUsuario } = require('../controllers/auth');

const router = express.Router();

// Ruta para el registro de usuarios
router.post('/registro', registrarUsuario);

module.exports = router;