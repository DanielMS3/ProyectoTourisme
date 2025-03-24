require('dotenv').config(); // Carga variables de entorno desde .env
const mysql = require('mysql2'); // Usa mysql2 en lugar de mysql

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a MySQL exitosa');

    // Consulta de prueba de conexión
    db.query('SELECT 1 + 1 AS resultado', (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta de prueba:', error);
            return;
        }
        console.log('Resultado de la consulta de prueba:', results[0].resultado);
    });
});

module.exports = db;

