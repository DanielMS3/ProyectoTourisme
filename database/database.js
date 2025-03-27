const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1020108889',
    database: 'tourisme'
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }
    console.log('Conexión a MySQL exitosa');
    
    // Realizar una consulta de prueba
    connection.query('SELECT 1 + 1 AS result', (err, results) => {
        if (err) {
            console.error('Error en la consulta de prueba:', err);
            return;
        }
        console.log('Resultado de la consulta de prueba:', results[0].result);
    });
});

module.exports = connection;