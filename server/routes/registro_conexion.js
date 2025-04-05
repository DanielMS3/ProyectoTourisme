const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('../database/database');

const router = express.Router();

// Ruta para registrar usuario
router.post('/', async (req, res) => {
    let { role, nombre, email, password, fecha_nacimiento, genero, nacionalidad } = req.body;

    console.log('Datos recibidos:', req.body);

    // Normalizar valores de género
    const generosValidos = { M: "Masculino", F: "Femenino", O: "Otro" };
    genero = generosValidos[genero] || null;

    // Validación de entrada
    if (!email || !password || !fecha_nacimiento || !genero || !nacionalidad) {
        return res.status(400).json({ error: "Todos los campos obligatorios deben ser completados." });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: "El formato del correo electrónico no es válido." });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
    }

    try {
        // Verificar si el usuario ya existe
        const [userExists] = await connection.promise().query(
            'SELECT id_usuario FROM usuario WHERE correo = ?',
            [email]
        );

        if (userExists.length > 0) {
            return res.status(400).json({ error: "El correo electrónico ya está registrado." });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determinar rol del usuario
        let id_rol = role === 'empresa' ? 2 : 1;

        // Insertar en la tabla usuario
        const [userResult] = await connection.promise().query(
            'INSERT INTO usuario (nombre, correo, id_rol) VALUES (?, ?, ?)',
            [nombre, email, id_rol]
        );
        

        const id_usuario = userResult.insertId;

        // Insertar en la tabla autenticacion
        await connection.promise().query(
            'INSERT INTO autenticacion (id_usuario, correo, contrasena_hash, fecha_nacimiento, genero, nacionalidad, tipo_autenticacion) VALUES (?, ?, ?, ?, ?, ?, "normal")',
            [id_usuario, email, hashedPassword, fecha_nacimiento, genero, nacionalidad]
        );

        res.json({ message: "Usuario registrado exitosamente" });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
