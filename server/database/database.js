// cargar variables de entorno
require('dotenv').config();

// cargar dependencias
const mysql = require('mysql2');

// configuración del SSL 
const sslConfig = process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false;

// crear conexion con la base de datos
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL
});

// conexion.connect();
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        return;
    } else {
        console.log('Conexión establecida con éxito a la base de datos con Azure');
    }
});
// exportar conexion
module.exports = conexion;