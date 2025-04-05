import { pool } from '../database/database.js';
import bcrypt from 'bcrypt';

// Función para registrar un nuevo usuario
export async function registrarUsuario(req, res) {
    const { role, email, password, fecha_nacimiento, genero, nacionalidad } = req.body;
    
    // Validar datos recibidos
    if (!role || !email || !password || !fecha_nacimiento || !genero) {
        return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados' });
    }

    try {
        // Iniciar transacción
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Verificar si el correo ya existe
            const [existingUsers] = await connection.query(
                'SELECT * FROM usuario WHERE correo = ?',
                [email]
            );

            if (existingUsers.length > 0) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ message: 'Este correo electrónico ya está registrado' });
            }

            // Obtener el ID del rol seleccionado
            const [roles] = await connection.query(
                'SELECT id_rol FROM rol WHERE nombre = ?',
                [role === 'empresa' ? 'negocio' : role]
            );

            if (roles.length === 0) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ message: 'Rol no válido' });
            }

            const id_rol = roles[0].id_rol;

            // Hashear la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Convertir el género al formato de la base de datos
            let generoDb;
            if (genero === 'M') generoDb = 'masculino';
            else if (genero === 'F') generoDb = 'femenino';
            else generoDb = 'otro';

            // Insertar el usuario
            const [result] = await connection.query(
                'INSERT INTO usuario (id_rol, correo, nombre, contrasena_hash, fecha_nacimiento, genero, nacionalidad) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id_rol, email, email.split('@')[0], hashedPassword, fecha_nacimiento, generoDb, nacionalidad]
            );

            // Confirmar la transacción
            await connection.commit();
            connection.release();

            return res.status(201).json({ 
                message: 'Usuario registrado exitosamente',
                userId: result.insertId
            });

        } catch (error) {
            // Revertir la transacción en caso de error
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}