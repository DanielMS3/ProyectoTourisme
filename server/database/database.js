const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'tourismedb2025.mysql.database.azure.com',
    user: 'usuario',
    password: 'Alskdjfhg00*',
    database: 'tourisme_db',
    ssl: {
        rejectUnauthorized: true
    }
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;
