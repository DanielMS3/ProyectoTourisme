const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // <-- nuevo
const connection = require('./server/database/database');
const registroRouter = require('./server/routes/registro_conexion');
const rutaLogin = require('./server/routes/login_conexion');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta client
app.use(express.static(path.join(__dirname, 'client')));

// Ruta para el registro
app.use('/registro_conexion', registroRouter);

app.use('/api/login', rutaLogin);

// Ruta principal para mostrar el formulario
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'registro.html'));
});

module.exports = app;

