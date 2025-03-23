const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../../database/database');

// Configurar multer para la subida de archivos
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '../../uploads/avatars');
        
        // Crear directorio si no existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'avatar-' + uniqueSuffix + ext);
    }
});

// Filtrar tipos de archivos permitidos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF).'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máximo
    }
});

// Ruta para registrar un nuevo usuario
router.post('/register', upload.single('avatar'), async (req, res) => {
    try {
        const { 
            fullName, 
            email, 
            birthDate, 
            gender, 
            nationality, 
            username, 
            password 
        } = req.body;
        
        // Validar campos requeridos
        if (!fullName || !email || !birthDate || !gender || !username || !password) {
            // Si se subió un archivo, eliminarlo
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            
            return res.status(400).json({ message: 'Todos los campos obligatorios son requeridos' });
        }
        
        // Verificar si el correo ya existe
        db.query('SELECT * FROM autenticacion WHERE correo = ?', [email], async (err, results) => {
            if (err) {
                console.error('Error al verificar correo:', err);
                
                // Si se subió un archivo, eliminarlo
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                
                return res.status(500).json({ message: 'Error del servidor' });
            }
            
            if (results.length > 0) {
                // Si se subió un archivo, eliminarlo
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                
                return res.status(400).json({ message: 'Este correo ya está registrado' });
            }
            
            // Verificar si el nombre de usuario ya existe
            db.query('SELECT * FROM Usuario WHERE nombre = ?', [username], async (err, results) => {
                if (err) {
                    console.error('Error al verificar nombre de usuario:', err);
                    
                    // Si se subió un archivo, eliminarlo
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                    
                    return res.status(500).json({ message: 'Error del servidor' });
                }
                
                if (results.length > 0) {
                    // Si se subió un archivo, eliminarlo
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                    
                    return res.status(400).json({ message: 'Este nombre de usuario ya está en uso' });
                }
                
                // Generar hash de la contraseña
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                
                // Ruta del avatar (si se subió)
                const avatarPath = req.file ? '/uploads/avatars/' + req.file.filename : null;
                
                // Iniciar transacción para insertar usuario y autenticación
                db.beginTransaction(async (err) => {
                    if (err) {
                        console.error('Error al iniciar transacción:', err);
                        
                        // Si se subió un archivo, eliminarlo
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        
                        return res.status(500).json({ message: 'Error del servidor' });
                    }
                    
                    // Insertar en la tabla Usuario
                    db.query(
                        'INSERT INTO Usuario (nombre, fecha_registro, id_rol) VALUES (?, NOW(), 1)', 
                        [username], 
                        (err, result) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Error al insertar usuario:', err);
                                    
                                    // Si se subió un archivo, eliminarlo
                                    if (req.file) {
                                        fs.unlinkSync(req.file.path);
                                    }
                                    
                                    res.status(500).json({ message: 'Error al registrar usuario' });
                                });
                            }
                            
                            const userId = result.insertId;
                            
                            // Insertar en la tabla autenticacion
                            db.query(
                                'INSERT INTO autenticacion (id_usuario, correo, contrasena_hash, fecha_nacimiento, genero, nacionalidad, tipo_autenticacion) VALUES (?, ?, ?, ?, ?, ?, ?)',
                                [userId, email, hashedPassword, birthDate, gender, nationality, 'normal'],
                                (err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            console.error('Error al insertar autenticación:', err);
                                            
                                            // Si se subió un archivo, eliminarlo
                                            if (req.file) {
                                                fs.unlinkSync(req.file.path);
                                            }
                                            
                                            res.status(500).json({ message: 'Error al registrar usuario' });
                                        });
                                    }
                                    
                                    // Registrar en la bitácora
                                    db.query(
                                        'INSERT INTO Bitacora_Auditoria (id_usuario, accion, fecha) VALUES (?, ?, NOW())',
                                        [userId, 'Usuario registrado'],
                                        (err) => {
                                            if (err) {
                                                console.error('Error al registrar en bitácora:', err);
                                                // No interrumpimos el flujo por un error en la bitácora
                                            }
                                            
                                            // Confirmar la transacción
                                            db.commit((err) => {
                                                if (err) {
                                                    return db.rollback(() => {
                                                        console.error('Error al confirmar transacción:', err);
                                                        
                                                        // Si se subió un archivo, eliminarlo
                                                        if (req.file) {
                                                            fs.unlinkSync(req.file.path);
                                                        }
                                                        
                                                        res.status(500).json({ message: 'Error al registrar usuario' });
                                                    });
                                                }
                                                
                                                res.status(201).json({ 
                                                    message: 'Usuario registrado exitosamente',
                                                    userId,
                                                    avatarPath
                                                });
                                            });
                                        }
                                    );
                                }
                            );
                        }
                    );
                });
            });
        });
    } catch (error) {
        console.error('Error en el registro:', error);
        
        // Si se subió un archivo, eliminarlo
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ message: 'Error del servidor' });
    }
});

module.exports = router;