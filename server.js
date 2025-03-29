const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configuración
app.set('port', process.env.PORT || 3000);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Conexión a la base de datos
const connection = require('./server/database/database');

// Rutas
const routes = require('./server/routes/index');
app.use('/api', routes);

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});
