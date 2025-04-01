const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.register = async (req, res) => {
    try {
        // Extraer datos del formulario
        console.log('Datos recibidos:', req.body);

        const { correo, contrasena_hash, fecha_nacimiento, genero, nacionalidad, nombre, rol } = req.body;

        // Ahora se incluyen todos los campos necesarios, incluyendo el campo 'nombre'
        console.log('Datos procesados:', {
            correo, contrasena_hash, fecha_nacimiento, genero, nacionalidad, nombre, rol
        });

        // Validar datos obligatorios
        if (!correo || !contrasena_hash || !fecha_nacimiento || !genero || !nacionalidad || !nombre || !rol) {
            console.error('Faltan campos obligatorios');
            return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados' });
        }

        // Verificar si el correo ya está registrado
        db.query('SELECT * FROM usuario WHERE correo = ?', [correo], async (error, results) => {
            if (error) {
                console.error('Error en la consulta:', error);
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.length > 0) {
                console.log('El correo ya está registrado');
                return res.status(400).json({ message: 'Este correo electrónico ya está registrado' });
            }

            try {
                // Encriptar la contraseña
                const contrasenaHash = await bcrypt.hash(contrasena_hash, 10);  
                console.log('Contraseña encriptada');

                // Asignar el rol basado en la entrada
                let id_rol;

                if (rol === 'usuario') {
                    id_rol = 1;  // Rol usuario
                } else if (rol === 'negocio') {
                    id_rol = 2;  // Rol negocio
                } else {
                    return res.status(400).json({ message: 'Rol no válido o no permitido' });
                }

                // Insertar usuario en la base de datos
                const datosUsuario = {  
                    correo,  
                    contrasena_hash: contrasenaHash, 
                    fecha_nacimiento, 
                    genero, 
                    nacionalidad,
                    nombre, // Ahora sí está incluido el campo nombre
                    id_rol,  // Se guarda el id_rol basado en el valor del frontend
                    fecha_registro: new Date() 
                };

                console.log('Insertando usuario en la base de datos...');
                db.query('INSERT INTO usuario SET ?', datosUsuario, (error, results) => {
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
};
