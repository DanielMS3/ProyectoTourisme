const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '8836',
    database: 'tourisme'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
});

// Insertar usuario
function insertarUsuario(nombre, correo, fecha_nacimiento, genero, nacionalidad, contrasena_hash, id_google, id_rol, callback) {
    const sql = `CALL insertat_usuario(?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [nombre, correo, fecha_nacimiento, genero, nacionalidad, contrasena_hash, id_google, id_rol], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

// Consultar usuario por ID
function consultarUsuarioPorId(id_usuario, callback) {
    const sql = `CALL consultar_usuario_id(?)`;
    connection.query(sql, [id_usuario], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

// Consultar usuarios en general
function consultarUsuarios(callback) {
    const sql = `CALL consultar_usuarios()`;
    connection.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

// Actualizar usuario
function actualizarUsuario(id_usuario, nombre, correo, fecha_nacimiento, genero, nacionalidad, contrasena_hash, id_google, id_rol, callback) {
    const sql = `CALL actualizar_usuario(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [id_usuario, nombre, correo, fecha_nacimiento, genero, nacionalidad, contrasena_hash, id_google, id_rol], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

// Eliminar usuario
function eliminarUsuario(id_usuario, callback) {
    const sql = `CALL eliminar_usuario(?)`;
    connection.query(sql, [id_usuario], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

module.exports = {
    insertarUsuario,
    consultarUsuarioPorId,
    consultarUsuarios,
    actualizarUsuario,
    eliminarUsuario
};