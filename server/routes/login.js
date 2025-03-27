const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('../database/database');

const router = express.Router();

// Ruta para iniciar sesión
router.post('/', (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ error: "Correo y contraseña son obligatorios." });
    }

    // Buscar el usuario en la base de datos
    connection.query(
        'SELECT id_usuario, correo, contrasena_hash FROM autenticacion WHERE correo = ?',
        [correo],
        async (err, results) => {
            if (err) {
                console.error('Error en la consulta:', err);
                return res.status(500).json({ error: "Error en el servidor" });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: "Correo o contraseña incorrectos." });
            }

            const usuario = results[0];

            // Comparar la contraseña ingresada con la almacenada encriptada
            const match = await bcrypt.compare(contrasena, usuario.contrasena_hash);

            if (!match) {
                return res.status(401).json({ error: "Correo o contraseña incorrectos." });
            }

            res.json({ message: "Inicio de sesión exitoso", usuario: { id: usuario.id_usuario, correo: usuario.correo } });
        }
    );
});

module.exports = router;
