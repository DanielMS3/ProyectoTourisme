// Cargar las variables de entorno
require('dotenv').config();

// Importar mysql2
const mysql = require('mysql2');

// Configurar SSL correctamente
const sslConfig = process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false;

// Crear conexión con MySQL en Azure
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: sslConfig  // Aplicar la configuración SSL corregida
}).promise();

// Probar la conexión
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos: ', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL en Azure');
});

module.exports = connection;
