const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../database/database');

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await connection.promise().query(`
            SELECT a.id_usuario, a.contrasena_hash, r.nombre AS rol
            FROM autenticacion a
            INNER JOIN usuario u ON a.id_usuario = u.id_usuario
            INNER JOIN rol r ON u.id_rol = r.id_rol
            WHERE a.correo = ?
        `, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.contrasena_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Enviar respuesta con el rol del usuario
        res.status(200).json({ message: 'Login exitoso', rol: user.rol });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

module.exports = router;
