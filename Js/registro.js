const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'tu_usuario',
    password: 'tu_contraseña',
    database: 'tourisme'
});

db.connect(err => {
    if (err) {
        console.error('Error de conexión a la BD:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

// Ruta para registrar un usuario
app.post('/registro', async (req, res) => {
    const { nombre, correo, fecha_nacimiento, genero, nacionalidad, contrasena } = req.body;
    
    if (!nombre || !correo || !fecha_nacimiento || !genero || !nacionalidad || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el correo ya está registrado
        const [rows] = await db.promise().query('SELECT * FROM autenticacion WHERE correo = ?', [correo]);
        if (rows.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Hashear la contraseña
        const contrasena_hash = await bcrypt.hash(contrasena, 10);

        // Insertar en la tabla Usuario
        const [userResult] = await db.promise().query('INSERT INTO Usuario (nombre) VALUES (?)', [nombre]);
        const id_usuario = userResult.insertId;

        // Insertar en la tabla Autenticacion
        await db.promise().query(
            'INSERT INTO autenticacion (id_usuario, correo, contrasena_hash, fecha_nacimiento, genero, nacionalidad, tipo_autenticacion) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_usuario, correo, contrasena_hash, fecha_nacimiento, genero, nacionalidad, 'normal']
        );

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
