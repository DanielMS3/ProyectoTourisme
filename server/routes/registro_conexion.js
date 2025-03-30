const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('../database/database');


const router = express.Router();

// Ruta para registrar usuario
router.post('/registro', async (req, res) => {
    let { correo, contrasena, fecha_nacimiento, genero, nacionalidad } = req.body; // Usar let para genero

    // Si el usuario envió "M", "F" o "O", conviértelo a valores válidos
    if (genero === "M") genero = "Masculino";
    if (genero === "F") genero = "Femenino";
    if (genero === "O") genero = "Otro";

    // Validación de campos obligatorios
    if (!correo || !contrasena || !fecha_nacimiento || !genero || !nacionalidad) {
        return res.status(400).json({ error: "Todos los campos obligatorios deben ser completados." });
    }

    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Insertar usuario en la tabla 'Usuario'
        connection.query('INSERT INTO Usuario (correo, id_rol) VALUES (?, 1)', [correo], (err, result) => {
            if (err) {
                console.error('Error al insertar en Usuario:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            const id_usuario = result.insertId;

            // Insertar autenticación en la tabla 'autenticacion'
            connection.query(
                'INSERT INTO autenticacion (id_usuario, correo, contrasena_hash, fecha_nacimiento, genero, nacionalidad, tipo_autenticacion) VALUES (?, ?, ?, ?, ?, ?, "normal")',
                [id_usuario, correo, hashedPassword, fecha_nacimiento, genero, nacionalidad],
                (err) => {
                    if (err) {
                        console.error('Error al insertar en autenticacion:', err);
                        return res.status(500).json({ error: 'Error en el servidor' });
                    }
                    res.json({ message: "Usuario registrado exitosamente" });
                }
            );
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
