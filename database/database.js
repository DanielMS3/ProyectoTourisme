require('dotenv').config(); //carga las variables de  entorno desde .env
const mysql = require('mysql');

const db = mysql.createConnection({  //crea una conexión a la base de datos
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => { //intenta conectar y muestra mensaje en la terminal
    if (err){
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a MySQL exitosa');
    
});

module.exports = db; // exporta la conexión para usarla en otros archivos