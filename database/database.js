require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err){
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a MySQL exitosa');
    
});

module.exports = db;