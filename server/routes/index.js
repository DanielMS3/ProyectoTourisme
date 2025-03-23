const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');

// Rutas de autenticación
router.use('/auth', authRoutes);

// Aquí puedes agregar otras rutas de tu API

module.exports = router;