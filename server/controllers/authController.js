const bcrypt = require('bcrypt');
const db = require('../../database/database');

// Controlador para el inicio de sesión
exports.login = async (req, res) => {
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
};

// Controlador para el registro de usuarios
exports.register = async (req, res) => {
    const { nombre, email, password, tipo_autenticacion = 'normal' } = req.body;
    
    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    
    try {
        // Verificar si el correo ya existe
        db.query('SELECT * FROM autenticacion WHERE correo = ?', [email], async (err, results) => {
            if (err) {
                console.error('Error al verificar correo:', err);
                return res.status(500).json({ message: 'Error del servidor' });
            }
            
            if (results.length > 0) {
                return res.status(400).json({ message: 'Este correo ya está registrado' });
            }
            
            // Generar hash de la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            // Iniciar transacción para insertar usuario y autenticación
            db.beginTransaction(async (err) => {
                if (err) {
                    console.error('Error al iniciar transacción:', err);
                    return res.status(500).json({ message: 'Error del servidor' });
                }
                
                // Insertar en la tabla Usuario
                db.query(
                    'INSERT INTO Usuario (nombre, id_rol) VALUES (?, 1)', 
                    [nombre], 
                    (err, result) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Error al insertar usuario:', err);
                                res.status(500).json({ message: 'Error al registrar usuario' });
                            });
                        }
                        
                        const userId = result.insertId;
                        
                        // Insertar en la tabla autenticacion
                        db.query(
                            'INSERT INTO autenticacion (id_usuario, correo, contrasena_hash, tipo_autenticacion) VALUES (?, ?, ?, ?)',
                            [userId, email, hashedPassword, tipo_autenticacion],
                            (err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        console.error('Error al insertar autenticación:', err);
                                        res.status(500).json({ message: 'Error al registrar usuario' });
                                    });
                                }
                                
                                // Confirmar la transacción
                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            console.error('Error al confirmar transacción:', err);
                                            res.status(500).json({ message: 'Error al registrar usuario' });
                                        });
                                    }
                                    
                                    res.status(201).json({ 
                                        message: 'Usuario registrado exitosamente',
                                        userId
                                    });
                                });
                            }
                        );
                    }
                );
            });
            
        });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Controlador para cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy();
    res.json({ message: 'Sesión cerrada correctamente' });
};