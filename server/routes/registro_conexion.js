const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('../database/database');


const router = express.Router();

// Ruta para registrar usuario
router.post('/', async (req, res) => {
    let { role, correo, contrasena, fecha_nacimiento, genero, nacionalidad } = req.body; 

    console.log('Datos recibidos:', req.body);

    // Si el usuario envió "M", "F" o "O", conviértelo a valores válidos
    if (genero === "M") genero = "Masculino";
    if (genero === "F") genero = "Femenino";
    if (genero === "O") genero = "Otro";

    // Validación de campos obligatorios
    if (!correo || !contrasena || !fecha_nacimiento || !genero || !nacionalidad) {
        return res.status(400).json({ error: "Todos los campos obligatorios deben ser completados." });
    }

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        let id_rol = 1;
        if(role === 'empresa'){
            id_rol = 2;
        }

        connection.query('INSERT INTO usuario (correo, id_rol) VALUES (?, ?)', [correo, id_rol], (err, result) => {
            if (err) {
                console.error('Error al insertar en Usuario:', err);
                return res.status(500).json({ error: 'Error en el servidor al registrar usuario' });
            }

            const id_usuario = result.insertId;

            connection.query(
                'INSERT INTO autenticacion (id_usuario, correo, contrasena_hash, fecha_nacimiento, genero, nacionalidad, tipo_autenticacion) VALUES (?, ?, ?, ?, ?, ?, "normal")',
                [id_usuario, correo, hashedPassword, fecha_nacimiento, genero, nacionalidad],
                (err) => {
                    if (err) {
                        console.error('Error al insertar en autenticacion:', err);
                        return res.status(500).json({ error: 'Error en el servidor al insertar autenticacion' });
                    }
                    res.json({ message: "Usuario registrado exitosamente" });
                }
            );
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en el servidor: error general' });
    }
});

module.exports = router;
