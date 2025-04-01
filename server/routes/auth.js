const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para registro de usuarios normal
router.post('/register', registerUser);

module.exports = router;