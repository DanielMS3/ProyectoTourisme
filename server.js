const express = require('express');
const path = require('path');
const app = express();

// Configuración
app.set('port', process.env.PORT || 3000);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Conexión a la base de datos
require('./server/database/database.js');

// Rutas
const routes = require('./server/routes/index');
app.use('/', routes);

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});
