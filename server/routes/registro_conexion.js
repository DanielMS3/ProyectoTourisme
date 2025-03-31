const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('../database/database');

const router = express.Router();

// Ruta para registrar usuario
router.post('/', async (req, res) => {
    let { role, correo, contrasena, fecha_nacimiento, genero, nacionalidad } = req.body;

    console.log('Datos recibidos:', req.body);

    // Validación de datos obligatorios
    if (!correo || !contrasena || !fecha_nacimiento || !genero || !nacionalidad || !role) {
        return res.status(400).json({ error: "Todos los campos obligatorios deben ser completados." });
    }

    // Validación del tipo de usuario
    if (role !== "usuario" && role !== "empresa") {
        return res.status(400).json({ error: "El tipo de usuario debe ser 'usuario' o 'empresa'." });
    }

    try {
        // Verificar si el correo ya está registrado
        const [existingUser] = await connection.promise().query(
            "SELECT id_usuario FROM usuario WHERE correo = ?",
            [correo]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "El correo ya está registrado." });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Asignar el rol
        const id_rol = role === "empresa" ? 2 : 1; // 1 = Turista, 2 = Empresa

        // Inserción en la base de datos (usuario y autenticación en un solo query)
        const query = `
            INSERT INTO usuario (correo, id_rol)
            VALUES (?, ?);
            
            INSERT INTO autenticacion (id_usuario, correo, contrasena_hash, fecha_nacimiento, genero, nacionalidad, tipo_autenticacion)
            VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, ?, "normal");
        `;

        await connection.promise().query(query, [correo, id_rol, correo, hashedPassword, fecha_nacimiento, genero, nacionalidad]);

        res.json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error interno en el servidor." });
    }
});

module.exports = router;
