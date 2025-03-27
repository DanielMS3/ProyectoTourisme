const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../database/database');

const router = express.Router();

// Ruta para iniciar sesión
router.post('/', (req, res) => {
    const { correo, contrasena } = req.body;
    
    if (!correo || !contrasena) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    // Buscar usuario en la base de datos
    connection.query('SELECT * FROM autenticacion WHERE correo = ?', [correo], async (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        const user = results[0];
        
        // Comparar la contraseña con el hash almacenado
        const match = await bcrypt.compare(contrasena, user.contrasena_hash);
        if (!match) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id_usuario: user.id_usuario, correo: user.correo },
            process.env.JWT_SECRET || 'clave_secreta',
            { expiresIn: '2h' }
        );

        res.json({ message: 'Inicio de sesión exitoso', token });
    });
});

module.exports = router;
