const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const db = require('../database/database.js');
const multer = require('multer');

// Asegúrate de que la carpeta de uploads exista
const uploadDir = path.join(__dirname, '../../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Carpeta de avatares creada:', uploadDir);
}

// Configuración para almacenar avatares
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'avatar-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
    fileFilter: function(req, file, cb) {
        // Aceptar solo imágenes
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Solo se permiten archivos de imagen'), false);
        }
        cb(null, true);
    }
}).single('avatar');

// Función para manejar el registro de usuarios
exports.register = (req, res) => {
    console.log('Iniciando proceso de registro');
    
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            console.error('Error de Multer:', err);
            return res.status(400).json({ message: 'Error al subir la imagen: ' + err.message });
        } else if (err) {
            console.error('Error general:', err);
            return res.status(400).json({ message: 'Error: ' + err.message });
        }

        try {
            // Extraer datos del formulario
            console.log('Datos recibidos:', req.body);
            
            const fullName = req.body.fullName;
            const email = req.body.email;
            const birthDate = req.body.birthDate;
            const gender = req.body.gender;
            const nationality = req.body.nationality || null;
            const password = req.body.password;
            
            console.log('Datos procesados:', {
                fullName, email, birthDate, gender, nationality
            });
            
            // Validar datos
            if (!fullName || !email || !birthDate || !gender || !password) {
                console.error('Faltan campos obligatorios');
                return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados' });
            }

            // Verificar si el correo ya está registrado
            db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (error, results) => {
                if (error) {
                    console.error('Error en la consulta:', error);
                    return res.status(500).json({ message: 'Error en el servidor' });
                }

                if (results.length > 0) {
                    console.log('Email ya registrado');
                    return res.status(400).json({ message: 'Este correo electrónico ya está registrado' });
                }

                try {
                    // Encriptar la contraseña
                    const hashedPassword = await bcrypt.hash(password, 10);
                    console.log('Contraseña encriptada');
                    
                    // Ruta del avatar (si se subió uno)
                    let avatarPath = null;
                    if (req.file) {
                        avatarPath = req.file.path.replace(/\\/g, '/'); // Normalizar la ruta para la base de datos
                        console.log('Avatar subido:', avatarPath);
                    }

                    // Insertar usuario en la base de datos
                    const userData = {
                        nombre_completo: fullName,
                        email: email,
                        fecha_nacimiento: birthDate,
                        genero: gender,
                        nacionalidad: nationality,
                        password: hashedPassword,
                        avatar: avatarPath,
                        fecha_registro: new Date()
                    };

                    console.log('Insertando usuario en la base de datos');
                    db.query('INSERT INTO usuarios SET ?', userData, (error, results) => {
                        if (error) {
                            console.error('Error al insertar usuario:', error);
                            return res.status(500).json({ message: 'Error al registrar usuario: ' + error.message });
                        }

                        console.log('Usuario registrado exitosamente');
                        return res.status(201).json({ 
                            message: 'Usuario registrado exitosamente',
                            userId: results.insertId
                        });
                    });
                } catch (hashError) {
                    console.error('Error al encriptar la contraseña:', hashError);
                    return res.status(500).json({ message: 'Error al procesar la contraseña' });
                }
            });
        } catch (error) {
            console.error('Error en el registro:', error);
            return res.status(500).json({ message: 'Error en el servidor: ' + error.message });
        }
    });
};

// Función para manejar el inicio de sesión
exports.login = (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Intento de login:', email);

        // Validar datos
        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, proporcione correo y contraseña' });
        }

        // Buscar usuario por email
        db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.error('Error en la consulta:', error);
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Credenciales incorrectas' });
            }

            const user = results[0];

            // Verificar contraseña
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Credenciales incorrectas' });
            }

            // Crear sesión de usuario
            req.session.user = {
                id: user.id,
                email: user.email,
                nombre: user.nombre_completo
            };

            console.log('Login exitoso:', user.email);
            return res.status(200).json({ 
                message: 'Inicio de sesión exitoso',
                user: {
                    id: user.id,
                    email: user.email,
                    nombre: user.nombre_completo,
                    avatar: user.avatar
                }
            });
        });
    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Función para cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid'); // Limpiar cookie de sesión
        return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    });
};