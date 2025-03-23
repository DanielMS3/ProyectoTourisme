const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../../database/database');

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }
    
    // Consultar el usuario por correo electrónico
    const query = `
        SELECT u.id_usuario, u.nombre, a.correo, a.contrasena_hash, u.id_rol
        FROM Usuario u
        JOIN autenticacion a ON u.id_usuario = a.id_usuario
        WHERE a.correo = ? AND a.tipo_autenticacion = 'normal'
    `;
    
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ message: 'Error del servidor' });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        
        const user = results[0];
        
        // Verificar la contraseña
        try {
            const match = await bcrypt.compare(password, user.contrasena_hash);
            
            if (!match) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }
            
            // Crear sesión de usuario
            req.session.user = {
                id: user.id_usuario,
                nombre: user.nombre,
                email: user.correo,
                rol: user.id_rol
            };
            
            // Registrar inicio de sesión en la bitácora
            const auditQuery = `
                INSERT INTO Bitacora_Auditoria (id_usuario, accion)
                VALUES (?, 'Inicio de sesión')
            `;
            
            db.query(auditQuery, [user.id_usuario], (auditErr) => {
                if (auditErr) {
                    console.error('Error al registrar en bitácora:', auditErr);
                    // No interrumpimos el flujo por un error en la bitácora
                }
                
                // Responder con datos del usuario (sin información sensible)
                res.json({
                    message: 'Login exitoso',
                    user: {
                        id: user.id_usuario,
                        nombre: user.nombre,
                        email: user.correo,
                        rol: user.id_rol
                    }
                });
            });
            
        } catch (error) {
            console.error('Error al verificar contraseña:', error);
            res.status(500).json({ message: 'Error del servidor' });
        }
    });
});

// Ruta para iniciar autenticación con Google
router.get('/google', (req, res) => {
    // En una implementación real, aquí redirigirías a la autenticación de Google OAuth
    // Para este ejemplo, simplemente mostramos un mensaje
    res.send('Redireccionando a autenticación de Google...');
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Sesión cerrada correctamente' });
});

module.exports = router;